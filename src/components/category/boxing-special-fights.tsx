// src/components/category/boxing-special-fights.tsx
'use client';

import { useEffect, useState } from 'react';

interface Fight {
  id: string;
  name: string;
  dateText: string; // e.g., "Friday, June 13"
  url: string;
  displayStatus?: string;
}

const fightsData: Fight[] = [
  { id: 'tabiti-dickson', name: 'Andrew Tabiti vs Jacob Dickson', dateText: 'Friday, June 13', url: 'https://live.sportsurge.uno/#JAndrew%20Tabiti%20vs%20Jacob%20Dickson' },
  { id: 'cruz-chavez', name: 'LeAnna Cruz vs Regina Chavez', dateText: 'Friday, June 13', url: 'https://live.sportsurge.uno/#JLeAnna%20Cruz%20vs%20Regina%20Chavez' },
  { id: 'hitchins-kambosos', name: 'Richardson Hitchins vs George Kambosos', dateText: 'Saturday, June 14', url: 'https://live.sportsurge.uno/#JRichardson%20Hitchins%20vs%20George%20Kambosos' },
  { id: 'cruz-mishiro', name: 'Andy Cruz vs Hironori Mishiro', dateText: 'Saturday, June 14', url: 'https://live.sportsurge.uno/#JAndy%20Cruz%20vs%20Hironori%20Mishiro' },
  { id: 'estrada-lugo', name: 'Juan Francisco Estrada vs Karim Arce Lugo', dateText: 'Saturday, June 14', url: 'https://live.sportsurge.uno/#JJuan%20Francisco%20Estrada%20vs%20Karim%20Arce%20Lugo' },
  { id: 'donaire-campos', name: 'Nonito Donaire vs Andres Campos', dateText: 'Saturday, June 14', url: 'https://live.sportsurge.uno/#JNonito%20Donaire%20vs%20Andres%20Campos' },
  { id: 'norman-sasaki', name: 'Brian Norman Jr. vs Jin Sasaki', dateText: 'Thursday, June 19', url: 'https://live.sportsurge.uno/#JBrian%20Norman%20Jr.%20vs%20Jin%20Sasaki' },
  { id: 'araneta-simsri', name: 'Cristian Araneta vs Thanongsak Simsri', dateText: 'Thursday, June 19', url: 'https://live.sportsurge.uno/#JCristian%20Araneta%20vs%20Thanongsak%20Simsri' },
  { id: 'stevens-khamukov', name: 'David Stevens vs Petr Khamukov', dateText: 'Friday, June 20', url: 'https://live.sportsurge.uno/#JDavid%20Stevens%20vs%20Petr%20Khamukov' },
  { id: 'mielnicki-gardzielik', name: 'Vito Mielnicki vs Kamil Gardzielik', dateText: 'Saturday, June 21', url: 'https://live.sportsurge.uno/#JVito%20Mielnicki%20vs%20Kamil%20Gardzielik' },
  { id: 'yafai-rodriguez', name: 'Galal Yafai vs Francisco Rodriguez Jr.', dateText: 'Saturday, June 21', url: 'https://live.sportsurge.uno/#JGalal%20Yafai%20vs%20Francisco%20Rodriguez%20Jr.' },
  { id: 'masoud-baluta', name: 'Shabaz Masoud vs Ionut Baluta', dateText: 'Saturday, June 21', url: 'https://live.sportsurge.uno/#JShabaz%20Masoud%20vs%20Ionut%20Baluta' },
  { id: 'walsh-espadas', name: 'Callum Walsh vs Elias Espadas', dateText: 'Saturday, June 21', url: 'https://live.sportsurge.uno/#JCallum%20Walsh%20vs%20Elias%20Espadas' },
  { id: 'sandoval-angulo', name: 'Cain Sandoval vs Jesus Madueno Angulo', dateText: 'Saturday, June 21', url: 'https://live.sportsurge.uno/#JCain%20Sandoval%20vs%20Jesus%20Madueno%20Angulo' },
  { id: 'dzambekov-angulo', name: 'Umar Dzambekov vs Roamer Alexis Angulo', dateText: 'Saturday, June 21', url: 'https://live.sportsurge.uno/#JUmar%20Dzambekov%20vs%20Roamer%20Alexis%20Angulo' },
  { id: 'verduzco-roman', name: 'Iyana "Roxy" Verduzco vs Celene Roman', dateText: 'Saturday, June 21', url: 'https://live.sportsurge.uno/#JIyana%20"Roxy"%20Verduzco%20vs%20Celene%20Roman' },
  { id: 'paro-navarro', name: 'Liam Paro vs Jonathan Navarro', dateText: 'Wednesday, June 25', url: 'https://live.sportsurge.uno/#JLiam%20Paro%20vs%20Jonathan%20Navarro' },
  { id: 'wilson-gimenez', name: 'Liam Wilson vs Ayrton Osmar Gimenez', dateText: 'Wednesday, June 25', url: 'https://live.sportsurge.uno/#JLiam%20Wilson%20vs%20Ayrton%20Osmar%20Gimenez' },
  { id: 'wilder-herndon', name: 'Deontay Wilder vs Tyrrell Herndon', dateText: 'Friday, June 27', url: 'https://live.sportsurge.uno/#JDeontay%20Wilder%20vs%20Tyrrell%20Herndon' },
  { id: 'mbilli-sulecki', name: 'Christian Mbilli vs Maciej Sulecki', dateText: 'Friday, June 27', url: 'https://live.sportsurge.uno/#JChristian%20Mbilli%20vs%20Maciej%20Sulecki' },
  { id: 'bazinyan-butler', name: 'Erik Bazinyan vs Steven Butler', dateText: 'Friday, June 27', url: 'https://live.sportsurge.uno/#JErik%20Bazinyan%20vs%20Steven%20Butler' },
  { id: 'paul-chavez', name: 'Jake Paul vs Julio Cesar Chavez Jr.', dateText: 'Saturday, June 28', url: 'https://live.sportsurge.uno/#JJake%20Paul%20vs%20Julio%20Cesar%20Chavez%20Jr.' },
  { id: 'ramirez-dorticos', name: 'Gilberto Ramirez vs Yuniel Dorticos', dateText: 'Saturday, June 28', url: 'https://live.sportsurge.uno/#JGilberto%20Ramirez%20vs%20Yuniel%20Dorticos' },
  { id: 'schofield-farmer', name: 'Floyd Schofield vs Tevin Farmer', dateText: 'Saturday, June 28', url: 'https://live.sportsurge.uno/#JFloyd%20Schofield%20vs%20Tevin%20Farmer' },
  { id: 'curiel-rodriguez', name: 'Raul Curiel vs Victor Rodriguez', dateText: 'Saturday, June 28', url: 'https://live.sportsurge.uno/#JRaul%20Curiel%20vs%20Victor%20Rodriguez' },
  { id: 'griffin-rodriguez', name: 'Avious Griffin vs Julian Rodriguez', dateText: 'Saturday, June 28', url: 'https://live.sportsurge.uno/#JAvious%20Griffin%20vs%20Julian%20Rodriguez' },
  { id: 'holm-vega', name: 'Holly Holm vs Yolanda Vega', dateText: 'Saturday, June 28', url: 'https://live.sportsurge.uno/#JHolly%20Holm%20vs%20Yolanda%20Vega' },
  { id: 'pascal-cieslak', name: 'Jean Pascal vs Michal Cieslak', dateText: 'Saturday, June 28', url: 'https://live.sportsurge.uno/#JJean%20Pascal%20vs%20Michal%20Cieslak' },
  { id: 'molloy-benjamin', name: 'Kieran Molloy vs Kaisee Benjamin', dateText: 'Saturday, June 28', url: 'https://live.sportsurge.uno/#JKieran%20Molloy%20vs%20Kaisee%20Benjamin' },
  { id: 'pitters-rea', name: 'Shakan Pitters vs Bradley Rea', dateText: 'Saturday, June 28', url: 'https://live.sportsurge.uno/#JShakan%20Pitters%20vs%20Bradley%20Rea' },
  { id: 'catterall-eubank', name: 'Jack Catterall vs Harlem Eubank', dateText: 'Saturday, July 5', url: 'https://live.sportsurge.uno/#JJack%20Catterall%20vs%20Harlem%20Eubank' },
  { id: 'taylor-serrano', name: 'Katie Taylor vs Amanda Serrano', dateText: 'Friday, July 11', url: 'https://live.sportsurge.uno/#JKatie%20Taylor%20vs%20Amanda%20Serrano' },
  { id: 'baumgardner-miranda', name: 'Alycia Baumgardner vs Jennifer Miranda', dateText: 'Friday, July 11', url: 'https://live.sportsurge.uno/#JAlycia%20Baumgardner%20vs%20Jennifer%20Miranda' },
  { id: 'scotney-mercado', name: 'Ellie Scotney vs Yamileth Mercado', dateText: 'Friday, July 11', url: 'https://live.sportsurge.uno/#JEllie%20Scotney%20vs%20Yamileth%20Mercado' },
  { id: 'thorslund-johnson', name: 'Dina Thorslund vs Cherneka Johnson', dateText: 'Friday, July 11', url: 'https://live.sportsurge.uno/#JDina%20Thorslund%20vs%20Cherneka%20Johnson' },
  { id: 'marshall-green', name: 'Savannah Marshall vs Shadasia Green', dateText: 'Friday, July 11', url: 'https://live.sportsurge.uno/#JSavannah%20Marshall%20vs%20Shadasia%20Green' },
  { id: 'cameron-camara', name: 'Chantelle Cameron vs Jessica Camara', dateText: 'Friday, July 11', url: 'https://live.sportsurge.uno/#JChantelle%20Cameron%20vs%20Jessica%20Camara' },
  { id: 'ali-furtado', name: 'Ramla Ali vs Lila Furtado', dateText: 'Friday, July 11', url: 'https://live.sportsurge.uno/#JRamla%20Ali%20vs%20Lila%20Furtado' },
  { id: 'thibeault-casamassa', name: 'Tamm Thibeault vs Mary Casamassa', dateText: 'Friday, July 11', url: 'https://live.sportsurge.uno/#JTamm%20Thibeault%20vs%20Mary%20Casamassa' },
  { id: 'badillo-zapata', name: 'Erick Badillo vs Gerardo Zapata', dateText: 'Friday, July 11', url: 'https://live.sportsurge.uno/#JErick%20Badillo%20vs%20Gerardo%20Zapata' },
  { id: 'stevenson-zepeda', name: 'Shakur Stevenson vs William Zepeda', dateText: 'Saturday, July 12', url: 'https://live.sportsurge.uno/#JShakur%20Stevenson%20vs%20William%20Zepeda' },
  { id: 'berlanga-sheeraz', name: 'Edgar Berlanga vs Hamzah Sheeraz', dateText: 'Saturday, July 12', url: 'https://live.sportsurge.uno/#JEdgar%20Berlanga%20vs%20Hamzah%20Sheeraz' },
  { id: 'puello-matias', name: 'Alberto Puello vs Subriel Matias', dateText: 'Saturday, July 12', url: 'https://live.sportsurge.uno/#JAlberto%20Puello%20vs%20Subriel%20Matias' },
  { id: 'morrell-khataev', name: 'David Morrell vs Imam Khataev', dateText: 'Saturday, July 12', url: 'https://live.sportsurge.uno/#JDavid%20Morrell%20vs%20Imam%20Khataev' },
  { id: 'martinez-dibombe', name: 'Lester Martinez vs Pierre DiBombe', dateText: 'Saturday, July 12', url: 'https://live.sportsurge.uno/#JLester%20Martinez%20vs%20Pierre%20DiBombe' },
  { id: 'usyk-dubois', name: 'Oleksandr Usyk vs Daniel Dubois', dateText: 'Saturday, July 19', url: 'https://live.sportsurge.uno/#JOleksandr%20Usyk%20vs%20Daniel%20Dubois' },
  { id: 'rodriguez-cafu', name: 'Jesse Rodriguez vs Phumelele Cafu', dateText: 'Saturday, July 19', url: 'https://live.sportsurge.uno/#JJesse%20Rodriguez%20vs%20Phumelele%20Cafu' },
  { id: 'pacheco-mccumby', name: 'Diego Pacheco vs Trevor McCumby', dateText: 'Saturday, July 19', url: 'https://live.sportsurge.uno/#JDiego%20Pacheco%20vs%20Trevor%20McCumby' },
  { id: 'barrios-pacquiao', name: 'Mario Barrios vs Manny Pacquiao', dateText: 'Saturday, July 19', url: 'https://live.sportsurge.uno/#JMario%20Barrios%20vs%20Manny%20Pacquiao' },
  { id: 'fundora-tszyu', name: 'Sebastian Fundora vs Tim Tszyu', dateText: 'Saturday, July 19', url: 'https://live.sportsurge.uno/#JSebastian%20Fundora%20vs%20Tim%20Tszyu' },
  { id: 'cruz-fierro', name: 'Isaac Cruz vs Angel Fierro', dateText: 'Saturday, July 19', url: 'https://live.sportsurge.uno/#JIsaac%20Cruz%20vs%20Angel%20Fierro' },
  { id: 'figueroa-gonzalez', name: 'Brandon Figueroa vs Joet Gonzalez', dateText: 'Saturday, July 19', url: 'https://live.sportsurge.uno/#JBrandon%20Figueroa%20vs%20Joet%20Gonzalez' },
  { id: 'shields-daniels', name: 'Claressa Shields vs Lani Daniels', dateText: 'Saturday, July 26', url: 'https://live.sportsurge.uno/#JClaressa%20Shields%20vs%20Lani%20Daniels' },
  { id: 'worthington-piteau', name: 'Samantha Worthington vs Victoire Piteau', dateText: 'Saturday, July 26', url: 'https://live.sportsurge.uno/#JSamantha%20Worthington%20vs%20Victoire%20Piteau' },
  { id: 'veyre-boudersa', name: 'Caroline Veyre vs Licia Boudersa', dateText: 'Saturday, July 26', url: 'https://live.sportsurge.uno/#JCaroline%20Veyre%20vs%20Licia%20Boudersa' },
  { id: 'zayas-perez', name: 'Xander Zayas vs Jorge Garcia Perez', dateText: 'Saturday, July 26', url: 'https://live.sportsurge.uno/#JXander%20Zayas%20vs%20Jorge%20Garcia%20Perez' },
  { id: 'carrington-heita', name: 'Bruce Carrington vs Mateus Heita', dateText: 'Saturday, July 26', url: 'https://live.sportsurge.uno/#JBruce%20Carrington%20vs%20Mateus%20Heita' },
  { id: 'davis-roach', name: 'Gervonta Davis vs Lamont Roach', dateText: 'Saturday, August 16', url: 'https://live.sportsurge.uno/#JGervonta%20Davis%20vs%20Lamont%20Roach' },
  { id: 'alvarez-crawford', name: 'Saul "Canelo" Alvarez vs Terence Crawford', dateText: 'Friday, September 12', url: 'https://live.sportsurge.uno/#JSaul%20"Canelo"%20Alvarez%20vs%20Terence%20Crawford' },
];


