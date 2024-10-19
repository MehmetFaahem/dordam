"use client";

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-background shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          E-commerce Store
        </Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <Link href="/products">Products</Link>
            </li>
            <li>
              <Link href="/cart">
                <ShoppingCart className="w-6 h-6" />
              </Link>
            </li>
            {session ? (
              <>
                <li>
                  <Link href="/profile">
                    <User className="w-6 h-6" />
                  </Link>
                </li>
                <li>
                  <Button onClick={() => signOut()}>Sign Out</Button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/auth/signin">
                  <Button>Sign In</Button>
                </Link>
              </li>
            )}
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}