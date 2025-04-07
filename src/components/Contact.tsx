'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Send, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  phone: z.string().min(10, {
    message: 'Please enter a valid phone number.',
  }),
  eventType: z.string().min(2, {
    message: 'Please specify your event type.',
  }),
  eventDate: z.string().optional(),
  guestCount: z.string().optional(),
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters.',
  }),
});

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      eventType: '',
      eventDate: '',
      guestCount: '',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log(values);
      toast.success('Thank you for your inquiry! Our event specialists will contact you within 24 hours.', {
        duration: 5000,
      });
      form.reset();
      setIsSubmitting(false);
    }, 1500);
  }

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section with animated text */}
          <div className="mb-12 text-center animate-fade-in">
            <h1 className="text-5xl font-bold text-primary mb-4 animate-slide-up">
              Let's Create Your Perfect Event
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in opacity-0 animate-delay-200">
              From intimate gatherings to grand celebrations, our expert team is dedicated to 
              bringing your vision to life with meticulous attention to detail and exceptional service.
            </p>
          </div>

          {/* Main Contact Form Card */}
          <div className="bg-card rounded-xl shadow-xl p-8 md:p-10 border border-muted/20 animate-fade-in opacity-0 animate-delay-300">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-semibold text-primary mb-4">Contact Our Event Specialists</h2>
              <p className="text-muted-foreground">
                Share your event details below and we'll craft a personalized proposal tailored to your needs and vision.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="group">
                        <FormLabel className="text-foreground/80 group-hover:text-primary transition-colors">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="John Doe" 
                            className="transition-all border-muted/30 focus:border-primary focus:ring-primary/30" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="group">
                        <FormLabel className="text-foreground/80 group-hover:text-primary transition-colors">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="john@example.com" 
                            type="email" 
                            className="transition-all border-muted/30 focus:border-primary focus:ring-primary/30" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="group">
                        <FormLabel className="text-foreground/80 group-hover:text-primary transition-colors">Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+1 (555) 000-0000" 
                            className="transition-all border-muted/30 focus:border-primary focus:ring-primary/30" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="eventType"
                    render={({ field }) => (
                      <FormItem className="group">
                        <FormLabel className="text-foreground/80 group-hover:text-primary transition-colors">Event Type</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Wedding, Corporate Event, Gala, etc."
                            className="transition-all border-muted/30 focus:border-primary focus:ring-primary/30"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="eventDate"
                    render={({ field }) => (
                      <FormItem className="group">
                        <FormLabel className="text-foreground/80 group-hover:text-primary transition-colors">Tentative Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="transition-all border-muted/30 focus:border-primary focus:ring-primary/30"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="guestCount"
                    render={({ field }) => (
                      <FormItem className="group">
                        <FormLabel className="text-foreground/80 group-hover:text-primary transition-colors">Estimated Guest Count</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="100"
                            className="transition-all border-muted/30 focus:border-primary focus:ring-primary/30"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="group">
                      <FormLabel className="text-foreground/80 group-hover:text-primary transition-colors">Your Vision</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share your ideas, theme preferences, special requests, or any details that will help us understand your event vision..."
                          className="min-h-[160px] transition-all border-muted/30 focus:border-primary focus:ring-primary/30"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full transition-all hover:scale-[1.01] hover:shadow-lg" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-pulse">Sending...</span>
                      <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    </>
                  ) : (
                    <>
                      Send Inquiry
                      <Send className="ml-2 h-4 w-4 animate-bounce" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {/* Contact Info Cards */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center ">
            <div className="p-6 rounded-lg shadow-md border border-muted/10 transition-all hover:shadow-lg hover:translate-y-[-4px]  z-120 bg-white ">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-lg">Email Us</h3>
              <a href="mailto:events@luxecelebrations.com" className="text-primary hover:underline transition-colors">
                events@luxecelebrations.com
              </a>
              <p className="text-muted-foreground text-sm mt-2">We respond within 24 hours</p>
            </div>
            
            <div className="p-6 rounded-lg shadow-md border border-muted/10 transition-all hover:shadow-lg hover:translate-y-[-4px] z-120 bg-white">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-lg">Call Us</h3>
              <a href="tel:+15551234567" className="text-primary hover:underline transition-colors">
                +1 (555) 123-4567
              </a>
              <p className="text-muted-foreground text-sm mt-2">Mon-Fri: 9am - 6pm EST</p>
            </div>
            
            <div className="p-6  rounded-lg shadow-md border border-muted/10 transition-all hover:shadow-lg hover:translate-y-[-4px] z-120 bg-white">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-lg">Visit Us</h3>
              <p className="text-primary">123 Elegance Avenue</p>
              <p className="text-muted-foreground text-sm">Suite 500, Metropolis, NY 10001</p>
              <p className="text-muted-foreground text-sm mt-2">By appointment only</p>
            </div>
          </div>
          
          {/* Testimonial */}
          <div className="mt-16 p-8 bg-primary/5 rounded-xl border border-primary/10 text-center max-w-3xl mx-auto animate-fade-in opacity-0 animate-delay-500 z-120 bg-white">
            <div className="mb-4">
              ★★★★★
            </div>
            <p className="italic text-foreground/90 mb-4">
              "The team at Luxe Celebrations transformed our vision into an unforgettable experience. 
              Their attention to detail and creativity exceeded our expectations in every way."
            </p>
            <p className="font-semibold">— Michael & Sarah Johnson, Clients</p>
          </div>
          
          {/* FAQ Teaser */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-medium mb-3">Have Questions?</h3>
            <p className="text-muted-foreground mb-4">
              Explore our <a href="#" className="text-primary hover:underline">Frequently Asked Questions</a> or contact us directly.
            </p>
          </div>
        </div>
      </div>
      
      {/* Add CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
        }
        
        .animate-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animate-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animate-delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
}