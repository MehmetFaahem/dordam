export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AuthOptions, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

async function getProducts() {
  return await prisma.product.findMany();
}

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions as AuthOptions);

  if (!session || session?.user?.role !== "ADMIN") {
    console.log(session);
    return <div>Unauthorized</div>;
  }

  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Products</h1>
      <Link href="/admin/products/new">
        <Button className="mb-4">Add New Product</Button>
      </Link>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <Link href={`/admin/products/${product.id}`}>
                  <Button variant="outline" className="mr-2">
                    Edit
                  </Button>
                </Link>
                <Button variant="destructive">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
