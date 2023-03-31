<template>
  <div class="row justify-content-end mb-4">
    <div class="col-md-3 col-sm-6 d-grid">
      <button class="btn btn-success btn-sm" @click="$router.push('/vehicles')">
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
        <div class="col-md-6 col-sm-12">
          <label class="form-label fs-6 fw-bold text-dark">Marka</label>
          <Field
              tabindex="1"
              class="form-control form-control-lg"
              type="text"
              name="brand"
              autocomplete="off"
              v-model.trim="formData.brand"
          />
        </div>
        <div class="col-md-6 col-sm-12">
          <label class="form-label fs-6 fw-bold text-dark">Model</label>
          <Field
              tabindex="1"
              class="form-control form-control-lg"
              type="text"
              name="model"
              autocomplete="off"
              v-model.trim="formData.model"
          />
        </div>
        </div>

        <div class="row mb-10">
          <div class="col-md-6 col-sm-4">
            <label class="form-label fs-6 fw-bold text-dark">Plaka Numarası</label>
            <Field
              tabindex="1"
              class="form-control form-control-lg"
              type="text"
              name="numberPlate"
              autocomplete="off"
              v-model.trim="formData.numberPlate"
            /> 
            <div class="fv-plugins-message-container">
              <div class="fv-help-block">
                <ErrorMessage name="numberPlate" />
              </div>
            </div>
          </div>
          <div class="col-md-6 col-sm-12">
            <label class="form-label fs-6 fw-bold text-dark">Kullanıcı Seçimi</label><br>
            <el-select v-model="formData.userId" filterable placeholder="Seçim yapınız" disabled>
              <el-option
              v-for="item in userList"
              :key="item.id"
              :label="`${item.name} ${item.surname}`"
              :value="item.id"
              />
            </el-select>
          </div>
        </div>

        <div class="row mb-10">
          <div class="col-md-12 col-sm-12">
            <label class="form-label fs-6 fw-bold text-dark">Not</label>
            <Field
              tabindex="1"
              class="form-control form-control-lg"
              type="text"
              name="note"
              autocomplete="off"
              v-model.trim="formData.note"
            />
          </div>
        </div>

      <div class="row">
        <div class="col-6">
          <button
            tabindex="3"
            type="button"
            ref="button"
            class="btn btn-lg btn-danger w-100 mb-5"
            @click="deleteVehicle()"
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
  name: "vehicleEdit",
  components: {
    Field,
    VForm,
    ErrorMessage,
  },
  setup() {
    Yup.setLocale(tr)
    const ApiService = new DevPlusApiService();
    const submitButton = ref<HTMLButtonElement | null>(null);
    const userList = ref();
    const router = useRouter();
    const route = useRoute();
    const formData = ref({ brand: '', model: '', numberPlate: '', userId: '', note: '', vehicleId: ''});

    onMounted(async () => {
      const userData = await ApiService.Post("user/get", { userId: -1 }, JwtService.getToken());
      userList.value = userData.body;

      const id = typeof route.params.id === 'string' ? parseInt(route.params.id) : route.params.id[0];
      const data = await ApiService.Post("vehicle/get", { vehicleId: id }, JwtService.getToken());

      formData.value.brand = data.body[0].brand;
      formData.value.model = data.body[0].model;
      formData.value.numberPlate = data.body[0].numberPlate;
      formData.value.userId = data.body[0].userId;
      formData.value.note = data.body[0].note;
      formData.value.vehicleId = data.body[0].vehicleId
    });

    const onSubmit = async (values: any) => {
    const data = { brand: values.brand, model: values.model, note: values.note, vehicleId: formData.value.vehicleId, numberPlate: values.numberPlate};
    console.log(data)
    const callback = await ApiService.Post("vehicle/update", data, JwtService.getToken());
    
    if (submitButton.value) {
      submitButton.value!.disabled = true;
      submitButton.value.setAttribute("data-kt-indicator", "on");
    }

    await messageModal(callback);

    submitButton.value?.removeAttribute("data-kt-indicator");
    submitButton.value!.disabled = false;

    router.push({ name: "vehicles" });
    };

    const deleteVehicle = async () => {
      const callback = await ApiService.Post("vehicle/delete", { vehicleId: formData.value.vehicleId }, JwtService.getToken());

      await messageModal(callback);

      router.push({ name: "vehicles" });
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
      deleteVehicle,
      formData,
      userList,
    };
  }
})

</script>