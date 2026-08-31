<script setup>
import { ref, computed } from "vue";
import {
  Search,
  SlidersHorizontal,
  BriefcaseBusiness,
  ChevronRight,
} from "lucide-vue-next";
import { useFeatureStore } from "../stores/features.js";
import FeatureHeader from "../components/FeatureHeader.vue";
import JobCard from "../components/JobCard.vue";
import JobFilterSheet from "../components/JobFilterSheet.vue";
const store = useFeatureStore(),
  filterOpen = ref(false),
  tabs = ["為你推薦", "最新刊登", "即將截止", "已收藏", "已應徵"],
  visible = computed(() => {
    let a = [...store.jobs],
      f = store.jobFilters,
      q = f.query.trim().toLowerCase();
    if (q)
      a = a.filter((j) =>
        [j.title, j.agencyName, j.destination, j.category, ...j.tags]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    if (f.role !== "all")
      a = a.filter((j) => j.role === f.role || j.role === "both");
    if (f.area !== "all") a = a.filter((j) => j.area === f.area);
    if (f.tab === "已收藏")
      a = a.filter((j) => store.jobFavorites.includes(j.id));
    if (f.tab === "已應徵")
      a = a.filter((j) =>
        store.applications.some(
          (x) => x.jobId === j.id && x.status !== "cancelled",
        ),
      );
    if (f.tab === "最新刊登")
      a.sort((x, y) => y.publishedAt.localeCompare(x.publishedAt));
    else if (f.tab === "即將截止" || f.sort === "截止日期最近")
      a.sort((x, y) => x.deadline.localeCompare(y.deadline));
    else if (f.sort === "薪資由高到低") a.sort((x, y) => y.salary - x.salary);
    else if (f.sort === "出團日期最近")
      a.sort((x, y) => x.startDate.localeCompare(y.startDate));
    else a.sort((x, y) => Number(y.featured) - Number(x.featured));
    return a;
  }),
  featured = computed(() => store.jobs.filter((j) => j.featured));
function apply(f) {
  Object.assign(store.jobFilters, f);
  filterOpen.value = false;
}
</script>
<template>
  <main class="feature-page">
    <FeatureHeader title="徵才啟事"
      ><router-link class="header-chip icon-only" to="/applications"
        ><BriefcaseBusiness /></router-link
      ><button class="header-chip icon-only" @click="filterOpen = true">
        <SlidersHorizontal /><i
          v-if="
            store.jobFilters.role !== 'all' || store.jobFilters.area !== 'all'
          "
        /></button></FeatureHeader
    ><label class="feature-search"
      ><Search /><input
        v-model="store.jobFilters.query"
        placeholder="搜尋徵才、旅行社或地區"
    /></label>
    <div class="scroll-tabs">
      <button
        v-for="t in tabs"
        :class="{ active: store.jobFilters.tab === t }"
        @click="store.jobFilters.tab = t"
      >
        {{ t }}
      </button>
    </div>
    <section
      v-if="store.jobFilters.tab === '為你推薦' && !store.jobFilters.query"
      class="featured-strip"
    >
      <router-link
        v-for="j in featured"
        :to="`/jobs/${j.id}`"
        class="featured-card"
        ><small>FEATURED JOB</small>
        <h2>{{ j.title }}</h2>
        <p>{{ j.agencyName }} · {{ j.destination }}</p>
        <span>{{ j.salaryLabel }} <ChevronRight /></span
      ></router-link>
    </section>
    <div class="list-controls">
      <b>{{ visible.length }} 筆徵才</b
      ><select v-model="store.jobFilters.sort">
        <option>推薦排序</option>
        <option>最新刊登</option>
        <option>截止日期最近</option>
        <option>出團日期最近</option>
        <option>薪資由高到低</option>
      </select>
    </div>
    <section class="listing-list">
      <JobCard
        v-for="j in visible"
        :job="j"
        :favorite="store.jobFavorites.includes(j.id)"
        :applied="
          store.applications.some(
            (a) => a.jobId === j.id && a.status !== 'cancelled',
          )
        "
        @favorite="store.toggleJobFavorite(j.id)"
      />
      <div v-if="!visible.length" class="empty-state">
        <BriefcaseBusiness />
        <h2>找不到符合條件的徵才</h2>
        <p>試著清除搜尋或調整篩選條件。</p>
      </div>
    </section>
    <p v-if="visible.length" class="end-copy">已顯示全部徵才</p>
    <JobFilterSheet
      :open="filterOpen"
      :model-value="store.jobFilters"
      @close="filterOpen = false"
      @apply="apply"
    />
  </main>
</template>
