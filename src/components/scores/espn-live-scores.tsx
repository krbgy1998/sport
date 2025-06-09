
"use client";

import type { EspnScoreboardResponse, EspnEvent, EspnLeagueInfo } from "@/types";
import { useState, useEffect } from "react";
import { EspnScoreCard } from "./espn-score-card";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { SPORT_LEAGUE_OPTIONS_FULL } from "@/lib/sports-data";


export function EspnLiveScores() {
  const [data, setData] = useState<EspnScoreboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formattedDate, setFormattedDate] = useState('');
  const [selectedSportLeague, setSelectedSportLeague] = useState(SPORT_LEAGUE_OPTIONS_FULL[0]);
  const [displayableDateString, setDisplayableDateString] = useState('today');

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setFormattedDate(`${year}${month}${day}`);
  }, []);

  useEffect(() => {
    if (formattedDate && formattedDate.length === 8) {
      try {
        const dateObj = new Date(
          `${formattedDate.substring(0, 4)}-${formattedDate.substring(4, 6)}-${formattedDate.substring(6, 8)}T00:00:00` 
        );
        if (!isNaN(dateObj.getTime())) {
          setDisplayableDateString(
            dateObj.toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          );
        } else {
          setDisplayableDateString('the selected date');
        }
      } catch (e) {
        setDisplayableDateString('the selected date');
      }
    } else if (!formattedDate) { 
        setDisplayableDateString('today');
    }
  }, [formattedDate]);

  useEffect(() => {
    if (!selectedSportLeague) return; // Don't fetch if no league is selected
    // For NFL, we don't need formattedDate to be ready as we fetch general scoreboard
    if (!(selectedSportLeague.sport === 'football' && selectedSportLeague.league === 'nfl') && !formattedDate) return;


    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let apiUrl = `https://site.api.espn.com/apis/site/v2/sports/${selectedSportLeague.sport}/${selectedSportLeague.league}/scoreboard`;

        // NFL scoreboard typically shows current/upcoming week, so no date needed.
        // MMA also usually shows current/upcoming.
        // For other sports, or if a specific date is needed for college football, append dates.
        if (
          !(selectedSportLeague.sport === 'football' && selectedSportLeague.league === 'nfl') &&
          !(selectedSportLeague.sport === 'mma') && // Assuming MMA also doesn't strictly need a date for general scoreboard
          formattedDate
        ) {
          apiUrl += `?dates=${formattedDate}`;
        }
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Network response was not ok (${response.status})`);
        }
        const jsonData: EspnScoreboardResponse = await response.json();
        setData(jsonData);
      } catch (err) {
        console.error(`Failed to fetch data for ${selectedSportLeague.name}:`, err);
        setError(err instanceof Error ? err.message : String(err));
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formattedDate, selectedSportLeague]);

  const handleLeagueChange = (value: string) => {
    const selected = SPORT_LEAGUE_OPTIONS_FULL.find(opt => `${opt.sport}/${opt.league}` === value);
    if (selected) {
      setSelectedSportLeague(selected);
    }
  };
  
  const activeLeague: EspnLeagueInfo | undefined = data?.leagues?.[0];

  const eventsToDisplay = data?.events?.filter(event => {
    const eventDate = new Date(event.date);
    const todayForCompare = new Date(); 
    todayForCompare.setHours(0,0,0,0); 

    // For NFL and MMA, show 'in' or 'pre' state games as their scoreboards are typically for current/upcoming.
    if (selectedSportLeague.sport === 'nfl' || selectedSportLeague.sport === 'mma') {
        return event.status.type.description !== "Postponed" && (event.status.type.state === 'in' || event.status.type.state === 'pre');
    }
    
    // Default logic for other sports
    return (
      event.status.type.description !== "Postponed" &&
      (eventDate >= todayForCompare || event.status.type.state === "in" || event.status.type.state === "post")
    );
  }) ?? [];


  return (
    <div className="space-y-6">
      <div className="flex justify-start items-center gap-4">
        <label htmlFor="league-select" className="text-sm font-medium text-muted-foreground">Select League:</label>
        <Select
          value={`${selectedSportLeague.sport}/${selectedSportLeague.league}`}
          onValueChange={handleLeagueChange}
        >
          <SelectTrigger id="league-select" className="w-[280px] bg-card">
            <SelectValue placeholder="Select a league" />
          </SelectTrigger>
          <SelectContent>
            {SPORT_LEAGUE_OPTIONS_FULL.map(opt => (
              <SelectItem key={`${opt.sport}/${opt.league}`} value={`${opt.sport}/${opt.league}`}>
                {opt.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Loading scores...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="shadow-md">
          <AlertTitle>Error Fetching Scores</AlertTitle>
          <AlertDescription>
            Could not load live scores for {selectedSportLeague.name}. Please try again later. ({error})
          </AlertDescription>
        </Alert>
      )}

      {!loading && !error && activeLeague && (
        <>
          {eventsToDisplay.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  No matches found for {selectedSportLeague.name}
                  {(selectedSportLeague.sport === 'football' && selectedSportLeague.league === 'nfl') || selectedSportLeague.sport === 'mma'
                    ? '' // For NFL/MMA, don't show "on X date" as we fetch general upcoming
                    : ` on ${displayableDateString}`}.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eventsToDisplay.map((event) => (
                <EspnScoreCard key={event.id} eventData={{ type: 'espn', data: { event, league: activeLeague, sportType: selectedSportLeague.sport } }} />
              ))}
            </div>
          )}
        </>
      )}
       {!loading && !error && !activeLeague && data && data.events.length > 0 && (
         <Alert variant="default" className="shadow-md">
            <AlertTitle>League Information Missing</AlertTitle>
            <AlertDescription>
              Score data was loaded, but league information is missing from the API response for {selectedSportLeague.name}. Cards may not display correctly.
            </AlertDescription>
          </Alert>
       )}
    </div>
  );
}

