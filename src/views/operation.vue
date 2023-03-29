<template>
  <div class="row justify-content-end mb-4">
    <div class="col-md-3 col-sm-6 d-grid">
    <button class="btn btn-success btn-sm" @click="$router.push('/operationAdd')">
      <span class="bi bi-plus align-items-center fs-6"> Operasyon Ekle</span>   
    </button>
    </div>
  </div>

  <div class="row">
    <DxDataGrid
      :data-source="operationList"
      :selection="{ mode: 'single' }"
      :show-borders="true"
      :hover-state-enabled="true"
      key-expr="id"
      >

      <DxColumn data-field="id" caption="Id" alignment="center" width="75" />
      <DxColumn data-field="name" caption="Ad" alignment="center" width="200" />
      <DxColumn type="buttons">
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
import { DxDataGrid, DxColumn, DxPaging, DxSelection, DxFilterRow, DxScrolling, DxButton } from 'devextreme-vue/data-grid';
import themes from 'devextreme/ui/themes';
import { useRouter } from "vue-router";

export default defineComponent({
  name: "operation",
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
    const operationList = ref([]);
    const router = useRouter();

    onMounted(async () => {
      const data = await ApiService.Post("operation/get", { id: -1 }, JwtService.getToken());
      operationList.value = data.body;
    });

    return {
      operationList,
      allMode: 'allPages',
      checkBoxesMode: themes.current().startsWith('material') ? 'always' : 'onClick',
      router
    };
  },
});

</script>