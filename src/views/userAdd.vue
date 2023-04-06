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
      @submit="onSubmitLogin"
      :validation-schema="login"
      :initial-values="{ name: '', surname: '', mobilePhone: '', email: '' }"
      >

      <div class="row mb-6">
          <div class="col-md-6 col-sm-12">
              <label class="form-label fs-6 fw-bold text-dark">Ad</label>
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
          <div class="col-md-6 col-sm-12">
              <label class="form-label fs-6 fw-bold text-dark">Soyad</label>
              <Field
                  tabindex="1"
                  class="form-control form-control-lg"
                  type="text"
                  name="surname"
                  autocomplete="off"
              />
              <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                      <ErrorMessage name="surname" />
                  </div>
              </div>
          </div>
      </div>

      <div class="row mb-10">
          <div class="col-md-6 col-sm-12">
              <label class="form-label fs-6 fw-bold text-dark">Telefon Numarası</label>
              <Field
                  tabindex="1"
                  class="form-control form-control-lg"
                  type="text"
                  name="mobilePhone"
                  autocomplete="off"
              />
              <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                      <ErrorMessage name="mobilePhone" />
                  </div>
              </div>
          </div>
          <div class="col-md-6 col-sm-12">
              <label class="form-label fs-6 fw-bold text-dark">E-Mail</label>
              <Field
                  tabindex="1"
                  class="form-control form-control-lg"
                  type="text"
                  name="email"
                  autocomplete="off"
              />
              <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                      <ErrorMessage name="email" />
                  </div>
              </div>
          </div>
      </div>

      <div class="text-center">
        <button
        tabindex="3"
        type="submit"
        ref="submitButton"
        class="btn btn-lg btn-primary w-100 mb-5"
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
import { useRouter } from "vue-router";
import * as Yup from "yup";
import { tr } from 'yup-locales';
import Swal from "sweetalert2";

export default defineComponent({
    name: "userAdd",
    components: {
        Field,
        VForm,
        ErrorMessage,
    },
    setup() {
      Yup.setLocale(tr)
      const ApiService = new DevPlusApiService();
      const router = useRouter();

      const submitButton = ref<HTMLButtonElement | null>(null);
      const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

      const login = Yup.object().shape({
        name: Yup.string().required().label("Ad"),
        surname: Yup.string().required().label("Soyad"),
        mobilePhone: Yup.string().matches(phoneRegExp, 'Lütfen geçerli numara giriniz').label("Telefon Numarası"),
        email: Yup.string().required().label("Soyad"),
      });

      const onSubmitLogin = async (values: any) => {
        const data =
        {
          name: values.name,
          surname: values.surname,
          mobilePhone: values.mobilePhone,
          email: values.email,
          password: "test"
        }
        
        const Callback = await ApiService.Post("user/signin", data, JwtService.getToken());

        if (submitButton.value) {
          submitButton.value!.disabled = true;
          submitButton.value.setAttribute("data-kt-indicator", "on");
        }

        if (Callback.success) {
            Swal.fire({
                text: "Kullanıcı başarıyla kaydedildi.",
                icon: "success",
                buttonsStyling: false,
                confirmButtonText: "Tamam",
                heightAuto: false,
                customClass: {
                    confirmButton: "btn fw-semobold btn-light-primary",
                },
            }).then(() => {
                router.push({ name: "users" });
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
      };
      
      return {
        onSubmitLogin,
        login,
        submitButton,
      };
    }
})

</script>