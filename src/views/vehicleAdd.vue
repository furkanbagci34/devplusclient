<template>
  <div class="row">

    <div class="card">
      <div class="card-header card-header-stretch">
        <ul
          class="nav nav-stretch nav-line-tabs fw-semobold border-0"
          role="tablist"
          id="kt_layout_builder_tabs"
          ref="kt_layout_builder_tabs"
        >
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: tabIndex === 0 }"
              data-bs-toggle="tab"
              data-tab-index="0"
              role="tab"
              @click="setActiveTab($event)"
            >
              Araç Bilgileri
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: tabIndex === 1 }"
              data-bs-toggle="tab"
              data-tab-index="1"
              role="tab"
              @click="setActiveTab($event)"
              :initial-values="{ name: '', surname: '', mobilePhone: '', email: '' }"
            >
              Operasyonlar
            </a>
          </li>
        </ul>
      </div>
    </div>

    <VForm
      class="form w-100"
      @submit="onSubmit"
      :validation-schema="vehicleShema"
      >
      <div class="card-body">
        <div class="tab-content" id="kt_tabs">
          <div
            class="tab-pane"
            :class="{ active: tabIndex === 0 }"
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
                /> 
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="numberPlate" />
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12">
                <label class="form-label fs-6 fw-bold text-dark">Kullanıcı Seçimi</label><br>
                <el-select v-model="user" filterable placeholder="Seçim yapınız">
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
          <div
            class="tab-pane"
            :class="{ active: tabIndex === 1 }"
          >
            <div class="row">
              <div class="col-12">
                <el-transfer
                  class="btn btn-white col-12"
                  v-model="elTransfervalue"
                  :titles="elTransferTitle"
                  :props="{
                    key: 'value',
                    label: 'desc',
                  }"
                  :data="elTransferData"
                />
              </div>
            </div>
            <div class="row pt-1">
              <div class="col-12 d-grid">
                <button
                tabindex="3"
                type="submit"
                ref="submitButton"
                class="btn btn-primary"
                >
                <span class="indicator-label"> Kaydet </span>
                </button>
              </div>
            </div>
          </div>
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
    const user = ref('')
    const userList = ref();
    const numberPlate = /^(0[1-9]|[1-7][0-9]|8[01])((\s?[a-zA-Z]\s?)(\d{4,5})|(\s?[a-zA-Z]{2}\s?)(\d{3,4})|(\s?[a-zA-Z]{3}\s?)(\d{2,3}))$/
    const submitButton = ref<HTMLButtonElement | null>(null);
    const tabIndex = ref(0);
    const elTransfervalue = ref([]);
    const elTransferTitle = ["Bekleyen","Atanan"];
    let elTransferData = ref<any>();

    const vehicleShema = Yup.object().shape({
      numberPlate: Yup.string().matches(numberPlate, 'Lütfen geçerli plaka giriniz').label("Plaka Numarası"),
    });

    onMounted(async () => {
      const userData = await ApiService.Post("user/get", { userId: -1 }, JwtService.getToken());
      userList.value = userData.body;
      tabIndex.value = 0;
    });

    const onSubmit = async (values: any) => {

      const data =
      {
        brand: values.brand,
        model: values.model,
        numberPlate: values.numberPlate,
        userId: user.value,
        note: values.note
      }

      const Callback = await ApiService.Post("vehicle/create", data, JwtService.getToken());

      if (submitButton.value) {
        submitButton.value!.disabled = true;
        submitButton.value.setAttribute("data-kt-indicator", "on");
      }

      if (Callback.success) {
        Swal.fire({
          text: "Araç başarıyla kaydedildi.",
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
    }

    const setActiveTab = async (event: any) => {
      tabIndex.value = parseInt(event.target.getAttribute("data-tab-index"));

      if (tabIndex.value !== 1) {
        return;
      }

      const result = await ApiService.Post("operation/get", { id: -1 }, JwtService.getToken());
      const operationData = result.body;

      const tmpData = operationData.map(operation => ({
        value: operation.id,
        desc: operation.name + "-" + operation.id,
        disabled: false
      }));

      elTransferData.value = tmpData;
    };
    
    return{
      user,
      userList,
      onSubmit,
      vehicleShema,
      submitButton,
      tabIndex,
      setActiveTab,
      elTransferData,
      elTransfervalue,
      elTransferTitle
    }
  }
})

</script>