<template>
  <div class="page d-flex flex-row flex-column-fluid">
    <KTAside
      v-if="asideEnabled"
      :lightLogo="themeLightLogo"
      :darkLogo="themeDarkLogo"
    />
    <div id="kt_wrapper" class="d-flex flex-column flex-row-fluid wrapper">
      <KTHeader />
      <div id="kt_content" class="content d-flex flex-column flex-column-fluid">
        <div class="post d-flex flex-column-fluid">
          <div
            id="kt_content_container"
            :class="{
              'container-fluid': contentWidthFluid,
              'container-xxl': !contentWidthFluid,
            }"
          >
            <router-view />
          </div>
        </div>
      </div>
      <KTFooter />
    </div>
    <KTModals />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  watch,
  nextTick,
  onBeforeMount,
} from "vue";
import { useRoute } from "vue-router";
import KTAside from "@/layouts/main-layout/aside/Aside.vue";
import KTHeader from "@/layouts/main-layout/header/Header.vue";
import KTFooter from "@/layouts/main-layout/footer/Footer.vue";
import KTModals from "@/components/modals/general/InviteFriendsModal.vue";
import { reinitializeComponents } from "@/core/plugins/keenthemes";
import {
  toolbarDisplay,
  loaderEnabled,
  contentWidthFluid,
  loaderLogo,
  asideEnabled,
  subheaderDisplay,
  themeLightLogo,
  themeDarkLogo,
} from "@/core/helpers/config";
import LayoutService from "@/core/services/LayoutService";

export default defineComponent({
  name: "master-layout",
  components: {
    KTAside,
    KTHeader,
    KTFooter,
    KTModals
  },
  setup() {
    const route = useRoute();

    onBeforeMount(() => {
      LayoutService.init();
    });

    onMounted(() => {
      nextTick(() => {
        reinitializeComponents();
      });
    });

    watch(
      () => route.path,
      () => {
        nextTick(() => {
          reinitializeComponents();
        });
      }
    );

    return {
      toolbarDisplay,
      loaderEnabled,
      contentWidthFluid,
      loaderLogo,
      asideEnabled,
      subheaderDisplay,
      themeLightLogo,
      themeDarkLogo,
    };
  },
});
</script>
