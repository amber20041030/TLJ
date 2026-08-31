<script setup>
import { Flag, MapPinned } from "lucide-vue-next";
defineProps({ modelValue: String, error: String });
defineEmits(["update:modelValue"]);
</script>
<template>
  <div>
    <label class="field-label">選擇您的專業身分</label>
    <div class="roles">
      <button
        type="button"
        :class="{ active: modelValue === 'leader' }"
        @click="$emit('update:modelValue', 'leader')"
      >
        <Flag />領隊<small>帶領旅團走向世界</small></button
      ><button
        type="button"
        :class="{ active: modelValue === 'guide' }"
        @click="$emit('update:modelValue', 'guide')"
      >
        <MapPinned />導遊<small>分享在地深度故事</small>
      </button>
    </div>
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>
