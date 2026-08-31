<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Share2,
  MessageCircle,
  WalletCards,
  CalendarDays,
  Users,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from "lucide-vue-next";
import { useFeatureStore } from "../stores/features.js";
import FeatureHeader from "../components/FeatureHeader.vue";
import FavoriteButton from "../components/FavoriteButton.vue";
import JoinNowButton from "../components/JoinNowButton.vue";
const route = useRoute(),
  router = useRouter(),
  store = useFeatureStore(),
  item = computed(() => store.income.find((x) => x.id === route.params.id)),
  join = computed(() =>
    store.incomeJoins.find((j) => j.opportunityId === route.params.id),
  ),
  eligible = computed(() =>
    store.profileCompletion >= 80 ? "符合資格" : "部分資料待補充",
  );
async function share() {
  if (navigator.share)
    try {
      await navigator.share({
        title: item.value.title,
        text: item.value.summary,
        url: location.href,
      });
      return;
    } catch {}
  await navigator.clipboard?.writeText(location.href);
}
function chat() {
  router.push(`/chat/${store.ensureChat(item.value.partnerName)}`);
}
</script>
<template>
  <main v-if="item" class="feature-page detail-page income-detail">
    <FeatureHeader :title="item.title" back-to="/income"
      ><FavoriteButton
        :active="store.incomeFavorites.includes(item.id)"
        @toggle="store.toggleIncomeFavorite(item.id)" /><button
        class="header-chip icon-only"
        @click="share"
      >
        <Share2 /></button
    ></FeatureHeader>
    <section class="detail-hero income-detail-hero">
      <small>{{ item.category }}</small>
      <h1>{{ item.title }}</h1>
      <p>{{ item.partnerName }}</p>
    </section>
    <div class="summary-grid feature-glass">
      <div>
        <WalletCards /><small>預估收入</small><b>{{ item.reward }}</b>
      </div>
      <div>
        <MapPin /><small>執行方式</small><b>{{ item.workMode }}</b>
      </div>
      <div>
        <CalendarDays /><small>截止日期</small><b>{{ item.deadline }}</b>
      </div>
      <div>
        <Users /><small>剩餘名額</small><b>{{ item.remaining }} 名</b>
      </div>
    </div>
    <section
      class="eligibility feature-glass"
      :class="{ partial: eligible !== '符合資格' }"
    >
      <CheckCircle2 v-if="eligible === '符合資格'" /><AlertCircle v-else />
      <div>
        <small>ELIGIBILITY CHECK</small>
        <h2>{{ eligible }}</h2>
        <p>依個人簡介身分、證照、語言與完整度進行前端比對。</p>
      </div>
      <router-link v-if="eligible !== '符合資格'" to="/profile"
        >完善簡介</router-link
      >
    </section>
    <section class="feature-glass detail-section">
      <h2>方案介紹</h2>
      <p>
        {{
          item.summary
        }}。本合作適合希望運用旅遊專業，彈性累積作品與經驗的領隊及導遊。
      </p>
    </section>
    <section class="feature-glass detail-section">
      <h2>需要完成的工作</h2>
      <ul>
        <li v-for="t in item.tasks">{{ t }}</li>
      </ul>
      <h3>申請資格</h3>
      <ul>
        <li v-for="r in item.requirements">{{ r }}</li>
      </ul>
    </section>
    <section class="feature-glass detail-section">
      <h2>合作與收入說明</h2>
      <dl>
        <div>
          <dt>收入方式</dt>
          <dd>{{ item.reward }}</dd>
        </div>
        <div>
          <dt>審核時間</dt>
          <dd>約 3～5 個工作天</dd>
        </div>
        <div>
          <dt>合作期間</dt>
          <dd>通過後依任務通知</dd>
        </div>
      </dl>
      <p class="demo-copy">
        所有收入、審核與合作紀錄皆為前端 Demo 假資料，不代表真實收入承諾。
      </p>
    </section>
    <div class="bottom-action-bar">
      <FavoriteButton
        :active="store.incomeFavorites.includes(item.id)"
        @toggle="store.toggleIncomeFavorite(item.id)"
      /><button @click="chat"><MessageCircle />詢問</button
      ><JoinNowButton
        :status="join?.status || 'idle'"
        @join="router.push(`/income/${item.id}/join`)"
      />
    </div>
  </main>
  <main v-else class="feature-page">
    <FeatureHeader title="找不到方案" back-to="/income" />
    <div class="empty-state">
      <WalletCards />
      <h2>此方案不存在</h2>
    </div>
  </main>
</template>
