<template>
    <form class="basic-search" action="">
        <input v-model="searchValue" type="search" required placeholder="搜索">
        <el-icon class="search-icon" title="搜索">
            <Search />
        </el-icon>
    </form>
</template>

<script lang='ts' setup>
import { ref, watch } from 'vue';
const emit = defineEmits(['change'])

const searchValue = ref('')
watch(searchValue, (value) => {
    emit('change', value)
})

</script>

<style lang="scss" scoped>
form {
    position: relative;
    transition: all 1s;
    width: 30px;
    height: 30px;
    background: rgba(255, 255, 255, 0.5);
    box-sizing: border-box;
    border-radius: 25px;
    border: 4px solid rgba(255, 255, 255, 0.1);
    padding: 5px;
}

input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 22.5px;
    line-height: 30px;
    outline: 0;
    border: 0;
    display: none;
    font-size: 1em;
    border-radius: 20px;
    padding: 0 20px;
    background: transparent;
}

.search-icon {
    width: 22.5px;
    height: 22.5px;
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 50%;
    color: var(--el-text-color-primary);
    text-align: center;
    font-size: 1.2em;
    transition: all 1s;
}

form:hover,
form:valid {
    width: 200px;
    cursor: pointer;
}

form:hover input,
form:valid input {
    display: block;
}
</style>