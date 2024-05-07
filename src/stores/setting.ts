import { defineStore } from "pinia";
import { reactive, toRaw, watch } from "vue";
import type { ISetting } from "~/types/globalTypes";
import { debounce } from "@/utils/common"

const useSettingStore = defineStore("globalSetting", () => {

    const setting: ISetting = reactive({
        theme: "light",
        isAutoStartup: false,
        isOpenAtStartup: true,
        isShowTrayIcon: true,

        isShowSoftwareName: false,
        isShowSoftwareNameTooltip: true,
        softwareSize: 100,

        isBallShow: true,
        isBallAlwaysOnTop: true,
        ballTransparency: 100,
        ballContent: 'icon',

        dialogTransparency: 100
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

    const saveSetting = debounce(function () {
        window.ipcRenderer.send("set-global-setting", toRaw(setting))
    }, 1000)

    watch(setting, saveSetting)

    return {
        setting
    }
})

export default useSettingStore