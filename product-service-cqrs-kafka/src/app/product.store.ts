// Define the shape of our Product entity
export interface Product {
    id: number;
    name: string;
    price: number;
    description?: string;
}

// 1. WRITE DB (Command side)
// This is our primary source of truth where all data changes happen first.
export const writeDB: Product[] = [];

// 2. READ DB (Query side)
// This is a strictly read-only database optimized for querying.
// It gets synchronized eventually when events are consumed from Kafka.
export const readDB: Product[] = [];
