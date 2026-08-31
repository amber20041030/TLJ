<script setup>
import { WalletCards, TrendingUp, Clock3, CheckCircle2 } from "lucide-vue-next";
defineProps({ joined: Number });
</script>
<template>
  <section class="earning-summary">
    <small>MY EXTRA INCOME</small>
    <h2>我的額外收入</h2>
    <div>
      <article><TrendingUp /><small>本月預估</small><b>NT$2,850</b></article>
      <article><WalletCards /><small>累積收入</small><b>NT$12,600</b></article>
      <article><Clock3 /><small>待審核</small><b>NT$1,200</b></article>
      <article><CheckCircle2 /><small>可領取</small><b>NT$1,650</b></article>
    </div>
    <p>已加入 {{ joined }} 個方案 · 本月完成 2 項任務</p>
    <small class="demo-copy"
      >此頁面為前端 Demo 假資料，不代表真實收入或付款紀錄。</small
    >
  </section>
</template>
