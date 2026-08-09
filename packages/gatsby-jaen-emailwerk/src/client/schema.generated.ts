/**
 * Hand-written GQty schema for the emailwerk GraphQL API.
 *
 * Source of truth: the live emailwerk (mailpress v3) Pylon schema
 * (`emailwerk/src/index.ts`, reflected into `.pylon/schema.graphql`).
 *
 * Wire-format contract: Pylon wraps every resolver's single `args` parameter,
 * so EVERY root field takes exactly one GraphQL argument named `args` of an
 * input type named after the field (`sendTemplateMail(args:
 * SendTemplateMailArgsInput!)`), except where the resolver declares a named
 * alias (`templateCreate(args: TemplateCreateInput!)`, `senderCreate(args:
 * SenderCreateInput!)`). Fields without a resolver parameter (`senders`,
 * `dashboard`) take no arguments.
 *
 * Only the operations the Jaen CMS pages use are covered here on purpose;
 * regenerate/extend against the emailwerk SDL when new surface is needed.
 */

import {type ScalarsEnumsHash} from 'gqty'

export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends {[key: string]: unknown}> = {[K in keyof T]: T[K]}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}

/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: {input: string; output: string}
  String: {input: string; output: string}
  Boolean: {input: boolean; output: boolean}
  Int: {input: number; output: number}
  Float: {input: number; output: number}
  /** Pylon's custom scalar that handles both integers and floats */
  Number: {input: number; output: number}
  /** JSON objects as specified by ECMA-404 */
  JSONObject: {input: Record<string, unknown>; output: Record<string, unknown>}
}

// ---------------------------------------------------------------------------
// Enums (inputs only — emailwerk view types expose enum-backed fields as
// plain String, e.g. TemplateView.engine / SenderResultView.transport)
// ---------------------------------------------------------------------------

export enum TemplateEngine {
  LIQUID = 'LIQUID',
  TWIG = 'TWIG'
}

export enum EngineKind {
  LIQUID = 'LIQUID',
  TWIG = 'TWIG'
}

export enum VariableType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  JSON = 'JSON'
}

export enum SenderTransport {
  SMTP = 'SMTP',
  GMAIL = 'GMAIL',
  MS_GRAPH = 'MS_GRAPH',
  HARAKA = 'HARAKA',
  RESEND = 'RESEND'
}

// ---------------------------------------------------------------------------
// Input types
// ---------------------------------------------------------------------------

export interface TemplateListFiltersInput {
  search?: InputMaybe<Scalars['String']['input']>
}

export interface TemplateListArgsInput {
  after?: InputMaybe<Scalars['String']['input']>
  before?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Number']['input']>
  last?: InputMaybe<Scalars['Number']['input']>
  filters?: InputMaybe<TemplateListFiltersInput>
}

export interface TemplateArgsInput {
  id: Scalars['String']['input']
}

export interface SenderConnectUrlArgsInput {
  senderId: Scalars['String']['input']
}

export interface TemplateVariableInput {
  name: Scalars['String']['input']
  description?: InputMaybe<Scalars['String']['input']>
  defaultValue?: InputMaybe<Scalars['String']['input']>
  type: VariableType
  isRequired: Scalars['Boolean']['input']
  isConstant: Scalars['Boolean']['input']
}

export interface TemplateEnvelopeInput {
  subject?: InputMaybe<Scalars['String']['input']>
  to?: InputMaybe<Array<Scalars['String']['input']>>
  replyTo?: InputMaybe<Scalars['String']['input']>
}

export interface TemplateCreateInput {
  description: Scalars['String']['input']
  content: Scalars['String']['input']
  engine?: InputMaybe<TemplateEngine>
  senderId?: InputMaybe<Scalars['String']['input']>
  verifyReplyTo?: InputMaybe<Scalars['Boolean']['input']>
  requiresSignature?: InputMaybe<Scalars['Boolean']['input']>
  variables?: InputMaybe<Array<TemplateVariableInput>>
  envelope?: InputMaybe<TemplateEnvelopeInput>
}

export interface TemplateUpdateArgsInput {
  id: Scalars['String']['input']
  description?: InputMaybe<Scalars['String']['input']>
  content?: InputMaybe<Scalars['String']['input']>
  engine?: InputMaybe<TemplateEngine>
  senderId?: InputMaybe<Scalars['String']['input']>
  verifyReplyTo?: InputMaybe<Scalars['Boolean']['input']>
  requiresSignature?: InputMaybe<Scalars['Boolean']['input']>
  variables?: InputMaybe<Array<TemplateVariableInput>>
  envelope?: InputMaybe<TemplateEnvelopeInput>
  parentId?: InputMaybe<Scalars['String']['input']>
}

