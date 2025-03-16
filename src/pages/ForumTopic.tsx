
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Clock, MessageSquare } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ForumTopic = () => {
  const { id } = useParams<{ id: string }>();
  const [replyContent, setReplyContent] = useState('');
  
  // Fetch topic
  const { data: topic, isLoading: isTopicLoading, error: topicError } = useQuery({
    queryKey: ['forum-topic', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_topics')
        .select(`
          *,
          author:author_id(
            username,
            avatar
          )
        `)
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    }
  });
  
  // Fetch posts
  const { data: posts, isLoading: isPostsLoading, error: postsError, refetch } = useQuery({
    queryKey: ['forum-posts', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          *,
          author:author_id(
            username,
            avatar
          )
        `)
        .eq('topic_id', id)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      return data;
    }
  });
  
  const handleAddReply = async () => {
    if (!replyContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Error",
          description: "You need to be logged in to reply",
          variant: "destructive"
        });
        return;
      }
      
      const { error } = await supabase
        .from('forum_posts')
        .insert({
          content: replyContent,
          author_id: session.user.id,
          topic_id: id
        });
        
      if (error) throw error;
      
      // Update reply count
      await supabase
        .from('forum_topics')
        .update({ 
          reply_count: (topic?.reply_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      toast({
        title: "Success",
        description: "Your reply has been posted",
      });
      
      setReplyContent('');
      refetch();
    } catch (error) {
      console.error('Error posting reply:', error);
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  const isLoading = isTopicLoading || isPostsLoading;
  const error = topicError || postsError;
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="text-center py-12">
            <p>Loading topic...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !topic) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Topic not found or error loading topic</p>
            <Button asChild>
              <Link to="/forum">Back to Forum</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/forum">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Forum
            </Link>
          </Button>
          
          <h1 className="text-2xl font-bold mb-2">{topic.title}</h1>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <span className="inline-block bg-muted px-2 py-1 text-xs rounded-full">
                {topic.category}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Created {formatDate(topic.created_at)}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{topic.reply_count} replies</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Original post */}
          {posts && posts.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex space-x-4">
                <img 
                  src={posts[0].author?.avatar || "https://via.placeholder.com/150"} 
                  alt={posts[0].author?.username || "Unknown"} 
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{posts[0].author?.username || "Unknown"}</h3>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(posts[0].created_at)}
                      </p>
                    </div>
                    <span className="bg-artnexus-purple text-white text-xs px-2 py-1 rounded-full">
                      Author
                    </span>
                  </div>
                  <div className="mt-4 text-muted-foreground whitespace-pre-line">
                    {posts[0].content}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Separator for replies section */}
          {posts && posts.length > 1 && (
            <div className="flex items-center my-8">
              <Separator className="flex-grow" />
              <span className="px-4 text-sm text-muted-foreground">
                {posts.length - 1} Replies
              </span>
              <Separator className="flex-grow" />
            </div>
          )}
          
          {/* Replies */}
          {posts && posts.length > 1 && (
            <div className="space-y-6">
              {posts.slice(1).map((post) => (
                <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <div className="flex space-x-4">
                    <img 
                      src={post.author?.avatar || "https://via.placeholder.com/150"} 
                      alt={post.author?.username || "Unknown"} 
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-grow">
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-medium">{post.author?.username || "Unknown"}</h3>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(post.created_at)}
                        </p>
                      </div>
                      <div className="mt-4 text-muted-foreground whitespace-pre-line">
                        {post.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Reply form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-8">
            <h3 className="text-lg font-medium mb-4">Post a Reply</h3>
            <Textarea
              placeholder="Write your reply here..."
              className="mb-4 min-h-[120px]"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <Button 
              className="bg-artnexus-purple hover:bg-artnexus-purple/90" 
              onClick={handleAddReply}
            >
              Post Reply
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default ForumTopic;
