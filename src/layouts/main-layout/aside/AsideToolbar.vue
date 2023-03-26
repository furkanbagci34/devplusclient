<template>
  <div
    class="aside-user d-flex align-items-sm-center justify-content-center py-5"
  >
    <div class="symbol symbol-50px">
      <img :src="getAssetPath('media/avatars/blank.png?>')" alt="" />
    </div>
    <div class="aside-user-info flex-row-fluid flex-wrap ms-5">
      <div class="d-flex">
        <div class="flex-grow-1 me-2">
          <a href="#" class="text-white text-hover-primary fs-6 fw-semobold"
            >{{authStore?.getUser?.name}} {{authStore?.getUser?.surname}}</a
          >

          <span class="text-gray-600 fw-semobold d-block fs-8 mb-1"
            >{{authStore?.getUser?.role}}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { useAuthStore } from "@/stores/auth";
import { defineComponent, ref, onMounted } from "vue";
import UserMenu from "@/layouts/main-layout/menus/UserAccountMenu.vue";

export default defineComponent({
  name: "kt--aside-toolbar",
  components: {
    UserMenu
  },
  setup() {
    const authStore = useAuthStore()

    return {
      getAssetPath,
      authStore
    };
  },
});
</script>
