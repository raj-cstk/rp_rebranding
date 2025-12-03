"use client";
import { SlidePanelProvider, useSlidePanel } from '@/context/slidePanel.context';
import SlidePanel from './slidePanel';

function AppContent({ children }) {
  const { isOpen } = useSlidePanel();

  return (
    <div className="flex w-full min-h-screen overflow-hidden">
      <div
        className={`flex-shrink-0 transition-all duration-300 ease-in-out ${
          isOpen ? 'w-[calc(100%-450px)]' : 'w-full'
        }`}
      >
        {children}
      </div>
      <SlidePanel />
    </div>
  );
}

export default function AppWrapper({ children }) {
  return (
    <SlidePanelProvider>
      <AppContent>{children}</AppContent>
    </SlidePanelProvider>
  );
}

