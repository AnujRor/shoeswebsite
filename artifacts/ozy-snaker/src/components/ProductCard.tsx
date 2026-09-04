import { Product } from "@workspace/api-client-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
  imageFallback?: string;
}

export function ProductCard({ product, className, imageFallback }: ProductCardProps) {
  const imageUrl = product.imageUrl || imageFallback;

  return (
    <Link href={`/products/${product.id}`} className={cn("group block w-full", className)}>
      <div className="relative bg-secondary/30 aspect-square overflow-hidden mb-4 border border-transparent group-hover:border-primary transition-colors">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.isNewArrival && (
            <span className="bg-primary text-primary-foreground text-xs font-bold uppercase px-2 py-1 tracking-wider">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-accent text-accent-foreground text-xs font-bold uppercase px-2 py-1 tracking-wider">
              Hot
            </span>
          )}
        </div>
        
        {/* Image */}
        <div className="w-full h-full p-6 flex items-center justify-center relative">
          <img 
            src={imageUrl} 
            alt={`${product.name} - ${product.category} shoes at Ozy Sneakers Pundri Kaithal`}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-xl"
            loading="lazy"
          />
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <h3 className="font-display font-bold uppercase text-lg tracking-tight leading-tight group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <span className="font-mono font-bold text-base whitespace-nowrap">
            ${product.price.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">
            {product.category}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-muted-foreground text-sm line-through font-mono">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
