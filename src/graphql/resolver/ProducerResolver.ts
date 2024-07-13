import Producer from '../../model/ProducerModel'
import { typeSafeUpdate } from '../utils'
import type {
  GetProducerArgs,
  CreateProducerArgs,
  DeleteProducerArgs,
  UpdateProducerArgs,
} from './types/ProducerResolverTypes'

export const resolver = {
  getProducer: async ({ _id }: GetProducerArgs) => {
    try {
      return await Producer.findById(_id)
    } catch (e) {
      console.log(e)
      throw new Error('Error getting producer')
    }
  },
  getProducers: async () => {
    try {
      return await Producer.find()
    } catch (e) {
      console.log(e)
      throw new Error('Error getting producers')
    }
  },
  createProducer: async ({ name, country, region }: CreateProducerArgs) => {
    try {
      const producer = await Producer.create({ name, country, region })
      await producer.save()

      return producer
    } catch (e) {
      console.log(e)
      throw new Error('Error creating producer')
    }
  },
  updateProducer: async ({
    _id,
    name,
    country,
    region,
  }: UpdateProducerArgs) => {
    try {
      const producer = await Producer.findById(_id)
      producer.name = typeSafeUpdate(producer.name, name)
      producer.country = typeSafeUpdate(producer.country, country)
      producer.region = typeSafeUpdate(producer.region, region)

      await producer.save()

      return producer
    } catch (e) {
      console.log(e)
      throw new Error('Error updating producer')
    }
  },
  deleteProducer: async ({ _id }: DeleteProducerArgs) => {
    try {
      return await Producer.findByIdAndDelete(_id)
    } catch (e) {
      console.log(e)
      throw new Error('Error deleting producer')
    }
  },
}
