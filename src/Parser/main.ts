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

    private parseBinaryOperation(tokens: Array<Token>): BinaryOperationNode | TermNode | never {
        const parseOnePrecedenceLevel = (
            precedenceLevel: number,
        ): BinaryOperationNode | null | never => {
            const operators = ['+', '-', '*', '/']

            if (operators.includes(tokens[0].type)) {
                this.handleError(tokens[0], 'binary operation')
            } else if (operators.includes(tokens[tokens.length - 1].type)) {
                this.handleError(tokens[tokens.length - 1], 'binary operation')
            }

            let currentTokenIndex = tokens.length - 2

            while (currentTokenIndex >= 1) {
                const currentToken = tokens[currentTokenIndex]

                if (
                    operators.includes(currentToken.type) &&
                    LevelOfPrecedence[currentToken.type as BinaryOperator] === precedenceLevel
                ) {
                    const operator: BinaryOperator = currentToken.type as BinaryOperator
                    const left = this.parseBinaryOperation(tokens.slice(0, currentTokenIndex))
                    const right = this.parseBinaryOperation(tokens.slice(currentTokenIndex + 1))
                    return { type: 'BinaryOperation', left, operator, right }
                }

                currentTokenIndex--
            }

            return null
        }

        // Try to parse binary operations with higher precedence levels first
        for (let precedenceLevel = 1; precedenceLevel <= 2; precedenceLevel++) {
            const result = parseOnePrecedenceLevel(precedenceLevel)
            if (result) {
                return result
            }
        }

        // There is no operator in the expression
        if (tokens.length === 1) {
            return this.parseTerm(tokens[0])
        } else {
            this.handleError(tokens[1], 'binary operation')
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
        throw new Error(context + `Unexpected token in ${location}: found ${token.type}`)
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
