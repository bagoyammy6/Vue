import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./reset/reset.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import "leaflet/dist/leaflet.css";
import "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

createApp(App).use(store).use(router).mount("#app");
