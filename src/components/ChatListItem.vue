<script setup>
defineProps({ chat: Object });
</script>
<template>
  <router-link class="chat-item" :to="`/chat/${chat.id}`"
    ><div class="agency-avatar" :style="{ background: chat.color }">
      {{ chat.abbr }}
    </div>
    <div class="chat-copy">
      <div>
        <b>{{ chat.name }}</b
        ><time>{{ chat.time }}</time>
      </div>
      <p>{{ chat.last }}</p>
    </div>
    <i v-if="chat.unread">{{ chat.unread }}</i></router-link
  >
</template>
