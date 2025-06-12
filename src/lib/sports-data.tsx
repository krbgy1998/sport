
import type { ReactNode } from 'react';
import Image from 'next/image'; // Import next/image
// Lucide icons still used for some categories if not overridden by images
import { CarFront, Users } from 'lucide-react';

// Custom SVG Icons (some might be replaced by images below)
import {
  BoxingGloveIcon,
  MmaGlovesIcon,
  TennisRacketIcon,
  CustomBaseballIcon,
  CustomBasketballIcon,
  CustomAmericanFootballIcon,
  CustomFutbolIcon,
  CustomHockeyIcon,
  CustomGolfIcon,
} from "@/components/icons/custom-icons";
import type { SportCategory as SportCategoryType } from '@/types';

export interface SportLeagueOption {
  sport: string; // ESPN sport key (e.g., 'football', 'soccer', 'racing', 'golf', 'mma')
  league: string; // ESPN league slug (e.g., 'nfl', 'eng.1', 'f1', 'pga', 'ufc')
  name: string;   // User-friendly display name (e.g., "NFL (American Football)", "Premier League (Soccer ENG)")
}

// Interface for category details, used by both generateMetadata and client page
export interface CategoryDetails extends SportCategoryType {
  espnSportKey?: string;
  isTennis?: boolean;
}

// Utility function to get category details
export const getCategoryDetails = (categoryId: string, categories: SportCategoryType[]): CategoryDetails | null => {
  const category = categories.find(cat => cat.id === categoryId);
  if (!category) return null;

  let espnSportKey = categoryId; // Default to categoryId
  let isTennis = false;

  switch (categoryId) {
    case 'tennis':
      isTennis = true;
      espnSportKey = 'tennis';
      break;
    case 'american-football':
      espnSportKey = 'football';
      break;
    case 'motor-sports':
      espnSportKey = 'racing';
      break;
    case 'mma-ufc':
      espnSportKey = 'mma';
      break;
    case 'golf':
      espnSportKey = 'golf';
      break;
    // 'soccer' maps to 'soccer'
    // 'basketball' maps to 'basketball'
    // 'baseball' maps to 'baseball'
    // 'hockey' maps to 'hockey'
    // 'boxing' - no specific ESPN sport key for general boxing scoreboards in the same format.
  }

  return {
    ...category,
    espnSportKey: espnSportKey,
    isTennis: isTennis,
  };
};


