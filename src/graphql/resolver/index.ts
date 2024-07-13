import { resolver as common} from './common'
import { resolver as ProducerResolver } from './ProducerResolver'
import { resolver as ProductResolver } from './ProductResolver'

export default {
    ...common,
    ...ProducerResolver,
    ...ProductResolver
}