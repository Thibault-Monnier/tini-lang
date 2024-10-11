import { Lexer, Token, TokenType } from '../Lexer'
import {
    ProgramNode,
    StatementNode,
    AssignmentNode,
    PrintNode,
    ExpressionNode,
    UnaryOperator,
    UnaryOperationNode,
    BinaryOperationNode,
    BinaryOperator,
    TermNode,
} from './nodeTypes'

export class Parser {
    private lexer: Lexer
    private currentToken: Token

    constructor(lexer: Lexer) {
        this.lexer = lexer
        this.currentToken = this.lexer.getNextToken()
    }

    private eat(tokenType: TokenType): void {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.lexer.getNextToken()
        } else {
            throw new Error(
                this.errorContext(this.currentToken) +
                    `Unexpected token type: expected ${tokenType}, got ${this.currentToken.type}`,
            )
        }
    }

    public parseProgram(): ProgramNode {
        const statements = this.parseStatements()
        return { type: 'Program', statements }
    }

    private parseStatements(): StatementNode[] {
        const statements: StatementNode[] = []

        while (this.currentToken.type !== 'EOF') {
            if (this.currentToken.type === 'NEWLINE') {
                this.eat('NEWLINE')
                continue
            }

            const statement = this.parseStatement()
            statements.push(statement)
        }

        return statements
    }

    private parseStatement(): StatementNode {
        switch (this.currentToken.type) {
            case 'IDENTIFIER':
                return this.parseAssignment(this.currentToken.value)
            case 'PRINT':
                return this.parsePrint()
            default:
                this.handleError(this.currentToken, 'statement')
        }
    }

    private parseAssignment(identifier: string): AssignmentNode {
        this.eat('IDENTIFIER')
        this.eat('=')
        const expression = this.parseExpression()
        return { type: 'Assignment', identifier, expression }
    }

    private parsePrint(): PrintNode {
        this.eat('PRINT')
        const expression = this.parseExpression()
        return { type: 'Print', expression }
    }

    private parseExpression(): ExpressionNode | never {
        const expressionTokens = []
        while (this.currentToken.type !== 'NEWLINE' && this.currentToken.type !== 'EOF') {
            expressionTokens.push(this.currentToken)
            this.eat(this.currentToken.type)
        }

        if (expressionTokens.length === 0) {
            this.handleError(this.currentToken, 'expression')
        }

        const firstToken = expressionTokens[0]
        if (expressionTokens.length === 1) {
            return this.parseTerm(firstToken)
        } else if (firstToken.type === '+' || firstToken.type === '-') {
            return this.parseUnaryOperation(firstToken.type, expressionTokens[1])
        } else {
            return this.parseBinaryOperation(expressionTokens)
        }
    }

    private parseUnaryOperation(operator: UnaryOperator, term: Token): UnaryOperationNode | never {
        const argument = this.parseTerm(term)
        return { type: 'UnaryOperation', operator, argument }
    }

    private parseBinaryOperation(tokens: Array<Token>): BinaryOperationNode | never {
        let node: BinaryOperationNode | null = null

        const left = this.parseTerm(tokens[0])

        let currentTokenIndex = 1
        while (
            currentTokenIndex < tokens.length &&
            (tokens[currentTokenIndex].type === '+' ||
                tokens[currentTokenIndex].type === '-' ||
                tokens[currentTokenIndex].type === '*' ||
                tokens[currentTokenIndex].type === '/')
        ) {
            const operator: BinaryOperator = tokens[currentTokenIndex].type as '+' | '-' | '*' | '/'
            currentTokenIndex++
            const term = this.parseTerm(tokens[currentTokenIndex])
            currentTokenIndex++
            node = {
                type: 'BinaryOperation',
                left: node || left,
                operator,
                right: term,
            }
        }

        if (currentTokenIndex < tokens.length) {
            this.handleError(tokens[currentTokenIndex], 'operator')
        }

        if (node) {
            return node
        } else {
            this.handleError(this.currentToken, 'binary operation')
        }
    }

    private parseTerm(term: Token): TermNode | never {
        const currentToken = term

        switch (currentToken.type) {
            case 'LITERAL':
                return { type: 'Literal', value: parseInt(currentToken.value) }
            case 'IDENTIFIER':
                return { type: 'Identifier', name: currentToken.value }
            default:
                this.handleError(currentToken, 'term')
        }
    }

    private handleError(token: Token, location: string): never {
        const context = this.errorContext(token)
        throw new Error(
            context + `Unexpected token in ${location}: found ${this.currentToken.type}`,
        )
    }

    private errorContext(token: Token): string {
        return `At line ${token.lineNb}:\n`
    }
}

enum LevelOfPrecedence {
    '+' = 1,
    '-' = 1,
    '*' = 2,
    '/' = 2,
}
