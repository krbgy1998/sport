
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
  { id: 'tabiti-dickson', name: 'Andrew Tabiti vs Jacob Dickson', dateText: 'Friday, June 13', url: `https://live.sportsurge.uno/#${encodeURIComponent('Andrew Tabiti vs Jacob Dickson')}` },
  { id: 'cruz-chavez', name: 'LeAnna Cruz vs Regina Chavez', dateText: 'Friday, June 13', url: `https://live.sportsurge.uno/#${encodeURIComponent('LeAnna Cruz vs Regina Chavez')}` },
  { id: 'hitchins-kambosos', name: 'Richardson Hitchins vs George Kambosos', dateText: 'Saturday, June 14', url: `https://live.sportsurge.uno/#${encodeURIComponent('Richardson Hitchins vs George Kambosos')}` },
  { id: 'cruz-mishiro', name: 'Andy Cruz vs Hironori Mishiro', dateText: 'Saturday, June 14', url: `https://live.sportsurge.uno/#${encodeURIComponent('Andy Cruz vs Hironori Mishiro')}` },
  { id: 'estrada-lugo', name: 'Juan Francisco Estrada vs Karim Arce Lugo', dateText: 'Saturday, June 14', url: `https://live.sportsurge.uno/#${encodeURIComponent('Juan Francisco Estrada vs Karim Arce Lugo')}` },
  { id: 'donaire-campos', name: 'Nonito Donaire vs Andres Campos', dateText: 'Saturday, June 14', url: `https://live.sportsurge.uno/#${encodeURIComponent('Nonito Donaire vs Andres Campos')}` },
  { id: 'norman-sasaki', name: 'Brian Norman Jr. vs Jin Sasaki', dateText: 'Thursday, June 19', url: `https://live.sportsurge.uno/#${encodeURIComponent('Brian Norman Jr. vs Jin Sasaki')}` },
  { id: 'araneta-simsri', name: 'Cristian Araneta vs Thanongsak Simsri', dateText: 'Thursday, June 19', url: `https://live.sportsurge.uno/#${encodeURIComponent('Cristian Araneta vs Thanongsak Simsri')}` },
  { id: 'stevens-khamukov', name: 'David Stevens vs Petr Khamukov', dateText: 'Friday, June 20', url: `https://live.sportsurge.uno/#${encodeURIComponent('David Stevens vs Petr Khamukov')}` },
  { id: 'mielnicki-gardzielik', name: 'Vito Mielnicki vs Kamil Gardzielik', dateText: 'Saturday, June 21', url: `https://live.sportsurge.uno/#${encodeURIComponent('Vito Mielnicki vs Kamil Gardzielik')}` },
  { id: 'yafai-rodriguez', name: 'Galal Yafai vs Francisco Rodriguez Jr.', dateText: 'Saturday, June 21', url: `https://live.sportsurge.uno/#${encodeURIComponent('Galal Yafai vs Francisco Rodriguez Jr.')}` },
  { id: 'masoud-baluta', name: 'Shabaz Masoud vs Ionut Baluta', dateText: 'Saturday, June 21', url: `https://live.sportsurge.uno/#${encodeURIComponent('Shabaz Masoud vs Ionut Baluta')}` },
  { id: 'walsh-espadas', name: 'Callum Walsh vs Elias Espadas', dateText: 'Saturday, June 21', url: `https://live.sportsurge.uno/#${encodeURIComponent('Callum Walsh vs Elias Espadas')}` },
  { id: 'sandoval-angulo', name: 'Cain Sandoval vs Jesus Madueno Angulo', dateText: 'Saturday, June 21', url: `https://live.sportsurge.uno/#${encodeURIComponent('Cain Sandoval vs Jesus Madueno Angulo')}` },
  { id: 'dzambekov-angulo', name: 'Umar Dzambekov vs Roamer Alexis Angulo', dateText: 'Saturday, June 21', url: `https://live.sportsurge.uno/#${encodeURIComponent('Umar Dzambekov vs Roamer Alexis Angulo')}` },
  { id: 'verduzco-roman', name: 'Iyana "Roxy" Verduzco vs Celene Roman', dateText: 'Saturday, June 21', url: `https://live.sportsurge.uno/#${encodeURIComponent('Iyana "Roxy" Verduzco vs Celene Roman')}` },
  { id: 'paro-navarro', name: 'Liam Paro vs Jonathan Navarro', dateText: 'Wednesday, June 25', url: `https://live.sportsurge.uno/#${encodeURIComponent('Liam Paro vs Jonathan Navarro')}` },
  { id: 'wilson-gimenez', name: 'Liam Wilson vs Ayrton Osmar Gimenez', dateText: 'Wednesday, June 25', url: `https://live.sportsurge.uno/#${encodeURIComponent('Liam Wilson vs Ayrton Osmar Gimenez')}` },
  { id: 'wilder-herndon', name: 'Deontay Wilder vs Tyrrell Herndon', dateText: 'Friday, June 27', url: `https://live.sportsurge.uno/#${encodeURIComponent('Deontay Wilder vs Tyrrell Herndon')}` },
  { id: 'mbilli-sulecki', name: 'Christian Mbilli vs Maciej Sulecki', dateText: 'Friday, June 27', url: `https://live.sportsurge.uno/#${encodeURIComponent('Christian Mbilli vs Maciej Sulecki')}` },
  { id: 'bazinyan-butler', name: 'Erik Bazinyan vs Steven Butler', dateText: 'Friday, June 27', url: `https://live.sportsurge.uno/#${encodeURIComponent('Erik Bazinyan vs Steven Butler')}` },
  { id: 'paul-chavez', name: 'Jake Paul vs Julio Cesar Chavez Jr.', dateText: 'Saturday, June 28', url: `https://live.sportsurge.uno/#${encodeURIComponent('Jake Paul vs Julio Cesar Chavez Jr.')}` },
  { id: 'ramirez-dorticos', name: 'Gilberto Ramirez vs Yuniel Dorticos', dateText: 'Saturday, June 28', url: `https://live.sportsurge.uno/#${encodeURIComponent('Gilberto Ramirez vs Yuniel Dorticos')}` },
  { id: 'schofield-farmer', name: 'Floyd Schofield vs Tevin Farmer', dateText: 'Saturday, June 28', url: `https://live.sportsurge.uno/#${encodeURIComponent('Floyd Schofield vs Tevin Farmer')}` },
  { id: 'curiel-rodriguez', name: 'Raul Curiel vs Victor Rodriguez', dateText: 'Saturday, June 28', url: `https://live.sportsurge.uno/#${encodeURIComponent('Raul Curiel vs Victor Rodriguez')}` },
  { id: 'griffin-rodriguez', name: 'Avious Griffin vs Julian Rodriguez', dateText: 'Saturday, June 28', url: `https://live.sportsurge.uno/#${encodeURIComponent('Avious Griffin vs Julian Rodriguez')}` },
  { id: 'holm-vega', name: 'Holly Holm vs Yolanda Vega', dateText: 'Saturday, June 28', url: `https://live.sportsurge.uno/#${encodeURIComponent('Holly Holm vs Yolanda Vega')}` },
  { id: 'pascal-cieslak', name: 'Jean Pascal vs Michal Cieslak', dateText: 'Saturday, June 28', url: `https://live.sportsurge.uno/#${encodeURIComponent('Jean Pascal vs Michal Cieslak')}` },
  { id: 'molloy-benjamin', name: 'Kieran Molloy vs Kaisee Benjamin', dateText: 'Saturday, June 28', url: `https://live.sportsurge.uno/#${encodeURIComponent('Kieran Molloy vs Kaisee Benjamin')}` },
  { id: 'pitters-rea', name: 'Shakan Pitters vs Bradley Rea', dateText: 'Saturday, June 28', url: `https://live.sportsurge.uno/#${encodeURIComponent('Shakan Pitters vs Bradley Rea')}` },
  { id: 'catterall-eubank', name: 'Jack Catterall vs Harlem Eubank', dateText: 'Saturday, July 5', url: `https://live.sportsurge.uno/#${encodeURIComponent('Jack Catterall vs Harlem Eubank')}` },
  { id: 'taylor-serrano', name: 'Katie Taylor vs Amanda Serrano', dateText: 'Friday, July 11', url: `https://live.sportsurge.uno/#${encodeURIComponent('Katie Taylor vs Amanda Serrano')}` },
  { id: 'baumgardner-miranda', name: 'Alycia Baumgardner vs Jennifer Miranda', dateText: 'Friday, July 11', url: `https://live.sportsurge.uno/#${encodeURIComponent('Alycia Baumgardner vs Jennifer Miranda')}` },
  { id: 'scotney-mercado', name: 'Ellie Scotney vs Yamileth Mercado', dateText: 'Friday, July 11', url: `https://live.sportsurge.uno/#${encodeURIComponent('Ellie Scotney vs Yamileth Mercado')}` },
  { id: 'thorslund-johnson', name: 'Dina Thorslund vs Cherneka Johnson', dateText: 'Friday, July 11', url: `https://live.sportsurge.uno/#${encodeURIComponent('Dina Thorslund vs Cherneka Johnson')}` },
  { id: 'marshall-green', name: 'Savannah Marshall vs Shadasia Green', dateText: 'Friday, July 11', url: `https://live.sportsurge.uno/#${encodeURIComponent('Savannah Marshall vs Shadasia Green')}` },
  { id: 'cameron-camara', name: 'Chantelle Cameron vs Jessica Camara', dateText: 'Friday, July 11', url: `https://live.sportsurge.uno/#${encodeURIComponent('Chantelle Cameron vs Jessica Camara')}` },
  { id: 'ali-furtado', name: 'Ramla Ali vs Lila Furtado', dateText: 'Friday, July 11', url: `https://live.sportsurge.uno/#${encodeURIComponent('Ramla Ali vs Lila Furtado')}` },
  { id: 'thibeault-casamassa', name: 'Tamm Thibeault vs Mary Casamassa', dateText: 'Friday, July 11', url: `https://live.sportsurge.uno/#${encodeURIComponent('Tamm Thibeault vs Mary Casamassa')}` },
  { id: 'badillo-zapata', name: 'Erick Badillo vs Gerardo Zapata', dateText: 'Friday, July 11', url: `https://live.sportsurge.uno/#${encodeURIComponent('Erick Badillo vs Gerardo Zapata')}` },
  { id: 'stevenson-zepeda', name: 'Shakur Stevenson vs William Zepeda', dateText: 'Saturday, July 12', url: `https://live.sportsurge.uno/#${encodeURIComponent('Shakur Stevenson vs William Zepeda')}` },
  { id: 'berlanga-sheeraz', name: 'Edgar Berlanga vs Hamzah Sheeraz', dateText: 'Saturday, July 12', url: `https://live.sportsurge.uno/#${encodeURIComponent('Edgar Berlanga vs Hamzah Sheeraz')}` },
  { id: 'puello-matias', name: 'Alberto Puello vs Subriel Matias', dateText: 'Saturday, July 12', url: `https://live.sportsurge.uno/#${encodeURIComponent('Alberto Puello vs Subriel Matias')}` },
  { id: 'morrell-khataev', name: 'David Morrell vs Imam Khataev', dateText: 'Saturday, July 12', url: `https://live.sportsurge.uno/#${encodeURIComponent('David Morrell vs Imam Khataev')}` },
  { id: 'martinez-dibombe', name: 'Lester Martinez vs Pierre DiBombe', dateText: 'Saturday, July 12', url: `https://live.sportsurge.uno/#${encodeURIComponent('Lester Martinez vs Pierre DiBombe')}` },
  { id: 'usyk-dubois', name: 'Oleksandr Usyk vs Daniel Dubois', dateText: 'Saturday, July 19', url: `https://live.sportsurge.uno/#${encodeURIComponent('Oleksandr Usyk vs Daniel Dubois')}` },
  { id: 'rodriguez-cafu', name: 'Jesse Rodriguez vs Phumelele Cafu', dateText: 'Saturday, July 19', url: `https://live.sportsurge.uno/#${encodeURIComponent('Jesse Rodriguez vs Phumelele Cafu')}` },
  { id: 'pacheco-mccumby', name: 'Diego Pacheco vs Trevor McCumby', dateText: 'Saturday, July 19', url: `https://live.sportsurge.uno/#${encodeURIComponent('Diego Pacheco vs Trevor McCumby')}` },
  { id: 'barrios-pacquiao', name: 'Mario Barrios vs Manny Pacquiao', dateText: 'Saturday, July 19', url: `https://live.sportsurge.uno/#${encodeURIComponent('Mario Barrios vs Manny Pacquiao')}` },
  { id: 'fundora-tszyu', name: 'Sebastian Fundora vs Tim Tszyu', dateText: 'Saturday, July 19', url: `https://live.sportsurge.uno/#${encodeURIComponent('Sebastian Fundora vs Tim Tszyu')}` },
  { id: 'cruz-fierro', name: 'Isaac Cruz vs Angel Fierro', dateText: 'Saturday, July 19', url: `https://live.sportsurge.uno/#${encodeURIComponent('Isaac Cruz vs Angel Fierro')}` },
  { id: 'figueroa-gonzalez', name: 'Brandon Figueroa vs Joet Gonzalez', dateText: 'Saturday, July 19', url: `https://live.sportsurge.uno/#${encodeURIComponent('Brandon Figueroa vs Joet Gonzalez')}` },
  { id: 'shields-daniels', name: 'Claressa Shields vs Lani Daniels', dateText: 'Saturday, July 26', url: `https://live.sportsurge.uno/#${encodeURIComponent('Claressa Shields vs Lani Daniels')}` },
  { id: 'worthington-piteau', name: 'Samantha Worthington vs Victoire Piteau', dateText: 'Saturday, July 26', url: `https://live.sportsurge.uno/#${encodeURIComponent('Samantha Worthington vs Victoire Piteau')}` },
  { id: 'veyre-boudersa', name: 'Caroline Veyre vs Licia Boudersa', dateText: 'Saturday, July 26', url: `https://live.sportsurge.uno/#${encodeURIComponent('Caroline Veyre vs Licia Boudersa')}` },
  { id: 'zayas-perez', name: 'Xander Zayas vs Jorge Garcia Perez', dateText: 'Saturday, July 26', url: `https://live.sportsurge.uno/#${encodeURIComponent('Xander Zayas vs Jorge Garcia Perez')}` },
  { id: 'carrington-heita', name: 'Bruce Carrington vs Mateus Heita', dateText: 'Saturday, July 26', url: `https://live.sportsurge.uno/#${encodeURIComponent('Bruce Carrington vs Mateus Heita')}` },
  { id: 'davis-roach', name: 'Gervonta Davis vs Lamont Roach', dateText: 'Saturday, August 16', url: `https://live.sportsurge.uno/#${encodeURIComponent('Gervonta Davis vs Lamont Roach')}` },
  { id: 'alvarez-crawford', name: 'Saul "Canelo" Alvarez vs Terence Crawford', dateText: 'Friday, September 12', url: `https://live.sportsurge.uno/#${encodeURIComponent('Saul "Canelo" Alvarez vs Terence Crawford')}` },
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

