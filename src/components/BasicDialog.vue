<template>
    <el-dialog v-model="model" :before-close="closeDialog">
        <div v-if="formConfig">
            <el-form ref="formRef" :model="form" :rules="formRules" label-width="auto">
                <div v-for="item in formConfig">
                    <div v-if="item.type === 'img'" class="img-is-select" @click="imgSelect">
                        <img v-if="form[item.prop]" :src="form[item.prop]" />
                        <img v-else src="@/assets/images/Bartender.png" alt="">
                    </div>

                    <el-form-item v-else :key="item.prop" :label="item.label" :prop="item.prop">

                        <el-input v-if="item.type === 'input'" v-model="form[item.prop]" v-bind="item.attrs || {}" />

                        <div v-if="item.type === 'icon'" class="icon-is-select">
                            <el-icon @click="iconSelectDialogOpen">
                                <component :is="form[item.prop]" />
                            </el-icon>
                        </div>

                    </el-form-item>
                </div>
            </el-form>
            <IconSelect ref="iconSelectRef" @select="iconSelect" />
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="closeDialog">取消</el-button>
                <el-button type="primary" @click="formConfirm(formRef)">
                    提交
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang='ts' setup>
import { reactive, ref, toRaw, watch, watchEffect } from 'vue';
import type { FormInstance } from 'element-plus'
import IconSelect from './IconSelect.vue'
import { ElMessage } from 'element-plus';

const emit = defineEmits(['submit'])
const model = defineModel()

export interface IFormConfigItem {
    label: string,
    prop: string,
    type: string,
    rules?: Array<any>,
    attrs?: Object
}
const props = defineProps({
    formConfig: Array<IFormConfigItem>,
    formData: Object,
    formType: {
        validator(value: string) {
            return ['add', 'edit'].includes(value)
        }
    }
})

// 表单数据
interface IFormItem {
    [key: string]: any
}
let form: IFormItem = reactive({})
let formRules: IFormItem = reactive({})
const formRef = ref<FormInstance>()
const iconSelectRef = ref()

watch(model, (newVal) => {
    if (newVal) {
        // 设置规则
        formRef.value?.resetFields()
        if (props.formConfig) {
            props.formConfig.forEach(item => {
                if (item.rules) formRules[item.prop] = item.rules
                if (item.type === 'icon') iconAttrName = item.prop
                if (item.type === 'img') imgAttrName = item.prop
            })
            // 默认添加图标
            if (props.formType === "add" && iconAttrName) {
                form[iconAttrName] = "Shop"
            }
        }
        if (props.formType === "edit") {
            Object.assign(form, props.formData)
        }
    } else {
        //清空数据(setTimeout避免内容闪烁)
        setTimeout(() => {
            form = reactive({})
            formRules = reactive({})
            iconAttrName = ''
        }, 10)
    }
})

// 图标选择
let iconAttrName = ''
const iconSelectDialogOpen = () => {
    iconSelectRef.value?.show()
}
const iconSelect = (name: string) => {
    form[iconAttrName] = name
}

// 图片选择
let imgAttrName = ''
const imgSelect = () => {
    const options = {
        type: 'image',
        filters: [
            { name: 'image', extensions: ['bmp', 'jpg', 'png', 'gif', 'ico', 'svg', 'jpeg'] },
        ]
    }
    window.ipcRenderer.invoke('dialog:openFile', options).then(files => {
        if (files) {
            const imgDetail = files[0]
            const isLt2M = imgDetail.info.size / 1024 / 1024 < 2;
            if (!isLt2M) return ElMessage.error('图片大小不能超过 2MB!');
            form[imgAttrName] = imgDetail.img.toDataURL()
        }
    })
}

const closeDialog = () => {
    model.value = false
}

const formConfirm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            emit('submit', toRaw(form))
        } else {
            console.error('error submit!', fields)
        }
    })
}

</script>

<style lang="scss" scoped>
.icon-is-select {
    color: var(--el-color-primary);
    font-size: 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.img-is-select {
    width: 100px;
    height: 100px;
    overflow: hidden;
    cursor: pointer;
    margin: auto;
    margin-bottom: 20px;

    img {
        width: 100%;
    }
}
</style>