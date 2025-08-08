"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

type CategoryValue = "all" | "nike" | "adidas" | "puma";

const categories: { name: string; filter: CategoryValue }[] = [
  { name: "All", filter: "all" },
  { name: "Nike", filter: "nike" },
  { name: "Adidas", filter: "adidas" },
  { name: "PUMA", filter: "puma" },
];

type Product = {
  id: number;
  name: string;
  image: string;
  brand: Exclude<CategoryValue, "all">;
  price?: string;
};

// Replace image paths with your actual assets when available
const products: Product[] = [
  { id: 1, name: "Nike Cap", image: "/landing/banner.webp", brand: "nike", price: "$24" },
  { id: 2, name: "Adidas Jersey", image: "/landing/banner.webp", brand: "adidas", price: "$49" },
  { id: 3, name: "PUMA Cleats", image: "/landing/banner.webp", brand: "puma", price: "$89" },
  { id: 4, name: "Nike Shorts", image: "/landing/banner.webp", brand: "nike", price: "$39" },
  { id: 5, name: "Adidas Hoodie", image: "/landing/banner.webp", brand: "adidas", price: "$69" },
  { id: 6, name: "PUMA Bag", image: "/landing/banner.webp", brand: "puma", price: "$59" },
  { id: 7, name: "Nike Socks", image: "/landing/banner.webp", brand: "nike", price: "$12" },
  { id: 8, name: "Adidas Tracks", image: "/landing/banner.webp", brand: "adidas", price: "$79" },
];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState<CategoryValue>("all");

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.brand === activeCategory);
  }, [activeCategory]);

  return (
    <section id="shop_section" className="py-12 md:py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Shop Products</h2>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 md:gap-3 mb-8">
          {categories.map((c) => (
            <Button
              key={c.filter}
              onClick={() => setActiveCategory(c.filter)}
              variant={activeCategory === c.filter ? "default" : "outline"}
              className="h-9 rounded-full"
            >
              {c.name}
            </Button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="group relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 hover:shadow-lg transition-shadow"
            >
              <div className="relative h-44 sm:h-56 lg:h-64">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority={p.id <= 4}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/10 text-white border border-white/20">
                    {p.brand.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold text-sm line-clamp-1">{p.name}</h3>
                  {p.price && <p className="text-xs text-gray-400 mt-0.5">{p.price}</p>}
                </div>
                <Button size="sm" className="rounded-full h-8 px-3 text-xs">Shop now</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


