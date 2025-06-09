-- Database setup script for Billing Tracker
-- Run this in your Supabase SQL editor

-- Create water_bills table
CREATE TABLE IF NOT EXISTS public.water_bills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    month TEXT NOT NULL,
    previous_reading NUMERIC NOT NULL DEFAULT 0,
    current_reading NUMERIC NOT NULL DEFAULT 0,
    consumption NUMERIC NOT NULL DEFAULT 0,
    rate NUMERIC NOT NULL DEFAULT 0,
    amount NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create electricity_bills table
CREATE TABLE IF NOT EXISTS public.electricity_bills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    month TEXT NOT NULL,
    previous_reading NUMERIC NOT NULL DEFAULT 0,
    current_reading NUMERIC NOT NULL DEFAULT 0,
    consumption NUMERIC NOT NULL DEFAULT 0,
    rate NUMERIC NOT NULL DEFAULT 0,
    amount NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.water_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.electricity_bills ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for water_bills
CREATE POLICY "Users can view their own water bills" ON public.water_bills
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own water bills" ON public.water_bills
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own water bills" ON public.water_bills
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own water bills" ON public.water_bills
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for electricity_bills
CREATE POLICY "Users can view their own electricity bills" ON public.electricity_bills
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own electricity bills" ON public.electricity_bills
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own electricity bills" ON public.electricity_bills
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own electricity bills" ON public.electricity_bills
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_water_bills_user_id ON public.water_bills(user_id);
CREATE INDEX IF NOT EXISTS idx_water_bills_month ON public.water_bills(month);
CREATE INDEX IF NOT EXISTS idx_electricity_bills_user_id ON public.electricity_bills(user_id);
CREATE INDEX IF NOT EXISTS idx_electricity_bills_month ON public.electricity_bills(month);
