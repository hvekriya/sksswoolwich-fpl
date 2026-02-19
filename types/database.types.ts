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
      players: {
        Row: {
          id: string
          name: string
          position: string
          number: number | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          position: string
          number?: number | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          position?: string
          number?: number | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      weeks: {
        Row: {
          id: string
          label: string
          date: string
          created_at: string
        }
        Insert: { id?: string; label: string; date: string; created_at?: string }
        Update: { id?: string; label?: string; date?: string; created_at?: string }
      }
      performances: {
        Row: {
          id: string
          week_id: string
          player_id: string
          goals: number
          assists: number
          saves: number
          is_mvp: boolean
        }
        Insert: {
          id?: string
          week_id: string
          player_id: string
          goals?: number
          assists?: number
          saves?: number
          is_mvp?: boolean
        }
        Update: {
          week_id?: string
          player_id?: string
          goals?: number
          assists?: number
          saves?: number
          is_mvp?: boolean
        }
      }
    }
  }
}
