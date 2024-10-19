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
    const { productId, quantity } = await request.json();
    const userId = session.user.id;

    // Check if the product exists and has enough stock
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.stock < quantity) {
      return NextResponse.json({ error: 'Product not available' }, { status: 400 });
    }

    // Find or create an order for the user (cart)
    let order = await prisma.order.findFirst({
      where: { userId, status: 'PENDING' },
    });

    if (!order) {
      order = await prisma.order.create({
        data: { userId, total: 0, status: 'PENDING' },
      });
    }

    // Add or update the order item
    const orderItem = await prisma.orderItem.upsert({
      where: {
        orderId_productId: {
          orderId: order.id,
          productId,
        },
      },
      update: {
        quantity: { increment: quantity },
        price: product.price,
      },
      create: {
        orderId: order.id,
        productId,
        quantity,
        price: product.price,
      },
    });

    // Update the order total
    await prisma.order.update({
      where: { id: order.id },
      data: { total: { increment: product.price * quantity } },
    });

    return NextResponse.json({ message: 'Item added to cart' }, { status: 200 });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userId = session.user.id;

    const cart = await prisma.order.findFirst({
      where: { userId, status: 'PENDING' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(cart || { items: [] });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}