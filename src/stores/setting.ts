import { defineStore } from "pinia";
import { reactive, toRaw, watch } from "vue";

const useSettingStore = defineStore("globalSetting", () => {

    const setting = reactive({
        theme: "light",
        isAutoStartup: false,
        isOpenAtStartup: true,
        isBallShow: true,
        isBallAlwaysOnTop: true,
    })

    window.ipcRenderer.invoke("get-global-setting").then((res) => {
        if (res) {
            Object.assign(setting, res)
            console.log(res);
        }
    })

    watch(setting, (newValue) => {
        window.ipcRenderer.send("set-global-setting", toRaw(newValue))
    })

    return {
        setting
    }
})

export default useSettingStore