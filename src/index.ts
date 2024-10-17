import * as fs from 'fs'
import * as path from 'path'
import { Parser } from './Parser/main'
import { Lexer } from './Lexer'
import util from 'util'
import chalk from 'chalk'
import { Interpreter } from './Interpreter'
import { printSeparator } from './printUtils'

const filePath = process.argv[2]

if (!filePath) {
    console.error('Please provide a file path.')
    process.exit(1)
}

const fullPath = path.join('scripts', filePath)
const isDebug = process.argv.includes('--debug')

fs.readFile(fullPath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading the file -> ${err.message}`)
        process.exit(1)
    }

    if (isDebug) {
        console.warn('Program content:')
        console.log(data)
        printSeparator()
    }

    try {
        const startTime = Date.now()

        const ast = new Parser(new Lexer(data)).parseProgram()

        if (isDebug) {
            console.log(
                chalk.blueBright.bold(
                    'AST:',
                    util.inspect(ast, {
                        showHidden: false,
                        depth: null,
                        colors: true,
                    }),
                ),
            )
        }

        new Interpreter(ast).interpret()

        const endTime = Date.now()
        console.log(chalk.greenBright.bold(`Execution time: ${endTime - startTime}ms`))
    } catch (e) {
        console.error((e as Error).message)
        process.exit(1)
    }
})
