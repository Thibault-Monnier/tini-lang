import { Lexer } from './Lexer'
import { Parser, ProgramNode } from './Parser'

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
                        type: 'Number',
                        value: 1,
                    },
                },
                {
                    type: 'Assignment',
                    identifier: 'b',
                    expression: {
                        type: 'BinaryOp',
                        operator: '+',
                        left: {
                            type: 'Number',
                            value: 1,
                        },
                        right: {
                            type: 'Number',
                            value: 2,
                        },
                    },
                },
                {
                    type: 'Print',
                    expression: {
                        type: 'BinaryOp',
                        operator: '+',
                        left: {
                            type: 'Identifier',
                            name: 'b',
                        },
                        right: {
                            type: 'Number',
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
                        type: 'Number',
                        value: 10,
                    },
                },
                {
                    type: 'Assignment',
                    identifier: 'y',
                    expression: {
                        type: 'BinaryOp',
                        operator: '-',
                        left: {
                            type: 'Identifier',
                            name: 'x',
                        },
                        right: {
                            type: 'Number',
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
        expectedError: 'Unexpected token', // Adjust based on your error message
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
                    fail('Expected an error but parsing succeeded.')
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
