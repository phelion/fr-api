import Producer from '../../model/ProducerModel'
import Product from '../../model/ProductModel'
import { fetchAndUpsertCSVAction } from '../../actions/fetchAndUpsertCSVAction'
import type { CreateProductsWithProducerArgs } from './types/CommonResolverTypes'

export const resolver = {
  // TODO: Add database transaction to ensure that both producer and product are created.
  // TODO: Unfortunately, because MongoDB's limitations, we need to make a replica set to use transactions,
  // TODO: which I felt a little bit overkill for this project.
  // TODO: more info: https://stackoverflow.com/questions/51461952/mongodb-v4-0-transaction-mongoerror-transaction-numbers-are-only-allowed-on-a
  createProductsWithProducer: async ({
    productsWithProducer,
  }: CreateProductsWithProducerArgs) => {
    try {
      const result = await Promise.all(
        productsWithProducer.map(async (productWithProducer) => {
          const producerArgs = {
            name: productWithProducer.producerName,
            country: productWithProducer.country,
            region: productWithProducer.region,
          }

          const producerQuery = await Producer.findOne(producerArgs)
          const producer =
            producerQuery || (await Producer.create(producerArgs))

          const product = new Product({
            name: productWithProducer.productName,
            vintage: productWithProducer.vintage,
            producerId: producer._id,
          })

          return {
            product: product,
            returnValue: {
              ...product.toObject(),
              producer: producer.toObject(),
            },
          }
        }),
      )

      const products = result.map(({ product }) => product)

      await Product.insertMany(products)

      return result.map(({ returnValue }) => returnValue)
    } catch (e) {
      console.log(e)
      throw new Error('Error creating products with producer')
    }
  },
  fetchAndUpsertCSV: async () => {
    console.log('start fetching and upserting CSV...')

    fetchAndUpsertCSVAction()
      .then(() => {
        console.log('CSV fetched and upserted to database!')
      })
      .catch((e) => {
        console.log('CSV fetching and upserting has been failed!', e)
      })

    return true
  },
}
