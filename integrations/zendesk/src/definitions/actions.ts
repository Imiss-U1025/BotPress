import { IntegrationDefinitionProps } from '@botpress/sdk'
import z from 'zod'
import { ticketSchema, userSchema } from './schemas'

const getTicketConversation = {
  title: 'Get Ticket Conversation',
  description: 'Proactively create or get a botpress conversation on a zendesk ticket',
  input: {
    schema: z.object({
      ticketId: z.string().describe('The ID of the ticket'),
    }),
    ui: {
      ticketId: {
        title: 'Ticket id',
      },
    },
  },
  output: {
    schema: z.object({
      conversationId: z.string().describe('The ID of the conversation'),
      tags: z.record(z.string()).describe('The tags of the conversation'),
    }),
  },
}

const createTicket = {
  title: 'Create Ticket',
  description: 'Creates a new ticket in Zendesk',
  input: {
    schema: z.object({
      subject: z.string().describe('Subject for the ticket'),
      comment: z.string().describe('Comment for the ticket'),
      requesterName: z.string().describe('Requester name'),
      requesterEmail: z.string().describe('Requester email'),
    }),
    ui: {
      subject: {
        title: 'Ticket subject',
      },
      comment: {
        title: 'Ticket comment',
      },
      requesterName: {
        title: 'Requester name',
      },
      requesterEmail: {
        title: 'Requester email',
      },
    },
  },
  output: {
    schema: z.object({
      ticket: ticketSchema,
    }),
  },
}

const getTicket = {
  title: 'Get ticket',
  description: 'Get Ticket by id.',
  input: {
    schema: z.object({
      ticketId: z.string().describe('The ID of the ticket'),
    }),
    ui: {
      ticketId: {
        title: 'Ticket id',
      },
    },
  },
  output: {
    schema: z.object({ ticket: ticketSchema }),
  },
}

const closeTicket = {
  title: 'Close ticket',
  description: 'Close a ticket by its id.',
  input: {
    schema: z.object({
      ticketId: z.string().describe('ID of the ticket to close'),
      comment: z.string().optional().describe('Closing comment'),
    }),
    ui: {
      ticketId: {
        title: 'Ticket ID',
      },
      comment: {
        title: 'Closing comment',
      },
    },
  },
  output: {
    schema: z.object({ ticket: ticketSchema }),
  },
}

const findCustomer = {
  title: 'Find Customer',
  description: 'Find a Customer in Zendesk',
  input: {
    schema: z.object({
      query: z
        .string()
        .min(2)
        .describe('partial or full value of any user property, including name, email address, notes, or phone.'),
    }),
    ui: {
      query: {
        title: 'Search Query',
      },
    },
  },
  output: {
    schema: z.object({
      customers: z.array(userSchema),
    }),
  },
}

const listAgents = {
  title: 'List Agents',
  description: 'List agents',
  input: {
    schema: z.object({
      isOnline: z.boolean().optional().default(true).describe('Only return agents that are currently online'),
    }),
  },
  output: {
    schema: z.object({
      agents: z.array(userSchema),
    }),
  },
}

const setConversationRequester = {
  title: 'Set Conversation Requester',
  description:
    'Assign a requester to a conversation. Every outgoing message in the conversation will then be sent as this requester instead of your bot.',
  input: {
    schema: z.object({
      conversationId: z.string().describe('The Botpress conversation Id to assign the requester to'),
      requesterId: z.string().describe('The Zendesk requester Id to assign to the conversation'),
    }),
  },
  output: {
    schema: z.object({}),
  },
} satisfies NonNullable<IntegrationDefinitionProps['actions']>[string]

export const actions = {
  getTicket,
  findCustomer,
  createTicket,
  closeTicket,
  listAgents,
  getTicketConversation,
  setConversationRequester,
} satisfies IntegrationDefinitionProps['actions']
