<template>
    <el-card shadow="always">
      <el-collapse accordion v-for="op in operationList" v-model="activeOperation" @change="operationChange(op)">
        <el-collapse-item :name="op.operationId">
            <template #title>
                <div v-if="op.status == 0">
                    <span class="fw-bolder fs-4 text-center">{{ op.numberPlate }} - {{ op.operationName }}</span>&nbsp;&nbsp;
                    <i class="bi bi-hourglass-top" style="font-size: 1.75rem; color: red;"></i>
                </div>

                <div v-if="op.status == 1">
                    <span class="fw-bolder fs-4 text-center">{{ op.numberPlate }} - {{ op.operationName }}</span>&nbsp;&nbsp;
                    <i class="bi bi-wrench-adjustable-circle-fill" style="font-size: 1.75rem; color: orange;"></i>
                </div>

                <div v-if="op.status == 2">
                    <span class="fw-bolder fs-4 text-center">{{ op.numberPlate }} - {{ op.operationName }}</span>&nbsp;&nbsp;
                    <i class="bi bi-check-circle-fill" style="font-size: 1.75rem; color: green;"></i>
                </div>
            </template>

            <div class="demo-image__lazy">
                <el-image 
                v-for="data in photoList" 
                :key="data" 
                :src="data" 
                :zoom-rate="1.2"
                :preview-src-list="photoList"
                lazy />
            </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
</template>

<script lang="ts">
import DevPlusApiService from "@/core/services/ApiServiceDevPlus";
import JwtService from "@/core/services/JwtService";
import { defineComponent, ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import type { UploadUserFile } from 'element-plus'

export default defineComponent({
    name: "myVehicle",
    components: {

    },
    setup () {
        const operationList = ref();
        const ApiService = new DevPlusApiService();
        const authStore = useAuthStore();
        const operationStatus = ref();
        const activeOperation = ref();
        const photoList = ref<UploadUserFile[]>([])

        const operationChange = async (op ?: any) => {
            photoList.value = []

            if(typeof op.opStatus != 'undefined') operationStatus.value = op.opStatus;

            if(!activeOperation.value) return;

            const data = await ApiService.Post("vehicle/operationPhotoGet", { vehicleId: op.vehicleId, operationId: activeOperation.value,}, JwtService.getToken());

            if(data && data.success){
                photoList.value = []
                data.body.forEach(i => {
                    photoList.value.push(i.photo)
                });
            }
        }

        onMounted(async () =>{
            const data = await ApiService.Post("vehicle/myVehicle", { userId: authStore.getUser?.id }, JwtService.getToken());
            operationList.value = data.body;
        });

        return{
            operationStatus,
            operationList,
            operationChange,
            activeOperation,
            photoList
        }
    }
})
</script>

<style scoped>
    .demo-image__lazy {
    height: 400px;
    overflow-y: auto;
    }
    .demo-image__lazy .el-image {
    display: block;
    min-height: 200px;
    margin-bottom: 10px;
    }
    .demo-image__lazy .el-image:last-child {
    margin-bottom: 0;
    }
</style>