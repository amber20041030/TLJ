<script setup>
import { reactive, computed, watch, ref } from "vue";
import { X, CheckCircle2, LoaderCircle } from "lucide-vue-next";
import { state, roleName } from "../store.js";
import { useFeatureStore } from "../stores/features.js";
const props = defineProps({ open: Boolean, job: Object, conflict: Object }),
  emit = defineEmits(["close", "success"]),
  store = useFeatureStore(),
  processing = ref(false),
  form = reactive({
    role: "",
    fullDate: true,
    message:
      "您好，我具備相關帶團經驗，能配合完整出團日期，希望有機會進一步洽談。",
    expectedSalary: "",
    publicProfile: true,
    chat: true,
    confirmJob: false,
    confirmProfile: false,
    confirmConflict: false,
  });
watch(
  () => props.open,
  (v) => {
    if (v)
      Object.assign(form, {
        role: roleName(),
        fullDate: true,
        message:
          "您好，我具備相關帶團經驗，能配合完整出團日期，希望有機會進一步洽談。",
        expectedSalary: "",
        publicProfile: true,
        chat: true,
        confirmJob: false,
        confirmProfile: false,
        confirmConflict: false,
      });
  },
);
const invalid = computed(
  () =>
    !form.role ||
    !form.message.trim() ||
    !form.confirmJob ||
    !form.confirmProfile ||
    (props.conflict && !form.confirmConflict),
);
function submit() {
  if (invalid.value) return;
  processing.value = true;
  setTimeout(() => {
    const a = store.applyJob(props.job.id, { ...form }, !!props.conflict);
    processing.value = false;
    emit("success", a);
  }, 1000);
}
</script>
<template>
  <div v-if="open" class="sheet-layer" @click.self="$emit('close')">
    <section class="sheet application-sheet">
      <div class="sheet-handle" />
      <header>
        <div>
          <small>APPLICATION DEMO</small>
          <h2>我要應徵</h2>
        </div>
        <button @click="$emit('close')"><X /></button>
      </header>
      <div class="profile-mini">
        <div class="avatar small">{{ state.user.name.slice(0, 1) }}</div>
        <div>
          <b>{{ state.user.name }} · {{ roleName() }}</b>
          <p>個人資料完整度 {{ store.profileCompletion }}%</p>
        </div>
        <CheckCircle2 />
      </div>
      <div v-if="conflict" class="conflict-alert">
        此徵才日期與「{{ conflict.name }}」重疊，請再次確認。
      </div>
      <label
        >應徵身分<select v-model="form.role">
          <option>領隊</option>
          <option>導遊</option>
        </select></label
      ><label
        >應徵留言<textarea
          v-model="form.message"
          maxlength="500"
          rows="4"
        /><small>{{ form.message.length }}／500</small></label
      ><label
        >期望薪資（選填）<input
          v-model="form.expectedSalary"
          placeholder="例如 NT$3,800／日"
      /></label>
      <div class="check-list">
        <label
          ><input
            v-model="form.confirmJob"
            type="checkbox"
          />我已確認出團日期與工作內容</label
        ><label
          ><input
            v-model="form.confirmProfile"
            type="checkbox"
          />我同意提供公開個人簡介</label
        ><label v-if="conflict"
          ><input
            v-model="form.confirmConflict"
            type="checkbox"
          />我了解日期重疊，仍要送出應徵</label
        >
      </div>
      <p class="demo-copy">此為前端 Demo，不會真的傳送履歷給旅行社。</p>
      <button
        class="primary submit"
        :disabled="invalid || processing"
        @click="submit"
      >
        <LoaderCircle v-if="processing" class="spin" />{{
          processing ? "處理中…" : "確認送出"
        }}
      </button>
    </section>
  </div>
</template>
