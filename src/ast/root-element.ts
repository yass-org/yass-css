import { Rule } from 'postcss'

import { CustomProperty } from './custom-property'

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

  toString() {
    return this.toJSON().toString()
  }  
}
