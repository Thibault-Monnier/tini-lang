import { Lexer, Token, TokenType } from './Lexer'

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
            { type: TokenType.IDENTIFIER, value: 'a' },
            { type: TokenType.ASSIGN, value: '=' },
            { type: TokenType.NUMBER, value: '1' },
            { type: TokenType.EOF, value: '' },
        ],
    },
    {
        description: 'Assignment with addition',
        input: 'b = 1 + 2',
        expectedTokens: [
            { type: TokenType.IDENTIFIER, value: 'b' },
            { type: TokenType.ASSIGN, value: '=' },
            { type: TokenType.NUMBER, value: '1' },
            { type: TokenType.PLUS, value: '+' },
            { type: TokenType.NUMBER, value: '2' },
            { type: TokenType.EOF, value: '' },
        ],
    },
    {
        description: 'Print statement',
        input: 'print b + 3',
        expectedTokens: [
            { type: TokenType.PRINT, value: 'print' },
            { type: TokenType.IDENTIFIER, value: 'b' },
            { type: TokenType.PLUS, value: '+' },
            { type: TokenType.NUMBER, value: '3' },
            { type: TokenType.EOF, value: '' },
        ],
    },
    {
        description: 'Multiple statements with newlines',
        input: `
      a = 1
      b = a + 2
      print b
    `,
        expectedTokens: [
            { type: TokenType.IDENTIFIER, value: 'a' },
            { type: TokenType.ASSIGN, value: '=' },
            { type: TokenType.NUMBER, value: '1' },
            { type: TokenType.NEWLINE, value: '\n' },
            { type: TokenType.IDENTIFIER, value: 'b' },
            { type: TokenType.ASSIGN, value: '=' },
            { type: TokenType.IDENTIFIER, value: 'a' },
            { type: TokenType.PLUS, value: '+' },
            { type: TokenType.NUMBER, value: '2' },
            { type: TokenType.NEWLINE, value: '\n' },
            { type: TokenType.PRINT, value: 'print' },
            { type: TokenType.IDENTIFIER, value: 'b' },
            { type: TokenType.EOF, value: '' },
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
                } while (token.type !== TokenType.EOF && token.type !== TokenType.NEWLINE)

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
