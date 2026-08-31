<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useFeatureStore } from "../stores/features.js";
import { ClipboardList, MessageCircle, WalletCards } from "lucide-vue-next";
import FeatureHeader from "../components/FeatureHeader.vue";
import StatusBadge from "../components/StatusBadge.vue";
const store = useFeatureStore(),
  router = useRouter(),
  tab = ref("全部"),
  tabs = [
    "全部",
    "草稿",
    "審核中",
    "已加入",
    "進行中",
    "待確認",
    "已完成",
    "未通過",
  ],
  labels = {
    draft: "草稿",
    reviewing: "審核中",
    joined: "已加入",
    active: "進行中",
    confirming: "待確認",
    completed: "已完成",
    rejected: "未通過",
  },
  records = computed(() =>
    store.incomeJoins
      .filter((j) => tab.value === "全部" || labels[j.status] === tab.value)
      .map((j) => ({
        ...j,
        item: store.income.find((x) => x.id === j.opportunityId),
      })),
  );
function chat(r) {
  router.push(`/chat/${store.ensureChat(r.item.partnerName)}`);
}
</script>
<template>
  <main class="feature-page">
    <FeatureHeader title="收入與加入紀錄" back-to="/income" />
    <div class="scroll-tabs">
      <button v-for="t in tabs" :class="{ active: tab === t }" @click="tab = t">
        {{ t }}
      </button>
    </div>
    <section class="record-list">
      <article v-for="r in records" class="record-card feature-glass">
        <div>
          <small>{{ r.item?.partnerName }}</small>
          <h2>{{ r.item?.title }}</h2>
          <p>{{ r.item?.category }} · {{ r.item?.reward }}</p>
          <StatusBadge :status="labels[r.status]" />
        </div>
        <div class="record-actions">
          <router-link
            :to="
              r.status === 'draft'
                ? `/income/${r.opportunityId}/join`
                : `/income/${r.opportunityId}`
            "
            >{{ r.status === "draft" ? "繼續填寫" : "查看詳情" }}</router-link
          ><button @click="chat(r)"><MessageCircle />聯絡</button>
        </div>
      </article>
      <div v-if="!records.length" class="empty-state">
        <ClipboardList />
        <h2>目前沒有加入紀錄</h2>
      </div>
    </section>
    <section class="feature-glass earnings-section">
      <div class="section-title">
        <small>EARNING HISTORY</small>
        <h2>收入假明細</h2>
      </div>
      <article v-for="e in store.earnings" class="earning-row">
        <div>
          <b>{{ e.title }}</b
          ><small>{{ e.completedAt }} · {{ e.status }}</small>
        </div>
        <strong>NT${{ e.amount.toLocaleString() }}</strong
        ><button v-if="e.status === '可領取'" @click="e.status = '處理中'">
          申請領取
        </button>
      </article>
      <p class="demo-copy">
        僅為前端假狀態，不輸入銀行帳號、不連接金流、不產生匯款。
      </p>
    </section>
  </main>
</template>
