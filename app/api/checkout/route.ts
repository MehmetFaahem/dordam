import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { shippingAddress, paymentMethod } = await request.json();
    const userId = session.user.id;

    // Find the user's pending order (cart)
    const order = await prisma.order.findFirst({
      where: { userId, status: 'PENDING' },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'No pending order found' }, { status: 400 });
    }

    // Update the order status and add shipping/payment info
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'PROCESSING',
        shippingAddress,
        paymentMethod,
      },
    });

    // Update product stock
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return NextResponse.json({ message: 'Order placed successfully', orderId: updatedOrder.id });
  } catch (error) {
    console.error('Error processing checkout:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}