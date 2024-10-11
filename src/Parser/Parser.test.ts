import { Lexer } from '../Lexer'
import { Parser } from './main'
import { testCases } from './testCases.test'

describe('Parser Tests', () => {
    testCases.forEach(({ description, input, expectedAST, expectedError }) => {
        test(description, () => {
            try {
                const trimmedInput = input.trim()
                const lexer = new Lexer(trimmedInput)
                const parser = new Parser(lexer)
                const ast = parser.parseProgram()

                if (expectedError) {
                    throw new Error('Expected an error, got none')
                } else {
                    expect(ast).toEqual(expectedAST)
                }
            } catch (error: any) {
                if (expectedError) {
                    expect(error.message).toContain(expectedError)
                } else {
                    throw error
                }
            }
        })
    })
})
