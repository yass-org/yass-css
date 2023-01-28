import { resolveCustomProperties } from "./resolve-custom-properties"
import { getConfig } from "../config";

import type { DesignToken } from "../types";
import type { UserConfig, Config } from "../config";
import { Declaration } from "postcss";
import { CustomProperty } from "../postcss-wrapper";

describe("resolveCustomProperties()", () => {
  it("maps basic tokens", () => {
    const userConfig: UserConfig = {}
    const config: Config = getConfig(userConfig)
    const tokens: DesignToken[] = [
      {
        key: 'blue-500',
        value: '#0063bd'
      },
    ]
    
    const result = resolveCustomProperties(tokens, config)
      .map((customProperty: CustomProperty) => 
        customProperty.toString())
  
    expect(result).toEqual(['--blue-500: #0063bd']);
  });
  
  it("resolves alias tokens", () => {
    const userConfig: UserConfig = {}
    const config: Config = getConfig(userConfig)
    const tokens: DesignToken[] = [
      {
        key: 'blue-500',
        value: '#0063bd'
      },
      {
        key: 'brand-primary',
        value: '{blue-500}'
      },      
    ]

    const result = resolveCustomProperties(tokens, config)
      .map((customProperty: CustomProperty) => 
        customProperty.toString())

    expect(result).toEqual([
      '--blue-500: #0063bd',
      '--brand-primary: var(--blue-500)',      
    ])
  });

  it("orders tokens to ensure they can be resolved", () => {
    const userConfig: UserConfig = {}
    const config: Config = getConfig(userConfig)
    const tokens: DesignToken[] = [
      {
        key: 'brand-primary',
        value: '{blue-500}'
      },    
      {
        key: 'blue-500',
        value: '#0063bd'
      },  
    ]

    const result = resolveCustomProperties(tokens, config)
      .map((customProperty: CustomProperty) => 
        customProperty.toString())

    expect(result).toEqual([
      '--blue-500: #0063bd',
      '--brand-primary: var(--blue-500)',
    ])
  });
  
  it("resolves to the correct token", () => {
    const userConfig: UserConfig = {}
    const config: Config = getConfig(userConfig)
    const tokens: DesignToken[] = [
{
        key: 'brand-primary',
        value: '{blue-500}'
      },    
      {
        key: 'blue-500',
        value: '#0063bd'
      },  
      {
        key: 'button-color-brand-primary',
        value: '{brand-primary}'
      },
    ]

    const result = resolveCustomProperties(tokens, config)
      .map((customProperty: CustomProperty) => 
        customProperty.toString())

    expect(result).toEqual([
      '--blue-500: #0063bd',
      '--brand-primary: var(--blue-500)',
      '--button-color-brand-primary: var(--brand-primary)',
    ])
  });  
  
  
  it("handles empty array", () => {
    const userConfig: UserConfig = {}
    const config: Config = getConfig(userConfig)
    const tokens: DesignToken[] = []

    expect(resolveCustomProperties(tokens, config)).toEqual([])
  })
  
  it("throws an error when alias token cannot be resolved", () => {
    const userConfig: UserConfig = {}
    const config: Config = getConfig(userConfig)
    const tokens: DesignToken[] = [
      {
        key: 'blue-500',
        value: '{alias-to-a-token-that-does-not-exist}'
      },
    ]
    
    expect(() => resolveCustomProperties(tokens, config)).toThrow(
      new Error("Unable to resolve tokens. You may have an alias token that doesn't reference a valid token.")
    );
  })
})

