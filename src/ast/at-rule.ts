import {
  AtRule as PostCSSAtRule
} from 'postcss'
import { AtomicClass } from './atomic-class'

export interface AtRuleArgs {
  name: string
  condition?: string
}

export class AtRule {
  rule: PostCSSAtRule
  name: string
  condition?: number | string
  children: AtomicClass[]

  constructor({ name, condition }: AtRuleArgs){
    this.rule = new PostCSSAtRule({
      name,
      params: condition,
      raws: {
        semicolon: true,
        between: ' ',
        before: '\n',
        after: '\n',
      },
    })
  }

  appendAll(children: AtomicClass[]) {
    children.forEach((child: AtomicClass) => {
      child.indentation = 2
      this.rule.append(child.toJSON())
    })
  }

  append(child: AtomicClass) {
    this.rule.append(child.toJSON())
  }

  toJSON(): PostCSSAtRule {
    return this.rule
  }

  toString() {
    return this.toJSON().toString()
  }
}
