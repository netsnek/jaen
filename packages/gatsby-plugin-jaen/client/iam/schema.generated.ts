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

export interface AuthorizationCreateInputInput {
  projectGrantId?: InputMaybe<Scalars['String']['input']>
  projectId?: InputMaybe<Scalars['String']['input']>
  roleKeys: Array<Scalars['String']['input']>
  userId: Scalars['String']['input']
}

export interface AuthorizationUpdateInputInput {
  authorizationId: Scalars['String']['input']
  roleKeys: Array<Scalars['String']['input']>
}

export interface DetailsInput {
  firstName?: InputMaybe<Scalars['String']['input']>
  lastName?: InputMaybe<Scalars['String']['input']>
}

export interface EmailInput {
  email: Scalars['String']['input']
}

export interface OptsInput {
  driverId?: InputMaybe<Scalars['String']['input']>
  fromDateISO?: InputMaybe<Scalars['String']['input']>
  state?: InputMaybe<TransferStateInput>
  toDateISO?: InputMaybe<Scalars['String']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export interface OptsInput_1 {
  fromDateISO?: InputMaybe<Scalars['String']['input']>
  state?: InputMaybe<TransferStateInput>
  toDateISO?: InputMaybe<Scalars['String']['input']>
}

export interface OptsInput_2 {
  fromDateISO?: InputMaybe<Scalars['String']['input']>
  includeVouchers?: InputMaybe<Scalars['Boolean']['input']>
  state?: InputMaybe<PENDING_CONFIRMED_COMPLETE_CANCELED_TERMINATED_COMPLETEORCONFIRMEDInput>
  toDateISO?: InputMaybe<Scalars['String']['input']>
}

export enum PENDING_CONFIRMED_COMPLETE_CANCELED_TERMINATED_COMPLETEORCONFIRMEDInput {
  canceled = 'canceled',
  complete = 'complete',
  completeOrConfirmed = 'completeOrConfirmed',
  confirmed = 'confirmed',
  pending = 'pending',
  terminated = 'terminated'
}

export interface PasswordInput {
  changeRequired?: InputMaybe<Scalars['Boolean']['input']>
  password: Scalars['String']['input']
}

export interface PhoneInput {
  phone: Scalars['String']['input']
}

export interface ProfileInput {
  displayName?: InputMaybe<Scalars['String']['input']>
  familyName?: InputMaybe<Scalars['String']['input']>
  givenName?: InputMaybe<Scalars['String']['input']>
  preferredLanguage?: InputMaybe<Scalars['String']['input']>
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
  confirmed = 'confirmed',
  pending = 'pending',
  terminated = 'terminated'
}

export enum TransferStateInput {
  canceled = 'canceled',
  complete = 'complete',
  confirmed = 'confirmed',
  pending = 'pending',
  terminated = 'terminated'
}

export interface UserUpdateInputInput {
  email?: InputMaybe<EmailInput>
  password?: InputMaybe<PasswordInput>
  phone?: InputMaybe<PhoneInput>
  profile?: InputMaybe<ProfileInput>
  username?: InputMaybe<Scalars['String']['input']>
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
  PENDING_CONFIRMED_COMPLETE_CANCELED_TERMINATED_COMPLETEORCONFIRMEDInput: true,
  String: true,
  TransferState: true,
  TransferStateInput: true,
  Void: true
}
export const generatedSchema = {
  AuthorizationCreateInputInput: {
    projectGrantId: {__type: 'String'},
    projectId: {__type: 'String'},
    roleKeys: {__type: '[String!]!'},
    userId: {__type: 'String!'}
  },
  AuthorizationUpdateInputInput: {
    authorizationId: {__type: 'String!'},
    roleKeys: {__type: '[String!]!'}
  },
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
  EmailInput: {email: {__type: 'String!'}},
  GetDriverRevenue: {
    __typename: {__type: 'String!'},
    count: {__type: 'Number!'},
    currency: {__type: 'String!'},
    driverUserId: {__type: 'String!'},
    total: {__type: 'Number!'}
  },
  HumanUser: {
    __typename: {__type: 'String!'},
    email: {__type: 'Email'},
    phone: {__type: 'JSONObject'},
    profile: {__type: 'Profile'}
  },
  OptsInput: {
    driverId: {__type: 'String'},
    fromDateISO: {__type: 'String'},
    state: {__type: 'TransferStateInput'},
    toDateISO: {__type: 'String'},
    userId: {__type: 'String'}
  },
  OptsInput_1: {
    fromDateISO: {__type: 'String'},
    state: {__type: 'TransferStateInput'},
    toDateISO: {__type: 'String'}
  },
  OptsInput_2: {
    fromDateISO: {__type: 'String'},
    includeVouchers: {__type: 'Boolean'},
    state: {
      __type:
        'PENDING_CONFIRMED_COMPLETE_CANCELED_TERMINATED_COMPLETEORCONFIRMEDInput'
    },
    toDateISO: {__type: 'String'}
  },
  PasswordInput: {
    changeRequired: {__type: 'Boolean'},
    password: {__type: 'String!'}
  },
  PhoneInput: {phone: {__type: 'String!'}},
  Profile: {
    __typename: {__type: 'String!'},
    displayName: {__type: 'String'},
    firstName: {__type: 'String'},
    lastName: {__type: 'String'},
    preferredLanguage: {__type: 'String'}
  },
  ProfileInput: {
    displayName: {__type: 'String'},
    familyName: {__type: 'String'},
    givenName: {__type: 'String'},
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
    driverId: {__type: 'String'},
    driverName: {__type: 'String'},
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
  UserUpdateInputInput: {
    email: {__type: 'EmailInput'},
    password: {__type: 'PasswordInput'},
    phone: {__type: 'PhoneInput'},
    profile: {__type: 'ProfileInput'},
    username: {__type: 'String'}
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
      __args: {driverUserId: 'String!', transferId: 'String!'}
    },
    cancelTransfer: {__type: 'Void', __args: {transferId: 'String!'}},
    createAuthorization: {
      __type: 'Any!',
      __args: {
        input: 'AuthorizationCreateInputInput!',
        organizationId: 'String'
      }
    },
    createTransfer: {
      __type: 'CreateTransfer!',
      __args: {values: 'TransferInputInput!'}
    },
    deactivateUser: {
      __type: 'Any!',
      __args: {organizationId: 'String', userId: 'String!'}
    },
    deleteAuthorization: {
      __type: 'Any!',
      __args: {authorizationId: 'String!', organizationId: 'String'}
    },
    deleteUser: {
      __type: 'Any!',
      __args: {organizationId: 'String', userId: 'String!'}
    },
    lockUser: {
      __type: 'Any!',
      __args: {organizationId: 'String', userId: 'String!'}
    },
    markCompleted: {__type: 'Void', __args: {transferId: 'String!'}},
    markConfirmed: {__type: 'Void', __args: {transferId: 'String!'}},
    reactivateUser: {
      __type: 'Any!',
      __args: {organizationId: 'String', userId: 'String!'}
    },
    requestPasswordReset: {
      __type: 'Any!',
      __args: {organizationId: 'String', userId: 'String!'}
    },
    resendEmailVerification: {
      __type: 'Any!',
      __args: {organizationId: 'String', userId: 'String!'}
    },
    sendEmailVerification: {
      __type: 'Any!',
      __args: {organizationId: 'String', userId: 'String!'}
    },
    setPassword: {
      __type: 'Any!',
      __args: {
        changeRequired: 'Boolean',
        newPassword: 'String!',
        organizationId: 'String',
        userId: 'String!'
      }
    },
    setPhone: {
      __type: 'Any!',
      __args: {organizationId: 'String', phone: 'String!', userId: 'String!'}
    },
    syncMonthlyTransfers: {
      __type: 'Void',
      __args: {userId: 'String!', yyyymm: 'String!'}
    },
    terminateTransfer: {__type: 'Void', __args: {transferId: 'String!'}},
    unlockUser: {
      __type: 'Any!',
      __args: {organizationId: 'String', userId: 'String!'}
    },
    updateAuthorization: {
      __type: 'Any!',
      __args: {
        input: 'AuthorizationUpdateInputInput!',
        organizationId: 'String'
      }
    },
    updateUser: {
      __type: 'Any!',
      __args: {
        changes: 'UserUpdateInputInput!',
        organizationId: 'String',
        userId: 'String!'
      }
    },
    userCreate: {
      __type: 'UserCreateResponse!',
      __args: {
        createProfile: 'Boolean',
        organizationId: 'String',
        skipEmailVerification: 'Boolean',
        values: 'ValuesInput!'
      }
    },
    verifyEmail: {
      __type: 'Any!',
      __args: {code: 'String!', organizationId: 'String', userId: 'String!'}
    }
  },
  query: {
    __typename: {__type: 'String!'},
    getAllTransfers: {
      __type: '[TransferRow!]!',
      __args: {opts: 'OptsInput'}
    },
    getAllUser: {__type: '[ZitadelUser!]!', __args: {limit: 'Number'}},
    getDriverRevenue: {
      __type: 'GetDriverRevenue!',
      __args: {driverUserId: 'String!', opts: 'OptsInput_2'}
    },
    getDriverTransfers: {
      __type: '[TransferRow!]!',
      __args: {driverUserId: 'String!', opts: 'OptsInput_1'}
    },
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

export interface GetDriverRevenue {
  __typename?: 'GetDriverRevenue'
  count: ScalarsEnums['Number']
  currency: ScalarsEnums['String']
  driverUserId: ScalarsEnums['String']
  total: ScalarsEnums['Number']
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
  driverId?: Maybe<ScalarsEnums['String']>
  driverName?: Maybe<ScalarsEnums['String']>
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
    driverUserId: ScalarsEnums['String']
    transferId: ScalarsEnums['String']
  }) => Maybe<ScalarsEnums['Void']>
  cancelTransfer: (args: {
    transferId: ScalarsEnums['String']
  }) => Maybe<ScalarsEnums['Void']>
  createAuthorization: (args: {
    input: AuthorizationCreateInputInput
    organizationId?: Maybe<ScalarsEnums['String']>
  }) => ScalarsEnums['Any']
  createTransfer: (args: {values: TransferInputInput}) => CreateTransfer
  deactivateUser: (args: {
    organizationId?: Maybe<ScalarsEnums['String']>
    userId: ScalarsEnums['String']
  }) => ScalarsEnums['Any']
  deleteAuthorization: (args: {
    authorizationId: ScalarsEnums['String']
    organizationId?: Maybe<ScalarsEnums['String']>
  }) => ScalarsEnums['Any']
  deleteUser: (args: {
    organizationId?: Maybe<ScalarsEnums['String']>
    userId: ScalarsEnums['String']
  }) => ScalarsEnums['Any']
  lockUser: (args: {
    organizationId?: Maybe<ScalarsEnums['String']>
    userId: ScalarsEnums['String']
  }) => ScalarsEnums['Any']
  markCompleted: (args: {
    transferId: ScalarsEnums['String']
  }) => Maybe<ScalarsEnums['Void']>
  markConfirmed: (args: {
    transferId: ScalarsEnums['String']
  }) => Maybe<ScalarsEnums['Void']>
  reactivateUser: (args: {
    organizationId?: Maybe<ScalarsEnums['String']>
    userId: ScalarsEnums['String']
  }) => ScalarsEnums['Any']
  requestPasswordReset: (args: {
    organizationId?: Maybe<ScalarsEnums['String']>
    userId: ScalarsEnums['String']
  }) => ScalarsEnums['Any']
  resendEmailVerification: (args: {
    organizationId?: Maybe<ScalarsEnums['String']>
    userId: ScalarsEnums['String']
  }) => ScalarsEnums['Any']
  sendEmailVerification: (args: {
    organizationId?: Maybe<ScalarsEnums['String']>
    userId: ScalarsEnums['String']
  }) => ScalarsEnums['Any']
  setPassword: (args: {
    changeRequired?: Maybe<ScalarsEnums['Boolean']>
    newPassword: ScalarsEnums['String']
    organizationId?: Maybe<ScalarsEnums['String']>
    userId: ScalarsEnums['String']
  }) => ScalarsEnums['Any']
  setPhone: (args: {
    organizationId?: Maybe<ScalarsEnums['String']>
    phone: ScalarsEnums['String']
    userId: ScalarsEnums['String']
  }) => ScalarsEnums['Any']
  syncMonthlyTransfers: (args: {
    userId: ScalarsEnums['String']
    yyyymm: ScalarsEnums['String']
  }) => Maybe<ScalarsEnums['Void']>
  terminateTransfer: (args: {
    transferId: ScalarsEnums['String']
  }) => Maybe<ScalarsEnums['Void']>
  unlockUser: (args: {
    organizationId?: Maybe<ScalarsEnums['String']>
    userId: ScalarsEnums['String']
  }) => ScalarsEnums['Any']
  updateAuthorization: (args: {
    input: AuthorizationUpdateInputInput
    organizationId?: Maybe<ScalarsEnums['String']>
  }) => ScalarsEnums['Any']
  updateUser: (args: {
    changes: UserUpdateInputInput
    organizationId?: Maybe<ScalarsEnums['String']>
    userId: ScalarsEnums['String']
  }) => ScalarsEnums['Any']
  userCreate: (args: {
    createProfile?: Maybe<ScalarsEnums['Boolean']>
    organizationId?: Maybe<ScalarsEnums['String']>
    skipEmailVerification?: Maybe<ScalarsEnums['Boolean']>
    values: ValuesInput
  }) => UserCreateResponse
  verifyEmail: (args: {
    code: ScalarsEnums['String']
    organizationId?: Maybe<ScalarsEnums['String']>
    userId: ScalarsEnums['String']
  }) => ScalarsEnums['Any']
}

export interface Query {
  __typename?: 'Query'
  getAllTransfers: (args?: {opts?: Maybe<OptsInput>}) => Array<TransferRow>
  getAllUser: (args?: {
    limit?: Maybe<ScalarsEnums['Number']>
  }) => Array<ZitadelUser>
  getDriverRevenue: (args: {
    driverUserId: ScalarsEnums['String']
    opts?: Maybe<OptsInput_2>
  }) => GetDriverRevenue
  getDriverTransfers: (args: {
    driverUserId: ScalarsEnums['String']
    opts?: Maybe<OptsInput_1>
  }) => Array<TransferRow>
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
  PENDING_CONFIRMED_COMPLETE_CANCELED_TERMINATED_COMPLETEORCONFIRMEDInput: PENDING_CONFIRMED_COMPLETE_CANCELED_TERMINATED_COMPLETEORCONFIRMEDInput
  TransferState: TransferState
  TransferStateInput: TransferStateInput
}