export interface TemplateDeleteArgsInput {
  id: Scalars['String']['input']
}

export interface SenderSmtpInput {
  host: Scalars['String']['input']
  port: Scalars['Number']['input']
  secure: Scalars['Boolean']['input']
  username: Scalars['String']['input']
  password: Scalars['String']['input']
}

export interface SenderApiInput {
  kind: Scalars['String']['input']
  endpoint?: InputMaybe<Scalars['String']['input']>
  apiKey?: InputMaybe<Scalars['String']['input']>
}

export interface SenderCreateInput {
  address: Scalars['String']['input']
  displayName?: InputMaybe<Scalars['String']['input']>
  transport: SenderTransport
  isDefault?: InputMaybe<Scalars['Boolean']['input']>
  smtp?: InputMaybe<SenderSmtpInput>
  api?: InputMaybe<SenderApiInput>
}

export interface SenderSetDefaultArgsInput {
  id: Scalars['String']['input']
}

export interface SenderDeleteArgsInput {
  id: Scalars['String']['input']
}

export interface SenderVerifyArgsInput {
  id: Scalars['String']['input']
}

export interface PreviewVariableInput {
  name: Scalars['String']['input']
  defaultValue?: InputMaybe<Scalars['String']['input']>
  type: VariableType
  isRequired?: InputMaybe<Scalars['Boolean']['input']>
  isConstant?: InputMaybe<Scalars['Boolean']['input']>
}

export interface TemplatePreviewArgsInput {
  content: Scalars['String']['input']
  engine?: InputMaybe<EngineKind>
  values?: InputMaybe<Scalars['JSONObject']['input']>
  variables?: InputMaybe<Array<PreviewVariableInput>>
}

export interface SendEnvelopeOverrideInput {
  subject?: InputMaybe<Scalars['String']['input']>
  /** Single delivery-recipient override (NOT a list). */
  to?: InputMaybe<Scalars['String']['input']>
  replyTo?: InputMaybe<Scalars['String']['input']>
}

export interface SendTemplateMailArgsInput {
  templateId: Scalars['String']['input']
  /**
   * Recipient list (`[String!]`). GraphQL input coercion also accepts a bare
   * string and wraps it into a one-element list. When omitted or empty, the
   * template's stored envelope recipients are used server-side. One Message
   * row is enqueued per recipient; the returned MessageView is the first
   * recipient's row.
   */
  to?: InputMaybe<Array<Scalars['String']['input']>>
  values?: InputMaybe<Scalars['JSONObject']['input']>
  envelopeOverride?: InputMaybe<SendEnvelopeOverrideInput>
  scheduledAt?: InputMaybe<Scalars['String']['input']>
  requiresSignature?: InputMaybe<Scalars['Boolean']['input']>
  signerEmail?: InputMaybe<Scalars['String']['input']>
  signerName?: InputMaybe<Scalars['String']['input']>
  pgpSignatureArmored?: InputMaybe<Scalars['String']['input']>
  pgpSignedContentB64?: InputMaybe<Scalars['String']['input']>
  pgpSignedAt?: InputMaybe<Scalars['String']['input']>
}

export interface SendEmailArgsInput {
  to: Scalars['String']['input']
  subject: Scalars['String']['input']
  html?: InputMaybe<Scalars['String']['input']>
  text?: InputMaybe<Scalars['String']['input']>
  senderId?: InputMaybe<Scalars['String']['input']>
  scheduledAt?: InputMaybe<Scalars['String']['input']>
}

// ---------------------------------------------------------------------------
// Scalars/enums hash + generated schema (GQty runtime metadata)
// ---------------------------------------------------------------------------

export const scalarsEnumsHash: ScalarsEnumsHash = {
  Boolean: true,
  EngineKind: true,
  Float: true,
  ID: true,
  Int: true,
  JSONObject: true,
  Number: true,
  SenderTransport: true,
  String: true,
  TemplateEngine: true,
  VariableType: true
}

