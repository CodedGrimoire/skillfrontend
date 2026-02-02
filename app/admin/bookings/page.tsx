"use client";

import { useEffect, useState } from "react";



import { get } from "@/src/lib/api";

type AdminBooking = {
  id: string;
  studentName: string;
  tutorName: string;
  date: string;
  time: string;
  status: string;
};

export default function AdminBookingsPage() 


{
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => 
      
      {
      setError(null);
      try {
        const res = await get<{ success: boolean; bookings: AdminBooking[] }>("/api/admin/bookings");
        // Extract bookings array from response: { success: true, bookings: [...] }
        const bookingsArray = res.data.bookings || res.data || [];
        setBookings(Array.isArray(bookingsArray) ? bookingsArray : []);
      }
      
      
      catch (err) 
      
      
      
      
      {
        setError("Unable to load bookings.");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white glow-text">All Bookings</h1>
        <p className="text-sm text-white/70">View and manage all platform bookings</p>
      </header>
      
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-16 glass rounded-xl animate-pulse border border-white/10" />
          ))}
        </div>
      ) : error ? (
        <div 
        className="glass-card px-6 py-4 border-rose-500/30 bg-rose-500/10">
          <p className="text-sm text-rose-300">{error}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-card px-6 py-12 text-center">
          <p className="text-sm text-white/60">No bookings found.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="grid grid-cols-5 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-white/70 border-b border-white/10">
            <span>Student</span>
            <span>Tutor</span>



            <span>Date</span>


            <span>Status</span>
            <span>Time</span>
          </div>
          <div className="divide-y divide-white/10">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="grid grid-cols-5 items-center px-6 py-4 text-sm hover:bg-white/5 transition-colors"
              >
                <span className="font-medium text-white">
                  
                  
                  {b.studentName}</span>
                <span className="text-white/80">{b.tutorName}
                
                
                </span>
                <span className="text-white/70">{b.date}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white border border-white/20">
                  {b.status}


                </span>
                <span className="text-white/70">
                {b.time}
                
                
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
