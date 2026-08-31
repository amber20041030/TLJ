<script setup>
import { CalendarDays, MapPin, Users, ArrowRight } from "lucide-vue-next";
import FavoriteButton from "./FavoriteButton.vue";
import StatusBadge from "./StatusBadge.vue";
defineProps({ job: Object, favorite: Boolean, applied: Boolean });
defineEmits(["favorite"]);
</script>
<template>
  <article class="listing-card job-card">
    <router-link :to="`/jobs/${job.id}`" class="listing-main"
      ><div class="listing-cover job-cover">
        <span>{{ job.category }}</span
        ><b>{{ job.destination }}</b>
      </div>
      <div class="listing-copy">
        <div class="listing-title">
          <div>
            <small>{{ job.agencyName }}</small>
            <h2>{{ job.title }}</h2>
          </div>
          <FavoriteButton :active="favorite" @toggle="$emit('favorite')" />
        </div>
        <div class="meta-grid">
          <span><CalendarDays />{{ job.startDate }}～{{ job.endDate }}</span
          ><span><MapPin />{{ job.destination }}</span
          ><span><Users />{{ job.openings }} 名</span>
        </div>
        <div class="card-bottom">
          <b>{{ job.salaryLabel }}</b
          ><StatusBadge v-if="applied" status="已應徵" /><ArrowRight v-else />
        </div></div
    ></router-link>
  </article>
</template>
