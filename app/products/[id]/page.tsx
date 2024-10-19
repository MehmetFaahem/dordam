import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";

const prisma = new PrismaClient();

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  return product;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  return { title: product.name, description: product.description };
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            className="w-full h-auto"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl font-semibold mb-4">
            ${product.price.toFixed(2)}
          </p>
          <p className="mb-4">{product.description}</p>
          <p className="mb-4">In stock: {product.stock}</p>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
