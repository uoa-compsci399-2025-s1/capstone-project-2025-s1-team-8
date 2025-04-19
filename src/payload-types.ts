/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

/**
 * Supported timezones in IANA format.
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "supportedTimezones".
 */
export type SupportedTimezones =
  | 'Pacific/Midway'
  | 'Pacific/Niue'
  | 'Pacific/Honolulu'
  | 'Pacific/Rarotonga'
  | 'America/Anchorage'
  | 'Pacific/Gambier'
  | 'America/Los_Angeles'
  | 'America/Tijuana'
  | 'America/Denver'
  | 'America/Phoenix'
  | 'America/Chicago'
  | 'America/Guatemala'
  | 'America/New_York'
  | 'America/Bogota'
  | 'America/Caracas'
  | 'America/Santiago'
  | 'America/Buenos_Aires'
  | 'America/Sao_Paulo'
  | 'Atlantic/South_Georgia'
  | 'Atlantic/Azores'
  | 'Atlantic/Cape_Verde'
  | 'Europe/London'
  | 'Europe/Berlin'
  | 'Africa/Lagos'
  | 'Europe/Athens'
  | 'Africa/Cairo'
  | 'Europe/Moscow'
  | 'Asia/Riyadh'
  | 'Asia/Dubai'
  | 'Asia/Baku'
  | 'Asia/Karachi'
  | 'Asia/Tashkent'
  | 'Asia/Calcutta'
  | 'Asia/Dhaka'
  | 'Asia/Almaty'
  | 'Asia/Jakarta'
  | 'Asia/Bangkok'
  | 'Asia/Shanghai'
  | 'Asia/Singapore'
  | 'Asia/Tokyo'
  | 'Asia/Seoul'
  | 'Australia/Brisbane'
  | 'Australia/Sydney'
  | 'Pacific/Guam'
  | 'Pacific/Noumea'
  | 'Pacific/Auckland'
  | 'Pacific/Fiji';

export interface Config {
  auth: {
    user: UserAuthOperations;
  };
  blocks: {};
  collections: {
    authentication: Authentication;
    user: User;
    media: Media;
    project: Project;
    semesterProject: SemesterProject;
    semester: Semester;
    formQuestion: FormQuestion;
    formResponse: FormResponse;
    form: Form;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    authentication: AuthenticationSelect<false> | AuthenticationSelect<true>;
    user: UserSelect<false> | UserSelect<true>;
    media: MediaSelect<false> | MediaSelect<true>;
    project: ProjectSelect<false> | ProjectSelect<true>;
    semesterProject: SemesterProjectSelect<false> | SemesterProjectSelect<true>;
    semester: SemesterSelect<false> | SemesterSelect<true>;
    formQuestion: FormQuestionSelect<false> | FormQuestionSelect<true>;
    formResponse: FormResponseSelect<false> | FormResponseSelect<true>;
    form: FormSelect<false> | FormSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: string;
  };
  globals: {};
  globalsSelect: {};
  locale: null;
  user: User & {
    collection: 'user';
  };
  jobs: {
    tasks: unknown;
    workflows: unknown;
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "authentication".
 */
export interface Authentication {
  id: string;
  /**
   * The user who owns this authentication
   */
  user: string | User;
  /**
   * The type of authentication
   */
  type: string;
  /**
   * The type of authentication
   */
  provider: 'google';
  /**
   * The provider account id of the user authentication
   */
  providerAccountId?: string | null;
  /**
   * The refresh token of the user authentication
   */
  refreshToken?: string | null;
  /**
   * The access token of the user authentication
   */
  accessToken: string;
  /**
   * The expiration time of the access token
   */
  expiresAt: number;
  /**
   * The type of token
   */
  tokenType?: string | null;
  /**
   * The scope of the token
   */
  scope?: string | null;
  /**
   * The id token of the user authentication
   */
  idToken?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "user".
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'client' | 'student';
  image?: (string | null) | Media;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: string;
  alt: string;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "project".
 */
export interface Project {
  id: string;
  name: string;
  clients: (string | User)[];
  description: string;
  attachments?: (string | Media)[] | null;
  deadline?: string | null;
  timestamp: string;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "semesterProject".
 */
export interface SemesterProject {
  id: string;
  number?: number | null;
  project: string | Project;
  semester: string | Semester;
  status: 'pending' | 'accepted' | 'rejected';
  published: boolean;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "semester".
 */
export interface Semester {
  id: string;
  name: string;
  projects: (string | SemesterProject)[];
  deadline: string;
  startDate: string;
  endDate: string;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "formQuestion".
 */
export interface FormQuestion {
  id: string;
  question: string;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "formResponse".
 */
export interface FormResponse {
  id: string;
  name: string;
  description: string;
  clients?: (string | User)[] | null;
  questionResponses?:
    | {
        question: string | FormQuestion;
        answer: string;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "form".
 */
export interface Form {
  id: string;
  name: string;
  description: string;
  questions?: (string | FormQuestion)[] | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: string;
  document?:
    | ({
        relationTo: 'authentication';
        value: string | Authentication;
      } | null)
    | ({
        relationTo: 'user';
        value: string | User;
      } | null)
    | ({
        relationTo: 'media';
        value: string | Media;
      } | null)
    | ({
        relationTo: 'project';
        value: string | Project;
      } | null)
    | ({
        relationTo: 'semesterProject';
        value: string | SemesterProject;
      } | null)
    | ({
        relationTo: 'semester';
        value: string | Semester;
      } | null)
    | ({
        relationTo: 'formQuestion';
        value: string | FormQuestion;
      } | null)
    | ({
        relationTo: 'formResponse';
        value: string | FormResponse;
      } | null)
    | ({
        relationTo: 'form';
        value: string | Form;
      } | null);
  globalSlug?: string | null;
  user: {
    relationTo: 'user';
    value: string | User;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'user';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "authentication_select".
 */
export interface AuthenticationSelect<T extends boolean = true> {
  user?: T;
  type?: T;
  provider?: T;
  providerAccountId?: T;
  refreshToken?: T;
  accessToken?: T;
  expiresAt?: T;
  tokenType?: T;
  scope?: T;
  idToken?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "user_select".
 */
export interface UserSelect<T extends boolean = true> {
  firstName?: T;
  lastName?: T;
  role?: T;
  image?: T;
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media_select".
 */
export interface MediaSelect<T extends boolean = true> {
  alt?: T;
  updatedAt?: T;
  createdAt?: T;
  url?: T;
  thumbnailURL?: T;
  filename?: T;
  mimeType?: T;
  filesize?: T;
  width?: T;
  height?: T;
  focalX?: T;
  focalY?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "project_select".
 */
export interface ProjectSelect<T extends boolean = true> {
  name?: T;
  clients?: T;
  description?: T;
  attachments?: T;
  deadline?: T;
  timestamp?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "semesterProject_select".
 */
export interface SemesterProjectSelect<T extends boolean = true> {
  number?: T;
  project?: T;
  semester?: T;
  status?: T;
  published?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "semester_select".
 */
export interface SemesterSelect<T extends boolean = true> {
  name?: T;
  projects?: T;
  deadline?: T;
  startDate?: T;
  endDate?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "formQuestion_select".
 */
export interface FormQuestionSelect<T extends boolean = true> {
  question?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "formResponse_select".
 */
export interface FormResponseSelect<T extends boolean = true> {
  name?: T;
  description?: T;
  clients?: T;
  questionResponses?:
    | T
    | {
        question?: T;
        answer?: T;
        id?: T;
      };
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "form_select".
 */
export interface FormSelect<T extends boolean = true> {
  name?: T;
  description?: T;
  questions?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}