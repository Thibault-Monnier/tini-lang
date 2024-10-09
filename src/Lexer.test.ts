import { Lexer, Operator, Token } from './Lexer'

interface TestCase {
    description: string
    input: string
    expectedTokens: Token[]
    expectedError?: string
}

// Sample inputs and expected tokens for testing
const testCases: TestCase[] = [
    {
        description: 'Simple assignment',
        input: 'a = 1',
        expectedTokens: [
            { type: 'IDENTIFIER', value: 'a', lineNb: 1 },
            { type: 'ASSIGN', lineNb: 1 },
            { type: 'NUMBER', value: '1', lineNb: 1 },
            { type: 'EOF', lineNb: 1 },
        ],
    },
    {
        description: 'Assignment with addition an no spaces',
        input: 'b=1+2',
        expectedTokens: [
            { type: 'IDENTIFIER', value: 'b', lineNb: 1 },
            { type: 'ASSIGN', lineNb: 1 },
            { type: 'NUMBER', value: '1', lineNb: 1 },
            { type: 'OPERATOR', value: '+', lineNb: 1 },
            { type: 'NUMBER', value: '2', lineNb: 1 },
            { type: 'EOF', lineNb: 1 },
        ],
    },
    {
        description: 'Print statement',
        input: 'print b + 3',
        expectedTokens: [
            { type: 'PRINT', lineNb: 1 },
            { type: 'IDENTIFIER', value: 'b', lineNb: 1 },
            { type: 'OPERATOR', value: '+', lineNb: 1 },
            { type: 'NUMBER', value: '3', lineNb: 1 },
            { type: 'EOF', lineNb: 1 },
        ],
    },
    {
        description: 'Multiple statements with newlines and tabulations',
        input: `
        a=1
        b = a + 2 - 3
        print b`,
        expectedTokens: [
            { type: 'NEWLINE', lineNb: 1 },
            { type: 'IDENTIFIER', value: 'a', lineNb: 2 },
            { type: 'ASSIGN', lineNb: 2 },
            { type: 'NUMBER', value: '1', lineNb: 2 },
            { type: 'NEWLINE', lineNb: 2 },
            { type: 'IDENTIFIER', value: 'b', lineNb: 3 },
            { type: 'ASSIGN', lineNb: 3 },
            { type: 'IDENTIFIER', value: 'a', lineNb: 3 },
            { type: 'OPERATOR', value: '+', lineNb: 3 },
            { type: 'NUMBER', value: '2', lineNb: 3 },
            { type: 'OPERATOR', value: '-', lineNb: 3 },
            { type: 'NUMBER', value: '3', lineNb: 3 },
            { type: 'NEWLINE', lineNb: 3 },
            { type: 'PRINT', lineNb: 4 },
            { type: 'IDENTIFIER', value: 'b', lineNb: 4 },
            { type: 'EOF', lineNb: 4 },
        ],
    },
    {
        description: 'Unexpected character error',
        input: 'a = 1$',
        expectedTokens: [],
        expectedError: 'Unexpected character: found $',
    },
    {
        description: 'Many features test',
        input: `
        a=1 * 2
        b = a + 2 - 3


    print b`,
        expectedTokens: [
            { type: 'NEWLINE', lineNb: 1 },

            { type: 'IDENTIFIER', value: 'a', lineNb: 2 },
            { type: 'ASSIGN', lineNb: 2 },
            { type: 'NUMBER', value: '1', lineNb: 2 },
            { type: 'OPERATOR', value: '*', lineNb: 2 },
            { type: 'NUMBER', value: '2', lineNb: 2 },
            { type: 'NEWLINE', lineNb: 2 },

            { type: 'IDENTIFIER', value: 'b', lineNb: 3 },
            { type: 'ASSIGN', lineNb: 3 },
            { type: 'IDENTIFIER', value: 'a', lineNb: 3 },
            { type: 'OPERATOR', value: '+', lineNb: 3 },
            { type: 'NUMBER', value: '2', lineNb: 3 },
            { type: 'OPERATOR', value: '-', lineNb: 3 },
            { type: 'NUMBER', value: '3', lineNb: 3 },
            { type: 'NEWLINE', lineNb: 3 },

            { type: 'NEWLINE', lineNb: 4 },
            { type: 'NEWLINE', lineNb: 5 },

            { type: 'PRINT', lineNb: 6 },
            { type: 'IDENTIFIER', value: 'b', lineNb: 6 },
            { type: 'EOF', lineNb: 6 },
        ],
    },
    {
        description: 'Unexpected character error',
        input: 'a = 1$',
        expectedTokens: [],
        expectedError: 'Unexpected character: found $',
    },
]

describe('Lexer Tests', () => {
    testCases.forEach(({ description, input, expectedTokens, expectedError }) => {
        test(description, () => {
            const lexer = new Lexer(input)

            const tokens: Token[] = []
            let token: Token

            try {
                do {
                    token = lexer.getNextToken()
                    tokens.push(token)

                    if (tokens.length > 1000) {
                        throw new Error('Infinite loop while tokenizing')
                    }
                } while (token.type !== 'EOF')

                if (expectedError) {
                    throw new Error('Expected an error, got none')
                } else {
                    expect(tokens).toEqual(expectedTokens)
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
