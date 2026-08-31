<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import {
  ChevronLeft,
  UserRound,
  BriefcaseBusiness,
  MessagesSquare,
  WalletCards,
  Construction,
} from "lucide-vue-next";
const props = defineProps({ kind: String }),
  router = useRouter(),
  data = computed(
    () =>
      ({
        profile: {
          title: "個人簡介",
          desc: "在這裡建立您的帶團經歷、語言能力與專業亮點。",
          icon: UserRound,
        },
        jobs: {
          title: "徵才啟事",
          desc: "旅行社的帶團機會與合作邀請，將集中顯示於此。",
          icon: BriefcaseBusiness,
        },
        discussion: {
          title: "交流討論",
          desc: "與領隊、導遊夥伴分享路線情報與實務經驗。",
          icon: MessagesSquare,
        },
        income: {
          title: "額外收入",
          desc: "探索導覽企劃、旅遊內容與其他專業合作可能。",
          icon: WalletCards,
        },
      })[props.kind],
  );
</script>
<template>
  <main class="placeholder page">
    <button class="back" @click="router.push('/home')">
      <ChevronLeft />返回首頁
    </button>
    <section class="glass-panel placeholder-card">
      <component :is="data.icon" /><small>COMING SOON</small>
      <h1>{{ data.title }}</h1>
      <p>{{ data.desc }}</p>
      <div class="coming"><Construction />功能建置中</div>
    </section>
  </main>
</template>
