import { CommonTokenStream, ANTLRInputStream } from 'antlr4ts'
import { MySQLLexer } from 'ts-mysql-parser'
import { Scanner } from '../'

function getTokenStream(): CommonTokenStream {
  const inputStream = new ANTLRInputStream('SELECT * FROM users')
  const lexer = new MySQLLexer(inputStream)
  const tokenStream = new CommonTokenStream(lexer)
  return tokenStream
}

describe('Scanner', () => {
  it('is a constructor', () => {
    const tokenStream = getTokenStream()
    const scanner = new Scanner(tokenStream)
    expect(scanner).toBeInstanceOf(Scanner)
  })

  it('starts index at 0', () => {
    const tokenStream = getTokenStream()
    const scanner = new Scanner(tokenStream)
    expect(scanner.index).toBe(0)
  })

  it('intitializes tokens', () => {
    const tokenStream = getTokenStream()
    const scanner = new Scanner(tokenStream)
    expect(scanner.tokens).toMatchObject(tokenStream.getTokens())
  })

  it('intitializes empty token stack', () => {
    const tokenStream = getTokenStream()
    const scanner = new Scanner(tokenStream)
    expect(scanner.tokenStack).toMatchObject([])
  })

  it('advances to next token', () => {
    const tokenStream = getTokenStream()
    const scanner = new Scanner(tokenStream)
    scanner.next()
    expect(scanner.index).toBe(1)
  })

  it('returns to previous token', () => {
    const tokenStream = getTokenStream()
    const scanner = new Scanner(tokenStream)
    scanner.next()
    expect(scanner.index).toBe(1)
    scanner.previous()
    expect(scanner.index).toBe(0)
  })

  it('advances to token at position', () => {
    const tokenStream = getTokenStream()
    const scanner = new Scanner(tokenStream)

    // beginning of 'SELECT'
    scanner.advanceToPosition(0)
    expect(scanner.tokenText()).toBe('SELECT')

    // middle of 'SELECT'
    scanner.advanceToPosition(3)
    expect(scanner.tokenText()).toBe('SELECT')

    // end of 'SELECT'
    scanner.advanceToPosition(5)
    expect(scanner.tokenText()).toBe('SELECT')

    // ' '
    scanner.advanceToPosition(6)
    expect(scanner.tokenText()).toBe(' ')

    // '*'
    scanner.advanceToPosition(7)
    expect(scanner.tokenText()).toBe('*')

    // ' '
    scanner.advanceToPosition(8)
    expect(scanner.tokenText()).toBe(' ')

    // middle of 'FROM'
    scanner.advanceToPosition(11)
    expect(scanner.tokenText()).toBe('FROM')

    // ' '
    scanner.advanceToPosition(13)
    expect(scanner.tokenText()).toBe(' ')

    // middle of 'users'
    scanner.advanceToPosition(17)
    expect(scanner.tokenText()).toBe('users')
  })

  it('advances to next token by type', () => {
    const tokenStream = getTokenStream()
    const scanner = new Scanner(tokenStream)
    scanner.advanceToType(MySQLLexer.FROM_SYMBOL)
    expect(scanner.index).toBe(4)
  })

  it('looks ahead to the next token', () => {
    const tokenStream = getTokenStream()
    const scanner = new Scanner(tokenStream)
    const token = scanner.lookAhead()
    expect(token).toBe(MySQLLexer.WHITESPACE)
  })

  it('looks back to the previous token', () => {
    const tokenStream = getTokenStream()
    const scanner = new Scanner(tokenStream)
    scanner.next()
    expect(scanner.index).toBe(1)
    const token = scanner.lookBack()
    expect(token).toBe(MySQLLexer.SELECT_SYMBOL)
  })

  it('resets state to original location', () => {
    const tokenStream = getTokenStream()
    const scanner = new Scanner(tokenStream)
    scanner.next()
    expect(scanner.index).toBe(1)
    scanner.reset()
    expect(scanner.index).toBe(0)
  })

  it('stores current index on the stack', () => {
    const tokenStream = getTokenStream()
    const scanner = new Scanner(tokenStream)
    scanner.next()
    scanner.push()
    expect(scanner.tokenStack[0]).toBe(1)
  })

  it('returns to location at the top of the stack', () => {
    const tokenStream = getTokenStream()
    const scanner = new Scanner(tokenStream)
    scanner.next()
    scanner.push()
    scanner.pop()
    expect(scanner.index).toBe(1)
  })

  it('returns text of current token', () => {
    const tokenStream = getTokenStream()
    const scanner = new Scanner(tokenStream)
    expect(scanner.tokenText()).toBe('SELECT')
  })

  it('returns type of current token', () => {
    const tokenStream = getTokenStream()
    const scanner = new Scanner(tokenStream)
    expect(scanner.tokenType()).toBe(MySQLLexer.SELECT_SYMBOL)
  })

  it('returns index of current token', () => {
    const tokenStream = getTokenStream()
    const scanner = new Scanner(tokenStream)
    expect(scanner.tokenIndex()).toBe(0)
  })

  it('returns line of current token', () => {
    const tokenStream = getTokenStream()
    const scanner = new Scanner(tokenStream)
    expect(scanner.tokenLine()).toBe(1)
  })

  it('returns length of current token', () => {
    const tokenStream = getTokenStream()
    const scanner = new Scanner(tokenStream)
    expect(scanner.tokenLength()).toBe(6)
  })

  it('returns channel of current token', () => {
    const tokenStream = getTokenStream()
    const scanner = new Scanner(tokenStream)
    expect(scanner.tokenChannel()).toBe(MySQLLexer.DEFAULT_TOKEN_CHANNEL)
  })

  it('returns sub text of current token', () => {
    const tokenStream = getTokenStream()
    const scanner = new Scanner(tokenStream)
    expect(scanner.tokenSubText()).toBe('SELECT * FROM users')
  })
})
