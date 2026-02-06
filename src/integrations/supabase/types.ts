export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      api_keys: {
        Row: {
          api_key: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          last_usage_reset: string | null
          last_used_at: string | null
          name: string | null
          rate_limit_per_day: number | null
          usage_today: number | null
          user_id: string
        }
        Insert: {
          api_key: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_usage_reset?: string | null
          last_used_at?: string | null
          name?: string | null
          rate_limit_per_day?: number | null
          usage_today?: number | null
          user_id: string
        }
        Update: {
          api_key?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_usage_reset?: string | null
          last_used_at?: string | null
          name?: string | null
          rate_limit_per_day?: number | null
          usage_today?: number | null
          user_id?: string
        }
        Relationships: []
      }
      api_usage: {
        Row: {
          api_key_id: string
          created_at: string
          date: string
          endpoint: string
          id: string
          request_count: number
          user_id: string
        }
        Insert: {
          api_key_id: string
          created_at?: string
          date?: string
          endpoint?: string
          id?: string
          request_count?: number
          user_id: string
        }
        Update: {
          api_key_id?: string
          created_at?: string
          date?: string
          endpoint?: string
          id?: string
          request_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      ban_appeals: {
        Row: {
          admin_response: string | null
          created_at: string
          id: string
          reason: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          user_id: string
        }
        Insert: {
          admin_response?: string | null
          created_at?: string
          id?: string
          reason: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id: string
        }
        Update: {
          admin_response?: string | null
          created_at?: string
          id?: string
          reason?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_dm: boolean | null
          mentions: string[] | null
          recipient_id: string | null
          reply_to_id: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_dm?: boolean | null
          mentions?: string[] | null
          recipient_id?: string | null
          reply_to_id?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_dm?: boolean | null
          mentions?: string[] | null
          recipient_id?: string | null
          reply_to_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      email_verification_codes: {
        Row: {
          code: string
          created_at: string | null
          email: string
          expires_at: string
          id: string
          type: string
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          type?: string
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          type?: string
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      gift_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string
          credits: number
          current_uses: number | null
          expires_at: string | null
          id: string
          is_used: boolean | null
          max_uses: number | null
          subscription_duration: string | null
          subscription_type: string | null
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          code: string
          created_at?: string
          created_by: string
          credits: number
          current_uses?: number | null
          expires_at?: string | null
          id?: string
          is_used?: boolean | null
          max_uses?: number | null
          subscription_duration?: string | null
          subscription_type?: string | null
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string
          credits?: number
          current_uses?: number | null
          expires_at?: string | null
          id?: string
          is_used?: boolean | null
          max_uses?: number | null
          subscription_duration?: string | null
          subscription_type?: string | null
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      message_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_broadcast: boolean | null
          is_read: boolean | null
          message: string
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_broadcast?: boolean | null
          is_read?: boolean | null
          message: string
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_broadcast?: boolean | null
          is_read?: boolean | null
          message?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      obfuscation_history: {
        Row: {
          action: string
          created_at: string
          credits_used: number
          id: string
          language: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          credits_used: number
          id?: string
          language: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          credits_used?: number
          id?: string
          language?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_history: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          order_id: string | null
          payment_id: string | null
          payment_provider: string
          plan: string | null
          status: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          order_id?: string | null
          payment_id?: string | null
          payment_provider?: string
          plan?: string | null
          status?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          order_id?: string | null
          payment_id?: string | null
          payment_provider?: string
          plan?: string | null
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          ban_expires_at: string | null
          ban_reason: string | null
          ban_type: string | null
          bio: string | null
          created_at: string
          credits: number
          display_name: string | null
          email: string
          first_name: string | null
          free_trial_started_at: string | null
          free_trial_used: boolean | null
          id: string
          invite_code: string | null
          invited_by: string | null
          is_banned: boolean | null
          last_name: string | null
          storage_used: number
          subscription_expires_at: string | null
          subscription_type: Database["public"]["Enums"]["subscription_type"]
          suspended_until: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          ban_expires_at?: string | null
          ban_reason?: string | null
          ban_type?: string | null
          bio?: string | null
          created_at?: string
          credits?: number
          display_name?: string | null
          email: string
          first_name?: string | null
          free_trial_started_at?: string | null
          free_trial_used?: boolean | null
          id?: string
          invite_code?: string | null
          invited_by?: string | null
          is_banned?: boolean | null
          last_name?: string | null
          storage_used?: number
          subscription_expires_at?: string | null
          subscription_type?: Database["public"]["Enums"]["subscription_type"]
          suspended_until?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          ban_expires_at?: string | null
          ban_reason?: string | null
          ban_type?: string | null
          bio?: string | null
          created_at?: string
          credits?: number
          display_name?: string | null
          email?: string
          first_name?: string | null
          free_trial_started_at?: string | null
          free_trial_used?: boolean | null
          id?: string
          invite_code?: string | null
          invited_by?: string | null
          is_banned?: boolean | null
          last_name?: string | null
          storage_used?: number
          subscription_expires_at?: string | null
          subscription_type?: Database["public"]["Enums"]["subscription_type"]
          suspended_until?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      saved_files: {
        Row: {
          created_at: string
          file_content: string
          file_name: string
          id: string
          is_public: boolean | null
          language: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_content: string
          file_name: string
          id?: string
          is_public?: boolean | null
          language: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_content?: string
          file_name?: string
          id?: string
          is_public?: boolean | null
          language?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_zips: {
        Row: {
          action: string
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          id: string
          is_public: boolean | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number
          id?: string
          is_public?: boolean | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          is_public?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      site_analytics: {
        Row: {
          created_at: string
          date: string
          files_processed: number | null
          id: string
          logins: number | null
          new_signups: number | null
          page_visits: number | null
          unique_visitors: number | null
        }
        Insert: {
          created_at?: string
          date?: string
          files_processed?: number | null
          id?: string
          logins?: number | null
          new_signups?: number | null
          page_visits?: number | null
          unique_visitors?: number | null
        }
        Update: {
          created_at?: string
          date?: string
          files_processed?: number | null
          id?: string
          logins?: number | null
          new_signups?: number | null
          page_visits?: number | null
          unique_visitors?: number | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          binance_id: string | null
          chat_enabled: boolean | null
          credits_price_per_100: number | null
          deobfuscation_enabled: boolean | null
          discord_link: string | null
          email_verification_enabled: boolean | null
          gift_codes_enabled: boolean | null
          id: string
          instagram_link: string | null
          new_member_free_premium_days: number | null
          new_member_free_premium_enabled: boolean | null
          notification_default_expiry_days: number | null
          obfuscation_enabled: boolean | null
          paypal_client_id: string | null
          paypal_email: string | null
          price_lifetime: number | null
          price_month: number | null
          price_three_months: number | null
          price_week: number | null
          price_year: number | null
          recaptcha_enabled: boolean | null
          recaptcha_site_key: string | null
          referral_enabled: boolean | null
          require_email_verification: boolean | null
          telegram_link: string | null
          tiktok_link: string | null
          twitter_link: string | null
          updated_at: string
          whatsapp_link: string | null
          youtube_link: string | null
        }
        Insert: {
          binance_id?: string | null
          chat_enabled?: boolean | null
          credits_price_per_100?: number | null
          deobfuscation_enabled?: boolean | null
          discord_link?: string | null
          email_verification_enabled?: boolean | null
          gift_codes_enabled?: boolean | null
          id?: string
          instagram_link?: string | null
          new_member_free_premium_days?: number | null
          new_member_free_premium_enabled?: boolean | null
          notification_default_expiry_days?: number | null
          obfuscation_enabled?: boolean | null
          paypal_client_id?: string | null
          paypal_email?: string | null
          price_lifetime?: number | null
          price_month?: number | null
          price_three_months?: number | null
          price_week?: number | null
          price_year?: number | null
          recaptcha_enabled?: boolean | null
          recaptcha_site_key?: string | null
          referral_enabled?: boolean | null
          require_email_verification?: boolean | null
          telegram_link?: string | null
          tiktok_link?: string | null
          twitter_link?: string | null
          updated_at?: string
          whatsapp_link?: string | null
          youtube_link?: string | null
        }
        Update: {
          binance_id?: string | null
          chat_enabled?: boolean | null
          credits_price_per_100?: number | null
          deobfuscation_enabled?: boolean | null
          discord_link?: string | null
          email_verification_enabled?: boolean | null
          gift_codes_enabled?: boolean | null
          id?: string
          instagram_link?: string | null
          new_member_free_premium_days?: number | null
          new_member_free_premium_enabled?: boolean | null
          notification_default_expiry_days?: number | null
          obfuscation_enabled?: boolean | null
          paypal_client_id?: string | null
          paypal_email?: string | null
          price_lifetime?: number | null
          price_month?: number | null
          price_three_months?: number | null
          price_week?: number | null
          price_year?: number | null
          recaptcha_enabled?: boolean | null
          recaptcha_site_key?: string | null
          referral_enabled?: boolean | null
          require_email_verification?: boolean | null
          telegram_link?: string | null
          tiktok_link?: string | null
          twitter_link?: string | null
          updated_at?: string
          whatsapp_link?: string | null
          youtube_link?: string | null
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      user_reports: {
        Row: {
          created_at: string
          description: string | null
          id: string
          reason: string
          reported_user_id: string
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          reason: string
          reported_user_id: string
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          reason?: string
          reported_user_id?: string
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          can_add_admins: boolean | null
          can_add_credits: boolean | null
          can_ban_users: boolean | null
          can_manage_gift_codes: boolean | null
          can_manage_users: boolean | null
          can_send_notifications: boolean | null
          can_view_analytics: boolean | null
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          can_add_admins?: boolean | null
          can_add_credits?: boolean | null
          can_ban_users?: boolean | null
          can_manage_gift_codes?: boolean | null
          can_manage_users?: boolean | null
          can_send_notifications?: boolean | null
          can_view_analytics?: boolean | null
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          can_add_admins?: boolean | null
          can_add_credits?: boolean | null
          can_ban_users?: boolean | null
          can_manage_gift_codes?: boolean | null
          can_manage_users?: boolean | null
          can_send_notifications?: boolean | null
          can_view_analytics?: boolean | null
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_premium: { Args: { _user_id: string }; Returns: boolean }
      start_free_trial: { Args: { user_uuid: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
      subscription_type:
        | "free"
        | "week"
        | "month"
        | "three_months"
        | "year"
        | "lifetime"
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
    Enums: {
      app_role: ["admin", "user"],
      subscription_type: [
        "free",
        "week",
        "month",
        "three_months",
        "year",
        "lifetime",
      ],
    },
  },
} as const
