import type { Producer } from './ProducerSchemaTypes'

export type ProductWithoutProducer = {
    _id: string
    name: string
    vintage: string
    producerId: string
}

export type Product = {
    _id: string
    name: string
    vintage: string
    producerId: string
    producer: Producer
}