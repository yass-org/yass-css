import { Config } from '../config'
import * as CSS from 'css-data'
import { DesignToken } from '../types'
import { AtomicClassTransformer, CustomPropertyTransformer } from '../transformers'
import { StyleSheet, RootElement } from '../ast'


export interface YassSelector {
  property: string
  value: string
  token: string
  pseudos?: string[]
  // mediaQuery?: string TODO: implement this
}

export const JitCompiler = {

  build({ tokens, config }: { tokens: DesignToken[], config: Config }): string {
    const { src, } = config

    const usages = JitCompiler
      .findUsages({ src, tokens, config })


    const stylesheet = new StyleSheet([
    // Add the `:root` first
      new RootElement(
      // Add CSS Custom Properties to :root
        CustomPropertyTransformer.transform(tokens, config)
      ),

      ...AtomicClassTransformer.fromUsages({ usages, config })
    ]).toJSON()

    const { css } = stylesheet

    return css
  },

  findUsages({ src, tokens, config }: {src: string[], tokens: DesignToken[], config: Config}): YassSelector[] {

    return src.flatMap((fileContent: string): YassSelector[] => {
      const candidateUsages = fileContent.split(/[\s\"\']/)

      return candidateUsages.map((candidateUsage: string) => {
        // split `background-color:red-500:hover:focus` into `['background-color', 'red-500:hover:focus']`
        const pivot = candidateUsage.indexOf(config.rules.separator)
        const [namespaceAndProperty, valueAndPseudos] = [candidateUsage.substring(0, pivot), candidateUsage.substring(pivot + 1)]
        const property = namespaceAndProperty.replace(config.rules.namespace, '')
        // split `:red-500:hover:focus` into `['red-500', 'hover', 'focus']`
        const [value, ...pseudos] = valueAndPseudos.split(':')

        if(!property || !value) {
          return
        }

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
          }
        }

        const token = tokens.find((token) => token.name === value || token.key === value)  // TODO: Change format of tokens so it has fast lookup
        if(token){
          return {
            property,
            value: `var(${CustomPropertyTransformer.property(token, config)})`,
            token: token.name || token.key,
            pseudos: pseudos.map((pseudo: string) => `:${pseudo}`),
          }
        }
      }).filter(Boolean)
    })
  },
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
