<template>
  <div class="row justify-content-end mb-4">
    <div class="col-md-3 col-sm-6 d-grid">
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

    <DxPaging :page-size="10"/>
    <DxColumn type="buttons" caption="İşlemler">
      <DxButton 
        text="Düzenle"
        icon="/media/icons/duotune/general/gen055.svg"
        hint="Düzenle"
        @click="onEditClick"
      />
    </DxColumn>
    <DxFilterRow :visible="true"/>
  </DxDataGrid>
  </div>

</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import DevPlusApiService from "@/core/services/ApiServiceDevPlus";
import JwtService from "@/core/services/JwtService";
import { DxDataGrid, DxColumn, DxPaging, DxFilterRow, DxScrolling, DxButton } from 'devextreme-vue/data-grid';
import themes from 'devextreme/ui/themes';
import { useRouter } from "vue-router";

export default defineComponent({
  name: "users",
  components: {
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxFilterRow,
    DxScrolling,
    DxButton
  },
  methods: {
    onEditClick(e) {
      this.router.push({ name: 'userEdit', params: { id: e.row.data.id }});
    },
  },
  setup () {
    const ApiService = new DevPlusApiService();
    const router = useRouter();
    const userList = ref([]);

    onMounted(async () => {
      const data = await ApiService.Post("user/get", { userId: -1 }, JwtService.getToken());
      userList.value = data.body;
    });

    return {
      userList,
      allMode: 'allPages',
      checkBoxesMode: themes.current().startsWith('material') ? 'always' : 'onClick',
      router
    };
  }
});
</script>
