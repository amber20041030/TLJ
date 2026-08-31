<script setup>
import { Bookmark } from "lucide-vue-next";
defineProps({ active: Boolean, label: { type: String, default: "收藏" } });
defineEmits(["toggle"]);
</script>
<template>
  <button
    class="favorite-btn"
    :class="{ active }"
    :aria-label="label"
    @click.stop="$emit('toggle')"
  >
    <Bookmark :fill="active ? 'currentColor' : 'none'" />
  </button>
</template>
