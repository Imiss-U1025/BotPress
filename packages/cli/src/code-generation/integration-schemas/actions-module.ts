import bluebird from 'bluebird'
import { casing } from '../../utils'
import { jsonSchemaToTypeScriptType } from '../generators'
import { Module, ModuleDef, ReExportTypeModule } from '../module'
import type * as types from '../typings'

type ActionInput = types.ActionDefinition['input']
type ActionOutput = types.ActionDefinition['output']

export class ActionInputModule extends Module {
  public static async create(input: ActionInput): Promise<ActionInputModule> {
    const schema = input.schema
    const name = 'input'
    const def: ModuleDef = {
      path: `${name}.ts`,
      exportName: 'Input',
      content: await jsonSchemaToTypeScriptType(schema, name),
    }
    return new ActionInputModule(def)
  }
}

export class ActionOutputModule extends Module {
  public static async create(output: ActionOutput): Promise<ActionOutputModule> {
    const schema = output.schema
    const name = 'output'
    const def: ModuleDef = {
      path: `${name}.ts`,
      exportName: 'Output',
      content: await jsonSchemaToTypeScriptType(schema, name),
    }
    return new ActionOutputModule(def)
  }
}

export class ActionModule extends ReExportTypeModule {
  public static async create(actionName: string, action: types.ActionDefinition): Promise<ActionModule> {
    const inputModule = await ActionInputModule.create(action.input)
    const outputModule = await ActionOutputModule.create(action.output)

    const inst = new ActionModule({
      exportName: `Action${casing.to.pascalCase(actionName)}`,
    })

    inst.pushDep(inputModule)
    inst.pushDep(outputModule)

    return inst
  }
}

export class ActionsModule extends ReExportTypeModule {
  public static async create(actions: Record<string, types.ActionDefinition>): Promise<ActionsModule> {
    const actionModules = await bluebird.map(Object.entries(actions), async ([actionName, action]) => {
      const mod = await ActionModule.create(actionName, action)
      return mod.unshift(actionName)
    })

    const inst = new ActionsModule({
      exportName: 'Actions',
    })

    inst.pushDep(...actionModules)
    return inst
  }
}
