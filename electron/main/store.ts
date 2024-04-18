import Store from 'electron-store';

// 持久化存储数据
const appStore = new Store({ name: 'appData' });

export const saveStore = (storeName: string, data) => {
    appStore.set(storeName, data);
};

export const getStore = (storeName: string) => {
    return appStore.get(storeName);
};