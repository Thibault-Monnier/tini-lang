import { Lexer } from './Lexer'
import { ProgramNode, StatementNode, ExpressionNode, Parser } from './Parser'

export class Interpreter {
    private ast: ProgramNode
    private globals: { [key: string]: number } = {}

    constructor(ast: ProgramNode) {
        this.ast = ast
    }

    public interpret(): void {
        // TODO: Implement interpretation logic
    }

    // Execute a statement
    private execute(node: StatementNode): void {
        // TODO: Implement statement execution
    }

    // Evaluate an expression
    private evaluate(node: ExpressionNode): number {
        // TODO: Implement expression evaluation
        return 0 // Placeholder return
    }
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
