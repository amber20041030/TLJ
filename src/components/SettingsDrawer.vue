<script setup>
import { ref, reactive, watch, onBeforeUnmount } from "vue";
import { X, UserRound, LogOut, Save, Camera, Trash2 } from "lucide-vue-next";
import { state, roleName, formatDate } from "../store.js";
import { useFeatureStore } from "../stores/features.js";
import { saveImage, getImageUrl, deleteImage } from "../utils/imageDb.js";
import ConfirmDialog from "./ConfirmDialog.vue";
const props = defineProps({ open: Boolean }),
  emit = defineEmits(["close", "logout"]),
  featureStore = useFeatureStore(),
  editing = ref(false),
  confirm = ref(false),
  avatarUrl = ref(""),
  avatarBusy = ref(false),
  avatarError = ref(""),
  form = reactive({});
watch(
  [() => props.open, () => featureStore.profile.avatarId],
  async ([open, avatarId]) => {
    if (open) {
      Object.assign(form, state.user);
      await loadAvatar(avatarId);
    }
  },
  { immediate: true },
);
async function loadAvatar(id) {
  if (avatarUrl.value?.startsWith("blob:"))
    URL.revokeObjectURL(avatarUrl.value);
  avatarUrl.value = await getImageUrl(id);
}
async function pickAvatar(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  avatarBusy.value = true;
  avatarError.value = "";
  try {
    const previousId = featureStore.profile.avatarId;
    const avatarId = await saveImage(file);
    featureStore.profile.avatarId = avatarId;
    await loadAvatar(avatarId);
    if (previousId && previousId !== avatarId) await deleteImage(previousId);
  } catch (error) {
    avatarError.value = error.message || "頭貼處理失敗";
  } finally {
    avatarBusy.value = false;
    event.target.value = "";
  }
}
async function removeAvatar() {
  const avatarId = featureStore.profile.avatarId;
  featureStore.profile.avatarId = "";
  await loadAvatar("");
  if (avatarId) await deleteImage(avatarId);
}
function save() {
  Object.assign(state.user, form);
  featureStore.saveProfile({
    ...featureStore.profile,
    name: form.name,
    birthday: form.birthday,
    phone: form.phone,
  });
  editing.value = false;
}
function logout() {
  state.loggedIn = false;
  confirm.value = false;
  emit("logout");
}
onBeforeUnmount(() => {
  if (avatarUrl.value?.startsWith("blob:"))
    URL.revokeObjectURL(avatarUrl.value);
});
</script>
<template>
  <div v-if="open" class="drawer-layer" @click.self="$emit('close')">
    <aside class="drawer">
      <header>
        <small>MEMBER PROFILE</small
        ><button @click="$emit('close')"><X /></button>
      </header>
      <div class="avatar drawer-avatar">
        <img v-if="avatarUrl" :src="avatarUrl" alt="使用者頭貼" />
        <span v-else>{{ state.user.name.slice(0, 1) }}</span>
      </div>
      <h2>{{ state.user.name }}</h2>
      <span class="role-tag">{{ roleName() }}</span>
      <p>{{ state.user.phone }}</p>
      <div class="drawer-period">
        {{ formatDate(state.membership.start) }}－{{
          formatDate(state.membership.end)
        }}
      </div>
      <template v-if="editing"
        ><div class="edit-form">
          <div class="drawer-avatar-editor">
            <label class="drawer-avatar-picker">
              <img v-if="avatarUrl" :src="avatarUrl" alt="目前頭貼" />
              <span v-else>{{ state.user.name.slice(0, 1) }}</span>
              <i><Camera /></i>
              <input
                type="file"
                accept="image/*"
                :disabled="avatarBusy"
                @change="pickAvatar"
              />
            </label>
            <div>
              <b>{{ avatarBusy ? "處理中…" : "修改頭貼" }}</b>
              <small>支援 JPG、PNG，會自動壓縮保存</small>
              <button
                v-if="avatarUrl"
                type="button"
                class="remove-avatar"
                @click="removeAvatar"
              >
                <Trash2 />移除頭貼
              </button>
            </div>
          </div>
          <p v-if="avatarError" class="avatar-error">{{ avatarError }}</p>
          <label>姓名<input v-model="form.name" /></label
          ><label>西元生日<input v-model="form.birthday" type="date" /></label
          ><label>手機號碼<input v-model="form.phone" /></label
          ><label>會員身分<input :value="roleName()" disabled /></label>
          <div class="cert-thumbs">
            <img v-if="state.user.certFront" :src="state.user.certFront" /><img
              v-if="state.user.certBack"
              :src="state.user.certBack"
            /><span v-if="!state.user.certFront">登入會員未保存證照影像</span>
          </div>
          <button class="primary" @click="save"><Save />儲存修改</button>
        </div></template
      >
      <nav v-else>
        <button @click="editing = true">
          <UserRound />基本資料<span>›</span></button
        ><button class="logout" @click="confirm = true">
          <LogOut />登出<span>›</span>
        </button>
      </nav>
    </aside>
    <ConfirmDialog
      :open="confirm"
      title="確定要登出嗎？"
      message="登出後將返回登入／註冊頁，您的 Demo 資料仍會保留。"
      @cancel="confirm = false"
      @confirm="logout"
    />
  </div>
</template>
