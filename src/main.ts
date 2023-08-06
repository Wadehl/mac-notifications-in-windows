import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import pageContainer from "./components/pageContainer.vue";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";

import router from "./router";

const app = createApp(App);
app.component("pageContainer", pageContainer);
app.use(router);
app.use(ArcoVueIcon);
app
  .mount("#app")
  .$nextTick(() => postMessage({ payload: "removeLoading" }, "*"));
