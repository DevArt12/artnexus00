
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { eventsData } from '@/data/eventsData';

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);
  
  // Fetch events from Supabase
  const { data, isLoading, isError } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*');
      
      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }
      
      return data;
    },
    meta: {
      onError: (error: any) => {
        console.error('Error in events query:', error);
        toast.error('Failed to load events. Using sample data instead.');
      }
    }
  });
  
  // Use mock data if Supabase data is empty or there's an error
  useEffect(() => {
    if (data && data.length > 0) {
      setEvents(data);
    } else if (!isLoading || isError) {
      setEvents(eventsData);
    }
  }, [data, isLoading, isError]);
  
  const featuredEvents = events.filter(event => event.featured);
  const regularEvents = events.filter(event => !event.featured);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container mx-auto py-8 px-4 max-w-7xl flex-1">
        <h1 className="text-3xl font-bold mb-2">Art Events</h1>
        <p className="text-gray-500 mb-8">Discover exhibitions, workshops, and art gatherings in your community</p>
        
        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Featured Events</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredEvents.map(event => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-0 right-0 bg-yellow-500 text-white px-3 py-1 m-2 rounded-full text-xs font-bold">
                      Featured
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <h3 className="text-xl font-bold">{event.title}</h3>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Register Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}
        
        {/* Upcoming Events */}
        <section>
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Upcoming Events</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : regularEvents.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No upcoming events</h3>
              <p className="text-gray-500 mt-2">Check back soon for new events</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularEvents.map(event => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-40 object-cover"
                  />
                  <CardHeader className="pb-2">
                    <h3 className="text-lg font-bold">{event.title}</h3>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Learn More</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
