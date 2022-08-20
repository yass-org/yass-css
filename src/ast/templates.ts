import type { RootTemplate, RuleTemplate, PropertyTemplate } from './types'

export const root = (): RootTemplate => ({
  "type": "root",
  "nodes": []
})

export const rule = ({ selector, propertyName, propertyValue }): RuleTemplate => ({
  "type": "rule",
  selector,
  "raws": {
    "before": "\n",
    "between": " ",
    "semicolon": true,
    "after": "\n"
  },
  "nodes": [
    declaration({propertyName, propertyValue})
  ]
})

const declaration = ({propertyName, propertyValue}): PropertyTemplate => ({
  "raws": {
    "before": "\n  ",
    "between": ": "
  },
  "type": "decl",
  prop: propertyName,
  value: propertyValue,
})
