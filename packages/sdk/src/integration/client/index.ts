import { Client } from '@botpress/client'
import { BaseIntegration } from '../generic'
import * as routes from './routes'

/**
 * Just like the regular botpress client, but typed with the integration's properties.
 */
export class IntegrationSpecificClient<TIntegration extends BaseIntegration> {
  public constructor(private readonly client: Client) {}

  public createConversation: routes.CreateConversation<TIntegration> = (x) => this.client.createConversation(x)
  public getConversation: routes.GetConversation<TIntegration> = (x) => this.client.getConversation(x)
  public listConversations: routes.ListConversations<TIntegration> = (x) => this.client.listConversations(x)
  public getOrCreateConversation: routes.GetOrCreateConversation<TIntegration> = (x) =>
    this.client.getOrCreateConversation(x)
  public updateConversation: routes.UpdateConversation<TIntegration> = (x) => this.client.updateConversation(x)
  public deleteConversation: routes.DeleteConversation<TIntegration> = (x) => this.client.deleteConversation(x)

  public listParticipants: routes.ListParticipants<TIntegration> = (x) => this.client.listParticipants(x)
  public addParticipant: routes.AddParticipant<TIntegration> = (x) => this.client.addParticipant(x)
  public getParticipant: routes.GetParticipant<TIntegration> = (x) => this.client.getParticipant(x)
  public removeParticipant: routes.RemoveParticipant<TIntegration> = (x) => this.client.removeParticipant(x)

  public createEvent: routes.CreateEvent<TIntegration> = (x) => this.client.createEvent(x)
  public getEvent: routes.GetEvent<TIntegration> = (x) => this.client.getEvent(x)
  public listEvents: routes.ListEvents<TIntegration> = (x) => this.client.listEvents(x)

  public createMessage: routes.CreateMessage<TIntegration> = (x) => this.client.createMessage(x)
  public getOrCreateMessage: routes.GetOrCreateMessage<TIntegration> = (x) => this.client.getOrCreateMessage(x)
  public getMessage: routes.GetMessage<TIntegration> = (x) => this.client.getMessage(x)
  public updateMessage: routes.UpdateMessage<TIntegration> = (x) => this.client.updateMessage(x)
  public listMessages: routes.ListMessages<TIntegration> = (x) => this.client.listMessages(x)
  public deleteMessage: routes.DeleteMessage<TIntegration> = (x) => this.client.deleteMessage(x)

  public createUser: routes.CreateUser<TIntegration> = ((x) =>
    this.client.createUser(x)) as routes.CreateUser<TIntegration>
  public getUser: routes.GetUser<TIntegration> = ((x) => this.client.getUser(x)) as routes.GetUser<TIntegration>
  public listUsers: routes.ListUsers<TIntegration> = (x) => this.client.listUsers(x)
  public getOrCreateUser: routes.GetOrCreateUser<TIntegration> = ((x) =>
    this.client.getOrCreateUser(x)) as routes.GetOrCreateUser<TIntegration>
  public updateUser: routes.UpdateUser<TIntegration> = ((x) =>
    this.client.updateUser(x)) as routes.UpdateUser<TIntegration>
  public deleteUser: routes.DeleteUser<TIntegration> = (x) => this.client.deleteUser(x)

  public getState: routes.GetState<TIntegration> = ((x) => this.client.getState(x)) as routes.GetState<TIntegration>
  public setState: routes.SetState<TIntegration> = ((x) => this.client.setState(x)) as routes.SetState<TIntegration>
  public patchState: routes.PatchState<TIntegration> = ((x) =>
    this.client.patchState(x)) as routes.PatchState<TIntegration>

  public configureIntegration: routes.ConfigureIntegration<TIntegration> = (x) => this.client.configureIntegration(x)
}
