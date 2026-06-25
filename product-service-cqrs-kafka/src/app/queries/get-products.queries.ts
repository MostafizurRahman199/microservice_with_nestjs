// 1. QUERY: A simple DTO that describes what data we want to fetch
// It carries optional parameters like filters. It does NOT contain logic.
export class GetProductsQuery {
    constructor(
        public readonly filter?: Record<string, unknown>
    ) { }
}