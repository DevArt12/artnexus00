
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, MapPin, Search, Calendar as CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { events } from '@/data/eventsData';

const Events = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: eventsFromDB, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*');
        
      if (error) throw error;
      return data;
    },
    // Fall back to mock data if the query fails
    onError: (err) => {
      console.error('Error fetching events:', err);
      return events;
    }
  });
  
  // Use our mock data if the supabase query fails or returns empty
  const allEvents = eventsFromDB?.length ? eventsFromDB : events;
  
  // Filter events based on search query
  const filteredEvents = allEvents?.filter(event => 
    searchQuery === '' || 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  // Separate featured and regular events
  const featuredEvents = filteredEvents.filter(event => event.featured);
  const regularEvents = filteredEvents.filter(event => !event.featured);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Art Events</h1>
        <p className="text-muted-foreground mb-8">
          Discover exhibitions, workshops, and gatherings in the art community
        </p>
        
        {/* Search and filters */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search events by title, description, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
        
        {/* Featured events */}
        {featuredEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Events</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredEvents.map((event) => (
                <div 
                  key={event.id}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md flex flex-col md:flex-row"
                >
                  <div className="md:w-2/5">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover object-center"
                      style={{ minHeight: '200px' }}
                    />
                  </div>
                  
                  <div className="p-6 md:w-3/5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-xl">{event.title}</h3>
                      <Badge variant="outline" className="bg-artnexus-purple text-white">Featured</Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{event.date} • {event.time}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-artnexus-purple hover:bg-artnexus-purple/90">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* All events */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <p>Loading events...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading events. Please try again.</p>
            </div>
          ) : regularEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="aspect-video">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{event.date}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      Event Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No events found matching your search</p>
              <Button onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Events;
