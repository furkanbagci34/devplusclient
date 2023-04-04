<template>
  <div class="demo-collapse">
    <el-collapse accordion v-for="op in operationList" v-model="activeOperation" @change="OperationChange(op.status)">
      
      <el-collapse-item :name="op.operationId">
        
        <template #title>
          <div v-if="op.status == 0">
            <span class="fw-bolder fs-4">{{ op.operationName }}</span>&nbsp;&nbsp;
            <i class="bi bi-hourglass-top" style="font-size: 1.75rem; color: red;"></i>
          </div>

          <div v-if="op.status == 1">
            <span class="fw-bolder fs-4">{{ op.operationName }}</span>&nbsp;&nbsp;
            <i class="bi bi-wrench-adjustable-circle-fill" style="font-size: 1.75rem; color: orange;"></i>
          </div>

          <div v-if="op.status == 2">
            <span class="fw-bolder fs-4">{{ op.operationName }}</span>&nbsp;&nbsp;
            <i class="bi bi-check-circle-fill" style="font-size: 1.75rem; color: green;"></i>
          </div>
        </template>

        <el-radio-group v-model="operationStatus">
          <el-radio :label="0">Bekliyor</el-radio>
          <el-radio :label="1">Yapılıyor</el-radio>
          <el-radio :label="2">Tamamlandı</el-radio>
        </el-radio-group>
        <button class="btn btn-success btn-sm btn-xsm mb-3" @click="OperationStatusSave">
        <span class="bi bi-check-lg align-items-center fs-6"> Kaydet</span></button> 
        <br>
        

      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts">
import DevPlusApiService from "@/core/services/ApiServiceDevPlus";
import JwtService from "@/core/services/JwtService";
import { defineComponent, ref, onMounted } from "vue";
import { useRouter, useRoute  } from "vue-router";
import Swal from "sweetalert2";

export default defineComponent({
    name: "operation",
    components: {

    },
    setup () {
      const ApiService = new DevPlusApiService();
      const router = useRouter();
      const route = useRoute();
      const operationList = ref();
      const activeOperation = ref()
      const operationStatus = ref()

      const OperationChange = (opStatus: any) => {
        operationStatus.value = opStatus
      }

      const OperationStatusSave = async () => {

        const vehicleId = typeof route.params.id === 'string' ? parseInt(route.params.id) : route.params.id[0];
        const data = await ApiService.Post("vehicle/operationUpdate", { vehicleId: vehicleId, operationId: activeOperation.value, status: operationStatus.value }, JwtService.getToken());
        
        if(data.success && data.success == true){
          const data = await ApiService.Post("vehicle/operationGet", { vehicleId: vehicleId }, JwtService.getToken());
          operationList.value = data.body
        }
      }

      onMounted(async () =>{
        const vehicleId = typeof route.params.id === 'string' ? parseInt(route.params.id) : route.params.id[0];
        const data = await ApiService.Post("vehicle/operationGet", { vehicleId: vehicleId }, JwtService.getToken());
        operationList.value = data.body
      })

      return{
        operationList,
        activeOperation,
        OperationChange,
        operationStatus,
        OperationStatusSave
      }
    }
})
</script>