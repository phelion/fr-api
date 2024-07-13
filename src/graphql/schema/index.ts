import { buildSchema } from 'graphql'

import { schema as common } from './common'
import { schema as ProductSchema } from './ProductSchema'
import { schema as ProducerSchema } from './ProducerSchema'

const concatenateSchemas = (schemas: string[]) => schemas.join('')
export default buildSchema(
    concatenateSchemas([
        common,
        ProductSchema,
        ProducerSchema
    ])
)