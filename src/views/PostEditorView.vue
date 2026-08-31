<script setup>
import { reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Save, Eye, Send, ImagePlus, X } from "lucide-vue-next";
import { useFeatureStore } from "../stores/features.js";
import FeatureHeader from "../components/FeatureHeader.vue";
import { saveImage, getImageUrl } from "../utils/imageDb.js";
const route = useRoute(),
  router = useRouter(),
  store = useFeatureStore(),
  editing = computed(() => !!route.params.id),
  existing = computed(() => store.posts.find((p) => p.id === route.params.id)),
  form = reactive({
    postType: "story",
    category: "帶團經驗",
    title: "",
    content: "",
    region: "",
    tags: [],
    tagInput: "",
    referenceUrl: "",
    allowComments: true,
    isAnonymous: false,
    coverImageId: "",
    coverUrl: "",
  }),
  invalid = computed(
    () =>
      form.title.trim().length < 5 ||
      form.title.trim().length > 60 ||
      form.content.trim().length < 20 ||
      form.content.length > 5000 ||
      !form.category,
  );
onMounted(async () => {
  const source = editing.value ? existing.value : store.discussion.draft;
  if (source) {
    Object.assign(form, source);
    if (source.coverImageId)
      form.coverUrl = await getImageUrl(source.coverImageId);
  }
});
function addTag() {
  const t = form.tagInput.trim().slice(0, 10);
  if (t && !form.tags.includes(t) && form.tags.length < 8) form.tags.push(t);
  form.tagInput = "";
}
async function cover(e) {
  const f = e.target.files[0];
  if (!f) return;
  form.coverImageId = await saveImage(f);
  form.coverUrl = await getImageUrl(form.coverImageId);
}
function data() {
  return {
    postType: form.postType,
    category: form.category,
    title: form.title.trim(),
    content: form.content.trim(),
    excerpt: form.content.trim().slice(0, 90),
    region: form.region,
    tags: [...form.tags],
    referenceUrl: /^https?:\/\//.test(form.referenceUrl)
      ? form.referenceUrl
      : "",
    allowComments: form.allowComments,
    isAnonymous: form.isAnonymous,
    coverImageId: form.coverImageId,
  };
}
function draft() {
  store.saveDraft(data());
  router.push("/my-posts");
}
function publish() {
  if (invalid.value) return;
  const p = store.publishPost(data(), route.params.id);
  router.push(`/discussion/${p.id}`);
}
</script>
<template>
  <main class="feature-page editor-page">
    <FeatureHeader
      :title="editing ? '編輯文章' : '新增文章'"
      back-to="/discussion"
      ><button class="header-chip" @click="draft">
        <Save />草稿
      </button></FeatureHeader
    >
    <section class="feature-glass editor-card">
      <div class="form-grid">
        <label
          >文章類型<select v-model="form.postType">
            <option value="story">經驗分享</option>
            <option value="question">問題求助</option>
            <option value="info">情報分享</option>
          </select></label
        ><label
          >文章分類<select v-model="form.category">
            <option>帶團經驗</option>
            <option>行程情報</option>
            <option>景點交通</option>
            <option>突發狀況</option>
            <option>證照考試</option>
            <option>海外情報</option>
            <option>工作交流</option>
            <option>旅行社專區</option>
          </select></label
        >
      </div>
      <label
        >文章標題<input
          v-model="form.title"
          maxlength="60"
          placeholder="輸入清楚具體的標題"
        /><small>{{ form.title.length }}／60（至少5字）</small></label
      ><label
        >文章內容<textarea
          v-model="form.content"
          maxlength="5000"
          rows="13"
          placeholder="分享您的帶團經驗、情報或問題…"
        ></textarea
        ><small>{{ form.content.length }}／5000（至少20字）</small></label
      ><label
        >國家或地區<input v-model="form.region" placeholder="例如：日本北海道"
      /></label>
      <div class="tag-input">
        <input
          v-model="form.tagInput"
          maxlength="10"
          placeholder="新增標籤"
          @keyup.enter="addTag"
        /><button @click="addTag">加入</button>
      </div>
      <div class="display-tags">
        <button
          v-for="t in form.tags"
          @click="form.tags = form.tags.filter((x) => x !== t)"
        >
          {{ t }} ×
        </button>
      </div>
      <label class="image-drop"
        ><ImagePlus /><span>選擇封面圖片</span
        ><input type="file" accept="image/*" @change="cover" /></label
      ><img
        v-if="form.coverUrl"
        class="editor-cover"
        :src="form.coverUrl"
      /><label
        >參考連結<input
          v-model="form.referenceUrl"
          type="url"
          placeholder="https://"
      /></label>
      <div class="check-list">
        <label
          ><input
            v-model="form.allowComments"
            type="checkbox"
          />開放會員留言</label
        ><label
          ><input v-model="form.isAnonymous" type="checkbox" />匿名發文</label
        >
      </div>
    </section>
    <div class="editor-actions">
      <button class="secondary"><Eye />預覽</button
      ><button class="primary" :disabled="invalid" @click="publish">
        <Send />{{ editing ? "儲存文章" : "確認發布" }}
      </button>
    </div>
  </main>
</template>
