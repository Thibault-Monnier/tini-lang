import { Interpreter } from './Interpreter'
import { Lexer } from './Lexer'
import { Parser } from './Parser/main'

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
      print a
    `,
        expectedOutput: '1',
    },
    {
        description: 'Addition',
        input: `
      a = 1 + 2
      print a + 3
    `,
        expectedOutput: '6',
    },
    {
        description: 'Subtraction',
        input: `
      a = 10 - 4
      print a
    `,
        expectedOutput: '6',
    },
    {
        description: 'Multiplication',
        input: `
      x = 10 * 4
      print x
    `,
        expectedOutput: '40',
    },
    {
        description: 'Division',
        input: `
      x = 12 / 4
      print x
    `,
        expectedOutput: '3',
    },
    {
        description: 'Order of operations',
        input: `
      x = 2 + 3 - 4 * 2 / 4
      print x
    `,
        expectedOutput: '3',
    },
    {
        description: 'Complex expression with mixed operators',
        input: `
          a = 2 + 3 * 2 - 4 / 2
          print a
        `,
        expectedOutput: '6',
    },
    {
        description: 'Variables in expressions',
        input: `
      num = 5
      total = num + num + 5
      print total
    `,
        expectedOutput: '15',
    },
    {
        description: 'Many variables and long expressions',
        input: `

          a = 5 + 5 - 2 - 6 / 2
          b = 10 * 2 - 5 * 2
          
          

            c = -a + b + 2 * a

    d = a * b


             print c + d + a + b + 1 * 2 - 3 / 1 + 5 - 4 * 7 + 20 / 2 + 1
            

    
        `,
        expectedOutput: '67',
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
    {
        description: 'Syntax error due to missing operand',
        input: `
        a = 5
        b = a +
        `,
        expectedError: 'Unexpected token',
    },
    {
        description: 'Division by zero',
        input: `
          a = 10 / 0
          print a
        `,
        expectedError: 'Attempted to divide by zero',
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
                }
                if (expectedError) {
                    throw new Error('Expected an error, got none')
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
