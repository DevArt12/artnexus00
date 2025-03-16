
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Clock, UserCircle, Calendar, BookOpen, Share2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ClassDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: classData, isLoading, error } = useQuery({
    queryKey: ['class', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('art_classes')
        .select(`
          *,
          instructor:instructor_id(
            id,
            name,
            photo,
            bio
          )
        `)
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    }
  });
  
  const { data: relatedClasses } = useQuery({
    queryKey: ['related-classes', classData?.category],
    enabled: !!classData,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('art_classes')
        .select(`
          *,
          instructor:instructor_id(
            name,
            photo
          )
        `)
        .eq('category', classData?.category)
        .neq('id', id)
        .limit(3);
        
      if (error) throw error;
      return data;
    }
  });
  
  const handleEnroll = () => {
    toast({
      title: "Enrolled Successfully",
      description: "You have been enrolled in this class.",
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="text-center py-12">
            <p>Loading class details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !classData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Class not found or error loading details</p>
            <Button asChild>
              <Link to="/classes">Back to Classes</Link>
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
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/classes">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Classes
          </Link>
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video and details */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg overflow-hidden mb-6 aspect-video shadow-md">
              {classData.video_url ? (
                <iframe
                  src={classData.video_url}
                  className="w-full h-full"
                  title={classData.title}
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <img 
                    src={classData.image} 
                    alt={classData.title} 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold">{classData.title}</h1>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-artnexus-purple">{classData.level}</Badge>
                <Badge variant="outline">{classData.category}</Badge>
                <div className="flex items-center text-sm text-muted-foreground ml-2">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{classData.duration}</span>
                </div>
              </div>
              
              <Tabs defaultValue="description">
                <TabsList className="mb-4">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="animate-fade-in">
                  <p className="text-muted-foreground whitespace-pre-line mb-4">
                    {classData.description}
                  </p>
                  
                  <h3 className="font-bold text-lg mt-6 mb-3">What You'll Learn</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Master the fundamentals of this technique</li>
                    <li>Understand color theory and composition</li>
                    <li>Create your own unique artwork</li>
                    <li>Develop your artistic style</li>
                  </ul>
                </TabsContent>
                
                <TabsContent value="materials" className="animate-fade-in">
                  <h3 className="font-bold text-lg mb-3">Required Materials</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Basic set of paints</li>
                    <li>Canvas or paper</li>
                    <li>Brushes</li>
                    <li>Water container</li>
                    <li>Paper towels</li>
                  </ul>
                </TabsContent>
                
                <TabsContent value="reviews" className="animate-fade-in">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No reviews yet</p>
                    <Button>Write a Review</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment card */}
            <Card className="p-6">
              <div className="mb-4">
                <h3 className="font-bold text-2xl mb-1">{classData.price === "0" ? "Free" : classData.price}</h3>
                <p className="text-sm text-muted-foreground">
                  Lifetime access to this class
                </p>
              </div>
              
              <Button 
                className="w-full mb-4 bg-artnexus-purple hover:bg-artnexus-purple/90"
                onClick={handleEnroll}
              >
                Enroll Now
              </Button>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Course Length</p>
                    <p className="text-muted-foreground">{classData.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <BookOpen className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Skill Level</p>
                    <p className="text-muted-foreground">{classData.level}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-muted-foreground">
                      {new Date(classData.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Instructor card */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Instructor</h3>
              
              <div className="flex items-center mb-4">
                <img 
                  src={classData.instructor?.photo || "https://via.placeholder.com/150"} 
                  alt={classData.instructor?.name || "Instructor"} 
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold">{classData.instructor?.name}</h4>
                  <p className="text-sm text-muted-foreground">Art Instructor</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-4">
                {classData.instructor?.bio || "No bio available"}
              </p>
              
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link to={`/artist/${classData.instructor_id}`}>
                  View Profile
                </Link>
              </Button>
            </Card>
            
            {/* Related classes */}
            {relatedClasses && relatedClasses.length > 0 && (
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Similar Classes</h3>
                
                <div className="space-y-4">
                  {relatedClasses.map((relClass) => (
                    <Link
                      key={relClass.id}
                      to={`/classes/${relClass.id}`}
                      className="flex items-center space-x-3 group"
                    >
                      <img 
                        src={relClass.image} 
                        alt={relClass.title} 
                        className="w-16 h-16 object-cover rounded-md group-hover:opacity-80 transition-opacity"
                      />
                      <div className="flex-grow min-w-0">
                        <h4 className="font-medium truncate group-hover:text-artnexus-purple transition-colors">
                          {relClass.title}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {relClass.instructor?.name} • {relClass.level}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default ClassDetail;
