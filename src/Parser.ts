import { Lexer, Token, TokenType } from './Lexer'

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

        while (this.currentToken.type !== TokenType.EOF) {
            const statement = this.parseStatement()
            statements.push(statement)

            if (this.currentToken.type === TokenType.NEWLINE) {
                this.eat(TokenType.NEWLINE)
            }
        }

        return statements
    }

    private parseStatement(): StatementNode {
        switch (this.currentToken.type) {
            case TokenType.IDENTIFIER:
                return this.parseAssignment()
            case TokenType.PRINT:
                return this.parsePrint()
            default:
                throw new Error(`Unexpected token in ${this.currentToken.type}`)
        }
    }

    private parseAssignment(): AssignmentNode {
        const identifier = this.currentToken.value
        this.eat(TokenType.IDENTIFIER)
        this.eat(TokenType.ASSIGN)
        const expression = this.parseExpression()
        return { type: 'Assignment', identifier, expression }
    }

    private parsePrint(): PrintNode {
        this.eat(TokenType.PRINT)
        const expression = this.parseExpression()
        return { type: 'Print', expression }
    }

    private parseExpression(): ExpressionNode {
        let node = this.parseTerm()

        while (
            this.currentToken.type === TokenType.PLUS ||
            this.currentToken.type === TokenType.MINUS
        ) {
            const operator = this.currentToken.value
            this.eat(this.currentToken.type)
            const right = this.parseTerm()
            node = { type: 'BinaryOp', operator, left: node, right }
        }

        return node
    }

    private parseTerm(): ExpressionNode {
        const currentToken = this.currentToken

        switch (this.currentToken.type) {
            case TokenType.NUMBER:
                this.eat(TokenType.NUMBER)
                return { type: 'Number', value: parseInt(currentToken.value) }
            case TokenType.IDENTIFIER:
                this.eat(TokenType.IDENTIFIER)
                return { type: 'Identifier', name: currentToken.value }
            default:
                throw new Error(`Unexpected token in ${currentToken.type}`)
        }
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
    operator: string
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
