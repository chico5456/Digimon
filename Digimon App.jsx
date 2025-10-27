import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';

// ---  Digimon Data  ---
interface DigimonTemplate {
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
}

interface TrackRecordEntry {
  episode: number;
  placement: string;
}

interface Digimon {
  id: string;
  name: string;
  image: string;
  stats: DigimonTemplate['stats'];
  trackRecord: TrackRecordEntry[];
  storyline: string[];
  relationships: { [digimonId: string]: number };
  isActive: boolean;
}

const digimonData: DigimonTemplate[] = [
  {
    name: "Angewomon",
    image: "https://wikimon.net/images/thumb/7/7b/Angewomon.jpg/250px-Angewomon.jpg",
    stats: { acting: 80, improv: 75, comedy: 60, dance: 85, design: 90, runway: 95, lipsync: 90, makeover: 85, rusical: 70, rumix: 75 },
  },
  {
    name: "Lilymon",
    image: "https://wikimon.net/images/thumb/e/e0/Lilymon.jpg/250px-Lilymon.jpg",
    stats: { acting: 65, improv: 70, comedy: 70, dance: 80, design: 85, runway: 80, lipsync: 80, makeover: 75, rusical: 75, rumix: 70 },
  },
  {
    name: "Rosemon",
    image: "https://wikimon.net/images/thumb/f/fa/Rosemon.jpg/250px-Rosemon.jpg",
    stats: { acting: 70, improv: 60, comedy: 75, dance: 90, design: 80, runway: 90, lipsync: 95, makeover: 80, rusical: 80, rumix: 85 },
  },
  {
    name: "Sakuyamon",
    image: "https://wikimon.net/images/thumb/c/c9/Sakuyamon.jpg/250px-Sakuyamon.jpg",
    stats: { acting: 85, improv: 80, comedy: 80, dance: 75, design: 70, runway: 75, lipsync: 85, makeover: 70, rusical: 90, rumix: 75 },
  },
  {
    name: "Venusmon",
    image: "https://wikimon.net/images/thumb/3/36/Venusmon.jpg/250px-Venusmon.jpg",
    stats: { acting: 60, improv: 65, comedy: 70, dance: 80, design: 95, runway: 90, lipsync: 75, makeover: 85, rusical: 70, rumix: 70 },
  },
  {
    name: "Ophanimon",
    image: "https://wikimon.net/images/thumb/1/15/Ophanimon.jpg/250px-Ophanimon.jpg",
    stats: { acting: 75, improv: 70, comedy: 65, dance: 70, design: 80, runway: 85, lipsync: 80, makeover: 75, rusical: 85, rumix: 70 },
  },
  {
    name: "Minervamon",
    image: "https://wikimon.net/images/thumb/0/07/Minervamon.jpg/250px-Minervamon.jpg",
    stats: { acting: 90, improv: 85, comedy: 80, dance: 75, design: 70, runway: 75, lipsync: 90, makeover: 70, rusical: 80, rumix: 85 },
  },
  {
    name: "Mastemon",
    image: "https://wikimon.net/images/thumb/6/6b/Mastemon.jpg/250px-Mastemon.jpg",
    stats: { acting: 80, improv: 80, comedy: 85, dance: 80, design: 80, runway: 90, lipsync: 85, makeover: 80, rusical: 90, rumix: 75 },
  },
  {
    name: "Magnadramon",
    image: "https://wikimon.net/images/thumb/d/d4/Magnadramon.jpg/250px-Magnadramon.jpg",
    stats: { acting: 60, improv: 60, comedy: 60, dance: 70, design: 80, runway: 85, lipsync: 80, makeover: 75, rusical: 70, rumix: 65 },
  },
  {
    name: "Sirenmon",
    image: "https://wikimon.net/images/thumb/d/d2/Sirenmon.jpg/250px-Sirenmon.jpg",
    stats: { acting: 85, improv: 70, comedy: 80, dance: 90, design: 75, runway: 95, lipsync: 90, makeover: 85, rusical: 80, rumix: 80 },
  },
  {
    name: "Eosmon",
    image: "https://wikimon.net/images/thumb/4/4b/Eosmon.jpg/250px-Eosmon.jpg",
    stats: { acting: 70, improv: 75, comedy: 70, dance: 65, design: 80, runway: 80, lipsync: 80, makeover: 70, rusical: 75, rumix: 70 },
  },
  {
    name: "Mervamon",
    image: "https://wikimon.net/images/thumb/d/d8/Mervamon.jpg/250px-Mervamon.jpg",
    stats: { acting: 90, improv: 90, comedy: 80, dance: 70, design: 75, runway: 80, lipsync: 95, makeover: 70, rusical: 85, rumix: 80 },
  },
  {
    name: "AncientMermaimon",
    image: "https://wikimon.net/images/thumb/a/a2/AncientMermaimon.jpg/250px-AncientMermaimon.jpg",
    stats: { acting: 75, improv: 80, comedy: 70, dance: 95, design: 85, runway: 90, lipsync: 90, makeover: 80, rusical: 75, rumix: 80 },
  },
  {
    name: "GraceNovamon",
    image: "https://wikimon.net/images/thumb/5/52/GraceNovamon.jpg/250px-GraceNovamon.jpg",
    stats: { acting: 80, improv: 80, comedy: 85, dance: 70, design: 80, runway: 75, lipsync: 80, makeover: 85, rusical: 90, rumix: 80 },
  },
  {
    name: "Kuzuhamon",
    image: "https://wikimon.net/images/thumb/0/07/Kuzuhamon.jpg/250px-Kuzuhamon.jpg",
    stats: { acting: 85, improv: 80, comedy: 75, dance: 70, design: 80, runway: 80, lipsync: 85, makeover: 70, rusical: 80, rumix: 85 },
  },
  {
    name: "MarineAngemon",
    image: "https://wikimon.net/images/thumb/6/69/MarineAngemon.jpg/250px-MarineAngemon.jpg",
    stats: { acting: 60, improv: 65, comedy: 95, dance: 70, design: 60, runway: 60, lipsync: 65, makeover: 60, rusical: 60, rumix: 65 },
  },
  {
    name: "Ranamon",
    image: "https://wikimon.net/images/thumb/b/be/Ranamon.jpg/250px-Ranamon.jpg",
    stats: { acting: 65, improv: 70, comedy: 70, dance: 85, design: 80, runway: 75, lipsync: 80, makeover: 75, rusical: 75, rumix: 70 },
  },
  {
    name: "BelleStarmon",
    image: "https://wikimon.net/images/thumb/7/7a/BelleStarmon.jpg/250px-BelleStarmon.jpg",
    stats: { acting: 78, improv: 82, comedy: 68, dance: 88, design: 92, runway: 94, lipsync: 86, makeover: 80, rusical: 79, rumix: 84 },
  },
  {
    name: "Lilithmon",
    image: "https://wikimon.net/images/thumb/1/12/Lilithmon.jpg/250px-Lilithmon.jpg",
    stats: { acting: 88, improv: 85, comedy: 82, dance: 74, design: 95, runway: 93, lipsync: 87, makeover: 83, rusical: 88, rumix: 90 },
  },
  {
    name: "LadyDevimon",
    image: "https://wikimon.net/images/thumb/2/20/LadyDevimon.jpg/250px-LadyDevimon.jpg",
    stats: { acting: 82, improv: 78, comedy: 76, dance: 72, design: 88, runway: 91, lipsync: 92, makeover: 77, rusical: 81, rumix: 86 },
  },
];

