
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MessageSquare, Users, Clock, Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Forum = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState('general');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: topics, isLoading, error, refetch } = useQuery({
    queryKey: ['forum-topics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_topics')
        .select(`
          *,
          profiles:author_id(
            username,
            avatar
          )
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    }
  });
  
  // Filter topics
  const filteredTopics = topics?.filter(topic => {
    // Filter by search
    const matchesSearch = searchQuery === '' || 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === 'all' || 
      topic.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];
  
  const handleCreateTopic = async () => {
    if (!newTopicTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic title",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Error",
          description: "You need to be logged in to create a topic",
          variant: "destructive"
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('forum_topics')
        .insert({
          title: newTopicTitle,
          author_id: session.user.id,
          category: newTopicCategory
        })
        .select();
        
      if (error) throw error;
      
      // Create initial post
      if (data && data[0] && newTopicContent.trim()) {
        const { error: postError } = await supabase
          .from('forum_posts')
          .insert({
            content: newTopicContent,
            author_id: session.user.id,
            topic_id: data[0].id
          });
          
        if (postError) throw postError;
      }
      
      toast({
        title: "Success",
        description: "Your topic has been created successfully",
      });
      
      setNewTopicTitle('');
      setNewTopicContent('');
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error creating topic:', error);
      toast({
        title: "Error",
        description: "Failed to create topic. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Community Forum</h1>
            <p className="text-muted-foreground">
              Connect, share ideas, and inspire fellow artists
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0 bg-artnexus-purple hover:bg-artnexus-purple/90">
                <Plus className="h-4 w-4 mr-2" />
                New Topic
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Topic</DialogTitle>
                <DialogDescription>
                  Share your thoughts, questions, or ideas with the community.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    placeholder="Enter topic title"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={newTopicCategory} onValueChange={setNewTopicCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Discussion</SelectItem>
                      <SelectItem value="technique">Art Techniques</SelectItem>
                      <SelectItem value="materials">Art Materials</SelectItem>
                      <SelectItem value="critique">Artwork Critique</SelectItem>
                      <SelectItem value="events">Events & Exhibitions</SelectItem>
                      <SelectItem value="market">Art Market</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={newTopicContent}
                    onChange={(e) => setNewTopicContent(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={5}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-artnexus-purple hover:bg-artnexus-purple/90" 
                  onClick={handleCreateTopic}
                >
                  Create Topic
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Filters */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-grow">
                <label className="text-sm font-medium block mb-2">
                  Search Topics
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search by title or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="w-full md:w-48">
                <label className="text-sm font-medium block mb-2">
                  Category
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="general">General Discussion</SelectItem>
                    <SelectItem value="technique">Art Techniques</SelectItem>
                    <SelectItem value="materials">Art Materials</SelectItem>
                    <SelectItem value="critique">Artwork Critique</SelectItem>
                    <SelectItem value="events">Events & Exhibitions</SelectItem>
                    <SelectItem value="market">Art Market</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Topics list */}
        <Tabs defaultValue="recent">
          <TabsList className="mb-6">
            <TabsTrigger value="recent">Recent Topics</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="animate-fade-in">
            {isLoading ? (
              <div className="text-center py-12">
                <p>Loading topics...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">Error loading topics. Please try again.</p>
              </div>
            ) : filteredTopics.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Topic</th>
                        <th className="text-center px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider w-32">Category</th>
                        <th className="text-center px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">Replies</th>
                        <th className="text-center px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider w-32">Last Post</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-muted">
                      {filteredTopics.map((topic) => (
                        <tr key={topic.id} className="hover:bg-muted/50">
                          <td className="px-6 py-4">
                            <Link 
                              to={`/forum/topic/${topic.id}`}
                              className="flex items-start space-x-3"
                            >
                              <img 
                                src={topic.profiles?.avatar || "https://via.placeholder.com/150"} 
                                alt="Author" 
                                className="w-10 h-10 rounded-full flex-shrink-0"
                              />
                              <div>
                                <h3 className="font-medium hover:text-artnexus-purple transition-colors">
                                  {topic.title}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                  by {topic.profiles?.username || "Unknown"} • {formatDate(topic.created_at)}
                                </p>
                              </div>
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-block bg-muted px-2 py-1 text-xs rounded-full">
                              {topic.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center items-center text-muted-foreground">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              <span>{topic.reply_count}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-xs text-muted-foreground">
                            {formatDate(topic.updated_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No topics found matching your criteria</p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="popular" className="animate-fade-in">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading popular topics...</p>
            </div>
          </TabsContent>
          
          <TabsContent value="unanswered" className="animate-fade-in">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading unanswered topics...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Forum;
