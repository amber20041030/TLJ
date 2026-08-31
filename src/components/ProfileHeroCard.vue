<script setup>
import { Camera, CheckCircle2 } from "lucide-vue-next";
defineProps({
  name: String,
  role: String,
  tourCount: Number,
  completion: Number,
  avatar: String,
  editing: Boolean,
});
defineEmits(["avatar"]);
</script>
<template>
  <section class="profile-hero feature-glass">
    <label class="profile-avatar"
      ><img v-if="avatar" :src="avatar" /><span v-else>{{
        name?.slice(0, 1)
      }}</span
      ><input
        v-if="editing"
        type="file"
        accept="image/*"
        capture="user"
        @change="$emit('avatar', $event)" /><i v-if="editing"><Camera /></i
    ></label>
    <div class="profile-hero-copy">
      <small>PROFESSIONAL PROFILE</small>
      <h2>{{ name }}</h2>
      <div class="mini-tags">
        <span>{{ role }}</span
        ><span><CheckCircle2 />證照已驗證</span>
      </div>
    </div>
    <div class="profile-stats">
      <div>
        <b>{{ tourCount }}</b
        ><small>出團次數</small>
      </div>
      <div><b>已開通</b><small>會員狀態</small></div>
      <div>
        <b>{{ completion }}%</b><small>完整度</small>
      </div>
    </div>
    <div class="completion"><i :style="{ width: completion + '%' }" /></div>
  </section>
</template>
