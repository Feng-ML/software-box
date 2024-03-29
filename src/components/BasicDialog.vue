<template>
    <el-dialog v-model="dialogVisible" :title="title" width="500" :before-close="closeDialog">
        <div v-if="formConfig">
            <el-form ref="formRef" :model="form" :rules="formRules" label-width="auto">
                <el-form-item v-for="item in formConfig" :key="item.prop" :label="item.label" :prop="item.prop">
                    <el-input v-if="item.type === 'input'" v-model="form[item.prop as keyof IFormItem]" />
                    <div v-if="item.type === 'icon'" class="icon-is-select">
                        <el-icon @click="iconSelectOpen">
                            <component :is="iconName" />
                        </el-icon>
                    </div>
                </el-form-item>
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
import { reactive, ref, watch, watchEffect } from 'vue';
import type { Ref } from 'vue';
import type { FormInstance } from 'element-plus'

import IconSelect from './IconSelect.vue'

const emit = defineEmits(['update:modelValue', 'submit'])

export interface IFormConfigItem {
    label: String,
    prop: String,
    type: String,
    rules?: Array<any>
}
const props = defineProps({
    title: {
        type: String,
        default: "提示"
    },
    modelValue: Boolean,
    formConfig: Array<IFormConfigItem>,
})

// 表单数据
interface IFormItem {
    [key: string]: any
}
let form: IFormItem = reactive({})
let formRules: IFormItem = reactive({})
const formRef = ref<FormInstance>()
const iconSelectRef = ref()

let dialogVisible: Ref<boolean>
watch(() => props.modelValue, (newVal) => {
    dialogVisible = ref(newVal)
    if (newVal) {
        // 设置规则
        formRef.value?.resetFields()
        if (props.formConfig) {
            props.formConfig.forEach(item => {
                if (item.rules) formRules[item.prop as keyof IFormItem] = item.rules
            })
        }
    } else {
        //清空数据
        form = reactive({})
        formRules = reactive({})
    }
})

// 图标选择
const iconName = ref('Shop')
const iconSelectOpen = () => {
    iconSelectRef.value?.show()
}
const iconSelect = (name: string) => {
    iconName.value = name
}
watchEffect(() => {
    form.icon = iconName.value
})

const closeDialog = () => {
    emit('update:modelValue', false)
}

const formConfirm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            emit('submit', form)
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
</style>