import { 
  Declaration,
  Root,
  Rule, 
} from 'postcss'

/**
 * A `:root` element
 */
export class RootElement {
  root: Rule

  constructor(children: CustomProperty[]) {
    this.root = new Rule({
      selector: ':root',
      raws: {
        after: '\n'
      }
    })

    this.appendAll(children)
  }

  appendAll(children: CustomProperty[]) {
    children.forEach((child: CustomProperty) => {
      this.root.append(child.toJSON())
    })
  }

  append(child: CustomProperty) {
   this.root.append(child.toJSON()) 
  }

  toJSON(): Rule {
    return this.root
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
    this.value = value
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

  toString() {
    return new Declaration({
      prop: this.key,
      value: this.value,
      raws: {
        before: '\n  ',
        after: '',
      }
    }).toString()
  }
}


export class StyleSheet {
  root: Root

  constructor(children: Array<RootElement | ThemeClass | AtomicClass>) {
    this.root = new Root()

    children.forEach((child: RootElement | AtomicClass) => {
      this.root.append(child.toJSON())
    })
  }

  append(children: RootElement | AtomicClass) {
    this.root.append(children.toJSON())
  }

  toJSON () {
    return this.root
  }
}

export class ThemeClass {
  selector: string
  rule: Rule

  constructor({ selector }: { selector: string }) {
    this.selector = selector
    this.rule = new Rule({ selector: this.selector })
  }

  append(children: CustomProperty) {
    this.rule.append(children.toJSON())
  }

  toJSON() {
    return this.rule
  }
}