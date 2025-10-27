import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';

// ---  Digimon Data  ---
interface Digimon {
  id: string;
  name: string;
  image: string;
  stats: {
    acting: number;
    improv: number;
    comedy: number;
    dance: number;
    design: number;
    runway: number;
    lipsync: number;
    makeover: number;
    rusical: number;
    rumix: number;
  };
  trackRecord: { episode: number; placement: string }[];
  storyline: string[];
  relationships: { [digimonId: string]: number }; // Relationship strength (-100 to 100)
}

const digimonData: Digimon[] = [
  {
    id: uuidv4(),
    name: "Angewomon",
    image: "https://wikimon.net/images/thumb/7/7b/Angewomon.jpg/250px-Angewomon.jpg",
    stats: { acting: 80, improv: 75, comedy: 60, dance: 85, design: 90, runway: 95, lipsync: 90, makeover: 85, rusical: 70, rumix: 75 },
    trackRecord: [],
    storyline: [],
    relationships: {},
  },
  {
    id: uuidv4(),
    name: "Lilymon",
    image: "https://wikimon.net/images/thumb/e/e0/Lilymon.jpg/250px-Lilymon.jpg",
    stats: { acting: 65, improv: 70, comedy: 70, dance: 80, design: 85, runway: 80, lipsync: 80, makeover: 75, rusical: 75, rumix: 70 },
    trackRecord: [],
    storyline: [],
    relationships: {},
  },
  {
    id: uuidv4(),
    name: "Rosemon",
    image: "https://wikimon.net/images/thumb/f/fa/Rosemon.jpg/250px-Rosemon.jpg",
    stats: { acting: 70, improv: 60, comedy: 75, dance: 90, design: 80, runway: 90, lipsync: 95, makeover: 80, rusical: 80, rumix: 85 },
    trackRecord: [],
    storyline: [],
    relationships: {},
  },
  {
    id: uuidv4(),
    name: "Sakuyamon",
    image: "https://wikimon.net/images/thumb/c/c9/Sakuyamon.jpg/250px-Sakuyamon.jpg",
    stats: { acting: 85, improv: 80, comedy: 80, dance: 75, design: 70, runway: 75, lipsync: 85, makeover: 70, rusical: 90, rumix: 75 },
    trackRecord: [],
    storyline: [],
    relationships: {},
  },
  {
    id: uuidv4(),
    name: "Venusmon",
    image: "https://wikimon.net/images/thumb/3/36/Venusmon.jpg/250px-Venusmon.jpg",
    stats: { acting: 60, improv: 65, comedy: 70, dance: 80, design: 95, runway: 90, lipsync: 75, makeover: 85, rusical: 70, rumix: 70 },
    trackRecord: [],
    storyline: [],
    relationships: {},
  },
    {
    id: uuidv4(),
    name: "Ophanimon",
    image: "https://wikimon.net/images/thumb/1/15/Ophanimon.jpg/250px-Ophanimon.jpg",
    stats: { acting: 75, improv: 70, comedy: 65, dance: 70, design: 80, runway: 85, lipsync: 80, makeover: 75, rusical: 85, rumix: 70 },
    trackRecord: [],
    storyline: [],
    relationships: {},
  },
  {
    id: uuidv4(),
    name: "Minervamon",
    image: "https://wikimon.net/images/thumb/0/07/Minervamon.jpg/250px-Minervamon.jpg",
    stats: { acting: 90, improv: 85, comedy: 80, dance: 75, design: 70, runway: 75, lipsync: 90, makeover: 70, rusical: 80, rumix: 85 },
    trackRecord: [],
    storyline: [],
    relationships: {},
  },
  {
    id: uuidv4(),
    name: "Mastemon",
    image: "https://wikimon.net/images/thumb/6/6b/Mastemon.jpg/250px-Mastemon.jpg",
    stats: { acting: 80, improv: 80, comedy: 85, dance: 80, design: 80, runway: 90, lipsync: 85, makeover: 80, rusical: 90, rumix: 75 },
    trackRecord: [],
    storyline: [],
    relationships: {},
  },
  {
    id: uuidv4(),
    name: "Magnadramon",
    image: "https://wikimon.net/images/thumb/d/d4/Magnadramon.jpg/250px-Magnadramon.jpg",
    stats: { acting: 60, improv: 60, comedy: 60, dance: 70, design: 80, runway: 85, lipsync: 80, makeover: 75, rusical: 70, rumix: 65 },
    trackRecord: [],
    storyline: [],
    relationships: {},
  },
  {
    id: uuidv4(),
    name: "Sirenmon",
    image: "https://wikimon.net/images/thumb/d/d2/Sirenmon.jpg/250px-Sirenmon.jpg",
    stats: { acting: 85, improv: 70, comedy: 80, dance: 90, design: 75, runway: 95, lipsync: 90, makeover: 85, rusical: 80, rumix: 80 },
    trackRecord: [],
    storyline: [],
    relationships: {},
  },
  {
    id: uuidv4(),
    name: "Eosmon",
    image: "https://wikimon.net/images/thumb/4/4b/Eosmon.jpg/250px-Eosmon.jpg",
    stats: { acting: 70, improv: 75, comedy: 70, dance: 65, design: 80, runway: 80, lipsync: 80, makeover: 70, rusical: 75, rumix: 70 },
    trackRecord: [],
    storyline: [],
    relationships: {},
  },
  {
    id: uuidv4(),
    name: "Mervamon",
    image: "https://wikimon.net/images/thumb/d/d8/Mervamon.jpg/250px-Mervamon.jpg",
    stats: { acting: 90, improv: 90, comedy: 80, dance: 70, design: 75, runway: 80, lipsync: 95, makeover: 70, rusical: 85, rumix: 80 },
    trackRecord: [],
    storyline: [],
    relationships: {},
  },
  {
    id: uuidv4(),
    name: "AncientMermaimon",
    image: "https://wikimon.net/images/thumb/a/a2/AncientMermaimon.jpg/250px-AncientMermaimon.jpg",
    stats: { acting: 75, improv: 80, comedy: 70, dance: 95, design: 85, runway: 90, lipsync: 90, makeover: 80, rusical: 75, rumix: 80 },
    trackRecord: [],
    storyline: [],
    relationships: {},
  },
  {
    id: uuidv4(),
    name: "GraceNovamon",
    image: "https://wikimon.net/images/thumb/5/52/GraceNovamon.jpg/250px-GraceNovamon.jpg",
    stats: { acting: 80, improv: 80, comedy: 85, dance: 70, design: 80, runway: 75, lipsync: 80, makeover: 85, rusical: 90, rumix: 80 },
    trackRecord: [],
    storyline: [],
    relationships: {},
  },
  {
    id: uuidv4(),
    name: "Kuzuhamon",
    image: "https://wikimon.net/images/thumb/0/07/Kuzuhamon.jpg/250px-Kuzuhamon.jpg",
    stats: { acting: 85, improv: 80, comedy: 75, dance: 70, design: 80, runway: 80, lipsync: 85, makeover: 70, rusical: 80, rumix: 85 },
    trackRecord: [],
    storyline: [],
    relationships: {},
  },
  {
    id: uuidv4(),
    name: "MarineAngemon",
    image: "https://wikimon.net/images/thumb/6/69/MarineAngemon.jpg/250px-MarineAngemon.jpg",
    stats: { acting: 60, improv: 65, comedy: 95, dance: 70, design: 60, runway: 60, lipsync: 65, makeover: 60, rusical: 60, rumix: 65 },
    trackRecord: [],
    storyline: [],
    relationships: {},
  },
  {
    id: uuidv4(),
    name: "Rebellimon",
    image: "https://wikimon.net/images/thumb/6/66/Rebellimon.jpg/250px-Rebellimon.jpg",
    stats: { acting: 80, improv: 75, comedy: 80, dance: 80, design: 85, runway: 90, lipsync: 75, makeover: 80, rusical: 70, rumix: 70 },
    trackRecord: [],
    storyline: [],
    relationships: {},
  },
  {
    id: uuidv4(),
    name: "Ranamon",
    image: "https://wikimon.net/images/thumb/b/be/Ranamon.jpg/250px-Ranamon.jpg",
    stats: { acting: 65, improv: 70, comedy: 70, dance: 85, design: 80, runway: 75, lipsync: 80, makeover: 75, rusical: 75, rumix: 70 },
    trackRecord: [],
    storyline: [],
    relationships: {},
  },
  {
    id: uuidv4(),
    name: "AncientGreymon",
    image: "https://wikimon.net/images/thumb/d/d3/AncientGreymon.jpg/250px-AncientGreymon.jpg",
    stats: { acting: 70, improv: 70, comedy: 70, dance: 70, design: 80, runway: 75, lipsync: 75, makeover: 70, rusical: 80, rumix: 70 },
    trackRecord: [],
    storyline: [],
    relationships: {},
  },
];

