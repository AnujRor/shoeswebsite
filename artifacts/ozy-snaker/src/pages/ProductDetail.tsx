import { useState } from "react";
import { Link } from "wouter";
import { useGetProduct, useAddToCart } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";

import product1 from "@assets/generated_images/product-1.png";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: product, isLoading, error } = useGetProduct(Number(id));
  const addToCart = useAddToCart();
  const { toast } = useToast();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-display font-bold uppercase mb-4">Product Not Found</h2>
        <Link href="/products" className="text-accent font-bold hover:underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Size required",
        description: "Please select a size before adding to cart.",
        variant: "destructive"
      });
      return;
    }

    addToCart.mutate(
      { 
        data: {
          productId: product.id,
          size: selectedSize,
          color: selectedColor || product.colors?.[0],
          quantity
        }
      },
      {
        onSuccess: () => {
          toast({
            title: "Added to cart",
            description: `${product.name} has been added to your cart.`,
          });
        }
      }
    );
  };

  const imageUrl = product.imageUrl || product1;

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-16">
      {/* SEO */}
      <Helmet>
        <title>{product.name} | Ozy Sneakers Pundri Kaithal</title>
        <meta name="title" content={`${product.name} | Ozy Sneakers Pundri Kaithal`} />
        <meta name="description" content={`${product.name} at Ozy Sneakers Pundri Kaithal - genuine quality ${product.category} shoes. Visit our shoe shop in Pundri, Kaithal, Haryana.`} />
        <meta name="keywords" content={`${product.name}, ${product.category} shoes, shoe shop Pundri Kaithal, Ozy Sneakers`} />
      </Helmet>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/products" className="hover:text-primary transition-colors">Shop</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-primary truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* Images */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          <div className="bg-secondary/30 aspect-square flex items-center justify-center p-8 relative border border-transparent hover:border-border transition-colors">
            {product.isNewArrival && (
              <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold uppercase px-3 py-1.5 tracking-wider z-10">
                New Drop
              </span>
            )}
            <img 
              src={imageUrl} 
              alt={`${product.name} - ${product.category} shoes at Ozy Sneakers Pundri Kaithal`}
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-secondary/30 aspect-square p-2 border-2 border-primary cursor-pointer">
                <img src={imageUrl} alt={`${product.name} view at Ozy Sneakers Pundri Kaithal`} className="w-full h-full object-contain" />
              </div>
              {product.images.slice(0,3).map((img, i) => (
                <div key={i} className="bg-secondary/30 aspect-square p-2 border border-transparent hover:border-border cursor-pointer transition-colors">
                  <img src={img} alt={`${product.name} - extra view ${i + 2} at Ozy Sneakers Pundri Kaithal`} className="w-full h-full object-contain opacity-70 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:w-1/2 flex flex-col pt-4">
          <div className="mb-2">
            <span className="text-accent font-bold tracking-widest uppercase text-sm">
              {product.brand}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase italic tracking-tight mb-4">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="font-mono text-2xl sm:text-3xl font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="font-mono text-xl text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            {product.rating && (
              <div className="flex items-center gap-1 ml-auto">
                <Star className="w-5 h-5 fill-accent text-accent" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-muted-foreground text-sm">({product.reviewCount})</span>
              </div>
            )}
          </div>

          <div className="prose prose-sm max-w-none text-muted-foreground mb-10">
            <p className="leading-relaxed">
              {product.description || "Premium performance footwear engineered for maximum comfort and speed. Featuring advanced cushioning technology and durable traction."}
            </p>
          </div>

          <div className="space-y-8 mb-10">
            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-bold uppercase tracking-wider mb-4 flex items-center justify-between">
                  Color <span className="text-muted-foreground font-normal normal-case text-sm">{selectedColor || "Select color"}</span>
                </h3>
                <div className="flex gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`
                        w-12 h-12 rounded-full border-2 focus:outline-none transition-all
                        ${selectedColor === color ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border hover:border-primary/50'}
                      `}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h3 className="font-bold uppercase tracking-wider">Size <span className="text-muted-foreground text-sm font-normal normal-case">(US Men)</span></h3>
                <button className="text-sm font-bold text-muted-foreground hover:text-primary uppercase tracking-wider underline underline-offset-4">Size Guide</button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      py-3 font-mono font-bold text-center border transition-all duration-200
                      ${selectedSize === size 
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                        : 'bg-background text-foreground border-border hover:border-primary hover:bg-secondary/50'}
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-bold uppercase tracking-wider mb-4">Quantity</h3>
              <div className="flex items-center">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 min-w-[44px] min-h-[44px] flex items-center justify-center border border-border bg-secondary/20 hover:bg-secondary/80 transition-colors font-mono font-bold text-xl"
                >
                  -
                </button>
                <div className="w-16 h-12 min-h-[44px] flex items-center justify-center border-y border-border font-mono font-bold text-lg">
                  {quantity}
                </div>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 min-w-[44px] min-h-[44px] flex items-center justify-center border border-border bg-secondary/20 hover:bg-secondary/80 transition-colors font-mono font-bold text-xl"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock || addToCart.isPending}
              className="w-full h-16 rounded-none bg-accent hover:bg-primary text-white font-display font-black text-xl uppercase tracking-widest transition-colors duration-300"
            >
              {addToCart.isPending ? "Adding..." : product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
            
            {product.inStock && (
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground py-2">
                <Check className="w-4 h-4 text-green-600" />
                In stock and ready to ship
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
