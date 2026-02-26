/**
 * GQty AUTO-GENERATED CODE: PLEASE DO NOT MODIFY MANUALLY
 */

import { type ScalarsEnumsHash } from 'gqty';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Any: { input: any; output: any };
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: any; output: any };
  File: { input: any; output: any };
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any };
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: any; output: any };
  /** Custom scalar that handles both integers and floats */
  Number: { input: number; output: number };
  /** Represents NULL values */
  Void: { input: any; output: any };
}

export interface ArgsInput {
  customerId?: InputMaybe<Scalars['String']['input']>;
  driverId?: InputMaybe<Scalars['String']['input']>;
  fromDateISO?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Number']['input']>;
  state?: InputMaybe<TransferStateInput_1>;
  take?: InputMaybe<Scalars['Number']['input']>;
  toDateISO?: InputMaybe<Scalars['String']['input']>;
}

export interface AuthorizationCreateInputInput {
  projectGrantId?: InputMaybe<Scalars['String']['input']>;
  projectId?: InputMaybe<Scalars['String']['input']>;
  roleKeys: Array<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
}

export interface AuthorizationUpdateInputInput {
  authorizationId: Scalars['String']['input'];
  roleKeys: Array<Scalars['String']['input']>;
}

export interface D1TransferInputInput {
  amountEUR?: InputMaybe<Scalars['Number']['input']>;
  customerId: Scalars['String']['input'];
  customerName?: InputMaybe<Scalars['String']['input']>;
  driverId?: InputMaybe<Scalars['String']['input']>;
  driverName?: InputMaybe<Scalars['String']['input']>;
  dropoff: Scalars['String']['input'];
  payment?: InputMaybe<Scalars['String']['input']>;
  pickup: Scalars['String']['input'];
  requestedAtISO: Scalars['String']['input'];
  rideDateISO: Scalars['String']['input'];
  rideTime: Scalars['String']['input'];
  roomOrName?: InputMaybe<Scalars['String']['input']>;
  state: TransferStateInput_1;
  transferId: Scalars['String']['input'];
  vehicle?: InputMaybe<Scalars['String']['input']>;
}

export interface DetailsInput {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
}

export interface EmailInput {
  email: Scalars['String']['input'];
}

export interface KeysInput {
  auth?: InputMaybe<Scalars['String']['input']>;
  p256dh?: InputMaybe<Scalars['String']['input']>;
}

export interface OptsInput {
  customerId?: InputMaybe<Scalars['String']['input']>;
  driverId?: InputMaybe<Scalars['String']['input']>;
  fromDateISO?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<TransferStateInput>;
  toDateISO?: InputMaybe<Scalars['String']['input']>;
}

export interface OptsInput_1 {
  fromDateISO?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<TransferStateInput>;
  toDateISO?: InputMaybe<Scalars['String']['input']>;
}

export interface OptsInput_2 {
  fromDateISO?: InputMaybe<Scalars['String']['input']>;
  includeVouchers?: InputMaybe<Scalars['Boolean']['input']>;
  state?: InputMaybe<PENDING_CONFIRMED_COMPLETE_CANCELED_TERMINATED_COMPLETEORCONFIRMEDInput>;
  toDateISO?: InputMaybe<Scalars['String']['input']>;
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
  changeRequired?: InputMaybe<Scalars['Boolean']['input']>;
  password: Scalars['String']['input'];
}

export interface PhoneInput {
  phone: Scalars['String']['input'];
}

