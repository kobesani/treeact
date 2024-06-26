import { LexException } from "./Exceptions";
import { TokenType, TokenMatch } from "./Types";

const tokenRegexMap: Record<TokenType, RegExp> = {
  [TokenType.WHITESPACE]: /^\s+/,
  [TokenType.OPEN_PAREN]: /^\(/,
  [TokenType.CLOSE_PAREN]: /^\)/,
  [TokenType.COMMA]: /^,/,
  [TokenType.COLON]: /^:/,
  [TokenType.SEMI_COLON]: /^;/,
  [TokenType.STRING]: /^[^,():;[\]#]+(?:\([^)]*\))?/,
};

export class NewickLexer {
  private inputTree: string;
  private position: number;

  constructor(input: string) {
    this.inputTree = input;
    this.position = 0;
  }

  lex = (): TokenMatch[] => {
    let tokenList = [];
    let currentMatch = undefined;

    while (this.position < this.inputTree.length) {
      currentMatch = this.match();

      if (currentMatch === undefined) {
        throw new LexException(
          `Error reading character ${
            this.inputTree[this.position]
          } at position ${this.position}`
        );
        // throw Error(
        //   `Error reading character ${
        //     this.inputTree[this.position]
        //   } at position ${this.position}`
        // );
      }
      tokenList.push(currentMatch);
      this.position += currentMatch.end - currentMatch.start;
    }

    return tokenList;
  };

  match = (): TokenMatch | undefined => {
    const regexMatchEntries = Object.entries(tokenRegexMap);

    for (let index = 0; index < regexMatchEntries.length; index++) {
      const [keyType, keyRegex] = regexMatchEntries[index];
      const regexMatch = this.inputTree.slice(this.position).match(keyRegex);

      if (regexMatch !== null && regexMatch.index === 0) {
        return {
          type: keyType as TokenType,
          value: regexMatch[0],
          start: this.position,
          end: this.position + regexMatch[0].length,
        };
      }
    }

    return undefined;
  };

  reset = (): void => {
    this.position = 0;
  };
}
