# Ether Oasis

Ether Oasis is a web application designed to provide wallet tracking and social features to facilitate a social-first experience when interacting with Ethereum.

## Features

- Wallet Tracking: Easily track the value of your Ethereum wallet and the tokens it holds.
- Social Interaction: Connect with other Ethereum users, share insights, and engage in discussions about the crypto market.
- Portfolio Management: Monitor the performance of your token holdings and track their value in real-time.
- Token Information: Get up-to-date information on various tokens, including prices, market trends, and more.
- User Profiles: Create and customize your user profile to showcase your Ethereum activity and connect with like-minded individuals.

## Getting Started

To get started with Ether Oasis, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/your-username/ether-oasis.git
```

2. Install dependencies:

```bash
cd ether-oasis
npm install
```
3. Configure Environment Variables:

Create a .env file in the root directory and provide the necessary environment variables. Refer to .env.example for the required variables.

4. Start the Development Server:

```shell
npm run dev
```

5. Open your browser and navigate to http://localhost:3000 to access Ether Oasis.

```shell
.
├── README.md                       # README file
├── __mocks__                       # Mocks for testing
├── .github                         # GitHub folder
├── .husky                          # Husky configuration
├── .vscode                         # VSCode configuration
├── public                          # Public assets folder
├── src
│   ├── layouts                     # Layouts components
│   ├── pages                       # Next JS Pages
│   ├── pages.test                  # Next JS Pages tests (this avoids tests to be treated as a Next.js pages)
│   ├── styles                      # Styles folder
│   ├── templates                   # Default template
│   └── utils                       # Utility functions
├── tailwind.config.js              # Tailwind CSS configuration
└── tsconfig.json                   # TypeScript configuration
```

### Commit Message Format

The project enforces [Conventional Commits](https://www.conventionalcommits.org/) specification. This means that all your commit messages must be formatted according to the specification. To help you write commit messages, the project uses [Commitizen](https://github.com/commitizen/cz-cli), an interactive CLI that guides you through the commit process. To use it, run the following command:

```shell
npm run commit
```

One of the benefits of using Conventional Commits is that it allows us to automatically generate a `CHANGELOG` file. It also allows us to automatically determine the next version number based on the types of commits that are included in a release.

### Deploy to production

You can see the results locally in production mode with:

```shell
$ npm run build
$ npm run start
```

The generated HTML and CSS files are minified (built-in feature from Next js). It will also remove unused CSS from [Tailwind CSS](https://tailwindcss.com).

You can create an optimized production build with:

```shell
npm run build-prod
```

### Testing

All tests are colocated with the source code inside the same directory. So, it makes it easier to find them. Unfortunately, it is not possible with the `pages` folder which is used by Next.js for routing. So, what is why we have a `pages.test` folder to write tests from files located in `pages` folder.

### Contributions

Everyone is welcome to contribute to this project. Feel free to open an issue if you have question or found a bug. Totally open to any suggestions and improvements.

### License

Licensed under the MIT License, Copyright © 2023
