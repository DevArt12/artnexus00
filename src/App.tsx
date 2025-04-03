import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "sonner"

import Index from '@/pages/Index';
import Discover from '@/pages/Discover';
import Marketplace from '@/pages/Marketplace';
import Collections from '@/pages/Collections';
import ARView from '@/pages/ARView';
import ARModels from '@/pages/ARModels';
import ArtworkDetail from '@/pages/ArtworkDetail';
import ArtistProfile from '@/pages/ArtistProfile';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import UploadArt from '@/pages/UploadArt';
import Events from '@/pages/Events';
import Forum from '@/pages/Forum';
import ForumTopic from '@/pages/ForumTopic';
import ArtClasses from '@/pages/ArtClasses';
import ClassDetail from '@/pages/ClassDetail';
import Performances from '@/pages/Performances';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="artnexus-theme">
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/ar-view/:id" element={<ARView />} />
            <Route path="/ar-models" element={<ARModels />} />
            <Route path="/artwork/:id" element={<ArtworkDetail />} />
            <Route path="/artist/:id" element={<ArtistProfile />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/upload" element={<UploadArt />} />
            <Route path="/events" element={<Events />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/:id" element={<ForumTopic />} />
            <Route path="/art-classes" element={<ArtClasses />} />
            <Route path="/art-classes/:id" element={<ClassDetail />} />
            <Route path="/performances" element={<Performances />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
