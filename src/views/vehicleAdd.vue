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
      :initial-values="{ brand: 'Mercedes', model: 'Vito', note: '', numberPlate: ''}"
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
              <div class="fv-plugins-message-container">
              <div class="fv-help-block">
                <ErrorMessage name="brand" />
              </div>
            </div>
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
              <div class="fv-plugins-message-container">
              <div class="fv-help-block">
                <ErrorMessage name="model" />
              </div>
            </div>
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
            v-model="note"
            type="text"
            class="form-control form-control"
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
          Kaydet
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
import { tr } from 'yup-locales';
import Swal from "sweetalert2";
import { useRouter  } from "vue-router";

export default defineComponent({
  name: "vehicleAdd",
  components: {
    Field,
    VForm,
    ErrorMessage
  },
  setup () {
    Yup.setLocale(tr)
    const ApiService = new DevPlusApiService();
    const userId = ref();
    const note = ref();
    const userList = ref();
    const submitButton = ref<HTMLButtonElement | null>(null);
    const elTransfervalue = ref([]);
    const router = useRouter();
    let elTransferData = ref<any>();

    const vehicleShema = Yup.object().shape({
      brand: Yup.string().required().label("Marka"),
      model: Yup.string().required().label("Model"),
      numberPlate: Yup.string().required().label("Plaka"),
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

      if (Object.values(elTransfervalue.value).length === 0) {
        Swal.fire({ text: "Lütfen işlem seçimi yapınız.", icon: "warning" });
        return;
      } else if(typeof userId.value == "undefined") {
        Swal.fire({ text: "Lütfen kullanıcı seçimi yapınız.",icon: "warning" });
        return;
      }

      const Callback = await ApiService.Post("vehicle/create", vehicleData, JwtService.getToken());
      
      if (Callback && Callback.success) {
        await operationCreate(Callback.body[0].id);

        if (note.value !== "") {
          await noteCreate(Callback.body[0].id);
        }

        Swal.fire({ text: "Araç başarıyla kaydedildi.", icon: "success" });

        router.push({ name: "vehicles" });
      } else {
        Swal.fire({ text: Callback.message as string, icon: "error" });
      }
    }

    const operationProcess = async() => {
      const result = await ApiService.Post("operation/get", { id: -1 }, JwtService.getToken());
      const operationData = result.body;

      const tmpData = operationData.map((operation) => ({
        value: operation.id,
        name: operation.name,
        disabled: false,
      }));

      elTransferData.value = tmpData;
    }

    const filterMethod = (query, item) => {
      return item.name.toLowerCase().includes(query.toLowerCase())
    }

    const operationCreate = async (vehicleId) => {
      await ApiService.Post("vehicle/operationCreate", { vehicleId: vehicleId, operationList: Object.values(elTransfervalue.value) }, JwtService.getToken());
    }

    const noteCreate = async (vehicleId) => {
      await ApiService.Post("vehicle/noteCreate", { vehicleId: vehicleId, userId: userId.value, type: 1, note: note.value }, JwtService.getToken());
    }
 
    return{
      userId,
      note,
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