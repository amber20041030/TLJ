<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Share2,
  MessageCircle,
  CalendarDays,
  MapPin,
  Users,
  WalletCards,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  BriefcaseBusiness,
} from "lucide-vue-next";
import { useFeatureStore } from "../stores/features.js";
import { state } from "../store.js";
import FeatureHeader from "../components/FeatureHeader.vue";
import FavoriteButton from "../components/FavoriteButton.vue";
import ApplicationSheet from "../components/ApplicationSheet.vue";
const route = useRoute(),
  router = useRouter(),
  store = useFeatureStore(),
  sheet = ref(false),
  success = ref(null),
  job = computed(() => store.jobs.find((j) => j.id === route.params.id)),
  application = computed(() =>
    store.applications.find(
      (a) => a.jobId === route.params.id && a.status !== "cancelled",
    ),
  ),
  conflict = computed(
    () =>
      job.value &&
      state.tours.find(
        (t) => job.value.startDate <= t.end && job.value.endDate >= t.start,
      ),
  );
async function share() {
  if (navigator.share)
    try {
      await navigator.share({
        title: job.value.title,
        text: job.value.summary,
        url: location.href,
      });
      return;
    } catch {}
  await navigator.clipboard?.writeText(location.href);
}
function chat() {
  router.push(`/chat/${store.ensureChat(job.value.agencyName)}`);
}
</script>
<template>
  <main v-if="job" class="feature-page detail-page">
    <FeatureHeader :title="job.title" back-to="/jobs"
      ><FavoriteButton
        :active="store.jobFavorites.includes(job.id)"
        @toggle="store.toggleJobFavorite(job.id)" /><button
        class="header-chip icon-only"
        @click="share"
      >
        <Share2 /></button
    ></FeatureHeader>
    <section class="detail-hero job-detail-hero">
      <small>{{ job.category }}</small>
      <h1>{{ job.title }}</h1>
      <p>{{ job.agencyName }}</p>
      <div class="hero-dots"><i /><i /><i /></div>
    </section>
    <div class="summary-grid feature-glass">
      <div>
        <CalendarDays /><small>出團日期</small
        ><b>{{ job.startDate }}<br />{{ job.endDate }}</b>
      </div>
      <div>
        <WalletCards /><small>薪資</small><b>{{ job.salaryLabel }}</b>
      </div>
      <div>
        <Users /><small>名額</small><b>{{ job.openings }} 名</b>
      </div>
      <div>
        <MapPin /><small>集合地點</small><b>{{ job.meetingLocation }}</b>
      </div>
    </div>
    <div :class="conflict ? 'conflict-alert' : 'success-alert'">
      <AlertTriangle v-if="conflict" /><CheckCircle2 v-else />{{
        conflict
          ? `此徵才日期與「${conflict.name}」行程重疊，請確認後再應徵。`
          : "此日期目前沒有其他帶團安排。"
      }}
    </div>
    <section class="feature-glass detail-section">
      <h2>工作資訊</h2>
      <dl>
        <div>
          <dt>應徵身分</dt>
          <dd>{{ job.roleLabel }}</dd>
        </div>
        <div>
          <dt>目的地</dt>
          <dd>{{ job.destination }}</dd>
        </div>
        <div>
          <dt>工作天數</dt>
          <dd>{{ job.days }} 日</dd>
        </div>
        <div>
          <dt>團體人數</dt>
          <dd>約 32 人</dd>
        </div>
        <div>
          <dt>住宿與餐食</dt>
          <dd>由旅行社提供</dd>
        </div>
        <div>
          <dt>截止日期</dt>
          <dd>{{ job.deadline }}</dd>
        </div>
      </dl>
    </section>
    <section class="feature-glass detail-section">
      <h2>工作內容</h2>
      <ul>
        <li>帶領團體完成行程並協助集合確認。</li>
        <li>協助旅客處理突發狀況。</li>
        <li>與旅行社及司機保持聯繫。</li>
        <li>進行景點或行程說明並回報每日狀況。</li>
      </ul>
    </section>
    <section class="feature-glass detail-section">
      <h2>應徵條件</h2>
      <div class="display-tags">
        <span v-for="t in job.tags">{{ t }}</span
        ><span>緊急應變能力</span><span>可配合行前說明會</span>
      </div>
    </section>
    <section class="feature-glass detail-section">
      <h2>薪資與費用</h2>
      <p class="reward-large">{{ job.salaryLabel }}</p>
      <p>交通補助、住宿、餐食與保險依旅行社最終確認內容為準。</p>
      <small>實際薪資與合作條件請以旅行社最終確認內容為準。</small>
    </section>
    <section class="agency-card feature-glass">
      <div class="agency-avatar">{{ job.agencyName.slice(0, 1) }}</div>
      <div>
        <h3>{{ job.agencyName }}</h3>
        <p>專注精緻團體旅遊與專業帶團合作。</p>
      </div>
      <button @click="chat"><MessageCircle />傳送訊息</button>
    </section>
    <div class="bottom-action-bar">
      <FavoriteButton
        :active="store.jobFavorites.includes(job.id)"
        @toggle="store.toggleJobFavorite(job.id)"
      /><button @click="chat"><MessageCircle />詢問</button
      ><button v-if="!application" class="primary" @click="sheet = true">
        我要應徵<ArrowRight /></button
      ><router-link v-else class="primary disabled" to="/applications"
        >已完成應徵</router-link
      >
    </div>
    <ApplicationSheet
      :open="sheet"
      :job="job"
      :conflict="conflict"
      @close="sheet = false"
      @success="
        success = $event;
        sheet = false;
      "
    />
    <div v-if="success" class="modal-layer">
      <section class="success-modal feature-glass">
        <CheckCircle2 /><small>APPLICATION SENT</small>
        <h2>應徵成功</h2>
        <p>{{ job.title }} · {{ job.agencyName }}</p>
        <router-link class="primary" to="/applications"
          >查看應徵紀錄</router-link
        ><button class="secondary" @click="chat">前往聊天室</button
        ><button class="text-btn" @click="success = null">返回徵才詳情</button>
      </section>
    </div>
  </main>
  <main v-else class="feature-page">
    <FeatureHeader title="找不到徵才" back-to="/jobs" />
    <div class="empty-state">
      <BriefcaseBusiness />
      <h2>這筆徵才不存在</h2>
    </div>
  </main>
</template>
