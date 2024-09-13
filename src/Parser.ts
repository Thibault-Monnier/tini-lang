import { Lexer, Token, TokenType } from './Lexer'

export class Parser {
    private lexer: Lexer
    private currentToken: Token

    constructor(lexer: Lexer) {
        this.lexer = lexer
        this.currentToken = this.lexer.getNextToken()
    }

    // Parse the entire program
    public parseProgram(): ProgramNode {
        // TODO: Implement program parsing
        return { type: 'Program', statements: [] } // Placeholder return
    }

    // Parse multiple statements
    private parseStatements(): StatementNode[] {
        // TODO: Implement statements parsing
        return [] // Placeholder return
    }

    // Parse a single statement
    private parseStatement(): StatementNode {
        // TODO: Implement statement parsing
        return { type: 'Assignment', identifier: '', expression: { type: 'Number', value: 0 } } // Placeholder return
    }

    // Parse an assignment statement
    private parseAssignment(): AssignmentNode {
        // TODO: Implement assignment parsing
        return { type: 'Assignment', identifier: '', expression: { type: 'Number', value: 0 } } // Placeholder return
    }

    // Parse a print statement
    private parsePrint(): PrintNode {
        // TODO: Implement print parsing
        return { type: 'Print', expression: { type: 'Number', value: 0 } } // Placeholder return
    }

    // Parse an expression
    private parseExpression(): ExpressionNode {
        // TODO: Implement expression parsing
        return { type: 'Number', value: 0 } // Placeholder return
    }

    // Parse a term
    private parseTerm(): ExpressionNode {
        // TODO: Implement term parsing
        return { type: 'Number', value: 0 } // Placeholder return
    }

    // Eat the current token if it matches the expected type
    private eat(tokenType: TokenType): void {
        // TODO: Implement token consumption
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
