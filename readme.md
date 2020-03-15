# ts-antlr4-scanner

![Alt Text](https://github.com/stevenmiller888/ts-antlr4-scanner/workflows/CI/badge.svg)

> A scanner for antlr4-based lexers.

![Alt Text](https://github.com/stevenmiller888/ts-antlr4-scanner/raw/master/.github/demo.png)

## Features

- Lookahead support
- Lookback support
- Advance to position
- Advance to token type

## Installation

```shell
yarn add ts-antlr4-scanner
# or
npm install ts-antlr4-scanner
```

## Usage

```typescript
import { CommonTokenStream, ANTLRInputStream } from 'antlr4ts'
import { MySQLLexer } from 'ts-mysql-parser'
import { Scanner } from 'ts-antlr4-scanner'

const text = 'SELECT * FROM users'

const inputStream = new ANTLRInputStream(text)
const lexer = new MySQLLexer(inputStream) // Or any antlr4 lexer
const tokenStream = new CommonTokenStream(lexer)
const scanner = new Scanner(tokenStream)

// Move to character L of SELECT
scanner.advanceToPosition(3)

const tokenText = scanner.tokenText()
console.log(tokenText) // SELECT
```

## API

### new Scanner(tokenStream)

Creates a new instance of Scanner with the given token stream.

#### .next()

Advances to the next token.

```typescript
scanner.next()
```

#### .previous()

Returns to the previous token.

```typescript
scanner.previous()
```

#### .advanceToPosition(offset)

Advances to the token that covers the given zero-based offset.

```typescript
scanner.advanceToPosition(4)
```

#### .advanceToType(type)

Advances to the next token with the given lexical type.

```typescript
scanner.advanceToType(14)
```

#### .skipTokenSequence(sequence)

Steps over a number of tokens and positions.

```typescript
scanner.skipTokenSequence([1, 5, 8])
```

#### .lookAhead()

Returns the type of the next token without changing the internal state.

```typescript
scanner.lookAhead()
```

#### .lookBack()

Look back in the stream (physical order) what was before the current token, without modifying the current position.

```typescript
scanner.lookBack()
```

#### .reset()

Resets the walker to be at the original location.

```typescript
scanner.reset()
```

#### .push()

Store the current node on the stack, so we can easily come back when needed.

```typescript
scanner.push()
```

#### .pop()

Returns to the location at the top of the token stack (if any).

```typescript
scanner.pop()
```

#### .tokenText()

Returns the textual expression of the current token.

```typescript
scanner.tokenText()
```

#### .tokenType()

Returns the type of the current token.

```typescript
scanner.tokenType()
```

#### .tokenIndex()

Returns the (zero-based) index of the current token within the input.

```typescript
scanner.tokenIndex()
```

#### .tokenLine()

Returns the (one-based) line number of the token.

```typescript
scanner.tokenLine()
```

#### .tokenStart()

Returns the offset of the current token in its source string.

```typescript
scanner.tokenStart()
```

#### .tokenLength()

Returns the length of the current token in bytes.

```typescript
scanner.tokenLength()
```

#### .tokenChannel()

Returns the channel of the current token.

```typescript
scanner.tokenChannel()
```

#### .tokenSubText()

Returns all the input text from the current token to the end.

```typescript
scanner.tokenSubText()
```

## Related

- [ts-mysql-parser](https://github.com/stevenmiller888/ts-mysql-parser) - A standalone, grammar-complete MySQL parser
- [ts-mysql-analyzer](https://github.com/stevenmiller888/ts-mysql-analyzer) - A MySQL query analyzer
- [ts-mysql-schema](https://github.com/stevenmiller888/ts-mysql-schema) - A schema extractor for MySQL
- [ts-mysql-uri](https://github.com/stevenmiller888/ts-mysql-uri) - Parse a MySQL connection URI

## License

[MIT](https://tldrlegal.com/license/mit-license)

---

> [stevenmiller888.github.io](https://stevenmiller888.github.io) &nbsp;&middot;&nbsp;
> GitHub [@stevenmiller888](https://github.com/stevenmiller888) &nbsp;&middot;&nbsp;
> Twitter [@stevenmiller888](https://twitter.com/stevenmiller888)
