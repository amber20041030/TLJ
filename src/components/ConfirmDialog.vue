<script setup>
defineProps({ open: Boolean, title: String, message: String });
defineEmits(["cancel", "confirm"]);
</script>
<template>
  <div v-if="open" class="modal-layer">
    <div class="confirm glass-panel">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <div>
        <button class="secondary" @click="$emit('cancel')">取消</button
        ><button class="danger" @click="$emit('confirm')">確認</button>
      </div>
    </div>
  </div>
</template>
