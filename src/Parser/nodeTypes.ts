export interface ASTNode {
    type: string
}

export interface ProgramNode extends ASTNode {
    type: 'Program'
    statements: StatementNode[]
}

export type StatementNode = AssignmentNode | PrintNode

export interface PrintNode extends ASTNode {
    type: 'Print'
    expression: ExpressionNode
}

export interface AssignmentNode extends ASTNode {
    type: 'Assignment'
    identifier: string
    expression: ExpressionNode
}

export type ExpressionNode = BinaryOperationNode | UnaryOperationNode | TermNode

export interface BinaryOperationNode extends ASTNode {
    type: 'BinaryOperation'
    left: ExpressionNode
    operator: BinaryOperator
    right: ExpressionNode
}

export interface UnaryOperationNode extends ASTNode {
    type: 'UnaryOperation'
    operator: UnaryOperator
    argument: ExpressionNode
}

export type BinaryOperator = '+' | '-' | '*' | '/'
export type UnaryOperator = '+' | '-'

export type TermNode = LiteralNode | IdentifierNode

export interface LiteralNode extends ASTNode {
    type: 'Literal'
    value: number
}

export interface IdentifierNode extends ASTNode {
    type: 'Identifier'
    name: string
}
