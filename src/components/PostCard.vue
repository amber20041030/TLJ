<script setup>
import { Eye, Heart, MessageCircle, Bookmark, Pin } from "lucide-vue-next";
defineProps({ post: Object, bookmarked: Boolean });
defineEmits(["bookmark"]);
</script>
<template>
  <article class="post-card feature-glass">
    <router-link :to="`/discussion/${post.id}`"
      ><div class="post-author">
        <div class="avatar tiny">{{ post.authorName.slice(0, 1) }}</div>
        <div>
          <b>{{ post.authorName }}</b
          ><small
            >{{
              post.authorType === "agency"
                ? "旅行社"
                : post.authorType === "guide"
                  ? "導遊"
                  : "領隊"
            }}
            · 已驗證</small
          >
        </div>
        <time>{{ post.createdAt }}</time>
      </div>
      <div class="post-labels">
        <span v-if="post.isPinned"><Pin />置頂</span
        ><span>{{ post.category }}</span
        ><span v-if="post.bestAnswerId">已解決</span>
      </div>
      <h2>{{ post.title }}</h2>
      <p>{{ post.excerpt }}</p>
      <div class="display-tags compact">
        <span v-for="t in post.tags">{{ t }}</span>
      </div></router-link
    >
    <footer>
      <span><Eye />{{ post.views }}</span
      ><span><Heart />{{ post.likedBy.length }}</span
      ><span><MessageCircle />留言</span
      ><button :class="{ active: bookmarked }" @click="$emit('bookmark')">
        <Bookmark :fill="bookmarked ? 'currentColor' : 'none'" />
      </button>
    </footer>
  </article>
</template>
