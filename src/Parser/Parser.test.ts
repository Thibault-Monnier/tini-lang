import { Lexer } from '../Lexer'
import { Parser, ProgramNode } from './main'

interface TestCase {
    description: string
    input: string
    expectedAST: ProgramNode | null
    expectedError?: string
}

// Sample programs and expected ASTs for testing
const testCases: TestCase[] = [
    {
        description: 'Simple assignment and print',
        input: `
      a = 1
      b = 1 + 2
      print b + 3
    `,
        expectedAST: {
            type: 'Program',
            statements: [
                {
                    type: 'Assignment',
                    identifier: 'a',
                    expression: {
                        type: 'Literal',
                        value: 1,
                    },
                },
                {
                    type: 'Assignment',
                    identifier: 'b',
                    expression: {
                        type: 'BinaryOperation',
                        operator: '+',
                        left: {
                            type: 'Literal',
                            value: 1,
                        },
                        right: {
                            type: 'Literal',
                            value: 2,
                        },
                    },
                },
                {
                    type: 'Print',
                    expression: {
                        type: 'BinaryOperation',
                        operator: '+',
                        left: {
                            type: 'Identifier',
                            name: 'b',
                        },
                        right: {
                            type: 'Literal',
                            value: 3,
                        },
                    },
                },
            ],
        },
    },
    {
        description: 'Assignment with subtraction',
        input: `
      x = 10
      y = x - 4
      print y
    `,
        expectedAST: {
            type: 'Program',
            statements: [
                {
                    type: 'Assignment',
                    identifier: 'x',
                    expression: {
                        type: 'Literal',
                        value: 10,
                    },
                },
                {
                    type: 'Assignment',
                    identifier: 'y',
                    expression: {
                        type: 'BinaryOperation',
                        operator: '-',
                        left: {
                            type: 'Identifier',
                            name: 'x',
                        },
                        right: {
                            type: 'Literal',
                            value: 4,
                        },
                    },
                },
                {
                    type: 'Print',
                    expression: {
                        type: 'Identifier',
                        name: 'y',
                    },
                },
            ],
        },
    },
    {
        description: 'Assignment with multiplication',
        input: `
      x = 10
      y = x * 4
      print y
    `,
        expectedAST: {
            type: 'Program',
            statements: [
                {
                    type: 'Assignment',
                    identifier: 'x',
                    expression: {
                        type: 'Literal',
                        value: 10,
                    },
                },
                {
                    type: 'Assignment',
                    identifier: 'y',
                    expression: {
                        type: 'BinaryOperation',
                        operator: '*',
                        left: {
                            type: 'Identifier',
                            name: 'x',
                        },
                        right: {
                            type: 'Literal',
                            value: 4,
                        },
                    },
                },
                {
                    type: 'Print',
                    expression: {
                        type: 'Identifier',
                        name: 'y',
                    },
                },
            ],
        },
    },
    {
        description: 'Assignment with division',
        input: `
      x = 12
      y = x / 4
      print y
    `,
        expectedAST: {
            type: 'Program',
            statements: [
                {
                    type: 'Assignment',
                    identifier: 'x',
                    expression: {
                        type: 'Literal',
                        value: 12,
                    },
                },
                {
                    type: 'Assignment',
                    identifier: 'y',
                    expression: {
                        type: 'BinaryOperation',
                        operator: '/',
                        left: {
                            type: 'Identifier',
                            name: 'x',
                        },
                        right: {
                            type: 'Literal',
                            value: 4,
                        },
                    },
                },
                {
                    type: 'Print',
                    expression: {
                        type: 'Identifier',
                        name: 'y',
                    },
                },
            ],
        },
    },
    {
        description: 'Assignment with subtraction',
        input: `
      x = 10
      y = x - 4
      print y
    `,
        expectedAST: {
            type: 'Program',
            statements: [
                {
                    type: 'Assignment',
                    identifier: 'x',
                    expression: {
                        type: 'Literal',
                        value: 10,
                    },
                },
                {
                    type: 'Assignment',
                    identifier: 'y',
                    expression: {
                        type: 'BinaryOperation',
                        operator: '-',
                        left: {
                            type: 'Identifier',
                            name: 'x',
                        },
                        right: {
                            type: 'Literal',
                            value: 4,
                        },
                    },
                },
                {
                    type: 'Print',
                    expression: {
                        type: 'Identifier',
                        name: 'y',
                    },
                },
            ],
        },
    },
    {
        description: 'Undefined variable error',
        input: `
      print unknownVar
    `,
        expectedAST: {
            type: 'Program',
            statements: [
                {
                    type: 'Print',
                    expression: {
                        type: 'Identifier',
                        name: 'unknownVar',
                    },
                },
            ],
        },
    },
    {
        description: 'Syntax error due to missing operator',
        input: `
      a = 5
      b = a 5
    `,
        expectedAST: null,
        expectedError: 'Unexpected token',
    },
]

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
