import os from 'os'
import pathlib from 'path'
import { CLI_ROOT_DIR } from './root'

// configurable

export const defaultBotpressHome = pathlib.join(os.homedir(), '.botpress')

export const defaultOutputFolder = '.botpress'
export const defaultEntrypoint = pathlib.join('src', 'index.ts')
export const defaultBotpressApiUrl = 'https://api.botpress.cloud'
export const defaultBotpressAppUrl = 'https://app.botpress.cloud'
export const defaultTunnelUrl = 'https://tunnel.botpress.cloud'

// not configurable

export const cliRootDir = CLI_ROOT_DIR

export const echoBotDirName = 'echo-bot'
export const emptyIntegrationDirName = 'empty-integration'

export const fromCliRootDir = {
  echoBotTemplate: pathlib.join('templates', echoBotDirName),
  emptyIntegrationTemplate: pathlib.join('templates', emptyIntegrationDirName),
}

export const fromHomeDir = {
  globalCacheFile: 'global.cache.json',
}

export const fromWorkDir = {
  definition: 'integration.definition.ts',
}

export const fromOutDir = {
  distDir: 'dist',
  outFile: pathlib.join('dist', 'index.js'),
  installDir: 'installations',
  implementationDir: 'implementation',
  secretsDir: 'secrets',
  projectCacheFile: 'project.cache.json',
}
