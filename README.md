## Next.js Dashboard Application

This is a comprehensive dashboard application built with Next.js App Router. It demonstrates modern React and Next.js patterns including server-side rendering, data fetching, authentication, and performance optimization.

## Features

- **Dashboard Overview** - Interactive charts and key metrics
- **Invoice Management** - Create, view, edit, and manage invoices
- **Customer Directory** - Browse and search customer information
- **Authentication** - Secure login system
- **Responsive Design** - Mobile-friendly UI with Tailwind CSS
- **Loading States** - Skeleton screens to minimize layout shift (CLS)
- **Search & Filtering** - Real-time search with pagination

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or pnpm package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd nextjs-dashboard
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
   - Copy the `.env.example` file to `.env.local`:

     ```bash
     cp .env.example .env.local
     ```

   - Update `.env.local` with your actual configuration values:
     - `AUTH_SECRET` - Generate a random secret key for authentication
     - `AUTH_URL` - Your application's URL (default: `http://localhost:3000/api/auth` for development)
     - `POSTGRES_URL` - Your PostgreSQL database connection string
     - Update other database variables as needed based on your provider

   **Important**: Never commit `.env.local` or any file containing secrets to version control. The `.env.example` file is provided as a template showing which variables are required.

### Running the Application

#### Development Mode

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The application will automatically reload when you make changes.

#### Production Build

```bash
npm run build
npm start
# or
pnpm build
pnpm start
```

## Login Credentials

Test login credentials are available in [Chapter 14 of the Next.js Learn course](https://nextjs.org/learn/dashboard-app/adding-authentication#try-it-out).

## Testing & Quality

This project includes a comprehensive CI/CD pipeline with automated testing and quality checks:

### Running Tests Locally

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### Quality Gates

- **Test Coverage**: 80% minimum threshold (branches, functions, lines, statements)
- **Linting**: ESLint enforced on all commits
- **Type Safety**: TypeScript strict mode checked on all PRs
- **Git Hooks**: Husky pre-commit hooks run tests and linting automatically

### Full CI/CD Setup

For detailed information about the CI/CD infrastructure, including:

- Jest configuration
- Husky pre-commit hooks
- GitHub Actions workflow
- Test best practices
- Coverage requirements

See the [CI/CD Setup Guide](./docs/CI_CD_SETUP.md).

### Troubleshooting Pre-commit Hooks

If you encounter issues with the pre-commit hooks (such as SIGKILL errors), refer to the [Pre-commit Hook Troubleshooting Guide](./docs/SIGKILL_FIX.md) for solutions.

## Deployed Version

You can view the latest deployed version of this application by checking the link under the "About" section on the [GitHub repository page](https://github.com).

## Project Structure

```
app/
├── dashboard/          # Dashboard pages and layouts
├── login/             # Login page
├── ui/                # Reusable UI components
├── lib/               # Utilities, data fetching, and type definitions
└── layout.tsx         # Root layout
```

## Learn More

For more information about this course and Next.js App Router, see the [Next.js Learn curriculum](https://nextjs.org/learn).

## License

This project is open source and available under the MIT License.
