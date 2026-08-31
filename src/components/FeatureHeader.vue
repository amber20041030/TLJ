<script setup>
import { ChevronLeft } from "lucide-vue-next";
import { useRouter } from "vue-router";
defineProps({
  title: String,
  backTo: { type: String, default: "/home" },
  eyebrow: { type: String, default: "TRAVEL WORKSPACE" },
});
const router = useRouter();
</script>
<template>
  <header class="feature-header">
    <button aria-label="返回" @click="router.push(backTo)">
      <ChevronLeft />
    </button>
    <div>
      <small>{{ eyebrow }}</small>
      <h1>{{ title }}</h1>
    </div>
    <div class="feature-header-actions"><slot /></div>
  </header>
</template>
