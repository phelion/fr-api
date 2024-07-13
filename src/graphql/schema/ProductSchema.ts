export const schema = `
    type Product {
        _id: ID!
        vintage: String!
        name: String!
        producerId: ID!
        producer: Producer
    }
    
    type ProductWithoutProducer {
        _id: ID!
        vintage: String!
        name: String!
        producerId: ID!
    }
    
    extend type Query {
        getProduct(_id: ID!): Product
        getProducts: [ProductWithoutProducer]
        getProductsByProducerId(producerId: ID!): [ProductWithoutProducer]
    }
    
    extend type Mutation {
        createProduct(vintage: String!, name: String!, producerId: ID!): ProductWithoutProducer
        updateProduct(_id: ID!, vintage: String, name: String, producerId: ID): ProductWithoutProducer
        deleteProduct(_id: ID!): ProductWithoutProducer
        deleteProducts(productIds: [ID]!): Boolean
    }
`