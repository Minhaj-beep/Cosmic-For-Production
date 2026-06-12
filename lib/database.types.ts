export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          id: string;
          name: string;
          role: 'admin' | 'editor';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['admin_profiles']['Row'], 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['admin_profiles']['Insert']>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          status: 'active' | 'inactive';
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          name: string;
          sku: string;
          category_id: string | null;
          subcategory: string;
          price: number;
          offer_price: number | null;
          stock: 'in_stock' | 'low_stock' | 'out_of_stock';
          status: 'published' | 'draft';
          featured: boolean;
          new_arrival: boolean;
          bestseller: boolean;
          description: string;
          specs: Json;
          images: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          size: string;
          color: string;
          stock_qty: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['product_variants']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Database['public']['Tables']['product_variants']['Insert']>;
      };
      product_categories: {
        Row: {
          product_id: string;
          category_id: string;
        };
        Insert: {
          product_id: string;
          category_id: string;
        };
        Update: Partial<Database['public']['Tables']['product_categories']['Insert']>;
      };
      accessories: {
        Row: {
          id: string;
          name: string;
          sku: string;
          category: string;
          price: number;
          stock_qty: number;
          status: 'published' | 'draft';
          image: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['accessories']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['accessories']['Insert']>;
      };
      spare_parts: {
        Row: {
          id: string;
          name: string;
          sku: string;
          category: string;
          price: number;
          stock_qty: number;
          compatibility: string;
          status: 'published' | 'draft';
          image: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['spare_parts']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['spare_parts']['Insert']>;
      };
      dealer_enquiries: {
        Row: {
          id: string;
          name: string;
          company: string;
          email: string;
          phone: string;
          city: string;
          state: string;
          message: string;
          status: 'new' | 'in_progress' | 'resolved';
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['dealer_enquiries']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['dealer_enquiries']['Insert']>;
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          subject: string;
          message: string;
          status: 'new' | 'read' | 'replied';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contact_submissions']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Database['public']['Tables']['contact_submissions']['Insert']>;
      };
      vacancies: {
        Row: {
          id: string;
          title: string;
          department: string;
          location: string;
          experience: string;
          type: 'full_time' | 'part_time' | 'contract';
          description: string;
          requirements: string[];
          status: 'active' | 'closed' | 'draft';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['vacancies']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['vacancies']['Insert']>;
      };
      applications: {
        Row: {
          id: string;
          vacancy_id: string | null;
          name: string;
          email: string;
          phone: string;
          experience: string;
          cover_letter: string;
          resume_url: string;
          status: 'new' | 'shortlisted' | 'interviewed' | 'rejected' | 'hired';
          notes: string;
          applied_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['applications']['Row'], 'id' | 'applied_at' | 'updated_at'> & { id?: string; applied_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['applications']['Insert']>;
      };
      dealers: {
        Row: {
          id: string;
          name: string;
          address: string;
          city: string;
          state: string;
          pincode: string;
          phone: string;
          email: string;
          type: 'dealer' | 'service_center' | 'flagship';
          status: 'active' | 'inactive';
          latitude: number | null;
          longitude: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['dealers']['Row'], 'id' | 'created_at' | 'updated_at' | 'latitude' | 'longitude'> & { id?: string; created_at?: string; updated_at?: string; latitude?: number | null; longitude?: number | null };
        Update: Partial<Database['public']['Tables']['dealers']['Insert']>;
      };
      seo_metadata: {
        Row: {
          id: string;
          page: string;
          route: string;
          title: string;
          description: string;
          keywords: string;
          og_image: string;
          last_updated: string;
        };
        Insert: Omit<Database['public']['Tables']['seo_metadata']['Row'], 'id' | 'last_updated'> & { id?: string; last_updated?: string };
        Update: Partial<Database['public']['Tables']['seo_metadata']['Insert']>;
      };
      media_library: {
        Row: {
          id: string;
          name: string;
          url: string;
          storage_path: string;
          type: 'image' | 'video' | 'document';
          size_bytes: number;
          width: number | null;
          height: number | null;
          used_in: string[];
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['media_library']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Database['public']['Tables']['media_library']['Insert']>;
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['site_settings']['Row'], 'id' | 'updated_at'> & { id?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['site_settings']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
