<template>
  <div class="row justify-content-end mb-4">
    <div class="col-md-3 col-sm-6 d-grid">
      <button class="btn btn-success btn-sm" @click="$router.push('/vehicles')">
        <span class="bi bi-arrow-return-left align-items-center fs-6"> Listeye Geri Dön</span></button>
    </div>
  </div>

  <div class="row">
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
            class="form-control "
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
            class="form-control "
            type="text"
            name="model"
            autocomplete="off"
            v-model.trim="formData.model"
        />
      </div>
      </div>

      <div class="row mb-5">
        <div class="col-md-6 col-sm-4">
          <label class="form-label fs-6 fw-bold text-dark">Plaka Numarası</label>
          <Field
            tabindex="1"
            class="form-control "
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

      <div class="row mb-5">
        <div class="col-md-6 col-sm-12">
          <label class="form-label fs-6 fw-bold text-dark">Yönetici Notları</label>
          <Field
            tabindex="1"
            class="form-control "
            type="text"
            name="adminNote"
            autocomplete="off"
            v-model.trim="formData.adminNote"
          />
        </div>
        <div class="col-md-6 col-sm-12">
          <label class="form-label fs-6 fw-bold text-dark">Müşteri Notları</label>
          <Field
            tabindex="1"
            class="form-control "
            type="text"
            name="customerNote"
            autocomplete="off"
            v-model.trim="formData.customerNote"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-12 mb-2">
          <el-transfer
            class="btn btn-white col-12 pt-0"
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
            :right-default-checked="elTransfervalue"
          />
        </div>
      </div>

    <div class="row">
      <div class="col-6">
        <button
          tabindex="3"
          type="button"
          ref="button"
          class="btn btn-danger w-100 mb-5"
          @click="deleteVehicle()"
          >
          Sil
        </button>
      </div>
      <div class="col-6">
        <button
          tabindex="3"
          type="submit"
          ref="submitButton"
          class="btn btn-primary w-100 mb-5"
          >
          Güncelle
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
    const formData = ref({ brand: '', model: '', numberPlate: '', userId: '', adminNote: '', customerNote: '', vehicleId: ''});
    let elTransferData = ref<any>();
    const elTransfervalue = ref<any>();

    onMounted(async () => {
      const userData = await ApiService.Post("user/get", { userId: -1 }, JwtService.getToken());
      userList.value = userData.body;

      const id = typeof route.params.id === 'string' ? parseInt(route.params.id) : route.params.id[0];
      const data = await ApiService.Post("vehicle/get", { vehicleId: id }, JwtService.getToken());
      const adminNote = await ApiService.Post("vehicle/noteGet", { vehicleId: id, type:1 }, JwtService.getToken());
      const customerNote = await ApiService.Post("vehicle/noteGet", { vehicleId: id, type:2 }, JwtService.getToken());

      formData.value.brand = data.body[0].brand;
      formData.value.model = data.body[0].model;
      formData.value.numberPlate = data.body[0].numberPlate;
      formData.value.userId = data.body[0].userId;
      formData.value.adminNote = adminNote.body[0]?.note;
      formData.value.customerNote = customerNote.body[0]?.note;
      formData.value.vehicleId = data.body[0].vehicleId;

      await operationProcess();
    });

    const onSubmit = async (values: any) => {
    const data = { brand: values.brand, model: values.model, adminNote: values.adminNote, vehicleId: formData.value.vehicleId, numberPlate: values.numberPlate};
    const callback = await ApiService.Post("vehicle/update", data, JwtService.getToken());
    
    await messageModal(callback);

    router.push({ name: "vehicles" });
    };

    const deleteVehicle = async () => {
      const callback = await ApiService.Post("vehicle/delete", { vehicleId: formData.value.vehicleId }, JwtService.getToken());
      await ApiService.Post("vehicle/operationDelete", { vehicleId: formData.value.vehicleId }, JwtService.getToken());
      await ApiService.Post("vehicle/noteDelete", { vehicleId: formData.value.vehicleId }, JwtService.getToken());

      await messageModal(callback);

      router.push({ name: "vehicles" });
    };

    const messageModal = async(callback) => {
      if (callback && callback.success) {
        Swal.fire({ text: "İşleminiz başarıyla gerçekleştirildi.", icon: "warning" });
      } else {
        Swal.fire({ text: callback.message as string, icon: "warning" });
      }
    }

    const operationProcess = async() => {
      const operationResult = await ApiService.Post("operation/get", { id: -1 }, JwtService.getToken());
      const vehicleOperationResult = await ApiService.Post("vehicle/operationGet", { vehicleId: formData.value.vehicleId }, JwtService.getToken());
      const operationData = operationResult.body;
      const vehicleOperationData = vehicleOperationResult.body;

      const data = operationData.map((operation) => ({
        value: operation.id,
        name: operation.name,
        disabled: false,
      }));

      elTransferData.value = data;

      const selectedIdList: any = [];

      vehicleOperationData.forEach((operation) => {
        selectedIdList.push(operation.operationId);
      });

      elTransfervalue.value = selectedIdList;
    }

    const filterMethod = (query, item) => {
      return item.name.toLowerCase().includes(query.toLowerCase())
    }

    return {  
      onSubmit,
      submitButton,
      deleteVehicle,
      formData,
      userList,
      elTransferData,
      elTransfervalue,
      filterMethod
    };
  }
})

</script>