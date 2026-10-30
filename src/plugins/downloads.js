import Vue from "vue";

/**
 * Progress of file exports (Excel reports), shown by <download-status> in the
 * bottom corner: "Preparing your file… 12s" → "Downloading 1.4 MB of 3.2 MB" → "Ready".
 */
export const downloadState = Vue.observable({ items: [] });

let nextId = 1;

export function startDownload(label) {
  const item = Vue.observable({
    id: nextId++,
    label,
    phase: "preparing", // preparing | downloading | done | error
    loaded: 0,
    total: 0,
    startedAt: Date.now(),
    fileName: "",
  });
  downloadState.items.push(item);

  const remove = (delay) =>
    setTimeout(() => {
      const i = downloadState.items.indexOf(item);
      if (i !== -1) downloadState.items.splice(i, 1);
    }, delay);

  return {
    item,
    // pass as axios `onDownloadProgress`
    progress(e) {
      item.phase = "downloading";
      item.loaded = e.loaded || 0;
      item.total = e.total || (e.lengthComputable ? e.total : 0) || 0;
    },
    done(fileName) {
      item.phase = "done";
      item.fileName = fileName || "";
      remove(4000);
    },
    fail() {
      item.phase = "error";
      remove(6000);
    },
    dismiss() {
      remove(0);
    },
  };
}

export function isDownloading() {
  return downloadState.items.some((i) => i.phase === "preparing" || i.phase === "downloading");
}
