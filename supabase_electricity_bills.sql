-- Create the electricity_bills table
CREATE TABLE IF NOT EXISTS public.electricity_bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    previous_reading NUMERIC NOT NULL,
    current_reading NUMERIC NOT NULL,
    consumption NUMERIC NOT NULL,
    rate NUMERIC NOT NULL,
    amount NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.electricity_bills ENABLE ROW LEVEL SECURITY;

-- Create policy for users to select their own electricity bills
CREATE POLICY select_own_electricity_bills ON public.electricity_bills
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy for users to insert their own electricity bills
CREATE POLICY insert_own_electricity_bills ON public.electricity_bills
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own electricity bills
CREATE POLICY update_own_electricity_bills ON public.electricity_bills
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for users to delete their own electricity bills
CREATE POLICY delete_own_electricity_bills ON public.electricity_bills
    FOR DELETE USING (auth.uid() = user_id);

-- Create an index on user_id for better query performance
CREATE INDEX electricity_bills_user_id_idx ON public.electricity_bills(user_id);

-- Create an index on month for better sorting performance
CREATE INDEX electricity_bills_month_idx ON public.electricity_bills(month); 