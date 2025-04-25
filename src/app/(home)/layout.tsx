
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
        <Header/>
      <main className="">{children}</main>
    </AuthProvider>
    </> 
  );
}
