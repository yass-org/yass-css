import { FileSystem } from './file-system'
export interface UserConfig {
  src?: string;
  rules?: {
    namespace?: string;
    separator?: string;
  }
  stylesheet?: {
    buildPath?: string;
    filename?: string;
    include?: {
      baseClasses?: boolean;
      tokenClasses?: boolean;
      pseudos?: boolean;
    }
  },
}

export interface Config {
  src?: string[];
  rules: {
    namespace: string;
    separator: string;
  }
  stylesheet: {
    buildPath: string;
    filename: string;
    include: {
      baseClasses: boolean;
      tokenClasses: boolean;
      pseudos: boolean;
    }
  },
}

export const getConfig = (userConfig: Partial<UserConfig>): Config => {
  const { src } = userConfig
  const { buildPath, filename } = userConfig.stylesheet ?? {}
  const ignore = buildPath && filename ? [`${buildPath}/${filename}`] : []

  const config: Config = {
    src: src ? FileSystem.readDirectory(src, { ignore }) : undefined,
    rules: {
      namespace: userConfig?.rules?.namespace || '',
      separator: userConfig?.rules?.separator || ':',
    },
    stylesheet: {
      buildPath:  userConfig?.stylesheet?.buildPath || 'styles/yass/',
      filename: userConfig?.stylesheet?.filename || 'yass.css',
      include: {
        baseClasses: userConfig?.stylesheet?.include?.baseClasses !== undefined ? userConfig?.stylesheet?.include.baseClasses : true,
        tokenClasses: userConfig?.stylesheet?.include?.tokenClasses !== undefined ? userConfig?.stylesheet?.include.tokenClasses : true,
        pseudos: userConfig?.stylesheet?.include?.pseudos !== undefined ? userConfig?.stylesheet?.include.pseudos : true,
      }
    },
  }

  return config
}
