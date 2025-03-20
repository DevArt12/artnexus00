
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { performances as performanceData } from '@/data/performanceData';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User } from 'lucide-react';
import { toast } from 'sonner';

// Define Performance type
interface Performance {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  artist: string;
  video_url: string;
}

export default function Performances() {
  // Fetch performances from Supabase
  const { data, isLoading, isError } = useQuery({
    queryKey: ['performances'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performances')
        .select('*');
      
      if (error) {
        console.error('Error fetching performances:', error);
        throw error;
      }
      
      return data;
    },
    meta: {
      onError: (error: any) => {
        console.error('Error in performances query:', error);
        toast.error('Failed to load performances. Using sample data instead.');
      }
    }
  });
  
  // Use mock data if Supabase data is empty or there's an error
  const performanceItems = (data && data.length > 0) ? data : performanceData;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container mx-auto py-8 px-4 flex-1">
        <h1 className="text-3xl font-bold mb-2">Art Performances</h1>
        <p className="text-gray-500 mb-8">Explore captivating performances from talented artists around the world</p>
        
        <Tabs defaultValue="featured" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {isLoading ? (
                <div className="col-span-full flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : performanceItems.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-lg font-medium">No featured performances available</h3>
                  <p className="text-gray-500 mt-2">Check back soon for new performances</p>
                </div>
              ) : (
                performanceItems.slice(0, 2).map((performance: Performance) => (
                  <Card key={performance.id} className="overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={performance.image}
                        alt={performance.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <h3 className="text-xl font-bold">{performance.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{performance.date}</span>
                        <User className="h-4 w-4 ml-4 mr-1" />
                        <span>{performance.artist}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{performance.description}</p>
                      <div className="aspect-video">
                        <iframe
                          src={performance.video_url}
                          title={performance.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full rounded-md"
                        ></iframe>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : performanceItems.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-lg font-medium">No upcoming performances</h3>
                  <p className="text-gray-500 mt-2">Check back soon for new performances</p>
                </div>
              ) : (
                performanceItems.map((performance: Performance) => (
                  <Card key={performance.id} className="overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={performance.image}
                        alt={performance.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <h3 className="text-lg font-bold">{performance.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{performance.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <User className="h-4 w-4 mr-1" />
                        <span>{performance.artist}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">{performance.description}</p>
                      <Button variant="outline" className="w-full">Get Tickets</Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="past">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : performanceItems.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-lg font-medium">No past performances</h3>
                  <p className="text-gray-500 mt-2">Check back soon</p>
                </div>
              ) : (
                performanceItems.slice(0, 3).map((performance: Performance) => (
                  <Card key={performance.id} className="overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={performance.image}
                        alt={performance.title}
                        className="w-full h-full object-cover opacity-75"
                      />
                    </div>
                    <CardHeader>
                      <h3 className="text-lg font-bold">{performance.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{performance.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <User className="h-4 w-4 mr-1" />
                        <span>{performance.artist}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">{performance.description}</p>
                      <Button variant="outline" className="w-full">Watch Recording</Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
