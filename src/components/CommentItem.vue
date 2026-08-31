<script setup>
import { Heart, Reply, CheckCircle2 } from "lucide-vue-next";
defineProps({ comment: Object, best: Boolean, canBest: Boolean });
defineEmits(["reply", "like", "best"]);
</script>
<template>
  <article class="comment-item" :class="{ best }">
    <header>
      <div class="avatar tiny">{{ comment.authorName.slice(0, 1) }}</div>
      <div>
        <b>{{ comment.authorName }}</b
        ><small>{{ comment.createdAt }}</small>
      </div>
      <span v-if="best"><CheckCircle2 />最佳解答</span>
    </header>
    <p>
      <i v-if="comment.replyTo">回覆 {{ comment.replyTo }}：</i
      >{{ comment.content }}
    </p>
    <footer>
      <button @click="$emit('like')">
        <Heart />{{ comment.likedBy.length }}</button
      ><button @click="$emit('reply')"><Reply />回覆</button
      ><button v-if="canBest" @click="$emit('best')">
        {{ best ? "取消最佳解答" : "設為最佳解答" }}
      </button>
    </footer>
  </article>
</template>
