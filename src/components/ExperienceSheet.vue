<script setup>
import { reactive, watch, computed } from "vue";
import { X } from "lucide-vue-next";
const props = defineProps({ open: Boolean, item: Object }),
  emit = defineEmits(["close", "save"]);
const f = reactive({
  id: "",
  name: "",
  agency: "",
  region: "",
  start: "",
  end: "",
  people: 20,
  role: "領隊",
  description: "",
});
watch(
  () => [props.open, props.item],
  () =>
    props.open &&
    Object.assign(f, {
      id: "",
      name: "",
      agency: "",
      region: "",
      start: "",
      end: "",
      people: 20,
      role: "領隊",
      description: "",
      ...(props.item || {}),
    }),
  { deep: true },
);
const invalid = computed(
  () => !f.name || !f.agency || !f.start || !f.end || f.end < f.start,
);
</script>
<template>
  <div v-if="open" class="sheet-layer" @click.self="$emit('close')">
    <section class="sheet">
      <div class="sheet-handle" />
      <header>
        <h2>{{ f.id ? "編輯" : "新增" }}帶團經歷</h2>
        <button @click="$emit('close')"><X /></button>
      </header>
      <label>旅遊團名稱<input v-model="f.name" /></label
      ><label>旅行社名稱<input v-model="f.agency" /></label>
      <div class="form-grid">
        <label>旅遊地區<input v-model="f.region" /></label
        ><label>團體人數<input v-model.number="f.people" type="number" /></label
        ><label>開始日期<input v-model="f.start" type="date" /></label
        ><label>結束日期<input v-model="f.end" type="date" /></label>
      </div>
      <label>經歷說明<textarea v-model="f.description" rows="3" /></label
      ><button
        class="primary submit"
        :disabled="invalid"
        @click="$emit('save', { ...f, id: f.id || crypto.randomUUID() })"
      >
        儲存經歷
      </button>
    </section>
  </div>
</template>
