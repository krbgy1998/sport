
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export interface SportCategory {
  id: string;
  name: string;
  icon: ReactNode; // Allows for LucideIcon or custom SVG components
  // New SEO fields
  pageTitle?: string;       // For the <title> tag
  metaDescription?: string; // For <meta name="description">
  onPageContent?: string;   // For displaying descriptive content on the page itself
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  date: string;
  content: string; // Full content for AI summarization
  imageAiHint?: string;
}

// Types for ESPN Scoreboard API (General Sports)
export interface EspnTeam {
  id: string;
  uid: string;
  location: string;
  name: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName: string;
  color?: string;
  alternateColor?: string;
  logo?: string;
  links?: Array<{ rel: string[]; href: string; text: string }>;
}

export interface EspnScoreDetails {
  value: number;
  displayValue: string;
}

export interface EspnCompetitor {
  id: string;
  uid: string;
  type: string;
  order: number;
  homeAway?: 'home' | 'away';
  winner?: boolean;
  team?: EspnTeam;
  athlete?: EspnTeam; // For individual sports like Golf, Tennis. Structure often similar to EspnTeam.
  score?: string;
  linescores?: EspnScoreDetails[];
  records?: Array<{ name: string; abbreviation?: string; type: string; summary: string }>;
}

export interface EspnCircuit {
  id?: string;
  fullName?: string;
}
export interface EspnCompetition {
  id: string;
  uid: string;
  date: string; // ISO Date string
  attendance?: number;
  type: { id: string; abbreviation: string };
  timeValid: boolean;
  neutralSite: boolean;
  conferenceCompetition?: boolean;
  playByPlayAvailable?: boolean;
  recent: boolean;
  competitors: EspnCompetitor[];
  status: EspnStatus;
  broadcasts?: Array<{ market: string; names: string[] }>;
  startDate: string; // ISO Date string
  circuit?: EspnCircuit;
  notes?: Array<{type: string, headline: string}>;
}

export interface EspnStatus {
  clock: number;
  displayClock: string;
  period: number;
  type: {
    id: string;
    name: string;
    state: 'pre' | 'in' | 'post';
    completed: boolean;
    description: string;
    detail: string;
    shortDetail: string;
  };
}

export interface EspnEvent {
  id: string;
  uid: string;
  date: string; // ISO date string
  name: string;
  shortName: string;
  season: { year: number; type: number; slug: string };
  competitions: EspnCompetition[];
  links: Array<{ language: string; rel: string[]; href: string; text: string; shortText: string; isExternal: boolean; isPremium: boolean }>;
  status: EspnStatus;
  circuit?: EspnCircuit;
  leagueId?: string;
  week?: { number: number; text?: string }; // Added for NFL week
}

export interface EspnLeagueInfo {
  id: string;
  uid: string;
  name: string;
  abbreviation: string;
  slug: string;
  sport?: { id: string, uid: string, name: string, slug: string };
}

export interface EspnScoreboardResponse {
  leagues: EspnLeagueInfo[];
  season: { type: number; year: number };
  week?: { number: number };
  events: EspnEvent[];
}

// Types for ESPN Tennis API (/personalized/v2/scoreboard/header?sport=tennis)
export interface TennisCompetitor {
  id?: string; // API might have ID
  displayName: string;
  order?: number;
  // Add other relevant fields if needed from API
}

export interface TennisEventItem {
  id: string; // Usually event.id or event.competitionId can serve as a unique key
  name: string; // Full name of the event (e.g., "BNP Paribas Open")
  location?: string; // Location (e.g., "Indian Wells, USA")
  competitionId: string; // Competition ID (e.g., "154445")
  competitionType?: { text: string }; // Competition type (e.g., "Men's Singles")
  status: 'pre' | 'in' | 'post' | string; // Event status ("pre", "in", "post", "STATUS_SCHEDULED", etc.)
  date: string; // ISO Date string
  competitors: TennisCompetitor[];
  // Add any other fields from the actual API response if needed
}

export interface TennisLeague {
  name: string;
  events: TennisEventItem[];
  // Add other relevant fields
}

export interface TennisSport {
  name: string;
  leagues: TennisLeague[];
  // Add other relevant fields
}

export interface TennisScoreboardResponse {
  sports: TennisSport[];
  // Add other top-level fields if any
}

// Unified type for event data used in CategoryPage
export interface EventWithLeagueAndSportType {
  event: EspnEvent;
  league: EspnLeagueInfo;
  sportType: string;
}

export type UnifiedEventData =
  | { type: 'espn'; data: EventWithLeagueAndSportType }
  | { type: 'tennis'; data: TennisEventItem };

