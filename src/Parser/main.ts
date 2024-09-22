import { Lexer, Operator, Token, TokenType } from '../Lexer'

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
        this.eat('ASSIGN')
        const expression = this.parseExpression()
        return { type: 'Assignment', identifier, expression }
    }

    private parsePrint(): PrintNode {
        this.eat('PRINT')
        const expression = this.parseExpression()
        return { type: 'Print', expression }
    }

    private parseExpression(): ExpressionNode {
        let node = this.parseTerm()

        while (this.currentToken.type === 'OPERATOR') {
            const operator = this.currentToken.value
            this.eat(this.currentToken.type)
            const right = this.parseTerm()
            node = { type: 'BinaryOp', operator, left: node, right }
        }

        return node
    }

    private parseTerm(): ExpressionNode {
        const currentToken = this.currentToken

        switch (currentToken.type) {
            case 'NUMBER':
                this.eat('NUMBER')
                return { type: 'Number', value: parseInt(currentToken.value) }
            case 'IDENTIFIER':
                this.eat('IDENTIFIER')
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

export interface ASTNode {
    type: string
}

export interface ProgramNode extends ASTNode {
    type: 'Program'
    statements: StatementNode[]
}

export type StatementNode = AssignmentNode | PrintNode

export interface AssignmentNode extends ASTNode {
    type: 'Assignment'
    identifier: string
    expression: ExpressionNode
}

export interface PrintNode extends ASTNode {
    type: 'Print'
    expression: ExpressionNode
}

export type ExpressionNode = BinaryOpNode | NumberNode | IdentifierNode

export interface BinaryOpNode extends ASTNode {
    type: 'BinaryOp'
    operator: Operator
    left: ExpressionNode
    right: ExpressionNode
}

export interface NumberNode extends ASTNode {
    type: 'Number'
    value: number
}

export interface IdentifierNode extends ASTNode {
    type: 'Identifier'
    name: string
}
