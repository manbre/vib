
const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  //topBar: minimize, maximize and close window
  minApp: () => ipcRenderer.send("minApp"),
  maxApp: () => ipcRenderer.send("maxApp"),
  closeApp: () => ipcRenderer.send("closeApp"),

  //sourceForm: select folder from harddrive
  selectFolder: () => ipcRenderer.invoke("selectDirectory"),
})


