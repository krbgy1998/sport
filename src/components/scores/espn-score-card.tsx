
"use client";

import type { TennisEventItem, UnifiedEventData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { CountdownTimer } from "@/components/shared/CountdownTimer";
import { CalendarDays, MapPin } from "lucide-react";
import { useState, useEffect, useMemo } from 'react';
import { cn } from "@/lib/utils";

interface EspnScoreCardProps {
  eventData: UnifiedEventData;
}

export function EspnScoreCard({ eventData }: EspnScoreCardProps) {
  const [displayTime, setDisplayTime] = useState<string | null>(null);
  const [displayDate, setDisplayDate] = useState<string | null>(null);
  const [nflEstTime, setNflEstTime] = useState<string | null>(null);


  const eventDateStr = eventData.data.date;

  useEffect(() => {
    if (eventDateStr) {
      const dateObj = new Date(eventDateStr);
      if (!isNaN(dateObj.getTime())) {
        setDisplayTime(dateObj.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }));
        setDisplayDate(dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' }));
        
        // Ensure league information is available before checking slug
        if (eventData.type === 'espn' && eventData.data.league && eventData.data.sportType === 'football' && eventData.data.league.slug === 'nfl') {
            setNflEstTime(dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
        } else {
            setNflEstTime(null); 
        }

      } else {
        setDisplayTime('Invalid Date');
        setDisplayDate('');
        setNflEstTime(null);
      }
    } else {
      setDisplayTime(null);
      setDisplayDate(null);
      setNflEstTime(null);
    }
  }, [eventDateStr, eventData.type, eventData.data]);

  const isEventEnded = useMemo(() => {
    if (eventData.type === 'tennis') {
      const status = eventData.data.status?.toLowerCase();
      return status === 'post' || status?.includes("final") || status?.includes("completed") || status === "ft";
    } else if (eventData.type === 'espn') {
      return eventData.data.event.status.type.state === 'post';
    }
    return false;
  }, [eventData]);

  const matchUrl = useMemo(() => {
    if (eventData.type === 'tennis') {
      const { competitors, name: eventName } = eventData.data;
      const competitor1 = competitors[0]?.displayName;
      const competitor2 = competitors[1]?.displayName;
      return competitor1 && competitor2 ? `https://v3.sportsurge.uno/#${competitor1} vs ${competitor2}` : `https://v3.sportsurge.uno/#${eventName.replace(/\s+/g, '%20')}`;
    } else if (eventData.type === 'espn') {
      const { event, sportType } = eventData.data;
      const homeTeam = sportType !== 'racing' && sportType !== 'golf' && sportType !== 'mma' ? event.competitions[0]?.competitors.find(c => c.homeAway === 'home') : undefined;
      const awayTeam = sportType !== 'racing' && sportType !== 'golf' && sportType !== 'mma' ? event.competitions[0]?.competitors.find(c => c.homeAway === 'away') : undefined;
      switch (sportType) {
        case 'racing':
        case 'mma':
        case 'golf':
        case 'football': // NFL also uses shortName for URL
          return `https://v3.sportsurge.uno/#${event.shortName.replace(/\s+/g, '%20')}`;
        default: 
          if (homeTeam?.team && awayTeam?.team) {
            return `https://v3.sportsurge.uno/#${homeTeam.team.shortDisplayName} vs ${awayTeam.team.shortDisplayName}`;
          }
          return `https://v3.sportsurge.uno/#${event.shortName.replace(/\s+/g, '%20')}`;
      }
    }
    return 'https://v3.sportsurge.uno/';
  }, [eventData]);

  const handleCardClick = () => {
    if (isEventEnded) {
      return;
    }
    window.open(matchUrl, '_blank');
  };

  const isEspnEvent = eventData.type === 'espn';
  const isEspnLive = isEspnEvent && eventData.data.event.status.type.state === 'in';

  if (eventData.type === 'tennis') {
    const tennisEvent = eventData.data;
    const eventName = tennisEvent.name;
    const competitor1 = tennisEvent.competitors?.[0]?.displayName;
    const competitor2 = tennisEvent.competitors?.[1]?.displayName;
    const competitionType = tennisEvent.competitionType?.text;
    const eventStatus = tennisEvent.status; 

    const renderTennisStatus = () => {
      const lowerStatus = eventStatus?.toLowerCase();
      if (lowerStatus?.includes("progress") || lowerStatus?.includes("live") || lowerStatus === "in") {
        return <span className="text-sm text-destructive font-semibold animate-pulse">LIVE</span>;
      }
      if (lowerStatus?.includes("scheduled") || lowerStatus === "pre") {
        return eventDateStr ? <CountdownTimer targetDate={eventDateStr} /> : <span className="text-sm text-muted-foreground">Scheduled</span>;
      }
      if (lowerStatus?.includes("final") || lowerStatus?.includes("completed") || lowerStatus === "post" || lowerStatus === "ft") {
        return <span className="text-sm text-muted-foreground font-semibold">Final</span>;
      }
      return <span className="text-sm text-muted-foreground">{typeof eventStatus === 'string' ? eventStatus.replace('STATUS_', '').replace('_', ' ') : 'Scheduled'}</span>;
    };

    if (!competitor1 || !competitor2) {
      return (
        <Card className={cn(
          "shadow-md flex flex-col h-full text-card-foreground",
           isEventEnded ? "opacity-70 bg-card" : "bg-card hover:shadow-lg" 
        )}>
          <CardHeader className="p-3">
            <div className="flex justify-between items-center mb-1">
              <Badge variant="secondary" className="text-xs truncate" title={eventName}>{eventName && eventName.length > 20 ? eventName.substring(0, 18) + '...' : eventName}</Badge>
              {renderTennisStatus()}
            </div>
            <CardTitle className="text-base font-semibold text-center truncate leading-tight">
              {eventName || 'Tennis Match'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 flex-grow flex flex-col justify-center">
            <p className="text-center text-muted-foreground text-xs">Competitor data not fully available for this event.</p>
             {competitionType && <p className="text-center text-xs text-muted-foreground">{competitionType}</p>}
          </CardContent>
        </Card>
      );
    }
    
    return (
      <Card
        className={cn(
          "shadow-md flex flex-col h-full text-card-foreground",
          isEventEnded 
            ? "opacity-70 bg-card" 
            : "bg-card hover:shadow-lg cursor-pointer"
        )}
        onClick={handleCardClick}
      >
        <CardHeader className="p-3">
          <div className="flex justify-between items-center mb-1">
            <Badge variant="secondary" className="text-xs truncate" title={eventName}>{eventName && eventName.length > 20 ? eventName.substring(0, 18) + '...' : eventName}</Badge>
            {renderTennisStatus()}
          </div>
          <CardTitle className="text-sm font-semibold text-center truncate leading-tight" title={`${competitor1} vs ${competitor2}`}>
            {`${competitor1} vs ${competitor2}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 flex-grow flex items-center justify-center">
          <p className="text-center text-xs text-muted-foreground">{competitionType}</p>
        </CardContent>
      </Card>
    );

  } else if (isEspnEvent) {
    const { event, league, sportType } = eventData.data;
    const competition = event.competitions[0];
    const status = competition.status;

    const renderEspnStatus = () => { // For Card Header
        let liveText = "LIVE";
        if (status.type.state === "in") {
          if (sportType !== 'mma') { 
            if (status.displayClock && status.displayClock !== "0:00") liveText += ` - ${status.displayClock}`;
            if (status.period > 0) liveText += ` P${status.period}`;
          }
          if (status.type.description === "Halftime") liveText = "Halftime";
          return <span className="text-sm text-accent font-semibold animate-pulse">{liveText}</span>;
        }
        if (status.type.state === "pre") {
           if (sportType === 'football' && league.slug === 'nfl') { // NFL pre-game header uses shortDetail
             return <span className="text-sm text-muted-foreground">{status.type.shortDetail}</span>;
           }
          return <span className="text-sm text-muted-foreground">{displayTime || 'Scheduled'}</span>;
        }
        if (status.type.state === "post") {
          return <span className="text-sm text-muted-foreground font-semibold">Final</span>;
        }
      return <span className="text-sm text-muted-foreground">{status.type.shortDetail}</span>;
    };

    const homeTeam = sportType !== 'racing' && sportType !== 'golf' && sportType !== 'mma' ? competition.competitors.find(c => c.homeAway === 'home') : undefined;
    const awayTeam = sportType !== 'racing' && sportType !== 'golf' && sportType !== 'mma' ? competition.competitors.find(c => c.homeAway === 'away') : undefined;
    const getScore = (team?: any) => team?.score ?? '0';
    
    const eventName = event.shortName;
    const eventDateForIndividualSports = competition.date; 
    const circuit = competition.circuit || event.circuit; 

    const renderTeamSportContent = () => {
      if (!homeTeam || !awayTeam) return <p className="text-center text-muted-foreground">Event data not available.</p>;
      
      const isNfl = sportType === 'football' && league.slug === 'nfl';
      const isNcaaf = sportType === 'football' && league.slug === 'college-football';

      return (
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <div className="flex justify-around items-center w-full">
            <div className="flex flex-col items-center w-2/5">
              {homeTeam.team?.logo && (
                <Image src={homeTeam.team.logo} alt={`${homeTeam.team.displayName} logo`} width={32} height={32} className="mb-1 h-8 w-8 object-contain"/>
              )}
              <span className="font-medium text-xs truncate w-full">{homeTeam.team?.displayName}</span>
              {status.type.state === "in" && <span className="text-lg font-bold text-primary">{getScore(homeTeam)}</span>}
            </div>
            
            <div className="text-muted-foreground text-lg font-light">vs</div>
            
            <div className="flex flex-col items-center w-2/5">
              {awayTeam.team?.logo && (
                <Image src={awayTeam.team.logo} alt={`${awayTeam.team.displayName} logo`} width={32} height={32} className="mb-1 h-8 w-8 object-contain"/>
              )}
              <span className="font-medium text-xs truncate w-full">{awayTeam.team?.displayName}</span>
               {status.type.state === "in" && <span className="text-lg font-bold text-primary">{getScore(awayTeam)}</span>}
            </div>
          </div>
          {(isNfl || isNcaaf) && (
            <div className="text-xs text-muted-foreground mt-1">
              {isNfl && (
                <>
                  {status.type.state === 'pre' && (
                    <span>
                      {displayDate && nflEstTime ? `${displayDate} - ${nflEstTime}${event.week?.number ? ` - WEEK ${event.week.number}` : ''}` : (event.week?.number ? `WEEK ${event.week.number}`: status.type.shortDetail)}
                    </span>
                  )}
                  {status.type.state === 'in' && event.week?.number && (
                    <span>WEEK {event.week.number}</span>
                  )}
                </>
              )}
              {isNcaaf && status.type.state === 'pre' && status.type.shortDetail && (
                <span>{status.type.shortDetail}</span>
              )}
            </div>
          )}
        </div>
      );
    };

    const renderIndividualSportContent = () => { 
      if (sportType === 'mma') {
        let mmaStatusElement: React.ReactNode = null;
        if (status.type.state === "in") {
          mmaStatusElement = <p className="text-sm text-accent font-semibold animate-pulse">LIVE NOW!</p>;
        } else if (status.type.state === "post") {
          mmaStatusElement = <p className="text-sm text-muted-foreground font-semibold">FINISHED!</p>;
        } else if (status.type.state === "pre" && eventDateStr) {
          const dateObj = new Date(eventDateStr);
          // Get time in HH:MM AM/PM format
          const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
          // Get date in YYYY-MM-DD format
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getDate()).padStart(2, '0');
          const dateStrOnly = `${year}-${month}-${day}`;
          mmaStatusElement = <p className="text-xs text-muted-foreground">{`${timeStr} - ${dateStrOnly}`}</p>;
        } else {
          mmaStatusElement = <p className="text-xs text-muted-foreground">Scheduled</p>;
        }
        return (
          <div className="text-center py-2">
            {mmaStatusElement}
          </div>
        );
      }

      return (
        <div className="space-y-2 text-center">
          {circuit?.fullName && (
            <div className="flex items-center justify-center text-xs text-muted-foreground">
              <MapPin size={14} className="mr-1 text-primary/70" />
              <span>{circuit.fullName}</span>
            </div>
          )}
          {sportType === 'racing' && status.type.state === 'pre' && eventDateForIndividualSports && (
            <CountdownTimer targetDate={eventDateForIndividualSports} />
          )}
           {sportType === 'golf' && status.type.state === 'pre' && (
             <div className="text-xs text-muted-foreground">
              <CalendarDays size={14} className="mr-1 inline-block text-primary/70" />
              {displayDate ? `${displayDate} - ${displayTime}` : 'Scheduled'}
             </div>
           )}
           {status.type.state === "in" && (sportType === 'racing' || sportType === 'golf') && (
              <p className="text-sm text-accent font-semibold animate-pulse">{status.type.detail || "LIVE"}</p>
           )}
           {status.type.state === "post" && (sportType === 'racing' || sportType === 'golf') && (
              <p className="text-sm text-muted-foreground font-semibold">{status.type.shortDetail || "Finished"}</p>
           )}
        </div>
      );
    };

    return (
      <Card 
        className={cn(
          "shadow-md flex flex-col h-full text-card-foreground",
          isEventEnded
            ? "opacity-70 bg-card"
            : [
                "hover:shadow-lg cursor-pointer",
                isEspnLive ? "bg-accent/10" : "bg-card"
              ]
        )}
        onClick={handleCardClick}
      >
        <CardHeader className="p-3">
          <div className="flex justify-between items-center mb-1">
            <Badge variant="secondary" className="text-xs">{league.abbreviation}</Badge>
            {renderEspnStatus()}
          </div>
          <CardTitle className="text-base font-semibold text-center truncate leading-tight" title={eventName}>
            {eventName}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 flex-grow flex flex-col justify-center">
          {sportType === 'soccer' || sportType === 'football' || sportType === 'basketball' || sportType === 'hockey' || sportType === 'baseball'
            ? renderTeamSportContent()
            : renderIndividualSportContent()
          }
        </CardContent>
         {status.type.state === "in" && status.type.description !== "Halftime" && (sportType === 'soccer' || sportType === 'football' || sportType === 'basketball' || sportType === 'hockey' || sportType === 'baseball') && (
              <p className="text-center text-xs text-muted-foreground pb-2 px-2">{status.type.detail}</p>
          )}
      </Card>
    );
  }
  // Fallback for unknown eventData.type
  return (
    <Card className="shadow-md p-4 bg-card text-card-foreground">
      <p className="text-muted-foreground">Unsupported event type.</p>
    </Card>
  );
}

