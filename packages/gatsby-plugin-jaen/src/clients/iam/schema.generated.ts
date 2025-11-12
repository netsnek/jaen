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
export type MakeEmpty<T extends {[key: string]: unknown}, K extends keyof T> = {
  [_ in K]?: never
}
export type Incremental<T> =
  | T
  | {[P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never}

export interface Scalars {
  ID: {input: string; output: string}
  String: {input: string; output: string}
  Boolean: {input: boolean; output: boolean}
  DateTime: {input: string; output: string}
}

export const scalarsEnumsHash: ScalarsEnumsHash = {
  Boolean: true,
  ID: true,
  String: true,
  DateTime: true
}

export interface Email {
  __typename?: 'Email'
  email?: Maybe<ScalarsEnums['String']>
}

export interface Human {
  __typename?: 'Human'
  email?: Maybe<Email>
  phone?: Maybe<ScalarsEnums['String']>
  profile?: Maybe<Profile>
}

export interface Profile {
  __typename?: 'Profile'
  displayName?: Maybe<ScalarsEnums['String']>
  firstName?: Maybe<ScalarsEnums['String']>
  lastName?: Maybe<ScalarsEnums['String']>
  preferredLanguage?: Maybe<ScalarsEnums['String']>
}

export interface Details {
  __typename?: 'Details'
  changeDate?: Maybe<ScalarsEnums['DateTime']>
  creationDate?: Maybe<ScalarsEnums['DateTime']>
  resourceOwner?: Maybe<ScalarsEnums['String']>
  sequence?: Maybe<ScalarsEnums['String']>
}

export interface User {
  __typename?: 'User'
  details?: Maybe<Details>
  human?: Maybe<Human>
  id: ScalarsEnums['String']
  loginNames?: Maybe<Array<Maybe<ScalarsEnums['String']>>>
  preferredLoginName?: Maybe<ScalarsEnums['String']>
  state?: Maybe<ScalarsEnums['String']>
  userName?: Maybe<ScalarsEnums['String']>
}

export interface Query {
  __typename?: 'Query'
  getAllUser: Array<User>
}

export interface Mutation {
  __typename?: 'Mutation'
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
}

export const generatedSchema = {
  Details: {
    __typename: {__type: 'String!'},
    changeDate: {__type: 'DateTime'},
    creationDate: {__type: 'DateTime'},
    resourceOwner: {__type: 'String'},
    sequence: {__type: 'String'}
  },
  Email: {
    __typename: {__type: 'String!'},
    email: {__type: 'String'}
  },
  Human: {
    __typename: {__type: 'String!'},
    email: {__type: 'Email'},
    phone: {__type: 'String'},
    profile: {__type: 'Profile'}
  },
  Mutation: {
    __typename: {__type: 'String!'}
  },
  Profile: {
    __typename: {__type: 'String!'},
    displayName: {__type: 'String'},
    firstName: {__type: 'String'},
    lastName: {__type: 'String'},
    preferredLanguage: {__type: 'String'}
  },
  Query: {
    __typename: {__type: 'String!'},
    getAllUser: {__type: '[User!]!'}
  },
  Subscription: {
    __typename: {__type: 'String!'}
  },
  User: {
    __typename: {__type: 'String!'},
    details: {__type: 'Details'},
    human: {__type: 'Human'},
    id: {__type: 'String!'},
    loginNames: {__type: '[String]'},
    preferredLoginName: {__type: 'String'},
    state: {__type: 'String'},
    userName: {__type: 'String'}
  }
} as const
