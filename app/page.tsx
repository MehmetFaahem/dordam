import ProductList from '@/components/ProductList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to Our E-commerce Store</h1>
      <ProductList />
      <div className="mt-8">
        <Link href="/products">
          <Button>View All Products</Button>
        </Link>
      </div>
    </div>
  );
}