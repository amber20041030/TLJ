<script setup>
import { Settings, MessageCircle } from "lucide-vue-next";
import GlassButton from "./GlassButton.vue";
defineProps({ name: String, unread: Number });
defineEmits(["settings", "messages"]);
</script>
<template>
  <header class="app-header">
    <GlassButton label="設定" @click="$emit('settings')"
      ><Settings
    /></GlassButton>
    <div>
      <small>GOOD DAY</small>
      <h3>歡迎{{ name }}～</h3>
    </div>
    <GlassButton label="訊息" class="unread" @click="$emit('messages')"
      ><MessageCircle /><i v-if="unread">{{
        unread > 9 ? "9+" : unread
      }}</i></GlassButton
    >
  </header>
</template>
