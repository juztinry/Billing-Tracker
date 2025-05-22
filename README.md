# Billing Tracker Application

A Next.js application to track bills and expenses with authentication using Supabase.

## Technologies Used

- Frontend: React.js
- Backend: Next.js
- Database: Supabase

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn
- Supabase account

### Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```

3. Create a Supabase project at [https://supabase.com](https://supabase.com)

4. Create a new table in Supabase called `bills` with the following columns:
   - `id` (uuid, primary key)
   - `user_id` (uuid, not null) - References auth.users
   - `name` (text, not null)
   - `amount` (numeric, not null)
   - `due_date` (date, not null)
   - `created_at` (timestamp with timezone, default: now())

5. Set up Row Level Security (RLS) for the `bills` table:
   - Enable RLS on the table
   - Add a policy for SELECT, INSERT, DELETE with using expression:
     ```sql
     (auth.uid() = user_id)
     ```

6. Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

7. Run the development server:
   ```
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- User authentication (login/register)
- Protected dashboard
- Add, view, and delete bills
- Track bill amounts and due dates

## License

MIT 