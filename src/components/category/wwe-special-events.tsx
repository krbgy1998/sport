
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tv } from 'lucide-react';

interface WweEvent {
  id: string;
  name: string;
  dateText: string; // e.g., "Saturday, August 3" or "August 3, 2024"
  url: string;
  displayStatus?: string;
  liveStreamLink?: string;
  sortDate?: Date; // Added for sorting
}

// You can manually add or update WWE special events here
const wweEventsData: WweEvent[] = [
  {
    id: 'summerslam-2024',
    name: 'WWE SummerSlam 2024',
    dateText: 'Saturday, August 3',
    url: 'http://v3.sportsurge.uno/#WWE SummerSlam',
    liveStreamLink: 'http://v3.sportsurge.uno/#WWE SummerSlam',
  },
  {
    id: 'bash-in-berlin-2024',
    name: 'WWE Bash in Berlin',
    dateText: 'Saturday, August 31',
    url: 'http://v3.sportsurge.uno/#WWE Bash in Berlin',
    liveStreamLink: 'http://v3.sportsurge.uno/#WWE Bash in Berlin',
  },
  {
    id: 'crown-jewel-2024',
    name: 'WWE Crown Jewel',
    dateText: 'Saturday, November 2', // Example future date
    url: 'http://v3.sportsurge.uno/#WWE Crown Jewel',
    liveStreamLink: 'http://v3.sportsurge.uno/#WWE Crown Jewel',
  },
  {
    id: 'survivor-series-2024',
    name: 'WWE Survivor Series',
    dateText: 'Saturday, November 30', // Example future date
    url: 'http://v3.sportsurge.uno/#WWE Survivor Series',
    liveStreamLink: 'http://v3.sportsurge.uno/#WWE Survivor Series',
  },
  // Example of a past event for demonstration
  {
    id: 'money-in-the-bank-2024',
    name: 'WWE Money in the Bank',
    dateText: 'Saturday, July 6', // Past date
    url: 'http://v3.sportsurge.uno/#WWE Money in the Bank',
    liveStreamLink: 'http://v3.sportsurge.uno/#WWE Money in the Bank',
  },
];

export function WweSpecialEvents() {
  const [events, setEvents] = useState<WweEvent[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today for date-only comparison

    const processedEvents = wweEventsData.map(event => {
      const year = new Date().getFullYear();
      // More robust date parsing attempts
      let dateStringToParse = event.dateText;
      if (!event.dateText.includes(String(year)) && !event.dateText.includes(String(year+1)) && !event.dateText.includes(String(year-1))) {
         const parts = event.dateText.split(',').map(p => p.trim());
         dateStringToParse = (parts.length > 1 ? parts[1] : parts[0]) + `, ${year}`;
      }
      
      const matchDate = new Date(dateStringToParse);
      matchDate.setHours(0,0,0,0);

      let displayStatus = event.dateText;
      if (isNaN(matchDate.getTime())) {
        displayStatus = event.dateText; // Keep original if date is invalid
      } else if (matchDate.getTime() < today.getTime()) {
        displayStatus = `Finished - ${event.dateText}`;
      } else if (matchDate.getTime() === today.getTime()) {
        displayStatus = 'LIVE NOW!';
      }
      // Future dates will just show event.dateText by default
      return { ...event, displayStatus, sortDate: matchDate };
    });

    // Sort events: Live first, then upcoming, then past (by date)
    return processedEvents.sort((a, b) => {
        if (a.displayStatus === 'LIVE NOW!' && b.displayStatus !== 'LIVE NOW!') return -1;
        if (a.displayStatus !== 'LIVE NOW!' && b.displayStatus === 'LIVE NOW!') return 1;

        const dateA = a.sortDate;
        const dateB = b.sortDate;

        if (!dateA || !dateB) return 0; // Should not happen if sortDate is always set

        if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;
        
        // If both are upcoming or both are past/finished
        if ((dateA >= today && dateB >= today) || (dateA < today && dateB < today)) {
            return dateA.getTime() - dateB.getTime(); // Sort upcoming ascending, past ascending
        }
        // If one is upcoming and other is past
        return dateA < today ? 1 : -1; // Upcoming before past (relative to today)
    });
  });

  // useEffect is no longer needed to set initial events as it's handled in useState initializer.
  // It could be kept if there were other dependencies or re-fetch logic needed.

  return (
    <div className="text-center my-12 px-4">
      <h3 className="text-2xl font-bold mb-2 text-foreground font-headline">WWE Special Events</h3>
      <p className="mb-6 text-muted-foreground">
        Major WWE pay-per-views and premium live events.
      </p>
      
      <div className="space-y-3">
        {events.map(event => (
          <div key={event.id} className="border rounded-lg p-3 bg-card text-card-foreground shadow-md hover:shadow-lg transition-shadow max-w-3xl mx-auto">
            <div className="grid grid-cols-12 items-center gap-2">
              <div className="col-span-12 sm:col-span-3 text-center sm:text-left">
                <span className="text-sm font-semibold text-primary">WWE Special</span>
              </div>
              <div className="col-span-12 sm:col-span-6 text-center sm:text-left">
                <a 
                  href={event.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary hover:underline text-sm font-medium break-words"
                >
                  {event.name}
                </a>
              </div>
              <div className="col-span-12 sm:col-span-3 text-center sm:text-right flex flex-col sm:items-end">
                <span 
                  className={`text-xs font-medium mb-1 ${event.displayStatus === 'LIVE NOW!' ? 'text-destructive animate-pulse' : (event.displayStatus && event.displayStatus.startsWith('Finished')) ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}
                >
                  {event.displayStatus}
                </span>
                {event.displayStatus === 'LIVE NOW!' && event.liveStreamLink && (
                   <Button asChild variant="default" size="sm" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground h-7 px-2 text-xs">
                     <a href={event.liveStreamLink} target="_blank" rel="noopener noreferrer">
                       <Tv className="mr-1 h-3 w-3" /> Watch Live
                     </a>
                   </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
       <p className="mt-6 text-xs text-muted-foreground text-center max-w-3xl mx-auto">
         The events listed above are special pay-per-view events. For weekly shows like Raw and SmackDown, see the section above. Event dates and cards are subject to change. Check official WWE sources for final details.
       </p>
    </div>
  );
}
