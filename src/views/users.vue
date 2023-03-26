<template>
  <div class="row justify-content-end mb-4">
    <div class="col-3 d-grid">
      <button class="btn btn-success btn-sm" @click="$router.push('/userAdd')">
        <span class="bi bi-plus align-items-center fs-6"> Kullanıcı Ekle</span>   
      </button>
    </div>
  </div>

  <div class="row">
    <DxDataGrid
    :data-source="userList"
    :show-borders="true"
  >

    <DxColumn data-field="name" caption="Ad" />
    <DxColumn data-field="surname" caption="Soyad" />
    <DxColumn data-field="mobilePhone" caption="Telefon" />
    <DxColumn data-field="email" caption="E-Mail" :width="220"/>
    <DxColumn data-field="isEnabled" caption="Durum" data-type="boolean"/>

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
  name: "users",
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
    const userList = ref([]);

    onMounted(async () => {
      const data = await ApiService.Post("user/get", { userId: -1 }, JwtService.getToken());
      userList.value = data.body;
    });

    return {
      userList,
      allMode: 'allPages',
      checkBoxesMode: themes.current().startsWith('material') ? 'always' : 'onClick',
    };
  }
});
</script>
