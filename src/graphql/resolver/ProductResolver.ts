import Product from '../../model/ProductModel'
import Producer from '../../model/ProducerModel'
import { typeSafeUpdate } from '../utils'
import type {
  GetProductArgs,
  CreateProductArgs,
  UpdateProductArgs,
  DeleteProductArgs,
  DeleteProductsArgs,
  GetProductsByProducerIdArgs,
} from './types/ProductResolverTypes'

export const resolver = {
  getProduct: async ({ _id }: GetProductArgs) => {
    try {
      const product = await Product.findById(_id)
      product.producer = await Producer.findById(product.producerId)

      return product
    } catch (e) {
      console.log(e)
      throw new Error('Error getting product')
    }
  },
  getProducts: async () => {
    try {
      return await Product.find()
    } catch (e) {
      console.log(e)
      throw new Error('Error getting products')
    }
  },
  getProductsByProducerId: async ({
    producerId,
  }: GetProductsByProducerIdArgs) => {
    try {
      return await Product.find({ producerId })
    } catch (e) {
      console.log(e)
      throw new Error('Error getting products by producerId')
    }
  },
  createProduct: async ({ vintage, name, producerId }: CreateProductArgs) => {
    try {
      const producer = await Producer.findById(producerId)
      if (producerId && !producer) {
        throw new Error('Producer not found')
      }

      const product = await Product.create({ vintage, name, producerId })
      await product.save()

      return product
    } catch (e) {
      console.log(e)
      throw new Error('Error creating product')
    }
  },
  updateProduct: async ({
    _id,
    vintage,
    name,
    producerId,
  }: UpdateProductArgs) => {
    try {
      const product = await Product.findById(_id)
      product.vintage = typeSafeUpdate(product.vintage, vintage)
      product.name = typeSafeUpdate(product.name, name)
      product.producerId = typeSafeUpdate(product.producerId, producerId)

      await product.save()

      return product
    } catch (e) {
      console.log(e)
      throw new Error('Error updating product')
    }
  },
  deleteProduct: async ({ _id }: DeleteProductArgs) => {
    try {
      return await Product.findByIdAndDelete(_id)
    } catch (e) {
      console.log(e)
      throw new Error('Error deleting product')
    }
  },
  deleteProducts: async ({ productIds }: DeleteProductsArgs) => {
    try {
      if (productIds.length === 0) {
        return false
      }

      await Promise.all(
        productIds.map(async (_id) => {
          return Product.findByIdAndDelete(_id)
        }),
      )

      return true
    } catch (e) {
      console.log(e)
      throw new Error('Error deleting products')
    }
  },
}
