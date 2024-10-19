"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function AddToCartButton({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const addToCart = async () => {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, quantity }),
    });

    if (response.ok) {
      toast({
        title: "Added to cart",
        description: `${quantity} ${product.name} added to your cart.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="number"
        min="1"
        max={product.stock}
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        className="w-16 p-2 border rounded"
      />
      <Button onClick={addToCart}>Add to Cart</Button>
    </div>
  );
}