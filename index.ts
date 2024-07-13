import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import schema from './src/graphql/schema'
import resolver from './src/graphql/resolver'
import { createHandler } from 'graphql-http/lib/use/express'

const app = express()

const mongoUser = process.env.DB_USER || 'root'
const mongoPass = process.env.DB_PASSWORD || 'root'
const mongoHost = 'mongo'
const mongoDb = 'main'

mongoose.connect(
  `mongodb://${mongoUser}:${mongoPass}@${mongoHost}/${mongoDb}?authSource=admin`,
)
mongoose.connection
  .once('open', () => {
    console.log('Connected to MongoDB')
  })
  .on('error', (error) => {
    console.log('MongoDB connection error:', error)
  })

app.all(
  '/graphql',
  createHandler({
    schema: schema,
    rootValue: resolver,
  }),
)

app.listen(process.env.API_PORT || 3000, () => {
  console.log(
    `Running a GraphQL API server at http://localhost:${process.env.API_PORT || 3000}/graphql`,
  )
})
