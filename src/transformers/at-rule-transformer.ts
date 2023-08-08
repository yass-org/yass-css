import { YassSelector } from '../compiler'
import { Config } from '../config'
import { DesignToken } from '../types'
import { AtomicClassTransformer } from './atomic-class'
import { AtRule } from '../ast'
import * as CSS from 'css-data'
import { interpolate } from '../utils/interpolate'

const supportedAtRules = CSS.atrules
  .filter(({ isConditional }) => isConditional)
  .map(({ name }) => name)

export const AtRuleTransformer = {

  transform({ selectors, tokens, config }: { selectors: YassSelector[], tokens: DesignToken[], config: Config }): AtRule[] {
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

        buckets[resolvedAtRule].appendAll(AtomicClassTransformer.transform({ selectors: [selector], config }))
      })
    })

    return Object.values(buckets)
  },
}


const splitAtRule = (atRule: string) => {
  const [name, condition] = atRule.split('(')
  return {
    name,
    condition: `(${condition}`
  }
}