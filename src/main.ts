import { createApp } from "vue";
import { createPinia } from "pinia";
import { Tooltip } from "bootstrap";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import i18n from "@/core/plugins/i18n";
import { initInlineSvg } from "@/core/plugins/inline-svg";
import { initVeeValidate } from "@/core/plugins/vee-validate";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

initInlineSvg(app);
initVeeValidate();

app.use(i18n);

app.directive("tooltip", (el) => {
  new Tooltip(el);
});

app.mount("#app");
