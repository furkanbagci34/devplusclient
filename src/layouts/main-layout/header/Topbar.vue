<template>
  <div class="d-flex align-items-stretch overflow-auto py-0">
    <div class="d-flex align-items-center">
      <!-- <a
        href="#"
        class="btn btn-sm btn-icon btn-icon-muted btn-active-icon-primary"
        data-kt-menu-trigger="{default:'click', lg: 'hover'}"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end"
      >
        <span class="svg-icon theme-light-show svg-icon-2">
          <inline-svg
            :src="getAssetPath('media/icons/duotune/general/gen060.svg')"
          />
        </span>
        <span class="svg-icon theme-dark-show svg-icon-2">
          <inline-svg
            :src="getAssetPath('media/icons/duotune/general/gen061.svg')"
          />
        </span>
      </a> -->
      <KTThemeModeSwitcher></KTThemeModeSwitcher>
    </div>
  </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import KTThemeModeSwitcher from "@/layouts/main-layout/theme-mode/ThemeModeSwitcher.vue";

export default defineComponent({
  name: "layout-topbar",
  components: {
    KTThemeModeSwitcher,
  },
  setup() {
    return {
      getAssetPath,
    };
  },
});
</script>
