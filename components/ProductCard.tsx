import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProductCard({ product }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Image src={product.image} alt={product.name} width={300} height={300} className="w-full h-48 object-cover mb-4" />
        <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
        <p className="text-sm text-gray-600">{product.description}</p>
      </CardContent>
      <CardFooter>
        <Link href={`/products/${product.id}`}>
          <Button>View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}