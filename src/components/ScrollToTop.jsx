// src/components/ScrollToTop.jsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // "Instant" scroll to top without smooth animation (faster feel)
    window.scrollTo(0, 0);
    
    // Double insurance for mobile browsers
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0;
  }, [pathname]); // Ye tab chalega jab bhi URL (pathname) change hoga

  return null; // Ye component UI pe kuch nahi dikhata
}