
import Footer from '@/components/layouts/Footer';
import Header from '@/components/layouts/Header';
import { AuthProvider } from '@/context/auth-provider';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <> 
    <AuthProvider>
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      </div>
    </AuthProvider>
    </> 
  );
}
