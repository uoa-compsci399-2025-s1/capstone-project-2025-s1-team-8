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
       * NOTE: We currently have an unstable url as we don't have a static IP. This variable will require changes whenever our IP gets rolled out.
       */
      NEXT_PUBLIC_URL: string
      /**
       * Secret used to secure JWT. You can see how to generate this secret [here](https://github.com/uoa-compsci399-2025-s1/capstone-project-2025-s1-team-8/wiki/Backend-Architecture#jwt-authentication).
       */
      JWT_SECRET: string
      AWS_ACCESS_KEY_ID: string
      AWS_SECRET_ACCESS_KEY: string
      AWS_REGION: string
      AWS_BUCKET_NAME: string
    }
  }
}

export {}
