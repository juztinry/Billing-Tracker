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
        Relationships: [
          {
            foreignKeyName: "electricity_bills_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
          is_paid: boolean
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
          is_paid?: boolean
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
          is_paid?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "water_bills_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Row: infer R
    }
      ? R
      : never)
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
  ? (Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Row: infer R
    }
      ? R
      : never)
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
      ? I
      : never)
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
  ? (Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
      ? I
      : never)
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
      ? U
      : never)
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
  ? (Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
      ? U
      : never)
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof (Database["public"]["Enums"])
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicEnumNameOrOptions["schema"]]["Enums"])
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof (Database["public"]["Enums"])
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
