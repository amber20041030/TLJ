<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Share2,
  Heart,
  Bookmark,
  MessageCircle,
  Send,
  MoreHorizontal,
  UserRound,
  CheckCircle2,
  Trash2,
  Edit3,
  Flag,
} from "lucide-vue-next";
import { useFeatureStore } from "../stores/features.js";
import { state } from "../store.js";
import FeatureHeader from "../components/FeatureHeader.vue";
import FavoriteButton from "../components/FavoriteButton.vue";
import CommentItem from "../components/CommentItem.vue";
import ConfirmDialog from "../components/ConfirmDialog.vue";
const route = useRoute(),
  router = useRouter(),
  store = useFeatureStore(),
  text = ref(""),
  reply = ref(null),
  remove = ref(false),
  report = ref(false),
  post = computed(() =>
    store.posts.find((p) => p.id === route.params.id && p.status !== "deleted"),
  ),
  comments = computed(() =>
    store.comments.filter(
      (c) => c.postId === route.params.id && c.status !== "deleted",
    ),
  ),
  top = computed(() => comments.value.filter((c) => !c.parentId)),
  mine = computed(() => post.value?.authorId === "demo-user");
function send() {
  if (!text.value.trim()) return;
  store.addComment(
    post.value.id,
    text.value.trim(),
    reply.value?.id || null,
    reply.value?.authorName || "",
  );
  text.value = "";
  reply.value = null;
}
async function share() {
  if (navigator.share)
    try {
      await navigator.share({
        title: post.value.title,
        text: post.value.excerpt,
        url: location.href,
      });
      return;
    } catch {}
  await navigator.clipboard?.writeText(location.href);
}
function message() {
  router.push(`/chat/${store.ensureChat(post.value.authorName)}`);
}
</script>
<template>
  <main v-if="post" class="feature-page detail-page post-detail">
    <FeatureHeader title="文章詳情" back-to="/discussion"
      ><button class="header-chip icon-only" @click="share"><Share2 /></button
      ><FavoriteButton
        :active="store.postBookmarks.includes(post.id)"
        @toggle="store.togglePostBookmark(post.id)"
    /></FeatureHeader>
    <article class="feature-glass article-body">
      <div class="post-labels">
        <span>{{ post.category }}</span
        ><span v-if="post.postType === 'question'">問題求助</span>
      </div>
      <h1>{{ post.title }}</h1>
      <div class="post-author">
        <div class="avatar tiny">{{ post.authorName.slice(0, 1) }}</div>
        <div>
          <b>{{
            post.isAnonymous
              ? "匿名" + (post.authorType === "guide" ? "導遊" : "領隊")
              : post.authorName
          }}</b
          ><small>專業身分已驗證 · {{ post.createdAt }}</small>
        </div>
      </div>
      <p class="article-content">{{ post.content }}</p>
      <a
        v-if="post.referenceUrl"
        class="safe-link"
        :href="post.referenceUrl"
        target="_blank"
        rel="noopener"
        >安全開啟參考連結</a
      >
      <div class="display-tags">
        <span v-for="t in post.tags">{{ t }}</span>
      </div>
      <div class="article-actions">
        <button
          :class="{ active: post.likedBy.includes('demo-user') }"
          @click="store.togglePostLike(post.id)"
        >
          <Heart
            :fill="post.likedBy.includes('demo-user') ? 'currentColor' : 'none'"
          />{{ post.likedBy.length }}</button
        ><button @click="store.togglePostBookmark(post.id)">
          <Bookmark />收藏</button
        ><button @click="share"><Share2 />分享</button>
      </div>
    </article>
    <section class="author-card feature-glass">
      <div class="avatar">{{ post.authorName.slice(0, 1) }}</div>
      <div>
        <h3>{{ post.authorName }}</h3>
        <p>
          已驗證{{
            post.authorType === "agency"
              ? "旅行社"
              : post.authorType === "guide"
                ? "導遊"
                : "領隊"
          }}
          · 出團 {{ store.profile.tourCount }} 次
        </p>
      </div>
      <router-link v-if="post.authorType !== 'agency'" to="/profile"
        ><UserRound />簡介</router-link
      ><button @click="message"><MessageCircle />訊息</button>
    </section>
    <section class="feature-glass comments-section">
      <div class="section-title row">
        <div>
          <small>COMMENTS</small>
          <h2>留言 {{ comments.length }}</h2>
        </div>
      </div>
      <div v-if="reply" class="replying">
        回覆給 {{ reply.authorName }} <button @click="reply = null">×</button>
      </div>
      <div class="comment-compose">
        <textarea
          v-model="text"
          maxlength="1000"
          rows="3"
          placeholder="加入留言…"
        /><button :disabled="!text.trim()" @click="send"><Send /></button>
      </div>
      <template v-for="c in top"
        ><CommentItem
          :comment="c"
          :best="post.bestAnswerId === c.id"
          :can-best="mine && post.postType === 'question'"
          @reply="reply = c"
          @like="store.toggleCommentLike(c.id)"
          @best="store.setBest(post.id, c.id)" />
        <div class="replies">
          <CommentItem
            v-for="r in comments.filter((x) => x.parentId === c.id)"
            :comment="r"
            @reply="reply = c"
            @like="store.toggleCommentLike(r.id)"
          /></div
      ></template>
    </section>
    <section v-if="mine" class="owner-actions feature-glass">
      <router-link :to="`/discussion/${post.id}/edit`"
        ><Edit3 />編輯文章</router-link
      ><button @click="remove = true"><Trash2 />刪除文章</button>
    </section>
    <button v-else class="report-link" @click="report = true">
      <Flag />檢舉文章</button
    ><ConfirmDialog
      :open="remove"
      title="刪除這篇文章？"
      message="文章將採軟刪除並從列表隱藏。"
      @cancel="remove = false"
      @confirm="
        store.deletePost(post.id);
        router.push('/discussion');
      "
    /><ConfirmDialog
      :open="report"
      title="檢舉這篇文章？"
      message="Demo 將保存檢舉紀錄，但不會傳送給真實管理員。"
      @cancel="report = false"
      @confirm="
        store.report(post.id, '不當內容');
        report = false;
      "
    />
  </main>
  <main v-else class="feature-page">
    <FeatureHeader title="文章不存在" back-to="/discussion" />
    <div class="empty-state">
      <MessageCircle />
      <h2>文章已刪除或不存在</h2>
    </div>
  </main>
</template>
