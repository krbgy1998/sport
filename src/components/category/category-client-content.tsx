
'use client';

import dynamic from 'next/dynamic';
import type {
  EspnScoreboardResponse,
  UnifiedEventData,
  TennisEventItem,
  CategoryDetails
} from '@/types';
import { useParams } from 'next/navigation';
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SectionTitle } from '@/components/shared/section-title';
import { EspnScoreCard } from '@/components/scores/espn-score-card';
import { Loader2, Tv } from 'lucide-react'; 
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  SPORT_LEAGUE_OPTIONS_FULL,
  sportCategories as allSportCategoriesData, 
  getCategoryDetails as getCategoryDetailsUtil,
} from '@/lib/sports-data.tsx'; 
import { Button } from '@/components/ui/button'; 

const DynamicBoxingSpecialFights = dynamic(() => import('./boxing-special-fights').then(mod => mod.BoxingSpecialFights), {
  loading: () => <div className="my-8 px-4 h-96 w-full bg-card rounded-lg animate-pulse"></div>,
  ssr: false
});

const DynamicWweSpecialEvents = dynamic(() => import('./wwe-special-events').then(mod => mod.WweSpecialEvents), {
  loading: () => <div className="my-12 px-4 h-96 w-full bg-card rounded-lg animate-pulse"></div>,
  ssr: false
});

interface CategoryClientContentProps {
  categoryDetails: CategoryDetails | null; 
  initialDescription: string | null; 
}

interface TennisScoreboardResponse {
  sports: Array<{
    leagues: Array<{
      events: TennisEventItem[];
    }>;
  }>;
}

type EventWithDivider = UnifiedEventData & { showLeagueDivider?: boolean };

