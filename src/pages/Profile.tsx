
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle, Settings, BookOpen, ShoppingBag, Clock, Heart } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('account');
  
  // Get user profile from Supabase
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (error) throw error;
      return data;
    }
  });

  // Liked artworks query
  const { data: likedArtworks, isLoading: isLikedLoading } = useQuery({
    queryKey: ['liked-artworks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artworks')
        .select(`
          *,
          artists:artist_id(name, id)
        `)
        .limit(5);
        
      if (error) throw error;
      return data;
    }
  });
  
  // Purchased items query
  const { data: purchasedItems, isLoading: isPurchasedLoading } = useQuery({
    queryKey: ['purchased-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select(`
          *,
          artworks:artwork_id(title, image, id)
        `)
        .eq('status', 'sold')
        .limit(5);
        
      if (error) throw error;
      return data;
    }
  });
  
  // Enrolled classes query
  const { data: enrolledClasses, isLoading: isClassesLoading } = useQuery({
    queryKey: ['enrolled-classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('art_classes')
        .select('*')
        .limit(5);
        
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile sidebar */}
          <div className="w-full md:w-1/4">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  {profile ? (
                    <img 
                      src={profile.avatar || "https://via.placeholder.com/150"} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-md"
                    />
                  ) : (
                    <UserCircle className="w-24 h-24 text-gray-300 mx-auto" />
                  )}
                </div>
                <CardTitle>
                  {isProfileLoading ? 'Loading...' : profile?.username || 'Guest User'}
                </CardTitle>
                <CardDescription>
                  {profile?.bio || 'No bio available'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full mb-2" asChild>
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
                
                <div className="mt-6 space-y-1">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${activeTab === 'account' ? 'bg-muted' : ''}`}
                    onClick={() => setActiveTab('account')}
                  >
                    <UserCircle className="mr-2 h-4 w-4" />
                    Account
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${activeTab === 'classes' ? 'bg-muted' : ''}`}
                    onClick={() => setActiveTab('classes')}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Classes
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${activeTab === 'purchases' ? 'bg-muted' : ''}`}
                    onClick={() => setActiveTab('purchases')}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Purchases
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${activeTab === 'activity' ? 'bg-muted' : ''}`}
                    onClick={() => setActiveTab('activity')}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Activity
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${activeTab === 'favorites' ? 'bg-muted' : ''}`}
                    onClick={() => setActiveTab('favorites')}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Favorites
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="w-full md:w-3/4">
            <div className={activeTab === 'account' ? 'block' : 'hidden'}>
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  {isProfileLoading ? (
                    <div className="flex justify-center py-8">
                      <p>Loading account information...</p>
                    </div>
                  ) : profile ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium">Username</h3>
                        <p className="text-muted-foreground">{profile.username}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Bio</h3>
                        <p className="text-muted-foreground">{profile.bio || 'No bio available'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Member Since</h3>
                        <p className="text-muted-foreground">
                          {new Date(profile.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="mb-4">You need to sign in to view your profile</p>
                      <Button>Sign In</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className={activeTab === 'classes' ? 'block' : 'hidden'}>
              <Card>
                <CardHeader>
                  <CardTitle>My Classes</CardTitle>
                  <CardDescription>Classes you've enrolled in</CardDescription>
                </CardHeader>
                <CardContent>
                  {isClassesLoading ? (
                    <div className="flex justify-center py-8">
                      <p>Loading classes...</p>
                    </div>
                  ) : enrolledClasses && enrolledClasses.length > 0 ? (
                    <div className="space-y-4">
                      {enrolledClasses.map((cls) => (
                        <Link 
                          key={cls.id} 
                          to={`/classes/${cls.id}`}
                          className="flex items-center p-3 rounded-lg hover:bg-muted"
                        >
                          <img 
                            src={cls.image} 
                            alt={cls.title} 
                            className="w-16 h-16 object-cover rounded-md mr-4"
                          />
                          <div>
                            <h3 className="font-medium">{cls.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {cls.level} • {cls.duration}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="mb-4">You haven't enrolled in any classes yet</p>
                      <Button asChild>
                        <Link to="/classes">Browse Classes</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className={activeTab === 'purchases' ? 'block' : 'hidden'}>
              <Card>
                <CardHeader>
                  <CardTitle>My Purchases</CardTitle>
                  <CardDescription>Artwork you've purchased</CardDescription>
                </CardHeader>
                <CardContent>
                  {isPurchasedLoading ? (
                    <div className="flex justify-center py-8">
                      <p>Loading purchases...</p>
                    </div>
                  ) : purchasedItems && purchasedItems.length > 0 ? (
                    <div className="space-y-4">
                      {purchasedItems.map((item) => (
                        <Link 
                          key={item.id} 
                          to={`/artwork/${item.artwork_id}`}
                          className="flex items-center p-3 rounded-lg hover:bg-muted"
                        >
                          <img 
                            src={item.artworks.image} 
                            alt={item.artworks.title} 
                            className="w-16 h-16 object-cover rounded-md mr-4"
                          />
                          <div>
                            <h3 className="font-medium">{item.artworks.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Price: {item.price}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="mb-4">You haven't purchased any artwork yet</p>
                      <Button asChild>
                        <Link to="/marketplace">Browse Marketplace</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className={activeTab === 'favorites' ? 'block' : 'hidden'}>
              <Card>
                <CardHeader>
                  <CardTitle>My Favorites</CardTitle>
                  <CardDescription>Artwork you've liked</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLikedLoading ? (
                    <div className="flex justify-center py-8">
                      <p>Loading favorites...</p>
                    </div>
                  ) : likedArtworks && likedArtworks.length > 0 ? (
                    <div className="space-y-4">
                      {likedArtworks.map((artwork) => (
                        <Link 
                          key={artwork.id} 
                          to={`/artwork/${artwork.id}`}
                          className="flex items-center p-3 rounded-lg hover:bg-muted"
                        >
                          <img 
                            src={artwork.image} 
                            alt={artwork.title} 
                            className="w-16 h-16 object-cover rounded-md mr-4"
                          />
                          <div>
                            <h3 className="font-medium">{artwork.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Artist: {artwork.artists.name}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="mb-4">You haven't liked any artwork yet</p>
                      <Button asChild>
                        <Link to="/discover">Discover Artwork</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className={activeTab === 'activity' ? 'block' : 'hidden'}>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p>No recent activity to display.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
