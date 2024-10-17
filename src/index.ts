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
const isPerfLogging = process.argv.includes('--perf')

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
        const parserStartTime = Date.now()
        const ast = new Parser(new Lexer(data)).parseProgram()
        const parserEndTime = Date.now()

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

        const interpreterStartTime = Date.now()
        new Interpreter(ast).interpret()
        const interpreterEndTime = Date.now()

        if (isPerfLogging) {
            console.log(
                chalk.greenBright.bold('Parser execution time:'),
                parserEndTime - parserStartTime,
                'ms',
            )
            console.log(
                chalk.greenBright.bold('Interpreter execution time:'),
                interpreterEndTime - interpreterStartTime,
                'ms',
            )
        }
    } catch (e) {
        console.error((e as Error).message)
        process.exit(1)
    }
})
