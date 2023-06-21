import { USER_DATA_STATE_NAME } from '../const'
import { Implementation } from '../misc/types'

export const getUserData: Implementation['actions']['getUserData'] = async ({ client, input }) => {
  try {
    const resp = await client.getState({ type: 'user', id: input.userId, name: USER_DATA_STATE_NAME })
    return { userData: resp.state.payload }
  } catch (err) {
    if ((err as any).type === 'ResourceNotFound') {
      return {}
    }
    throw err
  }
}
