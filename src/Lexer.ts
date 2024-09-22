export class Lexer {
    private words: string[]
    private tokenNb = 0
    private lineNb = 0

    constructor(input: string) {
        this.words = input.match(/[^\s\n]+|\n/g) || [] // Find all words and newlines
    }

    public getNextToken(): Token {
        let token: Token
        token = { ...this.parseToken(this.words[this.tokenNb]), lineNb: this.lineNb }

        this.tokenNb += 1
        return token
    }

    private parseToken(word: string): BareToken {
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
                this.lineNb++
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

type BareToken =
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

export type Token = BareToken & { lineNb: number }

export type TokenType = Token['type']

export type Operator = '+' | '-'
