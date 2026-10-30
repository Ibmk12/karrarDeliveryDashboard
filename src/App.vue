<template>
  <div class="k-app-root">
    <net-status></net-status>
    <download-status></download-status>
    <router-view></router-view>
  </div>
</template>

<script>
import NetStatus from "@/components/NetStatus.vue";
import DownloadStatus from "@/components/DownloadStatus.vue";

export default {
  components: { NetStatus, DownloadStatus },
};
</script>
