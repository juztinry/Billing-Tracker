export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bills: {
        Row: {
          id: string
          user_id: string
          name: string
          amount: number
          due_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          amount: number
          due_date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          amount?: number
          due_date?: string
          created_at?: string
        }
      }
      electricity_bills: {
        Row: {
          id: string
          user_id: string
          month: string
          previous_reading: number
          current_reading: number
          consumption: number
          rate: number
          amount: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          month: string
          previous_reading: number
          current_reading: number
          consumption: number
          rate: number
          amount: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          month?: string
          previous_reading?: number
          current_reading?: number
          consumption?: number
          rate?: number
          amount?: number
          created_at?: string
        }
      }
      water_bills: {
        Row: {
          id: string
          user_id: string
          month: string
          previous_reading: number
          current_reading: number
          consumption: number
          rate: number
          amount: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          month: string
          previous_reading: number
          current_reading: number
          consumption: number
          rate: number
          amount: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          month?: string
          previous_reading?: number
          current_reading?: number
          consumption?: number
          rate?: number
          amount?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserting<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updating<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
