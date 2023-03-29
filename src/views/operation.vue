<template>
    <div class="row justify-content-end mb-4">
        <div class="col-3 d-grid">
        <button class="btn btn-success btn-sm">
            <span class="bi bi-plus align-items-center fs-6"> Operasyon Ekle</span>   
        </button>
        </div>
    </div>

    <div class="row">
        <DxDataGrid
            :data-source="operationList"
            :show-borders="true"
            >

            <DxColumn data-field="id" caption="Id" alignment="center" width="200" />
            <DxColumn data-field="name" caption="Ad" alignment="center" />

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
import { DxDataGrid, DxColumn, DxPaging, DxSelection, DxFilterRow, DxScrolling } from 'devextreme-vue/data-grid';
import themes from 'devextreme/ui/themes';

export default defineComponent({
    name: "operation",
    components: {
        DxDataGrid,
        DxColumn,
        DxPaging,
        DxSelection,
        DxFilterRow,
        DxScrolling
    },

    setup () {
        const ApiService = new DevPlusApiService();
        const operationList = ref([]);

        onMounted(async () => {
            const data = await ApiService.Post("operation/get", { id: -1 }, JwtService.getToken());
            operationList.value = data.body;
        });

        return {
            operationList,
            allMode: 'allPages',
            checkBoxesMode: themes.current().startsWith('material') ? 'always' : 'onClick',
        };
    }
});

</script>