const userProvidedSoccerLeagues = [
    { id: 'UEFAChampionsLeague', slug: 'UEFA.CHAMPIONS', type: 'soccer' },
    { id: 'UEFAEuropaLeague', slug: 'UEFA.EUROPA', type: 'soccer' },
    { id: 'UEFAEuropaConferenceLeague', slug: 'UEFA.EUROPA.CONF', type: 'soccer' },
    { id: 'EnglishPremierLeague', slug: 'ENG.1', type: 'soccer' },
    { id: 'EnglishFACup', slug: 'ENG.FA', type: 'soccer' },
    { id: 'EnglishCarabaoCup', slug: 'ENG.LEAGUE_CUP', type: 'soccer' },
    { id: 'SpanishLaLiga', slug: 'ESP.1', type: 'soccer' },
    { id: 'SpanishCopadelRey', slug: 'ESP.COPA_DEL_REY', type: 'soccer' },
    { id: 'GermanBundesliga', slug: 'GER.1', type: 'soccer' },
    { id: 'MLS', slug: 'USA.1', type: 'soccer' },
    { id: 'ConcacafChampionsLeague', slug: 'CONCACAF.CHAMPIONS', type: 'soccer' },
    { id: 'ItalianSerieA', slug: 'ITA.1', type: 'soccer' },
    { id: 'FrenchLigue1', slug: 'FRA.1', type: 'soccer' },
    { id: 'CoupedeFrance', slug: 'FRA.COUPE_DE_FRANCE', type: 'soccer' },
    { id: 'MexicanLigaBBVAMX', slug: 'MEX.1', type: 'soccer' },
    { id: 'EnglishLeagueChampionship', slug: 'ENG.2', type: 'soccer' },
    { id: 'CoppaItalia', slug: 'ITA.COPPA_ITALIA', type: 'soccer' },
    { id: 'SaudiKingsCup', slug: 'KSA.KINGS.CUP', type: 'soccer' },
    { id: 'ScottishPremiership', slug: 'SCO.1', type: 'soccer' },
    { id: 'ScottishCup', slug: 'SCO.TENNENTS', type: 'soccer' },
    { id: 'LeaguesCup', slug: 'CONCACAF.LEAGUES.CUP', type: 'soccer' },
    { id: 'MexicanLigadeExpansiónMX', slug: 'MEX.2', type: 'soccer' },
    { id: 'MexicanCopaMX', slug: 'MEX.COPA_MX', type: 'soccer' },
    { id: 'AustralianALeagueMen', slug: 'AUS.1', type: 'soccer' },
    { id: 'CONMEBOLLibertadores', slug: 'CONMEBOL.LIBERTADORES', type: 'soccer' },
    { id: 'TurkishSuperLig', slug: 'TUR.1', type: 'soccer' },
    { id: 'InternationalFriendly', slug: 'FIFA.FRIENDLY', type: 'soccer' },
    { id: 'FIFAWorldCup', slug: 'FIFA.WORLD', type: 'soccer' },
    { id: 'FIFAWorldCupQualifyingCONMEBOL', slug: 'FIFA.WORLDQ.CONMEBOL', type: 'soccer' },
    { id: 'FIFAWorldCupQualifyingConcacaf', slug: 'FIFA.WORLDQ.CONCACAF', type: 'soccer' },
    { id: 'FIFAWorldCupQualifyingUEFA', slug: 'FIFA.WORLDQ.UEFA', type: 'soccer' },
    { id: 'FIFAWorldCupQualifyingCAF', slug: 'FIFA.WORLDQ.CAF', type: 'soccer' },
    { id: 'FIFAWorldCupQualifyingAFC', slug: 'FIFA.WORLDQ.AFC', type: 'soccer' },
    { id: 'FIFAWorldCupQualifyingOFC', slug: 'FIFA.WORLDQ.OFC', type: 'soccer' },
    { id: 'FIFAWorldCupQualifyingAFCCONMEBOLPlayoff', slug: 'FIFA.WORLDQ.AFC.CONMEBOL', type: 'soccer' },
    { id: 'FIFAWorldCupQualifyingConcacafOFCPlayoff', slug: 'FIFA.WORLDQ.CONCACAF.OFC', type: 'soccer' },
    { id: 'FIFAClubWorldCup', slug: 'FIFA.CWC', type: 'soccer' },
    { id: 'ConcacafGoldCup', slug: 'CONCACAF.GOLD', type: 'soccer' },
    { id: 'ConcacafGoldCupQualifying', slug: 'CONCACAF.GOLD_QUAL', type: 'soccer' },
    { id: 'ConcacafNationsLeague', slug: 'CONCACAF.NATIONS.LEAGUE', type: 'soccer' },
    { id: 'ConcacafNationsLeagueQualifying', slug: 'CONCACAF.NATIONS.LEAGUE_QUAL', type: 'soccer' },
    { id: 'ConcacafCup', slug: 'CONCACAF.CONFEDERATIONS_PLAYOFF', type: 'soccer' },
    { id: 'UEFAEuropeanChampionshipQualifying', slug: 'UEFA.EUROPA_QUAL', type: 'soccer' },
    { id: 'UEFAEuropeanChampionship', slug: 'UEFA.EURO', type: 'soccer' },
    { id: 'UEFANationsLeague', slug: 'UEFA.NATIONS', type: 'soccer' },
    { id: 'CONMEBOLUEFACupofChampions', slug: 'GLOBAL.FINALISSIMA', type: 'soccer' },
    { id: 'CopaAmérica', slug: 'CONMEBOL.AMERICA', type: 'soccer' },
    { id: 'AFCAsianCup', slug: 'AFC.ASIAN.CUP', type: 'soccer' },
    { id: 'AFCAsianCupQualifiers', slug: 'AFC.CUPQ', type: 'soccer' },
    { id: 'AfricanNationsChampionship', slug: 'CAF.CHAMPIONSHIP', type: 'soccer' },
    { id: 'AfricaCupofNations', slug: 'CAF.NATIONS', type: 'soccer' },
    { id: 'AfricaCupofNationsQualifying', slug: 'CAF.NATIONS_QUAL', type: 'soccer' },
    { id: 'AfricanNationsChampionshipQualifying', slug: 'CAF.CHAMPIONSHIP_QUAL', type: 'soccer' },
    { id: 'WAFUCupofNations', slug: 'WAFU.NATIONS', type: 'soccer' },
    { id: 'FIFAConfederationsCup', slug: 'FIFA.CONFEDERATIONS', type: 'soccer' },
    { id: 'NonFIFAFriendly', slug: 'NONFIFA', type: 'soccer' },
    { id: 'ScottishLeagueCup', slug: 'SCO.CIS', type: 'soccer' },
    { id: 'SpanishLALIGA2', slug: 'ESP.2', type: 'soccer' },
    { id: 'German2Bundesliga', slug: 'GER.2', type: 'soccer' },
    { id: 'SwissSuperLeague', slug: 'SUI.1', type: 'soccer' },
    { id: 'InternationalChampionsCup', slug: 'GLOBAL.CHAMPS_CUP', type: 'soccer' },
    { id: 'NCAAMensSoccer', slug: 'USA.NCAA.M.1', type: 'soccer' },
    { id: 'UEFAChampionsLeagueQualifying', slug: 'UEFA.CHAMPIONS_QUAL', type: 'soccer' },
    { id: 'UEFAEuropaLeagueQualifying', slug: 'UEFA.EUROPA_QUAL', type: 'soccer' },
    { id: 'UEFAEuropaConferenceLeagueQualifying', slug: 'UEFA.EUROPA.CONF_QUAL', type: 'soccer' },
    { id: 'CONMEBOLUEFAClubChallenge', slug: 'GLOBAL.CLUB_CHALLENGE', type: 'soccer' },
    { id: 'UEFASuperCup', slug: 'UEFA.SUPER_CUP', type: 'soccer' },
    { id: 'SpanishSupercopa', slug: 'ESP.SUPER_CUP', type: 'soccer' },
    { id: 'FrenchTropheedesChampions', slug: 'FRA.SUPER_CUP', type: 'soccer' },
    { id: 'EnglishFACommunityShield', slug: 'ENG.CHARITY', type: 'soccer' },
    { id: 'ItalianSupercoppa', slug: 'ITA.SUPER_CUP', type: 'soccer' },
    { id: 'GermanDFLSupercup', slug: 'GER.SUPER_CUP', type: 'soccer' },
    { id: 'AudiCup', slug: 'GER.AUDI_CUP', type: 'soccer' },
    { id: 'DutchJohanCruyffShield', slug: 'NED.SUPERCUP', type: 'soccer' },
    { id: 'ClubFriendly', slug: 'CLUB.FRIENDLY', type: 'soccer' },
    { id: 'EmiratesCup', slug: 'FRIENDLY.EMIRATES_CUP', type: 'soccer' },
    { id: 'MensOlympicTournament', slug: 'FIFA.OLYMPICS', type: 'soccer' },
    { id: 'EnglishEFLTrophy', slug: 'ENG.TROPHY', type: 'soccer' },
];