export default function CategoryClientContent({ categoryDetails: initialCategoryDetailsProp, initialDescription }: CategoryClientContentProps) {
  const params = useParams();
  const categoryIdFromUrl = typeof params?.categoryId === 'string' ? params.categoryId : '';

  const [categoryDetails, setCategoryDetails] = useState<CategoryDetails | null>(initialCategoryDetailsProp);
  const [rawLiveStatus, setRawLiveStatus] = useState<string | null>(null);
  const [smackdownLiveStatus, setSmackdownLiveStatus] = useState<string | null>(null);


  useEffect(() => {
    const currentDay = new Date().getDay(); 
    if (currentDay === 1) { 
      setRawLiveStatus('LIVE NOW!');
    } else {
      setRawLiveStatus('Every Monday 8PM ET');
    }
    if (currentDay === 5) { 
      setSmackdownLiveStatus('LIVE NOW!');
    } else {
      setSmackdownLiveStatus('Every Friday 8PM ET');
    }
  }, []);


  useEffect(() => {
    // This effect ensures categoryDetails state is updated if props change or for dynamic routes
    if (initialCategoryDetailsProp) {
      if (categoryDetails?.id !== initialCategoryDetailsProp.id) {
        setCategoryDetails(initialCategoryDetailsProp);
      }
    } else if (categoryIdFromUrl) {
        const details = getCategoryDetailsUtil(categoryIdFromUrl, allSportCategoriesData);
        setCategoryDetails(details);
    }
  }, [initialCategoryDetailsProp, categoryIdFromUrl, categoryDetails?.id]);


  const relevantLeagueOptions = useMemo(() => {
    // Use the categoryDetails from state, as it's the most up-to-date source within the component
    if (!categoryDetails || categoryDetails.isTennis || !categoryDetails.espnSportKey) return [];
    if (categoryDetails.id === 'american-football') {
      return SPORT_LEAGUE_OPTIONS_FULL.filter(opt => opt.sport === 'football' && (opt.league === 'nfl' || opt.league === 'college-football'));
    }
    return SPORT_LEAGUE_OPTIONS_FULL.filter(opt => opt.sport === categoryDetails.espnSportKey);
  }, [categoryDetails]);

  const [allEventsData, setAllEventsData] = useState<UnifiedEventData[]>([]);
  const [loadingScores, setLoadingScores] = useState(true);
  const [errorScores, setErrorScores] = useState<string | null>(null);
  const [formattedDate, setFormattedDate] = useState('');
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
    // Use categoryDetails from state for fetching logic
    if (!categoryDetails) {
      setLoadingScores(false);
      return;
    }

    setLoadingScores(true);
    setErrorScores(null);
    setAllEventsData([]);

    if (categoryDetails.isTennis) {
      const fetchTennisData = async () => {
        try {
          const apiUrl = `https://site.web.api.espn.com/apis/personalized/v2/scoreboard/header?sport=tennis`;
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error(`Network response for tennis was not ok (${response.status})`);
          }
          const tennisData: TennisScoreboardResponse = await response.json();

          const processedTennisEvents: UnifiedEventData[] = [];
          tennisData.sports.forEach(sport => {
            sport.leagues.forEach(league => {
              league.events.forEach(event => {
                if (event.competitors && event.competitors.length >= 2) {
                   processedTennisEvents.push({ type: 'tennis', data: { ...event, id: event.id || event.competitionId } });
                } else {
                   console.warn("Tennis event skipped due to missing competitors or ID:", event);
                }
              });
            });
          });
          setAllEventsData(processedTennisEvents);
        } catch (err) {
          console.error(`Failed to fetch tennis data:`, err);
          setErrorScores(err instanceof Error ? err.message : String(err));
        } finally {
          setLoadingScores(false);
        }
      };
      fetchTennisData();
    } else if (categoryDetails.espnSportKey) {
      if (relevantLeagueOptions.length === 0 && categoryDetails.id !== 'boxing' && categoryDetails.id !== 'wrestling-wwe') {
        setLoadingScores(false);
        return;
      }

      if (categoryDetails.id === 'boxing' || categoryDetails.id === 'wrestling-wwe') {
          setLoadingScores(false);
          return;
      }

      if (categoryDetails.espnSportKey !== 'mma' &&
          categoryDetails.espnSportKey !== 'racing' &&
          !(categoryDetails.espnSportKey === 'football' && relevantLeagueOptions.some(opt => opt.league === 'nfl')) &&
          !formattedDate) {
        setLoadingScores(false);
        return;
      }

      const fetchEspnData = async () => {
        try {
          const promises = relevantLeagueOptions.map(async (leagueOption) => {
            let apiUrl = `https://site.api.espn.com/apis/site/v2/sports/${leagueOption.sport}/${leagueOption.league}/scoreboard`;

             if (leagueOption.sport !== 'mma' &&
                 leagueOption.sport !== 'racing' &&
                !(leagueOption.sport === 'football' && leagueOption.league === 'nfl') &&
                formattedDate) {
              apiUrl += `?dates=${formattedDate}`;
            }

            const response = await fetch(apiUrl);
            if (!response.ok) {
              console.error(`Failed to fetch data for ${leagueOption.name}: ${response.status} ${response.statusText}`);
              return [];
            }
            const jsonData: EspnScoreboardResponse = await response.json();
            const leagueInfo = jsonData.leagues[0];
            const sportType = leagueOption.sport;

            if (!leagueInfo || !jsonData.events) return [];

            return jsonData.events.map(event => ({
              type: 'espn',
              data: { event: {...event, leagueId: leagueInfo.id }, league: leagueInfo, sportType }
            } as UnifiedEventData));
          });

          const results = await Promise.allSettled(promises);
          const aggregatedEvents: UnifiedEventData[] = results
            .filter(result => result.status === 'fulfilled')
            .flatMap(result => (result as PromiseFulfilledResult<UnifiedEventData[]>).value);

          setAllEventsData(aggregatedEvents);

        } catch (err) {
          console.error(`Failed to fetch data for ${categoryDetails.name}:`, err);
          setErrorScores(err instanceof Error ? err.message : String(err));
        } finally {
          setLoadingScores(false);
        }
      };
      fetchEspnData();
    } else {
      setLoadingScores(false);
    }
  }, [formattedDate, categoryDetails, relevantLeagueOptions]);


  const eventsToDisplay = useMemo(() => {
    return allEventsData.filter(item => {
      if (item.type === 'espn') {
        const { event, sportType, league } = item.data;

        if (event.status.type.description === "Postponed") return false;

        if (sportType === 'racing') {
          return event.status.type.state === 'in' || event.status.type.state === 'pre';
        }

        if (sportType === 'mma' || (sportType === 'football' && league.slug === 'nfl')) {
          return event.status.type.state === 'in' || event.status.type.state === 'pre';
        }

        const eventDate = new Date(event.date);
        const todayForCompare = new Date();
        todayForCompare.setHours(0, 0, 0, 0);
        const isNonTeamSportRecentPost = ['golf'].includes(sportType || '') && event.status.type.state === 'post';

        return (
          eventDate >= todayForCompare || event.status.type.state === "in" || isNonTeamSportRecentPost
        );

      } else if (item.type === 'tennis') {
        if (item.data.status === 'postponed' || item.data.status === 'canceled') return false;
        if (item.data.status === 'pre' && !item.data.date) return false;

        const status = item.data.status?.toLowerCase();
        return status === 'in' || status === 'pre' || status === 'post' || status?.includes('scheduled') || status?.includes('progress') || status?.includes('final') || status?.includes('completed');
      }
      return false;
    }).sort((a, b) => {
        const dateA = new Date(a.data.date);
        const dateB = new Date(b.data.date);

        if (a.type === 'espn' && b.type === 'espn' && categoryDetails?.id === 'american-football') {
            const leagueSlugA = a.data.league.slug;
            const leagueSlugB = b.data.league.slug;

            const getLeagueOrder = (slug: string) => {
            if (slug === 'nfl') return 1;
            if (slug === 'college-football') return 2;
            return 3;
            };

            const orderA = getLeagueOrder(leagueSlugA);
            const orderB = getLeagueOrder(leagueSlugB);

            if (orderA !== orderB) {
            return orderA - orderB;
            }
        }

        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0;
        return dateA.getTime() - dateB.getTime();
    });
  }, [allEventsData, categoryDetails]);

  const processEventsForDisplay = (
    events: UnifiedEventData[],
    filterFn: (item: UnifiedEventData) => boolean
  ): EventWithDivider[] => {
    return events
      .filter(filterFn)
      .map((item, index, arr) => {
        let showLeagueDivider = false;
        if (item.type === 'espn' && categoryDetails?.id === 'american-football' && item.data.sportType === 'football') {
          const currentLeagueSlug = item.data.league.slug;
          const previousItemInGroup = index > 0 ? arr[index - 1] : null;
          const previousLeagueSlugInGroup =
            previousItemInGroup &&
            previousItemInGroup.type === 'espn' &&
            previousItemInGroup.data.sportType === 'football'
              ? previousItemInGroup.data.league.slug
              : null;

          if (
            previousLeagueSlugInGroup &&
            currentLeagueSlug !== previousLeagueSlugInGroup &&
            (currentLeagueSlug === 'nfl' || currentLeagueSlug === 'college-football') &&
            (previousLeagueSlugInGroup === 'nfl' || previousLeagueSlugInGroup === 'college-football')
          ) {
            showLeagueDivider = true;
          }
        }
        return { ...item, showLeagueDivider };
      });
  };

  const liveEvents = useMemo(
    () => processEventsForDisplay(eventsToDisplay, item => {
      if (item.type === 'espn') return item.data.event.status.type.state === 'in';
      if (item.type === 'tennis') {
        const status = item.data.status?.toLowerCase();
        return status === 'in' || status?.includes('progress') || status?.includes('live');
      }
      return false;
    }),
    [eventsToDisplay, categoryDetails]
  );

  const scheduledEvents = useMemo(
    () => processEventsForDisplay(eventsToDisplay, item => {
      if (item.type === 'espn') return item.data.event.status.type.state === 'pre';
      if (item.type === 'tennis') {
        const status = item.data.status?.toLowerCase();
        if (status === 'postponed' || status === 'canceled') return false;
        return status === 'pre' || status?.includes('scheduled');
      }
      return false;
    }),
    [eventsToDisplay, categoryDetails]
  );

  const finalEvents = useMemo(
    () => processEventsForDisplay(eventsToDisplay, item => {
      if (item.type === 'espn') return item.data.event.status.type.state === 'post';
      if (item.type === 'tennis') {
        const status = item.data.status?.toLowerCase();
        return status === 'post' || status?.includes('final') || status?.includes('completed') || status === "ft";
      }
      return false;
    }),
    [eventsToDisplay, categoryDetails]
  );


  // This handles the case where category details could not be found (e.g. bad dynamic route)
  if (!categoryDetails && !loadingScores && categoryIdFromUrl) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <SectionTitle as="h1" title={`Sportsurge ${categoryIdFromUrl}`} />
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>The requested sports category ({categoryIdFromUrl}) does not exist.</AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Handles loading state if categoryDetails are still being determined (e.g. on initial load of dynamic route)
  if (!categoryDetails && loadingScores) {
     return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }


  const isApiSport = categoryDetails?.id === 'tennis' || (categoryDetails?.espnSportKey && relevantLeagueOptions.length > 0 && categoryDetails?.id !== 'boxing' && categoryDetails?.id !== 'wrestling-wwe');

  const hasAnyEvents = liveEvents.length > 0 || scheduledEvents.length > 0 || finalEvents.length > 0;

  const renderEventGroup = (events: EventWithDivider[], groupTitle?: string) => {
    if (events.length === 0) return null;
    return (
      <>
        {groupTitle && <h3 className="text-2xl font-semibold mt-6 mb-4 text-center md:text-left font-headline">{groupTitle}</h3>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((itemWithDivider, index) => (
            <React.Fragment key={`${itemWithDivider.type}-${itemWithDivider.data.id || (itemWithDivider.data as TennisEventItem).competitionId || index}`}>
              {itemWithDivider.showLeagueDivider && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                  <Separator className="my-6" />
                </div>
              )}
              <EspnScoreCard eventData={itemWithDivider} />
            </React.Fragment>
          ))}
        </div>
      </>
    );
  };


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <SectionTitle as="h1" title={`Sportsurge ${categoryDetails?.name || ''}`} />

        {initialDescription && (
          <Card className="mb-8 shadow-lg bg-card text-card-foreground">
            <CardHeader>
                 <h3 className="text-xl font-semibold font-headline flex items-center">
                   {categoryDetails?.name || ''} Highlights on sportsurge
                 </h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">
                {initialDescription}
              </p>
            </CardContent>
          </Card>
        )}

        {categoryDetails?.id === 'boxing' && <DynamicBoxingSpecialFights />}

        {categoryDetails?.id === 'wrestling-wwe' && !loadingScores && (
          <>
           <Card className="shadow-lg bg-card text-card-foreground mt-8">
           <CardHeader>
             <h3 className="text-xl font-semibold font-headline text-center">WWE Weekly Shows</h3>
           </CardHeader>
           <CardContent className="p-6">
             <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg bg-secondary/30 hover:shadow-md transition-shadow">
                  <div className="flex-grow mb-2 sm:mb-0">
                    <h4 className="text-lg font-medium text-primary hover:underline">
                      <a href="http://v3.sportsurge.uno/#WWE Raw" target="_blank" rel="noopener noreferrer">
                        WWE Monday Night Raw
                      </a>
                    </h4>
                    <p className={`text-sm ${rawLiveStatus === 'LIVE NOW!' ? 'text-destructive font-semibold animate-pulse' : 'text-muted-foreground'}`}>
                      {rawLiveStatus || 'Every Monday 8PM ET'}
                    </p>
                  </div>
                  {rawLiveStatus === 'LIVE NOW!' && (
                     <Button asChild variant="default" size="sm" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                       <a href="http://v3.sportsurge.uno/#WWE Raw" target="_blank" rel="noopener noreferrer">
                         <Tv className="mr-2 h-4 w-4" /> Watch Live
                       </a>
                     </Button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg bg-secondary/30 hover:shadow-md transition-shadow">
                  <div className="flex-grow mb-2 sm:mb-0">
                    <h4 className="text-lg font-medium text-primary hover:underline">
                       <a href="http://v3.sportsurge.uno/#WWE SmackDown" target="_blank" rel="noopener noreferrer">
                        WWE SmackDown
                       </a>
                    </h4>
                     <p className={`text-sm ${smackdownLiveStatus === 'LIVE NOW!' ? 'text-destructive font-semibold animate-pulse' : 'text-muted-foreground'}`}>
                      {smackdownLiveStatus || 'Every Friday 8PM ET'}
                    </p>
                  </div>
                   {smackdownLiveStatus === 'LIVE NOW!' && (
                     <Button asChild variant="default" size="sm" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                        <a href="http://v3.sportsurge.uno/#WWE SmackDown" target="_blank" rel="noopener noreferrer">
                          <Tv className="mr-2 h-4 w-4" /> Watch Live
                        </a>
                     </Button>
                  )}
                </div>
             </div>
             <p className="mt-6 text-xs text-muted-foreground text-center">
                 Tune in to catch all the electrifying action from WWE. Note: Schedules are subject to change. Always check official WWE listings for the most up-to-date broadcast times and channels in your region.
             </p>
           </CardContent>
         </Card>
         <DynamicWweSpecialEvents />
         </>
        )}

        {(!categoryDetails?.isTennis &&
          categoryDetails?.espnSportKey &&
          relevantLeagueOptions.length === 0 &&
          categoryDetails?.id !== 'boxing' &&
          categoryDetails?.id !== 'wrestling-wwe' &&
          !loadingScores) && (
          <Card className="shadow-lg bg-card text-card-foreground mt-8">
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">No live event data sources configured for {categoryDetails?.name || categoryIdFromUrl} through our current providers.</p>
            </CardContent>
          </Card>
        )}

        {isApiSport && categoryDetails?.id !== 'boxing' && categoryDetails?.id !== 'wrestling-wwe' && (
          <>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mt-8 mb-6 font-headline text-center md:text-left">{categoryDetails?.name || ''} Events</h2>
            <div className="space-y-6">
              {loadingScores ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="ml-4 text-muted-foreground">Loading events...</p>
                </div>
              ) : errorScores ? (
                <Alert variant="destructive" className="shadow-md">
                  <AlertTitle>Error Fetching Events</AlertTitle>
                  <AlertDescription>
                    Could not load all events for {categoryDetails?.name}. Please try again later. ({errorScores})
                  </AlertDescription>
                </Alert>
              ) : !hasAnyEvents ? (
                <Card className="shadow-lg bg-card text-card-foreground">
                  <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">
                      No matches or events found for {categoryDetails?.name || ''}
                      {(categoryDetails?.espnSportKey === 'mma' ||
                        categoryDetails?.espnSportKey === 'racing' ||
                        (categoryDetails?.espnSportKey === 'football' && categoryDetails.id === 'american-football' && relevantLeagueOptions.some(opt => opt.league === 'nfl')))
                        ? ''
                        : (categoryDetails?.isTennis ? '' : ` on ${displayableDateString}`)}.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {renderEventGroup(liveEvents, liveEvents.length > 0 ? "Live Events" : undefined)}
                  {liveEvents.length > 0 && (scheduledEvents.length > 0 || finalEvents.length > 0) && <Separator className="my-8" />}
                  {renderEventGroup(scheduledEvents, scheduledEvents.length > 0 ? "Upcoming Events" : undefined)}
                  {(liveEvents.length > 0 || scheduledEvents.length > 0) && finalEvents.length > 0 && <Separator className="my-8" />}
                  {renderEventGroup(finalEvents, finalEvents.length > 0 ? "Recent Results" : undefined)}
                </>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}


    