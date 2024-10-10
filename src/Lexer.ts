export class Lexer {
    private reservedKeywords: Set<string> = new Set(['print'])

    private input: string
    private pointerPos = 0
    private lineNb = 1

    constructor(input: string) {
        this.input = input
    }

    public getNextToken(): Token {
        while (this.currentChar === ' ' || this.currentChar === '\t') this.pointerPos++

        if (this.pointerPos >= this.input.length) {
            return { type: 'EOF', lineNb: this.lineNb }
        }

        const lineNb = this.lineNb

        let token: BareToken | null = null
        const char = this.currentChar

        switch (true) {
            case /[0-9]/.test(char):
                token = this.extractLiteral()
                break
            case /[a-zA-Z]/.test(char):
                token = this.extractWord()
                break
            default:
                switch (char) {
                    case '\n':
                        token = { type: 'NEWLINE' }
                        this.lineNb++
                        break
                    case '=':
                    case '+':
                    case '-':
                    case '*':
                    case '/':
                        token = { type: char }
                        break
                }

                this.pointerPos++
        }

        if (token === null) {
            throw new Error(`Unexpected character: found ${char}`)
        } else {
            return { ...token, lineNb }
        }
    }

    private get currentChar(): string {
        return this.input[this.pointerPos]
    }

    private extractWord(): BareToken {
        const start = this.pointerPos
        while (typeof this.currentChar === 'string' && /[a-zA-Z]/.test(this.currentChar))
            this.pointerPos++

        const word = this.input.slice(start, this.pointerPos)
        if (this.reservedKeywords.has(word)) {
            switch (word) {
                case 'print':
                    return { type: 'PRINT' }
                default:
                    throw new Error(`Unexpected reserved keyword: found ${word}`)
            }
        } else {
            return { type: 'IDENTIFIER', value: word }
        }
    }

    private extractLiteral(): BareToken {
        const start = this.pointerPos
        while (/[0-9]/.test(this.currentChar)) this.pointerPos++

        const value = this.input.slice(start, this.pointerPos)
        return { type: 'LITERAL', value }
    }
}

type BareToken =
    | {
          type: 'IDENTIFIER' | 'LITERAL'
          value: string
      }
    | {
          type: 'PRINT' | 'NEWLINE' | 'EOF' | '+' | '-' | '*' | '/' | '='
      }

export type Token = BareToken & { lineNb: number }

export type TokenType = Token['type']