const displayNameMap: Record<string, string> = {
    'UEFAChampionsLeague': 'UEFA Champions League',
    'UEFAEuropaLeague': 'UEFA Europa League',
    'UEFAEuropaConferenceLeague': 'UEFA Europa Conference League',
    'EnglishPremierLeague': 'Premier League (ENG)',
    'EnglishFACup': 'FA Cup (ENG)',
    'EnglishCarabaoCup': 'Carabao Cup (ENG)',
    'SpanishLaLiga': 'La Liga (ESP)',
    'SpanishCopadelRey': 'Copa del Rey (ESP)',
    'GermanBundesliga': 'Bundesliga (GER)',
    'MLS': 'MLS (USA)',
    'ConcacafChampionsLeague': 'CONCACAF Champions League',
    'ItalianSerieA': 'Serie A (ITA)',
    'FrenchLigue1': 'Ligue 1 (FRA)',
    'CoupedeFrance': 'Coupe de France (FRA)',
    'MexicanLigaBBVAMX': 'Liga BBVA MX (MEX)',
    'EnglishLeagueChampionship': 'Championship (ENG)',
    'CoppaItalia': 'Coppa Italia (ITA)',
    'SaudiKingsCup': 'King\'s Cup (KSA)',
    'ScottishPremiership': 'Scottish Premiership (SCO)',
    'ScottishCup': 'Scottish Cup (SCO)',
    'LeaguesCup': 'Leagues Cup',
    'MexicanLigadeExpansiónMX': 'Liga de Expansión MX (MEX)',
    'MexicanCopaMX': 'Copa MX (MEX)',
    'AustralianALeagueMen': 'A-League Men (AUS)',
    'CONMEBOLLibertadores': 'CONMEBOL Libertadores',
    'TurkishSuperLig': 'Süper Lig (TUR)',
    'InternationalFriendly': 'International Friendly',
    'FIFAWorldCup': 'FIFA World Cup',
    'FIFAWorldCupQualifyingCONMEBOL': 'FIFA WC Qualifying (CONMEBOL)',
    'FIFAWorldCupQualifyingConcacaf': 'FIFA WC Qualifying (CONCACAF)',
    'FIFAWorldCupQualifyingUEFA': 'FIFA WC Qualifying (UEFA)',
    'FIFAWorldCupQualifyingCAF': 'FIFA WC Qualifying (CAF)',
    'FIFAWorldCupQualifyingAFC': 'FIFA WC Qualifying (AFC)',
    'FIFAWorldCupQualifyingOFC': 'FIFA WC Qualifying (OFC)',
    'FIFAWorldCupQualifyingAFCCONMEBOLPlayoff': 'FIFA WC Playoff (AFC-CONMEBOL)',
    'FIFAWorldCupQualifyingConcacafOFCPlayoff': 'FIFA WC Playoff (CONCACAF-OFC)',
    'FIFAClubWorldCup': 'FIFA Club World Cup',
    'ConcacafGoldCup': 'CONCACAF Gold Cup',
    'ConcacafGoldCupQualifying': 'CONCACAF Gold Cup Qualifying',
    'ConcacafNationsLeague': 'CONCACAF Nations League',
    'ConcacafNationsLeagueQualifying': 'CONCACAF Nations League Qualifying',
    'ConcacafCup': 'CONCACAF Cup',
    'UEFAEuropeanChampionshipQualifying': 'UEFA EURO Qualifying',
    'UEFAEuropeanChampionship': 'UEFA European Championship (EUROs)',
    'UEFANationsLeague': 'UEFA Nations League',
    'CONMEBOLUEFACupofChampions': 'Finalissima',
    'CopaAmérica': 'Copa América',
    'AFCAsianCup': 'AFC Asian Cup',
    'AFCAsianCupQualifiers': 'AFC Asian Cup Qualifiers',
    'AfricanNationsChampionship': 'African Nations Championship (CHAN)',
    'AfricaCupofNations': 'Africa Cup of Nations (AFCON)',
    'AfricaCupofNationsQualifying': 'AFCON Qualifying',
    'AfricanNationsChampionshipQualifying': 'CHAN Qualifying',
    'WAFUCupofNations': 'WAFU Cup of Nations',
    'FIFAConfederationsCup': 'FIFA Confederations Cup',
    'NonFIFAFriendly': 'Non-FIFA Friendly',
    'ScottishLeagueCup': 'Scottish League Cup (SCO)',
    'SpanishLALIGA2': 'La Liga 2 (ESP)',
    'German2Bundesliga': '2. Bundesliga (GER)',
    'SwissSuperLeague': 'Swiss Super League (SUI)',
    'InternationalChampionsCup': 'International Champions Cup',
    'NCAAMensSoccer': "NCAA Men's Soccer (USA)",
    'UEFAChampionsLeagueQualifying': 'UEFA Champions League Qualifying',
    'UEFAEuropaLeagueQualifying': 'UEFA Europa League Qualifying',
    'UEFAEuropaConferenceLeagueQualifying': 'UEFA Europa Conference League Qualifying',
    'CONMEBOLUEFAClubChallenge': 'CONMEBOL-UEFA Club Challenge',
    'UEFASuperCup': 'UEFA Super Cup',
    'SpanishSupercopa': 'Supercopa de España (ESP)',
    'FrenchTropheedesChampions': 'Trophée des Champions (FRA)',
    'EnglishFACommunityShield': 'FA Community Shield (ENG)',
    'ItalianSupercoppa': 'Supercoppa Italiana (ITA)',
    'GermanDFLSupercup': 'DFL-Supercup (GER)',
    'AudiCup': 'Audi Cup',
    'DutchJohanCruyffShield': 'Johan Cruyff Shield (NED)',
    'ClubFriendly': 'Club Friendly',
    'EmiratesCup': 'Emirates Cup',
    'MensOlympicTournament': "Men's Olympic Football Tournament",
    'EnglishEFLTrophy': 'EFL Trophy (ENG)',
};