export const generatedSchema = {
  DashboardView: {
    __typename: {__type: 'String!'},
    backend: {__type: 'String!'},
    queued: {__type: 'Number!'},
    senderCount: {__type: 'Number!'},
    sentToday: {__type: 'Number!'},
    templateCount: {__type: 'Number!'}
  },
  DeleteResult: {
    __typename: {__type: 'String!'},
    ok: {__type: 'Boolean!'}
  },
  MessageEventView: {
    __typename: {__type: 'String!'},
    createdAt: {__type: 'String!'},
    id: {__type: 'String!'},
    type: {__type: 'String!'}
  },
  MessageView: {
    __typename: {__type: 'String!'},
    attempts: {__type: 'Number!'},
    createdAt: {__type: 'String!'},
    error: {__type: 'String'},
    events: {__type: '[MessageEventView!]!'},
    id: {__type: 'String!'},
    organizationId: {__type: 'String!'},
    providerMessageId: {__type: 'String'},
    queuedAt: {__type: 'String!'},
    scheduledAt: {__type: 'String'},
    senderId: {__type: 'String'},
    sentAt: {__type: 'String'},
    status: {__type: 'String!'},
    subject: {__type: 'String!'},
    templateId: {__type: 'String'},
    toAddress: {__type: 'String!'},
    transport: {__type: 'String'}
  },
  PageInfo: {
    __typename: {__type: 'String!'},
    endCursor: {__type: 'String'},
    hasNextPage: {__type: 'Boolean!'},
    hasPreviousPage: {__type: 'Boolean!'},
    startCursor: {__type: 'String'}
  },
  PreviewResult: {
    __typename: {__type: 'String!'},
    html: {__type: 'String!'},
    text: {__type: 'String!'}
  },
  PreviewVariableInput: {
    defaultValue: {__type: 'String'},
    isConstant: {__type: 'Boolean'},
    isRequired: {__type: 'Boolean'},
    name: {__type: 'String!'},
    type: {__type: 'VariableType!'}
  },
  SendEmailArgsInput: {
    html: {__type: 'String'},
    scheduledAt: {__type: 'String'},
    senderId: {__type: 'String'},
    subject: {__type: 'String!'},
    text: {__type: 'String'},
    to: {__type: 'String!'}
  },
  SendEnvelopeOverrideInput: {
    replyTo: {__type: 'String'},
    subject: {__type: 'String'},
    to: {__type: 'String'}
  },
  SendTemplateMailArgsInput: {
    envelopeOverride: {__type: 'SendEnvelopeOverrideInput'},
    pgpSignatureArmored: {__type: 'String'},
    pgpSignedAt: {__type: 'String'},
    pgpSignedContentB64: {__type: 'String'},
    requiresSignature: {__type: 'Boolean'},
    scheduledAt: {__type: 'String'},
    signerEmail: {__type: 'String'},
    signerName: {__type: 'String'},
    templateId: {__type: 'String!'},
    to: {__type: '[String!]'},
    values: {__type: 'JSONObject'}
  },
  SenderApiInput: {
    apiKey: {__type: 'String'},
    endpoint: {__type: 'String'},
    kind: {__type: 'String!'}
  },
  SenderApiView: {
    __typename: {__type: 'String!'},
    endpoint: {__type: 'String'},
    hasApiKey: {__type: 'Boolean!'},
    kind: {__type: 'String!'}
  },
  SenderConnectUrlArgsInput: {
    senderId: {__type: 'String!'}
  },
  SenderCreateInput: {
    address: {__type: 'String!'},
    api: {__type: 'SenderApiInput'},
    displayName: {__type: 'String'},
    isDefault: {__type: 'Boolean'},
    smtp: {__type: 'SenderSmtpInput'},
    transport: {__type: 'SenderTransport!'}
  },
  SenderDeleteArgsInput: {
    id: {__type: 'String!'}
  },
  SenderOauthView: {
    __typename: {__type: 'String!'},
    provider: {__type: 'String!'}
  },
  SenderResultView: {
    __typename: {__type: 'String!'},
    address: {__type: 'String!'},
    api: {__type: 'SenderApiView'},
    createdAt: {__type: 'String!'},
    displayName: {__type: 'String'},
    enabled: {__type: 'Boolean!'},
    id: {__type: 'String!'},
    isDefault: {__type: 'Boolean!'},
    oauth: {__type: 'SenderOauthView'},
    organizationId: {__type: 'String!'},
    smtp: {__type: 'SenderSmtpView'},
    transport: {__type: 'String!'},
    updatedAt: {__type: 'String!'}
  },
  SenderSetDefaultArgsInput: {
    id: {__type: 'String!'}
  },
  SenderSmtpInput: {
    host: {__type: 'String!'},
    password: {__type: 'String!'},
    port: {__type: 'Number!'},
    secure: {__type: 'Boolean!'},
    username: {__type: 'String!'}
  },
  SenderSmtpView: {
    __typename: {__type: 'String!'},
    hasPassword: {__type: 'Boolean!'},
    host: {__type: 'String!'},
    port: {__type: 'Number!'},
    secure: {__type: 'Boolean!'},
    username: {__type: 'String!'}
  },
  SenderVerifyArgsInput: {
    id: {__type: 'String!'}
  },
  TemplateArgsInput: {
    id: {__type: 'String!'}
  },
  TemplateConnectionView: {
    __typename: {__type: 'String!'},
    nodes: {__type: '[TemplateView!]!'},
    pageInfo: {__type: 'PageInfo!'},
    totalCount: {__type: 'Number!'}
  },
  TemplateCreateInput: {
    content: {__type: 'String!'},
    description: {__type: 'String!'},
    engine: {__type: 'TemplateEngine'},
    envelope: {__type: 'TemplateEnvelopeInput'},
    requiresSignature: {__type: 'Boolean'},
    senderId: {__type: 'String'},
    variables: {__type: '[TemplateVariableInput!]'},
    verifyReplyTo: {__type: 'Boolean'}
  },
  TemplateDeleteArgsInput: {
    id: {__type: 'String!'}
  },
  TemplateEnvelopeInput: {
    replyTo: {__type: 'String'},
    subject: {__type: 'String'},
    to: {__type: '[String!]'}
  },
  TemplateEnvelopeView: {
    __typename: {__type: 'String!'},
    replyTo: {__type: 'String'},
    subject: {__type: 'String'},
    to: {__type: '[String!]'}
  },
  TemplateListArgsInput: {
    after: {__type: 'String'},
    before: {__type: 'String'},
    filters: {__type: 'TemplateListFiltersInput'},
    first: {__type: 'Number'},
    last: {__type: 'Number'}
  },
  TemplateListFiltersInput: {
    search: {__type: 'String'}
  },
  TemplatePreviewArgsInput: {
    content: {__type: 'String!'},
    engine: {__type: 'EngineKind'},
    values: {__type: 'JSONObject'},
    variables: {__type: '[PreviewVariableInput!]'}
  },
  TemplateUpdateArgsInput: {
    content: {__type: 'String'},
    description: {__type: 'String'},
    engine: {__type: 'TemplateEngine'},
    envelope: {__type: 'TemplateEnvelopeInput'},
    id: {__type: 'String!'},
    parentId: {__type: 'String'},
    requiresSignature: {__type: 'Boolean'},
    senderId: {__type: 'String'},
    variables: {__type: '[TemplateVariableInput!]'},
    verifyReplyTo: {__type: 'Boolean'}
  },
  TemplateVariableInput: {
    defaultValue: {__type: 'String'},
    description: {__type: 'String'},
    isConstant: {__type: 'Boolean!'},
    isRequired: {__type: 'Boolean!'},
    name: {__type: 'String!'},
    type: {__type: 'VariableType!'}
  },
  TemplateVariableView: {
    __typename: {__type: 'String!'},
    defaultValue: {__type: 'String'},
    description: {__type: 'String'},
    id: {__type: 'String!'},
    isConstant: {__type: 'Boolean!'},
    isRequired: {__type: 'Boolean!'},
    name: {__type: 'String!'},
    type: {__type: 'String!'}
  },
  TemplateView: {
    __typename: {__type: 'String!'},
    content: {__type: 'String!'},
    createdAt: {__type: 'String!'},
    createdBy: {__type: 'String!'},
    createdByName: {__type: 'String'},
    description: {__type: 'String!'},
    engine: {__type: 'String!'},
    envelope: {__type: 'TemplateEnvelopeView'},
    id: {__type: 'String!'},
    parentId: {__type: 'String'},
    requiresSignature: {__type: 'Boolean!'},
    senderId: {__type: 'String'},
    updatedAt: {__type: 'String!'},
    variables: {__type: '[TemplateVariableView!]!'},
    verifyReplyTo: {__type: 'Boolean!'}
  },
  VerifyResult: {
    __typename: {__type: 'String!'},
    error: {__type: 'String'},
    ok: {__type: 'Boolean!'}
  },
  mutation: {
    __typename: {__type: 'String!'},
    sendEmail: {
      __type: 'MessageView!',
      __args: {args: 'SendEmailArgsInput!'}
    },
    sendTemplateMail: {
      __type: 'MessageView!',
      __args: {args: 'SendTemplateMailArgsInput!'}
    },
    senderCreate: {
      __type: 'SenderResultView!',
      __args: {args: 'SenderCreateInput!'}
    },
    senderDelete: {
      __type: 'DeleteResult!',
      __args: {args: 'SenderDeleteArgsInput!'}
    },
    senderSetDefault: {
      __type: 'SenderResultView',
      __args: {args: 'SenderSetDefaultArgsInput!'}
    },
    senderVerify: {
      __type: 'VerifyResult!',
      __args: {args: 'SenderVerifyArgsInput!'}
    },
    templateCreate: {
      __type: 'TemplateView!',
      __args: {args: 'TemplateCreateInput!'}
    },
    templateDelete: {
      __type: 'DeleteResult!',
      __args: {args: 'TemplateDeleteArgsInput!'}
    },
    templatePreview: {
      __type: 'PreviewResult!',
      __args: {args: 'TemplatePreviewArgsInput!'}
    },
    templateUpdate: {
      __type: 'TemplateView',
      __args: {args: 'TemplateUpdateArgsInput!'}
    }
  },
  query: {
    __typename: {__type: 'String!'},
    dashboard: {__type: 'DashboardView!'},
    senderConnectUrl: {
      __type: 'String!',
      __args: {args: 'SenderConnectUrlArgsInput!'}
    },
    senders: {__type: '[SenderResultView!]!'},
    template: {
      __type: 'TemplateView',
      __args: {args: 'TemplateArgsInput!'}
    },
    templates: {
      __type: 'TemplateConnectionView!',
      __args: {args: 'TemplateListArgsInput'}
    }
  },
  subscription: {}
} as const

