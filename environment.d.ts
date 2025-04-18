declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /**
       * The mongoDB connection string
       */
      DATABASE_URI: string
      /**
       * Secret used to secure Payload
       */
      PAYLOAD_SECRET: string
      /**
       * The Google Auth Client ID, view the [docs](https://github.com/uoa-compsci399-2025-s1/capstone-project-2025-s1-team-8/wiki/Backend-Architecture#google-oauth-authentication) on how to generate one.
       */
      GOOGLE_CLIENT_ID: string
      /**
       * The Google Auth Client Secret, view the [docs](https://github.com/uoa-compsci399-2025-s1/capstone-project-2025-s1-team-8/wiki/Backend-Architecture#google-oauth-authentication) on how to generate one.
       */
      GOOGLE_CLIENT_SECRET: string
      /**
       * The public URL of the website
       */
      NEXT_PUBLIC_URL: string
    }
  }
}

export {}