// --- Helper Functions ---
const getRandomDigimon = (digimonList: DigimonTemplate[], count: number): DigimonTemplate[] => {
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
  const score1 = digimon1.stats.lipsync + Math.random() * 20 - 10;
  const score2 = digimon2.stats.lipsync + Math.random() * 20 - 10;

  if (score1 > score2) {
    return { winner: digimon1, loser: digimon2 };
  }
  if (score2 > score1) {
    return { winner: digimon2, loser: digimon1 };
  }
  return Math.random() < 0.5 ? { winner: digimon1, loser: digimon2 } : { winner: digimon2, loser: digimon1 };
};

const challengeNouns: { [key: string]: string } = {
  acting: 'acting scene',
  improv: 'improv showdown',
  comedy: 'stand-up set',
  dance: 'dance-off',
  design: 'design ball',
  runway: 'runway spectacular',
  makeover: 'makeover mission',
  rusical: 'rusical extravaganza',
  rumix: 'rumix recording',
};

const generatePerformanceDescription = (queen: Digimon, challengeType: string, score: number): string => {
  const challengeName = challengeNouns[challengeType] || 'challenge';
  let verdict = '';

  if (score >= 90) {
    verdict = `${queen.name} absolutely dominated the ${challengeName}, leaving the judges speechless.`;
  } else if (score >= 80) {
    verdict = `${queen.name} delivered a polished and emotional take on the ${challengeName}.`;
  } else if (score >= 70) {
    verdict = `${queen.name} impressed with a steady performance in the ${challengeName}, though there is room to grow.`;
  } else if (score >= 60) {
    verdict = `${queen.name} fought through the ${challengeName} with moments of brilliance and some shaky bits.`;
  } else {
    verdict = `${queen.name} stumbled through the ${challengeName}, struggling to keep up with the competition.`;
  }

  const flavorLines = [
    'Her confessionals are buzzing as the werkroom tries to process the moment.',
    'Backstage whispers say this performance could redefine the season narrative.',
    'Producers are replaying the clip already—it is that iconic.',
    'Even the pit crew gagged at the unexpected twist mid-performance.',
    'The judges exchanged knowing looks—this queen is shifting the power dynamics.',
  ];

  const addedDrama = flavorLines[Math.floor(Math.random() * flavorLines.length)];
  return `${verdict} ${addedDrama}`;
};

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
    const aLastElimination = [...a.trackRecord].reverse().find(record => record.placement === 'ELIM');
    const bLastElimination = [...b.trackRecord].reverse().find(record => record.placement === 'ELIM');
    const aEliminationEpisode = aLastElimination?.episode ?? 99;
    const bEliminationEpisode = bLastElimination?.episode ?? 99;

    if (aEliminationEpisode !== bEliminationEpisode) {
      return bEliminationEpisode - aEliminationEpisode;
    }

    const aWins = a.trackRecord.filter(record => record.placement === 'WIN' || record.placement === 'WINNER').length;
    const bWins = b.trackRecord.filter(record => record.placement === 'WIN' || record.placement === 'WINNER').length;
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
                {digimon.trackRecord
                  .sort((a, b) => a.episode - b.episode)
                  .map((record, index) => (
                    <span
                      key={`${record.episode}-${index}`}
                      className={`inline-block mr-1 mb-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        record.placement === 'WIN' || record.placement === 'WINNER'
                          ? 'bg-green-100 text-green-800'
                          : record.placement === 'HIGH'
                          ? 'bg-blue-100 text-blue-800'
                          : record.placement === 'LOW'
                          ? 'bg-yellow-100 text-yellow-800'
                          : record.placement === 'BTM2'
                          ? 'bg-red-100 text-red-800'
                          : record.placement === 'ELIM'
                          ? 'bg-red-500 text-white'
                          : record.placement === 'RUNNER-UP'
                          ? 'bg-purple-200 text-purple-800'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
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
  const wins = digimonList.map(digimon => digimon.trackRecord.filter(record => record.placement === 'WIN' || record.placement === 'WINNER').length);
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

// --- Component: Producer's Room ---
interface ProducerRoomProps {
  digimonList: Digimon[];
  episode: number;
  placements: { [digimonId: string]: string };
  setPlacements: React.Dispatch<React.SetStateAction<{ [digimonId: string]: string }>>;
  onOverride: () => void;
  bottomTwoIds: string[];
  setBottomTwoIds: React.Dispatch<React.SetStateAction<string[]>>;
  eliminatedId: string | null;
  setEliminatedId: React.Dispatch<React.SetStateAction<string | null>>;
}

const ProducerRoom = ({ digimonList, episode, placements, setPlacements, onOverride, bottomTwoIds, setBottomTwoIds, eliminatedId, setEliminatedId }: ProducerRoomProps) => {
  const handlePlacementChange = (digimonId: string, placement: string) => {
    setPlacements(prevPlacements => ({
      ...prevPlacements,
      [digimonId]: placement,
    }));
  };

  const handleBottomTwoToggle = (digimonId: string) => {
    setBottomTwoIds(prev => {
      if (prev.includes(digimonId)) {
        return prev.filter(id => id !== digimonId);
      }
      if (prev.length >= 2) {
        return prev;
      }
      return [...prev, digimonId];
    });
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
              <span className="flex-1">{digimon.name}</span>
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
              onClick={() => handleBottomTwoToggle(digimon.id)}
              className={`px-3 py-1 rounded-md shadow-sm ${bottomTwoIds.includes(digimon.id) ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {digimon.name}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600">
          Select two Digimon to be in the bottom two. They will not be auto-eliminated.
        </p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-1">Choose Eliminated</h3>
        <div className="flex flex-wrap gap-2">
          {bottomTwoIds.map(id => {
            const digimon = digimonList.find(d => d.id === id);
            if (!digimon) return null;
            return (
              <button
                key={id}
                onClick={() => setEliminatedId(id)}
                className={`px-3 py-1 rounded-md shadow-sm ${eliminatedId === id ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                {digimon.name}
              </button>
            );
          })}
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
type Stage =
  | 'ENTRANCES'
  | 'PROMO CHART'
  | 'CHALLENGE SELECTOR'
  | 'CHALLENGE ANNOUNCEMENT'
  | 'PERFORMANCES'
  | 'RESULTS'
  | 'LIPSYNC'
  | 'ELIMINATION'
  | 'FINALE'
  | 'CROWNING';

const DigimonSimulator = () => {
  const createSeasonCast = () => {
    const selected = getRandomDigimon(digimonData, 12);
    return selected.map(template => ({
      id: uuidv4(),
      name: template.name,
      image: template.image,
      stats: { ...template.stats },
      trackRecord: [],
      storyline: [],
      relationships: {},
      isActive: true,
    }));
  };

  const [seasonCast, setSeasonCast] = useState<Digimon[]>(createSeasonCast);
  const [promoOrder, setPromoOrder] = useState<string[]>(() => seasonCast.map(queen => queen.id));
  const activeQueens = useMemo(() => seasonCast.filter(queen => queen.isActive), [seasonCast]);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [currentChallenge, setCurrentChallenge] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState<Stage>('ENTRANCES');
  const [episodeResults, setEpisodeResults] = useState<{ [digimonId: string]: string }>({});
  const [performances, setPerformances] = useState<{ [digimonId: string]: { score: number; description: string } }>({});
  const [lipSyncResults, setLipSyncResults] = useState<{ winnerId: string | null; loserId: string | null }>({ winnerId: null, loserId: null });
  const [eliminatedId, setEliminatedId] = useState<string | null>(null);
  const [bottomTwoIds, setBottomTwoIds] = useState<string[]>([]);
  const [seasonTea, setSeasonTea] = useState<string[]>([]);
  const [placementsOverride, setPlacementsOverride] = useState<{ [digimonId: string]: string }>({});
  const [finaleEvents, setFinaleEvents] = useState<string[]>([]);
  const [episodeDrama, setEpisodeDrama] = useState<string[]>([]);
  const [finaleWinnerId, setFinaleWinnerId] = useState<string | null>(null);

  useEffect(() => {
    setPromoOrder(prev => {
      const activeIds = activeQueens.map(q => q.id);
      const existing = prev.filter(id => activeIds.includes(id));
      const newIds = activeIds.filter(id => !existing.includes(id));
      return [...existing, ...newIds];
    });
  }, [activeQueens]);

  useEffect(() => {
    if (activeQueens.length === 4 && currentStage !== 'FINALE' && currentStage !== 'CROWNING') {
      setCurrentStage('FINALE');
      generateFinaleEvents();
    }
  }, [activeQueens.length, currentStage]);

  const getQueenName = (id: string) => seasonCast.find(queen => queen.id === id)?.name || 'Unknown Queen';

  const appendTea = (message: string) => {
    setSeasonTea(prevTea => [...prevTea, `Episode ${currentEpisode}: ${message}`]);
  };

  const addStorylineEvent = (queenId: string, event: string) => {
    setSeasonCast(prev => prev.map(queen => {
      if (queen.id !== queenId) return queen;
      return { ...queen, storyline: [...queen.storyline, `Episode ${currentEpisode}: ${event}`] };
    }));
  };

  const addRelationshipEvent = (queenIdA: string, queenIdB: string, strength: number, reason: string) => {
    const nameA = getQueenName(queenIdA);
    const nameB = getQueenName(queenIdB);
    setSeasonCast(prev => prev.map(queen => {
      if (queen.id === queenIdA) {
        const value = (queen.relationships[queenIdB] || 0) + strength;
        return {
          ...queen,
          relationships: { ...queen.relationships, [queenIdB]: value },
          storyline: [...queen.storyline, `Episode ${currentEpisode}: ${strength > 0 ? 'Bonding with' : 'Clashing with'} ${nameB} - ${reason}`],
        };
      }
      if (queen.id === queenIdB) {
        const value = (queen.relationships[queenIdA] || 0) + strength;
        return {
          ...queen,
          relationships: { ...queen.relationships, [queenIdA]: value },
          storyline: [...queen.storyline, `Episode ${currentEpisode}: ${strength > 0 ? 'Bonding with' : 'Clashing with'} ${nameA} - ${reason}`],
        };
      }
      return queen;
    }));
    appendTea(`${nameA} and ${nameB} ${strength > 0 ? 'are bonding over' : 'get into drama about'} ${reason}.`);
  };

  const resetEpisodeState = () => {
    setCurrentChallenge(null);
    setEpisodeResults({});
    setPerformances({});
    setLipSyncResults({ winnerId: null, loserId: null });
    setEliminatedId(null);
    setBottomTwoIds([]);
    setPlacementsOverride({});
    setEpisodeDrama([]);
  };

  const resetSeason = () => {
    const newCast = createSeasonCast();
    setSeasonCast(newCast);
    setPromoOrder(newCast.map(q => q.id));
    setCurrentEpisode(1);
    setCurrentStage('ENTRANCES');
    setSeasonTea([]);
    setFinaleEvents([]);
    setFinaleWinnerId(null);
    resetEpisodeState();
  };

  const applyPlacementsToTrackRecord = (placementsMap: { [digimonId: string]: string }) => {
    setSeasonCast(prev => prev.map(queen => {
      if (!queen.isActive) {
        return queen;
      }
      const placement = placementsMap[queen.id];
      if (!placement) {
        return queen;
      }
      const filtered = queen.trackRecord.filter(record => record.episode !== currentEpisode);
      return {
        ...queen,
        trackRecord: [...filtered, { episode: currentEpisode, placement }],
      };
    }));
  };

  const generateDramaMoments = (participants: Digimon[]) => {
    const dramaLines: string[] = [];
    if (participants.length < 2) return dramaLines;

    const randomPair = () => {
      const shuffled = [...participants].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 2);
    };

    const [queenA, queenB] = randomPair();
    const conflicts = [
      'who hogged the mirror space',
      'who should have won last week',
      'whose outfit screams Digidestined couture',
      'the secret alliance forming backstage',
      'the rumors about a surprise returning queen',
    ];
    addRelationshipEvent(queenA.id, queenB.id, Math.random() > 0.5 ? 10 : -15, conflicts[Math.floor(Math.random() * conflicts.length)]);

    const [allyA, allyB] = randomPair();
    const alliances = [
      'their shared love of glitter bombs',
      'a choreography breakthrough',
      'late night rehearsals in the werkroom',
      'teaming up for the makeover station',
      'plotting a double win fantasy',
    ];
    addRelationshipEvent(allyA.id, allyB.id, 12, alliances[Math.floor(Math.random() * alliances.length)]);

    dramaLines.push(`${queenA.name} and ${queenB.name} are in a heated debate over rehearsal spotlight time.`);
    dramaLines.push(`${allyA.name} and ${allyB.name} form a strategic sisterhood to dominate the season narrative.`);

    return dramaLines;
  };

  const simulatePerformances = () => {
    if (!currentChallenge) return;

    const newPerformances: { [id: string]: { score: number; description: string } } = {};
    activeQueens.forEach(queen => {
      const stat = getChallengeStats(queen, currentChallenge);
      const score = stat + Math.random() * 20 - 10;
      const description = generatePerformanceDescription(queen, currentChallenge, score);
      newPerformances[queen.id] = { score, description };
    });

    setPerformances(newPerformances);
    setSeasonCast(prev => prev.map(queen => {
      if (!queen.isActive) return queen;
      const performance = newPerformances[queen.id];
      if (!performance) return queen;
      return {
        ...queen,
        storyline: [...queen.storyline, `Episode ${currentEpisode}: ${performance.description}`],
      };
    }));

    const drama = generateDramaMoments(activeQueens);
    setEpisodeDrama(drama);
  };

  const determineEpisodePlacements = () => {
    const entries = Object.entries(performances).sort((a, b) => b[1].score - a[1].score);
    if (!entries.length) return {} as { [id: string]: string };

    const placements: { [id: string]: string } = {};
    const participantCount = entries.length;

    placements[entries[0][0]] = 'WIN';

    const highCount = Math.min(2, Math.max(participantCount - 1, 0));
    for (let i = 1; i <= highCount && i < entries.length; i += 1) {
      placements[entries[i][0]] = 'HIGH';
    }

    const bottomEntries = entries.slice(-2);
    bottomEntries.forEach(entry => {
      placements[entry[0]] = 'BTM2';
    });

    if (participantCount > 5) {
      const lowIndex = participantCount - 3;
      if (!placements[entries[lowIndex][0]]) {
        placements[entries[lowIndex][0]] = 'LOW';
      }
    }

    entries.forEach(([id]) => {
      if (!placements[id]) {
        placements[id] = 'SAFE';
      }
    });

    return placements;
  };

  const handleChallengeSelection = (challengeKey: string) => {
    setCurrentChallenge(challengeKey);
    setCurrentStage('CHALLENGE ANNOUNCEMENT');
    const introLines = [
      'The werkroom lights flicker as Ru announces a supersized main challenge.',
      'A cryptic message from Gennai hints at a shocking twist this episode.',
      'The queens gasp as the siren blares—double challenge realness!',
      'The pit crew drops glitter confetti as the queens huddle for strategy.',
    ];
    appendTea(introLines[Math.floor(Math.random() * introLines.length)]);
  };

  const handleBeginPerformances = () => {
    simulatePerformances();
    setCurrentStage('PERFORMANCES');
  };

  const applyPlacements = (placements: { [id: string]: string }) => {
    setEpisodeResults(placements);
    setBottomTwoIds(Object.entries(placements).filter(([, placement]) => placement === 'BTM2').map(([id]) => id));
    setEliminatedId(null);
  };

  const handleJudging = () => {
    const placements = determineEpisodePlacements();
    applyPlacements(placements);
    setPlacementsOverride(placements);
    setCurrentStage('RESULTS');
  };

  const handleOverridePlacements = () => {
    applyPlacements(placementsOverride);
  };

  const handleProceedToLipsync = () => {
    if (!Object.keys(episodeResults).length) {
      handleJudging();
    }
    applyPlacementsToTrackRecord(episodeResults);

    if (bottomTwoIds.length === 2) {
      const [firstId, secondId] = bottomTwoIds;
      const queenA = activeQueens.find(q => q.id === firstId);
      const queenB = activeQueens.find(q => q.id === secondId);
      if (queenA && queenB) {
        const { winner, loser } = determineLipsyncWinner(queenA, queenB);
        setLipSyncResults({ winnerId: winner.id, loserId: loser.id });
        setEliminatedId(loser.id);
        appendTea(`${winner.name} demolishes the lip sync while ${loser.name} fights to stay.`);
      }
    }

    setCurrentStage('LIPSYNC');
  };

  const handleFinalizeElimination = () => {
    if (!eliminatedId) return;

    const eliminatedQueen = seasonCast.find(queen => queen.id === eliminatedId);
    if (!eliminatedQueen) return;

    setSeasonCast(prev => prev.map(queen => {
      if (queen.id !== eliminatedId) return queen;
      const hasElimRecord = queen.trackRecord.some(record => record.episode === currentEpisode && record.placement === 'ELIM');
      return {
        ...queen,
        isActive: false,
        trackRecord: hasElimRecord ? queen.trackRecord : [...queen.trackRecord, { episode: currentEpisode, placement: 'ELIM' }],
      };
    }));

    appendTea(`${eliminatedQueen.name} sashays away after an emotional farewell.`);
    setCurrentStage('ELIMINATION');
  };

  const handleNextEpisode = () => {
    if (currentStage === 'ELIMINATION') {
      setCurrentEpisode(prev => prev + 1);
      resetEpisodeState();
      setCurrentStage('ENTRANCES');
      return;
    }

    if (currentStage === 'CROWNING') {
      resetSeason();
      return;
    }

    if (currentStage === 'FINALE') {
      setCurrentStage('CROWNING');
      handleCrownWinner();
    }
  };

  const generateFinaleEvents = () => {
    const finalists = activeQueens;
    const finaleNarrative = [
      'The studio transforms into a celestial battlefield fit for Digi-royalty.',
      'Legendary Digimon judges return to deliver critiques fiercer than Mega evolutions.',
      'A surprise message from Queen Ophanimon crowns the werkroom with sparkling data wings.',
    ];

    const events: string[] = [
      finaleNarrative[Math.floor(Math.random() * finaleNarrative.length)],
      `${finalists[0]?.name} rehearses with laser-focused determination, refusing to settle for runner-up.`,
      `${finalists[1]?.name} revisits her season-long storyline in a heartfelt confessional arc.`,
      `${finalists[2]?.name} launches a campaign to become the lip-sync legend of the digital multiverse.`,
      `${finalists[3]?.name} crafts the ultimate Digi-couture gown stitched with firewall flames.`,
    ].filter(Boolean);

    setFinaleEvents(events);
    appendTea('The Final Four prepare for the ultimate Digi lipsync smackdown.');
  };

  const handleCrownWinner = () => {
    const finalists = activeQueens;
    if (finalists.length !== 4) return;

    const calculateFinaleScore = (queen: Digimon) => {
      const wins = queen.trackRecord.filter(entry => entry.placement === 'WIN' || entry.placement === 'WINNER').length;
      const highs = queen.trackRecord.filter(entry => entry.placement === 'HIGH').length;
      return wins * 30 + highs * 15 + calculateAverageStat(queen);
    };

    const sorted = [...finalists].sort((a, b) => calculateFinaleScore(b) - calculateFinaleScore(a));
    const winner = sorted[0];
    if (!winner) return;

    setFinaleWinnerId(winner.id);
    appendTea(`${winner.name} conquers the finale and becomes the next Digi Superstar!`);

    setSeasonCast(prev => prev.map(queen => {
      if (!queen.isActive) return queen;
      if (queen.id === winner.id) {
        return {
          ...queen,
          trackRecord: [...queen.trackRecord, { episode: currentEpisode, placement: 'WINNER' }],
        };
      }
      return {
        ...queen,
        trackRecord: [...queen.trackRecord, { episode: currentEpisode, placement: 'RUNNER-UP' }],
      };
    }));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    setPromoOrder(prev => {
      const items = [...prev];
      const [removed] = items.splice(result.source.index, 1);
      items.splice(result.destination!.index, 0, removed);
      return items;
    });
  };

  const renderStageContent = () => {
    switch (currentStage) {
      case 'ENTRANCES':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-pink-600">Werkroom Entrances</h2>
            <p className="text-gray-700">Twelve fierce Digimon queens beam into the Digiwerkroom ready to serve charisma, uniqueness, nerve, talent, and data.</p>
            <div className="flex flex-wrap gap-4">
              {activeQueens.map(digimon => (
                <DigimonCard key={digimon.id} digimon={digimon} />
              ))}
            </div>
            <button
              onClick={() => setCurrentStage('PROMO CHART')}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition"
            >
              Proceed to Promo Chart
            </button>
          </div>
        );
      case 'PROMO CHART':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-purple-600">Promo Chart</h2>
            <p className="text-gray-700">Drag the queens to rank their pre-season buzz. Producers are watching every move.</p>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="promoOrder">
                {provided => (
                  <ul
                    className="bg-white rounded-lg shadow divide-y divide-gray-200"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {promoOrder.map((id, index) => {
                      const queen = seasonCast.find(q => q.id === id);
                      if (!queen) return null;
                      return (
                        <Draggable draggableId={id} index={index} key={id}>
                          {dragProvided => (
                            <li
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              className="flex items-center justify-between px-4 py-3"
                            >
                              <div className="flex items-center space-x-3">
                                <span className="font-semibold text-gray-600">#{index + 1}</span>
                                <img src={queen.image} alt={queen.name} className="w-10 h-10 rounded-full" />
                                <span className="font-medium text-gray-800">{queen.name}</span>
                              </div>
                              <span className="text-sm text-gray-500">Storyline heat: {queen.storyline.length}</span>
                            </li>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
            <button
              onClick={() => setCurrentStage('CHALLENGE SELECTOR')}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition"
            >
              Head to Challenge Selector
            </button>
          </div>
        );
      case 'CHALLENGE SELECTOR':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-indigo-600">Challenge Selector</h2>
            <p className="text-gray-700">Pick the main challenge for this episode. Every stat counts and alliances will be tested.</p>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(challenges).map(([key, challenge]) => (
                <div key={key} className="bg-white rounded-xl shadow p-4 border border-indigo-100">
                  <h3 className="text-xl font-semibold text-indigo-600">{challenge.name}</h3>
                  <p className="text-gray-600 mb-2">{challenge.description}</p>
                  <p className="text-sm text-gray-500 mb-4">Featured stat: {challenge.stat.toUpperCase()}</p>
                  <button
                    onClick={() => handleChallengeSelection(key)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full"
                  >
                    Choose {challenge.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'CHALLENGE ANNOUNCEMENT':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-600">Challenge Announcement</h2>
            {currentChallenge && (
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-xl font-semibold text-blue-600">{challenges[currentChallenge].name}</h3>
                <p className="text-gray-700">{challenges[currentChallenge].description}</p>
                <p className="text-sm text-gray-500 mt-2">Stat Focus: {challenges[currentChallenge].stat.toUpperCase()}</p>
              </div>
            )}
            <button
              onClick={handleBeginPerformances}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg"
            >
              Let the Challenge Begin
            </button>
          </div>
        );
      case 'PERFORMANCES':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-teal-600">Performances</h2>
            <p className="text-gray-700">The queens pour their circuits into the challenge. Producers capture every gasp, stunt, and data glitch.</p>
            <div className="space-y-3">
              {Object.entries(performances).map(([id, performance]) => {
                const queen = seasonCast.find(q => q.id === id);
                if (!queen) return null;
                return (
                  <div key={id} className="bg-white rounded-lg shadow p-4 border border-teal-100">
                    <h3 className="text-lg font-semibold text-teal-600">{queen.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">Score: {performance.score.toFixed(1)}</p>
                    <p className="text-gray-700">{performance.description}</p>
                  </div>
                );
              })}
            </div>
            {episodeDrama.length > 0 && (
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-pink-600 mb-2">Werkroom Drama</h3>
                <ul className="list-disc list-inside text-pink-700 space-y-1">
                  {episodeDrama.map((moment, index) => (
                    <li key={index}>{moment}</li>
                  ))}
                </ul>
              </div>
            )}
            <button
              onClick={handleJudging}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-full shadow-lg"
            >
              Head to Judging
            </button>
          </div>
        );
      case 'RESULTS':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-red-600">Results Announcement</h2>
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold text-red-600 mb-4">Judge Deliberations</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(episodeResults).map(([id, placement]) => {
                  const queen = seasonCast.find(q => q.id === id);
                  if (!queen) return null;
                  return (
                    <div key={id} className="border border-red-100 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <img src={queen.image} alt={queen.name} className="w-12 h-12 rounded-full" />
                        <div>
                          <h4 className="font-semibold text-gray-800">{queen.name}</h4>
                          <p className="text-sm text-gray-500">Placement: {placement}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Storyline beats: {queen.storyline.slice(-2).join(' ')} </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <ProducerRoom
              digimonList={activeQueens}
              episode={currentEpisode}
              placements={placementsOverride}
              setPlacements={setPlacementsOverride}
              onOverride={handleOverridePlacements}
              bottomTwoIds={bottomTwoIds}
              setBottomTwoIds={setBottomTwoIds}
              eliminatedId={eliminatedId}
              setEliminatedId={setEliminatedId}
            />
            <button
              onClick={handleProceedToLipsync}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-lg"
            >
              Proceed to Lip Sync
            </button>
          </div>
        );
      case 'LIPSYNC':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-fuchsia-600">Lip Sync for Your Life</h2>
            <p className="text-gray-700">Two Digimon battle to stay. Producers hold their breath as pixels fly across the stage.</p>
            <div className="grid md:grid-cols-2 gap-4">
              {bottomTwoIds.map(id => {
                const queen = seasonCast.find(q => q.id === id);
                if (!queen) return null;
                const isWinner = lipSyncResults.winnerId === id;
                const isLoser = lipSyncResults.loserId === id;
                return (
                  <div key={id} className={`rounded-xl p-5 shadow border-2 ${isWinner ? 'border-green-400 bg-green-50' : isLoser ? 'border-red-400 bg-red-50' : 'border-fuchsia-200 bg-white'}`}>
                    <div className="flex items-center space-x-3 mb-3">
                      <img src={queen.image} alt={queen.name} className="w-12 h-12 rounded-full" />
                      <div>
                        <h3 className="font-semibold text-gray-800">{queen.name}</h3>
                        <p className="text-sm text-gray-500">Lip Sync Stat: {queen.stats.lipsync}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{queen.storyline.slice(-1)}</p>
                    <button
                      onClick={() => setEliminatedId(id)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${eliminatedId === id ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      {eliminatedId === id ? 'Selected to Sashay' : 'Mark to Sashay Away'}
                    </button>
                  </div>
                );
              })}
            </div>
            <button
              onClick={handleFinalizeElimination}
              className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-6 py-3 rounded-full shadow-lg"
            >
              Finalize Elimination
            </button>
          </div>
        );
      case 'ELIMINATION':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-rose-600">Elimination Ceremony</h2>
            {eliminatedId ? (
              <div className="bg-white rounded-xl shadow p-6 border border-rose-100">
                <h3 className="text-xl font-semibold text-rose-600">Sashay Away</h3>
                <p className="text-gray-700">{getQueenName(eliminatedId)} leaves the Digi-stage with grace and a legendary storyline.</p>
              </div>
            ) : (
              <p className="text-gray-700">No Digimon eliminated. Did the producers just pull a double save twist?</p>
            )}
            <button
              onClick={handleNextEpisode}
              className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full shadow-lg"
            >
              Next Episode
            </button>
          </div>
        );
      case 'FINALE':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-yellow-600">Grand Finale</h2>
            <p className="text-gray-700">The final four queens prepare for the Digi showdown of a lifetime.</p>
            <div className="grid md:grid-cols-2 gap-4">
              {activeQueens.map(queen => (
                <div key={queen.id} className="bg-white rounded-xl shadow p-4 border border-yellow-100">
                  <div className="flex items-center space-x-3 mb-2">
                    <img src={queen.image} alt={queen.name} className="w-12 h-12 rounded-full" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{queen.name}</h3>
                      <p className="text-sm text-gray-500">Average Stat: {calculateAverageStat(queen).toFixed(1)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Season Highlights: {queen.trackRecord.map(entry => entry.placement).join(', ')}</p>
                </div>
              ))}
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-700 mb-2">Finale Tea</h3>
              <ul className="list-disc list-inside text-yellow-800 space-y-1">
                {finaleEvents.map((event, index) => (
                  <li key={index}>{event}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={handleNextEpisode}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full shadow-lg"
            >
              Crown the Winner
            </button>
          </div>
        );
      case 'CROWNING':
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-emerald-600">Crowning Moment</h2>
            {finaleWinnerId ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-emerald-200 text-center">
                <img
                  src={seasonCast.find(q => q.id === finaleWinnerId)?.image}
                  alt={seasonCast.find(q => q.id === finaleWinnerId)?.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-2xl font-semibold text-emerald-600 mb-2">
                  {getQueenName(finaleWinnerId)} is the Next Digi Superstar!
                </h3>
                <p className="text-gray-700">After a season of fierce battles, alliances, and lip sync smackdowns, she reigns supreme.</p>
              </div>
            ) : (
              <p className="text-gray-700">The finale twists left the crown unclaimed. Reload the simulation to find your champion!</p>
            )}
            <button
              onClick={handleNextEpisode}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full shadow-lg"
            >
              Start a New Season
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="bg-white bg-opacity-70 backdrop-blur rounded-3xl shadow-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-purple-700">Digimon Drag Race Simulator</h1>
            <p className="text-gray-600">Episode {currentEpisode} · Stage: {currentStage.replace('_', ' ')}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <span className="bg-white px-4 py-2 rounded-full shadow text-sm text-gray-600">Queens Remaining: {activeQueens.length}</span>
            <span className="bg-white px-4 py-2 rounded-full shadow text-sm text-gray-600">Total Tea Spilled: {seasonTea.length}</span>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white bg-opacity-80 backdrop-blur rounded-3xl shadow-xl p-6">
              {renderStageContent()}
            </div>
          </div>
          <div className="space-y-6">
            <SeasonStats digimonList={seasonCast} />
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-2 text-pink-600">Season Tea & Drama</h2>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {seasonTea.length === 0 ? (
                  <p className="text-gray-500">Tea is brewing... stay tuned!</p>
                ) : (
                  seasonTea.map((entry, index) => (
                    <div key={index} className="bg-pink-50 border border-pink-100 rounded-md p-2 text-sm text-pink-800">
                      {entry}
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-2 text-indigo-600">Episode Storylines</h2>
              <div className="max-h-64 overflow-y-auto space-y-3">
                {seasonCast.map(queen => (
                  <div key={queen.id} className="border border-indigo-100 rounded-md p-2">
                    <h3 className="font-semibold text-indigo-600 text-sm">{queen.name}</h3>
                    <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                      {queen.storyline.slice(-3).map((story, index) => (
                        <li key={`${queen.id}-story-${index}`}>{story}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-80 backdrop-blur rounded-3xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">Track Record</h2>
          <TrackRecordTable digimonList={seasonCast} />
        </div>
      </div>
    </div>
  );
};

export default DigimonSimulator;

