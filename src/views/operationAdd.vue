<template>
  <div class="row justify-content-end mb-4">
    <div class="col-md-3 col-sm-6 d-grid">
      <button class="btn btn-success btn-sm" @click="$router.push('/operation')">
        <span class="bi bi-arrow-return-left align-items-center fs-6"> Listeye Geri Dön</span></button>
    </div>
  </div>

  <div class="row">
    <div class="d-flex flex-stack flex-grow-1 w-lg-500px p-5 col-2">
      <VForm
      class="form w-100"
      @submit="onSubmit"
      :initial-values="{ name: ''}"
      >
      <div class="row mb-6">
        <div class="col-12">
          <label class="form-label fs-6 fw-bold text-dark">Operasyon Adı</label>
          <Field
            tabindex="1"
            class="form-control form-control-lg"
            type="text"
            name="name"
            autocomplete="off"
          />
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="name" />
            </div>
          </div>
        </div>
      </div>

      <div class="text-center">
        <button
        tabindex="3"
        type="submit"
        ref="submitButton"
        class="btn btn-lg btn-primary w-100"
        >
        <span class="indicator-label"> Kaydet </span>
        <span class="indicator-progress">
            Lütfen Bekleyin...
            <span
            class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
        </span>
        </button>
      </div>
      </VForm>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import DevPlusApiService from "@/core/services/ApiServiceDevPlus";
import JwtService from "@/core/services/JwtService";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import * as Yup from "yup";
import { tr } from 'yup-locales';
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "operationAdd",
  components: {
    Field,
    VForm,
    ErrorMessage,
  },
  setup() {
    Yup.setLocale(tr)
    const ApiService = new DevPlusApiService();
    const submitButton = ref<HTMLButtonElement | null>(null);
    const router = useRouter();

    const onSubmit = async (values: any) => {
    const data = { name: parseInt(values.name) };
    const Callback = await ApiService.Post("operation/create", data, JwtService.getToken());
    
    if (submitButton.value) {
      submitButton.value!.disabled = true;
      submitButton.value.setAttribute("data-kt-indicator", "on");
    }

    if (Callback && Callback.success) {
      Swal.fire({
      text: "Operasyon başarıyla kaydedildi.",
      icon: "success",
      buttonsStyling: false,
      confirmButtonText: "Tamam",
      heightAuto: false,
      customClass: {
        confirmButton: "btn fw-semobold btn-light-primary",
      },
      }).then(() => {

      })
    } else {
      Swal.fire({
        text: Callback.message as string,
        icon: "error",
        buttonsStyling: false,
        confirmButtonText: "Tamam",
        heightAuto: false,
        customClass: {
          confirmButton: "btn fw-semobold btn-light-danger",
        },
      })
    }

    submitButton.value?.removeAttribute("data-kt-indicator");
    submitButton.value!.disabled = false;

    router.push({ name: "operation" });
  };
    return {
      onSubmit,
      submitButton,
    };
  }
})

</script>