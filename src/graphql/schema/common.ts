export const schema = `
    input ProductWithProducer {
        productName: String!
        vintage: String!
        producerName: String!
        country: String
        region: String
    }
    
    type Query {
        _empty: String
    }
    
    type Mutation {
        createProductsWithProducer(productsWithProducer: [ProductWithProducer]): [Product]
        fetchAndUpsertCSV: Boolean
    }
`
