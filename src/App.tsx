import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/upload-art" element={<UploadArt />} />
              <Route path="/artist/:id" element={<ArtistProfile />} />
              <Route path="/artwork/:id" element={<ArtworkDetail />} />
              <Route path="/performances" element={<Performances />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/forum/topic/:id" element={<ForumTopic />} />
              <Route path="/classes" element={<ArtClasses />} />
              <Route path="/classes/:id" element={<ClassDetail />} />
              <Route path="/events" element={<Events />} />
              <Route path="/ar-view/:id" element={<ARView />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
