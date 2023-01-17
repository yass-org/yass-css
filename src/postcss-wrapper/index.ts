import { 
  Declaration,
  Rule, 
} from 'postcss'

export class RootElement {
  constructor() {}

  toJSON() {
    return new Rule({
      selector: ':root',
      raws: {
        after: '\n'
      }
    })
  }
}

interface AtomicClassProps { 
  className: string
  declaration: { 
    property: string
    value: string 
  }
}

export class AtomicClass {
  className: string
  declaration: { 
    property: string
    value: string 
  }

  constructor({ className, declaration }: AtomicClassProps) {
    this.className = className
    this.declaration = declaration
  }

  toJSON() {
    const rule = new Rule({
      selector: `.${this.className}`,
      raws: {
        semicolon: true,
        before: '\n',
        after: ' ',
      },
    })

    rule.append(new Declaration({
      prop: this.declaration.property,
      value: this.declaration.value,
      raws: {
        before: ' ',
        after: ' ',
      }
    }))
    return rule
  }
}

export class CustomProperty {
  key: string
  value: string
  
  constructor({ key, value }: { key: string, value: string }) {
    this.key = key
    this.value = value // TODO: Resolve alias values
  }

  toJSON() {
    return new Declaration({
      prop: this.key,
      value: this.value,
      raws: {
        before: '\n  ',
        after: '',
      }
    })
  }
}
