
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, MapPin, Search, ArrowRight, Clock, Star } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from 'date-fns';

const Events = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*');
        
      if (error) throw error;
      return data;
    }
  });
  
  // Filter events
  const filteredEvents = events?.filter(event => {
    // Filter by search
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by date
    let matchesDate = true;
    if (selectedDate) {
      const eventDateStr = event.date;
      const eventDateParts = eventDateStr.split('/');
      if (eventDateParts.length === 3) {
        const eventDate = new Date(
          parseInt(eventDateParts[2]), 
          parseInt(eventDateParts[0]) - 1, 
          parseInt(eventDateParts[1])
        );
        
        matchesDate = 
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear();
      }
    }
    
    return matchesSearch && matchesDate;
  }) || [];
  
  // Group events by month
  const groupedEvents: Record<string, typeof filteredEvents> = {};
  
  filteredEvents.forEach(event => {
    const dateParts = event.date.split('/');
    if (dateParts.length === 3) {
      const month = parseInt(dateParts[0]) - 1;
      const year = parseInt(dateParts[2]);
      const monthYear = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;
      
      if (!groupedEvents[monthYear]) {
        groupedEvents[monthYear] = [];
      }
      
      groupedEvents[monthYear].push(event);
    }
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Events Calendar</h1>
        <p className="text-muted-foreground mb-8">
          Stay updated on art exhibitions, openings, and cultural events
        </p>
        
        {/* Filters */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-grow">
                <label className="text-sm font-medium block mb-2">
                  Search Events
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search by title, location, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">
                  Filter by Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal md:w-[240px]"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>Select date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {selectedDate && (
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setSelectedDate(undefined)}
                  className="h-10 w-10 p-0 md:self-end"
                >
                  <span className="sr-only">Clear date</span>
                  <span className="text-lg">&times;</span>
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Events list */}
        {isLoading ? (
          <div className="text-center py-12">
            <p>Loading events...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading events. Please try again.</p>
          </div>
        ) : Object.keys(groupedEvents).length > 0 ? (
          <div className="space-y-12">
            {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
              <div key={monthYear}>
                <h2 className="text-2xl font-bold mb-6 border-b pb-2">{monthYear}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {monthEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden">
                      <div className="relative aspect-[4/3]">
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="w-full h-full object-cover"
                        />
                        {event.featured && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-artnexus-amber">
                              <Star className="h-3 w-3 mr-1 fill-current" /> Featured
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <CardHeader className="pb-2">
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>{event.date} • {event.time}</span>
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span>{event.location}</span>
                        </div>
                        
                        <p className="text-muted-foreground line-clamp-3">
                          {event.description}
                        </p>
                      </CardContent>
                      
                      <CardFooter>
                        <Button className="w-full bg-artnexus-purple hover:bg-artnexus-purple/90">
                          View Details
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No events found matching your criteria</p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedDate(undefined);
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Events;
