export interface ResolvedDeclaration {
  type: "decl",
  raws: {
    before: string
    between: string
  },
  prop: string
  value: string
}

export class Declaration {
  property: string;
  value: string;

  constructor({ property, value }) {
    this.property = property
    this.value = value
  }

  json(): ResolvedDeclaration {
    return {
      "raws": {
        "before": "\n  ",
        "between": ": "
      },
      "type": "decl",
      prop: this.property,
      value: this.value,
    }
  }
}


export interface ResolvedRule {
  type: "rule"
  selector: string
  raws: {
    "before": string
    "between": string
    "semicolon": boolean
    "after": string
  },
  "nodes": ResolvedDeclaration[]
}

export class Rule {
  selector: string;
  declarations: Declaration[];
  className: string;

  constructor({ selector, declarations, className }) {
    this.selector = selector
    this.declarations = declarations
    this.className = className
  }

  json(): ResolvedRule {
    return {
      "type": "rule",
      selector: this.selector,
      "raws": {
        "before": "\n",
        "between": " ",
        "semicolon": true,
        "after": "\n"
      },
      "nodes": this.declarations.map(declaration => declaration.json()),
    }
  }
}


interface ResolvedRoot {
  type: 'root'
  nodes: ResolvedRule[]
}

export class Root {
  _nodes: ResolvedRule[];

  constructor() {
    this._nodes = []
  }

  appendNodes(nodes: Rule[]) {
    
    nodes.forEach((node: Rule) => {
      this._nodes.push(node.json())
    })
  }

  json(): ResolvedRoot {
    return {
      "type": "root",
      "nodes": this._nodes,
    }
  }
}