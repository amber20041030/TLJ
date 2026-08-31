<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import {
  Search,
  ClipboardList,
  ChevronRight,
  SlidersHorizontal,
  WalletCards,
  X,
  RotateCcw,
} from "lucide-vue-next";
import { useFeatureStore } from "../stores/features.js";
import FeatureHeader from "../components/FeatureHeader.vue";
import EarningSummaryCard from "../components/EarningSummaryCard.vue";
import IncomeOpportunityCard from "../components/IncomeOpportunityCard.vue";
const router = useRouter(),
  store = useFeatureStore(),
  filterOpen = ref(false),
  categories = [
    "全部",
    "熱門推薦",
    "商品推薦",
    "文章投稿",
    "影音創作",
    "行程顧問",
    "體驗任務",
    "線上講師",
    "推薦獎勵",
    "已加入",
  ],
  visible = computed(() => {
    let a = [...store.income],
      f = store.incomeFilters,
      q = f.query.trim().toLowerCase();
    if (q)
      a = a.filter((x) =>
        [x.title, x.partnerName, x.category, x.summary, ...x.tags]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    if (f.category === "熱門推薦") a = a.filter((x) => x.featured);
    else if (f.category === "已加入")
      a = a.filter((x) =>
        store.incomeJoins.some(
          (j) => j.opportunityId === x.id && j.status !== "draft",
        ),
      );
    else if (f.category !== "全部")
      a = a.filter((x) => x.category === f.category);
    if (f.workMode && f.workMode !== "全部")
      a = a.filter(
        (x) => x.workMode === f.workMode || x.workMode === "不限地點",
      );
    if (f.rewardKeyword)
      a = a.filter((x) => x.reward.includes(f.rewardKeyword));
    if (f.sort === "即將截止")
      a.sort((x, y) => String(x.deadline).localeCompare(String(y.deadline)));
    else if (f.sort === "熱門優先")
      a.sort((x, y) => Number(y.featured) - Number(x.featured));
    return a;
  }),
  featured = computed(() => store.income.filter((x) => x.featured));
function status(id) {
  return store.incomeJoins.find((j) => j.opportunityId === id)?.status;
}
function join(item) {
  router.push(`/income/${item.id}/join`);
}
function resetFilters() {
  Object.assign(store.incomeFilters, {
    category: "全部",
    query: "",
    workMode: "全部",
    rewardKeyword: "",
    sort: "推薦排序",
  });
}
</script>
<template>
  <main class="feature-page income-page">
    <FeatureHeader title="額外收入"
      ><router-link class="header-chip icon-only" to="/income-records"
        ><ClipboardList /></router-link></FeatureHeader
    ><EarningSummaryCard
      :joined="store.incomeJoins.filter((x) => x.status !== 'draft').length"
    />
    <section class="featured-strip income-featured">
      <router-link
        v-for="x in featured"
        :to="`/income/${x.id}`"
        class="featured-card"
        ><small>{{ x.category }} · 熱門合作</small>
        <h2>{{ x.title }}</h2>
        <p>{{ x.reward }}</p>
        <span>查看方案 <ChevronRight /></span
      ></router-link>
    </section>
    <label class="feature-search"
      ><Search /><input
        v-model="store.incomeFilters.query"
        placeholder="搜尋方案、合作單位或關鍵字" /><button
        type="button"
        class="search-filter-button"
        aria-label="開啟篩選"
        @click="filterOpen = true"
      >
        <SlidersHorizontal /></button
    ></label>
    <div class="scroll-tabs">
      <button
        v-for="c in categories"
        :class="{ active: store.incomeFilters.category === c }"
        @click="store.incomeFilters.category = c"
      >
        {{ c }}
      </button>
    </div>
    <section class="listing-list">
      <IncomeOpportunityCard
        v-for="x in visible"
        :item="x"
        :favorite="store.incomeFavorites.includes(x.id)"
        :join-status="status(x.id)"
        @favorite="store.toggleIncomeFavorite(x.id)"
        @join="join(x)"
      />
      <div v-if="!visible.length" class="empty-state">
        <WalletCards />
        <h2>找不到符合條件的方案</h2>
      </div>
    </section>
    <div v-if="filterOpen" class="sheet-layer" @click.self="filterOpen = false">
      <section class="feature-sheet filter-sheet">
        <div class="sheet-handle" />
        <header>
          <div>
            <small>FILTER</small>
            <h2>篩選合作方案</h2>
          </div>
          <button
            class="icon-plain"
            aria-label="關閉"
            @click="filterOpen = false"
          >
            <X />
          </button>
        </header>
        <label
          >工作方式<select v-model="store.incomeFilters.workMode">
            <option>全部</option>
            <option>線上</option>
            <option>不限地點</option>
          </select></label
        >
        <label
          >報酬關鍵字<input
            v-model="store.incomeFilters.rewardKeyword"
            placeholder="例如：每篇、每場、獎金"
        /></label>
        <label
          >排序<select v-model="store.incomeFilters.sort">
            <option>推薦排序</option>
            <option>熱門優先</option>
            <option>即將截止</option>
          </select></label
        >
        <div class="sheet-actions">
          <button class="secondary" @click="resetFilters">
            <RotateCcw />清除</button
          ><button class="primary" @click="filterOpen = false">
            顯示 {{ visible.length }} 筆結果
          </button>
        </div>
      </section>
    </div>
  </main>
</template>
