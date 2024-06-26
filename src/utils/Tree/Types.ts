export enum TokenType {
    OPEN_PAREN = "OPEN_PAREN",
    CLOSE_PAREN = "CLOSE_PAREN",
    COMMA = "COMMA",
    COLON = "COLON",
    SEMI_COLON = "SEMI_COLON",
    STRING = "STRING",
    WHITESPACE = "WHITESPACE",
  }
  
  export interface TokenMatch {
    type: TokenType;
    value: string;
    start: number;
    end: number;
  }
  
  