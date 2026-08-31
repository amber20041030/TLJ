<script setup>
import { reactive, watch } from "vue";
import { X } from "lucide-vue-next";
const props = defineProps({ open: Boolean, modelValue: Object }),
  emit = defineEmits(["close", "apply"]);
const f = reactive({});
watch(
  () => props.open,
  (v) => v && Object.assign(f, props.modelValue),
);
</script>
<template>
  <div v-if="open" class="sheet-layer" @click.self="$emit('close')">
    <section class="sheet">
      <div class="sheet-handle" />
      <header>
        <h2>篩選徵才</h2>
        <button @click="$emit('close')"><X /></button>
      </header>
      <label
        >應徵身分<select v-model="f.role">
          <option value="all">全部</option>
          <option value="leader">領隊</option>
          <option value="guide">導遊</option>
          <option value="both">領隊／導遊皆可</option>
        </select></label
      ><label
        >工作地區<select v-model="f.area">
          <option value="all">全部地區</option>
          <option>台灣北部</option>
          <option>日本</option>
          <option>韓國</option>
          <option>東南亞</option>
          <option>歐洲</option>
        </select></label
      >
      <div class="sheet-actions">
        <button
          class="secondary"
          @click="Object.assign(f, { role: 'all', area: 'all' })"
        >
          清除條件</button
        ><button class="primary grow" @click="$emit('apply', { ...f })">
          顯示結果
        </button>
      </div>
    </section>
  </div>
</template>
