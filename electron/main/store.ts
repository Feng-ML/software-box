import Store from 'electron-store';

const categoryStore = new Store({ name: 'category' });

export const saveCategoryList = (category) => {
    categoryStore.set('categoryList', category);
};

export const getCategoryList = () => {
    return categoryStore.get('categoryList');
};