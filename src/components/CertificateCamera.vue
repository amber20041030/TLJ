<script setup>
import { Camera, RefreshCcw, Trash2 } from "lucide-vue-next";
defineProps({ modelValue: String, label: String });
const emit = defineEmits(["update:modelValue"]);
function pick(e) {
  const f = e.target.files[0];
  if (!f) return;
  const img = new Image(),
    url = URL.createObjectURL(f);
  img.onload = () => {
    const c = document.createElement("canvas"),
      s = Math.min(1, 720 / Math.max(img.width, img.height));
    c.width = img.width * s;
    c.height = img.height * s;
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    emit("update:modelValue", c.toDataURL("image/jpeg", 0.7));
    URL.revokeObjectURL(url);
  };
  img.src = url;
}
</script>
<template>
  <div class="camera-card">
    <input
      :id="label"
      type="file"
      accept="image/*"
      capture="environment"
      @change="pick"
    /><template v-if="modelValue"
      ><img :src="modelValue" />
      <div class="camera-actions">
        <label :for="label"><RefreshCcw />重拍</label
        ><button type="button" @click="emit('update:modelValue', '')">
          <Trash2 />刪除
        </button>
      </div></template
    ><label v-else :for="label" class="camera-empty"
      ><Camera /><b>{{ label }}</b
      ><span>拍攝或從相簿選擇</span></label
    >
  </div>
</template>
