# Encapsulate

Project by Team 8, Status 418.

## Setting up the Project

### Requirements:

#### **Node.js installation**

You will need to have `Node.js` installed, so you can use `pnpm`.

**Using Volta or NVM**

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

We use payload's built in code generation to generate types for our project. To do this you can run the following command:

```bash
pnpm generate:types
```

## Contributing

See further towards contributing guidelines in the [GitHub Wiki](https://github.com/uoa-compsci399-2025-s1/capstone-project-2025-s1-team-8/wiki/)
