import { useState } from "react";
import { useLocation } from "wouter";
import { useListProducts, useListCategories, useListBrands } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";

import product1 from "@assets/generated_images/product-1.png";
import product2 from "@assets/generated_images/product-2.png";
import product3 from "@assets/generated_images/product-3.png";
import product4 from "@assets/generated_images/product-4.png";
import product5 from "@assets/generated_images/product-5.png";
import product6 from "@assets/generated_images/product-6.png";

export default function Products() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategory = searchParams.get("category") || "";

  const [category, setCategory] = useState<string>(initialCategory);
  const [brand, setBrand] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [inStock, setInStock] = useState<boolean>(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const { data: products, isLoading } = useListProducts({
    category: category || undefined,
    brand: brand || undefined,
    search: search || undefined,
    inStock: inStock ? true : undefined,
  });

  const { data: categories } = useListCategories();
  const { data: brands } = useListBrands();

  const fallbacks = [product1, product2, product3, product4, product5, product6];

  const clearFilters = () => {
    setCategory("");
    setBrand("");
    setSearch("");
    setInStock(false);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      {/* SEO */}
      <Helmet>
        <title>Buy Shoes Online in Kaithal | Sports Shoes, Sneakers & Casuals – Ozy Sneakers</title>
        <meta name="title" content="Buy Shoes Online in Kaithal | Sports Shoes, Sneakers & Casuals – Ozy Sneakers" />
        <meta name="description" content="Want to buy shoes in Kaithal or Pundri? Browse sports shoes, sneakers, casual and formal shoes at Ozy Sneakers - genuine quality, all sizes available for men and women." />
      </Helmet>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 border-b border-border pb-8">
        <div>
          <h1 className="text-5xl font-display font-black uppercase italic mb-2">Shop All</h1>
          <p className="text-muted-foreground font-medium">Find your next pair. {products?.length || 0} results.</p>
        </div>
        
        <div className="w-full md:w-auto flex items-center gap-4">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search kicks..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-secondary/50 border-none font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button 
            variant="outline" 
            className="md:hidden rounded-none border-primary text-primary"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Filters Sidebar */}
        <aside className={`
          fixed inset-0 z-50 bg-background lg:static lg:w-64 lg:block flex-shrink-0 transition-transform duration-300
          ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Backdrop for mobile filters */}
          {isMobileFiltersOpen && (
            <div className="fixed inset-0 bg-black/50 lg:hidden" onClick={() => setIsMobileFiltersOpen(false)} />
          )}
          <div className="relative h-full p-6 lg:p-0 overflow-y-auto bg-background lg:bg-transparent z-10">
            <div className="flex justify-between items-center mb-8 lg:hidden">
              <h2 className="font-display font-bold text-2xl uppercase">Filters</h2>
              <button onClick={() => setIsMobileFiltersOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Categories */}
              <div>
                <h3 className="font-bold uppercase tracking-wider mb-4 border-b border-border pb-2">Category</h3>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => setCategory("")}
                    className={`text-left text-sm font-medium hover:text-accent transition-colors ${category === "" ? "text-accent font-bold" : "text-muted-foreground"}`}
                  >
                    All Categories
                  </button>
                  {categories?.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => setCategory(cat.slug)}
                      className={`text-left text-sm font-medium hover:text-accent transition-colors ${category === cat.slug ? "text-accent font-bold" : "text-muted-foreground"}`}
                    >
                      {cat.name} <span className="text-xs ml-1 opacity-60">({cat.productCount})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h3 className="font-bold uppercase tracking-wider mb-4 border-b border-border pb-2">Brand</h3>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => setBrand("")}
                    className={`text-left text-sm font-medium hover:text-accent transition-colors ${brand === "" ? "text-accent font-bold" : "text-muted-foreground"}`}
                  >
                    All Brands
                  </button>
                  {brands?.map(b => (
                    <button 
                      key={b.id}
                      onClick={() => setBrand(b.slug)}
                      className={`text-left text-sm font-medium hover:text-accent transition-colors ${brand === b.slug ? "text-accent font-bold" : "text-muted-foreground"}`}
                    >
                      {b.name} <span className="text-xs ml-1 opacity-60">({b.productCount})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div>
                <h3 className="font-bold uppercase tracking-wider mb-4 border-b border-border pb-2">Availability</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="w-4 h-4 accent-primary rounded-none border-primary"
                  />
                  <span className="text-sm font-medium text-foreground">In Stock Only</span>
                </label>
              </div>

              {/* Clear Filters */}
              {(category || brand || search || inStock) && (
                <button 
                  onClick={clearFilters}
                  className="text-sm font-bold text-accent uppercase tracking-wider hover:underline"
                >
                  Clear All Filters
                </button>
              )}
              
              <div className="lg:hidden mt-8">
                <Button 
                  className="w-full rounded-none bg-primary text-primary-foreground font-bold uppercase tracking-wider py-6"
                  onClick={() => setIsMobileFiltersOpen(false)}
                >
                  Show Results
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-secondary/50 aspect-square mb-4"></div>
                  <div className="h-6 bg-secondary/50 w-3/4 mb-2"></div>
                  <div className="h-4 bg-secondary/50 w-1/4"></div>
                </div>
              ))}
            </div>
          ) : products?.length === 0 ? (
            <div className="text-center py-20 bg-secondary/20 border border-border">
              <h3 className="font-display font-bold text-2xl uppercase mb-2">No Kicks Found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters to find what you're looking for.</p>
              <button 
                onClick={clearFilters}
                className="bg-primary text-primary-foreground font-bold uppercase px-6 py-3 hover:bg-accent transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {products?.map((product, idx) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  imageFallback={fallbacks[idx % fallbacks.length]}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
