const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("lunaSuite", {
  platform: process.platform,
  version: process.versions.electron
});
