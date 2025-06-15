
import Footer from '@/components/layouts/Footer';
import Header from '@/components/layouts/Header';
import { ScrollToTop } from '@/components/layouts/ScrollToTop';
import { AuthProvider } from '@/context/auth-provider';
import Script from "next/script";
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <> 
    <AuthProvider>
    <div className="flex min-h-screen flex-col overflow-hidden">
      {/* Header */}
      <Header />
      <main className="flex-1">{children}</main>
      <ScrollToTop />
      <Footer />
      </div>
      <Script
          id="tawk-to"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/68353c38b68def19071580bf/1is7v6g12';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
    </AuthProvider>
    </> 
  );
}
