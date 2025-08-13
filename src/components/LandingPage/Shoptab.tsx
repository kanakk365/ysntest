"use client"

import React from 'react'
import Image from 'next/image'

const ShopTab = () => {


    const products = [
        {
            id: 1,
            title: "Stylish Hoodie",
            description: "Comfortable and warm hoodie",
            price: 165,
            priceCents: 99,
            rating: 4.5,
            image: "/assets/shop7.webp",
            isFavorite: true,
        },
        {
            id: 2,
            title: "Running Shoes",
            description: "Lightweight and durable shoes",
            price: 89,
            priceCents: 50,
            rating: 3.5,
            image: "/assets/shop8.webp",
            isFavorite: false,
        },
        {
            id: 3,
            title: "Back Bag",
            description: "Lightweight and durable bag",
            price: 120,
            priceCents: 0,
            rating: 5,
            image: "/assets/shop9.webp",
            isFavorite: true,
        },
    ];

  return (
    <div className='space-y-3 h-full overflow-y-auto'>
      {products.map((product) => (
        <div key={product.id} className='flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-3'>
          <div className='relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0'>
            <Image src={product.image} alt={product.title} fill className='object-cover' />
          </div>
          <div className='flex-1'>
            <div className='flex items-center justify-between'>
              <p className='text-sm font-medium'>{product.title}</p>
              <span className='text-sm'>${product.price}.{String(product.priceCents).padStart(2,'0')}</span>
            </div>
            <p className='text-xs text-muted-foreground'>{product.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ShopTab