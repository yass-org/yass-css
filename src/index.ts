import { Config } from './config'
import * as CSS from 'css-data'
import { AtomicClassTransformer, CustomPropertyTransformer } from './transformers'
import { DesignToken } from './types'
export { AtomicClassTransformer, CustomPropertyTransformer } from './transformers'
export { JitCompiler } from './compiler'

export type { Config } from './config'
export type { DesignToken, Category } from './types'


interface Declaration {
  property: string
  values: string[]
}

export const buildBaseCSSDeclarations = ({ declarations = CSS.declarations, config }: { declarations: Declaration[], config: Config }) => {
  return AtomicClassTransformer
    .generate(declarations.flatMap((({ values, property }) => {
      return values.map((value) => ({
        key: value,
        value: value,
        properties: [property],
        customProperty: false,
      }))
    })), config)
}

export const buildRootElementDeclaration = ({ tokens, config }: { tokens: DesignToken[], config: Config }) => {
  return CustomPropertyTransformer.transform(tokens, config)
}
