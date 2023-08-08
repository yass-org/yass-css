import { YassSelector } from '../compiler'
import { Config } from '../config'
import { DesignToken } from '../types'
import { AtomicClassTransformer } from './atomic-class'
import { AtRule } from '../ast'
import * as CSS from 'css-data'

const supportedAtRules = CSS.atrules
  .filter(({ isConditional }) => isConditional)
  .map(({ name }) => name)

export const MediaQueryTransformer = {

  transform({ selectors, tokens, config }: { selectors: YassSelector[], tokens: DesignToken[], config: Config }) {
    // const mediaQueryTokens = tokens
    //   .filter((token: DesignToken) => token.category === 'media')

    // const buckets = mediaQueryTokens.reduce((buckets, token: DesignToken) => {
    //   buckets[token.key] = new AtRule({
    //     name: 'media',
    //     condition: token.value,
    //   })

    //   return buckets
    // }, {})

    const buckets = {}

    selectors.forEach((selector: YassSelector) => {
      selector.atRules.forEach((atRule: string) => {
        const resolvedAtRule = interpolate(atRule, tokens)
        const { name, condition } = splitAtRule(resolvedAtRule)
        if(!supportedAtRules.includes(name)) {
          return
        }

        if(!buckets[resolvedAtRule]) {
          buckets[resolvedAtRule] = new AtRule({ name, condition })
        }

        buckets[resolvedAtRule].append(AtomicClassTransformer.transform({ selectors: [selector], config }))
      })
    })

  },
}


const splitAtRule = (atRule: string) => {
  const [name, condition] = atRule.split('(')
  return {
    name,
    condition: `(${condition}`
  }
}