import https from 'https'
import { Readable } from 'stream'
import readline from 'readline/promises'
import fs from 'fs'

import { resolver as commonResolver } from '../graphql/resolver/common'
import type { CreateProductsWithProducerArgs, ProductWithProducer } from '../graphql/resolver/types/CommonResolverTypes'

const CSV_URL = 'https://api.frw.co.uk/feeds/all_listings.csv'

/**
 * Fetches CSV from the given URL and upserts the data to the database.
 *
 * @returns Promise<void>
 */
export const fetchAndUpsertCSVAction = () => {
    return new Promise<void>((resolve, reject) => {

        // I wrote two solutions to get the CSV data, because I wasn't sure
        // if the task was to get it from the URL or from a local file.
        // Pick one of the following solutions and comment out the other.

        const csvStream = createCSVFetchStreamFromRemoteUrl(100)

        // const csvStream = createCSVFetchStreamFromLocalFile(100)

        let columnNames = false

        csvStream.on('data', (chunk) => {
            let chunkString = chunk.toString()

            if (!columnNames) {
                chunkString = chunkString.split('\n').slice(1).join('\n')
                columnNames = true
            }

            const parsedChunk = parseChunk(chunkString)
            const groupedChunk: CreateProductsWithProducerArgs = {
                productsWithProducer: groupByParsedChunk(parsedChunk)
            }

            commonResolver.createProductsWithProducer(groupedChunk)
                .catch((error) => {
                    reject(error)
                })
        })

        csvStream.on('end', () => {
            console.log('Stream ended')
            resolve()
        })

        csvStream.on('error', (error) => {
            console.error('Stream error:', error)
            reject(error)
        })
    })
}

/**
 * Creates a readable stream that fetches CSV data from the given URL.
 *
 * @param chunkSize The number of lines to read before emitting a chunk.
 * @returns Readable
 */
const createCSVFetchStreamFromRemoteUrl = (chunkSize: number): Readable => {
    const readable = new Readable({
        read() {}
    })

    let buffer: string[] = []
    let lineCount = 0
    let incompleteLine = ''

    const addLine = (line: string) => {
        buffer.push(line)
        lineCount++

        if (lineCount >= chunkSize) {
            readable.push(buffer.join('\n') + '\n')
            buffer = []
            lineCount = 0
        }
    }

    const endStream = () => {
        if (lineCount > 0) {
            readable.push(buffer.join('\n') + '\n')
        }
        readable.push(null)
    }

    https.get(CSV_URL, async (chunk) => {
        const rl = readline.createInterface({
            input: chunk,
            crlfDelay: Infinity
        })

        for await (let line of rl) {
            if (incompleteLine) {
                line = incompleteLine + line
                incompleteLine = ''
            }

            addLine(line)
        }

        endStream()
    }).on('error', (e) => {
        readable.emit('error', e)
    })

    return readable
}

/**
 * Creates a readable stream that fetches CSV data from the given local file.
 *
 * @param chunkSize The number of lines to read before emitting a chunk.
 * @returns Readable
 */
const createCSVFetchStreamFromLocalFile = (chunkSize: number): Readable => {
    const readable = new Readable({
        read() {} // No-op
    })

    let buffer: string[] = []
    let lineCount = 0
    let incompleteLine = ''

    const addLine = (line: string) => {
        buffer.push(line)
        lineCount++

        if (lineCount >= chunkSize) {
            readable.push(buffer.join('\n') + '\n')
            buffer = []
            lineCount = 0
        }
    }

    const endStream = () => {
        if (lineCount > 0) {
            readable.push(buffer.join('\n') + '\n')
        }
        readable.push(null)
    }

    const fileStream = fs.createReadStream('./assets/all_listings.csv')

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    })

    rl.on('line', (line) => {
        if (incompleteLine) {
            line = incompleteLine + line
            incompleteLine = ''
        }

        addLine(line)
    })

    rl.on('close', () => {
        endStream()
    })

    rl.on('error', (e) => {
        readable.emit('error', e)
    })

    return readable
}

/**
 * Parses a CSV chunk into an array of objects.
 *
 * @param chunk The chunk of CSV data to parse.
 * @returns ProductWithProducer[]
 */
const parseChunk = (chunk: string): ProductWithProducer[] => {
    const lines = chunk.split('\n').filter(line => line.trim() !== "")

    return lines.map((line): ProductWithProducer => {
        const [vintage, productName, producerName, country, region] = line.split(',')

        return {
            vintage: vintage || 'N/A',
            productName: productName || 'N/A',
            producerName: producerName || 'N/A',
            country,
            region
        }
    })
}

/**
 * groups by Vintage + Product Name + Producer as a unique field combination
 * @param parsedCsvChunk
 * @returns ParsedCsvChunk
 */
const groupByParsedChunk = (parsedCsvChunk: ProductWithProducer[]): ProductWithProducer[] => {
    const grouped: Record<string, ProductWithProducer> = {}

    for (const line of parsedCsvChunk) {
        const key = `${line.vintage}-${line.productName}-${line.producerName}`
        grouped[key] = line
    }

    return Object.values(grouped)
}