function formatLeagueName(id: string): string {
  if (displayNameMap[id]) {
    return displayNameMap[id];
  }
  // Fallback for unmapped IDs: split by uppercase letters and join with spaces
  return id.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()).trim();
}

const allSoccerLeagues: SportLeagueOption[] = userProvidedSoccerLeagues.map(league => ({
  sport: league.type,
  league: league.slug,
  name: formatLeagueName(league.id),
}));


const nonSoccerLeagues: SportLeagueOption[] = [
  { sport: "football", league: "nfl", name: "NFL" },
  { sport: "football", league: "college-football", name: "NCAAF (College Football)" },
  { sport: "basketball", league: "nba", name: "NBA" },
  { sport: "basketball", league: "mens-college-basketball", name: "NCAAM (College Basketball)" },
  { sport: "basketball", league: "wnba", name: "WNBA" },
  { sport: "baseball", league: "mlb", name: "MLB" },
  { sport: "hockey", league: "nhl", name: "NHL" },
  { sport: "racing", league: "f1", name: "Formula 1" },
  { sport: "racing", league: "irl", name: "IndyCar Series" },
  { sport: "golf", league: "pga", name: "PGA Tour" },
  { sport: "golf", league: "lpga", name: "LPGA Tour" },
  { sport: "golf", league: "champions-tour", name: "PGA Champions Tour" },
  { sport: "golf", league: "liv", name: "LIV Golf" },
  { sport: "mma", league: "ufc", name: "UFC" },
  { sport: "mma", league: "pfl", name: "PFL" },
];

