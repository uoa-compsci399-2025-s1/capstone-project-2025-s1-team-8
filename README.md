# Encapsulate

Project by Team 8, Status 418.

### About

Encapsulate is a platform that aims to provide a comprehensive solution for Clients, Admins, and Students to manage, submit, and view projects for the [University of Auckland's BSc Computer Science](https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/computer-science/undergraduate/bsc-compsci-from-2019.html) capstone course, COMPSCI 399. Encapsulate is built for a user-friendly interface, aiming for an efficient and effective user experience.

## Setting up the Project

### Requirements:

#### **Node.js installation**

You will need to have `Node.js` installed, so you can use `pnpm`.

**Volta:**

It is recommended to use [Volta](https://volta.sh/) to manage the Node.js version.

You can install Volta by following the [instructions](https://docs.volta.sh/guide/getting-started).

**Node Version Manager (NVM):**

Alternatively, you can use [NVM](https://github.com/nvm-sh/nvm) to manage the Node.js version.

* [Windows Installation](https://github.com/coreybutler/nvm-windows/releases)

* [UNIX Installation](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)

In the root directory, run the following command to install the correct version of Node.js:

```bash
nvm install
nvm use
```

#### Package manager installation

It is recommended to use [pnpm](https://pnpm.io/) as the package manager.

If the correct version of Node.js is installed, you can run:

```bash
corepack enable
pnpm install
```

To start the development server, run:

```bash
pnpm dev
```

The development server will be running at `http://localhost:3000`.

#### Environment Variables

Environment variables are used to store sensitive information that should not be stored in the codebase. These are stored in a `.env` file in the root of the project.

Copy the `.env.example` file and rename it to `.env`.

#### Type Generation

We use payload's built-in code generation to generate types for our project. To do this you can run the following command:

```bash
pnpm generate:types
```

### Testing

Automated testing is an important part of writing code that can be maintained and understood long after the developers stop working on code.

We use [vitest](https://vitest.dev/) as our test runner because of its ease of setup

Tests should be suffixed with the extension, `.test.ts`. I.e. for `auth.ts`, we have `auth.test.ts`.

To run all the tests the following command can be used

```bash
pnpm test
```

To run a single test you can use the following command

```bash
pnpm test <test-name>
```

## Technical Stack

We use the following technologies:

**Frontend:**

The main framework for this project is using `Next.js`, it is most important to understand that we are using the [App Router](https://nextjs.org/docs/app) and [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) to build the project. Note that you will need to have some understanding of React to work on this project.

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

**Backend:**

We are using PayloadCMS to manage the content of the website, as well as define the shape of our data. This takes away a lot of the hard work that is put into setting up a database and API. You will have to familiarise yourself with how to use [Payload's API](https://payloadcms.com/docs/local-api/overview).

- [Payload CMS](https://payloadcms.com/)
- [Vitest](https://vitest.dev/)

## Contributing

See further towards contributing guidelines in the [GitHub Wiki](https://github.com/uoa-compsci399-2025-s1/capstone-project-2025-s1-team-8/wiki/)

## Acknowledgements

[Eric Zheng - Facilitator](https://github.com/monoclonalAb)

[JooHui Lee - Lead Designer](https://github.com/joohuil)

[Bethany Yates - Frontend Lead](https://github.com/bethany-aroha)

[Dennis Hu - Backend Lead](https://github.com/midnightcuberx)

[Sheena Lin - DevOps Lead](https://github.com/elin277)

[Jeffery Ji - Documentation Lead](https://github.com/jeffplays2005)