export interface ProfileInput {
  displayName?: InputMaybe<Scalars['String']['input']>;
  familyName?: InputMaybe<Scalars['String']['input']>;
  givenName?: InputMaybe<Scalars['String']['input']>;
  preferredLanguage?: InputMaybe<Scalars['String']['input']>;
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

export enum TransferStateInput_1 {
  canceled = 'canceled',
  complete = 'complete',
  confirmed = 'confirmed',
  pending = 'pending',
  terminated = 'terminated'
}

/**
 * Web push subscription metadata stored per user.
 * Used by NotificationService but persisted via UserService.
 */
export interface UserPushSubscriptionInput {
  deviceId?: InputMaybe<Scalars['String']['input']>;
  endpoint: Scalars['String']['input'];
  expirationTime?: InputMaybe<Scalars['Number']['input']>;
  keys?: InputMaybe<KeysInput>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
}

export interface UserUpdateInputInput {
  email?: InputMaybe<EmailInput>;
  password?: InputMaybe<PasswordInput>;
  phone?: InputMaybe<PhoneInput>;
  profile?: InputMaybe<ProfileInput>;
  username?: InputMaybe<Scalars['String']['input']>;
}

export interface ValuesInput {
  details?: InputMaybe<DetailsInput>;
  emailAddress: Scalars['String']['input'];
  hashedPassword?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
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
  TransferStateInput_1: true,
  Void: true
};
export const generatedSchema = {
  ArgsInput: {
    customerId: { __type: 'String' },
    driverId: { __type: 'String' },
    fromDateISO: { __type: 'String' },
    skip: { __type: 'Number' },
    state: { __type: 'TransferStateInput_1' },
    take: { __type: 'Number' },
    toDateISO: { __type: 'String' }
  },
  AuthorizationCreateInputInput: {
    projectGrantId: { __type: 'String' },
    projectId: { __type: 'String' },
    roleKeys: { __type: '[String!]!' },
    userId: { __type: 'String!' }
  },
  AuthorizationUpdateInputInput: {
    authorizationId: { __type: 'String!' },
    roleKeys: { __type: '[String!]!' }
  },
  BookTransfer: {
    __typename: { __type: 'String!' },
    transferId: { __type: 'String!' }
  },
  CreateTransfer: {
    __typename: { __type: 'String!' },
    transferId: { __type: 'String!' }
  },
  D1TransferInputInput: {
    amountEUR: { __type: 'Number' },
    customerId: { __type: 'String!' },
    customerName: { __type: 'String' },
    driverId: { __type: 'String' },
    driverName: { __type: 'String' },
    dropoff: { __type: 'String!' },
    payment: { __type: 'String' },
    pickup: { __type: 'String!' },
    requestedAtISO: { __type: 'String!' },
    rideDateISO: { __type: 'String!' },
    rideTime: { __type: 'String!' },
    roomOrName: { __type: 'String' },
    state: { __type: 'TransferStateInput_1!' },
    transferId: { __type: 'String!' },
    vehicle: { __type: 'String' }
  },
  Details: {
    __typename: { __type: 'String!' },
    changeDate: { __type: 'String!' },
    creationDate: { __type: 'String!' },
    resourceOwner: { __type: 'String!' },
    sequence: { __type: 'String!' }
  },
  DetailsInput: {
    firstName: { __type: 'String' },
    lastName: { __type: 'String' }
  },
  Details_1: {
    __typename: { __type: 'String!' },
    creationDate: { __type: 'String!' },
    resourceOwner: { __type: 'String!' },
    sequence: { __type: 'String!' }
  },
  Email: { __typename: { __type: 'String!' }, email: { __type: 'String' } },
  EmailInput: { email: { __type: 'String!' } },
  GetD1AllTransfers: {
    __typename: { __type: 'String!' },
    amountEUR: { __type: 'Number' },
    customerAddress: { __type: 'String' },
    customerEmail: { __type: 'String' },
    customerId: { __type: 'String!' },
    customerName: { __type: 'String' },
    customerPhoneNumber: { __type: 'String' },
    driverEmail: { __type: 'String' },
    driverId: { __type: 'String' },
    driverName: { __type: 'String' },
    driverPhoneNumber: { __type: 'String' },
    dropoff: { __type: 'String!' },
    licensePlate: { __type: 'String' },
    payment: { __type: 'String' },
    pickup: { __type: 'String!' },
    requestedAtISO: { __type: 'DateTimeISO!' },
    rideDateISO: { __type: 'String!' },
    rideTime: { __type: 'String!' },
    roomOrName: { __type: 'String' },
    state: { __type: 'String!' },
    transferId: { __type: 'String!' },
    updatedAtISO: { __type: 'DateTimeISO!' },
    vehicle: { __type: 'String' }
  },
  GetDriverRevenue: {
    __typename: { __type: 'String!' },
    count: { __type: 'Number!' },
    currency: { __type: 'String!' },
    driverUserId: { __type: 'String!' },
    total: { __type: 'Number!' }
  },
  HumanUser: {
    __typename: { __type: 'String!' },
    email: { __type: 'Email' },
    phone: { __type: 'JSONObject' },
    profile: { __type: 'Profile' }
  },
  Keys: {
    __typename: { __type: 'String!' },
    auth: { __type: 'String' },
    p256dh: { __type: 'String' }
  },
  KeysInput: { auth: { __type: 'String' }, p256dh: { __type: 'String' } },
  OptsInput: {
    customerId: { __type: 'String' },
    driverId: { __type: 'String' },
    fromDateISO: { __type: 'String' },
    state: { __type: 'TransferStateInput' },
    toDateISO: { __type: 'String' }
  },
  OptsInput_1: {
    fromDateISO: { __type: 'String' },
    state: { __type: 'TransferStateInput' },
    toDateISO: { __type: 'String' }
  },
  OptsInput_2: {
    fromDateISO: { __type: 'String' },
    includeVouchers: { __type: 'Boolean' },
    state: {
      __type:
        'PENDING_CONFIRMED_COMPLETE_CANCELED_TERMINATED_COMPLETEORCONFIRMEDInput'
    },
    toDateISO: { __type: 'String' }
  },
  PasswordInput: {
    changeRequired: { __type: 'Boolean' },
    password: { __type: 'String!' }
  },
  PhoneInput: { phone: { __type: 'String!' } },
  Profile: {
    __typename: { __type: 'String!' },
    displayName: { __type: 'String' },
    firstName: { __type: 'String' },
    lastName: { __type: 'String' },
    preferredLanguage: { __type: 'String' }
  },
  ProfileInput: {
    displayName: { __type: 'String' },
    familyName: { __type: 'String' },
    givenName: { __type: 'String' },
    preferredLanguage: { __type: 'String' }
  },
  ProjectRole: {
    __typename: { __type: 'String!' },
    displayName: { __type: 'String' },
    key: { __type: 'String!' }
  },
  SendTestNotificationToCurrentUser: {
    __typename: { __type: 'String!' },
    delivered: { __type: 'Number!' },
    failed: { __type: 'Number!' }
  },
  TransferRow: {
    __typename: { __type: 'String!' },
    amountEUR: { __type: 'Number' },
    customerId: { __type: 'String!' },
    customerName: { __type: 'String' },
    driverId: { __type: 'String' },
    driverName: { __type: 'String' },
    dropoff: { __type: 'String!' },
    payment: { __type: 'String' },
    pickup: { __type: 'String!' },
    requestedAtISO: { __type: 'String!' },
    rideDateISO: { __type: 'String!' },
    rideTime: { __type: 'String!' },
    roomOrName: { __type: 'String' },
    state: { __type: 'TransferState!' },
    transferId: { __type: 'String!' },
    vehicle: { __type: 'String' }
  },
  UserCreateResponse: {
    __typename: { __type: 'String!' },
    details: { __type: 'Details_1!' },
    userId: { __type: 'String!' }
  },
  UserPushSubscription: {
    __typename: { __type: 'String!' },
    deviceId: { __type: 'String' },
    endpoint: { __type: 'String!' },
    expirationTime: { __type: 'Number' },
    keys: { __type: 'Keys' },
    userAgent: { __type: 'String' }
  },
  UserPushSubscriptionInput: {
    deviceId: { __type: 'String' },
    endpoint: { __type: 'String!' },
    expirationTime: { __type: 'Number' },
    keys: { __type: 'KeysInput' },
    userAgent: { __type: 'String' }
  },
  UserRoute: {
    __typename: { __type: 'String!' },
    end: { __type: 'String!' },
    price: { __type: 'Number!' },
    start: { __type: 'String!' },
    vehicle: { __type: 'String' }
  },
  UserUpdateInputInput: {
    email: { __type: 'EmailInput' },
    password: { __type: 'PasswordInput' },
    phone: { __type: 'PhoneInput' },
    profile: { __type: 'ProfileInput' },
    username: { __type: 'String' }
  },
  ValuesInput: {
    details: { __type: 'DetailsInput' },
    emailAddress: { __type: 'String!' },
    hashedPassword: { __type: 'String' },
    password: { __type: 'String' },
    username: { __type: 'String!' }
  },
  ZitadelUser: {
    __typename: { __type: 'String!' },
    avatarUrl: { __type: 'String' },
    details: { __type: 'Details!' },
    grants: { __type: '[ZitadelUserGrant!]' },
    human: { __type: 'HumanUser' },
    id: { __type: 'String!' },
    loginNames: { __type: '[String!]!' },
    monthlyCount: { __type: 'Number' },
    monthlyRevenue: { __type: 'Number' },
    preferredLoginName: { __type: 'String!' },
    revenue: { __type: 'Number' },
    roles: { __type: '[ProjectRole!]' },
    routes: { __type: '[UserRoute!]' },
    state: { __type: 'String!' },
    transferCount: { __type: 'Number' },
    userName: { __type: 'String!' }
  },
  ZitadelUserGrant: {
    __typename: { __type: 'String!' },
    changeDate: { __type: 'String' },
    creationDate: { __type: 'String' },
    organizationId: { __type: 'String' },
    projectId: { __type: 'String' },
    projectName: { __type: 'String' },
    roles: { __type: '[ProjectRole!]!' },
    state: { __type: 'String' }
  },
  mutation: {
    __typename: { __type: 'String!' },
    addCurrentUserPushSubscription: {
      __type: '[UserPushSubscription!]!',
      __args: {
        organizationId: 'String',
        subscription: 'UserPushSubscriptionInput!'
      }
    },
    addProjectRole: {
      __type: 'Any!',
      __args: {
        displayName: 'String',
        organizationId: 'String',
        projectId: 'String!',
        roleKey: 'String!'
      }
    },
    assignDriver: {
      __type: 'Void',
      __args: { driverUserId: 'String!', transferId: 'String!' }
    },
    assignPrice: {
      __type: 'Void',
      __args: { amountEUR: 'Number!', transferId: 'String!' }
    },
    bookTransfer: {
      __type: 'BookTransfer!',
      __args: {
        amountEUR: 'Number',
        dropoff: 'String!',
        payment: 'String',
        pickup: 'String!',
        rideDateISO: 'String!',
        rideTime: 'String!',
        roomOrName: 'String',
        vehicle: 'String'
      }
    },
    cancelTransfer: { __type: 'Void', __args: { transferId: 'String!' } },
    clearCurrentUserPushSubscriptions: {
      __type: 'Any!',
      __args: { organizationId: 'String' }
    },
    createAuthorization: {
      __type: 'Any!',
      __args: {
        input: 'AuthorizationCreateInputInput!',
        organizationId: 'String'
      }
    },
    createD1Transfer: {
      __type: 'GetD1AllTransfers!',
      __args: { data: 'D1TransferInputInput!' }
    },
    createTransfer: {
      __type: 'CreateTransfer!',
      __args: {
        amountEUR: 'Number',
        customerId: 'String!',
        dropoff: 'String!',
        payment: 'String',
        pickup: 'String!',
        rideDateISO: 'String!',
        rideTime: 'String!',
        roomOrName: 'String',
        vehicle: 'String'
      }
    },
    deactivateUser: {
      __type: 'Any!',
      __args: { organizationId: 'String', userId: 'String!' }
    },
    deleteAuthorization: {
      __type: 'Any!',
      __args: { authorizationId: 'String!', organizationId: 'String' }
    },
    deleteUser: {
      __type: 'Any!',
      __args: { organizationId: 'String', userId: 'String!' }
    },
    lockUser: {
      __type: 'Any!',
      __args: { organizationId: 'String', userId: 'String!' }
    },
    markCompleted: { __type: 'Void', __args: { transferId: 'String!' } },
    markConfirmed: { __type: 'Void', __args: { transferId: 'String!' } },
    reactivateUser: {
      __type: 'Any!',
      __args: { organizationId: 'String', userId: 'String!' }
    },
    removeCurrentUserPushSubscription: {
      __type: '[UserPushSubscription!]!',
      __args: { endpoint: 'String!', organizationId: 'String' }
    },
    removeProjectRole: {
      __type: 'Any!',
      __args: {
        organizationId: 'String',
        projectId: 'String!',
        roleKey: 'String!'
      }
    },
    requestPasswordReset: {
      __type: 'Any!',
      __args: { organizationId: 'String', userId: 'String!' }
    },
    resendEmailVerification: {
      __type: 'Any!',
      __args: { organizationId: 'String', userId: 'String!' }
    },
    sendEmailVerification: {
      __type: 'Any!',
      __args: { organizationId: 'String', userId: 'String!' }
    },
    sendTestNotificationToCurrentUser: {
      __type: 'SendTestNotificationToCurrentUser!',
      __args: { organizationId: 'String' }
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
      __args: { organizationId: 'String', phone: 'String!', userId: 'String!' }
    },
    syncMonthlyTransfers: {
      __type: 'Void',
      __args: { userId: 'String!', yyyymm: 'String!' }
    },
    terminateTransfer: { __type: 'Void', __args: { transferId: 'String!' } },
    unlockUser: {
      __type: 'Any!',
      __args: { organizationId: 'String', userId: 'String!' }
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
      __args: { code: 'String!', organizationId: 'String', userId: 'String!' }
    }
  },
  query: {
    __typename: { __type: 'String!' },
    getAllTransfers: {
      __type: '[TransferRow!]!',
      __args: { opts: 'OptsInput' }
    },
    getAllUser: {
      __type: '[ZitadelUser!]!',
      __args: { limit: 'Number', organizationId: 'String' }
    },
    getCurrentUserPushSubscriptions: {
      __type: '[UserPushSubscription!]',
      __args: { organizationId: 'String' }
    },
    getCustomerBookings: { __type: '[TransferRow!]!' },
    getD1AllTransfers: {
      __type: '[GetD1AllTransfers!]!',
      __args: { args: 'ArgsInput' }
    },
    getDriverRevenue: {
      __type: 'GetDriverRevenue!',
      __args: { driverUserId: 'String!', opts: 'OptsInput_2' }
    },
    getDriverTransfers: {
      __type: '[TransferRow!]!',
      __args: { driverUserId: 'String!', opts: 'OptsInput_1' }
    },
    getIsUnique: { __type: 'Boolean', __args: { loginName: 'String!' } },
    getProjectRoles: {
      __type: '[ProjectRole!]!',
      __args: {
        limit: 'Number',
        organizationId: 'String',
        projectId: 'String!'
      }
    },
    getTransfer: { __type: 'TransferRow', __args: { transferId: 'String!' } },
    getUserCount: { __type: 'Number!' },
    getUsersByRole: {
      __type: '[ZitadelUser!]!',
      __args: { limit: 'Number', organizationId: 'String', roleKey: 'String!' }
    },
    user: {
      __type: 'ZitadelUser!',
      __args: { organizationId: 'String', userId: 'String!' }
    }
  },
  subscription: {}
} as const;

export interface BookTransfer {
  __typename?: 'BookTransfer';
  transferId: ScalarsEnums['String'];
}

export interface CreateTransfer {
  __typename?: 'CreateTransfer';
  transferId: ScalarsEnums['String'];
}

export interface Details {
  __typename?: 'Details';
  changeDate: ScalarsEnums['String'];
  creationDate: ScalarsEnums['String'];
  resourceOwner: ScalarsEnums['String'];
  sequence: ScalarsEnums['String'];
}

export interface Details_1 {
  __typename?: 'Details_1';
  creationDate: ScalarsEnums['String'];
  resourceOwner: ScalarsEnums['String'];
  sequence: ScalarsEnums['String'];
}

export interface Email {
  __typename?: 'Email';
  email?: Maybe<ScalarsEnums['String']>;
}

export interface GetD1AllTransfers {
  __typename?: 'GetD1AllTransfers';
  amountEUR?: Maybe<ScalarsEnums['Number']>;
  customerAddress?: Maybe<ScalarsEnums['String']>;
  customerEmail?: Maybe<ScalarsEnums['String']>;
  customerId: ScalarsEnums['String'];
  customerName?: Maybe<ScalarsEnums['String']>;
  customerPhoneNumber?: Maybe<ScalarsEnums['String']>;
  driverEmail?: Maybe<ScalarsEnums['String']>;
  driverId?: Maybe<ScalarsEnums['String']>;
  driverName?: Maybe<ScalarsEnums['String']>;
  driverPhoneNumber?: Maybe<ScalarsEnums['String']>;
  dropoff: ScalarsEnums['String'];
  licensePlate?: Maybe<ScalarsEnums['String']>;
  payment?: Maybe<ScalarsEnums['String']>;
  pickup: ScalarsEnums['String'];
  requestedAtISO: ScalarsEnums['DateTimeISO'];
  rideDateISO: ScalarsEnums['String'];
  rideTime: ScalarsEnums['String'];
  roomOrName?: Maybe<ScalarsEnums['String']>;
  state: ScalarsEnums['String'];
  transferId: ScalarsEnums['String'];
  updatedAtISO: ScalarsEnums['DateTimeISO'];
  vehicle?: Maybe<ScalarsEnums['String']>;
}

export interface GetDriverRevenue {
  __typename?: 'GetDriverRevenue';
  count: ScalarsEnums['Number'];
  currency: ScalarsEnums['String'];
  driverUserId: ScalarsEnums['String'];
  total: ScalarsEnums['Number'];
}

/**
 * Contains human-specific attributes (profile, email, phone).
 */
export interface HumanUser {
  __typename?: 'HumanUser';
  email?: Maybe<Email>;
  phone?: Maybe<ScalarsEnums['JSONObject']>;
  profile?: Maybe<Profile>;
}

export interface Keys {
  __typename?: 'Keys';
  auth?: Maybe<ScalarsEnums['String']>;
  p256dh?: Maybe<ScalarsEnums['String']>;
}

export interface Profile {
  __typename?: 'Profile';
  displayName?: Maybe<ScalarsEnums['String']>;
  firstName?: Maybe<ScalarsEnums['String']>;
  lastName?: Maybe<ScalarsEnums['String']>;
  preferredLanguage?: Maybe<ScalarsEnums['String']>;
}

export interface ProjectRole {
  __typename?: 'ProjectRole';
  displayName?: Maybe<ScalarsEnums['String']>;
  key: ScalarsEnums['String'];
}

export interface SendTestNotificationToCurrentUser {
  __typename?: 'SendTestNotificationToCurrentUser';
  delivered: ScalarsEnums['Number'];
  failed: ScalarsEnums['Number'];
}

export interface TransferRow {
  __typename?: 'TransferRow';
  amountEUR?: Maybe<ScalarsEnums['Number']>;
  customerId: ScalarsEnums['String'];
  customerName?: Maybe<ScalarsEnums['String']>;
  driverId?: Maybe<ScalarsEnums['String']>;
  driverName?: Maybe<ScalarsEnums['String']>;
  dropoff: ScalarsEnums['String'];
  payment?: Maybe<ScalarsEnums['String']>;
  pickup: ScalarsEnums['String'];
  requestedAtISO: ScalarsEnums['String'];
  rideDateISO: ScalarsEnums['String'];
  rideTime: ScalarsEnums['String'];
  roomOrName?: Maybe<ScalarsEnums['String']>;
  state: ScalarsEnums['TransferState'];
  transferId: ScalarsEnums['String'];
  vehicle?: Maybe<ScalarsEnums['String']>;
}

export interface UserCreateResponse {
  __typename?: 'UserCreateResponse';
  details: Details_1;
  userId: ScalarsEnums['String'];
}

export interface UserPushSubscription {
  __typename?: 'UserPushSubscription';
  deviceId?: Maybe<ScalarsEnums['String']>;
  endpoint: ScalarsEnums['String'];
  expirationTime?: Maybe<ScalarsEnums['Number']>;
  keys?: Maybe<Keys>;
  userAgent?: Maybe<ScalarsEnums['String']>;
}

export interface UserRoute {
  __typename?: 'UserRoute';
  end: ScalarsEnums['String'];
  price: ScalarsEnums['Number'];
  start: ScalarsEnums['String'];
  vehicle?: Maybe<ScalarsEnums['String']>;
}

export interface ZitadelUser {
  __typename?: 'ZitadelUser';
  avatarUrl?: Maybe<ScalarsEnums['String']>;
  details: Details;
  grants?: Maybe<Array<ZitadelUserGrant>>;
  human?: Maybe<HumanUser>;
  id: ScalarsEnums['String'];
  loginNames: Array<ScalarsEnums['String']>;
  monthlyCount?: Maybe<ScalarsEnums['Number']>;
  monthlyRevenue?: Maybe<ScalarsEnums['Number']>;
  preferredLoginName: ScalarsEnums['String'];
  revenue?: Maybe<ScalarsEnums['Number']>;
  roles?: Maybe<Array<ProjectRole>>;
  routes?: Maybe<Array<UserRoute>>;
  state: ScalarsEnums['String'];
  transferCount?: Maybe<ScalarsEnums['Number']>;
  userName: ScalarsEnums['String'];
}

export interface ZitadelUserGrant {
  __typename?: 'ZitadelUserGrant';
  changeDate?: Maybe<ScalarsEnums['String']>;
  creationDate?: Maybe<ScalarsEnums['String']>;
  organizationId?: Maybe<ScalarsEnums['String']>;
  projectId?: Maybe<ScalarsEnums['String']>;
  projectName?: Maybe<ScalarsEnums['String']>;
  roles: Array<ProjectRole>;
  state?: Maybe<ScalarsEnums['String']>;
}

export interface Mutation {
  __typename?: 'Mutation';
  addCurrentUserPushSubscription: (args: {
    organizationId?: Maybe<ScalarsEnums['String']>;
    subscription: UserPushSubscriptionInput;
  }) => Array<UserPushSubscription>;
  addProjectRole: (args: {
    displayName?: Maybe<ScalarsEnums['String']>;
    organizationId?: Maybe<ScalarsEnums['String']>;
    projectId: ScalarsEnums['String'];
    roleKey: ScalarsEnums['String'];
  }) => ScalarsEnums['Any'];
  assignDriver: (args: {
    driverUserId: ScalarsEnums['String'];
    transferId: ScalarsEnums['String'];
  }) => Maybe<ScalarsEnums['Void']>;
  assignPrice: (args: {
    amountEUR: ScalarsEnums['Number'];
    transferId: ScalarsEnums['String'];
  }) => Maybe<ScalarsEnums['Void']>;
  bookTransfer: (args: {
    amountEUR?: Maybe<ScalarsEnums['Number']>;
    dropoff: ScalarsEnums['String'];
    payment?: Maybe<ScalarsEnums['String']>;
    pickup: ScalarsEnums['String'];
    rideDateISO: ScalarsEnums['String'];
    rideTime: ScalarsEnums['String'];
    roomOrName?: Maybe<ScalarsEnums['String']>;
    vehicle?: Maybe<ScalarsEnums['String']>;
  }) => BookTransfer;
  cancelTransfer: (args: {
    transferId: ScalarsEnums['String'];
  }) => Maybe<ScalarsEnums['Void']>;
  clearCurrentUserPushSubscriptions: (args?: {
    organizationId?: Maybe<ScalarsEnums['String']>;
  }) => ScalarsEnums['Any'];
  createAuthorization: (args: {
    input: AuthorizationCreateInputInput;
    organizationId?: Maybe<ScalarsEnums['String']>;
  }) => ScalarsEnums['Any'];
  createD1Transfer: (args: { data: D1TransferInputInput }) => GetD1AllTransfers;
  createTransfer: (args: {
    amountEUR?: Maybe<ScalarsEnums['Number']>;
    customerId: ScalarsEnums['String'];
    dropoff: ScalarsEnums['String'];
    payment?: Maybe<ScalarsEnums['String']>;
    pickup: ScalarsEnums['String'];
    rideDateISO: ScalarsEnums['String'];
    rideTime: ScalarsEnums['String'];
    roomOrName?: Maybe<ScalarsEnums['String']>;
    vehicle?: Maybe<ScalarsEnums['String']>;
  }) => CreateTransfer;
  deactivateUser: (args: {
    organizationId?: Maybe<ScalarsEnums['String']>;
    userId: ScalarsEnums['String'];
  }) => ScalarsEnums['Any'];
  deleteAuthorization: (args: {
    authorizationId: ScalarsEnums['String'];
    organizationId?: Maybe<ScalarsEnums['String']>;
  }) => ScalarsEnums['Any'];
  deleteUser: (args: {
    organizationId?: Maybe<ScalarsEnums['String']>;
    userId: ScalarsEnums['String'];
  }) => ScalarsEnums['Any'];
  lockUser: (args: {
    organizationId?: Maybe<ScalarsEnums['String']>;
    userId: ScalarsEnums['String'];
  }) => ScalarsEnums['Any'];
  markCompleted: (args: {
    transferId: ScalarsEnums['String'];
  }) => Maybe<ScalarsEnums['Void']>;
  markConfirmed: (args: {
    transferId: ScalarsEnums['String'];
  }) => Maybe<ScalarsEnums['Void']>;
  reactivateUser: (args: {
    organizationId?: Maybe<ScalarsEnums['String']>;
    userId: ScalarsEnums['String'];
  }) => ScalarsEnums['Any'];
  removeCurrentUserPushSubscription: (args: {
    endpoint: ScalarsEnums['String'];
    organizationId?: Maybe<ScalarsEnums['String']>;
  }) => Array<UserPushSubscription>;
  removeProjectRole: (args: {
    organizationId?: Maybe<ScalarsEnums['String']>;
    projectId: ScalarsEnums['String'];
    roleKey: ScalarsEnums['String'];
  }) => ScalarsEnums['Any'];
  requestPasswordReset: (args: {
    organizationId?: Maybe<ScalarsEnums['String']>;
    userId: ScalarsEnums['String'];
  }) => ScalarsEnums['Any'];
  resendEmailVerification: (args: {
    organizationId?: Maybe<ScalarsEnums['String']>;
    userId: ScalarsEnums['String'];
  }) => ScalarsEnums['Any'];
  sendEmailVerification: (args: {
    organizationId?: Maybe<ScalarsEnums['String']>;
    userId: ScalarsEnums['String'];
  }) => ScalarsEnums['Any'];
  sendTestNotificationToCurrentUser: (args?: {
    organizationId?: Maybe<ScalarsEnums['String']>;
  }) => SendTestNotificationToCurrentUser;
  setPassword: (args: {
    changeRequired?: Maybe<ScalarsEnums['Boolean']>;
    newPassword: ScalarsEnums['String'];
    organizationId?: Maybe<ScalarsEnums['String']>;
    userId: ScalarsEnums['String'];
  }) => ScalarsEnums['Any'];
  setPhone: (args: {
    organizationId?: Maybe<ScalarsEnums['String']>;
    phone: ScalarsEnums['String'];
    userId: ScalarsEnums['String'];
  }) => ScalarsEnums['Any'];
  syncMonthlyTransfers: (args: {
    userId: ScalarsEnums['String'];
    yyyymm: ScalarsEnums['String'];
  }) => Maybe<ScalarsEnums['Void']>;
  terminateTransfer: (args: {
    transferId: ScalarsEnums['String'];
  }) => Maybe<ScalarsEnums['Void']>;
  unlockUser: (args: {
    organizationId?: Maybe<ScalarsEnums['String']>;
    userId: ScalarsEnums['String'];
  }) => ScalarsEnums['Any'];
  updateAuthorization: (args: {
    input: AuthorizationUpdateInputInput;
    organizationId?: Maybe<ScalarsEnums['String']>;
  }) => ScalarsEnums['Any'];
  updateUser: (args: {
    changes: UserUpdateInputInput;
    organizationId?: Maybe<ScalarsEnums['String']>;
    userId: ScalarsEnums['String'];
  }) => ScalarsEnums['Any'];
  userCreate: (args: {
    createProfile?: Maybe<ScalarsEnums['Boolean']>;
    organizationId?: Maybe<ScalarsEnums['String']>;
    skipEmailVerification?: Maybe<ScalarsEnums['Boolean']>;
    values: ValuesInput;
  }) => UserCreateResponse;
  verifyEmail: (args: {
    code: ScalarsEnums['String'];
    organizationId?: Maybe<ScalarsEnums['String']>;
    userId: ScalarsEnums['String'];
  }) => ScalarsEnums['Any'];
}

export interface Query {
  __typename?: 'Query';
  getAllTransfers: (args?: { opts?: Maybe<OptsInput> }) => Array<TransferRow>;
  getAllUser: (args?: {
    limit?: Maybe<ScalarsEnums['Number']>;
    organizationId?: Maybe<ScalarsEnums['String']>;
  }) => Array<ZitadelUser>;
  getCurrentUserPushSubscriptions: (args?: {
    organizationId?: Maybe<ScalarsEnums['String']>;
  }) => Maybe<Array<UserPushSubscription>>;
  getCustomerBookings: Array<TransferRow>;
  getD1AllTransfers: (args?: {
    args?: Maybe<ArgsInput>;
  }) => Array<GetD1AllTransfers>;
  getDriverRevenue: (args: {
    driverUserId: ScalarsEnums['String'];
    opts?: Maybe<OptsInput_2>;
  }) => GetDriverRevenue;
  getDriverTransfers: (args: {
    driverUserId: ScalarsEnums['String'];
    opts?: Maybe<OptsInput_1>;
  }) => Array<TransferRow>;
  getIsUnique: (args: {
    loginName: ScalarsEnums['String'];
  }) => Maybe<ScalarsEnums['Boolean']>;
  getProjectRoles: (args: {
    limit?: Maybe<ScalarsEnums['Number']>;
    organizationId?: Maybe<ScalarsEnums['String']>;
    projectId: ScalarsEnums['String'];
  }) => Array<ProjectRole>;
  getTransfer: (args: {
    transferId: ScalarsEnums['String'];
  }) => Maybe<TransferRow>;
  getUserCount: ScalarsEnums['Number'];
  getUsersByRole: (args: {
    limit?: Maybe<ScalarsEnums['Number']>;
    organizationId?: Maybe<ScalarsEnums['String']>;
    roleKey: ScalarsEnums['String'];
  }) => Array<ZitadelUser>;
  user: (args: {
    organizationId?: Maybe<ScalarsEnums['String']>;
    userId: ScalarsEnums['String'];
  }) => ZitadelUser;
}

export interface Subscription {
  __typename?: 'Subscription';
}

export interface GeneratedSchema {
  query: Query;
  mutation: Mutation;
  subscription: Subscription;
}

export type ScalarsEnums = {
  [Key in keyof Scalars]: Scalars[Key] extends { output: unknown }
    ? Scalars[Key]['output']
    : never;
} & {
  PENDING_CONFIRMED_COMPLETE_CANCELED_TERMINATED_COMPLETEORCONFIRMEDInput: PENDING_CONFIRMED_COMPLETE_CANCELED_TERMINATED_COMPLETEORCONFIRMEDInput;
  TransferState: TransferState;
  TransferStateInput: TransferStateInput;
  TransferStateInput_1: TransferStateInput_1;
};
