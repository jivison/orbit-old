import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import "@/reset.css";
import "@/assets/styles/_fonts.scss";
import SvgIcon from "./components/svg/SvgIcon.vue";

const app = createApp(App);
app.component("svg-icon", SvgIcon);
app.use(store);
app.use(router);
app.mount("#app");
