export class Lexer {
    private reservedKeywords: Set<string> = new Set(['print'])

    private input: string
    private pointerPos = 0
    private lineNb = 1

    constructor(input: string) {
        this.input = input
    }

    public getNextToken(): Token {
        if (this.pointerPos >= this.input.length) {
            return { type: 'EOF', lineNb: this.lineNb }
        }

        this.skipWhitespaces()

        const lineNb = this.lineNb

        let token: BareToken | null = null
        const char = this.input[this.pointerPos]

        if (this.isLetter(char)) {
            token = this.extractWord()
        } else if (this.isDigit(char)) {
            token = this.extractNumber()
        } else if (this.isOperator(char)) {
            token = this.extractOperator()
        } else {
            if (char === '\n') {
                token = { type: 'NEWLINE' }
                this.lineNb++
            } else if (char === '=') {
                token = { type: 'ASSIGN' }
            }

            this.pointerPos++
        }

        if (token === null) {
            throw new Error(`Unexpected character: found ${char}`)
        } else {
            return { ...token, lineNb }
        }
    }

    private isWhitespace(char: string) {
        return char === ' ' || char === '\t'
    }

    private skipWhitespaces() {
        while (this.isWhitespace(this.input[this.pointerPos])) {
            this.pointerPos++
        }
    }

    private isLetter(char: string): boolean {
        return typeof char === 'string' && /[a-zA-Z]/.test(char) // Make sure undefined doesn't return true
    }

    private extractWord(): BareToken {
        const start = this.pointerPos
        while (this.isLetter(this.input[this.pointerPos])) {
            this.pointerPos++
        }

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

    private isDigit(char: string): boolean {
        return /[0-9]/.test(char)
    }

    private extractNumber(): BareToken {
        const start = this.pointerPos
        while (this.isDigit(this.input[this.pointerPos])) {
            this.pointerPos++
        }

        const value = this.input.slice(start, this.pointerPos)
        return { type: 'NUMBER', value }
    }

    private isOperator(char: string): boolean {
        return Operators.has(char as Operator)
    }

    private extractOperator(): BareToken {
        const value = this.input[this.pointerPos]

        if (this.isOperator(value)) {
            this.pointerPos++
            return { type: 'OPERATOR', value: value as Operator }
        } else {
            throw new Error(`Unexpected operator: found ${value}`)
        }
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

const Operators = new Set(['+', '-', '*', '/'] as const)

export type Operator = typeof Operators extends Set<infer T> ? T : never