// ---------------------------------------------------------------------------
// Object (view) types
// ---------------------------------------------------------------------------

export interface DashboardView {
  __typename?: 'DashboardView'
  backend: ScalarsEnums['String']
  queued: ScalarsEnums['Number']
  senderCount: ScalarsEnums['Number']
  sentToday: ScalarsEnums['Number']
  templateCount: ScalarsEnums['Number']
}

export interface DeleteResult {
  __typename?: 'DeleteResult'
  ok: ScalarsEnums['Boolean']
}

export interface MessageEventView {
  __typename?: 'MessageEventView'
  createdAt: ScalarsEnums['String']
  id: ScalarsEnums['String']
  type: ScalarsEnums['String']
}

export interface MessageView {
  __typename?: 'MessageView'
  attempts: ScalarsEnums['Number']
  createdAt: ScalarsEnums['String']
  error?: Maybe<ScalarsEnums['String']>
  /**
   * Lifecycle events, newest first. Only populated by the single-message
   * read (`Query.message`); list queries leave it empty.
   */
  events: Array<MessageEventView>
  id: ScalarsEnums['String']
  organizationId: ScalarsEnums['String']
  providerMessageId?: Maybe<ScalarsEnums['String']>
  queuedAt: ScalarsEnums['String']
  scheduledAt?: Maybe<ScalarsEnums['String']>
  senderId?: Maybe<ScalarsEnums['String']>
  sentAt?: Maybe<ScalarsEnums['String']>
  status: ScalarsEnums['String']
  subject: ScalarsEnums['String']
  templateId?: Maybe<ScalarsEnums['String']>
  toAddress: ScalarsEnums['String']
  transport?: Maybe<ScalarsEnums['String']>
}

