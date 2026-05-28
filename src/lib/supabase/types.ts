export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type GenericRecord = Record<string, unknown>;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          display_name: string;
          headline: string | null;
          university: string | null;
          major: string | null;
          location: string | null;
          github_url: string | null;
          linkedin_url: string | null;
          portfolio_url: string | null;
          bio: string | null;
          is_email_verified: boolean;
          is_github_verified: boolean;
          created_at: string;
          updated_at: string;
        } & GenericRecord;
        Insert: {
          id?: string;
          user_id: string;
          display_name: string;
          headline?: string | null;
          university?: string | null;
          major?: string | null;
          location?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          portfolio_url?: string | null;
          bio?: string | null;
          is_email_verified?: boolean;
          is_github_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        } & GenericRecord;
        Update: {
          id?: string;
          user_id?: string;
          display_name?: string;
          headline?: string | null;
          university?: string | null;
          major?: string | null;
          location?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          portfolio_url?: string | null;
          bio?: string | null;
          is_email_verified?: boolean;
          is_github_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        } & GenericRecord;
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          user_id: string;
          file_name: string;
          file_type: string;
          file_size: number;
          storage_path: string;
          sha256_hash: string;
          visibility: string;
          created_at: string;
        } & GenericRecord;
        Insert: {
          id?: string;
          user_id: string;
          file_name: string;
          file_type: string;
          file_size: number;
          storage_path: string;
          sha256_hash: string;
          visibility?: string;
          created_at?: string;
        } & GenericRecord;
        Update: {
          id?: string;
          user_id?: string;
          file_name?: string;
          file_type?: string;
          file_size?: number;
          storage_path?: string;
          sha256_hash?: string;
          visibility?: string;
          created_at?: string;
        } & GenericRecord;
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Json;
          created_at: string;
        } & GenericRecord;
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        } & GenericRecord;
        Update: {
          id?: string;
          user_id?: string;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        } & GenericRecord;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
