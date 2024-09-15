import { Lexer, Token } from './Lexer'

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
            { type: 'IDENTIFIER', value: 'a' },
            { type: 'ASSIGN' },
            { type: 'NUMBER', value: '1' },
            { type: 'EOF' },
        ],
    },
    {
        description: 'Assignment with addition',
        input: 'b = 1 + 2',
        expectedTokens: [
            { type: 'IDENTIFIER', value: 'b' },
            { type: 'ASSIGN' },
            { type: 'NUMBER', value: '1' },
            { type: 'OPERATOR', value: '+' },
            { type: 'NUMBER', value: '2' },
            { type: 'EOF' },
        ],
    },
    {
        description: 'Print statement',
        input: 'print b + 3',
        expectedTokens: [
            { type: 'PRINT' },
            { type: 'IDENTIFIER', value: 'b' },
            { type: 'OPERATOR', value: '+' },
            { type: 'NUMBER', value: '3' },
            { type: 'EOF' },
        ],
    },
    {
        description: 'Multiple statements with newlines',
        input: `
      a = 1
      b = a + 2 - 3
      print b
    `,
        expectedTokens: [
            { type: 'IDENTIFIER', value: 'a' },
            { type: 'ASSIGN' },
            { type: 'NUMBER', value: '1' },
            { type: 'NEWLINE' },
            { type: 'IDENTIFIER', value: 'b' },
            { type: 'ASSIGN' },
            { type: 'IDENTIFIER', value: 'a' },
            { type: 'OPERATOR', value: '+' },
            { type: 'NUMBER', value: '2' },
            { type: 'OPERATOR', value: '-' },
            { type: 'NUMBER', value: '3' },
            { type: 'NEWLINE' },
            { type: 'PRINT' },
            { type: 'IDENTIFIER', value: 'b' },
            { type: 'EOF' },
        ],
    },
    {
        description: 'Unexpected character error',
        input: 'a = 1 $',
        expectedTokens: [],
        expectedError: 'Unexpected character: $',
    },
]

describe('Lexer Tests', () => {
    testCases.forEach(({ description, input, expectedTokens, expectedError }) => {
        test(description, () => {
            const lexer = new Lexer(input.trim())

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
                    fail('Expected an error but tokenization succeeded.')
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
