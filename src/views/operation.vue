<template>
  <el-card shadow="always">
    <el-collapse accordion v-for="op in operationList" v-model="activeOperation" @change="operationChange(op.status,op.operationId)">
      
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

        <el-card shadow="always" style="background-color: azure;">
          <el-radio-group class="mt-2" v-model="operationStatus">
            <el-radio :label="0">Bekliyor</el-radio>
            <el-radio :label="1">Yapılıyor</el-radio>
            <el-radio :label="2">Tamamlandı</el-radio>
          </el-radio-group>
          <button class="btn btn-success btn-sm btn-xsm mb-3" @click="operationStatusSave">
          <span class="bi bi-check-lg align-items-center fs-6"> Kaydet</span></button> 
        </el-card>
        <br>

        <el-upload
          v-model:file-list="fileList"
          action="''"
          :multiple="true"
          list-type="picture-card"
          :auto-upload="false"
          :on-change="convertToBase64"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>

        <el-dialog v-model="dialogVisible" width="90%" class="text-center">
          <img w-full :src="dialogImageUrl" alt="Preview Image" class="img-fluid"/>
        </el-dialog>

      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<script lang="ts">
import DevPlusApiService from "@/core/services/ApiServiceDevPlus";
import JwtService from "@/core/services/JwtService";
import { defineComponent, ref, onMounted } from "vue";
import { useRoute  } from "vue-router";
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import Swal from "sweetalert2";

export default defineComponent({
    name: "operation",
    components: {

    },
    
    methods: {
      async convertToBase64(file) {
        const base64: any = await this.fileToBase64(file.raw)

        this.photoList.push(base64)
        this.operationPhotoCreate(this.photoList)
      },  
      fileToBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => resolve(reader.result)
          reader.onerror = error => reject(error)
        })
      }
    },

    setup () {
      const ApiService = new DevPlusApiService();
      const route = useRoute();
      const operationList = ref();
      const activeOperation = ref()
      const operationStatus = ref()
      const dialogImageUrl = ref('')
      const dialogVisible = ref(false)
      const fileList = ref<UploadUserFile[]>([])
      const photoList = ref<string[]>([])

      const operationChange = async (opStatus: any, opId: any) => {
        
        fileList.value = []
        photoList.value = []
        operationStatus.value = opStatus

        if(!activeOperation.value) return;

        const vehicleId = typeof route.params.id === 'string' ? parseInt(route.params.id) : route.params.id[0];
        const data = await ApiService.Post("vehicle/operationPhotoGet", { vehicleId: vehicleId, operationId: activeOperation.value,}, JwtService.getToken());

        if(data.success && data.success == true){

          data.body.forEach(i => {
            fileList.value.push({name: i.id, url: i.photo})
            photoList.value.push(i.photo)
          });
        }
      }

      const operationStatusSave = async () => {

        const vehicleId = typeof route.params.id === 'string' ? parseInt(route.params.id) : route.params.id[0];
        const data = await ApiService.Post("vehicle/operationUpdate", { vehicleId: vehicleId, operationId: activeOperation.value, status: operationStatus.value }, JwtService.getToken());
        
        if(data.success && data.success == true){
          const data = await ApiService.Post("vehicle/operationGet", { vehicleId: vehicleId }, JwtService.getToken());
          operationList.value = data.body
        }
      }

      const operationPhotoCreate = async (photoList: any) => {

        const vehicleId = typeof route.params.id === 'string' ? parseInt(route.params.id) : route.params.id[0];
        const data = await ApiService.Post("vehicle/operationPhotoCreate", { vehicleId: vehicleId, operationId: activeOperation.value, photoList: photoList }, JwtService.getToken());

      }

      const handleRemove: UploadProps['onRemove'] = async (uploadFile) => {
        const vehicleId = typeof route.params.id === 'string' ? parseInt(route.params.id) : route.params.id[0];
        const callback = await ApiService.Post("vehicle/operationPhotoDelete", { vehicleId: vehicleId, id: uploadFile.name }, JwtService.getToken());

        await messageModal(callback);
      }

      const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
        dialogImageUrl.value = uploadFile.url!
        dialogVisible.value = true
      }

      const messageModal = async(callback) => {
        if (callback && callback.success) {
          Swal.fire({ text: "İşleminiz başarıyla gerçekleştirildi.", icon: "success" });
        } else {
          Swal.fire({ text: callback.message as string, icon: "warning" });
        }
      }

      onMounted(async () =>{
        const vehicleId = typeof route.params.id === 'string' ? parseInt(route.params.id) : route.params.id[0];
        const data = await ApiService.Post("vehicle/operationGet", { vehicleId: vehicleId }, JwtService.getToken());
        operationList.value = data.body
      })

      return{
        operationList,
        fileList,
        photoList,
        activeOperation,
        operationStatus,
        dialogVisible,
        dialogImageUrl,
        operationChange,
        operationStatusSave,
        handleRemove,
        handlePictureCardPreview,
        operationPhotoCreate
      }
    }
})
</script>