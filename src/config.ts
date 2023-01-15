export interface Config {
  includeBaseClasses: boolean;
  token: {
    namespace?: string;
    separator?: string;
  }
  stylesheet: {
    buildPath?: string;
    filename?: string;
  },
  types: {
    buildPath?: string;
    filename?: string;
  },
}

export type UserConfig = Partial<Config>

const defaults: Config = {
  includeBaseClasses: true,
  token: {
    namespace: '',
    separator: '\\:',
  },
  stylesheet: {
    buildPath:'styles/yass/',
    filename: 'yass.css',
  },
  types: {
    buildPath: 'types/',
    filename: 'yass.ts',
  },
}

export const getConfig = (userConfig: UserConfig): Config => {

  const config: Config = {
    ...defaults,
    ...userConfig,
  }

  return config
}
