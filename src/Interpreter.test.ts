import { Interpreter } from './Interpreter'
import { Lexer } from './Lexer'
import { Parser } from './Parser'

interface TestCase {
    description: string
    input: string
    expectedOutput?: string
    expectedError?: string
}

// Sample programs for testing
const testCases: TestCase[] = [
    {
        description: 'Simple assignment and print',
        input: `
      a = 1
      b = 1 + 2
      print b + 3
    `,
        expectedOutput: '6',
    },
    {
        description: 'Assignment with subtraction and print',
        input: `
      x = 10
      y = x - 4
      print y
    `,
        expectedOutput: '6',
    },
    {
        description: 'Using variables in expressions',
        input: `
      num = 5
      total = num + num + 5
      print total
    `,
        expectedOutput: '15',
    },
    {
        description: 'Undefined variable error',
        input: `
      print unknownVar
    `,
        expectedError: 'Undefined variable: unknownVar',
    },
    {
        description: 'Syntax error due to missing operator',
        input: `
      a = 5
      b = a 5
    `,
        expectedError: 'Unexpected token',
    },
]

describe('Interpreter Tests', () => {
    testCases.forEach(({ description, input, expectedOutput, expectedError }) => {
        test(description, () => {
            // Mock console.log to capture output
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

            try {
                const trimmedInput = input.trim()
                const lexer = new Lexer(trimmedInput)
                const parser = new Parser(lexer)
                const ast = parser.parseProgram()
                const interpreter = new Interpreter(ast)
                interpreter.interpret()

                if (expectedOutput !== undefined) {
                    expect(consoleSpy).toHaveBeenCalledWith(expectedOutput)
                } else if (expectedError) {
                    fail('Expected an error but none was thrown.')
                }
            } catch (error: any) {
                if (expectedError) {
                    expect(error.message).toContain(expectedError)
                } else {
                    throw error
                }
            } finally {
                consoleSpy.mockRestore()
            }
        })
    })
})
