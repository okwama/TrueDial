
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
            brands: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    logo_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    logo_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    logo_url?: string | null
                    created_at?: string
                }
            }
            categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    created_at?: string
                }
            }
            products: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    name: string
                    slug: string
                    description: string | null
                    brand_id: string | null
                    category_id: string | null
                    price: number
                    compare_at_price: number | null
                    stock_quantity: number
                    status: 'active' | 'draft' | 'archived' | 'sold'
                    condition: 'New' | 'Excellent' | 'Very Good' | 'Good' | 'Fair'
                    movement: 'Automatic' | 'Quartz' | 'Manual' | 'Solar'
                    case_size: string | null
                    water_resistance: string | null
                    featured: boolean
                    // Legacy/Compatibility field (virtual)
                    image?: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    name: string
                    slug: string
                    description?: string | null
                    brand_id?: string | null
                    category_id?: string | null
                    price: number
                    compare_at_price?: number | null
                    stock_quantity?: number
                    status?: 'active' | 'draft' | 'archived' | 'sold'
                    condition?: 'New' | 'Excellent' | 'Very Good' | 'Good' | 'Fair'
                    movement?: 'Automatic' | 'Quartz' | 'Manual' | 'Solar'
                    case_size?: string | null
                    water_resistance?: string | null
                    featured?: boolean
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    brand_id?: string | null
                    category_id?: string | null
                    price?: number
                    compare_at_price?: number | null
                    stock_quantity?: number
                    status?: 'active' | 'draft' | 'archived' | 'sold'
                    condition?: 'New' | 'Excellent' | 'Very Good' | 'Good' | 'Fair'
                    movement?: 'Automatic' | 'Quartz' | 'Manual' | 'Solar'
                    case_size?: string | null
                    water_resistance?: string | null
                    featured?: boolean
                }
            }
            product_images: {
                Row: {
                    id: string
                    product_id: string
                    image_url: string
                    display_order: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    product_id: string
                    image_url: string
                    display_order?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    product_id?: string
                    image_url?: string
                    display_order?: number
                    created_at?: string
                }
            }
        }
    }
}
