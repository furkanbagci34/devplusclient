<template>
  <div class="demo-collapse">
    <el-collapse accordion v-for="op in operationList" v-model="activeOperation" @change="OperationChange">
      
      <el-collapse-item :name="`${op.operationId}-${op.status}`">
        <template #title>
          <div v-if="op.status == 0">
            <span class="fw-bolder">{{ op.operationName }}</span>&nbsp;&nbsp;
            <i class="bi bi-hourglass-top" style="font-size: 1.75rem; color: red;"></i>
          </div>

          <div v-if="op.status == 1">
            <span class="fw-bolder">{{ op.operationName }}</span>&nbsp;&nbsp;
            <i class="bi bi-wrench-adjustable-circle-fill" style="font-size: 1.75rem; color: orange;"></i>
          </div>

          <div v-if="op.status == 2">
            <span class="fw-bolder">{{ op.operationName }}</span>&nbsp;&nbsp;
            <i class="bi bi-check-circle-fill" style="font-size: 1.75rem; color: green;"></i>
          </div>
        </template>
        <el-radio-group v-model="operationStatus">
          <el-radio :label="'0'">Bekliyor</el-radio>
          <el-radio :label="'1'">Yapılıyor</el-radio>
          <el-radio :label="'2'">Tamamlandı</el-radio>
        </el-radio-group>
        <button class="btn btn-success btn-sm btn-xsm mb-3" @click="$router.push('/transaction')">
        <span class="bi bi-check-lg align-items-center fs-6"> Kaydet</span></button>
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
      const activeOperation = ref([''])
      const operationStatus = ref()

      const OperationChange = (val: string) => {
        if(!val) return;
        const splited = val.split('-')
        operationStatus.value = splited[1]

      }

      onMounted(async () =>{
        const id = typeof route.params.id === 'string' ? parseInt(route.params.id) : route.params.id[0];
        const data = await ApiService.Post("vehicle/operationGet", { vehicleId: id }, JwtService.getToken());
        operationList.value = data.body
        console.log(operationList.value)
      })

      return{
        operationList,
        activeOperation,
        OperationChange,
        operationStatus
      }
    }
})
</script>