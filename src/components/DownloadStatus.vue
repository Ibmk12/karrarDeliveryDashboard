<template>
  <div class="k-dl-stack" aria-live="polite">
    <transition-group name="k-dl" tag="div">
      <div v-for="item in state.items" :key="item.id" class="k-dl" :class="'is-' + item.phase" role="status">
        <div class="k-dl-icon">
          <md-progress-spinner
            v-if="item.phase === 'preparing' || item.phase === 'downloading'"
            :md-diameter="22"
            :md-stroke="3"
            md-mode="indeterminate"
          ></md-progress-spinner>
          <md-icon v-else-if="item.phase === 'done'">check_circle</md-icon>
          <md-icon v-else>error_outline</md-icon>
        </div>
        <div class="k-dl-body">
          <strong>{{ $tt(item.label) }}</strong>
          <span v-if="item.phase === 'preparing'">
            {{ $tt('Preparing your file…') }} <b>{{ elapsed(item) }}</b>
            <small v-if="now - item.startedAt > 5000">{{ $tt('Large reports can take a minute.') }}</small>
          </span>
          <span v-else-if="item.phase === 'downloading'">
            <template v-if="item.total">{{ $tt('Downloading {a} of {b}', { a: size(item.loaded), b: size(item.total) }) }}</template>
            <template v-else>{{ $tt('Downloading {a}', { a: size(item.loaded) }) }}</template>
          </span>
          <span v-else-if="item.phase === 'done'">{{ $tt('Downloaded') }}<template v-if="item.fileName"> · <span dir="ltr">{{ item.fileName }}</span></template></span>
          <span v-else>{{ $tt('Export failed. Please try again.') }}</span>

          <div v-if="item.phase === 'preparing' || item.phase === 'downloading'" class="k-dl-bar">
            <span
              :class="{ 'is-indeterminate': !item.total }"
              :style="item.total ? { width: Math.round((item.loaded / item.total) * 100) + '%' } : null"
            ></span>
          </div>
        </div>
        <span v-if="item.phase === 'downloading' && item.total" class="k-dl-pct">{{ Math.round((item.loaded / item.total) * 100) }}%</span>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { downloadState } from "@/plugins/downloads";

export default {
  name: "DownloadStatus",
  data() {
    return { state: downloadState, now: Date.now(), timer: null };
  },
  mounted() {
    this.timer = setInterval(() => {
      if (this.state.items.length) this.now = Date.now();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    elapsed(item) {
      const s = Math.max(0, Math.floor((this.now - item.startedAt) / 1000));
      return s < 60 ? `${s}s` : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    },
    size(bytes) {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
      return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    },
  },
};
</script>
