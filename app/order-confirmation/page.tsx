import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const prisma = new PrismaClient();

async function getLatestOrder(userId: string) {
  const order = await prisma.order.findFirst({
    where: { userId, status: 'PROCESSING' },
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } } },
  });

  return order;
}

export default async function OrderConfirmationPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Unauthorized</div>;
  }

  const order = await getLatestOrder(session.user.id);

  if (!order) {
    return <div>No order found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Confirmation</h1>
      <p className="mb-4">Thank you for your order! Your order details are below:</p>
      <div className="bg-gray-100 p-4 rounded-lg mb-8">
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
      </div>
      <h2 className="text-2xl font-bold mb-4">Order Items</h2>
      <ul className="list-disc pl-5 mb-8">
        {order.items.map((item) => (
          <li key={item.id}>
            {item.product.name} - Quantity: {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
          </li>
        ))}
      </ul>
      <Link href="/">
        <Button>Return to Home</Button>
      </Link>
    </div>
  );
}