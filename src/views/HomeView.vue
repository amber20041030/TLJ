<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { BellRing, Sparkles } from "lucide-vue-next";
import AppHeader from "../components/AppHeader.vue";
import MembershipPeriod from "../components/MembershipPeriod.vue";
import TourCalendar from "../components/TourCalendar.vue";
import FeatureShortcut from "../components/FeatureShortcut.vue";
import SettingsDrawer from "../components/SettingsDrawer.vue";
import { state } from "../store.js";
const router = useRouter(),
  drawer = ref(false),
  unread = computed(() => state.chats.reduce((n, c) => n + c.unread, 0)),
  features = [
    {
      label: "個人簡介",
      sub: "建立專業形象",
      path: "/profile",
      image: "/個人簡介.png",
    },
    {
      label: "徵才啟事",
      sub: "探索帶團機會",
      path: "/jobs",
      image: "/徵才啟事.png",
    },
    {
      label: "交流討論",
      sub: "分享實務經驗",
      path: "/discussion",
      image: "/交流討論.png",
    },
    {
      label: "額外收入",
      sub: "拓展合作可能",
      path: "/income",
      image: "/額外收入.png",
    },
  ];
</script>
<template>
  <main class="home page">
    <AppHeader
      :name="state.user.name"
      :unread="unread"
      @settings="drawer = true"
      @messages="router.push('/messages')"
    /><MembershipPeriod v-bind="state.membership" />
    <section class="home-intro">
      <small><Sparkles />TRAVEL COMMAND CENTER</small>
      <h1>我的帶團日誌</h1>
      <p>
        <BellRing />請安排您的旅遊團日期，以便旅行社了解您剩餘的可帶團時間。
      </p>
    </section>
    <TourCalendar />
    <section class="shortcut-section">
      <div>
        <small>DISCOVER MORE</small>
        <h2>帶團工作台</h2>
      </div>
      <div class="feature-grid">
        <FeatureShortcut v-for="f in features" :item="f" />
      </div>
    </section>
    <SettingsDrawer
      :open="drawer"
      @close="drawer = false"
      @logout="router.push('/auth')"
    />
  </main>
</template>
