<script setup>
import { ref, computed } from "vue";
import { BriefcaseBusiness, MessageCircle, XCircle } from "lucide-vue-next";
import { useFeatureStore } from "../stores/features.js";
import FeatureHeader from "../components/FeatureHeader.vue";
import StatusBadge from "../components/StatusBadge.vue";
import ConfirmDialog from "../components/ConfirmDialog.vue";
const store = useFeatureStore(),
  tab = ref("全部"),
  cancel = ref(null),
  tabs = ["全部", "待回覆", "已查看", "洽談中", "已錄取", "未錄取", "已取消"],
  map = {
    pending: "待回覆",
    viewed: "已查看",
    talking: "洽談中",
    accepted: "已錄取",
    rejected: "未錄取",
    cancelled: "已取消",
  },
  records = computed(() =>
    store.applications
      .filter((a) => tab.value === "全部" || map[a.status] === tab.value)
      .map((a) => ({ ...a, job: store.jobs.find((j) => j.id === a.jobId) })),
  );
function chat(a) {
  location.href = `/chat/${store.ensureChat(a.job.agencyName)}`;
}
</script>
<template>
  <main class="feature-page">
    <FeatureHeader title="應徵紀錄" back-to="/jobs" />
    <div class="scroll-tabs">
      <button v-for="t in tabs" :class="{ active: tab === t }" @click="tab = t">
        {{ t }}
      </button>
    </div>
    <section class="record-list">
      <article v-for="a in records" class="record-card feature-glass">
        <div>
          <small>{{ a.job?.agencyName }}</small>
          <h2>{{ a.job?.title }}</h2>
          <p>{{ a.job?.startDate }}～{{ a.job?.endDate }}</p>
          <StatusBadge :status="map[a.status]" />
        </div>
        <div class="record-actions">
          <router-link :to="`/jobs/${a.jobId}`">查看徵才</router-link
          ><button @click="chat(a)"><MessageCircle />聯絡</button
          ><button v-if="a.status !== 'cancelled'" @click="cancel = a">
            <XCircle />取消
          </button>
        </div>
        <div class="simulate-row">
          <small>Demo 模擬狀態：</small
          ><button @click="store.simulateApplication(a.id, 'viewed')">
            已查看</button
          ><button @click="store.simulateApplication(a.id, 'accepted')">
            錄取</button
          ><button @click="store.simulateApplication(a.id, 'rejected')">
            未錄取
          </button>
        </div>
      </article>
      <div v-if="!records.length" class="empty-state">
        <BriefcaseBusiness />
        <h2>目前沒有應徵紀錄</h2>
      </div>
    </section>
    <ConfirmDialog
      :open="!!cancel"
      title="確定取消這筆應徵嗎？"
      message="紀錄會保留並更新為已取消。"
      @cancel="cancel = null"
      @confirm="
        store.cancelApplication(cancel.id);
        cancel = null;
      "
    />
  </main>
</template>
