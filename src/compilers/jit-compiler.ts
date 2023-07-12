import { Config } from '../config'
import rules from '../definitions/css/rules.json'
import { DesignToken } from '../types'
import { FileSystem } from '../file-system'
import { AtomicClassTransformer, CustomPropertyTransformer } from '../transformers'
import { StyleSheet, RootElement } from '../ast'


/**
 * TODO: I want `rules` to look more like this:
 * [
 *  {
 *    property: 'display',
 *    values: [
 *     "initial",
 *     "inherit",
 *     "unset",
 *     "revert",
 *     "revert-layer",
 *     "inline",
 *     "block",
 *    ],
 *    tokenisable: false,
 *  },
 *  {
 *    property: 'background-color',
 *    values: [
 *     "initial",
 *     "inherit",
 *     "unset",
 *     "revert",
 *     "revert-layer",
 *    ],
 *    tokenisable: true,
 *  }
 * ]
 */

export interface YassClassUsage {
  property: string
  value: string
  token: string
  pseudos?: string[]
  mediaQuery?: string
}

export const JitCompiler = {

  build({ tokens, config }: { tokens: DesignToken[], config: Config }): string {
    const { src, } = config
    const { buildPath, filename } = config.stylesheet

    const fileContents = FileSystem.readDirectory(src, { ignore: [`${buildPath}/${filename}`]})
    const usages = JitCompiler
      .findUsages({fileContents, tokens, config})


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

  findUsages({fileContents, tokens, config}: {fileContents: string[], tokens: DesignToken[], config: Config}): YassClassUsage[] | undefined {
    if(!config.src) {
      return
    }

    const usages: YassClassUsage[] = []

    fileContents.forEach((fileContent: string) => {
      const candidateUsages = fileContent.split(/[\s\"\']/)

      candidateUsages.forEach((candidateUsage: string) => {
        // split `background-color:red-500:hover:focus` into `['background-color', 'red-500:hover:focus']`
        const pivot = candidateUsage.indexOf(config.rules.separator)
        const [property, valueAndPseudos] = [candidateUsage.substring(0, pivot), candidateUsage.substring(pivot + 1)]
        // split `:red-500:hover:focus` into `['red-500', 'hover', 'focus']`
        const [value, ...pseudos] = valueAndPseudos.split(':')

        if(!property || !value) {
          return
        }

        // check whether the candidate word is a valid css property and value, e.g. display: flex
        if(rules[property] && rules[property].includes(value)) {
          usages.push({
            property,
            value,
            token: value,
            pseudos: pseudos.map((pseudo: string) => `:${pseudo}`),
          })

        }

        const token = tokens.find((token) => token.name === value || token.key === value)  // TODO: Change format of tokens so it has fast lookup
        if(token){
          usages.push({
            property,
            value: token.value,
            token: token.name || token.key,
            pseudos: pseudos.map((pseudo: string) => `:${pseudo}`),
          })
        }
      }, {})

    })

    return usages
  },
}
