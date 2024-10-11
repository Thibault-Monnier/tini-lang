import { ProgramNode } from './nodeTypes'

interface TestCase {
    description: string
    input: string
    expectedAST: ProgramNode | null
    expectedError?: string
}

// Sample programs and expected ASTs for testing
export const testCases: TestCase[] = [
    {
        description: 'Term assignment and print',
        input: `
        a = 1
        print a
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
                    type: 'Print',
                    expression: {
                        type: 'Identifier',
                        name: 'a',
                    },
                },
            ],
        },
    },
    {
        description: 'Assignment with addition',
        input: `
        a = 1 + 2
        `,
        expectedAST: {
            type: 'Program',
            statements: [
                {
                    type: 'Assignment',
                    identifier: 'a',
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
                        left: {
                            type: 'Identifier',
                            name: 'x',
                        },
                        operator: '-',
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
        description: 'Unary operation',
        input: `
        a = -1
        print a
        `,
        expectedAST: {
            type: 'Program',
            statements: [
                {
                    type: 'Assignment',
                    identifier: 'a',
                    expression: {
                        type: 'UnaryOperation',
                        operator: '-',
                        argument: {
                            type: 'Literal',
                            value: 1,
                        },
                    },
                },
                {
                    type: 'Print',
                    expression: {
                        type: 'Identifier',
                        name: 'a',
                    },
                },
            ],
        },
    },
    {
        description: 'Binary operation',
        input: `
        a = 2 + 3
        print a
        `,
        expectedAST: {
            type: 'Program',
            statements: [
                {
                    type: 'Assignment',
                    identifier: 'a',
                    expression: {
                        type: 'BinaryOperation',
                        left: {
                            type: 'Literal',
                            value: 2,
                        },
                        operator: '+',
                        right: {
                            type: 'Literal',
                            value: 3,
                        },
                    },
                },
                {
                    type: 'Print',
                    expression: {
                        type: 'Identifier',
                        name: 'a',
                    },
                },
            ],
        },
    },
    {
        description: 'Depth 2 binary operation',
        input: `
      a = -1
      b = 1 + 2 - a
    `,
        expectedAST: {
            type: 'Program',
            statements: [
                {
                    type: 'Assignment',
                    identifier: 'a',
                    expression: {
                        type: 'UnaryOperation',
                        operator: '-',
                        argument: {
                            type: 'Literal',
                            value: 1,
                        },
                    },
                },
                {
                    type: 'Assignment',
                    identifier: 'b',
                    expression: {
                        type: 'BinaryOperation',
                        left: {
                            type: 'BinaryOperation',
                            left: {
                                type: 'Literal',
                                value: 1,
                            },
                            operator: '+',
                            right: {
                                type: 'Literal',
                                value: 2,
                            },
                        },
                        operator: '-',
                        right: {
                            type: 'Identifier',
                            name: 'a',
                        },
                    },
                },
            ],
        },
    },
    {
        description: 'Complex binary operation with unary operations and multiple layers',
        input: `
        a =-2
        b= -1 + 2 - 4 + a
        `,
        expectedAST: {
            type: 'Program',
            statements: [
                {
                    type: 'Assignment',
                    identifier: 'a',
                    expression: {
                        type: 'UnaryOperation',
                        operator: '-',
                        argument: {
                            type: 'Literal',
                            value: 2,
                        },
                    },
                },
                {
                    type: 'Assignment',
                    identifier: 'b',
                    expression: {
                        type: 'BinaryOperation',
                        left: {
                            type: 'BinaryOperation',
                            left: {
                                type: 'BinaryOperation',
                                left: {
                                    type: 'UnaryOperation',
                                    operator: '-',
                                    argument: {
                                        type: 'Literal',
                                        value: 1,
                                    },
                                },
                                operator: '+',
                                right: {
                                    type: 'Literal',
                                    value: 2,
                                },
                            },
                            operator: '-',
                            right: {
                                type: 'Literal',
                                value: 4,
                            },
                        },
                        operator: '+',
                        right: {
                            type: 'Identifier',
                            name: 'a',
                        },
                    },
                },
            ],
        },
    },
    {
        description: 'Simple order of operations',
        input: `
        print 2 + 3 * 4
        `,
        expectedAST: {
            type: 'Program',
            statements: [
                {
                    type: 'Print',
                    expression: {
                        type: 'BinaryOperation',
                        left: {
                            type: 'Literal',
                            value: 2,
                        },
                        operator: '+',
                        right: {
                            type: 'BinaryOperation',
                            left: {
                                type: 'Literal',
                                value: 3,
                            },
                            operator: '*',
                            right: {
                                type: 'Literal',
                                value: 4,
                            },
                        },
                    },
                },
            ],
        },
    },
    {
        description: 'Complex order of operations with multiple layers',
        input: `
        print 2 + 3 * 4 / 2 - 5 / 6 + 7
        `,
        expectedAST: {
            type: 'Program',
            statements: [
                {
                    type: 'Print',
                    expression: {
                        type: 'BinaryOperation',
                        left: {
                            type: 'BinaryOperation',
                            left: {
                                type: 'BinaryOperation',
                                left: {
                                    type: 'Literal',
                                    value: 2,
                                },
                                operator: '+',
                                right: {
                                    type: 'BinaryOperation',
                                    left: {
                                        type: 'BinaryOperation',
                                        left: {
                                            type: 'Literal',
                                            value: 3,
                                        },
                                        operator: '*',
                                        right: {
                                            type: 'Literal',
                                            value: 4,
                                        },
                                    },
                                    operator: '/',
                                    right: {
                                        type: 'Literal',
                                        value: 2,
                                    },
                                },
                            },
                            operator: '-',
                            right: {
                                type: 'BinaryOperation',
                                left: {
                                    type: 'Literal',
                                    value: 5,
                                },
                                operator: '/',
                                right: {
                                    type: 'Literal',
                                    value: 6,
                                },
                            },
                        },
                        operator: '+',
                        right: {
                            type: 'Literal',
                            value: 7,
                        },
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
    {
        description: 'Syntax error due to missing operator',
        input: `
      a = 5
      b = a + 2 5 - a
    `,
        expectedAST: null,
        expectedError: 'Unexpected token',
    },
    {
        description: 'Print statement with no expression',
        input: `
      print
    `,
        expectedAST: null,
        expectedError: 'Unexpected token',
    },
    {
        description: 'Assignment with missing expression',
        input: `
        a =
    `,
        expectedAST: null,
        expectedError: 'Unexpected token',
    },
    {
        description: 'Assignment with missing identifier',
        input: `
        = 5
    `,
        expectedAST: null,
        expectedError: 'Unexpected token',
    },
]
