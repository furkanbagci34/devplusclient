<template>
  <div class="footer py-4 d-flex flex-lg-column" id="kt_footer">
    <div
      class="d-flex flex-column flex-md-row align-items-center justify-content-between"
      :class="{
        'container-fluid': footerWidthFluid,
        'container-xxl': !footerWidthFluid,
      }"
    >
      <div class="text-dark order-2 order-md-1">
        <span class="text-muted fw-semobold me-1">2023&copy;</span>
        <a
          href="https://keenthemes.com/"
          target="_blank"
          class="text-gray-800 text-hover-primary"
          >DevPlus</a
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { footerWidthFluid } from "@/core/helpers/config";

export default defineComponent({
  name: "KTFooter",
  setup() {
    return {
      footerWidthFluid,
    };
  },
});
</script>