export interface PageInfo {
  __typename?: 'PageInfo'
  endCursor?: Maybe<ScalarsEnums['String']>
  hasNextPage: ScalarsEnums['Boolean']
  hasPreviousPage: ScalarsEnums['Boolean']
  startCursor?: Maybe<ScalarsEnums['String']>
}

export interface PreviewResult {
  __typename?: 'PreviewResult'
  html: ScalarsEnums['String']
  text: ScalarsEnums['String']
}

export interface SenderApiView {
  __typename?: 'SenderApiView'
  endpoint?: Maybe<ScalarsEnums['String']>
  hasApiKey: ScalarsEnums['Boolean']
  kind: ScalarsEnums['String']
}

export interface SenderOauthView {
  __typename?: 'SenderOauthView'
  provider: ScalarsEnums['String']
}

export interface SenderSmtpView {
  __typename?: 'SenderSmtpView'
  hasPassword: ScalarsEnums['Boolean']
  host: ScalarsEnums['String']
  port: ScalarsEnums['Number']
  secure: ScalarsEnums['Boolean']
  username: ScalarsEnums['String']
}

export interface SenderResultView {
  __typename?: 'SenderResultView'
  address: ScalarsEnums['String']
  api?: Maybe<SenderApiView>
  createdAt: ScalarsEnums['String']
  displayName?: Maybe<ScalarsEnums['String']>
  enabled: ScalarsEnums['Boolean']
  id: ScalarsEnums['String']
  isDefault: ScalarsEnums['Boolean']
  oauth?: Maybe<SenderOauthView>
  organizationId: ScalarsEnums['String']
  smtp?: Maybe<SenderSmtpView>
  transport: ScalarsEnums['String']
  updatedAt: ScalarsEnums['String']
}

