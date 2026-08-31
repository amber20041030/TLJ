<script setup>
import { ref, computed, nextTick, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ChevronLeft, Image, Send } from "lucide-vue-next";
import { state } from "../store.js";
import ChatBubble from "../components/ChatBubble.vue";
const route = useRoute(),
  router = useRouter(),
  chat = computed(() => state.chats.find((c) => c.id === route.params.id)),
  text = ref(""),
  log = ref();
function scroll() {
  nextTick(() =>
    log.value?.scrollTo({ top: log.value.scrollHeight, behavior: "smooth" }),
  );
}
function send(image = "") {
  if (!text.value.trim() && !image) return;
  const time = new Date().toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
  });
  chat.value.messages.push({
    id: Date.now(),
    side: "me",
    text: text.value.trim(),
    image,
    time,
  });
  chat.value.last = text.value.trim() || "傳送了一張圖片";
  chat.value.time = time;
  text.value = "";
  scroll();
}
function pick(e) {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => send(r.result);
  r.readAsDataURL(f);
}
onMounted(() => {
  if (!chat.value) return router.replace("/messages");
  chat.value.unread = 0;
  scroll();
});
</script>
<template>
  <main v-if="chat" class="chat-page">
    <header class="chat-head">
      <button @click="router.push('/messages')"><ChevronLeft /></button>
      <div class="agency-avatar" :style="{ background: chat.color }">
        {{ chat.abbr }}
      </div>
      <div>
        <h1>{{ chat.name }}</h1>
        <small>旅行社 · 通常很快回覆</small>
      </div>
    </header>
    <section class="chat-log" ref="log">
      <div class="day-divider"><span>今天</span></div>
      <ChatBubble v-for="m in chat.messages" :message="m" />
    </section>
    <form class="composer" @submit.prevent="send()">
      <label
        ><Image /><input type="file" accept="image/*" @change="pick" /></label
      ><input v-model="text" placeholder="輸入訊息…" /><button><Send /></button>
    </form>
  </main>
</template>
