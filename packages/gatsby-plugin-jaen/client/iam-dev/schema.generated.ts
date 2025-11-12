/**
 * GQty AUTO-GENERATED CODE: PLEASE DO NOT MODIFY MANUALLY
 */

import {type ScalarsEnumsHash} from 'gqty'

export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends {[key: string]: unknown}> = {
  [K in keyof T]: T[K]
}
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
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
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
  Number: {input: number; output: number}
  /** Represents NULL values */
  Void: {input: any; output: any}
}

export interface DetailsInput {
  firstName?: InputMaybe<Scalars['String']['input']>
  lastName?: InputMaybe<Scalars['String']['input']>
}

export interface OptsInput {
  state?: InputMaybe<TransferStateInput>
  userId?: InputMaybe<Scalars['String']['input']>
}

export interface TransferInputInput {
  amountEUR?: InputMaybe<Scalars['Number']['input']>
  dropoff: Scalars['String']['input']
  payment?: InputMaybe<Scalars['String']['input']>
  pickup: Scalars['String']['input']
  rideDateISO: Scalars['String']['input']
  rideTime: Scalars['String']['input']
  roomOrName?: InputMaybe<Scalars['String']['input']>
  vehicle?: InputMaybe<Scalars['String']['input']>
}

export enum TransferState {
  canceled = 'canceled',
  complete = 'complete',
  pending = 'pending',
  terminated = 'terminated'
}

export enum TransferStateInput {
  canceled = 'canceled',
  complete = 'complete',
  pending = 'pending',
  terminated = 'terminated'
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
  TransferState: true,
  TransferStateInput: true,
  Void: true
}
export const generatedSchema = {
  CreateTransfer: {
    __typename: {__type: 'String!'},
    transferId: {__type: 'String!'}
  },
  Details: {
    __typename: {__type: 'String!'},
    changeDate: {__type: 'String!'},
    creationDate: {__type: 'String!'},
    resourceOwner: {__type: 'String!'},
    sequence: {__type: 'String!'}
  },
  DetailsInput: {
    firstName: {__type: 'String'},
    lastName: {__type: 'String'}
  },
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
  OptsInput: {
    state: {__type: 'TransferStateInput'},
    userId: {__type: 'String'}
  },
  Profile: {
    __typename: {__type: 'String!'},
    displayName: {__type: 'String'},
    firstName: {__type: 'String'},
    lastName: {__type: 'String'},
    preferredLanguage: {__type: 'String'}
  },
  TransferInputInput: {
    amountEUR: {__type: 'Number'},
    dropoff: {__type: 'String!'},
    payment: {__type: 'String'},
    pickup: {__type: 'String!'},
    rideDateISO: {__type: 'String!'},
    rideTime: {__type: 'String!'},
    roomOrName: {__type: 'String'},
    vehicle: {__type: 'String'}
  },
  TransferRow: {
    __typename: {__type: 'String!'},
    amountEUR: {__type: 'Number'},
    customerName: {__type: 'String'},
    driver: {__type: 'String'},
    dropoff: {__type: 'String!'},
    payment: {__type: 'String'},
    pickup: {__type: 'String!'},
    requestedAtISO: {__type: 'String!'},
    rideDateISO: {__type: 'String!'},
    rideTime: {__type: 'String!'},
    roomOrName: {__type: 'String'},
    state: {__type: 'TransferState!'},
    transferId: {__type: 'String!'},
    userId: {__type: 'String!'},
    vehicle: {__type: 'String'}
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
    assignDriver: {
      __type: 'Void',
      __args: {driver: 'String!', transferId: 'String!'}
    },
    cancelTransfer: {__type: 'Void', __args: {transferId: 'String!'}},
    createTransfer: {
      __type: 'CreateTransfer!',
      __args: {values: 'TransferInputInput!'}
    },
    markCompleted: {__type: 'Void', __args: {transferId: 'String!'}},
    syncMonthlyTransfers: {
      __type: 'Void',
      __args: {userId: 'String!', yyyymm: 'String!'}
    },
    terminateTransfer: {__type: 'Void', __args: {transferId: 'String!'}},
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
    getAllTransfers: {
      __type: '[TransferRow!]!',
      __args: {opts: 'OptsInput'}
    },
    getAllUser: {__type: '[ZitadelUser!]!', __args: {limit: 'Number'}},
    getIsUnique: {__type: 'Boolean', __args: {loginName: 'String!'}},
    getTransfer: {__type: 'TransferRow', __args: {transferId: 'String!'}},
    getUserCount: {__type: 'Number!'},
    user: {
      __type: 'ZitadelUser!',
      __args: {organizationId: 'String', userId: 'String!'}
    }
  },
  subscription: {}
} as const

