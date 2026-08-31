<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { MapPin, Plane, Mountain } from "lucide-vue-next";
const slides = [
  {
    title: "世界，在下一次出發等你",
    sub: "專業領隊的行程管理中心",
    icon: Plane,
  },
  {
    title: "把每段旅程安排得剛剛好",
    sub: "日誌、邀約、訊息一站掌握",
    icon: MapPin,
  },
  {
    title: "帶團，也能從容而精準",
    sub: "串起旅行社與專業嚮導",
    icon: Mountain,
  },
];
const current = ref(0);
let timer,
  startX = 0;
const go = (i) => (current.value = (i + slides.length) % slides.length);
onMounted(() => (timer = setInterval(() => go(current.value + 1), 4500)));
onBeforeUnmount(() => clearInterval(timer));
const down = (e) => (startX = e.touches?.[0].clientX ?? e.clientX);
const up = (e) => {
  let x = e.changedTouches?.[0].clientX ?? e.clientX;
  if (Math.abs(x - startX) > 35) go(current.value + (x < startX ? 1 : -1));
};
</script>
<template>
  <section class="banner" @touchstart="down" @touchend="up">
    <div
      class="banner-track"
      :style="{ transform: `translateX(-${current * 100}%)` }"
    >
      <article v-for="(s, i) in slides" :class="`banner-slide slide-${i}`">
        <component :is="s.icon" />
        <div>
          <small>TOUR LEADER STUDIO</small>
          <h2>{{ s.title }}</h2>
          <p>{{ s.sub }}</p>
        </div>
      </article>
    </div>
    <div class="dots">
      <button
        v-for="(_, i) in slides"
        :class="{ active: i === current }"
        @click="go(i)"
      />
    </div>
  </section>
</template>
