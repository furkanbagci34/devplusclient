<template>
    <div class="row justify-content-end mb-4">
      <div class="col-md-3 col-sm-6 d-grid">
        <button class="btn btn-success btn-sm" @click="$router.push('/vehicleAdd')">
          <span class="bi bi-plus align-items-center fs-6"> Araç Tanımla</span>   
        </button>
      </div>
    </div>
  
    <div class="row">
      <DxDataGrid
      :data-source="vehicleList"
      :show-borders="true"
      :column-auto-width="true"
      @row-prepared="onRowPrepared"
    >
  
      <DxColumn data-field="brand" caption="Marka" />
      <DxColumn data-field="model" caption="Model" />
      <DxColumn data-field="numberPlate" caption="Plaka Numarası" />
      <DxColumn data-field="userName" caption="Müşteri Adı" width="150"/>
      <DxColumn type="buttons" caption="Düzenle" name="edit">
        <DxButton 
          text="Düzenle"
          icon="/media/icons/duotune/general/gen055.svg"
          hint="Düzenle"
          @click="onEditClick"
        />
      </DxColumn>
      <DxColumn type="buttons" caption="İşlemler" name="transaction">
        <DxButton 
          text="İşlemler"
          icon="/media/icons/duotune/files/fil025.svg"
          hint="İşlemler"
          @click="onOperationClick"
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
  import { DxDataGrid, DxColumn, DxPaging, DxSelection, DxFilterRow, DxButton} from 'devextreme-vue/data-grid';
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
      DxButton
    },
    methods: {
      onEditClick(e) {
        this.router.push({ name: 'vehicleEdit', params: { id: e.row.data.vehicleId }});
      },
      onOperationClick(e) {
        this.router.push({ name: 'operation', params: { id: e.row.data.vehicleId }});
      },
      onRowPrepared(e) {
        if(e.rowType === 'header') {
          e.rowElement.classList.add('grid-header');
        }
        if(e.rowType === 'data') {

          e.rowElement.classList.add('grid-datastyle');

          if (e.data.complateStatus == true)
            e.rowElement.classList.add('grid-bg-success');
          else 
            e.rowElement.classList.add('grid-bg-process');
        }
      }
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
  