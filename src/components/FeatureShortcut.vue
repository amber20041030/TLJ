<script setup>
defineProps({ item: Object });
</script>
<template>
  <router-link class="feature simple-feature" :to="item.path"
    ><img :src="item.image" :alt="item.label" /><b>{{
      item.label
    }}</b></router-link
  >
</template>
