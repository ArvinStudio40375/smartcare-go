export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_credentials: {
        Row: {
          created_at: string
          id: string
          password: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          password: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          password?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      chat: {
        Row: {
          from_id: string
          id: string
          message: string
          timestamp: string
          to_id: string
        }
        Insert: {
          from_id: string
          id?: string
          message: string
          timestamp?: string
          to_id: string
        }
        Update: {
          from_id?: string
          id?: string
          message?: string
          timestamp?: string
          to_id?: string
        }
        Relationships: []
      }
      invoice: {
        Row: {
          created_at: string
          file_url: string | null
          id: string
          mitra_id: string
          pesanan_id: string
          total: number
          updated_at: string
          waktu_mulai: string
          waktu_selesai: string | null
        }
        Insert: {
          created_at?: string
          file_url?: string | null
          id?: string
          mitra_id: string
          pesanan_id: string
          total: number
          updated_at?: string
          waktu_mulai: string
          waktu_selesai?: string | null
        }
        Update: {
          created_at?: string
          file_url?: string | null
          id?: string
          mitra_id?: string
          pesanan_id?: string
          total?: number
          updated_at?: string
          waktu_mulai?: string
          waktu_selesai?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_mitra_id_fkey"
            columns: ["mitra_id"]
            isOneToOne: false
            referencedRelation: "mitra"
            referencedColumns: ["id"]
          },
        ]
      }
      mitra: {
        Row: {
          created_at: string
          email: string
          id: string
          nama: string
          password: string
          role: string
          saldo: number
          status_verifikasi: string
          updated_at: string
          wa: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          nama: string
          password: string
          role?: string
          saldo?: number
          status_verifikasi?: string
          updated_at?: string
          wa: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nama?: string
          password?: string
          role?: string
          saldo?: number
          status_verifikasi?: string
          updated_at?: string
          wa?: string
        }
        Relationships: []
      }
      pesanan: {
        Row: {
          alamat: string
          created_at: string
          deskripsi: string
          id: string
          mitra_id: string | null
          status: string
          tarif: number
          updated_at: string
          user_id: string
          waktu_mulai: string | null
          waktu_pesan: string
          waktu_selesai: string | null
        }
        Insert: {
          alamat: string
          created_at?: string
          deskripsi: string
          id?: string
          mitra_id?: string | null
          status?: string
          tarif: number
          updated_at?: string
          user_id: string
          waktu_mulai?: string | null
          waktu_pesan?: string
          waktu_selesai?: string | null
        }
        Update: {
          alamat?: string
          created_at?: string
          deskripsi?: string
          id?: string
          mitra_id?: string | null
          status?: string
          tarif?: number
          updated_at?: string
          user_id?: string
          waktu_mulai?: string | null
          waktu_pesan?: string
          waktu_selesai?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pesanan_mitra_id_fkey"
            columns: ["mitra_id"]
            isOneToOne: false
            referencedRelation: "mitra"
            referencedColumns: ["id"]
          },
        ]
      }
      pesanan_smartcare: {
        Row: {
          alamat_layanan: string
          catatan: string | null
          created_at: string
          id: string
          metode_pembayaran: string
          mitra_id: string | null
          nama_layanan: string
          status: string
          tanggal: string
          total_harga: number
          updated_at: string
          user_id: string
        }
        Insert: {
          alamat_layanan: string
          catatan?: string | null
          created_at?: string
          id?: string
          metode_pembayaran: string
          mitra_id?: string | null
          nama_layanan: string
          status?: string
          tanggal: string
          total_harga: number
          updated_at?: string
          user_id: string
        }
        Update: {
          alamat_layanan?: string
          catatan?: string | null
          created_at?: string
          id?: string
          metode_pembayaran?: string
          mitra_id?: string | null
          nama_layanan?: string
          status?: string
          tanggal?: string
          total_harga?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pesanan_smartcare_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tagihan: {
        Row: {
          created_at: string
          id: string
          jenis_tagihan: string
          jumlah: number
          mitra_id: string
          status: string
          tanggal: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          jenis_tagihan: string
          jumlah: number
          mitra_id: string
          status?: string
          tanggal?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          jenis_tagihan?: string
          jumlah?: number
          mitra_id?: string
          status?: string
          tanggal?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tagihan_mitra_id_fkey"
            columns: ["mitra_id"]
            isOneToOne: false
            referencedRelation: "mitra"
            referencedColumns: ["id"]
          },
        ]
      }
      tagihan_smartcare: {
        Row: {
          id: string
          jumlah: number
          metode_pembayaran: string
          pesanan_id: string
          status_tagihan: string
          user_id: string
          waktu_buat: string
        }
        Insert: {
          id?: string
          jumlah: number
          metode_pembayaran: string
          pesanan_id: string
          status_tagihan?: string
          user_id: string
          waktu_buat?: string
        }
        Update: {
          id?: string
          jumlah?: number
          metode_pembayaran?: string
          pesanan_id?: string
          status_tagihan?: string
          user_id?: string
          waktu_buat?: string
        }
        Relationships: [
          {
            foreignKeyName: "tagihan_smartcare_pesanan_id_fkey"
            columns: ["pesanan_id"]
            isOneToOne: false
            referencedRelation: "pesanan_smartcare"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tagihan_smartcare_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      topup: {
        Row: {
          created_at: string
          id: string
          mitra_id: string
          nominal: number
          status: string
          updated_at: string
          wa: string
        }
        Insert: {
          created_at?: string
          id?: string
          mitra_id: string
          nominal: number
          status?: string
          updated_at?: string
          wa: string
        }
        Update: {
          created_at?: string
          id?: string
          mitra_id?: string
          nominal?: number
          status?: string
          updated_at?: string
          wa?: string
        }
        Relationships: [
          {
            foreignKeyName: "topup_mitra_id_fkey"
            columns: ["mitra_id"]
            isOneToOne: false
            referencedRelation: "mitra"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          alamat: string
          created_at: string
          email: string
          id: string
          nama_lengkap: string
          no_hp: string
          password: string
          role: string
          saldo: number
        }
        Insert: {
          alamat: string
          created_at?: string
          email: string
          id?: string
          nama_lengkap: string
          no_hp: string
          password: string
          role?: string
          saldo?: number
        }
        Update: {
          alamat?: string
          created_at?: string
          email?: string
          id?: string
          nama_lengkap?: string
          no_hp?: string
          password?: string
          role?: string
          saldo?: number
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
