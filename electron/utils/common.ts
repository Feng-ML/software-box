import { dialog } from "electron";

// 生成随机Id
export function generateRandomId(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export function tryToDo(fn: Function, errMsg?: string) {
    try {
        fn && fn()
    } catch (error) {
        console.log(error);
        dialog.showErrorBox('错误', errMsg || error.message)
    }
}