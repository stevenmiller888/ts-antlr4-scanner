import { CommonTokenStream, ANTLRInputStream } from 'antlr4ts'
import { MySQLLexer } from 'ts-mysql-parser'
import { Scanner } from '../src'

const text = 'SELECT * FROM users'

const inputStream = new ANTLRInputStream(text)
const lexer = new MySQLLexer(inputStream)
const tokenStream = new CommonTokenStream(lexer)
const scanner = new Scanner(tokenStream)

// Move to character L of SELECT
scanner.advanceToPosition(3)
console.log(scanner.tokenText()) // SELECT

// Move to character O of FROM
scanner.advanceToPosition(13)
console.log(scanner.tokenText()) // FROM
