<script setup>
import { ref, computed } from "vue";
import { ChevronLeft, ChevronRight, Plus } from "lucide-vue-next";
import TourFormSheet from "./TourFormSheet.vue";
import { iso, state } from "../store.js";
const fallback = "#d89a1d",
  view = ref(new Date()),
  selected = ref(null),
  draftStart = ref(""),
  sheet = ref(false),
  title = computed(
    () => `${view.value.getFullYear()}年 ${view.value.getMonth() + 1}月`,
  ),
  days = computed(() => {
    const y = view.value.getFullYear(),
      m = view.value.getMonth(),
      first = new Date(y, m, 1),
      start = new Date(y, m, 1 - first.getDay());
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const date = iso(d),
        tours = state.tours.filter((t) => date >= t.start && date <= t.end),
        tour = tours[0];
      return {
        date,
        num: d.getDate(),
        current: d.getMonth() === m,
        tours,
        tour,
        segmentStart: !!tour && (date === tour.start || d.getDay() === 0),
        segmentEnd: !!tour && (date === tour.end || d.getDay() === 6),
      };
    });
  });
function shift(n) {
  view.value = new Date(view.value.getFullYear(), view.value.getMonth() + n, 1);
}
function clickDay(d) {
  if (d.tours.length) {
    selected.value = { color: fallback, ...d.tours[0] };
    sheet.value = true;
    return;
  }
  if (!draftStart.value) {
    draftStart.value = d.date;
    return;
  }
  const [a, b] = [draftStart.value, d.date].sort();
  selected.value = { name: "", start: a, end: b, note: "", color: fallback };
  draftStart.value = "";
  sheet.value = true;
}
function openNew() {
  const d = iso(new Date());
  selected.value = { name: "", start: d, end: d, note: "", color: fallback };
  sheet.value = true;
}
function save(t) {
  const i = state.tours.findIndex((x) => x.id === t.id);
  if (i >= 0) state.tours[i] = t;
  else state.tours.push(t);
  sheet.value = false;
}
function del(id) {
  state.tours = state.tours.filter((t) => t.id !== id);
  sheet.value = false;
}
</script>
<template>
  <section class="calendar-card">
    <div class="calendar-head">
      <button @click="shift(-1)"><ChevronLeft /></button>
      <div>
        <small>AVAILABLE DATES</small>
        <h2>{{ title }}</h2>
      </div>
      <button @click="shift(1)"><ChevronRight /></button>
    </div>
    <div class="weekdays">
      <b>日</b><span>一</span><span>二</span><span>三</span><span>四</span
      ><span>五</span><b>六</b>
    </div>
    <div class="month-grid">
      <button
        v-for="d in days"
        :class="{
          muted: !d.current,
          selected: d.date === draftStart,
          booked: d.tours.length,
          'segment-start': d.segmentStart,
          'segment-end': d.segmentEnd,
        }"
        :style="d.tour ? { '--tour-color': d.tour.color || fallback } : null"
        @click="clickDay(d)"
      >
        <span>{{ d.num }}</span
        ><em v-if="d.tour">{{ d.segmentStart ? d.tour.name : "" }}</em>
      </button>
    </div>
    <p v-if="draftStart" class="range-hint">
      已選 {{ draftStart }}，請再選擇結束日期
    </p>
    <button class="primary add-tour" @click="openNew">
      <Plus />新增帶團行程
    </button>
  </section>
  <TourFormSheet
    :open="sheet"
    :tour="selected"
    @close="sheet = false"
    @save="save"
    @delete="del"
  />
</template>
