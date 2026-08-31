<script setup>
defineProps({ status: { type: String, default: "idle" } });
defineEmits(["join"]);
const labels = {
  idle: "立即加入",
  reviewing: "審核中",
  joined: "已加入",
  full: "名額已滿",
  closed: "已截止",
};
</script>
<template>
  <button
    class="join-now"
    :disabled="status !== 'idle'"
    @click.stop="$emit('join')"
  >
    {{ labels[status] || status }}
  </button>
</template>
