import { Lexer } from './Lexer'
import { ProgramNode, StatementNode, ExpressionNode, Parser, NumberNode } from './Parser'

export class Interpreter {
    private ast: ProgramNode
    private variables: { [key: string]: number } = {}

    constructor(ast: ProgramNode) {
        this.ast = ast
    }

    public interpret(): void {
        // TODO: Implement interpretation logic
        for (const statement of this.ast.statements) {
            this.execute(statement)
        }
    }

    // Execute a statement
    private execute(node: StatementNode): void {
        // TODO: Implement statement execution
        if (node.type === 'Assignment') {
            this.variables[node.identifier] = this.evaluate(node.expression)
        } else if (node.type === 'Print') {
            log(this.evaluate(node.expression))
        }
    }

    // Evaluate an expression
    private evaluate(node: ExpressionNode): number {
        // TODO: Implement expression evaluation
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

// Example usage
const inputProgram = `
  a = 1
  b = 1 + 2
  print b + 3
  `

// Remove leading/trailing whitespace
const trimmedInput = inputProgram.trim()

// Initialize lexer and parser
const lexer = new Lexer(trimmedInput)
const parser = new Parser(lexer)

// Parse the program
const ast = parser.parseProgram()

// Interpret the program
const interpreter = new Interpreter(ast)
interpreter.interpret()
