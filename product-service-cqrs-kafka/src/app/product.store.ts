export interface Product {
    id: number;
    name: string;
    price: number;
    description?: string;
}

export const writeDB: Product[] = [];
export const readDB: Product[] = [];
