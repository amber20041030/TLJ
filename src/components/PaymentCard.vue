<script setup>
import { CreditCard } from "lucide-vue-next";
defineProps({ role: String, start: String, end: String });
</script>
<template>
  <section class="payment-card glass-panel">
    <div class="pay-icon"><CreditCard /></div>
    <small>ANNUAL MEMBERSHIP</small>
    <h2>領隊／導遊帶團專區<br />一年期會員</h2>
    <dl>
      <div>
        <dt>會員身分</dt>
        <dd>{{ role }}</dd>
      </div>
      <div>
        <dt>開通期間</dt>
        <dd>{{ start }} ～ {{ end }}</dd>
      </div>
      <div>
        <dt>方案金額</dt>
        <dd>NT$ 1,200</dd>
      </div>
    </dl>
  </section>
</template>
