
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const brands = [
    { name: "Seiko", slug: "seiko" },
    { name: "Orient", slug: "orient" },
    { name: "Citizen", slug: "citizen" },
    { name: "Casio", slug: "casio" },
    { name: "Timex", slug: "timex" },
    { name: "Bulova", slug: "bulova" },
    { name: "Tissot", slug: "tissot" },
    { name: "Hamilton", slug: "hamilton" }
];

const categories = [
    { name: "Automatic", slug: "automatic", description: "Mechanical watches that wind themselves via wrist motion." },
    { name: "Quartz", slug: "quartz", description: "Battery-powered watches with extreme accuracy." },
    { name: "Eco-Drive", slug: "eco-drive", description: "Light-powered quartz technology by Citizen." },
    { name: "Dress", slug: "dress", description: "Elegant timepieces for formal occasions." }
];

const productsData = [
    // SEIKO
    { name: "Seiko 5 SNXS79", brand: "Seiko", category: "Automatic", price: 18500, condition: "New", movement: "Automatic", case_size: "37mm", description: "The legendary 'Baby Datejust' alternative. Sunburst grey dial and classic Seiko 5 reliability.", featured: true },
    { name: "Seiko 5 SNK809", brand: "Seiko", category: "Automatic", price: 15500, condition: "New", movement: "Automatic", case_size: "37mm", description: "The ultimate field watch. Flieger-style dial and matte finished case.", featured: false },
    { name: "Seiko Essentials Quartz", brand: "Seiko", category: "Quartz", price: 11000, condition: "New", movement: "Quartz", case_size: "38mm", description: "A clean, minimalist dress watch for everyday wear.", featured: false },

    // ORIENT
    { name: "Orient Bambino Version 2", brand: "Orient", category: "Automatic", price: 21500, condition: "New", movement: "Automatic", case_size: "40.5mm", description: "The gold standard of affordable dress watches. Domed crystal and cream dial.", featured: true },
    { name: "Orient Symphony IV", brand: "Orient", category: "Automatic", price: 19500, condition: "New", movement: "Automatic", case_size: "41mm", description: "A modern automatic dress watch with a flat sapphire crystal.", featured: false },

    // CITIZEN
    { name: "Citizen Eco-Drive Corso", brand: "Citizen", category: "Eco-Drive", price: 22000, condition: "New", movement: "Quartz", case_size: "40mm", description: "Never needs a battery. Powered by light. Elegant black dial with gold accents.", featured: true },
    { name: "Citizen Heritage Quartz", brand: "Citizen", category: "Quartz", price: 13500, condition: "New", movement: "Quartz", case_size: "38mm", description: "Classic retro styling from Citizen's quartz archives.", featured: false },

    // CASIO
    { name: "Casio MTP-VD01 Blue Dial", brand: "Casio", category: "Quartz", price: 6500, condition: "New", movement: "Quartz", case_size: "42mm", description: "Dive-style design with a stunning sunray blue dial.", featured: false },
    { name: "Casio Edifice EFR-S108D", brand: "Casio", category: "Quartz", price: 17500, condition: "New", movement: "Quartz", case_size: "39mm", description: "Super slim 'Royal Oak' style with sapphire crystal.", featured: true },
    { name: "Casio Vintage MQ-24", brand: "Casio", category: "Quartz", price: 3500, condition: "New", movement: "Quartz", case_size: "35mm", description: "The ultimate minimalist icon. Comfortable, light, and perfectly sized.", featured: false },

    // SELECTIVE
    { name: "Timex Marlin Hand-Wind", brand: "Timex", category: "Dress", price: 24500, condition: "New", movement: "Manual", case_size: "34mm", description: "A faithful re-issue of the 1960s classic. Beautifully refined.", featured: false },
    { name: "Bulova Classic Quartz", brand: "Bulova", category: "Quartz", price: 18000, condition: "New", movement: "Quartz", case_size: "40mm", description: "Timeless American design with precision quartz movement.", featured: false },
    { name: "Tissot Everytime Quartz", brand: "Tissot", category: "Quartz", price: 24500, condition: "New", movement: "Quartz", case_size: "40mm", description: "Swiss Made quality with a minimalist Bauhaus-inspired dial.", featured: true },
    { name: "Hamilton Jazzmaster Quartz", brand: "Hamilton", category: "Quartz", price: 26000, condition: "Excellent", movement: "Quartz", case_size: "38mm", description: "Elegant Swiss-made timepiece with refined craftsmanship.", featured: false }
];

async function seed() {
    console.log("🚀 Starting data dump...");

    // 1. Seed Categories
    console.log("--- Seeding Categories ---");
    const { data: catData, error: catError } = await supabase.from('categories').upsert(categories, { onConflict: 'slug' }).select();
    if (catError) console.error("Error categories:", catError);

    // 2. Seed Brands
    console.log("--- Seeding Brands ---");
    const { data: brandData, error: brandError } = await supabase.from('brands').upsert(brands, { onConflict: 'slug' }).select();
    if (brandError) console.error("Error brands:", brandError);

    // 3. Clear existing products if needed (Optional, user asked for "dump" which might mean refresh)
    // For safety, we just insert.

    // 4. Seed Products
    console.log("--- Seeding Products ---");
    for (const p of productsData) {
        const brandId = brandData?.find(b => b.name === p.brand)?.id;
        const categoryId = catData?.find(c => c.name === p.category)?.id;

        if (!brandId || !categoryId) {
            console.error(`Skipping ${p.name}: Brand or Category not found`);
            continue;
        }

        const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.random().toString(36).substr(2, 4);

        const { data: products, error: prodError } = await supabase.from('products').insert([{
            name: p.name,
            slug: slug,
            description: p.description,
            brand_id: brandId,
            category_id: categoryId,
            price: p.price,
            condition: p.condition,
            movement: p.movement,
            case_size: p.case_size,
            featured: p.featured,
            status: 'active',
            stock_quantity: Math.floor(Math.random() * 5) + 1
        }]).select().single();

        if (prodError) {
            console.error(`Error product ${p.name}:`, prodError);
        } else {
            console.log(`✅ Added: ${p.name}`);

            // Add a placeholder image
            await supabase.from('product_images').insert({
                product_id: products.id,
                image_url: `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400&h=400&query=${encodeURIComponent(p.name)}`,
                display_order: 0
            });
        }
    }

    console.log("✨ Data dump complete!");
}

seed();
