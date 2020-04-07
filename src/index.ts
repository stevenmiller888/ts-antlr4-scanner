import { BufferedTokenStream, Token } from 'antlr4ts'
import { Interval } from 'antlr4ts/misc/Interval'

export class Scanner {
  index: number
  tokens: Token[]
  tokenStack: number[]

  public constructor(input: BufferedTokenStream) {
    // Get all tokens from lexer until EOF.
    input.fill()

    this.index = 0
    this.tokens = input.getTokens()
    this.tokenStack = []
  }

  /**
   * Advances to the next token.
   *
   * @param skipHidden If true ignore hidden tokens.
   * @return False if we hit the last token before we could advance, true otherwise.
   */
  public next(skipHidden?: boolean): boolean {
    while (this.index < this.tokens.length - 1) {
      ++this.index
      if (this.tokens[this.index].channel === Token.DEFAULT_CHANNEL || !skipHidden) {
        return true
      }
    }
    return false
  }

  /**
   * Returns to the previous token.
   *
   * @param skipHidden If true ignore hidden tokens.
   * @return False if we hit the last token before we could fully go back, true otherwise.
   */
  public previous(skipHidden?: boolean): boolean {
    while (this.index > 0) {
      --this.index
      if (this.tokens[this.index].channel === 0 || !skipHidden) {
        return true
      }
    }
    return false
  }

  /**
   * Advances to the token that covers the given zero-based offset.
   *
   * Note: this function also considers hidden token.
   *
   * @return True if such a node exists, false otherwise (no change performed then).
   */
  public advanceToPosition(offset: number): boolean {
    if (this.tokens.length === 0) {
      return false
    }

    let i = 0
    for (; i < this.tokens.length; i++) {
      const token = this.tokens[i]
      const tokenOffset = token.startIndex
      const tokenLength = token.stopIndex - token.startIndex + 1

      if (tokenOffset <= offset && offset < tokenOffset + tokenLength) {
        this.index = i
        break
      }

      if (tokenOffset > offset) {
        // We reached a token after the current offset. Take the previous one as result then.
        if (i === 0) {
          return false
        }

        this.index = i - 1
        break
      }
    }

    if (i === this.tokens.length) {
      this.index = i - 1 // Nothing found, take the last token instead.
    }

    return true
  }

  /**
   * Advances to the next token with the given lexical type.
   *
   * @param type The token type to search.
   * @return True if such a node exists, false otherwise (no change performed then).
   */
  public advanceToType(type: number): boolean {
    for (let i = this.index; i < this.tokens.length; ++i) {
      if (this.tokens[i].type === type) {
        this.index = i
        return true
      }
    }

    return false
  }

  /**
   * Steps over a number of tokens and positions.
   * The tokens are traversed in exactly the given order without intermediate tokens. The current token must be
   * startToken. Any non-default channel token is skipped before testing for the next token in the sequence.
   *
   * @return True if all the given tokens were found and there is another token after the last token
   *         in the list, false otherwise. If the token sequence could not be found or there is no more
   *         token the internal state is undefined.
   */
  public skipTokenSequence(sequence: number[]): boolean {
    if (this.index >= this.tokens.length) {
      return false
    }

    for (const token of sequence) {
      if (this.tokens[this.index].type != token) {
        return false
      }

      while (++this.index < this.tokens.length && this.tokens[this.index].channel != Token.DEFAULT_CHANNEL) {
        if (this.index === this.tokens.length) {
          return false
        }
      }
    }

    return true
  }

  /**
   * Returns the type of the next token without changing the internal state.
   */
  public lookAhead(skipHidden?: boolean): number {
    let index = this.index

    while (index < this.tokens.length - 1) {
      ++index
      if (this.tokens[index].channel === Token.DEFAULT_CHANNEL || !skipHidden) {
        return this.tokens[index].type
      }
    }

    return Token.INVALID_TYPE
  }

  /**
   * Look back in the stream (physical order) what was before the current token, without
   * modifying the current position.
   */
  public lookBack(skipHidden?: boolean): number {
    let index = this.index

    while (index > 0) {
      --index
      if (this.tokens[index].channel === Token.DEFAULT_CHANNEL || !skipHidden) {
        return this.tokens[index].type
      }
    }

    return Token.INVALID_TYPE
  }

  public seek(index: number): void {
    if (index < this.tokens.length) {
      this.index = index
    }
  }

  /**
   * Resets the walker to be at the original location.
   */
  public reset(): void {
    this.index = 0
    while (this.tokenStack.length > 0) {
      this.tokenStack.pop()
    }
  }

  /**
   * Store the current node on the stack, so we can easily come back when needed.
   */
  public push(): void {
    this.tokenStack.push(this.index)
  }

  /**
   * Returns to the location at the top of the token stack (if any).
   */
  public pop(): boolean {
    if (this.tokenStack.length === 0) {
      return false
    }

    this.index = this.tokenStack.pop() || 0
    this.tokenStack.pop()

    return true
  }

  /**
   * Removes the current top of stack entry without restoring the internal state.
   * Does nothing if the stack is empty.
   */
  public removeTos(): void {
    if (this.tokenStack.length > 0) {
      this.tokenStack.pop()
    }
  }

  /**
   * Returns true if the current token is of the given type.
   */
  public is(type: number): boolean {
    return this.tokens[this.index].type === type
  }

  /**
   * Returns the textual expression of the current token.
   */
  public tokenText(): string | undefined {
    return this.tokens[this.index].text
  }

  /**
   * Returns the type of the current token. Same as the type you can specify in advanceToType().
   */
  public tokenType(): number {
    return this.tokens[this.index].type
  }

  /**
   * Returns the (zero-based) index of the current token within the input.
   */
  public tokenIndex(): number {
    return this.tokens[this.index].tokenIndex
  }

  /**
   * Returns the (one-based) line number of the token.
   */
  public tokenLine(): number {
    return this.tokens[this.index].line
  }

  /**
   * Returns the offset of the current token in its source string.
   */
  public tokenStart(): number {
    return this.tokens[this.index].startIndex
  }

  /**
   * Returns the length of the current token in bytes.
   */
  public tokenLength(): number {
    const token = this.tokens[this.index]
    return token.stopIndex - token.startIndex + 1
  }

  /**
   * Returns the channel of the current token.
   */
  public tokenChannel(): number {
    return this.tokens[this.index].channel
  }

  /**
   * This is a special purpose function to return all the input text from the current token to the end.
   */
  public tokenSubText(): string | undefined {
    const charStream = this.tokens[this.index].tokenSource?.inputStream
    const interval = new Interval(this.tokens[this.index].startIndex, Number.MAX_SAFE_INTEGER)
    return charStream?.getText(interval)
  }
}
