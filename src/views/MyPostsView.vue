<script setup>
import { ref, computed } from "vue";
import { PenLine, Bookmark, FileText } from "lucide-vue-next";
import { useFeatureStore } from "../stores/features.js";
import FeatureHeader from "../components/FeatureHeader.vue";
import PostCard from "../components/PostCard.vue";
const store = useFeatureStore(),
  tab = ref("已發布"),
  tabs = ["已發布", "草稿", "已收藏", "留言紀錄"],
  posts = computed(() =>
    tab.value === "已收藏"
      ? store.posts.filter((p) => store.postBookmarks.includes(p.id))
      : store.posts.filter(
          (p) => p.authorId === "demo-user" && p.status === "published",
        ),
  );
</script>
<template>
  <main class="feature-page">
    <FeatureHeader title="我的文章" back-to="/discussion" />
    <div class="scroll-tabs">
      <button v-for="t in tabs" :class="{ active: tab === t }" @click="tab = t">
        {{ t }}
      </button>
    </div>
    <section v-if="tab === '草稿'" class="feature-glass draft-card">
      <FileText />
      <div v-if="store.discussion.draft">
        <h2>{{ store.discussion.draft.title || "未命名草稿" }}</h2>
        <p>最後編輯：{{ store.discussion.draft.updatedAt }}</p>
        <router-link class="primary" to="/discussion/create"
          >繼續編輯</router-link
        >
      </div>
      <p v-else>目前沒有草稿</p>
    </section>
    <section v-else-if="tab === '留言紀錄'" class="record-list">
      <article
        v-for="c in store.comments.filter((c) => c.authorId === 'demo-user')"
        class="record-card feature-glass"
      >
        <p>{{ c.content }}</p>
        <router-link :to="`/discussion/${c.postId}`">查看文章</router-link>
      </article>
      <div
        v-if="!store.comments.some((c) => c.authorId === 'demo-user')"
        class="empty-state"
      >
        <PenLine />
        <h2>尚無留言紀錄</h2>
      </div>
    </section>
    <section v-else class="post-list">
      <PostCard
        v-for="p in posts"
        :post="p"
        :bookmarked="store.postBookmarks.includes(p.id)"
        @bookmark="store.togglePostBookmark(p.id)"
      />
    </section>
  </main>
</template>
