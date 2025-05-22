-- Create the water_bills table
CREATE TABLE IF NOT EXISTS public.water_bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    previous_reading NUMERIC NOT NULL,
    current_reading NUMERIC NOT NULL,
    consumption NUMERIC NOT NULL,
    rate NUMERIC NOT NULL,
    amount NUMERIC NOT NULL,
    is_paid BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.water_bills ENABLE ROW LEVEL SECURITY;

-- Create policy for users to select their own water bills
CREATE POLICY select_own_water_bills ON public.water_bills
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy for users to insert their own water bills
CREATE POLICY insert_own_water_bills ON public.water_bills
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own water bills
CREATE POLICY update_own_water_bills ON public.water_bills
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for users to delete their own water bills
CREATE POLICY delete_own_water_bills ON public.water_bills
    FOR DELETE USING (auth.uid() = user_id);

-- Create an index on user_id for better query performance
CREATE INDEX water_bills_user_id_idx ON public.water_bills(user_id);

-- Create an index on month for better sorting performance
CREATE INDEX water_bills_month_idx ON public.water_bills(month); 