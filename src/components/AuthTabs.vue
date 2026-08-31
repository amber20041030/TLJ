<script setup>
defineProps({ modelValue: String });
defineEmits(["update:modelValue"]);
</script>
<template>
  <div class="segment">
    <button
      :class="{ active: modelValue === 'login' }"
      @click="$emit('update:modelValue', 'login')"
    >
      登入</button
    ><button
      :class="{ active: modelValue === 'register' }"
      @click="$emit('update:modelValue', 'register')"
    >
      註冊
    </button>
  </div>
</template>
