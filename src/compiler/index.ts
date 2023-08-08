import { Config } from '../config'
import * as CSS from 'css-data'
import { DesignToken } from '../types'
import { AtomicClassTransformer, CustomPropertyTransformer, AtRuleTransformer } from '../transformers'
import { StyleSheet, RootElement } from '../ast'


export interface YassSelector {
  property: string
  value: string
  token: string
  pseudos?: string[]
  atRules?: string[]
}

export interface CompileArgs {
  tokens: DesignToken[],
  transformers?: {
    AtomicClassTransformer: typeof AtomicClassTransformer,
    CustomPropertyTransformer: typeof CustomPropertyTransformer,
  }
  config: Config
}

export const JitCompiler = {

  compile({
    tokens,
    transformers = {
      AtomicClassTransformer,
      CustomPropertyTransformer,
    },
    config
  }: CompileArgs): string {
    const { src, } = config
    const { AtomicClassTransformer, CustomPropertyTransformer, } = transformers
    const buckets = {
      selectors: [],
      atRules: [],
    }

    const categories = JitCompiler
      .compileSelectors({ src, tokens, config })
      .reduce((buckets, selector: YassSelector) => {
        if(selector.atRules.length > 0) {
          buckets.atRules.push(selector)
        } else {
          buckets.selectors.push(selector)
        }

        return buckets
      }, buckets)

    const stylesheet = new StyleSheet([
    // Add the `:root` first
      new RootElement(
      // Add CSS Custom Properties to :root
        CustomPropertyTransformer.transform(tokens, config)
      ),

      ...AtomicClassTransformer.transform({ selectors: categories.selectors, config }),
      ...AtRuleTransformer.transform({ selectors: categories.atRules, tokens, config })
    ]).toJSON()

    const { css } = stylesheet

    return css
  },

  compileSelectors({ src, tokens, config }: {src: string[], tokens: DesignToken[], config: Config}): YassSelector[] {
    return src.flatMap((fileContent: string): YassSelector[] => {
      const candidateSelectors = fileContent.split(/[\s\"\']/)

      return candidateSelectors.map((candidateSelector: string): YassSelector => {
        const { selector, matches } = JitCompiler.matchesSelector(candidateSelector, config)
        if(!matches) {
          return
        }

        // split namespace away from the rest of the selector
        const [_namespace, classAndModifiers] = [config.rules.namespace, selector.replace(config.rules.namespace, '')]

        // split property away from the rest of the selector
        const [property, valueAndModifiers] = classAndModifiers.split(new RegExp(`${config.rules.separator}(.*)`))

        // split value away from the @ rules, and pseudo-classes
        const [value, ...modifiers] = valueAndModifiers.split(/[:@]/)

        // categorise modifiers into either @rules, or pseudo-classes
        const [pseudos, media] = modifiers.reduce((acc, curr) => {
          if(curr.startsWith('media')) {
            acc[1].push(curr)
          } else {
            acc[0].push(curr)
          }

          return acc
        }, [[], []]) // initialise with a couple of buckets to categorise the modifiers into

        if(!arePseudosValid(pseudos)) {
          // Don't generate the class if the pseudo is invalid, e.g. `:hoover`
          return
        }

        // check whether the candidate word is a valid css property and value, e.g. display: flex
        const rule = CSS.declarations.find((rule) => rule.property === property && rule.values.includes(value))  // TODO: Change format of tokens so it has fast lookup
        if(rule) {
          return {
            property,
            value,
            token: value,
            pseudos: pseudos.map((pseudo: string) => `:${pseudo}`),
            atRules: media,
          }
        }

        const token = tokens.find((token) => token.name === value || token.key === value)  // TODO: Change format of tokens so it has fast lookup
        if(token){
          return {
            property,
            value: `var(${CustomPropertyTransformer.property(token, config)})`,
            token: token.name || token.key,
            pseudos: pseudos.map((pseudo: string) => `:${pseudo}`),
            atRules: media,
          }
        }
      }).filter(Boolean)
    })
  },

  matchesSelector(candidateSelector: string, config: Config): { matches: boolean, selector: string} {
    const { namespace, separator } = config.rules
    const propertyPattern = '(\\w(-)*)+' // match hyphen separated words
    const valuePattern = '(\\w(-)*)+' // match hyphen separated words
    const modifiersPattern = '([@:].*)?' // Optional '@' or ':' followed by anything (basic check for pseudo, or at-rule)
    const pattern = `^${namespace}${propertyPattern}${separator}${valuePattern}${modifiersPattern}`

    return {
      matches: Boolean(candidateSelector.match(pattern)),
      selector: candidateSelector
    }
  }
}

const arePseudosValid = (userPseudos: string[]) => {
  // matches a leading pseudoclass name, like `nth-child`, followed by `(`, then not `()\s` and finally a `)
  const balancedParenthesesPattern = new RegExp(/^[^\(\)\s]+\([^\(\)\s]+\)$/)

  return userPseudos
    .every((userPseudo: string) => {
      const pseudo = CSS.pseudoclasses.find(({ name }) => name === userPseudo.replace(/\(.*$/, ''))
      if(!pseudo) {
        return false
      }

      if(pseudo.isFunctional) {
        return balancedParenthesesPattern.test(userPseudo)
      }

      return pseudo.name === userPseudo
    })
}
