import { Lexer, Token, TokenType } from './Lexer'

export class Parser {
    private lexer: Lexer
    private currentToken: Token

    constructor(lexer: Lexer) {
        this.lexer = lexer
        this.currentToken = this.lexer.getNextToken()
    }

    // Eat the current token if it matches the expected type
    private eat(tokenType: TokenType): void {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.lexer.getNextToken()
        } else {
            throw new Error(
                `Unexpected token type: expected ${tokenType}, got ${this.currentToken.type}`,
            )
        }
    }

    // Parse the entire program
    public parseProgram(): ProgramNode {
        const statements = this.parseStatements()
        return { type: 'Program', statements }
    }

    // Parse multiple statements
    private parseStatements(): StatementNode[] {
        // TODO: Implement statements parsing
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

    // Parse a single statement
    private parseStatement(): StatementNode {
        // TODO: Implement statement parsing

        switch (this.currentToken.type) {
            case TokenType.IDENTIFIER:
                return this.parseAssignment()
            case TokenType.PRINT:
                return this.parsePrint()
            default:
                throw new Error(`Unexpected token in ${this.currentToken.type}`)
        }
    }

    // Parse an assignment statement
    private parseAssignment(): AssignmentNode {
        // TODO: Implement assignment parsing
        const identifier = this.currentToken.value
        this.eat(TokenType.IDENTIFIER)
        this.eat(TokenType.ASSIGN)
        const expression = this.parseExpression()
        return { type: 'Assignment', identifier, expression }
    }

    // Parse a print statement
    private parsePrint(): PrintNode {
        // TODO: Implement print parsing
        this.eat(TokenType.PRINT)
        const expression = this.parseExpression()
        return { type: 'Print', expression }
    }

    // Parse an expression
    private parseExpression(): ExpressionNode {
        // TODO: Implement expression parsing
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

    // Parse a term
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
