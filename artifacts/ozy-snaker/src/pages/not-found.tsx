import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found – Ozy Sneakers, Pundri</title>
        <meta name="title" content="Page Not Found – Ozy Sneakers, Pundri" />
        <meta name="description" content="Yeh page exist nahi karta ya move ho gaya hai. Ozy Sneakers ke home, collection ya contact page pe wapas jao." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">
              404 Page Not Found
            </h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
          <p className="mt-4 text-sm">
            <Link href="/" className="text-accent font-bold hover:underline">
              Return to Home
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
