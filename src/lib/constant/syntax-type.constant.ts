interface SyntaxWithType {
  syntax: string;
  type: string;
}

const syntaxWithType: SyntaxWithType[] = [
  { syntax: "2c", type: "bao" },
  { syntax: "2c", type: "dau" },
  { syntax: "2c", type: "duoi" },
  { syntax: "2c", type: "da" },
  { syntax: "2c", type: "dax" },
  { syntax: "3c", type: "bao" },
  { syntax: "3c", type: "xdau" },
  { syntax: "3c", type: "xduoi" },
  { syntax: "4c", type: "bao" },
];

export { syntaxWithType, type SyntaxWithType }