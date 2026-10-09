# Budget Management — Backend

Backend for a multi-tenant budgeting SaaS. Users join organizations, plan income
and expenses, and track what actually happened against the plan.

## Domain

- **Organizations**: shared workspaces with a base currency, invitations and per-member permissions
- **Transaction entities**: who money flows to or from (employer, retailer, utility, …)
- **Estimations**: planned income and expenses
- **Transactions**: actual income and expenses, optionally linked to an estimation
- **Documents**: file attachments such as receipts and avatars
- **Subscriptions**: paid plans billed through Stripe
- **Admins**: platform administrators with their own permissions

## Stack

NestJS · TypeORM · PostgreSQL · Stripe

## Running locally

```bash
pnpm install
cp .env.example .env
pnpm db:init
pnpm migration:run
pnpm start:dev
```
