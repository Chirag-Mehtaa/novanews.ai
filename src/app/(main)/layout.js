// ✅ Imports mein { } lagaya hai (Named Import check)
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A192F]">
      {/* ✅ Navbar */}
      <Header />

      {/* ✅ Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
}