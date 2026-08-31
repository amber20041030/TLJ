<script setup>
import { ref, reactive, watch } from "vue";
import { X, UserRound, RotateCcw, LogOut, Save } from "lucide-vue-next";
import { state, roleName, formatDate, resetDemo } from "../store.js";
import ConfirmDialog from "./ConfirmDialog.vue";
const props = defineProps({ open: Boolean }),
  emit = defineEmits(["close", "logout"]),
  editing = ref(false),
  confirm = ref(false),
  form = reactive({});
watch(
  () => props.open,
  (v) => {
    if (v) Object.assign(form, state.user);
  },
);
function save() {
  Object.assign(state.user, form);
  editing.value = false;
}
function logout() {
  state.loggedIn = false;
  confirm.value = false;
  emit("logout");
}
</script>
<template>
  <div v-if="open" class="drawer-layer" @click.self="$emit('close')">
    <aside class="drawer">
      <header>
        <small>MEMBER PROFILE</small
        ><button @click="$emit('close')"><X /></button>
      </header>
      <div class="avatar">{{ state.user.name.slice(0, 1) }}</div>
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
        ><button
          @click="
            resetDemo();
            $emit('close');
          "
        >
          <RotateCcw />重設 Demo 資料<span>›</span></button
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
