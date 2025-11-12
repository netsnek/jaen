/**
 * GQty AUTO-GENERATED CODE: PLEASE DO NOT MODIFY MANUALLY
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
export type MakeEmpty<T extends {[key: string]: unknown}, K extends keyof T> = {
  [_ in K]?: never
}
export type Incremental<T> =
  | T
  | {[P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never}
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: {input: string; output: string}
  String: {input: string; output: string}
  Boolean: {input: boolean; output: boolean}
  Int: {input: number; output: number}
  Float: {input: number; output: number}
  Any: {input: any; output: any}
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: {input: any; output: any}
  File: {input: any; output: any}
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: {input: any; output: any}
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: {input: any; output: any}
  /** Custom scalar that handles both integers and floats */
  Number: {input: any; output: any}
  /** Represents NULL values */
  Void: {input: any; output: any}
}

export interface DetailsInput {
  firstName?: InputMaybe<Scalars['String']['input']>
  lastName?: InputMaybe<Scalars['String']['input']>
}

export interface ValuesInput {
  details?: InputMaybe<DetailsInput>
  emailAddress: Scalars['String']['input']
  hashedPassword?: InputMaybe<Scalars['String']['input']>
  password?: InputMaybe<Scalars['String']['input']>
  username: Scalars['String']['input']
}

export const scalarsEnumsHash: ScalarsEnumsHash = {
  Any: true,
  Boolean: true,
  DateTimeISO: true,
  File: true,
  JSON: true,
  JSONObject: true,
  Number: true,
  String: true,
  Void: true
}
export const generatedSchema = {
  Details: {
    __typename: {__type: 'String!'},
    changeDate: {__type: 'String!'},
    creationDate: {__type: 'String!'},
    resourceOwner: {__type: 'String!'},
    sequence: {__type: 'String!'}
  },
  DetailsInput: {firstName: {__type: 'String'}, lastName: {__type: 'String'}},
  Details_1: {
    __typename: {__type: 'String!'},
    creationDate: {__type: 'String!'},
    resourceOwner: {__type: 'String!'},
    sequence: {__type: 'String!'}
  },
  Email: {__typename: {__type: 'String!'}, email: {__type: 'String'}},
  HumanUser: {
    __typename: {__type: 'String!'},
    email: {__type: 'Email'},
    phone: {__type: 'JSONObject'},
    profile: {__type: 'Profile'}
  },
  Profile: {
    __typename: {__type: 'String!'},
    displayName: {__type: 'String'},
    firstName: {__type: 'String'},
    lastName: {__type: 'String'},
    preferredLanguage: {__type: 'String'}
  },
  UserCreateResponse: {
    __typename: {__type: 'String!'},
    details: {__type: 'Details_1!'},
    userId: {__type: 'String!'}
  },
  ValuesInput: {
    details: {__type: 'DetailsInput'},
    emailAddress: {__type: 'String!'},
    hashedPassword: {__type: 'String'},
    password: {__type: 'String'},
    username: {__type: 'String!'}
  },
  ZitadelUser: {
    __typename: {__type: 'String!'},
    details: {__type: 'Details!'},
    human: {__type: 'HumanUser'},
    id: {__type: 'String!'},
    loginNames: {__type: '[String!]!'},
    preferredLoginName: {__type: 'String!'},
    state: {__type: 'String!'},
    userName: {__type: 'String!'}
  },
  mutation: {
    __typename: {__type: 'String!'},
    userCreate: {
      __type: 'UserCreateResponse!',
      __args: {
        createProfile: 'Boolean',
        organizationId: 'String',
        skipEmailVerification: 'Boolean',
        values: 'ValuesInput!'
      }
    }
  },
  query: {
    __typename: {__type: 'String!'},
    getAllUser: {__type: '[ZitadelUser!]!', __args: {limit: 'Number'}},
    getIsUnique: {__type: 'Boolean', __args: {loginName: 'String!'}},
    getUserCount: {__type: 'Number!'},
    user: {__type: 'String!'}
  },
  subscription: {}
} as const

export interface Details {
  __typename?: 'Details'
  changeDate?: Scalars['String']['output']
  creationDate?: Scalars['String']['output']
  resourceOwner?: Scalars['String']['output']
  sequence?: Scalars['String']['output']
}

export interface Details_1 {
  __typename?: 'Details_1'
  creationDate?: Scalars['String']['output']
  resourceOwner?: Scalars['String']['output']
  sequence?: Scalars['String']['output']
}

export interface Email {
  __typename?: 'Email'
  email?: Maybe<Scalars['String']['output']>
}

/**
 * Contains human-specific attributes (profile, email, phone).
 */
export interface HumanUser {
  __typename?: 'HumanUser'
  email?: Maybe<Email>
  phone?: Maybe<Scalars['JSONObject']['output']>
  profile?: Maybe<Profile>
}

export interface Profile {
  __typename?: 'Profile'
  displayName?: Maybe<Scalars['String']['output']>
  firstName?: Maybe<Scalars['String']['output']>
  lastName?: Maybe<Scalars['String']['output']>
  preferredLanguage?: Maybe<Scalars['String']['output']>
}

export interface UserCreateResponse {
  __typename?: 'UserCreateResponse'
  details: Details_1
  userId?: Scalars['String']['output']
}

export interface ZitadelUser {
  __typename?: 'ZitadelUser'
  details: Details
  human?: Maybe<HumanUser>
  id?: Scalars['String']['output']
  loginNames?: Array<Scalars['String']['output']>
  preferredLoginName?: Scalars['String']['output']
  state?: Scalars['String']['output']
  userName?: Scalars['String']['output']
}

export interface Mutation {
  __typename?: 'Mutation'
  userCreate: (args: {
    createProfile?: Maybe<Scalars['Boolean']['input']>
    organizationId?: Maybe<Scalars['String']['input']>
    skipEmailVerification?: Maybe<Scalars['Boolean']['input']>
    values: ValuesInput
  }) => UserCreateResponse
}

export interface Query {
  __typename?: 'Query'
  getAllUser: (args?: {
    limit?: Maybe<Scalars['Number']['input']>
  }) => Array<ZitadelUser>
  getIsUnique: (args: {
    loginName: Scalars['String']['input']
  }) => Maybe<Scalars['Boolean']['output']>
  getUserCount?: Scalars['Number']['output']
  user?: Scalars['String']['output']
}

export interface Subscription {
  __typename?: 'Subscription'
}

export interface GeneratedSchema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}
