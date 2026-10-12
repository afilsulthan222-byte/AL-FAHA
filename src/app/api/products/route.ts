import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const collection = searchParams.get('collection');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');
    const featured = searchParams.get('featured');

    let products = db.getProducts();

    if (category && category !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (collection && collection !== 'All') {
      products = products.filter(p => p.collection.toLowerCase() === collection.toLowerCase());
    }

    if (featured === 'true') {
      products = products.filter(p => p.isFeatured);
    }

    if (search) {
      const q = search.toLowerCase().trim();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.arabicName.includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q)
      );
    }

    if (sort) {
      switch (sort) {
        case 'price_asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          products.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        default:
          break;
      }
    }

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Admin verification
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const user = token ? verifyToken(token) : null;

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json({ success: false, message: 'Missing required product fields.' }, { status: 400 });
    }

    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const product = db.createProduct({
      ...body,
      slug,
      rating: body.rating || 5.0,
      reviewsCount: body.reviewsCount || 0,
      images: body.images?.length ? body.images : ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop'],
      sizes: body.sizes?.length ? body.sizes : ['Standard (56)'],
      colors: body.colors?.length ? body.colors : [{ name: 'Royal Gold & Black', hex: '#D4AF37' }]
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to create product' }, { status: 500 });
  }
}
