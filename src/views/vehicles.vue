<template>
    <div class="row justify-content-end mb-4">
      <div class="col-3 d-grid">
        <button class="btn btn-success btn-sm" @click="$router.push('/vehicleAdd')">
          <span class="bi bi-plus align-items-center fs-6"> Araç Tanımla</span>   
        </button>
      </div>
    </div>
  
    <div class="row">
      <DxDataGrid
      :data-source="vehicleList"
      :show-borders="true"
    >
  
      <DxColumn data-field="brand" caption="Marka" />
      <DxColumn data-field="model" caption="Model" />
      <DxColumn data-field="numberPlate" caption="Plaka Numarası" />
      <DxColumn data-field="userName" caption="Müşteri Adı"/>
      <DxColumn type="buttons" caption="İşlemler">
        <DxButton 
          text="Düzenle"
          icon="/media/icons/duotune/general/gen055.svg"
          hint="Düzenle"
          @click="onEditClick"
        />
      </DxColumn>
  
      <DxPaging :page-size="10"/>
      <DxSelection
        :select-all-mode="allMode"
        :show-check-boxes-mode="checkBoxesMode"
        mode="single"
      />
      <DxFilterRow :visible="true"/>
    </DxDataGrid>
    </div>
  
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref } from "vue";
  import DevPlusApiService from "@/core/services/ApiServiceDevPlus";
  import JwtService from "@/core/services/JwtService";
  import { DxDataGrid, DxColumn, DxPaging, DxSelection, DxFilterRow, DxScrolling, DxButton} from 'devextreme-vue/data-grid';
  import themes from 'devextreme/ui/themes';
  import { useRouter } from "vue-router";
  
  export default defineComponent({
    name: "users",
    components: {
      DxDataGrid,
      DxColumn,
      DxPaging,
      DxSelection,
      DxFilterRow,
      DxScrolling,
      DxButton
    },
    methods: {
      onEditClick(e) {
        this.router.push({ name: 'operationEdit', params: { id: e.row.data.id }});
      },
    },
    setup () {
      const ApiService = new DevPlusApiService();
      const vehicleList = ref([]);
      const router = useRouter();
  
      onMounted(async () => {
        const data = await ApiService.Post("vehicle/get", { userId: -1 }, JwtService.getToken());
        vehicleList.value = data.body;
      });
  
      return {
        vehicleList,
        allMode: 'allPages',
        checkBoxesMode: themes.current().startsWith('material') ? 'always' : 'onClick',
        router
      };
    }
  });
  </script>
  