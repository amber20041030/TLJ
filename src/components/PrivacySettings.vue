<script setup>
defineProps({ modelValue: Object, editing: Boolean });
defineEmits(["update:modelValue"]);
const labels = {
  phone: "公開手機號碼",
  email: "公開 Email",
  birthday: "公開生日",
  region: "公開居住地區",
  experiences: "公開帶團經歷",
  gallery: "公開帶團相簿",
  certificateStatus: "顯示證照審核狀態",
  invite: "接受旅行社工作邀請",
};
</script>
<template>
  <section class="feature-glass section-card">
    <div class="section-title">
      <small>PRIVACY</small>
      <h2>資料顯示設定</h2>
    </div>
    <div class="switch-list">
      <label v-for="(label, key) in labels"
        ><span>{{ label }}</span
        ><input
          type="checkbox"
          :checked="modelValue[key]"
          :disabled="!editing"
          @change="
            $emit('update:modelValue', {
              ...modelValue,
              [key]: $event.target.checked,
            })
          " /><i
      /></label>
    </div>
  </section>
</template>
