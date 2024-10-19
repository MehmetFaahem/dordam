import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";

const prisma = new PrismaClient();

async function getProducts(search: string = "") {
  return await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    },
  });
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const search = searchParams.q || "";
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
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            legacyBehavior
          >
            <a>
              <ProductCard product={product} />
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
