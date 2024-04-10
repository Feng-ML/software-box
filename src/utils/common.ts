
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

// 防抖
export function debounce(this: any, fn: Function, delay: number) {
    let timer: any;
    const _this = this;
    return function (...args: any[]) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(_this, args);
        }, delay);
    }
}

// 节流
export function throttle(this: any, fn: Function, delay: number) {
    let timer: any;
    const _this = this;
    return function (...args: any[]) {
        if (timer) return;
        timer = setTimeout(() => {
            fn.apply(_this, args);
            timer = null;
        }, delay);
    }
}