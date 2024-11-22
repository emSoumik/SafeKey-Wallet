import Navbar from "@/components/Navbar";
import DotPattern from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { Suspense } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen relative font-glancyr w-full bg-black text-white overflow-hidden">
      <Navbar />
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </ErrorBoundary>
      <Toaster />
    </main>
  );
};

export default Layout;