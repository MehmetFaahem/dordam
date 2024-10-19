"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

export default function NewProductPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');

  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        price: parseFloat(price),
        image,
        category,
        stock: parseInt(stock),
      }),
    });

    if (response.ok) {
      toast({
        title: "Product created",
        description: "The product has been added successfully.",
      });
      router.push('/admin/products');
    } else {
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Create Product</Button>
      </form>
    </div>
  );
}
</boltArtifact>

Now that we have implemented user registration, individual product pages, shopping cart functionality, checkout process, and basic admin panel, our e-commerce website is taking shape. Here's a summary of what we've added:

1. User registration page and API route
2. Individual product pages with "Add to Cart" functionality
3. Shopping cart page with the ability to update quantities and remove items
4. Checkout page and API route for processing orders
5. Order confirmation page
6. Admin dashboard with product management

To further improve our e-commerce website, we should consider the following steps:

1. Implement server-side rendering for product pages to improve SEO
2. Add more robust error handling and input validation
3. Implement a search functionality for products
4. Add pagination for product listings
5. Implement a review system for products
6. Add more advanced admin features like order management and user management
7. Implement email notifications for order status updates
8. Add a wishlist feature for users
9. Implement product variants (e.g., sizes, colors)
10. Add a recommendation system based on user browsing and purchase history

Let's implement server-side rendering for product pages and add a search functionality:

<boltArtifact id="ssr-and-search" title="Server-side Rendering and Search Functionality">
<boltAction type="file" filePath="app/products/page.tsx">
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';

const prisma = new PrismaClient();

async function getProducts(search: string = '') {
  return await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    },
  });
}

export default async function ProductsPage({ searchParams }) {
  const search = searchParams.q || '';
  const products = await getProducts(search);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="mb-8">
        <form>
          <Input
            type="text"
            name="q"
            placeholder="Search products..."
            defaultValue={search}
          />
        </form>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </div>
  );
}