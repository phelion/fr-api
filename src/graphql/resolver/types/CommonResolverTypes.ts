export type ProductWithProducer = {
  productName: string
  vintage: string
  producerName: string
  country?: string
  region?: string
}

export type CreateProductsWithProducerArgs = {
  productsWithProducer: ProductWithProducer[]
}
