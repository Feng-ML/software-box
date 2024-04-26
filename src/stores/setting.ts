import { defineStore } from "pinia";
import { reactive, toRaw, watch } from "vue";
import type { ISetting } from "~/types/globalTypes";

const useSettingStore = defineStore("globalSetting", () => {

    const setting: ISetting = reactive({
        theme: "light",
        isAutoStartup: false,
        isOpenAtStartup: true,
        isShowTrayIcon: true,

        isShowSoftwareName: false,

        isBallShow: true,
        isBallAlwaysOnTop: true,
        ballTransparency: 100,
        ballContent: 'icon'
    })

    window.ipcRenderer.invoke("get-global-setting").then((res) => {
        if (res) {
            Object.assign(setting, res)
            console.log(res);
        }
    })

    window.ipcRenderer.on("update-global-setting", (event, newValue) => {
        Object.assign(setting, newValue)
    })

    watch(setting, (newValue) => {
        window.ipcRenderer.send("set-global-setting", toRaw(newValue))
    })

    return {
        setting
    }
})

export default useSettingStore