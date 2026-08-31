<script setup>
import { WalletCards, Users, CalendarDays, ArrowRight } from "lucide-vue-next";
import FavoriteButton from "./FavoriteButton.vue";
import JoinNowButton from "./JoinNowButton.vue";
defineProps({ item: Object, favorite: Boolean, joinStatus: String });
defineEmits(["favorite", "join"]);
</script>
<template>
  <article class="listing-card income-card">
    <router-link :to="`/income/${item.id}`"
      ><div class="listing-cover income-cover">
        <span>{{ item.category }}</span
        ><b>{{ item.workMode }}</b>
      </div>
      <div class="listing-copy">
        <div class="listing-title">
          <div>
            <small>{{ item.partnerName }}</small>
            <h2>{{ item.title }}</h2>
          </div>
          <FavoriteButton :active="favorite" @toggle="$emit('favorite')" />
        </div>
        <p>{{ item.summary }}</p>
        <div class="meta-grid">
          <span><WalletCards />{{ item.reward }}</span
          ><span><Users />剩餘 {{ item.remaining }} 名</span
          ><span><CalendarDays />{{ item.deadline }}</span>
        </div>
        <div class="display-tags compact">
          <span v-for="t in item.tags">{{ t }}</span>
        </div>
      </div></router-link
    ><JoinNowButton :status="joinStatus || 'idle'" @join="$emit('join')" />
  </article>
</template>
