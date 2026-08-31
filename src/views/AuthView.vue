<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useRouter } from "vue-router";
import {
  UserRound,
  CalendarDays,
  Smartphone,
  ArrowRight,
} from "lucide-vue-next";
import AppBanner from "../components/AppBanner.vue";
import AuthTabs from "../components/AuthTabs.vue";
import RoleSelector from "../components/RoleSelector.vue";
import CertificateCamera from "../components/CertificateCamera.vue";
import { state } from "../store.js";
const router = useRouter(),
  mode = ref("login"),
  form = reactive({ ...state.user }),
  errors = reactive({});
const blank = () => ({
  name: "",
  birthday: "",
  phone: "",
  role: "",
  certFront: "",
  certBack: "",
});
const certLabel = computed(() =>
  form.role === "guide" ? "導遊證照" : "領隊證照",
);
watch(mode, (value) => {
  Object.keys(errors).forEach((k) => delete errors[k]);
  Object.assign(form, value === "register" ? blank() : { ...state.user });
});
function validate() {
  Object.keys(errors).forEach((k) => delete errors[k]);
  if (mode.value === "register" && !form.role) errors.role = "請先選擇身分";
  if (!form.name.trim()) errors.name = "請輸入姓名";
  if (!form.birthday) errors.birthday = "請選擇西元生日";
  if (!/^09\d{8}$/.test(form.phone))
    errors.phone = "請輸入 09 開頭的 10 碼手機號碼";
  if (mode.value === "register") {
    if (!form.certFront) errors.certFront = "請拍攝證照正面";
    if (!form.certBack) errors.certBack = "請拍攝證照反面";
  }
  return !Object.keys(errors).length;
}
function submit() {
  if (!validate()) return;
  Object.assign(state.user, form);
  if (mode.value === "login") {
    state.loggedIn = true;
    router.push("/home");
  } else router.push("/payment");
}
</script>
<template>
  <main class="auth page">
    <AppBanner />
    <section class="auth-title">
      <small>EXCLUSIVE FOR TRAVEL PROFESSIONALS</small>
      <h1><em>領隊</em><i>導遊</i> <span>帶團專區</span></h1>
      <p>讓每趟旅程，都從從容安排開始。</p>
    </section>
    <section class="auth-card glass-panel">
      <AuthTabs v-model="mode" /><RoleSelector
        v-if="mode === 'register'"
        v-model="form.role"
        :error="errors.role"
      />
      <form @submit.prevent="submit">
        <label
          ><span><UserRound />姓名</span
          ><input v-model="form.name" placeholder="請輸入真實姓名" /><small
            v-if="errors.name"
            class="error"
            >{{ errors.name }}</small
          ></label
        ><label
          ><span><CalendarDays />西元生日</span
          ><input v-model="form.birthday" type="date" /><small
            v-if="errors.birthday"
            class="error"
            >{{ errors.birthday }}</small
          ></label
        ><label
          ><span><Smartphone />手機號碼</span
          ><input
            v-model="form.phone"
            inputmode="numeric"
            maxlength="10"
            placeholder="09xxxxxxxx"
          /><small v-if="errors.phone" class="error">{{
            errors.phone
          }}</small></label
        >
        <div v-if="mode === 'register'" class="cert-section">
          <h3>證照驗證</h3>
          <p>僅供前端 Demo 預覽，不會上傳伺服器。</p>
          <div class="cert-grid">
            <div>
              <CertificateCamera
                v-model="form.certFront"
                :label="`${certLabel}正面`"
              /><small v-if="errors.certFront" class="error">{{
                errors.certFront
              }}</small>
            </div>
            <div>
              <CertificateCamera
                v-model="form.certBack"
                :label="`${certLabel}反面`"
              /><small v-if="errors.certBack" class="error">{{
                errors.certBack
              }}</small>
            </div>
          </div>
        </div>
        <button class="primary submit" type="submit">
          {{ mode === "login" ? "登入" : "註冊會員" }}<ArrowRight />
        </button>
      </form>
    </section>
  </main>
</template>
