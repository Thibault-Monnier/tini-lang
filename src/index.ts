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
    console.error('Please provide a file path as an argument.')
    process.exit(1)
}

const fullPath = path.join('scripts', filePath)

fs.readFile(fullPath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading the file -> ${err.message}`)
        process.exit(1)
    }

    console.warn('Program content:\n')
    console.log(data)
    printSeparator()

    try {
        const ast = new Parser(new Lexer(data)).parseProgram()
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

        const output = new Interpreter(ast).interpret()
    } catch (e) {
        console.error((e as Error).message)
        process.exit(1)
    }
})
