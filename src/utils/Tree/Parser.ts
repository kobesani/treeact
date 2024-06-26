import { ParseException } from "./Exceptions";
import { Node, Tree } from "./Node";
import { TokenMatch } from "./Types";

export class NewickParser {
  private tokens: TokenMatch[];
  private index: number;

  constructor(tokens: TokenMatch[]) {
    this.tokens = tokens;
    this.index = 0;
  }

  acceptToken = (tokenType: string, required: boolean): boolean => {
    if (
      this.index < this.tokens.length &&
      this.tokens[this.index].type === tokenType
    ) {
      this.index += 1;
      return true;
    }

    if (required) {
      if (this.index < this.tokens.length) {
        throw new ParseException(
          `Expected token - ${tokenType} - but found ${
            this.tokens[this.index].type
          }`
        );
      } else {
        throw new ParseException(
          `Newick string terminated early, expected token: ${tokenType}, got ${
            this.tokens[this.index].type
          }.`
        );
      }
    }

    return false;
  };

  parseTree = () => {
    // just skip whitespaces by removing them from the token list
    this.tokens = this.tokens.filter((token) => token.type !== "WHITESPACE");
    return this.parseN(undefined);
  };

  parseN = (parent: Node | undefined) => {
    const node = parent ? new Node(parent) : new Tree();

    if (parent) {
      parent.addChild(node);
    }

    this.parseC(node);
    this.parseL(node);
    this.parseB(node);

    return node;
  };

  parseC = (node: Node) => {
    if (this.acceptToken("OPEN_PAREN", false)) {
      // console.log(
      //   `In parseC, token accepted: TOKEN = ${this.tokens[this.index].type}`
      // );
      this.parseN(node);
      this.parseM(node);
      this.acceptToken("CLOSE_PAREN", true);
    }
  };

  parseM = (node: Node) => {
    if (this.acceptToken("COMMA", false)) {
      // console.log(
      //   `In parseM, token accepted: TOKEN = ${this.tokens[this.index].type}`
      // );
      this.parseN(node);
      this.parseM(node);
    }
  };

  parseL = (node: Node) => {
    if (this.acceptToken("STRING", false)) {
      node.label = this.tokens[this.index - 1].value;
    }
  };

  parseB = (node: Node) => {
    if (this.acceptToken("COLON", false)) {
      this.acceptToken("STRING", true);
      node.branchLength = parseFloat(this.tokens[this.index - 1].value);
    }
  };
}
