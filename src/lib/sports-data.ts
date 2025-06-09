
import type { ReactNode } from 'react';
import { CarFront, Users } from "lucide-react";
import {
  BoxingGloveIcon,
  MmaGlovesIcon,
  TennisRacketIcon,
  CustomBaseballIcon,
  CustomBasketballIcon,
  CustomAmericanFootballIcon,
  CustomFutbolIcon,
  CustomHockeyIcon
} from "@/components/icons/custom-icons";
import type { SportCategory as SportCategoryType } from '@/types'; // Import SportCategory type

export interface SportLeagueOption {
  sport: string;
  league: string;
  name: string;
}

export const SPORT_LEAGUE_OPTIONS_FULL: SportLeagueOption[] = [
  { sport: "football", league: "nfl", name: "NFL (American Football)" },
  { sport: "basketball", league: "nba", name: "NBA (Basketball)" },
  { sport: "hockey", league: "nhl", name: "NHL (Hockey)" },
  { sport: "baseball", league: "mlb", name: "MLB (Baseball)" },
  { sport: "soccer", league: "usa.1", name: "MLS (Soccer USA)" },
  { sport: "soccer", league: "eng.1", name: "Premier League (Soccer ENG)" },
  { sport: "soccer", league: "esp.1", name: "La Liga (Soccer ESP)" },
];

export const sportCategories: SportCategoryType[] = [
  { id: "soccer", name: "Soccer", icon: <CustomFutbolIcon style={{ width: 36, height: 36 }} /> },
  { id: "basketball", name: "Basketball", icon: <CustomBasketballIcon style={{ width: 36, height: 36 }} /> },
  { id: "american-football", name: "NFL", icon: <CustomAmericanFootballIcon style={{ width: 36, height: 36 }} /> },
  { id: "baseball", name: "MLB", icon: <CustomBaseballIcon style={{ width: 36, height: 36 }} /> },
  { id: "hockey", name: "NHL", icon: <CustomHockeyIcon style={{ width: 36, height: 36 }} /> },
  { id: "boxing", name: "Boxing", icon: <BoxingGloveIcon style={{ width: 36, height: 36 }} /> },
  { id: "mma-ufc", name: "MMA/UFC", icon: <MmaGlovesIcon style={{ width: 36, height: 36 }} /> },
  { id: "tennis", name: "Tennis", icon: <TennisRacketIcon style={{ width: 36, height: 36 }} /> },
  { id: "motor-sports", name: "Motor Sports", icon: <CarFront size={36} /> },
  { id: "wrestling-wwe", name: "Wrestling/WWE", icon: <Users size={36} /> },
];
