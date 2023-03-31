<template>
    <div class="row justify-content-end mb-4">
      <div class="col-md-3 col-sm-6 d-grid">
        <button class="btn btn-success btn-sm" @click="$router.push('/users')">
          <span class="bi bi-arrow-return-left align-items-center fs-6"> Listeye Geri Dön</span></button>
      </div>
    </div>
  
    <div class="row">
      <div class="d-flex flex-stack flex-grow-1 w-lg-500px p-5 col-2">
        <VForm
        class="form w-100"
        ref="signin"
        @submit="onSubmit"
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
              v-model.trim="formData.name"
            />
            <div class="fv-plugins-message-container">
              <div class="fv-help-block">
                <ErrorMessage name="name" />
              </div>
            </div>
          </div>
        </div>
  
        <div class="row">
          <div class="col-6">
            <button
              tabindex="3"
              type="button"
              ref="button"
              class="btn btn-lg btn-danger w-100 mb-5"
              @click="deleteUser()"
              >
              <span class="indicator-label"> Sil </span>
              <span class="indicator-progress">
                Lütfen Bekleyin...
                <span
                class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>
          </div>
          <div class="col-6">
            <button
              tabindex="3"
              type="submit"
              ref="submitButton"
              class="btn btn-lg btn-primary w-100 mb-5"
              >
              <span class="indicator-label"> Güncelle </span>
              <span class="indicator-progress">
                  Lütfen Bekleyin...
                  <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                  ></span>
              </span>
            </button>
          </div>
        </div>
        </VForm>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from "vue";
  import DevPlusApiService from "@/core/services/ApiServiceDevPlus";
  import JwtService from "@/core/services/JwtService";
  import { ErrorMessage, Field, Form as VForm } from "vee-validate";
  import * as Yup from "yup";
  import { tr } from 'yup-locales';
  import Swal from "sweetalert2";
  import { useRouter, useRoute  } from "vue-router";
  
  export default defineComponent({
    name: "userEdit",
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
      const route = useRoute();
      const formData = ref({ name: '', id: 0 });
  
      onMounted(async () => {
        const id = typeof route.params.id === 'string' ? parseInt(route.params.id) : route.params.id[0];
        const data = await ApiService.Post("user/get", { userId: id }, JwtService.getToken());
        formData.value.name = data.body[0].name;
        formData.value.id = data.body[0].id;
      });
  
      const onSubmit = async (values: any) => {
      const data = { name: values.name, id: formData.value.id };
      const callback = await ApiService.Post("operation/update", data, JwtService.getToken());
      
      if (submitButton.value) {
        submitButton.value!.disabled = true;
        submitButton.value.setAttribute("data-kt-indicator", "on");
      }
  
      await messageModal(callback);
  
      submitButton.value?.removeAttribute("data-kt-indicator");
      submitButton.value!.disabled = false;
  
      router.push({ name: "operation" });
      };
  
      const deleteUser = async () => {
        const callback = await ApiService.Post("operation/delete", { id: formData.value.id }, JwtService.getToken());
  
        await messageModal(callback);
  
        router.push({ name: "operation" });
      };
  
      const messageModal = async(callback) => {
        if (callback && callback.success) {
        Swal.fire({
        text: "İşleminiz başarıyla gerçekleştirildi.",
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
          text: callback.message as string,
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Tamam",
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semobold btn-light-danger",
          },
        })
      }
      }
  
      return {  
        onSubmit,
        submitButton,
        deleteUser,
        formData
      };
    }
  })
  
  </script>