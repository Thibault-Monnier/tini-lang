import { ProgramNode, StatementNode, ExpressionNode } from './Parser/nodeTypes'
import { printSeparator } from './printUtils'

export class Interpreter {
    private ast: ProgramNode
    private variables: { [key: string]: number } = {}

    constructor(ast: ProgramNode) {
        this.ast = ast
    }

    public interpret(): void {
        printSeparator('Program output')
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
            case 'UnaryOperation':
                const argument = this.evaluate(node.argument)
                switch (node.operator) {
                    case '+':
                        return argument
                    case '-':
                        return -argument
                }
            case 'BinaryOperation':
                const left = node.left ? this.evaluate(node.left) : 0
                const right = this.evaluate(node.right)
                switch (node.operator) {
                    case '+':
                        return left + right
                    case '-':
                        return left - right
                    case '*':
                        return left * right
                    case '/':
                        if (right === 0) {
                            throw new Error('Attempted to divide by zero')
                        }
                        return left / right
                }
            case 'Identifier':
                const value = this.variables[node.name]
                if (value === undefined) {
                    throw new Error(`Undefined variable: ${node.name}`)
                }
                return value
            case 'Literal':
                return node.value
        }
    }
}

function log(value: number) {
    console.log(value.toString())
}
