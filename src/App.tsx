
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Index from './pages/Index';
import ArtistProfile from './pages/ArtistProfile';
import ArtworkDetail from './pages/ArtworkDetail';
import Discover from './pages/Discover';
import NotFound from './pages/NotFound';
import Marketplace from './pages/Marketplace';
import Performances from './pages/Performances';
import Forum from './pages/Forum';
import ForumTopic from './pages/ForumTopic';
import ArtClasses from './pages/ArtClasses';
import ClassDetail from './pages/ClassDetail';
import Events from './pages/Events';
import ARView from './pages/ARView';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import UploadArt from './pages/UploadArt';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/artist/:id" element={<ArtistProfile />} />
          <Route path="/artwork/:id" element={<ArtworkDetail />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/performances" element={<Performances />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/topic/:id" element={<ForumTopic />} />
          <Route path="/classes" element={<ArtClasses />} />
          <Route path="/classes/:id" element={<ClassDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/ar-view/:id" element={<ARView />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/upload-art" element={<UploadArt />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