export const SPORT_LEAGUE_OPTIONS_FULL: SportLeagueOption[] = [
  ...allSoccerLeagues,
  ...nonSoccerLeagues,
];

export const sportCategories: SportCategoryType[] = [
  {
    id: "soccer",
    name: "Soccer",
    icon: <Image src="https://iili.io/FKnx02n.webp" alt="Soccer icon" width={36} height={36} />,
    pageTitle: "Live Soccer Scores, Fixtures & Results | sportsurge",
    metaDescription: "Get the latest live soccer scores, fixtures, results, and news from leagues worldwide. Follow your favorite football teams and competitions on sportsurge.",
    onPageContent: "Explore the world of soccer with sportsurge. We bring you real-time scores, match schedules, and detailed results from major leagues and tournaments including the Premier League, La Liga, Serie A, Bundesliga, MLS, Champions League, World Cup, and many more. Stay updated with every goal, assist, and key moment in the beautiful game."
  },
  {
    id: "basketball",
    name: "Basketball",
    icon: <Image src="https://iili.io/FKnxXQ2.webp" alt="Basketball icon" width={36} height={36} />,
    pageTitle: "Live Basketball Scores & News (NBA, College) | sportsurge",
    metaDescription: "Follow live basketball scores, NBA results, college basketball updates, and WNBA action. sportsurge is your source for all things basketball.",
    onPageContent: "Dive into the excitement of basketball with sportsurge. Get live scores, game highlights, and updates from the NBA, Men's College Basketball (NCAAM), WNBA, and other major basketball leagues. Track your favorite teams and players throughout the season."
  },
  {
    id: "american-football",
    name: "NFL",
    icon: <Image src="https://iili.io/FKnxWhl.webp" alt="NFL icon" width={36} height={36} />,
    pageTitle: "Live NFL & College Football Scores | sportsurge",
    metaDescription: "Get real-time NFL scores, college football (NCAAF) results, game schedules, and news. sportsurge covers all the American Football action.",
    onPageContent: "Experience the thrill of American Football with sportsurge. We provide live scores, game summaries, and team news for the NFL and NCAA College Football (NCAAF). Follow every touchdown, field goal, and crucial play."
  },
  {
    id: "baseball",
    name: "MLB",
    icon: <Image src="https://iili.io/FKnxVI4.webp" alt="MLB icon" width={36} height={36} />,
    pageTitle: "Live MLB Baseball Scores & Schedules | sportsurge",
    metaDescription: "Stay updated with live MLB scores, game results, schedules, and baseball news. sportsurge brings you comprehensive coverage of Major League Baseball.",
    onPageContent: "Follow Major League Baseball with sportsurge. Get live scores, detailed game information, schedules, and the latest news from the MLB. Don't miss a single home run or strikeout!"
  },
  {
    id: "hockey",
    name: "NHL",
    icon: <Image src="https://iili.io/FKnxYBI.webp" alt="NHL icon" width={36} height={36} />,
    pageTitle: "Live NHL Hockey Scores & Game Updates | sportsurge",
    metaDescription: "Get live NHL scores, game schedules, results, and hockey news. sportsurge covers all the action from the National Hockey League.",
    onPageContent: "Catch all the National Hockey League action with sportsurge. We deliver live scores, game updates, schedules, and news from the NHL. Follow your favorite teams as they battle on the ice."
  },
  {
    id: "motor-sports",
    name: "Motor Sports",
    icon: <Image src="https://iili.io/FKnxa1t.webp" alt="Motor Sports icon" width={36} height={36} />,
    pageTitle: "Live Motor Sports Results (F1, IndyCar) | sportsurge",
    metaDescription: "Follow live Formula 1 (F1) and IndyCar Series results, race schedules, and news. sportsurge keeps you updated on the world of motor racing.",
    onPageContent: "Fuel your passion for speed with sportsurge's Motor Sports coverage. Get live updates, race results, and schedules for Formula 1 (F1) and the IndyCar Series. Stay ahead of every lap and checkered flag."
  },
  {
    id: "golf",
    name: "Golf",
    icon: <Image src="https://iili.io/FKnxcrX.webp" alt="Golf icon" width={36} height={36} />,
    pageTitle: "Live Golf Scores & Tournament Updates (PGA, LPGA, LIV) | sportsurge",
    metaDescription: "Get live golf scores from PGA Tour, LPGA Tour, PGA Champions Tour, and LIV Golf. Follow tournaments, leaderboards, and player updates on sportsurge.",
    onPageContent: "Follow the links with sportsurge. We provide live golf scores, tournament leaderboards, and updates from the PGA Tour, LPGA Tour, PGA Champions Tour, and LIV Golf. Track your favorite golfers and major championships."
  },
  {
    id: "mma-ufc",
    name: "MMA",
    icon: <Image src="https://iili.io/FKnlXZF.webp" alt="MMA icon" width={36} height={36} />,
    pageTitle: "Live MMA Fight Results (UFC, PFL) | sportsurge",
    metaDescription: "Get live MMA fight results, event schedules, and news from UFC and PFL. sportsurge brings you cage-side action for Mixed Martial Arts.",
    onPageContent: "Step into the octagon with sportsurge's MMA coverage. Get live fight results, event schedules, and news from top promotions like UFC and PFL. Follow every knockout and submission in the world of Mixed Martial Arts."
  },
  {
    id: "tennis",
    name: "Tennis",
    icon: <Image src="https://iili.io/FKnEEv4.webp" alt="Tennis icon" width={36} height={36} />,
    pageTitle: "Live Tennis Scores & Tournament Results | sportsurge",
    metaDescription: "Follow live tennis scores, ATP & WTA tournament results, match schedules, and player news. sportsurge serves up all the action from the world of tennis.",
    onPageContent: "Catch every serve and volley with sportsurge's tennis coverage. We bring you live scores, match results, and tournament updates from ATP, WTA, and Grand Slam events. Follow your favorite tennis stars and never miss a point."
  },
  {
    id: "boxing",
    name: "Boxing",
    icon: <Image src="https://iili.io/FKnWHMP.webp" alt="Boxing icon" width={36} height={36} />,
    pageTitle: "Live Boxing Fight Night Results & News | sportsurge",
    metaDescription: "Get live boxing results, fight schedules, and news. sportsurge covers major boxing events and championship bouts.",
    onPageContent: "Experience the sweet science with sportsurge's boxing coverage. Get live fight results, upcoming bout schedules, and news from the world of boxing."
  },
  {
    id: "wrestling-wwe",
    name: "WWE",
    icon: <Image src="https://iili.io/FKnjul1.webp" alt="WWE icon" width={36} height={36} />,
    pageTitle: "Live WWE Updates & News | sportsurge",
    metaDescription: "Follow the latest updates from the world of professional wrestling and WWE. sportsurge brings you the action.",
    onPageContent: "Get your wrestling fix with sportsurge. We cover major events and news from the world of professional wrestling, including WWE. Stay tuned for all the drama and athleticism."
  },
];


    

    