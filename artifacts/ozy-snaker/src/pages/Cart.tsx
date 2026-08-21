import { useState } from "react";
import { useGetCart, useUpdateCartItem, useRemoveCartItem, useCreateOrder, getGetCartQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(5, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  notes: z.string().optional(),
});

export default function Cart() {
  const { data: cart, isLoading } = useGetCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const createOrder = useCreateOrder();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      address: "",
      notes: "",
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-32 text-center max-w-2xl">
        <div className="w-24 h-24 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-8">
          <Check className="w-12 h-12 text-accent" />
        </div>
        <h1 className="text-5xl font-display font-black uppercase italic mb-6">Order Secured</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Your kicks are locked in. We've sent a confirmation email with tracking details.
        </p>
        <Link href="/products" className="inline-flex items-center justify-center bg-accent text-white font-display font-bold uppercase tracking-wider px-8 py-4 hover:bg-primary transition-colors">
          Back to Shop
        </Link>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center max-w-lg">
        <ShoppingBag className="w-20 h-20 mx-auto text-muted-foreground/30 mb-6" />
        <h1 className="text-4xl font-display font-black uppercase italic mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added any heat to your cart yet.</p>
        <Link href="/products" className="inline-flex bg-primary text-primary-foreground font-bold uppercase tracking-wider px-8 py-4 hover:bg-accent transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItem.mutate(
      { itemId, data: { quantity: newQuantity } },
      {
        onSuccess: (updatedCart) => {
          queryClient.setQueryData(getGetCartQueryKey(), updatedCart);
        }
      }
    );
  };

  const handleRemove = (itemId: number) => {
    removeItem.mutate(
      { itemId },
      {
        onSuccess: (updatedCart) => {
          queryClient.setQueryData(getGetCartQueryKey(), updatedCart);
          toast({ title: "Item removed from cart" });
        }
      }
    );
  };

  const onSubmit = (values: z.infer<typeof checkoutSchema>) => {
    if (!cart || cart.items.length === 0) return;

    const orderItems = cart.items.map(item => ({
      productId: item.productId,
      size: item.size,
      color: item.color ?? undefined,
      quantity: item.quantity,
      price: item.price
    }));

    createOrder.mutate(
      {
        data: {
          ...values,
          items: orderItems
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          setOrderComplete(true);
          window.scrollTo(0, 0);
        },
        onError: () => {
          toast({
            title: "Checkout failed",
            description: "There was an issue processing your order. Please try again.",
            variant: "destructive"
          });
        }
      }
    );
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20">
      <h1 className="text-4xl md:text-5xl font-display font-black uppercase italic mb-12">Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="flex flex-col gap-6">
            {cart.items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-4 border border-border bg-card relative group">
                <div className="w-28 sm:w-32 aspect-square bg-secondary/30 flex-shrink-0 flex items-center justify-center p-2 self-start">
                  <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-contain" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
                      <Link href={`/products/${item.productId}`} className="font-display font-bold text-lg sm:text-xl uppercase tracking-tight hover:text-accent transition-colors">
                        {item.productName}
                      </Link>
                      <span className="font-mono font-bold text-base sm:text-lg whitespace-nowrap">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground uppercase font-medium flex gap-4 mt-2">
                      <span>Size: {item.size}</span>
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center border border-border bg-background">
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-secondary transition-colors font-mono font-bold"
                        disabled={updateItem.isPending}
                      >
                        -
                      </button>
                      <div className="w-12 h-11 min-h-[44px] flex items-center justify-center font-mono font-bold text-sm">
                        {item.quantity}
                      </div>
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-secondary transition-colors font-mono font-bold"
                        disabled={updateItem.isPending}
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => handleRemove(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-2"
                      disabled={removeItem.isPending}
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checkout Summary / Form */}
        <div className="lg:w-1/3">
          <div className="bg-primary text-primary-foreground p-8 sticky top-24">
            <h2 className="font-display font-bold text-2xl uppercase tracking-wider mb-6 pb-6 border-b border-white/20">
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-6 text-sm font-medium">
              <div className="flex justify-between">
                <span className="text-primary-foreground/70">Subtotal ({cart.itemCount} items)</span>
                <span className="font-mono">${cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-foreground/70">Shipping</span>
                <span className="uppercase text-accent font-bold">Free</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end mb-8 pt-6 border-t border-white/20">
              <span className="font-bold uppercase tracking-wider">Total</span>
              <span className="font-mono text-3xl font-bold text-accent">${cart.total.toFixed(2)}</span>
            </div>

            {!isCheckingOut ? (
              <Button 
                onClick={() => setIsCheckingOut(true)}
                className="w-full h-14 bg-accent hover:bg-white text-white hover:text-black font-display font-black text-lg uppercase tracking-widest transition-colors rounded-none"
              >
                Secure Checkout
              </Button>
            ) : (
              <div className="mt-8 pt-8 border-t border-white/20">
                <h3 className="font-display font-bold text-xl uppercase mb-6 text-accent">Shipping Details</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary-foreground/70 uppercase text-xs tracking-wider">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" className="bg-primary-foreground/10 border-transparent text-primary-foreground rounded-none focus-visible:ring-accent" {...field} />
                          </FormControl>
                          <FormMessage className="text-destructive-foreground text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary-foreground/70 uppercase text-xs tracking-wider">Email</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" type="email" className="bg-primary-foreground/10 border-transparent text-primary-foreground rounded-none focus-visible:ring-accent" {...field} />
                          </FormControl>
                          <FormMessage className="text-destructive-foreground text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customerPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary-foreground/70 uppercase text-xs tracking-wider">Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 234 567 8900" className="bg-primary-foreground/10 border-transparent text-primary-foreground rounded-none focus-visible:ring-accent" {...field} />
                          </FormControl>
                          <FormMessage className="text-destructive-foreground text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary-foreground/70 uppercase text-xs tracking-wider">Shipping Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="123 Main St, City, Country, Zip" className="bg-primary-foreground/10 border-transparent text-primary-foreground rounded-none focus-visible:ring-accent min-h-[80px]" {...field} />
                          </FormControl>
                          <FormMessage className="text-destructive-foreground text-xs" />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      disabled={createOrder.isPending}
                      className="w-full h-14 bg-accent hover:bg-white text-white hover:text-black font-display font-black text-lg uppercase tracking-widest transition-colors rounded-none mt-6"
                    >
                      {createOrder.isPending ? "Processing..." : "Place Order"}
                    </Button>
                    <button 
                      type="button"
                      onClick={() => setIsCheckingOut(false)}
                      className="w-full text-center text-primary-foreground/70 hover:text-white uppercase text-xs font-bold tracking-wider pt-4"
                    >
                      Cancel
                    </button>
                  </form>
                </Form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Ensure Check is imported correctly
function Check(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
