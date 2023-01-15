import { createCustomPropertyName } from "./create-custom-property-name";
import { getConfig } from "../config";

import type { DesignToken } from "../types";
import type { UserConfig, Config } from "../config";

describe('createCustomPropertyName()', () => {
  it('constructs basic custom property name from token', () => {
    const token: DesignToken = {
      key: 'very-red',
      value: 'rgb(255, 0, 0)',
    }

    const userConfig: UserConfig = {}
    const config: Config = getConfig(userConfig)
    const variable = createCustomPropertyName(token, config)

    expect(variable).toBe('--very-red')
  })

  it('adds namespace when provided in config', () => {
    const token: DesignToken = {
      key: 'very-red',
      value: 'rgb(255, 0, 0)',
    }

    const userConfig: UserConfig = {
      token: {
        namespace: 'gl-',
      }
    }
    const config: Config = getConfig(userConfig)
    const variable = createCustomPropertyName(token, config)

    expect(variable).toBe('--gl-very-red')
  })

  it('ignores token.name when constructing custom property name', () => {
    const token: DesignToken = {
      key: 'very-red',
      value: 'rgb(255, 0, 0)',
      name: 'red'
    }

    const userConfig: UserConfig = {
      token: {
        namespace: 'gl-',
      }
    }
    const config: Config = getConfig(userConfig)
    const variable = createCustomPropertyName(token, config)

    expect(variable).toBe('--gl-very-red')
  })  
})