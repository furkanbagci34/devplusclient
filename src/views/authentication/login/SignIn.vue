<template>
  <div class="w-lg-500px p-10">
    <VForm
      class="form w-100"
      id="kt_login_signin_form"
      @submit="onSubmitLogin"
      :validation-schema="login"
      :initial-values="{ phone: '', password: '' }"
    >
      <div class="text-center mb-10">
        <h1 class="text-dark mb-3">Giriş Yap</h1>
      </div>

      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-dark">Telefon Numarası</label>
        <Field
          tabindex="1"
          class="form-control form-control-lg"
          type="text"
          name="phone"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="phone" />
          </div>
        </div>
      </div>

      <div class="fv-row mb-10">
        <div class="d-flex flex-stack mb-2">
          <label class="form-label fw-bold text-dark fs-6 mb-0">Şifre</label>
        </div>
        <Field
          tabindex="2"
          class="form-control form-control-lg"
          type="password"
          name="password"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="password" />
          </div>
        </div>
      </div>

      <div class="text-center">
        <button
          tabindex="3"
          type="submit"
          ref="submitButton"
          id="kt_sign_in_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label"> Giriş </span>

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
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref } from "vue";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { tr } from 'yup-locales';
import JwtService from "@/core/services/JwtService";
import DevPlusApiService from "@/core/services/ApiServiceDevPlus";
Yup.setLocale(tr)

export default defineComponent({
  name: "sign-in",
  components: {
    Field,
    VForm,
    ErrorMessage,
  },
  setup() {
    const router = useRouter();
    const ApiService = new DevPlusApiService();
    
    const submitButton = ref<HTMLButtonElement | null>(null);
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const login = Yup.object().shape({
      phone: Yup.string().max(11).matches(phoneRegExp, 'Lütfen geçerli numara giriniz').label("Telefon Numarası"),
      password: Yup.string().min(4).required().label("Şifre"),
    });

    const onSubmitLogin = async (values: any) => {
      
      const data =
      {
        mobilePhone: values.phone,
        password: values.password
      }
      const Callback = await ApiService.Post("login/login", data);
      if (submitButton.value) {
        submitButton.value!.disabled = true;
        submitButton.value.setAttribute("data-kt-indicator", "on");
      }

      if (Callback.statusCode === 200) {
        Swal.fire({
          text: "Başarıyla giriş yaptınız. Yönlendiriliyorsunuz.",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Tamam",
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semobold btn-light-primary",
          },
        }).then(() => {
          JwtService.saveToken(Callback.body.accessToken);
          router.push({ name: "home" });
        });
      } else {
        Swal.fire({
          text: Callback.message as string,
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Try again!",
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
      getAssetPath,
    };
  },
});
</script>
