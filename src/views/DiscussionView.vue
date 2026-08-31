<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import {
  Search,
  Bell,
  PenLine,
  LayoutGrid,
  List,
  BookOpen,
  Check,
  X,
} from "lucide-vue-next";
import { useFeatureStore } from "../stores/features.js";
import FeatureHeader from "../components/FeatureHeader.vue";
import PostCard from "../components/PostCard.vue";
const store = useFeatureStore(),
  router = useRouter(),
  rules = ref(!store.discussion.rulesAccepted),
  notificationsOpen = ref(false),
  categories = [
    "全部",
    "熱門討論",
    "最新文章",
    "帶團經驗",
    "行程情報",
    "景點交通",
    "突發狀況",
    "證照考試",
    "海外情報",
    "工作交流",
    "旅行社專區",
    "我的收藏",
  ],
  visible = computed(() => {
    let a = store.posts.filter((p) => p.status === "published"),
      d = store.discussion,
      q = d.query.trim().toLowerCase();
    if (q)
      a = a.filter((p) =>
        [p.title, p.content, p.authorName, p.region, ...p.tags]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    if (d.category === "我的收藏")
      a = a.filter((p) => store.postBookmarks.includes(p.id));
    else if (!["全部", "熱門討論", "最新文章"].includes(d.category))
      a = a.filter((p) => p.category === d.category);
    if (d.category === "熱門討論" || d.sort === "最熱門")
      a.sort((x, y) => y.views - x.views);
    else if (d.category === "最新文章" || d.sort === "最新")
      a.sort((x, y) => String(y.createdAt).localeCompare(String(x.createdAt)));
    else if (d.sort === "最多收藏")
      a.sort(
        (x, y) =>
          Number(store.postBookmarks.includes(y.id)) -
          Number(store.postBookmarks.includes(x.id)),
      );
    else a.sort((x, y) => Number(y.isPinned) - Number(x.isPinned));
    return a;
  }),
  hot = computed(() =>
    [...store.posts].sort((a, b) => b.views - a.views).slice(0, 4),
  );
function accept() {
  store.discussion.rulesAccepted = true;
  rules.value = false;
}
function openNotification(item) {
  item.read = true;
  notificationsOpen.value = false;
  if (item.target) router.push(item.target);
}
</script>
<template>
  <main class="feature-page discussion-page">
    <FeatureHeader title="交流討論"
      ><button
        class="header-chip icon-only"
        aria-label="通知中心"
        @click="notificationsOpen = true"
      >
        <Bell /><i v-if="store.unreadNotifications" /></button></FeatureHeader
    ><label class="feature-search"
      ><Search /><input
        v-model="store.discussion.query"
        placeholder="搜尋文章、作者或標籤"
    /></label>
    <div class="scroll-tabs">
      <button
        v-for="c in categories"
        :class="{ active: store.discussion.category === c }"
        @click="store.discussion.category = c"
      >
        {{ c }}
      </button>
    </div>
    <section
      v-if="store.discussion.category === '全部' && !store.discussion.query"
      class="featured-strip post-featured"
    >
      <router-link
        v-for="p in hot"
        :to="`/discussion/${p.id}`"
        class="featured-card"
        ><small>本週熱門 · {{ p.category }}</small>
        <h2>{{ p.title }}</h2>
        <p>{{ p.authorName }} · {{ p.views }} 次瀏覽</p></router-link
      >
    </section>
    <div class="list-controls">
      <b>{{ visible.length }} 篇文章</b>
      <div>
        <select v-model="store.discussion.sort">
          <option>推薦</option>
          <option>最新</option>
          <option>最熱門</option>
          <option>最多留言</option>
          <option>最多收藏</option></select
        ><button
          class="view-toggle"
          @click="
            store.discussion.view =
              store.discussion.view === 'card' ? 'list' : 'card'
          "
        >
          <List v-if="store.discussion.view === 'card'" /><LayoutGrid v-else />
        </button>
      </div>
    </div>
    <section class="post-list" :class="store.discussion.view">
      <PostCard
        v-for="p in visible"
        :post="p"
        :bookmarked="store.postBookmarks.includes(p.id)"
        @bookmark="store.togglePostBookmark(p.id)"
      />
      <div v-if="!visible.length" class="empty-state">
        <BookOpen />
        <h2>找不到相關文章</h2>
      </div>
    </section>
    <router-link class="floating-create" to="/discussion/create"
      ><PenLine />我要發文</router-link
    >
    <div
      v-if="notificationsOpen"
      class="modal-layer"
      @click.self="notificationsOpen = false"
    >
      <section class="notification-panel feature-glass">
        <header>
          <div>
            <small>NOTIFICATIONS</small>
            <h2>通知中心</h2>
          </div>
          <button
            class="icon-plain"
            aria-label="關閉"
            @click="notificationsOpen = false"
          >
            <X />
          </button>
        </header>
        <button
          v-if="store.unreadNotifications"
          class="text-action"
          @click="store.markNotificationsRead()"
        >
          全部標為已讀
        </button>
        <button
          v-for="item in store.notifications"
          :key="item.id"
          class="notification-row"
          :class="{ unread: !item.read }"
          @click="openNotification(item)"
        >
          <i />
          <span
            ><b>{{ item.text }}</b
            ><small>{{ item.time }}</small></span
          >
        </button>
        <div v-if="!store.notifications.length" class="empty-state">
          <Bell />
          <p>目前沒有新通知</p>
        </div>
      </section>
    </div>
    <div v-if="rules" class="modal-layer">
      <section class="rules-modal feature-glass">
        <BookOpen /><small>COMMUNITY GUIDELINES</small>
        <h2>交流討論規範</h2>
        <ul>
          <li>尊重其他領隊、導遊及旅行社。</li>
          <li>不可公開旅客個資或證件。</li>
          <li>旅遊資訊發布前請再次確認。</li>
          <li>避免惡意攻擊或騷擾他人。</li>
        </ul>
        <button class="primary" @click="accept"><Check />我已了解</button>
      </section>
    </div>
  </main>
</template>
