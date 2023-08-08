import {
  Declaration,
  Rule,
} from 'postcss'

export interface AtomicClassArgs {
  className: string
  selector: string
  indentation?: number
  declaration: {
    property: string
    value: string
  }
}

export class AtomicClass {
  className: string
  selector: string
  indentation?: number
  declaration: {
    property: string
    value: string
  }

  constructor({ className, selector, declaration, indentation = 0 }: AtomicClassArgs){
    this.className = className
    this.selector = selector
    this.declaration = declaration
    this.indentation = indentation
  }

  toJSON() {
    const rule = new Rule({
      selector: `.${this.className}`,
      raws: {
        semicolon: true,
        before: '\n'.padEnd(this.indentation, ' '),
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

  toString() {
    return this.toJSON().toString()
  }
}
