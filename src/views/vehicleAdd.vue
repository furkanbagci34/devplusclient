<template>
  <div class="row justify-content-end mb-4">
    <div class="col-md-3 col-sm-6 d-grid">
      <button class="btn btn-success btn-sm" @click="$router.push('/vehicles')">
        <span class="bi bi-arrow-return-left align-items-center fs-6"> Listeye Geri Dön</span></button>
    </div>
  </div>
  <div class="row">
    <VForm
      @submit="onSubmit"
      :validation-schema="vehicleShema"
      :initial-values="{ brand: '', model: ''}"
      >
      <div class="card-body">
        <div class="row">
          <div class="col-md-6 col-sm-12">
              <label class="form-label fs-6 fw-bold text-dark">Marka</label>
              <Field
                  tabindex="1"
                  class="form-control form-control"
                  type="text"
                  name="brand"
                  autocomplete="off"
              />
          </div>
          <div class="col-md-6 col-sm-12">
              <label class="form-label fs-6 fw-bold text-dark">Model</label>
              <Field
                  tabindex="1"
                  class="form-control form-control"
                  type="text"
                  name="model"
                  autocomplete="off"
              />
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-sm-4">
            <label class="form-label fs-6 fw-bold text-dark">Plaka Numarası</label>
            <Field
              tabindex="1"
              class="form-control form-control"
              type="text"
              name="numberPlate"
              autocomplete="off"
            /> 
            <div class="fv-plugins-message-container">
              <div class="fv-help-block">
                <ErrorMessage name="numberPlate" />
              </div>
            </div>
          </div>
          <div class="col-md-6 col-sm-12">
            <label class="form-label fs-6 fw-bold text-dark">Kullanıcı Seçimi</label><br>
            <el-select v-model="userId" filterable placeholder="Seçim yapınız">
              <el-option
              v-for="item in userList"
              :key="item.id"
              :label="`${item.name} ${item.surname}`"
              :value="item.id"
              />
            </el-select>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 col-sm-12">
            <label class="form-label fs-6 fw-bold text-dark">Not</label>
            <textarea
              tabindex="1"
              class="form-control"
              name="note"
              autocomplete="off"
            ></textarea>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <el-transfer
              class="btn btn-white col-12"
              v-model="elTransfervalue"
              filterable
              :filter-method="filterMethod"
              filter-placeholder="Arama"
              :titles="['Kaynak', 'Hedef']"
              :button-texts="['Çıkar', 'Ekle']"
              :props="{
                key: 'value',
                label: 'name',
              }"
              :data="elTransferData"
            />
          </div>
        </div>
        <div class="text-center">
          <button
          tabindex="3"
          type="submit"
          ref="submitButton"
          class="btn btn-primary col-12 d-grid"
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
      </div>
    </VForm>
  </div>
</template>

<script lang="ts">

import { defineComponent, ref, onMounted } from "vue";
import DevPlusApiService from "@/core/services/ApiServiceDevPlus";
import JwtService from "@/core/services/JwtService";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import * as Yup from "yup";
import Swal from "sweetalert2";

export default defineComponent({
  name: "vehicleAdd",
  components: {
    Field,
    VForm,
    ErrorMessage
  },
  setup () {
    const ApiService = new DevPlusApiService();
    const userId = ref();
    const userList = ref();
    const numberPlate = /^(0[1-9]|[1-7][0-9]|8[01])((\s?[a-zA-Z]\s?)(\d{4,5})|(\s?[a-zA-Z]{2}\s?)(\d{3,4})|(\s?[a-zA-Z]{3}\s?)(\d{2,3}))$/
    const submitButton = ref<HTMLButtonElement | null>(null);
    const elTransfervalue = ref([]);
    let vehicleId = -1;
    let elTransferData = ref<any>();

    const vehicleShema = Yup.object().shape({
      brand: Yup.string().required().label("Marka"),
      model: Yup.string().required().label("Model"),
      numberPlate: Yup.string().matches(numberPlate, 'Lütfen geçerli plaka giriniz').label("Plaka Numarası"),
    });

    onMounted(async () => {
      const userData = await ApiService.Post("user/get", { userId: -1 }, JwtService.getToken());
      userList.value = userData.body;

      await operationProcess();
    });

    const onSubmit = async (values: any) => {
      const vehicleData = {
        brand: values.brand,
        model: values.model,
        numberPlate: values.numberPlate,
        userId: userId.value,
      }

      const Callback = await ApiService.Post("vehicle/create", vehicleData, JwtService.getToken());

      console.log(Callback)

      if (submitButton.value) {
        submitButton.value!.disabled = true;
        submitButton.value.setAttribute("data-kt-indicator", "on");
      }

      if (Callback && Callback.success) {
        Swal.fire({
          text: "Araç başarıyla kaydedildi.",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Tamam",
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semobold btn-light-primary",
          },
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
    }

    const operationProcess = async() => {
      const result = await ApiService.Post("operation/get", { id: -1 }, JwtService.getToken());
      const operationData = result.body;

      const tmpData = operationData.map((operation, index) => ({
        value: index,
        name: operation.name,
        disabled: false,
      }));

      elTransferData.value = tmpData;
    }

    const filterMethod = (query, item) => {
      return item.name.toLowerCase().includes(query.toLowerCase())
    }

    return{
      userId,
      userList,
      onSubmit,
      vehicleShema,
      submitButton,
      elTransferData,
      elTransfervalue,
      filterMethod
    }
  }
})

</script>