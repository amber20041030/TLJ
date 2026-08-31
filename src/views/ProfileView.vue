<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  Edit3,
  Eye,
  Plus,
  Trash2,
  Mail,
  MapPin,
  Phone,
  Languages,
  Plane,
  ShieldCheck,
  ImagePlus,
  Save,
  X,
} from "lucide-vue-next";
import { useFeatureStore } from "../stores/features.js";
import { state, roleName } from "../store.js";
import { saveImage, getImageUrl, deleteImage } from "../utils/imageDb.js";
import FeatureHeader from "../components/FeatureHeader.vue";
import ProfileHeroCard from "../components/ProfileHeroCard.vue";
import TagSelector from "../components/TagSelector.vue";
import ExperienceSheet from "../components/ExperienceSheet.vue";
import PrivacySettings from "../components/PrivacySettings.vue";
import ConfirmDialog from "../components/ConfirmDialog.vue";
const router = useRouter(),
  store = useFeatureStore(),
  mode = ref("view"),
  draft = reactive({
    ...JSON.parse(JSON.stringify(store.profile)),
    name: state.user.name,
    phone: state.user.phone,
    birthday: state.user.birthday,
    role: roleName(),
  }),
  original = ref(""),
  avatarUrl = ref(""),
  galleryUrls = reactive({}),
  expSheet = ref(false),
  editingExp = ref(null),
  deleteExp = ref(null),
  newTag = ref(""),
  notice = ref("");
const styles = [
    "親切活潑",
    "行程掌控",
    "攝影協助",
    "歷史解說",
    "美食推薦",
    "親子帶團",
    "長者照顧",
    "緊急應變",
  ],
  types = [
    "國內旅遊",
    "日本旅遊",
    "韓國旅遊",
    "東南亞旅遊",
    "歐洲旅遊",
    "企業參訪",
    "畢業旅行",
    "員工旅遊",
    "親子旅遊",
    "銀髮旅遊",
  ],
  completion = computed(() => store.profileCompletion),
  editing = computed(() => mode.value === "edit"),
  preview = computed(() => mode.value === "preview"),
  dirty = computed(() => JSON.stringify(draft) !== original.value);
