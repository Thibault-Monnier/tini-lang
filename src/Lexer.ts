export class Lexer {
    private input: string
    private pointerPosition: number = 0
    private length: number

    constructor(input: string) {
        this.input = input
        this.length = input.length
        console.warn('Input:', input.split(' '))
    }

    // Get the next token
    public getNextToken(): Token {
        let token: Token
        try {
            token = this.parseToken(this.input.split(' ')[this.pointerPosition])
        } catch (error) {
            throw new Error('Problem parsing token')
        }

        this.pointerPosition += 1
        return token
    }

    private parseToken(word: string): Token {
        // TODO: Implement tokenization logic

        switch (word) {
            case undefined:
                return { type: TokenType.EOF, value: '' }
            case 'print':
                return { type: TokenType.PRINT, value: 'print' }
            case '=':
                return { type: TokenType.ASSIGN, value: '=' }
            case '+':
                return { type: TokenType.PLUS, value: '+' }
            case '-':
                return { type: TokenType.MINUS, value: '-' }
            case '\n':
                return { type: TokenType.NEWLINE, value: '\n' }
            default:
                if (/^[a-zA-Z]+$/.test(word)) {
                    return { type: TokenType.IDENTIFIER, value: word }
                } else if (/^[0-9]+$/.test(word)) {
                    return { type: TokenType.NUMBER, value: word }
                }
        }

        throw new Error(`Unexpected character: ${word}`)
    }
}

export enum TokenType {
    IDENTIFIER = 'IDENTIFIER',
    NUMBER = 'NUMBER',
    PRINT = 'PRINT',
    ASSIGN = 'ASSIGN',
    PLUS = 'PLUS',
    MINUS = 'MINUS',
    NEWLINE = 'NEWLINE',
    EOF = 'EOF',
}

export interface Token {
    type: TokenType
    value: string
}
