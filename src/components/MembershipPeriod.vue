<script setup>
import { CalendarDays } from "lucide-vue-next";
import { formatDate } from "../store.js";
defineProps({ start: String, end: String });
</script>
<template>
  <div class="period">
    <CalendarDays />
    <div>
      <small>會員開通期間</small
      ><b>{{ formatDate(start) }}－{{ formatDate(end) }}</b>
    </div>
  </div>
</template>
