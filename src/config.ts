export interface Config {
  includeBaseClasses: boolean;
  stylesheet?: {
    buildPath?: string;
    filename?: string;
  },
  types?: {
    buildPath?: string;
    filename?: string;
  },
}


const defaults: Config = {
  includeBaseClasses: true,
  stylesheet: {
    buildPath:'styles/yass/',
    filename: 'yass.css',
  },
  types: {
    buildPath: 'types/',
    filename: 'yass.ts',
  },
}



const getConfig = (): Config => {
  const userConfig: Partial<Config> = require(`${process.cwd()}/yass.config.json`) // Open user config JSON

  const config: Config = {
    ...defaults,
    ...userConfig,
  }

  return config
}

export default getConfig
