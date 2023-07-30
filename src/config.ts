import { FileSystem } from './file-system'
export interface UserConfig {
  src: string;
  rules?: {
    namespace?: string;
    separator?: string;
  }
  stylesheet?: {
    buildPath?: string;
    filename?: string;
  },
}

export interface Config {
  src: string[];
  rules: {
    namespace: string;
    separator: string;
  }
  stylesheet: {
    buildPath: string;
    filename: string;
  },
}

export const getConfig = (userConfig: Partial<UserConfig>): Config => {
  const { src } = userConfig
  const { buildPath, filename } = userConfig.stylesheet ?? {}
  const ignore = buildPath && filename ? [`${buildPath}/${filename}`] : []

  if(!src) {
    throw new Error('Please specify `src` property in `yass.config.json`.')
  }

  const config: Config = {
    src: FileSystem.readDirectory(src, { ignore }),
    rules: {
      namespace: userConfig?.rules?.namespace || defaultConfig.rules.namespace,
      separator: userConfig?.rules?.separator || defaultConfig.rules.separator,
    },
    stylesheet: {
      buildPath:  userConfig?.stylesheet?.buildPath || defaultConfig.stylesheet.buildPath,
      filename: userConfig?.stylesheet?.filename || defaultConfig.stylesheet.filename,
    },
  }

  return config
}

export const defaultConfig: Config = {
  src: [],
  rules: {
    namespace: '',
    separator: ':',
  },
  stylesheet: {
    buildPath: 'styles/yass/',
    filename: 'yass.css',
  },
}