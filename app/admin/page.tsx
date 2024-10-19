import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const prisma = new PrismaClient();

async function getAdminData() {
  const [productCount, orderCount, userCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
  ]);

  return { productCount, orderCount, userCount };
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return <div>Unauthorized</div>;
  }

  const { productCount, orderCount, userCount } = await getAdminData();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Products</h2>
          <p className="text-3xl font-bold">{productCount}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Orders</h2>
          <p className="text-3xl font-bold">{orderCount}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <p className="text-3xl font-bold">{userCount}</p>
        </div>
      </div>
      <div className="space-x-4">
        <Link href="/admin/products">
          <Button>Manage Products</Button>
        </Link>
        <Link href="/admin/orders">
          <Button>Manage Orders</Button>
        </Link>
        <Link href="/admin/users">
          <Button>Manage Users</Button>
        </Link>
      </div>
    </div>
  );
}