
interface ISoftware {
    name: string;
    icon: string;
    path: string;
}

export interface ICategoryItem {
    id: string;
    name: string;
    icon: string;
    softwareList: Array<ISoftware>;
}