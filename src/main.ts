import { createApp } from "vue";
import { createPinia } from "pinia";
import { Tooltip } from "bootstrap";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import i18n from "@/core/plugins/i18n";
import { initInlineSvg } from "@/core/plugins/inline-svg";
import { initVeeValidate } from "@/core/plugins/vee-validate";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);

initInlineSvg(app);
initVeeValidate();

app.use(i18n);

app.directive("tooltip", (el) => {
  new Tooltip(el);
});

app.mount("#app");
