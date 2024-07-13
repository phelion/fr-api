export type GetProductArgs = {
    _id: string
}

export type GetProductsByProducerIdArgs = {
    producerId: string
}

export type CreateProductArgs = {
    vintage: string
    name: string
    producerId: string
}

export type UpdateProductArgs = {
    _id: string
    vintage?: string
    name?: string
    producerId?: string
}

export type DeleteProductArgs = {
    _id: string
}

export type DeleteProductsArgs = {
    productIds: string[]
}