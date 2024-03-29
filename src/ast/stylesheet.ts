import postcss, { Root } from 'postcss'

import { AtomicClass } from './atomic-class'
import { RootElement } from './root-element'


export class StyleSheet {
  root: Root

  constructor(children: Array<RootElement | AtomicClass>) {
    this.root = new Root()

    children.forEach((child: RootElement | AtomicClass) => {
      this.root.append(child.toJSON())
    })
  }

  append(children: RootElement | AtomicClass) {
    this.root.append(children.toJSON())
  }

  toJSON() {
    return postcss().process(this.root)
  }
}
