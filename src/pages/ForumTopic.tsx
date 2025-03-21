
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MessageSquare, Clock, Heart, Loader2 } from 'lucide-react';
import { forumTopics, forumPosts } from '@/data/communityData';
import { toast } from 'sonner';

const ForumTopic = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [topicData, setTopicData] = useState<any>(null);
  const [postsData, setPostsData] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
        setUser(user);
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
        setUser(session?.user || null);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  // Fetch topic and posts data from Supabase
  useEffect(() => {
    const fetchTopicData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Fetch topic data
        const { data: topic, error: topicError } = await supabase
          .from('forum_topics')
          .select(`
            id,
            title,
            category,
            created_at,
            reply_count,
            profiles:author_id(
              id,
              username,
              avatar
            )
          `)
          .eq('id', id)
          .single();
        
        if (topicError) throw topicError;
        
        // Fetch first post (topic content)
        const { data: firstPost, error: firstPostError } = await supabase
          .from('forum_posts')
          .select(`
            id,
            content,
            created_at,
            profiles:author_id(
              id,
              username,
              avatar
            )
          `)
          .eq('topic_id', id)
          .order('created_at', { ascending: true })
          .limit(1)
          .single();
        
        if (firstPostError) throw firstPostError;
        
        // Fetch replies
        const { data: replies, error: repliesError } = await supabase
          .from('forum_posts')
          .select(`
            id,
            content,
            created_at,
            profiles:author_id(
              id,
              username,
              avatar
            )
          `)
          .eq('topic_id', id)
          .order('created_at', { ascending: true })
          .range(1, 100); // Skip the first post which is the topic content
        
        if (repliesError) throw repliesError;
        
        const formattedTopic = {
          ...topic,
          author: {
            id: topic.profiles.id,
            name: topic.profiles.username,
            avatar: topic.profiles.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
          },
          excerpt: firstPost.content.substring(0, 150) + (firstPost.content.length > 150 ? '...' : '')
        };
        
        const formattedPosts = [
          {
            id: firstPost.id,
            author: {
              id: firstPost.profiles.id,
              name: firstPost.profiles.username,
              avatar: firstPost.profiles.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
              role: firstPost.profiles.id === topic.profiles.id ? 'Topic Starter' : undefined
            },
            content: firstPost.content,
            created_at: firstPost.created_at
          },
          ...(replies || []).map(reply => ({
            id: reply.id,
            author: {
              id: reply.profiles.id,
              name: reply.profiles.username,
              avatar: reply.profiles.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
              role: reply.profiles.id === topic.profiles.id ? 'Topic Starter' : undefined
            },
            content: reply.content,
            created_at: reply.created_at
          }))
        ];
        
        setTopicData(formattedTopic);
        setPostsData(formattedPosts);
      } catch (error) {
        console.error('Error fetching topic data:', error);
        // If real data fetch fails, fall back to mock data
        const topic = forumTopics.find(topic => topic.id === id);
        const posts = (topic && forumPosts[topic.id]) || [];
        
        setTopicData(topic);
        setPostsData(posts);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTopicData();
  }, [id]);
  
  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('You must be logged in to post a reply');
      navigate('/auth');
      return;
    }
    
    if (!replyContent.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (!user) {
        throw new Error('User not found');
      }
      
      // Insert the reply into the forum_posts table
      const { data: postData, error: postError } = await supabase
        .from('forum_posts')
        .insert({
          topic_id: id,
          author_id: user.id,
          content: replyContent
        })
        .select('id')
        .single();
      
      if (postError) throw postError;
      
      // Update the reply count for the topic
      const { error: updateError } = await supabase
        .from('forum_topics')
        .update({ reply_count: (topicData.reply_count || 0) + 1 })
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      toast.success('Reply posted successfully!');
      setReplyContent('');
      
      // Fetch user profile for the reply
      const { data: profileData } = await supabase
        .from('profiles')
        .select('avatar, username')
        .eq('id', user.id)
        .single();
      
      // Add the new reply to the posts data for immediate UI update
      const newPost = {
        id: postData.id,
        author: {
          id: user.id,
          name: profileData?.username || user.email?.split('@')[0] || 'User',
          avatar: profileData?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
          role: user.id === topicData.author.id ? 'Topic Starter' : undefined
        },
        content: replyContent,
        created_at: new Date().toISOString()
      };
      
      setPostsData([...postsData, newPost]);
      
      // Update topic data with new reply count
      setTopicData({
        ...topicData,
        reply_count: (topicData.reply_count || 0) + 1
      });
    } catch (error: any) {
      console.error('Error posting reply:', error);
      toast.error(error.message || 'Failed to post reply');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const categoryColors: Record<string, string> = {
    materials: 'bg-blue-500',
    exhibitions: 'bg-purple-500',
    digital: 'bg-green-500',
    business: 'bg-orange-500',
    critique: 'bg-red-500',
    general: 'bg-gray-500',
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center flex-1">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-artnexus-purple mb-4" />
            <p className="text-lg">Loading topic...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!topicData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Topic Not Found</h1>
          <p className="mb-6">The topic you're looking for doesn't exist or has been removed.</p>
          <Link to="/forum">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Forum
            </Button>
          </Link>
        </div>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/forum" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Forum
          </Link>
          
          <div className="flex items-center space-x-2 mb-2">
            <Badge className={`${categoryColors[topicData.category] || 'bg-gray-500'}`}>
              {topicData.category}
            </Badge>
            <span className="text-sm text-muted-foreground flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {formatDate(topicData.created_at)}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold">{topicData.title}</h1>
          
          <div className="flex items-center mt-4">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={topicData.author.avatar} alt={topicData.author.name} />
              <AvatarFallback>{topicData.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{topicData.author.name}</p>
              <p className="text-xs text-muted-foreground">Topic Starter</p>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        {/* Original post and replies */}
        <div className="space-y-6 mb-8">
          {/* Posts */}
          {postsData.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex">
                  <div className="mr-4 hidden md:block">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.author.avatar} alt={post.author.name} />
                      <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="md:hidden mr-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={post.author.avatar} alt={post.author.name} />
                            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium">{post.author.name}</p>
                            {post.author.role && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {post.author.role}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{formatDate(post.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4 mr-1" />
                          <span className="text-xs">Like</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <p>{post.content}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Reply form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Post a Reply</h3>
          
          <form onSubmit={handleSubmitReply}>
            <div className="mb-4">
              <Textarea
                placeholder="Write your reply here..."
                rows={6}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="bg-artnexus-purple hover:bg-artnexus-purple/90"
              disabled={!replyContent.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Post Reply
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default ForumTopic;
