import { ProgramNode, StatementNode, ExpressionNode } from './Parser/main'
import { printSeparator } from './printUtils'

export class Interpreter {
    private ast: ProgramNode
    private variables: { [key: string]: number } = {}

    constructor(ast: ProgramNode) {
        this.ast = ast
    }

    public interpret(): void {
        printSeparator("Program output")
        for (const statement of this.ast.statements) {
            this.execute(statement)
        }
    }

    private execute(node: StatementNode): void {
        if (node.type === 'Assignment') {
            this.variables[node.identifier] = this.evaluate(node.expression)
        } else if (node.type === 'Print') {
            log(this.evaluate(node.expression))
        }
    }

    private evaluate(node: ExpressionNode): number {
        switch (node.type) {
            case 'BinaryOp':
                const left = this.evaluate(node.left)
                const right = this.evaluate(node.right)

                if (node.operator === '+') {
                    return left + right
                } else if (node.operator === '-') {
                    return left - right
                } else {
                    throw new Error(`Unknown operator: ${node.operator}`)
                }

            case 'Identifier':
                const value = this.variables[node.name]
                if (value === undefined) {
                    throw new Error(`Undefined variable: ${node.name}`)
                }

                return value

            case 'Number':
                return node.value
        }
    }
}

function log(value: number) {
    console.log(value.toString())
}
