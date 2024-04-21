
declare type ISoftware = {
    id: string;
    name: string;
    icon: string;
    path: string;
}

export declare type ICategoryItem = {
    id: string;
    name: string;
    softwareList: Array<ISoftware>;
}