
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MessageSquare, Clock, User } from 'lucide-react';
import { forumTopics } from '@/data/communityData';

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
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter topics based on search query
  const filteredTopics = forumTopics.filter(topic => 
    searchQuery === '' || 
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
          
          <Button className="mt-4 md:mt-0 bg-artnexus-purple hover:bg-artnexus-purple/90">
            <MessageSquare className="mr-2 h-4 w-4" />
            New Topic
          </Button>
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
