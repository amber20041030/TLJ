<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import {
  ChevronLeft,
  ShieldCheck,
  Landmark,
  WalletCards,
  CreditCard,
  LoaderCircle,
} from "lucide-vue-next";
import PaymentCard from "../components/PaymentCard.vue";
import { state, roleName, iso } from "../store.js";
const router = useRouter(),
  method = ref("card"),
  processing = ref(false),
  card = reactive({ number: "", expiry: "", cvc: "" }),
  s = new Date(),
  e = new Date(s);
e.setFullYear(e.getFullYear() + 1);
const start = iso(s),
  end = iso(e),
  invalid = computed(
    () =>
      method.value === "card" &&
      (!/^\d{16}$/.test(card.number.replaceAll(" ", "")) ||
        !/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry) ||
        !/^\d{3}$/.test(card.cvc)),
  );
function pay() {
  if (invalid.value) return;
  processing.value = true;
  setTimeout(() => {
    state.membership = { start, end };
    state.loggedIn = true;
    processing.value = false;
    router.push("/payment-success");
  }, 1500);
}
</script>
<template>
  <main class="page payment-page">
    <div class="simple-head">
      <button @click="router.back()"><ChevronLeft /></button>
      <div>
        <small>SECURE CHECKOUT</small>
        <h1>開通會員</h1>
      </div>
    </div>
    <div class="demo-notice">
      <ShieldCheck />此為前端模擬付款，不會產生實際交易
    </div>
    <PaymentCard :role="roleName()" :start="start" :end="end" />
    <section class="glass-panel pay-form">
      <h3>選擇付款方式</h3>
      <div class="pay-methods">
        <button :class="{ active: method === 'card' }" @click="method = 'card'">
          <CreditCard />信用卡</button
        ><button :class="{ active: method === 'atm' }" @click="method = 'atm'">
          <Landmark />ATM</button
        ><button
          :class="{ active: method === 'line' }"
          @click="method = 'line'"
        >
          <WalletCards />LINE Pay
        </button>
      </div>
      <div v-if="method === 'card'" class="card-fields">
        <label
          >卡號<input
            v-model="card.number"
            maxlength="19"
            placeholder="4242 4242 4242 4242"
        /></label>
        <div>
          <label
            >有效期限<input
              v-model="card.expiry"
              placeholder="MM/YY"
              maxlength="5" /></label
          ><label
            >安全碼<input v-model="card.cvc" placeholder="CVC" maxlength="3"
          /></label>
        </div>
        <span v-if="invalid" class="form-hint"
          >Demo 請輸入 16 碼卡號、MM/YY 與 3 碼安全碼</span
        >
      </div>
      <p v-else class="method-note">
        此方式僅供畫面選擇，按下確認即可模擬付款。
      </p>
      <div class="total"><span>費用總計</span><b>NT$ 1,200</b></div>
      <button
        class="primary submit"
        :disabled="processing || invalid"
        @click="pay"
      >
        <LoaderCircle v-if="processing" class="spin" />{{
          processing ? "付款處理中…" : "確認付款"
        }}</button
      ><button class="text-btn" @click="router.push('/auth')">
        返回修改資料
      </button>
    </section>
  </main>
</template>
