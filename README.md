# Tini-lang programming language

[![CI](https://github.com/Thibault-Monnier/tini-lang/actions/workflows/ci.yml/badge.svg)](https://github.com/Thibault-Monnier/tini-lang/actions/workflows/ci.yml)

This project contains a lexer, parser, and interpreter for a simple language called `tini-lang`, and is coded in `Typescript`. My objective is to learn how to create a programming language, all by eventually making it Turing-complete.

## Table of Contents

<!-- prettier-ignore-start -->

- [Table of Contents](#table-of-contents)
- [Installation \& Setup](#installation--setup)
  - [Cloning the repository](#cloning-the-repository)
  - [Executing scripts](#executing-scripts)
  - [Runing test](#runing-test)
- [Grammar](#grammar)
  - [Terminals](#terminals)
  - [Non-terminals](#non-terminals)
  - [Grammar Rules](#grammar-rules)
  - [Operator Precedence and Associativity](#operator-precedence-and-associativity)
- [Example Program](#example-program)

<!-- prettier-ignore-end -->

---

## Installation & Setup

### Cloning the repository

1.  Clone this repository by running `git clone https://github.com/Thibault-Monnier/tini-lang.git` in your command terminal.
2.  Navigate to the created directory, then run `npm install` to install all the necessary packages.

### Executing scripts

> This project uses `ts-node`, so you won't need to compile anything to run your scripts.

Place any personal program that you want to execute in the `scripts` folder. Then, run `npm run start [rel-filepath] -- [params]` which will execute the file **relative to the `scripts` folder**. You can pass the `--debug` and `--perf` parameters.

> Note that the `scripts` folder is ignored by source control.

### Runing test

You can run all tests with `npm run test`, or a specific file with `npm run test [filepath]`

---

## Grammar

Below is the formal LALR grammar for `tini-lang`. Note that it will regularly change since the language is in an experimental state.

### Terminals

-   `IDENTIFIER` → Variable names (e.g., `a`, `b`)
-   `LITERAL` → Numeric literals (e.g., `1`, `2`)
-   `PRINT` → The keyword `print`
-   `ASSIGN` → The assignment operator `=`
-   `BINOP` → The operators addition, subtraction, multiplication, division: `+` / `-` / `*` / `/`
-   `NEWLINE` → Line separator
-   `EOF` → End of file/input

### Non-terminals

-   `Program`
-   `Statements`
-   `Statement`
-   `AssignmentStmt`
-   `PrintStmt`
-   `Expression`
-   `Term`

### Grammar Rules

1. **Program**

    ```
    Program → Statements EOF
    ```

2. **Statements**

    ```
    Statements → Statement Statements
               | NEWLINES Statements
               | ε
    ```

3. **Statement**

    ```
    Statement → AssignmentStmt
              | PrintStmt
    ```

4. **Assignment Statement**

    ```
    AssignmentStmt → IDENTIFIER ASSIGN Expression
    ```

5. **Print Statement**

    ```
    PrintStmt → PRINT Expression
    ```

6. **Expression**

    ```
    Expression → Expression OPERATOR Term
               | Term
    ```

7. **Term**

    ```
    Term → IDENTIFIER
         | NUMBER
    ```

### Operator Precedence and Associativity

-   Operators `+`, `-`, `*`, `/` are **left-associative**.
-   `+` and `-` have precedence level 1.
-   `*` and `/` have precedence level 2.

---

## Example Program

Here is an example program written in the simple programming language:

```
a = -1 * 2 + 4
b = 1 + 2 / a
print b + 3
```

**Expected Output:**

```
5
```