export interface TemplateConnectionView {
  __typename?: 'TemplateConnectionView'
  nodes: Array<TemplateView>
  pageInfo: PageInfo
  totalCount: ScalarsEnums['Number']
}

export interface TemplateEnvelopeView {
  __typename?: 'TemplateEnvelopeView'
  replyTo?: Maybe<ScalarsEnums['String']>
  subject?: Maybe<ScalarsEnums['String']>
  to: Array<ScalarsEnums['String']>
}

export interface TemplateVariableView {
  __typename?: 'TemplateVariableView'
  defaultValue?: Maybe<ScalarsEnums['String']>
  description?: Maybe<ScalarsEnums['String']>
  id: ScalarsEnums['String']
  isConstant: ScalarsEnums['Boolean']
  isRequired: ScalarsEnums['Boolean']
  name: ScalarsEnums['String']
  type: ScalarsEnums['String']
}

export interface TemplateView {
  __typename?: 'TemplateView'
  content: ScalarsEnums['String']
  createdAt: ScalarsEnums['String']
  createdBy: ScalarsEnums['String']
  createdByName?: Maybe<ScalarsEnums['String']>
  description: ScalarsEnums['String']
  engine: ScalarsEnums['String']
  envelope?: Maybe<TemplateEnvelopeView>
  id: ScalarsEnums['String']
  parentId?: Maybe<ScalarsEnums['String']>
  requiresSignature: ScalarsEnums['Boolean']
  senderId?: Maybe<ScalarsEnums['String']>
  updatedAt: ScalarsEnums['String']
  variables: Array<TemplateVariableView>
  verifyReplyTo: ScalarsEnums['Boolean']
}

export interface VerifyResult {
  __typename?: 'VerifyResult'
  error?: Maybe<ScalarsEnums['String']>
  ok: ScalarsEnums['Boolean']
}

// ---------------------------------------------------------------------------
// Roots
// ---------------------------------------------------------------------------

export interface Query {
  __typename?: 'Query'
  dashboard: DashboardView
  senderConnectUrl: (args: {
    args: SenderConnectUrlArgsInput
  }) => ScalarsEnums['String']
  senders: Array<SenderResultView>
  template: (args: {args: TemplateArgsInput}) => Maybe<TemplateView>
  templates: (args?: {
    args?: Maybe<TemplateListArgsInput>
  }) => TemplateConnectionView
}

export interface Mutation {
  __typename?: 'Mutation'
  sendEmail: (args: {args: SendEmailArgsInput}) => MessageView
  sendTemplateMail: (args: {args: SendTemplateMailArgsInput}) => MessageView
  senderCreate: (args: {args: SenderCreateInput}) => SenderResultView
  senderDelete: (args: {args: SenderDeleteArgsInput}) => DeleteResult
  senderSetDefault: (args: {
    args: SenderSetDefaultArgsInput
  }) => Maybe<SenderResultView>
  senderVerify: (args: {args: SenderVerifyArgsInput}) => VerifyResult
  templateCreate: (args: {args: TemplateCreateInput}) => TemplateView
  templateDelete: (args: {args: TemplateDeleteArgsInput}) => DeleteResult
  templatePreview: (args: {args: TemplatePreviewArgsInput}) => PreviewResult
  templateUpdate: (args: {args: TemplateUpdateArgsInput}) => Maybe<TemplateView>
}

export interface Subscription {
  __typename?: 'Subscription'
}

export interface GeneratedSchema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}

export type ScalarsEnums = {
  [Key in keyof Scalars]: Scalars[Key] extends {output: unknown}
    ? Scalars[Key]['output']
    : never
} & {
  EngineKind: EngineKind
  SenderTransport: SenderTransport
  TemplateEngine: TemplateEngine
  VariableType: VariableType
}