export interface CreateTransfer {
  __typename?: 'CreateTransfer'
  transferId: ScalarsEnums['String']
}

export interface Details {
  __typename?: 'Details'
  changeDate: ScalarsEnums['String']
  creationDate: ScalarsEnums['String']
  resourceOwner: ScalarsEnums['String']
  sequence: ScalarsEnums['String']
}

export interface Details_1 {
  __typename?: 'Details_1'
  creationDate: ScalarsEnums['String']
  resourceOwner: ScalarsEnums['String']
  sequence: ScalarsEnums['String']
}

export interface Email {
  __typename?: 'Email'
  email?: Maybe<ScalarsEnums['String']>
}

/**
 * Contains human-specific attributes (profile, email, phone).
 */
export interface HumanUser {
  __typename?: 'HumanUser'
  email?: Maybe<Email>
  phone?: Maybe<ScalarsEnums['JSONObject']>
  profile?: Maybe<Profile>
}

export interface Profile {
  __typename?: 'Profile'
  displayName?: Maybe<ScalarsEnums['String']>
  firstName?: Maybe<ScalarsEnums['String']>
  lastName?: Maybe<ScalarsEnums['String']>
  preferredLanguage?: Maybe<ScalarsEnums['String']>
}

export interface TransferRow {
  __typename?: 'TransferRow'
  amountEUR?: Maybe<ScalarsEnums['Number']>
  customerName?: Maybe<ScalarsEnums['String']>
  driver?: Maybe<ScalarsEnums['String']>
  dropoff: ScalarsEnums['String']
  payment?: Maybe<ScalarsEnums['String']>
  pickup: ScalarsEnums['String']
  requestedAtISO: ScalarsEnums['String']
  rideDateISO: ScalarsEnums['String']
  rideTime: ScalarsEnums['String']
  roomOrName?: Maybe<ScalarsEnums['String']>
  state: ScalarsEnums['TransferState']
  transferId: ScalarsEnums['String']
  userId: ScalarsEnums['String']
  vehicle?: Maybe<ScalarsEnums['String']>
}

export interface UserCreateResponse {
  __typename?: 'UserCreateResponse'
  details: Details_1
  userId: ScalarsEnums['String']
}

export interface ZitadelUser {
  __typename?: 'ZitadelUser'
  details: Details
  human?: Maybe<HumanUser>
  id: ScalarsEnums['String']
  loginNames: Array<ScalarsEnums['String']>
  preferredLoginName: ScalarsEnums['String']
  state: ScalarsEnums['String']
  userName: ScalarsEnums['String']
}

export interface Mutation {
  __typename?: 'Mutation'
  assignDriver: (args: {
    driver: ScalarsEnums['String']
    transferId: ScalarsEnums['String']
  }) => Maybe<ScalarsEnums['Void']>
  cancelTransfer: (args: {
    transferId: ScalarsEnums['String']
  }) => Maybe<ScalarsEnums['Void']>
  createTransfer: (args: {values: TransferInputInput}) => CreateTransfer
  markCompleted: (args: {
    transferId: ScalarsEnums['String']
  }) => Maybe<ScalarsEnums['Void']>
  syncMonthlyTransfers: (args: {
    userId: ScalarsEnums['String']
    yyyymm: ScalarsEnums['String']
  }) => Maybe<ScalarsEnums['Void']>
  terminateTransfer: (args: {
    transferId: ScalarsEnums['String']
  }) => Maybe<ScalarsEnums['Void']>
  userCreate: (args: {
    createProfile?: Maybe<ScalarsEnums['Boolean']>
    organizationId?: Maybe<ScalarsEnums['String']>
    skipEmailVerification?: Maybe<ScalarsEnums['Boolean']>
    values: ValuesInput
  }) => UserCreateResponse
}

export interface Query {
  __typename?: 'Query'
  getAllTransfers: (args?: {opts?: Maybe<OptsInput>}) => Array<TransferRow>
  getAllUser: (args?: {
    limit?: Maybe<ScalarsEnums['Number']>
  }) => Array<ZitadelUser>
  getIsUnique: (args: {
    loginName: ScalarsEnums['String']
  }) => Maybe<ScalarsEnums['Boolean']>
  getTransfer: (args: {
    transferId: ScalarsEnums['String']
  }) => Maybe<TransferRow>
  getUserCount: ScalarsEnums['Number']
  user: (args: {
    organizationId?: Maybe<ScalarsEnums['String']>
    userId: ScalarsEnums['String']
  }) => ZitadelUser
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
  TransferState: TransferState
  TransferStateInput: TransferStateInput
}
