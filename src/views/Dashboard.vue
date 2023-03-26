<template>
    <div class="menu-item px-3">
      <a
        href="#"
        class="menu-link flex-stack px-3"
        data-bs-toggle="modal"
        data-bs-target="#kt_modal_invite_friends"
      >
        Invite Contacts

        <i
          class="fas fa-exclamation-circle ms-2 fs-7"
          data-bs-toggle="tooltip"
          title="Specify a contact email to send an invitation"
        ></i>
      </a>
    </div>

</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "dashboard-main",
  components: {

  },
});
</script>
