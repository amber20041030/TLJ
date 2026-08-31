import { reactive, watch } from "vue";
const pad = (n) => String(n).padStart(2, "0");
export const iso = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const formatDate = (s) =>
  s ? String(s).replaceAll("-", "/") : "尚未開通";
const now = new Date(),
  plus = (n) => {
    const d = new Date(now);
    d.setDate(d.getDate() + n);
    return iso(d);
  };
const defaults = {
  loggedIn: false,
  user: {
    name: "吳領隊",
    birthday: "1990-05-18",
    phone: "0912345678",
    role: "leader",
    certFront: "",
    certBack: "",
  },
  membership: { start: "", end: "" },
  tours: [
    {
      id: "t1",
      name: "北海道5日",
      start: plus(5),
      end: plus(9),
      note: "桃園機場第一航廈集合",
    },
    {
      id: "t2",
      name: "沖繩員工旅遊4日",
      start: plus(17),
      end: plus(20),
      note: "",
    },
  ],
  chats: [
    {
      id: "sunny",
      name: "晴日旅行社",
      abbr: "晴",
      color: "#d38b13",
      last: "想詢問您下個月可帶團的日期",
      time: "10:42",
      unread: 2,
      messages: [
        {
          id: 1,
          side: "them",
          text: "您好，想詢問您下個月可帶團的日期。",
          time: "10:38",
        },
        {
          id: 2,
          side: "me",
          text: "您好，我確認行事曆後回覆您。",
          time: "10:40",
        },
      ],
    },
    {
      id: "hokkaido",
      name: "北海道假期旅行社",
      abbr: "北",
      color: "#3d83a5",
      last: "集合時間是早上 06:30",
      time: "昨天",
      unread: 1,
      messages: [
        {
          id: 1,
          side: "them",
          text: "北海道團確認成團，集合時間是早上 06:30。",
          time: "昨天",
        },
      ],
    },
    {
      id: "island",
      name: "島嶼探索旅遊",
      abbr: "島",
      color: "#3c9d75",
      last: "謝謝您的報價，我們內部確認中",
      time: "週五",
      unread: 0,
      messages: [
        {
          id: 1,
          side: "them",
          text: "謝謝您的報價，我們內部確認中。",
          time: "週五",
        },
      ],
    },
    {
      id: "taoyuan",
      name: "桃園樂遊旅行社",
      abbr: "桃",
      color: "#c56352",
      last: "邀請您帶台積電參訪3日",
      time: "週四",
      unread: 3,
      messages: [
        {
          id: 1,
          side: "them",
          text: "想邀請您帶台積電參訪3日，方便合作嗎？",
          time: "週四",
        },
      ],
    },
    {
      id: "star",
      name: "星辰國際旅行社",
      abbr: "星",
      color: "#7866b2",
      last: "期待下次合作",
      time: "8/22",
      unread: 0,
      messages: [
        { id: 1, side: "them", text: "辛苦了，期待下次合作！", time: "8/22" },
      ],
    },
  ],
};
let saved;
try {
  saved = JSON.parse(localStorage.getItem("tourLeaderDemo"));
} catch {}
export const state = reactive(saved || structuredClone(defaults));
watch(
  state,
  (v) => {
    try {
      localStorage.setItem("tourLeaderDemo", JSON.stringify(v));
    } catch (e) {
      console.warn(e);
    }
  },
  { deep: true },
);
export const roleName = () => (state.user.role === "leader" ? "領隊" : "導遊");
