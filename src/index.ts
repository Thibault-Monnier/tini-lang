import * as fs from 'fs'
import * as path from 'path'

const filePath = process.argv[2]

if (!filePath) {
    console.error('Please provide a file path as an argument.')
    process.exit(1)
}

const fullPath = path.join('scripts', filePath)

fs.readFile(fullPath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading the file: ${err.message}`)
        process.exit(1)
    }

    console.warn('Program content:')
    console.log(data)
})
