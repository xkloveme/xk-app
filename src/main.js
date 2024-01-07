import { createApp } from "vue";
import "@/styles/app.scss";
import 'uno.css'
import { appPlugin } from './plugin'
import App from "./App.vue";

const app = createApp(App);
app.use(appPlugin);
app.mount("#app");
