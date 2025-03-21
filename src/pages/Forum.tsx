
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MessageSquare, Clock, User, Plus } from 'lucide-react';
import { forumTopics } from '@/data/communityData';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';

// Function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }).format(date);
};

const categoryColors: Record<string, string> = {
  materials: 'bg-blue-500',
  exhibitions: 'bg-purple-500',
  digital: 'bg-green-500',
  business: 'bg-orange-500',
  critique: 'bg-red-500',
  general: 'bg-gray-500',
};

const Forum = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topics, setTopics] = useState(forumTopics);
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session?.user);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  // Filter topics based on search query
  const filteredTopics = topics.filter(topic => 
    searchQuery === '' || 
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreateTopic = async () => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to create a topic');
      navigate('/auth');
      return;
    }
    
    if (!newTopicTitle.trim() || !newTopicContent.trim() || !newTopicCategory) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // First, create the topic in the database
      const { data: topicData, error: topicError } = await supabase
        .from('forum_topics')
        .insert({
          title: newTopicTitle,
          category: newTopicCategory,
          author_id: user.id,
          reply_count: 0
        })
        .select('id')
        .single();
      
      if (topicError) throw topicError;
      
      // Then, create the first post for the topic
      const { error: postError } = await supabase
        .from('forum_posts')
        .insert({
          topic_id: topicData.id,
          author_id: user.id,
          content: newTopicContent
        });
      
      if (postError) throw postError;
      
      toast.success('Topic created successfully!');
      setIsDialogOpen(false);
      setNewTopicTitle('');
      setNewTopicContent('');
      setNewTopicCategory('');
      
      // Simulate adding to local state for immediate feedback 
      // In a real app, you would fetch the updated topics from the server
      const { data: profileData } = await supabase
        .from('profiles')
        .select('avatar, username')
        .eq('id', user.id)
        .single();
      
      const newTopic = {
        id: topicData.id,
        title: newTopicTitle,
        category: newTopicCategory,
        author: {
          id: user.id,
          name: profileData?.username || user.email?.split('@')[0] || 'User',
          avatar: profileData?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
        },
        created_at: new Date().toISOString(),
        reply_count: 0,
        excerpt: newTopicContent.substring(0, 150) + (newTopicContent.length > 150 ? '...' : '')
      };
      
      setTopics([newTopic, ...topics]);
      
      // Navigate to the new topic
      navigate(`/forum/topic/${topicData.id}`);
    } catch (error: any) {
      console.error('Error creating topic:', error);
      toast.error(error.message || 'Failed to create topic');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Community Forum</h1>
            <p className="text-muted-foreground">
              Connect with artists, share ideas, and get feedback
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0 bg-artnexus-purple hover:bg-artnexus-purple/90">
                <MessageSquare className="mr-2 h-4 w-4" />
                New Topic
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Topic</DialogTitle>
                <DialogDescription>
                  Share your thoughts with the community. Fill in the details below to start a new discussion.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium">Title</label>
                  <Input
                    id="title"
                    placeholder="Enter topic title"
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="category" className="text-sm font-medium">Category</label>
                  <Select value={newTopicCategory} onValueChange={setNewTopicCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="materials">Materials</SelectItem>
                      <SelectItem value="exhibitions">Exhibitions</SelectItem>
                      <SelectItem value="digital">Digital Art</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="critique">Critique</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="content" className="text-sm font-medium">Content</label>
                  <Textarea
                    id="content"
                    placeholder="Write your post here..."
                    rows={6}
                    value={newTopicContent}
                    onChange={(e) => setNewTopicContent(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateTopic}
                  disabled={isSubmitting}
                  className="bg-artnexus-purple hover:bg-artnexus-purple/90"
                >
                  {isSubmitting ? 'Creating...' : 'Create Topic'}
                  <Plus className="ml-2 h-4 w-4" />
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Search and filters */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
        
        {/* Forum categories */}
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Topics</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="digital">Digital Art</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="critique">Critique</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {filteredTopics.length > 0 ? (
              filteredTopics.map((topic) => (
                <Link key={topic.id} to={`/forum/topic/${topic.id}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="hidden sm:block">
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <img 
                              src={topic.author.avatar} 
                              alt={topic.author.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={`${categoryColors[topic.category] || 'bg-gray-500'}`}>
                              {topic.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(topic.created_at)}
                            </span>
                          </div>
                          
                          <h3 className="font-bold text-lg mb-2">{topic.title}</h3>
                          
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {topic.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm">
                              <User className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{topic.author.name}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="text-sm">{topic.reply_count} replies</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No topics found matching your search</p>
                <Button onClick={() => setSearchQuery('')} variant="outline">
                  Clear Search
                </Button>
              </div>
            )}
          </TabsContent>
          
          {/* Filter topics by category */}
          {['materials', 'digital', 'business', 'critique'].map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              {filteredTopics
                .filter(topic => topic.category === category)
                .map((topic) => (
                  <Link key={topic.id} to={`/forum/topic/${topic.id}`}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="hidden sm:block">
                            <div className="w-12 h-12 rounded-full overflow-hidden">
                              <img 
                                src={topic.author.avatar} 
                                alt={topic.author.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={`${categoryColors[topic.category] || 'bg-gray-500'}`}>
                                {topic.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDate(topic.created_at)}
                              </span>
                            </div>
                            
                            <h3 className="font-bold text-lg mb-2">{topic.title}</h3>
                            
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {topic.excerpt}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm">
                                <User className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span>{topic.author.name}</span>
                              </div>
                              
                              <div className="flex items-center">
                                <MessageSquare className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span className="text-sm">{topic.reply_count} replies</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              
              {filteredTopics.filter(topic => topic.category === category).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No topics found in this category
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Forum;
