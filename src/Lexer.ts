export class Lexer {
    private words: string[]
    private pointerPosition: number = 0

    constructor(input: string) {
        this.words = input.match(/[^\s\n]+|\n/g) || [] // Find all words and newlines
    }

    public getNextToken(): Token {
        let token: Token
        token = this.parseToken(this.words[this.pointerPosition])

        this.pointerPosition += 1
        return token
    }

    private parseToken(word: string): Token {
        switch (word) {
            case undefined:
                return { type: 'EOF' }
            case 'print':
                return { type: 'PRINT' }
            case '=':
                return { type: 'ASSIGN' }
            case '+':
            case '-':
                return { type: 'OPERATOR', value: word }
            case '\n':
                return { type: 'NEWLINE' }
            default:
                if (/^[a-zA-Z]+$/.test(word)) {
                    return { type: 'IDENTIFIER', value: word }
                } else if (/^[0-9]+$/.test(word)) {
                    return { type: 'NUMBER', value: word }
                }
        }

        throw new Error(`Unexpected character: ${word}`)
    }
}

export type Token =
    | {
          type: 'IDENTIFIER' | 'NUMBER'
          value: string
      }
    | {
          type: 'OPERATOR'
          value: Operator
      }
    | {
          type: 'ASSIGN' | 'PRINT' | 'NEWLINE' | 'EOF'
      }

export type TokenType = Token['type']

export type Operator = '+' | '-'
