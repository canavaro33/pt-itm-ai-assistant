'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ChatWidget from '@/components/ChatWidget';
import ChatOverlay from '@/components/ChatOverlay';
import AuthModal from '@/components/AuthModal';
import InfoModal from '@/components/InfoModal';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoCategory, setInfoCategory] = useState('');
  const [infoHeaderTitle, setInfoHeaderTitle] = useState('');

  const openInfoModal = (category: string, title: string) => {
    setInfoCategory(category);
    setInfoHeaderTitle(title);
    setIsInfoOpen(true);
  };

  return (
    <main className="relative min-h-screen bg-charcoal">
      <Navbar onOpenAuth={() => setIsAuthOpen(true)} onOpenInfo={openInfoModal} />
      <HeroSection onOpenAuth={() => setIsAuthOpen(true)} onOpenInfo={openInfoModal} />

      {/* Chat Widget (hidden when chat is open) */}
      {!isChatOpen && <ChatWidget onClick={() => setIsChatOpen(true)} onOpenAuth={() => setIsAuthOpen(true)} />}

      {/* Chat Overlay */}
      <ChatOverlay
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      
      <InfoModal 
        isOpen={isInfoOpen} 
        onClose={() => setIsInfoOpen(false)} 
        category={infoCategory} 
        headerTitle={infoHeaderTitle} 
      />
    </main>
  );
}
