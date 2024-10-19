"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CartItem {
  product: { id: string; name: string; price: number };
  quantity: number;
}

interface Cart {
  items: CartItem[];
  total: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const response = await fetch("/api/cart");
    if (response.ok) {
      const data = await response.json();
      setCart(data);
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    const response = await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: newQuantity }),
    });

    if (response.ok) {
      fetchCart();
    }
  };

  const removeItem = async (productId: string) => {
    const response = await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    if (response.ok) {
      fetchCart();
    }
  };

  const proceedToCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.items.map((item: any) => (
                <TableRow key={item.product.id}>
                  <TableCell>{item.product.name}</TableCell>
                  <TableCell>${item.product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          item.product.id,
                          parseInt(e.target.value)
                        )
                      }
                      className="w-16 p-1 border rounded"
                    />
                  </TableCell>
                  <TableCell>
                    ${(item.quantity * item.product.price).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => removeItem(item.product.id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-8 flex justify-between items-center">
            <p className="text-xl font-semibold">
              Total: ${cart.total.toFixed(2)}
            </p>
            <Button onClick={proceedToCheckout}>Proceed to Checkout</Button>
          </div>
        </>
      )}
      <div className="mt-8">
        <Link href="/products">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
