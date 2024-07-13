export const schema = `
    type Producer {
        _id: ID!
        name: String!
        country: String
        region: String
    }
    
    extend type Query {
        getProducer(_id: ID!): Producer
        getProducers: [Producer]
    }
    
    extend type Mutation {
        createProducer(name: String!, country: String, region: String): Producer
        updateProducer(_id: ID!, name: String, country: String, region: String): Producer
        deleteProducer(_id: ID!): Producer
    }
`
