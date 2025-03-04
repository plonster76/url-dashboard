import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { KioskUrl } from '../types';

interface KioskState {
  urls: KioskUrl[];
  activeUrl: KioskUrl | null;
  addUrl: (url: string, name: string, startTime: string | null) => void;
  updateUrl: (id: string, url: string, name: string, startTime: string | null) => void;
  deleteUrl: (id: string) => void;
  setActiveUrl: (id: string) => void;
  getActiveUrl: () => KioskUrl | null;
}

export const useKioskStore = create<KioskState>()(
  persist(
    (set, get) => ({
      urls: [],
      activeUrl: null,
      
      addUrl: (url, name, startTime) => {
        const newUrl: KioskUrl = {
          id: Date.now().toString(),
          url,
          name,
          isActive: false,
          startTime,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          urls: [...state.urls, newUrl],
        }));
      },
      
      updateUrl: (id, url, name, startTime) => {
        set((state) => ({
          urls: state.urls.map((item) => 
            item.id === id 
              ? { 
                  ...item, 
                  url, 
                  name, 
                  startTime,
                  updatedAt: new Date().toISOString() 
                } 
              : item
          ),
          activeUrl: state.activeUrl?.id === id 
            ? { ...state.activeUrl, url, name, startTime } 
            : state.activeUrl,
        }));
      },
      
      deleteUrl: (id) => {
        set((state) => ({
          urls: state.urls.filter((item) => item.id !== id),
          activeUrl: state.activeUrl?.id === id ? null : state.activeUrl,
        }));
      },
      
      setActiveUrl: (id) => {
        set((state) => {
          const newActiveUrl = state.urls.find((item) => item.id === id) || null;
          
          return {
            urls: state.urls.map((item) => ({
              ...item,
              isActive: item.id === id,
            })),
            activeUrl: newActiveUrl,
          };
        });
      },
      
      getActiveUrl: () => {
        const state = get();
        return state.activeUrl || state.urls.find((url) => url.isActive) || null;
      },
    }),
    {
      name: 'kiosk-storage',
    }
  )
);