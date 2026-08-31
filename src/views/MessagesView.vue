<script setup>
import { useRouter } from "vue-router";
import { ChevronLeft, Search } from "lucide-vue-next";
import { state } from "../store.js";
import ChatListItem from "../components/ChatListItem.vue";
const router = useRouter();
</script>
<template>
  <main class="messages-page page">
    <div class="simple-head">
      <button @click="router.push('/home')"><ChevronLeft /></button>
      <div>
        <small>TRAVEL AGENCIES</small>
        <h1>訊息</h1>
      </div>
    </div>
    <label class="search"
      ><Search /><input placeholder="搜尋旅行社或訊息"
    /></label>
    <section class="chat-list glass-panel">
      <ChatListItem v-for="c in state.chats" :chat="c" />
    </section>
  </main>
</template>
