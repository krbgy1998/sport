
'use client';

import type { 
  EspnScoreboardResponse, 
  UnifiedEventData,
  TennisEventItem,
  CategoryDetails // Direct import for CategoryDetails
} from '@/types';
import { useParams } from 'next/navigation';
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SectionTitle } from '@/components/shared/section-title';
import { EspnScoreCard } from '@/components/scores/espn-score-card';
import { Loader2, Sparkles } from 'lucide-react'; // Added Sparkles
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  SPORT_LEAGUE_OPTIONS_FULL,
  sportCategories as allSportCategoriesData, // Renamed to avoid conflict
  getCategoryDetails as getCategoryDetailsUtil,
} from '@/lib/sports-data.tsx'; // Ensure this imports from .tsx for full details
import { BoxingSpecialFights } from './boxing-special-fights';
import { generateCategoryContent } from '@/ai/flows/generate-category-content'; // Import for client-side fetching

interface CategoryClientContentProps {
  categoryDetails: CategoryDetails | null; // Passed from server
  initialDescription: string | null; // Static description passed from server
}

interface TennisScoreboardResponse {
  sports: Array<{
    leagues: Array<{
      events: TennisEventItem[];
    }>;
  }>;
}

export default function CategoryClientContent({ categoryDetails: initialCategoryDetailsProp, initialDescription }: CategoryClientContentProps) {
  const params = useParams();
  const categoryId = typeof params?.categoryId === 'string' ? params.categoryId : '';
  
  const [categoryDetails, setCategoryDetails] = useState<CategoryDetails | null>(initialCategoryDetailsProp);
  const [dynamicAiDescription, setDynamicAiDescription] = useState<string | null>(null);
  const [isAiDescriptionLoading, setIsAiDescriptionLoading] = useState(false);

  useEffect(() => {
    if (!initialCategoryDetailsProp && categoryId) {
      const details = getCategoryDetailsUtil(categoryId, allSportCategoriesData);
      setCategoryDetails(details);
    } else if (initialCategoryDetailsProp) {
      setCategoryDetails(initialCategoryDetailsProp);
    }
  }, [initialCategoryDetailsProp, categoryId]);

  useEffect(() => {
    if (categoryDetails?.name) {
      setIsAiDescriptionLoading(true);
      generateCategoryContent({ categoryName: categoryDetails.name })
        .then(aiContent => {
          setDynamicAiDescription(aiContent.description);
        })
        .catch(error => {
          console.error(`Failed to generate AI content for category ${categoryDetails.name}:`, error);
          // Keep initialDescription if AI fails
        })
        .finally(() => {
          setIsAiDescriptionLoading(false);
        });
    }
  }, [categoryDetails?.name]);


  const relevantLeagueOptions = useMemo(() => {
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
      if (relevantLeagueOptions.length === 0 && categoryDetails.id !== 'boxing') { 
        setLoadingScores(false);
        return;
      }
      
      if (categoryDetails.id === 'boxing') { 
          setLoadingScores(false); 
          return;
      }

      if (categoryDetails.espnSportKey !== 'mma' && 
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
        const eventDate = new Date(event.date);
        
        const todayForCompare = new Date(); 
        todayForCompare.setHours(0, 0, 0, 0); 
        const isNonTeamSportRecentPost = ['racing', 'golf'].includes(sportType || '') && event.status.type.state === 'post';
        
        if (sportType === 'mma' || (sportType === 'football' && league.slug === 'nfl')) {
          return event.status.type.description !== "Postponed" && (event.status.type.state === 'in' || event.status.type.state === 'pre');
        }

        return (
          event.status.type.description !== "Postponed" &&
          (eventDate >= todayForCompare || event.status.type.state === "in" || isNonTeamSportRecentPost)
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


  if (!categoryDetails && !loadingScores && !initialCategoryDetailsProp) { 
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <SectionTitle title="Category Not Found" />
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>The requested sports category ({categoryId}) does not exist.</AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }
  
  const isLoadingInitialDetails = !categoryDetails && loadingScores;
  const isApiSport = categoryDetails?.id === 'tennis' || (categoryDetails?.espnSportKey && relevantLeagueOptions.length > 0 && categoryDetails?.id !== 'boxing');

  let previousLeagueSlug: string | null = null;
  const displayDescription = dynamicAiDescription || initialDescription;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <SectionTitle title={`${categoryDetails?.name || categoryId} Overview`} />

        {(displayDescription || isAiDescriptionLoading) && (
          <Card className="mb-8 shadow-lg bg-card text-card-foreground">
            <CardHeader>
                 <h3 className="text-xl font-semibold font-headline flex items-center">
                   {categoryDetails?.name || ''} Highlights on sportsurge
                   {isAiDescriptionLoading && <Loader2 className="h-5 w-5 animate-spin text-primary ml-2" />}
                   {!isAiDescriptionLoading && dynamicAiDescription && <Sparkles className="h-5 w-5 text-primary ml-2" />}
                 </h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">
                {displayDescription || "Loading category information..."}
              </p>
            </CardContent>
          </Card>
        )}

        {categoryId === 'boxing' && <BoxingSpecialFights />}

        {(!categoryDetails?.isTennis && categoryDetails?.espnSportKey && relevantLeagueOptions.length === 0 && categoryDetails.id !== 'boxing' && !loadingScores) && (
          <Card className="shadow-lg bg-card text-card-foreground mt-8">
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">No live event data sources configured for {categoryDetails?.name || categoryId} through our current providers.</p>
            </CardContent>
          </Card>
        )}

        {isApiSport && categoryDetails?.id !== 'boxing' && (
          <>
            <SectionTitle title={`${categoryDetails?.name || categoryId} Events`} className="mt-8" />
            <div className="space-y-6">
              {(loadingScores && isApiSport) || isLoadingInitialDetails ? (
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
              ) : eventsToDisplay.length === 0 ? (
                <Card className="shadow-lg bg-card text-card-foreground">
                  <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">
                      No matches or events found for {categoryDetails?.name || ''}
                      {(categoryDetails?.espnSportKey === 'mma' || (categoryDetails?.espnSportKey === 'football' && categoryDetails.id === 'american-football' && relevantLeagueOptions.some(opt => opt.league === 'nfl')))
                        ? '' 
                        : (categoryDetails?.isTennis ? '' : ` on ${displayableDateString}`)}.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {eventsToDisplay.map((item, index) => {
                    let showDivider = false;
                    if (item.type === 'espn' && categoryDetails?.id === 'american-football' && item.data.sportType === 'football') {
                      const currentLeagueSlug = item.data.league.slug;
                      if (previousLeagueSlug && 
                          currentLeagueSlug !== previousLeagueSlug &&
                          (currentLeagueSlug === 'nfl' || currentLeagueSlug === 'college-football') &&
                          (previousLeagueSlug === 'nfl' || previousLeagueSlug === 'college-football')
                      ) {
                        showDivider = true;
                      }
                      previousLeagueSlug = currentLeagueSlug;
                    } else if (categoryDetails?.id === 'american-football') { 
                      previousLeagueSlug = null;
                    }

                    return (
                      <React.Fragment key={`${item.type}-${item.data.id || (item.data as TennisEventItem).competitionId || index}`}>
                        {showDivider && (
                           <div className="col-span-1 md:col-span-2 lg:col-span-3">
                            <Separator className="my-6" />
                          </div>
                        )}
                        <EspnScoreCard eventData={item} />
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
