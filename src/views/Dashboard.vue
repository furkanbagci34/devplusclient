<template>

<div class="row g-5 g-xl-8">
    <div class="col-xl-4">
      <StatisticsWidget5
        widget-classes="card-xl-stretch mb-xl-8"
        :svg-icon="getAssetPath('media/icons/duotune/communication/com014.svg')"
        color="dark"
        icon-color="white"
        :title="`${userCount}`"
        description="Toplam Müşteri"
      ></StatisticsWidget5>
    </div>

    <div class="col-xl-4">
      <StatisticsWidget5
        widget-classes="card-xl-stretch mb-xl-8"
        :svg-icon="getAssetPath('media/icons/duotune/files/fil003.svg')"
        color="success"
        icon-color="white"
        :title="`${vehicleCount}`"
        description="Toplam Araç"
      ></StatisticsWidget5>
    </div>

    <div class="col-xl-4">
      <StatisticsWidget5
        widget-classes="card-xl-stretch mb-xl-8"
        :svg-icon="getAssetPath('media/icons/duotune/arrows/arr084.svg')"
        color="info"
        icon-color="white"
        title="$50,000"
        description="Tamamlanan Araç"
      ></StatisticsWidget5>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import DevPlusApiService from "@/core/services/ApiServiceDevPlus";
import JwtService from "@/core/services/JwtService";
import { getAssetPath } from "@/core/helpers/assets";
import StatisticsWidget5 from "@/components/widgets/statsistics/Widget5.vue";

export default defineComponent({
  name: "dashboard-main",
  components: {
    StatisticsWidget5
  },
  setup() {

    const ApiService = new DevPlusApiService();
    const userCount = ref('0');
    const vehicleCount = ref('0');

    onMounted(async () => {
      const user = await ApiService.Post("user/get", { userId: -1 }, JwtService.getToken());
      const vehicle = await ApiService.Post("vehicle/get", { userId: -1 }, JwtService.getToken());

      userCount.value = user.body.length;
      vehicleCount.value = vehicle.body.length;
    });

    return {
      getAssetPath,
      userCount,
      vehicleCount
    };
  },
});
</script>
