<script setup>
const props = defineProps({
  modelValue: Array,
  options: Array,
  max: { type: Number, default: 99 },
  readonly: Boolean,
});
const emit = defineEmits(["update:modelValue"]);
function toggle(v) {
  if (props.readonly) return;
  const a = [...props.modelValue],
    i = a.indexOf(v);
  if (i >= 0) a.splice(i, 1);
  else if (a.length < props.max) a.push(v);
  emit("update:modelValue", a);
}
</script>
<template>
  <div class="tag-selector">
    <button
      v-for="v in options"
      type="button"
      :class="{ active: modelValue.includes(v) }"
      @click="toggle(v)"
    >
      {{ v }}
    </button>
  </div>
</template>
