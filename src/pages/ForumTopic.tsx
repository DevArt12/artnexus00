
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MessageSquare, Clock, Heart } from 'lucide-react';
import { forumTopics, forumPosts } from '@/data/communityData';

const ForumTopic = () => {
  const { id } = useParams<{ id: string }>();
  const [replyContent, setReplyContent] = useState('');
  
  // Find the topic based on the ID from URL parameter
  const topic = forumTopics.find(topic => topic.id === id);
  const posts = (topic && forumPosts[topic.id]) || [];
  
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
  
  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the reply to the backend
    console.log('Submitting reply:', replyContent);
    setReplyContent('');
    // Show a success message or update the UI
    alert('Reply submitted successfully!');
  };
  
  if (!topic) {
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
  
  const categoryColors: Record<string, string> = {
    materials: 'bg-blue-500',
    exhibitions: 'bg-purple-500',
    digital: 'bg-green-500',
    business: 'bg-orange-500',
    critique: 'bg-red-500',
    general: 'bg-gray-500',
  };
  
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
            <Badge className={`${categoryColors[topic.category] || 'bg-gray-500'}`}>
              {topic.category}
            </Badge>
            <span className="text-sm text-muted-foreground flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {formatDate(topic.created_at)}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold">{topic.title}</h1>
          
          <div className="flex items-center mt-4">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={topic.author.avatar} alt={topic.author.name} />
              <AvatarFallback>{topic.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{topic.author.name}</p>
              <p className="text-xs text-muted-foreground">Topic Starter</p>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        {/* Original post and replies */}
        <div className="space-y-6 mb-8">
          {/* First post is the topic content */}
          <Card>
            <CardContent className="p-6">
              <div className="flex">
                <div className="mr-4 hidden md:block">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={topic.author.avatar} alt={topic.author.name} />
                    <AvatarFallback>{topic.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="md:hidden mr-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={topic.author.avatar} alt={topic.author.name} />
                          <AvatarFallback>{topic.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <p className="font-medium">{topic.author.name}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(topic.created_at)}</p>
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
                    <p>
                      {topic.excerpt}
                    </p>
                    <p className="mt-4">
                      I'd really appreciate any insights or experiences you all might have on this topic. 
                      Looking forward to a productive discussion!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Replies */}
          {posts.map((post) => (
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
              disabled={!replyContent.trim()}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Post Reply
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
