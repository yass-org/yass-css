import { Rule } from 'postcss'
import { CustomProperty } from './custom-property'

export class ThemeClass {
  selector: string
  rule: Rule

  constructor({ selector }: { selector: string }) {
    this.selector = selector
    this.rule = new Rule({ selector })
  }

  append(children: CustomProperty) {
    this.rule.append(children.toJSON())
  }

  toJSON() {
    return this.rule
  }

  toString() {
    return this.toJSON().toString()
  }  
}
