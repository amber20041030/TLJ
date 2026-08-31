<script setup>
defineProps({ status: String });
</script>
<template>
  <span class="status-badge" :data-status="status"
    ><slot>{{ status }}</slot></span
  >
</template>
