import { defineStore } from "pinia";
import { defaultFeatureState } from "../mockFeatures.js";
import { state as appState } from "../store.js";
const merge = (base, saved) => {
  if (Array.isArray(base)) return Array.isArray(saved) ? saved : base;
  if (base && typeof base === "object") {
    const out = { ...base };
    for (const k in saved || {})
      out[k] = k in base ? merge(base[k], saved[k]) : saved[k];
    return out;
  }
  return saved ?? base;
};
let saved = {};
try {
  saved = JSON.parse(localStorage.getItem("tourFeatureData") || "{}");
} catch {}
export const useFeatureStore = defineStore("features", {
  state: () => merge(structuredClone(defaultFeatureState), saved),
  getters: {
    profileCompletion: (s) => {
      const p = s.profile,
        checks = [
          p.email,
          p.region,
          p.languages.length,
          p.bio,
          p.styles.length,
          p.travelTypes.length,
          p.experiences.length,
        ];
      return Math.round((checks.filter(Boolean).length / checks.length) * 100);
    },
    unreadNotifications: (s) => s.notifications.filter((n) => !n.read).length,
  },
  actions: {
    persist() {
      localStorage.setItem("tourFeatureData", JSON.stringify(this.$state));
    },
    saveProfile(profile) {
      this.profile = JSON.parse(JSON.stringify(profile));
      Object.assign(appState.user, {
        name: profile.name || appState.user.name,
        phone: profile.phone || appState.user.phone,
        birthday: profile.birthday || appState.user.birthday,
      });
    },
    toggleJobFavorite(id) {
      const i = this.jobFavorites.indexOf(id);
      i < 0 ? this.jobFavorites.push(id) : this.jobFavorites.splice(i, 1);
    },
    applyJob(jobId, data, conflict) {
      const exists = this.applications.find(
        (a) => a.jobId === jobId && a.status !== "cancelled",
      );
      if (exists) return exists;
      const a = {
        id: crypto.randomUUID(),
        jobId,
        status: "pending",
        appliedAt: new Date().toLocaleString("zh-TW"),
        hasScheduleConflict: conflict,
        ...data,
      };
      this.applications.unshift(a);
      this.notifications.unshift({
        id: crypto.randomUUID(),
        type: "job",
        text: "應徵已送出（前端 Demo）",
        target: "/applications",
        read: false,
        time: "剛剛",
      });
      return a;
    },
    cancelApplication(id) {
      const a = this.applications.find((x) => x.id === id);
      if (a) a.status = "cancelled";
    },
    simulateApplication(id, status) {
      const a = this.applications.find((x) => x.id === id);
      if (a) {
        a.status = status;
        this.notifications.unshift({
          id: crypto.randomUUID(),
          type: "job",
          text: `應徵狀態已更新：${status}`,
          target: "/applications",
          read: false,
          time: "剛剛",
        });
      }
    },
    togglePostLike(id) {
      const p = this.posts.find((x) => x.id === id),
        u = "demo-user",
        i = p.likedBy.indexOf(u);
      i < 0 ? p.likedBy.push(u) : p.likedBy.splice(i, 1);
    },
    togglePostBookmark(id) {
      const i = this.postBookmarks.indexOf(id);
      i < 0 ? this.postBookmarks.push(id) : this.postBookmarks.splice(i, 1);
    },
    saveDraft(d) {
      this.discussion.draft = {
        ...d,
        updatedAt: new Date().toLocaleString("zh-TW"),
      };
    },
    publishPost(data, id) {
      if (id) {
        const p = this.posts.find((x) => x.id === id);
        Object.assign(p, data, {
          updatedAt: new Date().toLocaleString("zh-TW"),
        });
        return p;
      }
      const p = {
        id: `post-${Date.now()}`,
        authorId: "demo-user",
        authorName: appState.user.name,
        authorType: appState.user.role,
        verified: true,
        views: 0,
        likedBy: [],
        bookmarkedBy: [],
        bestAnswerId: null,
        status: "published",
        createdAt: new Date().toLocaleString("zh-TW"),
        ...data,
      };
      this.posts.unshift(p);
      this.discussion.draft = null;
      return p;
    },
    deletePost(id) {
      const p = this.posts.find((x) => x.id === id);
      if (p) p.status = "deleted";
    },
    addComment(postId, content, parentId = null, replyTo = "") {
      const c = {
        id: crypto.randomUUID(),
        postId,
        authorId: "demo-user",
        authorName: appState.user.name,
        content,
        parentId,
        replyTo,
        likedBy: [],
        createdAt: new Date().toLocaleString("zh-TW"),
      };
      this.comments.push(c);
      return c;
    },
    toggleCommentLike(id) {
      const c = this.comments.find((x) => x.id === id),
        i = c.likedBy.indexOf("demo-user");
      i < 0 ? c.likedBy.push("demo-user") : c.likedBy.splice(i, 1);
    },
    setBest(postId, id) {
      const p = this.posts.find((x) => x.id === postId);
      if (p) p.bestAnswerId = p.bestAnswerId === id ? null : id;
    },
    report(targetId, reason) {
      if (!this.reports.some((r) => r.targetId === targetId))
        this.reports.push({
          id: crypto.randomUUID(),
          targetId,
          reason,
          time: new Date().toISOString(),
        });
    },
    toggleIncomeFavorite(id) {
      const i = this.incomeFavorites.indexOf(id);
      i < 0 ? this.incomeFavorites.push(id) : this.incomeFavorites.splice(i, 1);
    },
    saveIncomeDraft(opportunityId, data) {
      const old = this.incomeJoins.find(
        (x) => x.opportunityId === opportunityId && x.status === "draft",
      );
      if (old) old.formData = data;
      else
        this.incomeJoins.push({
          id: crypto.randomUUID(),
          opportunityId,
          status: "draft",
          formData: data,
          updatedAt: new Date().toISOString(),
        });
    },
    joinIncome(opportunityId, data) {
      let j = this.incomeJoins.find((x) => x.opportunityId === opportunityId);
      if (j)
        Object.assign(j, {
          status: "reviewing",
          formData: data,
          submittedAt: new Date().toLocaleString("zh-TW"),
        });
      else {
        j = {
          id: crypto.randomUUID(),
          opportunityId,
          status: "reviewing",
          formData: data,
          submittedAt: new Date().toLocaleString("zh-TW"),
        };
        this.incomeJoins.unshift(j);
      }
      this.notifications.unshift({
        id: crypto.randomUUID(),
        type: "income",
        text: "額外收入申請已送出（前端 Demo）",
        target: "/income-records",
        read: false,
        time: "剛剛",
      });
      return j;
    },
    markAllRead() {
      this.notifications.forEach((n) => (n.read = true));
    },
    ensureChat(name) {
      let c = appState.chats.find((x) => x.name === name);
      if (!c) {
        c = {
          id: `partner-${Date.now()}`,
          name,
          abbr: name.slice(0, 1),
          color: "#b47a19",
          last: "開始新的合作對話",
          time: "現在",
          unread: 0,
          messages: [
            {
              id: 1,
              side: "them",
              text: "您好，歡迎透過 Demo 聊天室聯繫。",
              time: "現在",
            },
          ],
        };
        appState.chats.unshift(c);
      }
      return c.id;
    },
  },
});
