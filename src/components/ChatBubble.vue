<script setup>
defineProps({ message: Object });
</script>
<template>
  <div class="bubble-row" :class="message.side">
    <div class="bubble">
      <img v-if="message.image" :src="message.image" /><span
        v-if="message.text"
        >{{ message.text }}</span
      >
    </div>
    <time>{{ message.time }}</time>
  </div>
</template>
