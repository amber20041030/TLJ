import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./styles.css";
import "./overrides.css";
import AuthView from "./views/AuthView.vue";
import PaymentView from "./views/PaymentView.vue";
import PaymentSuccessView from "./views/PaymentSuccessView.vue";
import HomeView from "./views/HomeView.vue";
import MessagesView from "./views/MessagesView.vue";
import ChatView from "./views/ChatView.vue";
import { state } from "./store.js";
import { useFeatureStore } from "./stores/features.js";
const routes = [
  { path: "/", redirect: () => (state.loggedIn ? "/home" : "/auth") },
  { path: "/auth", component: AuthView },
  { path: "/payment", component: PaymentView },
  { path: "/payment-success", component: PaymentSuccessView },
  { path: "/home", component: HomeView },
  { path: "/profile", component: () => import("./views/ProfileView.vue") },
  { path: "/jobs", component: () => import("./views/JobsView.vue") },
  {
    path: "/applications",
    component: () => import("./views/ApplicationsView.vue"),
  },
  { path: "/jobs/:id", component: () => import("./views/JobDetailView.vue") },
  {
    path: "/discussion",
    component: () => import("./views/DiscussionView.vue"),
  },
  {
    path: "/discussion/create",
    component: () => import("./views/PostEditorView.vue"),
  },
  {
    path: "/discussion/:id/edit",
    component: () => import("./views/PostEditorView.vue"),
  },
  { path: "/my-posts", component: () => import("./views/MyPostsView.vue") },
  {
    path: "/discussion/:id",
    component: () => import("./views/PostDetailView.vue"),
  },
  { path: "/income", component: () => import("./views/IncomeView.vue") },
  {
    path: "/income-records",
    component: () => import("./views/IncomeRecordsView.vue"),
  },
  {
    path: "/income/:id/join",
    component: () => import("./views/IncomeJoinView.vue"),
  },
  {
    path: "/income/:id",
    component: () => import("./views/IncomeDetailView.vue"),
  },
  { path: "/messages", component: MessagesView },
  { path: "/chat/:id", component: ChatView },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];
const router = createRouter({ history: createWebHistory(), routes });
router.beforeEach((to) => {
  if (
    !state.loggedIn &&
    !["/auth", "/payment", "/payment-success"].includes(to.path)
  )
    return "/auth";
  if (state.loggedIn && to.path === "/auth") return "/home";
});
const pinia = createPinia(),
  app = createApp(App);
app.use(pinia).use(router);
const features = useFeatureStore(pinia);
features.$subscribe(() => features.persist(), { detached: true });
app.mount("#app");