// --- Helper Functions ---
const getRandomDigimon = (digimonList: Digimon[], count: number): Digimon[] => {
  const shuffled = [...digimonList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const calculateAverageStat = (digimon: Digimon): number => {
  const { acting, improv, comedy, dance, design, runway, lipsync, makeover, rusical, rumix } = digimon.stats;
  return (acting + improv + comedy + dance + design + runway + lipsync + makeover + rusical + rumix) / 10;
};

const getChallengeStats = (digimon: Digimon, challengeType: string): number => {
  switch (challengeType) {
    case 'acting': return digimon.stats.acting;
    case 'improv': return digimon.stats.improv;
    case 'comedy': return digimon.stats.comedy;
    case 'dance': return digimon.stats.dance;
    case 'design': return digimon.stats.design;
    case 'runway': return digimon.stats.runway;
    case 'lipsync': return digimon.stats.lipsync;
    case 'makeover': return digimon.stats.makeover;
    case 'rusical': return digimon.stats.rusical;
    case 'rumix': return digimon.stats.rumix;
    default: return 0;
  }
};

const determineLipsyncWinner = (digimon1: Digimon, digimon2: Digimon): { winner: Digimon; loser: Digimon } => {
  const score1 = digimon1.stats.lipsync + Math.random() * 20 - 10; // Add some randomness
  const score2 = digimon2.stats.lipsync + Math.random() * 20 - 10;

  if (score1 > score2) {
    return { winner: digimon1, loser: digimon2 };
  } else if (score2 > score1) {
    return { winner: digimon2, loser: digimon1 };
  } else {
    // Tiebreaker (randomly choose a winner)
    return Math.random() < 0.5 ? { winner: digimon1, loser: digimon2 } : { winner: digimon2, loser: digimon1 };
  }
};

// ---  Challenge Data  ---
const challenges = {
  acting: {
    name: 'Acting Challenge',
    description: 'The Digimon will showcase their acting skills in a dramatic performance.',
    stat: 'acting',
  },
  improv: {
    name: 'Improv Challenge',
    description: 'The Digimon will participate in an improv comedy challenge.',
    stat: 'improv',
  },
  comedy: {
    name: 'Comedy Challenge',
    description: 'The Digimon will deliver stand-up comedy routines.',
    stat: 'comedy',
  },
  dance: {
    name: 'Dance Challenge',
    description: 'The Digimon will compete in a high-energy dance competition.',
    stat: 'dance',
  },
  design: {
    name: 'Design Challenge',
    description: 'The Digimon will design and create stunning outfits.',
    stat: 'design',
  },
  runway: {
    name: 'Runway Challenge',
    description: 'The Digimon will strut their stuff on the runway, showcasing their best looks.',
    stat: 'runway',
  },
  makeover: {
    name: 'Makeover Challenge',
    description: 'The Digimon will give a makeover to a chosen guest.',
    stat: 'makeover',
  },
  rusical: {
    name: 'Rusical Challenge',
    description: 'The Digimon will perform in a musical performance.',
    stat: 'rusical',
  },
  rumix: {
    name: 'Rumix Challenge',
    description: 'The Digimon will create a remix of a famous song.',
    stat: 'rumix',
  },
};

// --- Component:  Digimon Card ---
const DigimonCard = ({ digimon }: { digimon: Digimon }) => (
  <motion.div
    className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center p-4 w-64 md:w-80"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 260, damping: 20 }}
  >
    <img src={digimon.image} alt={digimon.name} className="w-40 h-40 object-cover rounded-full mb-2" />
    <h3 className="text-xl font-semibold mb-1 text-center">{digimon.name}</h3>
    <p className="text-gray-600 text-center">Avg Stat: {calculateAverageStat(digimon).toFixed(1)}</p>
  </motion.div>
);

// --- Component: Track Record Table ---
const TrackRecordTable = ({ digimonList }: { digimonList: Digimon[] }) => {
  const sortedDigimon = [...digimonList].sort((a, b) => {
    const aLastElimination = a.trackRecord.findLast(record => record.placement === 'ELIM');
    const bLastElimination = b.trackRecord.findLast(record => record.placement === 'ELIM');
    const aEliminationEpisode = aLastElimination?.episode || 99; // Big number if no elimination
    const bEliminationEpisode = bLastElimination?.episode || 99;
    
    if (aEliminationEpisode !== bEliminationEpisode) {
        return bEliminationEpisode - aEliminationEpisode; // Sort by episode, highest to lowest
    }
  
    // If same elimination episode, sort by wins, highest to lowest
    const aWins = a.trackRecord.filter(record => record.placement === 'WIN').length;
    const bWins = b.trackRecord.filter(record => record.placement === 'WIN').length;
    return bWins - aWins;
  });

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 text-left font-semibold">Digimon</th>
            <th className="py-2 px-4 text-center font-semibold">Track Record</th>
          </tr>
        </thead>
        <tbody>
          {sortedDigimon.map(digimon => (
            <tr key={digimon.id} className="border-b border-gray-200">
              <td className="py-2 px-4">{digimon.name}</td>
              <td className="py-2 px-4">
                {digimon.trackRecord.map((record, index) => (
                  <span key={index} className={`inline-block mr-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    record.placement === 'WIN' ? 'bg-green-100 text-green-800' :
                    record.placement === 'HIGH' ? 'bg-blue-100 text-blue-800' :
                    record.placement === 'LOW' ? 'bg-yellow-100 text-yellow-800' :
                    record.placement === 'BTM2' ? 'bg-red-100 text-red-800' :
                    record.placement === 'ELIM' ? 'bg-red-500 text-white' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    Ep {record.episode}: {record.placement}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


// --- Component: Season Stats ---
const SeasonStats = ({ digimonList }: { digimonList: Digimon[] }) => {
  const wins = digimonList.map(digimon => digimon.trackRecord.filter(record => record.placement === 'WIN').length);
  const totalWins = wins.reduce((sum, count) => sum + count, 0);

  const highs = digimonList.map(digimon => digimon.trackRecord.filter(record => record.placement === 'HIGH').length);
  const totalHighs = highs.reduce((sum, count) => sum + count, 0);

  const lows = digimonList.map(digimon => digimon.trackRecord.filter(record => record.placement === 'LOW').length);
  const totalLows = lows.reduce((sum, count) => sum + count, 0);

  const btm2s = digimonList.map(digimon => digimon.trackRecord.filter(record => record.placement === 'BTM2').length);
  const totalBtm2s = btm2s.reduce((sum, count) => sum + count, 0);

  const elims = digimonList.map(digimon => digimon.trackRecord.filter(record => record.placement === 'ELIM').length);
  const totalElims = elims.reduce((sum, count) => sum + count, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-xl font-semibold mb-2">Season Stats</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        <div className="bg-green-100 p-2 rounded-md text-green-800">Wins: {totalWins}</div>
        <div className="bg-blue-100 p-2 rounded-md text-blue-800">Highs: {totalHighs}</div>
        <div className="bg-yellow-100 p-2 rounded-md text-yellow-800">Lows: {totalLows}</div>
        <div className="bg-red-100 p-2 rounded-md text-red-800">Bottom 2s: {totalBtm2s}</div>
        <div className="bg-red-500 p-2 rounded-md text-white">Eliminations: {totalElims}</div>
      </div>
    </div>
  );
};


// --- Component:  Producer's Room ---
interface ProducerRoomProps {
    digimonList: Digimon[];
    episode: number;
    placements: { [digimonId: string]: string };
    setPlacements: React.Dispatch<React.SetStateAction<{ [digimonId: string]: string }>>;
    onOverride: () => void;
    bottomTwo: Digimon[];
    setBottomTwo: React.Dispatch<React.SetStateAction<Digimon[]>>;
    eliminatedDigimon: Digimon | null;
    setEliminatedDigimon: React.Dispatch<React.SetStateAction<Digimon | null>>;
  }
  
  const ProducerRoom = ({ digimonList, episode, placements, setPlacements, onOverride, bottomTwo, setBottomTwo, eliminatedDigimon, setEliminatedDigimon }: ProducerRoomProps) => {
    const handlePlacementChange = (digimonId: string, placement: string) => {
      setPlacements(prevPlacements => ({
        ...prevPlacements,
        [digimonId]: placement,
      }));
    };
  
    const handleBottomTwoChange = (digimonId: string, isAdding: boolean) => {
      if (isAdding) {
        if (bottomTwo.length < 2 && !bottomTwo.some(d => d.id === digimonId)) {
          const digimon = digimonList.find(d => d.id === digimonId);
          if (digimon) {
            setBottomTwo([...bottomTwo, digimon]);
          }
        }
      } else {
        setBottomTwo(bottomTwo.filter(d => d.id !== digimonId));
      }
    };

    const handleEliminatedChange = (digimonId: string) => {
      const digimon = digimonList.find(d => d.id === digimonId);
      setEliminatedDigimon(digimon || null);
    };
  
    return (
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-xl font-semibold mb-2">Producer's Room - Episode {episode}</h2>
  
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1">Override Placements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {digimonList.map(digimon => (
              <div key={digimon.id} className="flex items-center space-x-2 mb-1">
                <img src={digimon.image} alt={digimon.name} className="w-10 h-10 rounded-full" />
                <span>{digimon.name}</span>
                <select
                  value={placements[digimon.id] || 'SAFE'}
                  onChange={e => handlePlacementChange(digimon.id, e.target.value)}
                  className="px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="WIN">WIN</option>
                  <option value="HIGH">HIGH</option>
                  <option value="SAFE">SAFE</option>
                  <option value="LOW">LOW</option>
                  <option value="BTM2">BTM2</option>
                  <option value="ELIM">ELIM</option>
                </select>
              </div>
            ))}
          </div>
        </div>
  
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1">Choose Bottom Two</h3>
          <div className="flex flex-wrap gap-2">
            {digimonList.map(digimon => (
              <button
                key={digimon.id}
                onClick={() => handleBottomTwoChange(digimon.id, !bottomTwo.some(d => d.id === digimon.id))}
                className={`px-3 py-1 rounded-md shadow-sm ${bottomTwo.some(d => d.id === digimon.id) ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                {digimon.name}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            Select two Digimon to be in the bottom two.  They will not be auto-eliminated.
          </p>
        </div>
      
        <div className="mb-4">
        <h3 className="text-lg font-semibold mb-1">Choose Eliminated</h3>
        <div className="flex flex-wrap gap-2">
            {bottomTwo.map(digimon => (
            <button
                key={digimon.id}
                onClick={() => handleEliminatedChange(digimon.id)}
                className={`px-3 py-1 rounded-md shadow-sm ${eliminatedDigimon?.id === digimon.id ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
                {digimon.name}
            </button>
            ))}
        </div>
          <p className="text-sm text-gray-600">
            Choose which Digimon from the bottom two is eliminated.
          </p>
        </div>
  
        <button
          onClick={onOverride}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Apply Overrides
        </button>
      </div>
    );
  };
  

// --- Component:  Digimon Simulator ---
const DigimonSimulator = () => {
  const [digimon, setDigimon] = useState<Digimon[]>(() => getRandomDigimon(digimonData, 12)); // Initial cast
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [currentChallenge, setCurrentChallenge] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState('ENTRANCES'); // ENTRANCES, PROMO CHART, CHALLENGE SELECTOR, CHALLENGE ANNOUNCEMENT, PERFORMANCES, RESULTS, LIPSYNC, ELIMINATION, FINALE, CROWNING
  const [episodeResults, setEpisodeResults] = useState<{ [digimonId: string]: string }>({});  // Keep track of all placements
  const [lipSyncResults, setLipSyncResults] = useState<{ winner: Digimon | null; loser: Digimon | null }>({ winner: null, loser: null });
  const [eliminatedDigimon, setEliminatedDigimon] = useState<Digimon | null>(null); // To store the eliminated digimon
  const [bottomTwo, setBottomTwo] = useState<Digimon[]>([]);
  const [seasonTea, setSeasonTea] = useState<string[]>([]);
  const [placementsOverride, setPlacementsOverride] = useState<{ [digimonId: string]: string }>({});

  useEffect(() => {
    // Check for finale at the top 4
    if (digimon.length === 4 && currentStage !== 'FINALE' && currentStage !== 'CROWNING') {
        setCurrentStage('FINALE');
        generateFinaleEvents();
    }
  }, [digimon, currentStage]);

  const generateTea = (event: string) => {
    setSeasonTea(prevTea => [...prevTea, `Episode ${currentEpisode}: ${event}`]);
  };

  const generateRelationships = (digimon1: Digimon, digimon2: Digimon, strength: number, reason: string) => {
    const newRelationship = `Episode ${currentEpisode}: ${digimon1.name} and ${digimon2.name} are ${strength > 0 ? 'getting closer' : 'feuding'}! ${reason}`;
    setSeasonTea(prevTea => [...prevTea, newRelationship]);
    digimon1.relationships[digimon2.id] = digimon1.relationships[digimon2.id] || 0;
    digimon2.relationships[digimon1.id] = digimon2.relationships[digimon1.id] || 0;
    digimon1.relationships[digimon2.id] += strength;
    digimon2.relationships[digimon1.id] += strength;
  }

  const generateStorylineEvent = (digimon: Digimon, event: string) => {
    digimon.storyline.push(`Episode ${currentEpisode}: ${event}`);
  };

  const handleNextEpisode = () => {
      if (currentStage === 'ELIMINATION') {
          if (eliminatedDigimon) {
              setDigimon(prevDigimon => prevDigimon.filter(d => d.id !== eliminatedDigimon.id));
          }
          setEliminatedDigimon(null);
          setBottomTwo([]);
      }
  
      if (currentStage === 'CROWNING') {
          // Reset the game
          setDigimon(() => getRandomDigimon(digimonData, 12));
          setCurrentEpisode(1);
          setCurrentChallenge(null);
          setCurrentStage('ENTRANCES');
          setEpisodeResults({});
          setLipSyncResults({ winner: null, loser: null });
          setEliminatedDigimon(null);
          setBottomTwo([]);
          setSeasonTea([]);
          setPlacementsOverride({});
          return; // Stop here, no need to increment the episode.
      }
      
      setCurrentEpisode(prevEpisode => prevEpisode + 1);
      setCurrentStage('ENTRANCES');
      setCurrentChallenge(null);
      setEpisodeResults({});
      setLipSyncResults({ winner: null, loser: null });
  };
  
  const handleOverridePlacements = () => {
    //  Apply the overridden placements
    const newResults: { [digimonId: string]: string } = {};
    digimon.forEach(d => {
        newResults[d.id] = placementsOverride[d.id] || episodeResults[d.id] || 'SAFE'; // If not overridden, keep original or SAFE
    });
    setEpisodeResults(newResults);
    setCurrentStage('RESULTS');  // Move to the next stage immediately
  }

  const calculateChallengeScore = (digimon: Digimon, challengeType: string): number => {
    const stat = getChallengeStats(digimon, challengeType);
    return stat + Math.random() * 20 - 10; // Add some randomness
  };

  const getChallengeWinner = (digimonList: Digimon[], challengeType: string): Digimon | null => {
    if (!challengeType) return null;

    const digimonWithScores = digimonList.map(digimon => ({
      digimon,
      score: calculateChallengeScore(digimon, challengeType),
    }));

    digimonWithScores.sort((a, b) => b.score - a.score); // Sort by score descending

    return digimonWithScores[0]?.digimon || null;
  };
    
  const getChallengeBottomTwo = (digimonList: Digimon[], challengeType: string): Digimon[] => {
      if (!challengeType) return [];
  
      const digimonWithScores = digimonList.map(digimon => ({
          digimon,
          score: calculateChallengeScore(digimon, challengeType),
      }));
  
      digimonWithScores.sort((a, b) => a.score - b.score); // Sort by score ascending
      return digimonWithScores.slice(digimonList.length - 2).map(item => item.digimon);
  };
  

  const handleChallengeSelection = (challengeKey: string) => {
    setCurrentChallenge(challengeKey);
    setCurrentStage('CHALLENGE ANNOUNCEMENT');