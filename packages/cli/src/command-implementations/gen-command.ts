import type { IntegrationDefinition } from '@botpress/sdk'
import chalk from 'chalk'
import * as codegen from '../code-generation'
import type commandDefinitions from '../command-definitions'
import * as errors from '../errors'
import * as utils from '../utils'
import { ProjectCommand } from './project-command'

export type GenerateCommandDefinition = typeof commandDefinitions.generate
export class GenerateCommand extends ProjectCommand<GenerateCommandDefinition> {
  public async run(): Promise<void> {
    const integrationDef = await this.readIntegrationDefinitionFromFS()
    if (!integrationDef) {
      this.logger.warn('No typings to generate for bot')
      return
    }

    this._validateSecrets(integrationDef)

    const line = this.logger.line()

    const { name } = integrationDef
    line.started(`Generating typings for integration ${chalk.bold(name)}...`)

    const fromWorkDir = this.projectPaths.rel('workDir')
    const fromOutDir = this.projectPaths.rel('outDir')

    const typingFiles = await codegen.generateIntegrationImplementationTypings(
      integrationDef,
      fromOutDir.implementationDir
    )

    const secretFiles = await codegen.generateIntegrationSecrets(integrationDef, fromOutDir.secretsDir)

    const indexFile = await codegen.generateIntegrationIndex(fromOutDir.implementationDir, fromOutDir.secretsDir)

    const generatedFiles = [...typingFiles, ...secretFiles, indexFile]

    await this.writeGeneratedFilesToOutFolder(generatedFiles)

    line.success(`Typings available at ${chalk.grey(fromWorkDir.outDir)}`)
  }

  private _validateSecrets(integrationDef: IntegrationDefinition): void {
    const { secrets } = integrationDef
    if (!secrets) {
      return
    }

    for (const secretName in secrets) {
      if (!utils.casing.is.screamingSnakeCase(secretName)) {
        throw new errors.BotpressCLIError(`Secret ${secretName} should be in SCREAMING_SNAKE_CASE`)
      }
    }
  }
}
