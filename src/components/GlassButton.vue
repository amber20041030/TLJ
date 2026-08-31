<script setup>
defineProps({ label: String });
</script>
<template>
  <button class="glass-button" type="button" :aria-label="label">
    <slot />
  </button>
</template>
