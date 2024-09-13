export class Lexer {
    private input: string
    private position: number = 0
    private length: number

    constructor(input: string) {
        this.input = input
        this.length = input.length
    }

    // Get the next token
    public getNextToken(): Token {
        // TODO: Implement tokenization logic
        return { type: TokenType.EOF, value: '' } // Placeholder return
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