function reset() {
  Object.assign(draft, {
    ...JSON.parse(JSON.stringify(store.profile)),
    name: state.user.name,
    phone: state.user.phone,
    birthday: state.user.birthday,
    role: roleName(),
  });
  original.value = JSON.stringify(draft);
}
function edit() {
  reset();
  mode.value = "edit";
}
function save() {
  if (!/^09\d{8}$/.test(draft.phone)) {
    notice.value = "手機格式不正確";
    return;
  }
  if (draft.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) {
    notice.value = "Email 格式不正確";
    return;
  }
  store.saveProfile(draft);
  original.value = JSON.stringify(draft);
  mode.value = "view";
  notice.value = "個人簡介已保存";
}
async function avatar(e) {
  const f = e.target.files[0];
  if (!f) return;
  try {
    draft.avatarId = await saveImage(f);
    avatarUrl.value = await getImageUrl(draft.avatarId);
  } catch (err) {
    notice.value = err.message || "圖片處理失敗";
  }
}
async function gallery(e) {
  for (const f of [...e.target.files].slice(0, 12 - draft.gallery.length)) {
    try {
      const id = await saveImage(f);
      draft.gallery.push({ id, caption: "" });
      galleryUrls[id] = await getImageUrl(id);
    } catch (err) {
      notice.value = err.message;
    }
  }
}
async function removeGallery(id) {
  await deleteImage(id);
  draft.gallery = draft.gallery.filter((x) => x.id !== id);
  delete galleryUrls[id];
}
function addTag() {
  const t = newTag.value.trim().slice(0, 10);
  if (t && !draft.tags.includes(t) && draft.tags.length < 8) draft.tags.push(t);
  newTag.value = "";
}
function saveExp(e) {
  const i = draft.experiences.findIndex((x) => x.id === e.id);
  i >= 0 ? draft.experiences.splice(i, 1, e) : draft.experiences.push(e);
  expSheet.value = false;
}
async function loadImages() {
  avatarUrl.value = await getImageUrl(store.profile.avatarId);
  for (const g of store.profile.gallery || [])
    galleryUrls[g.id] = await getImageUrl(g.id);
}
function invite() {
  const id = store.ensureChat("星辰國際旅行社");
  router.push(`/chat/${id}`);
}
onMounted(() => {
  reset();
  loadImages();
});
</script>
<template>
  <main class="feature-page profile-page">
    <FeatureHeader title="個人簡介"
      ><button
        v-if="mode === 'view'"
        class="header-chip"
        @click="mode = 'preview'"
      >
        <Eye />預覽</button
      ><button v-if="mode === 'view'" class="header-chip" @click="edit">
        <Edit3 />編輯</button
      ><button v-if="preview" class="header-chip" @click="mode = 'view'">
        <X />結束預覽
      </button></FeatureHeader
    >
    <div v-if="notice" class="inline-toast" @click="notice = ''">
      {{ notice }}
    </div>
    <ProfileHeroCard
      :name="draft.name"
      :role="draft.role"
      :tour-count="draft.tourCount"
      :completion="completion"
      :avatar="avatarUrl"
      :editing="editing"
      @avatar="avatar"
    />
    <section class="feature-glass section-card">
      <div class="section-title">
        <small>BASIC INFORMATION</small>
        <h2>基本資料</h2>
      </div>
      <div v-if="editing" class="feature-form">
        <label>姓名<input v-model="draft.name" /></label
        ><label>身分<input v-model="draft.role" disabled /></label>
        <div class="form-grid">
          <label>西元生日<input v-model="draft.birthday" type="date" /></label
          ><label>手機號碼<input v-model="draft.phone" /></label>
        </div>
        <label>Email<input v-model="draft.email" type="email" /></label
        ><label
          >居住地區<select v-model="draft.region">
            <option>台北市</option>
            <option>新北市</option>
            <option>桃園市</option>
            <option>台中市</option>
            <option>高雄市</option>
          </select></label
        ><label
          >使用語言<input v-model="draft.languages" placeholder="以逗號分隔"
        /></label>
      </div>
      <div v-else class="info-list">
        <p>
          <Phone />{{
            preview && !draft.privacy.phone ? "09••••••••" : draft.phone
          }}
        </p>
        <p>
          <Mail />{{
            preview && !draft.privacy.email ? "••••@••••.com" : draft.email
          }}
        </p>
        <p>
          <MapPin />{{
            preview && !draft.privacy.region ? "未公開" : draft.region
          }}
        </p>
        <p>
          <Languages />{{
            Array.isArray(draft.languages)
              ? draft.languages.join("、")
              : draft.languages
          }}
        </p>
        <p><Plane />已完成 {{ draft.tourCount }} 次帶團</p>
      </div>
    </section>
    <section class="feature-glass section-card">
      <div class="section-title">
        <small>ABOUT ME</small>
        <h2>關於我</h2>
      </div>
      <template v-if="editing"
        ><label class="block-label"
          >自我介紹<textarea
            v-model="draft.bio"
            maxlength="500"
            rows="5"
          /><small>{{ draft.bio.length }}／500</small></label
        >
        <h3>帶團特色</h3>
        <TagSelector v-model="draft.styles" :options="styles" :max="6" />
        <h3>擅長旅遊類型</h3>
        <TagSelector v-model="draft.travelTypes" :options="types" />
        <div class="tag-input">
          <input
            v-model="newTag"
            maxlength="10"
            placeholder="新增個人標籤"
            @keyup.enter="addTag"
          /><button @click="addTag"><Plus /></button></div></template
      ><template v-else
        ><p class="body-copy">{{ draft.bio }}</p>
        <div class="display-tags">
          <span v-for="t in draft.styles">{{ t }}</span>
        </div>
        <h3>擅長旅遊類型</h3>
        <div class="display-tags">
          <span v-for="t in draft.travelTypes">{{ t }}</span>
        </div></template
      >
    </section>
    <section
      v-if="!preview || draft.privacy.experiences"
      class="section-card feature-glass"
    >
      <div class="section-title row">
        <div>
          <small>EXPERIENCE</small>
          <h2>帶團經歷</h2>
        </div>
        <button
          v-if="editing"
          class="round-add"
          @click="
            editingExp = null;
            expSheet = true;
          "
        >
          <Plus />
        </button>
      </div>
      <article
        v-for="e in [...draft.experiences].sort((a, b) =>
          b.start.localeCompare(a.start),
        )"
        class="experience-card"
      >
        <div>
          <small>{{ e.start }}－{{ e.end }}</small>
          <h3>{{ e.name }}</h3>
          <p>{{ e.agency }} · {{ e.region }} · {{ e.people }}人</p>
          <p>{{ e.description }}</p>
        </div>
        <div v-if="editing" class="item-actions">
          <button
            @click="
              editingExp = e;
              expSheet = true;
            "
          >
            <Edit3 /></button
          ><button @click="deleteExp = e"><Trash2 /></button>
        </div>
      </article>
    </section>
    <section
      v-if="!preview || draft.privacy.gallery"
      class="section-card feature-glass"
    >
      <div class="section-title row">
        <div>
          <small>TOUR GALLERY</small>
          <h2>帶團相簿</h2>
        </div>
        <label v-if="editing" class="round-add"
          ><ImagePlus /><input
            type="file"
            accept="image/*"
            multiple
            @change="gallery"
        /></label>
      </div>
      <div v-if="draft.gallery.length" class="gallery-grid">
        <figure v-for="(g, i) in draft.gallery">
          <img :src="galleryUrls[g.id]" />
          <figcaption>{{ i === 0 ? "封面" : "" }} {{ g.caption }}</figcaption>
          <button v-if="editing" @click="removeGallery(g.id)">
            <Trash2 />
          </button>
        </figure>
      </div>
      <p v-else class="empty-copy">尚未新增帶團照片</p>
    </section>
    <section class="section-card feature-glass">
      <div class="section-title">
        <small>CREDENTIALS</small>
        <h2>證照與專業資格</h2>
      </div>
      <div class="certificate-summary">
        <ShieldCheck />
        <div>
          <b>{{ draft.role }}證 · {{ draft.certificateStatus }}</b>
          <p>
            證號 {{ draft.certificateNumber }} · 有效至
            {{ draft.certificateExpiry }}
          </p>
        </div>
      </div>
      <div v-if="!preview" class="certificate-images">
        <img v-if="state.user.certFront" :src="state.user.certFront" /><img
          v-if="state.user.certBack"
          :src="state.user.certBack"
        />
        <p v-if="!state.user.certFront">證照圖片僅本人編輯時可查看</p>
      </div>
      <label v-if="editing" class="block-label"
        >證照說明<textarea
          v-model="draft.certificateNote"
          maxlength="500"
          rows="3"
        />
      </label>
      <p v-else>{{ draft.certificateNote }}</p>
    </section>
    <PrivacySettings
      v-if="!preview"
      v-model="draft.privacy"
      :editing="editing"
    /><button
      v-if="preview && draft.privacy.invite"
      class="primary invite-btn"
      @click="invite"
    >
      邀請合作
    </button>
    <div v-if="editing" class="profile-action-bar">
      <button
        @click="
          reset();
          mode = 'view';
        "
      >
        取消</button
      ><button class="primary" :disabled="!dirty" @click="save">
        <Save />儲存變更
      </button>
    </div>
    <ExperienceSheet
      :open="expSheet"
      :item="editingExp"
      @close="expSheet = false"
      @save="saveExp"
    /><ConfirmDialog
      :open="!!deleteExp"
      title="刪除這筆帶團經歷？"
      message="刪除後無法恢復。"
      @cancel="deleteExp = null"
      @confirm="
        draft.experiences = draft.experiences.filter(
          (x) => x.id !== deleteExp.id,
        );
        deleteExp = null;
      "
    />
  </main>
</template>
