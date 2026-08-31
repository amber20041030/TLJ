<script setup>
import { useRouter } from "vue-router";
import { BadgeCheck, ArrowRight } from "lucide-vue-next";
import { state, formatDate } from "../store.js";
const router = useRouter();
</script>
<template>
  <main class="success-page page">
    <div class="success-orb"><BadgeCheck /></div>
    <small>PAYMENT COMPLETED</small>
    <h1>付款成功</h1>
    <p>您的專業會員資格已開通，接下來就把每段旅程安排得漂亮俐落吧。</p>
    <div class="success-detail">
      <span>開通期間</span
      ><b
        >{{ formatDate(state.membership.start) }}<br />－
        {{ formatDate(state.membership.end) }}</b
      >
    </div>
    <button class="primary submit" @click="router.push('/home')">
      開始使用<ArrowRight />
    </button>
  </main>
</template>
