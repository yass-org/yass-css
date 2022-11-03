import { build } from '../src/ast'
import { RuleDefinition } from '../src/rule-definitions/types'

const rules: RuleDefinition[] = [
  {
    propertyNames: ["display"],
    separator: '\\:',
    propertyValues: [
      {
        token: "initial",
        propertyValue: "initial"
      },
      {
        token: "inherit",
        propertyValue: "inherit"
      },
      {
        token: "unset",
        propertyValue: "unset"
      },
      {
        token: "revert",
        propertyValue: "revert"
      },
    ],
  }
]
