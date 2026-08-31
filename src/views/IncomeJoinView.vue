<script setup>
import { reactive, computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Save,
  Send,
  CheckCircle2,
  LoaderCircle,
  UserRound,
} from "lucide-vue-next";
import { useFeatureStore } from "../stores/features.js";
import { state, roleName } from "../store.js";
import FeatureHeader from "../components/FeatureHeader.vue";
const route = useRoute(),
  router = useRouter(),
  store = useFeatureStore(),
  item = computed(() => store.income.find((x) => x.id === route.params.id)),
  confirming = ref(false),
  processing = ref(false),
  success = ref(false),
  form = reactive({
    role: "",
    contact: "",
    experience: "",
    reason: "",
    availability: "",
    portfolio: "",
    extra: "",
    topic: "",
    region: "",
    publicProfile: true,
    correct: false,
    demo: false,
  });
onMounted(() => {
  const d = store.incomeJoins.find(
    (x) => x.opportunityId === route.params.id && x.status === "draft",
  );
  Object.assign(
    form,
    d?.formData || { role: roleName(), contact: state.user.phone },
  );
});
const urlOk = computed(
    () => !form.portfolio || /^https?:\/\//.test(form.portfolio),
  ),
  invalid = computed(
    () =>
      !form.role ||
      !form.contact ||
      form.experience.trim().length < 10 ||
      form.reason.trim().length < 10 ||
      !urlOk.value,
  ),
  confirmInvalid = computed(
    () => !form.correct || !form.publicProfile || !form.demo,
  );
function draft() {
  store.saveIncomeDraft(item.value.id, { ...form });
  router.push("/income-records");
}
function submit() {
  if (invalid.value) return;
  confirming.value = true;
}
function finish() {
  if (confirmInvalid.value) return;
  processing.value = true;
  setTimeout(() => {
    store.joinIncome(item.value.id, { ...form });
    processing.value = false;
    confirming.value = false;
    success.value = true;
  }, 1000);
}
function chat() {
  router.push(`/chat/${store.ensureChat(item.value.partnerName)}`);
}
</script>
<template>
  <main v-if="item" class="feature-page editor-page income-join">
    <FeatureHeader title="加入方案" :back-to="`/income/${item.id}`"
      ><button class="header-chip" @click="draft">
        <Save />草稿
      </button></FeatureHeader
    >
    <section class="profile-mini feature-glass">
      <div class="avatar">{{ state.user.name.slice(0, 1) }}</div>
      <div>
        <small>申請人</small>
        <h2>{{ state.user.name }} · {{ roleName() }}</h2>
        <p>證照已驗證 · 簡介完整度 {{ store.profileCompletion }}%</p>
      </div>
    </section>
    <section class="feature-glass editor-card">
      <div class="section-title">
        <small>{{ item.category }}</small>
        <h2>{{ item.title }}</h2>
        <p>{{ item.partnerName }} · {{ item.reward }}</p>
      </div>
      <label
        >申請身分<select v-model="form.role">
          <option>領隊</option>
          <option>導遊</option>
        </select></label
      ><label>聯絡方式<input v-model="form.contact" /></label
      ><label
        >相關經驗<textarea
          v-model="form.experience"
          maxlength="1000"
          rows="4"
          placeholder="至少10字"
        >
<small>{{ form.experience.length }}／1000</small></textarea></label
      ><label
        >申請原因<textarea
          v-model="form.reason"
          maxlength="500"
          rows="4"
          placeholder="至少10字"
        >
<small>{{ form.reason.length }}／500</small></textarea></label
      ><label
        >可配合時間<input
          v-model="form.availability"
          placeholder="例如：平日晚間、週末" /></label
      ><label
        >作品連結（選填）<input
          v-model="form.portfolio"
          type="url"
          placeholder="https://"
        /><small v-if="!urlOk" class="error"
          >網址需以 http:// 或 https:// 開頭</small
        ></label
      ><template v-if="item.category === '文章投稿'"
        ><label>預計投稿主題<input v-model="form.topic" /></label
        ><label>擅長地區<input v-model="form.region" /></label></template
      ><template v-if="item.category === '影音創作'"
        ><label
          >作品平台<input
            v-model="form.topic"
            placeholder="YouTube、Instagram…" /></label></template
      ><template v-if="item.category === '行程顧問'"
        ><label>擅長國家或地區<input v-model="form.region" /></label></template
      ><label>補充說明<textarea v-model="form.extra" rows="3" /></label
      ><label class="check-line"
        ><input
          v-model="form.publicProfile"
          type="checkbox"
        />同意提供公開個人簡介</label
      >
      <p v-if="store.profileCompletion < 80" class="conflict-alert">
        個人簡介完整度低於80%，補充資料可提高合作單位查看意願。
      </p>
    </section>
    <div class="editor-actions">
      <button class="secondary" @click="draft"><Save />保存草稿</button
      ><button class="primary" :disabled="invalid" @click="submit">
        <Send />下一步確認
      </button>
    </div>
    <div v-if="confirming" class="modal-layer">
      <section class="success-modal feature-glass">
        <h2>確認加入此方案？</h2>
        <p>{{ item.title }}<br />{{ item.category }} · {{ item.reward }}</p>
        <div class="check-list">
          <label
            ><input
              v-model="form.correct"
              type="checkbox"
            />我確認填寫資料正確</label
          ><label
            ><input
              v-model="form.publicProfile"
              type="checkbox"
            />我同意提供公開個人簡介</label
          ><label
            ><input v-model="form.demo" type="checkbox" />我了解此為前端
            Demo，不會產生真實合作或收入</label
          >
        </div>
        <button
          class="primary"
          :disabled="confirmInvalid || processing"
          @click="finish"
        >
          <LoaderCircle v-if="processing" class="spin" />確認送出</button
        ><button class="text-btn" @click="confirming = false">返回修改</button>
      </section>
    </div>
    <div v-if="success" class="modal-layer">
      <section class="success-modal feature-glass">
        <CheckCircle2 /><small>REQUEST SENT</small>
        <h2>加入申請已送出</h2>
        <p>{{ item.title }} · {{ item.partnerName }}</p>
        <router-link class="primary" to="/income-records"
          >查看加入紀錄</router-link
        ><button class="secondary" @click="chat">聯絡合作單位</button
        ><router-link class="text-btn" to="/income">返回額外收入</router-link>
      </section>
    </div>
  </main>
</template>