export function BoxingSpecialFights() {
  const [fights, setFights] = useState<Fight[]>(fightsData.map(f => ({ ...f, displayStatus: f.dateText })));

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today for date-only comparison

    const updatedFights = fightsData.map(fight => {
      const year = new Date().getFullYear(); // Assume current year
      // Extracts "Month Day" from "DayOfWeek, Month Day"
      const dateStringForParsing = fight.dateText.split(',').slice(1).join(',').trim() + `, ${year}`; // e.g., "June 13, 2024"
      
      const matchDate = new Date(dateStringForParsing);
      matchDate.setHours(0,0,0,0); // Normalize matchDate for comparison

      let displayStatus = fight.dateText;
      if (!isNaN(matchDate.getTime()) && matchDate.getTime() === today.getTime()) {
        displayStatus = 'LIVE NOW!';
      }
      return { ...fight, displayStatus };
    });
    setFights(updatedFights);
  }, []);

  return (
    <div className="text-center my-8 px-4">
      <h3 className="text-2xl font-bold mb-2 text-foreground font-headline">sportsurge free boxing live stream</h3>
      <p className="mb-6 text-muted-foreground">
        Watch live stream reddit boxing free. You can watch live boxing tonight fights free on sport surge boxing.
      </p>
      
      {/* BOXING SPECIAL FIGHTS */}
      <div className="space-y-3">
        {fights.map(fight => (
          <div key={fight.id} className="border rounded-lg p-3 bg-card text-card-foreground shadow-md hover:shadow-lg transition-shadow max-w-3xl mx-auto">
            <div className="grid grid-cols-12 items-center gap-2">
              <div className="col-span-12 sm:col-span-3 text-center sm:text-left">
                <span className="text-sm font-semibold text-primary">Boxing</span>
              </div>
              <div className="col-span-12 sm:col-span-6 text-center sm:text-left">
                <a 
                  href={fight.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary hover:underline text-sm font-medium break-words"
                >
                  {fight.name}
                </a>
              </div>
              <div className="col-span-12 sm:col-span-3 text-center sm:text-right">
                <span 
                  className={`text-xs font-medium ${fight.displayStatus === 'LIVE NOW!' ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`}
                >
                  {fight.displayStatus}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-sm text-muted-foreground mt-8 max-w-3xl mx-auto text-justify">
        Watch all free <b>sportsurge <a href="https://www.sportsurge.uno/p/boxing.html" className="text-primary hover:underline">boxing</a> streams</b>, with sportsurge v3 boxing you can watch all <b>boxing streaming </b>with <b>reddit streams live. </b>Just choose the fight from the boxing live stream free list below and watch boxing streams live.
        <ul className="list-disc list-inside mt-2 pl-4">
          <li>sportsurge Mike Tyson</li>
          <li>sportsurge Jake Paul</li>
          <li>sportsurge Canelo Alvarez</li>
          <li>sportsurge Gervonta Davis</li>
          <li>sportsurge David Benavidez</li>
          <li>sportsurge David Morrell Jr</li>
        </ul>
      </div>
    </div>
  );
}
