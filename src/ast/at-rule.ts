import {
  AtRule as PostCSSAtRule
} from 'postcss'
import { AtomicClass } from './atomic-class'

export interface AtRuleArgs {
  name: string
  condition?: string
}

export class AtRule {
  name: string
  condition?: number | string
  children: AtomicClass[]

  constructor({ name, condition }: AtRuleArgs){
    this.name = name
    this.condition = condition
    this.children = []
  }

  toJSON() {
    const rule = new PostCSSAtRule({
      name: this.name,
      params: this.condition,
      raws: {
        semicolon: true,
        before: '\n',
        after: ' ',
      },
    })

    this.children.forEach((child) => {
      rule.append(child.toJSON())
    })
    return rule
  }

  append(child: AtomicClass) {
    this.children.push(child)
  }

  toString() {
    return this.toJSON().toString()
  }
}
