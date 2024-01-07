import router from "./router/index";
import { pinia } from "./store";
import Vue3Toasity from 'vue3-toastify';
import '@unocss/reset/tailwind.css'
import PrimeVue from 'primevue/config';
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import Tooltip from 'primevue/tooltip';

export const appPlugin = {
  install: (vueApp, options) => {
    vueApp.use(Vue3Toasity, { autoClose: 3000 })
    vueApp.use(PrimeVue, { ripple: true })
    vueApp.directive('tooltip', Tooltip);
    vueApp.use(pinia)
    vueApp.use(router);
  }
}