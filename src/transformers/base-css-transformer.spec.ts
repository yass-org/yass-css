import { BaseCSSTransformer } from './base-css-transformer'
import { getConfig } from "../config";
import { AtomicClass } from "../ast";

import type { CSSRules } from "../types";
import type { Config } from "../config";

describe("BaseCSSTransformer", () => {
  describe('transform()', () => {
    it("transforms a css rule into an atomic class", () => {
      const userConfig: Partial<Config> = {}
      const config: Config = getConfig(userConfig)
      const rules: CSSRules = {
        display: [
          "initial",
          "inherit",
          "unset",
          "revert",
          "revert-layer",
          "inline",
          "block",
          "flow",
          "flow-root",
          "list-item",
          "compact",
          "inline-block",
          "run-in",
          "table",
          "inline-table",
          "table-row-group",
          "table-header-group",
          "table-footer-group",
          "table-row",
        ]
      }
      
      const result = BaseCSSTransformer.transform(rules, config)
        .map((atomicClass: AtomicClass) => 
          atomicClass.toString())
    
      expect(result).toEqual([
        ".display\\:initial { display: initial; }",
        ".display\\:inherit { display: inherit; }",
        ".display\\:unset { display: unset; }",
        ".display\\:revert { display: revert; }",
        ".display\\:revert-layer { display: revert-layer; }",
        ".display\\:inline { display: inline; }",
        ".display\\:block { display: block; }",
        ".display\\:flow { display: flow; }",
        ".display\\:flow-root { display: flow-root; }",
        ".display\\:list-item { display: list-item; }",
        ".display\\:compact { display: compact; }",
        ".display\\:inline-block { display: inline-block; }",
        ".display\\:run-in { display: run-in; }",
        ".display\\:table { display: table; }",
        ".display\\:inline-table { display: inline-table; }",
        ".display\\:table-row-group { display: table-row-group; }",
        ".display\\:table-header-group { display: table-header-group; }",
        ".display\\:table-footer-group { display: table-footer-group; }",
        ".display\\:table-row { display: table-row; }",        
      ])
    })  
      
    it("handles empty array", () => {
      const userConfig: Partial<Config> = {}
      const config: Config = getConfig(userConfig)
      const rules: CSSRules = {
        display: []
      }  
      const result = BaseCSSTransformer.transform(rules, config)
            
      expect(result).toEqual([])
    })
      
    it("handles empty object", () => {
      const userConfig: Partial<Config> = {}
      const config: Config = getConfig(userConfig)
      const rules: CSSRules = {}
      const result = BaseCSSTransformer.transform(rules, config)
            
      expect(result).toEqual([])
    })

    describe('className()', () => {
      it('constructs a class name', () => {  
        const userConfig: Partial<Config> = {}
        const config: Config = getConfig(userConfig)
        const property = 'display'
        const value = 'flex'
        const variable = BaseCSSTransformer.className(property, value, config)
  
        expect(variable).toBe('display\\:flex')
      })

      it('uses separator provided in config ', () => {  
        const userConfig: Partial<Config> = {
          rules: {
            separator: '-'
          }
        }

        const config: Config = getConfig(userConfig)
        const property = 'display'
        const value = 'flex'
        const variable = BaseCSSTransformer.className(property, value, config)
  
        expect(variable).toBe('display-flex')
      })

      it('uses namespace provided in config ', () => {  
        const userConfig: Partial<Config> = {
          rules: {
            namespace: 'ds-'
          }
        }

        const config: Config = getConfig(userConfig)
        const property = 'display'
        const value = 'flex'
        const variable = BaseCSSTransformer.className(property, value, config)
  
        expect(variable).toBe('ds-display\\:flex')
      })
    })  
  })
})

