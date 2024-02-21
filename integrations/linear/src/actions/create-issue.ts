import { getIssueTags, getLinearClient, getTeam } from '../misc/utils'
import { getIssueFields } from './get-issue'
import { IntegrationProps } from '.botpress'

export const createIssue: IntegrationProps['actions']['createIssue'] = async ({
  ctx,
  client,
  input: { title, description, priority, teamName, labels, project },
}) => {
  const linearClient = await getLinearClient(client, ctx.integrationId)

  const team = await getTeam(linearClient, undefined, teamName)

  if (!team.id) {
    throw new Error(`Could not find team "${teamName}"`)
  }

  const labelIds = labels ? await team.findLabelIds(labels) : undefined
  const projectId = project ? await team.findProjectId(project) : undefined

  const { issue: issueFetch } = await linearClient.createIssue({
    title,
    description,
    priority,
    teamId: team.id,
    labelIds,
    projectId,
    createAsUser: ctx.configuration.displayName,
    displayIconUrl: ctx.configuration.avatarUrl,
  })

  const fullIssue = await issueFetch
  if (!fullIssue) {
    throw new Error('Could not create issue')
  }

  const issue = getIssueFields(fullIssue)
  const issueTags = await getIssueTags(fullIssue)

  await client.getOrCreateConversation({
    channel: 'issue',
    tags: issueTags,
  })

  return {
    issue,
  }
}
