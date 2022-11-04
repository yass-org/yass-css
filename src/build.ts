import postcss from "postcss"
import * as tokens from './design-system/tokens'
import { utility } from "./design-system/utility-classes"
import declarations from './base_css'

import { Root, Rule, Declaration } from './ast'

import type { TokenDefinitions } from './design-system/tokens'
import type { BaseCSSDeclarations } from './base_css'

export default () => {
  const processor = postcss([]);
  
  const root = new Root()

  root.appendNodes(generateBaseCSSClasses(declarations))
  root.appendNodes(generateFromTokenDefinitions(tokens.base.scale))
  root.appendNodes(generateFromTokenDefinitions(tokens.base.color))
  root.appendNodes(generateFromTokenDefinitions(tokens.base.opacity))
  root.appendNodes(generateAliasTokens(tokens.aliases))
  root.appendNodes(generateUtilityClasses(utility))

  // Turn the JSON AST representation into an actual AST
  let rehydrated = postcss.fromJSON(root.json())

  // Render the AST as actual CSS
  const css = processor.process(rehydrated).css

  return css
}

/**
 * Converts something like:
 * ```
 *  tokens: {
 *    '0': '0px',
 *    '100': '2px',
 *    ...
 *  },
 *  properties: [
 *    'gap',
 *    'margin',
 *    ...
 *  ]
 * ```
 * 
 * into vanilla CSS that looks like:
 * ```
 *  .gap\:0 { gap:0; }
 *  .gap\:100 { gap:100; }
 *  .margin\:0 { margin:0; }
 *  .margin\:100 { margin:100; }
 *  ...
 * ```
 */
const generateFromTokenDefinitions = ({ tokens, properties }: TokenDefinitions): Rule[] => {
  const rules: Rule[] = []

  properties.forEach((propertyName) => {
    for (const [tokenName, tokenValue] of Object.entries(tokens)) {
      const rule = new Rule({ 
        selector: `.${propertyName}\\:${tokenName}`, // e.g. .padding:300
        declarations: [new Declaration({ property: propertyName, value: tokenValue})]
      })

      rules.push(rule)
    }
  })

  return rules
}

/**
 * Converts something like:
 * ```
 *  tokens: {
 *    'small': base.scale.tokens['300'],
 *    'medium': base.scale.tokens['500'],
 *    ...
 *  },
 *  properties: [
 *    'font-size',
 *  ]
 * ```
 * 
 * into vanilla CSS that looks like:
 * ```
 *  .font-size\:small { font-size: 6px; }
 *  .font-size\:medium { font-size:16px; }
 *  ...
 * ```
 */
const generateAliasTokens = (aliases: TokenDefinitions[]): Rule[] => {
  const rules: Rule[] = []

  aliases.forEach((alias) => {
    rules.push(...generateFromTokenDefinitions(alias))
  })

  return rules
}

/**
 * Converts something like:
 * ```
 *  {
 *    property: "display",
 *    values: [ "block", "inline", ... ]
 *  }
 * ```
 * 
 * into vanilla CSS that looks like:
 * ```
 *  .display\:block { display: block; }
 *  .display\:inline { display: inline; }
 *  ...
 * ```
 */
const generateBaseCSSClasses = (declarations: BaseCSSDeclarations[]) => { // TODO: rename decleration to definition
  const rules: Rule[] = []
  
  declarations.forEach((declaration) => {
    const { property, values } = declaration

    values.forEach((value) => {
      const rule = new Rule({ 
        selector: `.${property}\\:${value}`, // e.g. .display:block
        declarations: [new Declaration({ property: property, value: value})]
      })

      rules.push(rule)
    })
  })

  return rules
}

/**
 * Converts something like:
 * ``` 
 * {
 *   name: 'debug',
 *   declarations: [
 *     {
 *       property: 'background-color',
 *       value: base.color.tokens['red-900']
 *     },
 *     {
 *       property: 'opacity',
 *       value: base.opacity.tokens['10']
 *     },
 *   ],
 * },
 * ```
 * 
 * into vanilla CSS that looks like:
 * ```
 * .debug {
 *   background-color: hsl(0, 100%, 15%);
 *   opacity: 10%;
 * }
 * ```
 */
const generateUtilityClasses = (definitions) => {
  const rules: Rule[] = []

  definitions.forEach((definition) => {
    const { name, declarations } = definition
    const resolvedDeclarations = declarations.map((declaration) => new Declaration(declaration))
    
    const rule = new Rule({selector: `.${name}`, declarations: resolvedDeclarations})
    rules.push(rule)
  })
  
  return rules
}