// 1. COMMAND: A simple DTO (Data Transfer Object)
// It only contains the data required to perform an action (creating a product).
// It does NOT contain any business logic.
export class CreateProductCommand {
    constructor(
        public readonly name: string,
        public readonly price: number,
        public readonly description?: string
    ){}
}