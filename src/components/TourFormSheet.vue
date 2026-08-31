<script setup>
import { computed, reactive, watch } from "vue";
import { X, Trash2, Check } from "lucide-vue-next";
const props = defineProps({ open: Boolean, tour: Object }),
  emit = defineEmits(["close", "save", "delete"]);
const colors = [
  "#d89a1d",
  "#e5702a",
  "#cf5362",
  "#5f9f78",
  "#4f91a9",
  "#7b6ab5",
];
const form = reactive({
    id: "",
    name: "",
    start: "",
    end: "",
    note: "",
    color: colors[0],
  }),
  error = computed(
    () =>
      !form.name.trim() || !form.start || !form.end || form.end < form.start,
  );
watch(
  () => [props.open, props.tour],
  () => {
    if (props.open)
      Object.assign(form, {
        id: "",
        name: "",
        start: "",
        end: "",
        note: "",
        color: colors[0],
        ...(props.tour || {}),
      });
  },
  { deep: true },
);
function save() {
  if (!error.value)
    emit("save", { ...form, id: form.id || crypto.randomUUID() });
}
</script>
<template>
  <div v-if="open" class="sheet-layer" @click.self="$emit('close')">
    <section class="sheet">
      <div class="sheet-handle" />
      <header>
        <div>
          <small>TOUR SCHEDULE</small>
          <h2>{{ form.id ? "編輯帶團行程" : "新增帶團行程" }}</h2>
        </div>
        <button @click="$emit('close')"><X /></button>
      </header>
      <label
        >旅遊團名稱<input v-model="form.name" placeholder="例如：北海道5日"
      /></label>
      <div class="form-grid">
        <label>開始日期<input v-model="form.start" type="date" /></label
        ><label>結束日期<input v-model="form.end" type="date" /></label>
      </div>
      <fieldset class="color-picker">
        <legend>行程顏色</legend>
        <button
          v-for="color in colors"
          type="button"
          :style="{ background: color }"
          :class="{ active: form.color === color }"
          @click="form.color = color"
        >
          <Check v-if="form.color === color" />
        </button>
      </fieldset>
      <label
        >備註（選填）<textarea
          v-model="form.note"
          rows="3"
          placeholder="集合地點、航班等資訊"
        ></textarea></label
      ><span v-if="error" class="error">請填寫行程名稱與有效的日期區間</span>
      <div class="sheet-actions">
        <button
          v-if="form.id"
          class="delete-btn"
          @click="$emit('delete', form.id)"
        >
          <Trash2 />刪除</button
        ><button class="primary grow" :disabled="error" @click="save">
          儲存行程
        </button>
      </div>
    </section>
  </div>
</template>
