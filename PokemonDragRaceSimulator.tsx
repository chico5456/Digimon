import React, { useMemo, useState } from 'react';
import {
  Crown,
  Sparkles,
  Trophy,
  Users,
  TrendingUp,
  MessageCircle,
  Settings,
  Play,
  X,
  Flame,
  Heart,
  Zap,
} from 'lucide-react';

const STAT_KEYS = [
  'acting',
  'improv',
  'comedy',
  'dance',
  'design',
  'runway',
  'lipsync',
  'makeover',
  'rusical',
  'rumix',
] as const;

type StatKey = typeof STAT_KEYS[number];

type Placement = 'WIN' | 'HIGH' | 'SAFE' | 'LOW' | 'BTM2' | 'ELIM';

type RelationshipType = 'ally' | 'rival' | 'neutral';

interface QueenStats {
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
}

interface QueenBase {
  id: number;
  name: string;
  image: string;
  stats: QueenStats;
  storyline: string;
  personality: string;
}

interface QueenState extends QueenBase {
  trackRecord: Placement[];
  relationships: Record<number, RelationshipType>;
}

interface Challenge {
  name: string;
  type: string;
  skills: StatKey[];
  description: string;
}

interface PerformancePreview {
  queen: QueenState;
  score: number;
  adjective: string;
  emoji: string;
  blurb: string;
}

interface EpisodeResult {
  queen: QueenState;
  placement: Placement;
  score: number;
}

const POKEMON_QUEENS: QueenBase[] = [
  {
    id: 1,
    name: 'Gardevoir',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/282.png',
    stats: { acting: 9, improv: 8, comedy: 7, dance: 9, design: 8, runway: 10, lipsync: 9, makeover: 9, rusical: 8, rumix: 9 },
    storyline: 'The ethereal fashion queen with a heart of gold',
    personality: 'Elegant, emotional, motherly',
  },
  {
    id: 2,
    name: 'Lopunny',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/428.png',
    stats: { acting: 7, improv: 8, comedy: 8, dance: 10, design: 7, runway: 9, lipsync: 10, makeover: 7, rusical: 9, rumix: 10 },
    storyline: 'The dancing diva who brings high energy to every challenge',
    personality: 'Bubbly, flirty, competitive',
  },
  {
    id: 3,
    name: 'Primarina',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/730.png',
    stats: { acting: 8, improv: 7, comedy: 6, dance: 8, design: 7, runway: 8, lipsync: 9, makeover: 7, rusical: 10, rumix: 9 },
    storyline: 'The theatrical performer with Broadway dreams',
    personality: 'Dramatic, talented, perfectionist',
  },
  {
    id: 4,
    name: 'Jynx',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/124.png',
    stats: { acting: 9, improv: 9, comedy: 10, dance: 7, design: 6, runway: 7, lipsync: 8, makeover: 6, rusical: 8, rumix: 7 },
    storyline: "The comedy queen who doesn't take herself too seriously",
    personality: 'Hilarious, bold, controversial',
  },
  {
    id: 5,
    name: 'Milotic',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/350.png',
    stats: { acting: 7, improv: 6, comedy: 5, dance: 7, design: 9, runway: 10, lipsync: 7, makeover: 10, rusical: 7, rumix: 7 },
    storyline: 'The pageant queen with stunning beauty',
    personality: 'Confident, graceful, shady',
  },
  {
    id: 6,
    name: 'Tsareena',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/763.png',
    stats: { acting: 8, improv: 9, comedy: 8, dance: 9, design: 7, runway: 9, lipsync: 8, makeover: 7, rusical: 8, rumix: 8 },
    storyline: 'The fierce competitor who plays to win',
    personality: 'Assertive, strategic, intimidating',
  },
  {
    id: 7,
    name: 'Florges',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/671.png',
    stats: { acting: 6, improv: 7, comedy: 6, dance: 7, design: 10, runway: 9, lipsync: 6, makeover: 9, rusical: 7, rumix: 6 },
    storyline: 'The crafty design queen with an eye for detail',
    personality: 'Artistic, quiet, surprising',
  },
  {
    id: 8,
    name: 'Gothitelle',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/576.png',
    stats: { acting: 10, improv: 7, comedy: 6, dance: 6, design: 8, runway: 8, lipsync: 7, makeover: 8, rusical: 7, rumix: 6 },
    storyline: 'The method actress who lives for the drama',
    personality: 'Mysterious, intense, cerebral',
  },
  {
    id: 9,
    name: 'Vespiquen',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/416.png',
    stats: { acting: 7, improv: 8, comedy: 7, dance: 7, design: 8, runway: 9, lipsync: 7, makeover: 8, rusical: 7, rumix: 7 },
    storyline: 'The leader who organizes everyone backstage',
    personality: 'Bossy, organized, strategic',
  },
  {
    id: 10,
    name: 'Delcatty',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/301.png',
    stats: { acting: 6, improv: 8, comedy: 9, dance: 8, design: 6, runway: 7, lipsync: 8, makeover: 6, rusical: 7, rumix: 7 },
    storyline: 'The quirky comedy queen with unexpected wit',
    personality: 'Playful, unpredictable, lovable',
  },
  {
    id: 11,
    name: 'Salazzle',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/758.png',
    stats: { acting: 8, improv: 9, comedy: 7, dance: 8, design: 7, runway: 8, lipsync: 9, makeover: 7, rusical: 8, rumix: 8 },
    storyline: 'The sultry performer who knows how to work a room',
    personality: 'Seductive, cunning, charismatic',
  },
  {
    id: 12,
    name: 'Rapidash',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/78.png',
    stats: { acting: 6, improv: 7, comedy: 6, dance: 9, design: 7, runway: 8, lipsync: 8, makeover: 6, rusical: 7, rumix: 8 },
    storyline: 'The athletic queen with fire in her heart',
    personality: 'Energetic, passionate, hotheaded',
  },
  {
    id: 13,
    name: 'Froslass',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/478.png',
    stats: { acting: 7, improv: 6, comedy: 5, dance: 8, design: 8, runway: 9, lipsync: 7, makeover: 8, rusical: 7, rumix: 7 },
    storyline: 'The ice queen with a cool exterior and warm heart',
    personality: 'Reserved, elegant, underestimated',
  },
  {
    id: 14,
    name: 'Nidoqueen',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/31.png',
    stats: { acting: 7, improv: 8, comedy: 8, dance: 6, design: 7, runway: 7, lipsync: 7, makeover: 7, rusical: 6, rumix: 7 },
    storyline: 'The strong queen who defies expectations',
    personality: 'Tough, genuine, relatable',
  },
  {
    id: 15,
    name: 'Alcremie',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/869.png',
    stats: { acting: 6, improv: 7, comedy: 8, dance: 7, design: 9, runway: 8, lipsync: 6, makeover: 9, rusical: 7, rumix: 6 },
    storyline: 'The sweet queen who serves looks good enough to eat',
    personality: 'Kind, creative, underestimated',
  },
  {
    id: 16,
    name: 'Ninetales',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/38.png',
    stats: { acting: 8, improv: 7, comedy: 6, dance: 7, design: 8, runway: 10, lipsync: 7, makeover: 8, rusical: 7, rumix: 7 },
    storyline: 'The mystical beauty with ancient wisdom',
    personality: 'Wise, mysterious, regal',
  },
  {
    id: 17,
    name: 'Kangaskhan',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/115.png',
    stats: { acting: 7, improv: 8, comedy: 7, dance: 6, design: 7, runway: 7, lipsync: 6, makeover: 7, rusical: 6, rumix: 6 },
    storyline: 'The motherly queen who takes care of everyone',
    personality: 'Nurturing, protective, emotional',
  },
  {
    id: 18,
    name: 'Meowscarada',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/908.png',
    stats: { acting: 9, improv: 8, comedy: 7, dance: 8, design: 8, runway: 9, lipsync: 8, makeover: 8, rusical: 8, rumix: 8 },
    storyline: 'The magician queen with tricks up her sleeve',
    personality: 'Sly, talented, mysterious',
  },
  {
    id: 19,
    name: 'Hatterene',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/858.png',
    stats: { acting: 8, improv: 6, comedy: 5, dance: 7, design: 9, runway: 10, lipsync: 7, makeover: 9, rusical: 7, rumix: 6 },
    storyline: 'The avant-garde queen who serves high fashion',
    personality: 'Eccentric, fashionable, misunderstood',
  },
  {
    id: 20,
    name: 'Lilligant',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/549.png',
    stats: { acting: 6, improv: 7, comedy: 6, dance: 9, design: 8, runway: 8, lipsync: 7, makeover: 7, rusical: 8, rumix: 7 },
    storyline: 'The graceful dancer with natural beauty',
    personality: 'Gentle, graceful, underestimated',
  },
];

const CHALLENGES: Challenge[] = [
  { name: 'Talent Show Extravaganza', type: 'talent', skills: ['lipsync', 'dance', 'comedy'], description: 'Showcase your unique talents!' },
  { name: 'Fashion Design Challenge', type: 'design', skills: ['design', 'runway'], description: 'Create a look from unconventional materials!' },
  { name: 'Acting Challenge: Pokémon Hospital', type: 'acting', skills: ['acting', 'comedy'], description: 'Star in a medical drama parody!' },
  { name: 'Snatch Game', type: 'improv', skills: ['improv', 'comedy'], description: 'Impersonate celebrities in this improv comedy classic!' },
  { name: 'Pokémon: The Rusical', type: 'rusical', skills: ['rusical', 'dance', 'acting'], description: 'Sing and dance in an original musical!' },
  { name: 'Makeover Challenge', type: 'makeover', skills: ['makeover', 'runway'], description: 'Transform your partner into a glamazon!' },
  { name: 'Ball Eleganza Extravaganza', type: 'ball', skills: ['design', 'runway'], description: 'Three looks: Elegance, Glamour, and one you made!' },
  { name: 'Roast of the Judges', type: 'comedy', skills: ['comedy', 'improv'], description: 'Roast the judges with killer comedy!' },
  { name: 'Choreography Challenge', type: 'dance', skills: ['dance', 'lipsync'], description: 'Create and perform an original dance!' },
  { name: 'Acting Challenge: PokéDrama', type: 'acting', skills: ['acting', 'improv'], description: 'Dramatic acting challenge!' },
  { name: 'Final Rumix Performance', type: 'rumix', skills: ['rumix', 'dance', 'lipsync'], description: "Perform the season's rumix!" },
];

const PLACEMENT_TYPES: Record<Placement, { label: Placement; color: string; points: number }> = {
  WIN: { label: 'WIN', color: 'bg-yellow-400 text-black', points: 4 },
  HIGH: { label: 'HIGH', color: 'bg-green-400 text-black', points: 2 },
  SAFE: { label: 'SAFE', color: 'bg-gray-300 text-black', points: 0 },
  LOW: { label: 'LOW', color: 'bg-orange-400 text-black', points: -1 },
  BTM2: { label: 'BTM2', color: 'bg-red-500 text-white', points: -2 },
  ELIM: { label: 'ELIM', color: 'bg-black text-white', points: -3 },
};

const DRAMA_EVENTS = [
  'had a heated argument in the workroom about creative choices',
  'broke down crying about the competition pressure and missing home',
  "threw major shade at another queen's runway presentation",
  'formed a secret alliance to make it to the finale together',
  'had a vulnerable moment sharing their personal journey',
  'got into an impromptu lip sync battle during rehearsal',
  'called out another queen for being fake and playing a character',
  "had a touching heart-to-heart that brought everyone to tears",
  "made shady confessionals questioning others' talents",
  'surprised everyone with a hidden talent nobody expected',
  'clashed with the group over leadership during the challenge',
  'received an emotional message from home that changed everything',
  'had a runway malfunction but turned it into a fierce moment',
  'confronted another queen about stealing their ideas',
  'became the mom of the group and helped queens in crisis',
  'threw their wig across the room in frustration',
  'gave an iconic quote that everyone keeps repeating',
  'had beef with another queen that started on day one',
  'revealed a shocking secret about their past',
  'slayed so hard that other queens were visibly shook',
];

const LIPSYNC_SONGS = [
  'Fighter by Christina Aguilera',
  'Toxic by Britney Spears',
  'I Will Survive by Gloria Gaynor',
  'Stronger by Britney Spears',
  'So What by P!nk',
  "I'm Coming Out by Diana Ross",
  'Sissy That Walk by RuPaul',
  'Born This Way by Lady Gaga',
  'Roar by Katy Perry',
  'Confident by Demi Lovato',
];

const RELATIONSHIP_COPY: Record<RelationshipType, string> = {
  ally: 'Besties in the werk room — always lifting each other up! 🤝',
  rival: 'Sparks fly whenever they share the stage. The tension is delicious! ⚡',
  neutral: 'Keeping it cordial… for now. 👀',
};

const MIN_CAST = 8;
const MAX_CAST = 12;

const describeRelationship = (
  queen: QueenState,
  partner: QueenState,
  network: Record<number, Record<number, RelationshipType>>,
) => {
  const rel = network[queen.id]?.[partner.id];
  if (!rel) {
    return `${queen.name} and ${partner.name} are still feeling each other out.`;
  }
  return `${queen.name} & ${partner.name}: ${RELATIONSHIP_COPY[rel]}`;
};

export default function PokemonDragRace(): JSX.Element {
  const [screen, setScreen] = useState<
    | 'cast-selection'
    | 'entrances'
    | 'promo'
    | 'challenge-select'
    | 'challenge-announcement'
    | 'performances'
    | 'results'
    | 'lipsync'
    | 'finale'
  >('cast-selection');
  const [selectedCast, setSelectedCast] = useState<QueenBase[]>([]);
  const [episode, setEpisode] = useState(0);
  const [contestants, setContestants] = useState<QueenState[]>([]);
  const [eliminated, setEliminated] = useState<QueenState[]>([]);
  const [episodeResults, setEpisodeResults] = useState<EpisodeResult[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [performancePreviews, setPerformancePreviews] = useState<PerformancePreview[]>([]);
  const [bottomTwo, setBottomTwo] = useState<QueenState[]>([]);
  const [lipSyncWinner, setLipSyncWinner] = useState<QueenState | null>(null);
  const [lipSyncSong, setLipSyncSong] = useState('');
  const [showProducersRoom, setShowProducersRoom] = useState(false);
  const [tempPlacements, setTempPlacements] = useState<Record<number, Placement>>({});
  const [winner, setWinner] = useState<QueenState | null>(null);
  const [storylines, setStorylines] = useState<string[]>([]);
  const [relationships, setRelationships] = useState<Record<number, Record<number, RelationshipType>>>({});

  const toggleCast = (queen: QueenBase) => {
    const exists = selectedCast.some((q) => q.id === queen.id);
    if (exists) {
      setSelectedCast(selectedCast.filter((q) => q.id !== queen.id));
    } else if (selectedCast.length < MAX_CAST) {
      setSelectedCast([...selectedCast, queen]);
    }
  };

  const generateRelationships = (cast: QueenState[]): QueenState[] => {
    const rels: Record<number, Record<number, RelationshipType>> = {};
    cast.forEach((q1) => {
      rels[q1.id] = {};
      cast.forEach((q2) => {
        if (q1.id !== q2.id) {
          const rand = Math.random();
          if (rand > 0.7) rels[q1.id][q2.id] = 'ally';
          else if (rand < 0.3) rels[q1.id][q2.id] = 'rival';
          else rels[q1.id][q2.id] = 'neutral';
        }
      });
    });
    setRelationships(rels);
    return cast.map((queen) => ({ ...queen, relationships: rels[queen.id] || {} }));
  };

  const startCompetition = () => {
    if (selectedCast.length < MIN_CAST) {
      alert(`Please select at least ${MIN_CAST} queens!`);
      return;
    }

    const cast: QueenState[] = selectedCast.map((queen) => ({
      ...queen,
      trackRecord: [],
      relationships: {},
    }));

    const withRelationships = generateRelationships(cast);

    setContestants(withRelationships);
    setEpisode(0);
    setEpisodeResults([]);
    setCurrentChallenge(null);
    setPerformancePreviews([]);
    setBottomTwo([]);
    setLipSyncWinner(null);
    setLipSyncSong('');
    setEliminated([]);
    setWinner(null);
    setStorylines([]);
    setTempPlacements({});
    setScreen('entrances');
  };

  const generateStoryline = (roster: QueenState[]) => {
    if (roster.length === 0) {
      return 'The werk room is eerily silent... for now.';
    }
    const queen1 = roster[Math.floor(Math.random() * roster.length)];
    const queen2 = roster[Math.floor(Math.random() * roster.length)];
    const event = DRAMA_EVENTS[Math.floor(Math.random() * DRAMA_EVENTS.length)];

    if (queen1.id === queen2.id) {
      return `${queen1.name} ${event}.`;
    }

    const rel = relationships[queen1.id]?.[queen2.id];
    if (rel === 'ally') {
      return `${queen1.name} and ${queen2.name} ${event}, but they hugged it out because they're werk room sisters.`;
    }
    if (rel === 'rival') {
      return `${queen1.name} and ${queen2.name} ${event}, and it might be the feud of the season!`;
    }
    return `${queen1.name} and ${queen2.name} ${event}.`;
  };

  const startEpisode = (roster?: QueenState[]) => {
    const activeRoster = roster ?? contestants;
    const nextEpisode = episode + 1;
    setEpisode(nextEpisode);

    if (activeRoster.length <= 4) {
      setScreen('finale');
      return;
    }

    const challenge = CHALLENGES[Math.min(nextEpisode - 1, CHALLENGES.length - 1)];
    setCurrentChallenge(challenge);
    setScreen('challenge-select');
    setEpisodeResults([]);
    setPerformancePreviews([]);
    setBottomTwo([]);
    setLipSyncWinner(null);
    setLipSyncSong('');

    const newStorylines: string[] = [];
    const storylineCount = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < storylineCount; i += 1) {
      newStorylines.push(generateStoryline(activeRoster));
    }
    setStorylines((prev) => [...prev, ...newStorylines]);
  };

  const calculatePerformance = (queen: QueenState, challenge: Challenge | null) => {
    if (!challenge) return 0;
    const score =
      challenge.skills.reduce((total, skill) => total + queen.stats[skill], 0) / challenge.skills.length + (Math.random() * 2 - 1);
    const winBonus = queen.trackRecord.filter((placement) => placement === 'WIN').length * 0.5;
    return Math.max(0, Math.min(10, score + winBonus));
  };

  const assignPlacements = () => {
    let results: EpisodeResult[] = [];

    if (Object.keys(tempPlacements).length > 0) {
      results = contestants.map((queen) => ({
        queen,
        placement: tempPlacements[queen.id] || 'SAFE',
        score: performancePreviews.find((preview) => preview.queen.id === queen.id)?.score ?? 0,
      }));
      setTempPlacements({});
    } else {
      const performances =
        performancePreviews.length > 0
          ? performancePreviews.map((preview) => ({ queen: preview.queen, score: preview.score }))
          : contestants.map((queen) => ({ queen, score: calculatePerformance(queen, currentChallenge) }));

      const ordered = [...performances].sort((a, b) => b.score - a.score);
      const numQueens = contestants.length;
      const isFinalFive = numQueens === 5;

      if (isFinalFive) {
        results = [
          { ...ordered[0], placement: 'WIN' },
          { ...ordered[1], placement: 'HIGH' },
          { ...ordered[2], placement: 'HIGH' },
          { ...ordered[3], placement: 'BTM2' },
          { ...ordered[4], placement: 'BTM2' },
        ];
      } else {
        const built: EpisodeResult[] = [];
        built.push({ ...ordered[0], placement: 'WIN' });
        built.push({ ...ordered[1], placement: 'HIGH' });
        built.push({ ...ordered[2], placement: 'HIGH' });
        for (let i = 3; i < ordered.length - 3; i += 1) {
          built.push({ ...ordered[i], placement: 'SAFE' });
        }
        built.push({ ...ordered[ordered.length - 3], placement: 'LOW' });
        built.push({ ...ordered[ordered.length - 2], placement: 'BTM2' });
        built.push({ ...ordered[ordered.length - 1], placement: 'BTM2' });
        results = built;
      }
    }

    setEpisodeResults(results);
    updateTrackRecords(results);

    const newBottomTwo = results.filter((result) => result.placement === 'BTM2').map((result) => result.queen).slice(0, 2);
    if (newBottomTwo.length < 2) {
      const fallback = [...results].sort((a, b) => a.score - b.score).slice(0, 2).map((result) => result.queen);
      setBottomTwo(fallback);
    } else {
      setBottomTwo(newBottomTwo);
    }

    if (contestants.length > 4) {
      setLipSyncSong(LIPSYNC_SONGS[Math.floor(Math.random() * LIPSYNC_SONGS.length)]);
    }
  };

  const updateTrackRecords = (results: EpisodeResult[]) => {
    setContestants((prev) =>
      prev.map((queen) => {
        const placement = results.find((result) => result.queen.id === queen.id)?.placement;
        if (!placement) {
          return queen;
        }
        return {
          ...queen,
          trackRecord: [...queen.trackRecord, placement],
        };
      }),
    );
  };

  const handleElimination = () => {
    if (!lipSyncWinner || bottomTwo.length < 2) return;
    const eliminatedQueen = bottomTwo.find((queen) => queen.id !== lipSyncWinner.id);
    if (!eliminatedQueen) return;

    const remaining = contestants.filter((queen) => queen.id !== eliminatedQueen.id);
    const elimRecord: QueenState = {
      ...eliminatedQueen,
      trackRecord: [...eliminatedQueen.trackRecord.slice(0, -1), 'ELIM'],
    };

    setEliminated((prev) => [...prev, elimRecord]);
    setContestants(remaining);
    setRelationships((prev) => {
      const updated = { ...prev };
      delete updated[eliminatedQueen.id];
      Object.keys(updated).forEach((id) => {
        const rel = { ...updated[Number(id)] };
        delete rel[eliminatedQueen.id];
        updated[Number(id)] = rel;
      });
      return updated;
    });
    setBottomTwo([]);
    setLipSyncWinner(null);
    setEpisodeResults([]);
    setPerformancePreviews([]);
    setLipSyncSong('');

    if (remaining.length <= 4) {
      setScreen('finale');
    } else {
      startEpisode(remaining);
    }
  };

  const crownWinner = (queen: QueenState) => {
    setWinner(queen);
  };

  const trackRecordTable = useMemo(() => {
    const everyone = [...contestants, ...eliminated];
    return everyone
      .map((queen) => {
        const wins = queen.trackRecord.filter((placement) => placement === 'WIN').length;
        const highs = queen.trackRecord.filter((placement) => placement === 'HIGH').length;
        const btms = queen.trackRecord.filter((placement) => placement === 'BTM2').length;
        const score = queen.trackRecord.reduce(
          (acc, placement) => acc + (PLACEMENT_TYPES[placement]?.points ?? 0),
          0,
        );
        return { ...queen, wins, highs, btms, score };
      })
      .sort((a, b) => {
        const aElimIndex = eliminated.findIndex((queen) => queen.id === a.id);
        const bElimIndex = eliminated.findIndex((queen) => queen.id === b.id);
        if (aElimIndex === -1 && bElimIndex === -1) {
          return b.score - a.score;
        }
        if (aElimIndex === -1) return -1;
        if (bElimIndex === -1) return 1;
        return bElimIndex - aElimIndex;
      });
  }, [contestants, eliminated]);

  if (showProducersRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-4xl font-bold text-white flex items-center gap-2">
              <Settings className="w-6 h-6 md:w-8 md:h-8" /> Producers Room - Episode {episode}
            </h1>
            <button
              type="button"
              onClick={() => setShowProducersRoom(false)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transform hover:scale-105 transition-all"
            >
              <X className="inline mr-2" /> Close
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 md:p-8 shadow-2xl space-y-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Override Episode {episode} Placements</h2>
              <p className="text-gray-300 mb-4">Pick the placements you want — producers' choice! Leave blank to auto-assign.</p>
            </div>
            <div className="space-y-3">
              {contestants.map((queen) => (
                <div key={queen.id} className="bg-gray-700 rounded-lg p-3 md:p-4 hover:bg-gray-600 transition-all flex items-center gap-3">
                  <img src={queen.image} alt={queen.name} className="w-12 h-12 md:w-16 md:h-16 object-contain" />
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-white">{queen.name}</h3>
                    <p className="text-xs md:text-sm text-gray-400">{queen.personality}</p>
                  </div>
                  <select
                    value={tempPlacements[queen.id] ?? ''}
                    onChange={(event) => setTempPlacements({ ...tempPlacements, [queen.id]: event.target.value as Placement })}
                    className="bg-gray-600 text-white rounded px-3 md:px-4 py-2 font-bold text-sm md:text-base border-2 border-gray-500 hover:border-purple-400 focus:border-purple-500 outline-none cursor-pointer"
                  >
                    <option value="">Auto</option>
                    <option value="WIN">👑 WIN</option>
                    <option value="HIGH">⭐ HIGH</option>
                    <option value="SAFE">✅ SAFE</option>
                    <option value="LOW">⚠️ LOW</option>
                    <option value="BTM2">💔 BTM2</option>
                  </select>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setTempPlacements({})}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all"
              >
                Clear Overrides
              </button>
              <button
                type="button"
                onClick={() => setShowProducersRoom(false)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all"
              >
                Save & Continue
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 md:p-6 shadow-2xl">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> Season Statistics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-3 text-center shadow-lg">
                  <div className="text-3xl font-bold text-white">{episode}</div>
                  <div className="text-white text-xs mt-1">Episodes</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 text-center shadow-lg">
                  <div className="text-3xl font-bold text-white">{contestants.length}</div>
                  <div className="text-white text-xs mt-1">Queens Left</div>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-3 text-center shadow-lg">
                  <div className="text-3xl font-bold text-white">{eliminated.length}</div>
                  <div className="text-white text-xs mt-1">Eliminated</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 text-center shadow-lg">
                  <div className="text-3xl font-bold text-white">{storylines.length}</div>
                  <div className="text-white text-xs mt-1">Drama Moments</div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" /> Season Tea & Drama ☕
                </h3>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
                  {storylines.map((story, index) => (
                    <div key={index} className="bg-gray-700 rounded p-2 text-gray-200 text-sm hover:bg-gray-600 transition-all">
                      <span className="font-bold text-yellow-400">Ep {Math.floor(index / 2) + 1}:</span> {story}
                    </div>
                  ))}
                  {storylines.length === 0 && <p className="text-gray-400 text-sm">No tea yet — the calm before the storm.</p>}
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 md:p-6 shadow-2xl">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5" /> Current Track Records
              </h2>
              <div className="space-y-3">
                {contestants.map((queen) => {
                  const wins = queen.trackRecord.filter((placement) => placement === 'WIN').length;
                  const highs = queen.trackRecord.filter((placement) => placement === 'HIGH').length;
                  const btms = queen.trackRecord.filter((placement) => placement === 'BTM2').length;
                  const score = queen.trackRecord.reduce(
                    (acc, placement) => acc + (PLACEMENT_TYPES[placement]?.points ?? 0),
                    0,
                  );
                  return (
                    <div key={queen.id} className="bg-gray-700 rounded-lg p-3 md:p-4 flex items-center gap-3 hover:bg-gray-600 transition-all">
                      <img src={queen.image} alt={queen.name} className="w-12 h-12 md:w-16 md:h-16 object-contain" />
                      <div className="flex-1">
                        <h3 className="text-base md:text-lg font-bold text-white">{queen.name}</h3>
                        <div className="flex gap-2 md:gap-3 text-xs md:text-sm mt-1">
                          <span className="bg-yellow-500 text-black px-2 py-1 rounded font-bold">{wins}W</span>
                          <span className="bg-green-500 text-black px-2 py-1 rounded font-bold">{highs}H</span>
                          <span className="bg-red-500 text-white px-2 py-1 rounded font-bold">{btms}B</span>
                          <span className="bg-purple-500 text-white px-2 py-1 rounded font-bold">{score}pts</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {contestants.length === 0 && <p className="text-gray-400 text-sm">No contestants remaining.</p>}
              </div>
            </div>
          </div>

          {eliminated.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-4 md:p-6 shadow-2xl">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" /> Eliminated Queens (In Order)
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {eliminated.map((queen, index) => (
                  <div key={queen.id} className="bg-gray-700 rounded-lg p-3 text-center hover:bg-gray-600 transition-all">
                    <img src={queen.image} alt={queen.name} className="w-16 h-16 md:w-20 md:h-20 object-contain mx-auto mb-2 opacity-70" />
                    <h3 className="text-sm md:text-base font-bold text-white">{queen.name}</h3>
                    <p className="text-xs text-gray-400">Elim Order #{index + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (screen === 'cast-selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center mb-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 md:w-12 md:h-12" />
              Pokémon Drag Race
              <Sparkles className="w-8 h-8 md:w-12 md:h-12" />
            </h1>
            <p className="text-xl md:text-2xl text-white">Select Your Cast ({MIN_CAST}-{MAX_CAST} Queens)</p>
            <p className="text-lg md:text-xl text-white mt-2 font-bold">Selected: {selectedCast.length}/{MAX_CAST}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {POKEMON_QUEENS.map((queen) => {
              const isSelected = selectedCast.some((q) => q.id === queen.id);
              return (
                <button
                  type="button"
                  key={queen.id}
                  onClick={() => toggleCast(queen)}
                  className={`text-left rounded-lg p-3 md:p-4 transition-all transform hover:scale-105 ${
                    isSelected ? 'bg-yellow-400 ring-4 ring-yellow-300 shadow-xl' : 'bg-white hover:shadow-lg'
                  }`}
                >
                  <img src={queen.image} alt={queen.name} className="w-full h-24 md:h-32 object-contain mb-2" />
                  <h3 className="font-bold text-center text-sm md:text-lg">{queen.name}</h3>
                  <p className="text-xs text-center text-gray-600">{queen.personality}</p>
                </button>
              );
            })}
          </div>

          <div className="bg-white bg-opacity-20 border border-white/40 rounded-2xl p-4 md:p-6 text-white shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Zap className="w-6 h-6" /> Season Blueprint
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm md:text-base">
              <li>👑 Each episode crowns one winner and two highs.</li>
              <li>💔 Two queens land in the bottom and must lip sync for their lives.</li>
              <li>⚖️ Producers Room lets you rewrite herstory with manual placements.</li>
              <li>📈 Track record table updates dynamically with every result.</li>
              <li>🔥 Drama, alliances, and rivalries generate automatically every week.</li>
              <li>🏁 Finale showdown triggers when the top 4 remain.</li>
            </ul>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={startCompetition}
              disabled={selectedCast.length < MIN_CAST}
              className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-black font-bold py-3 md:py-4 px-6 md:px-8 rounded-full text-lg md:text-xl transition-all transform hover:scale-105 shadow-lg"
            >
              <Play className="inline mr-2" />
              Start the Competition!
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'entrances') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-600 via-purple-600 to-blue-600 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-6 md:mb-8">🎭 Queen Entrances 🎭</h1>

          <div className="bg-white rounded-lg p-4 md:p-8 mb-6 md:mb-8 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">The Queens Enter the Workroom</h2>
            <div className="space-y-3 md:space-y-4">
              {contestants.map((queen, idx) => (
                <div
                  key={queen.id}
                  className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 p-3 md:p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg shadow"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="relative">
                      <img src={queen.image} alt={queen.name} className="w-20 h-20 md:w-24 md:h-24 object-contain" />
                      <span className="absolute -top-2 -left-2 bg-yellow-300 text-black font-bold text-xs px-2 py-1 rounded-full shadow">
                        #{idx + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg md:text-2xl font-bold">{queen.name}</h3>
                      <p className="text-sm md:text-base text-gray-700 italic">"{queen.storyline}"</p>
                      <p className="text-xs md:text-sm text-gray-600 mt-1">Personality: {queen.personality}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 flex-1">
                    {STAT_KEYS.slice(0, 4).map((key) => (
                      <div key={key} className="bg-white rounded px-2 py-1 text-xs md:text-sm text-center shadow">
                        <span className="font-semibold capitalize">{key}:</span> {queen.stats[key]}/10
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setScreen('promo')}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 md:py-4 px-6 md:px-8 rounded-full text-lg md:text-xl shadow-lg transform hover:scale-105 transition-all"
            >
              Head to Promo Shoot →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'promo') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-red-700 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center">📸 Meet the Queens 📸</h1>
          <p className="text-center text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            It's promo day! The queens serve legendary looks, reveal juicy storylines, and size up the competition before the first challenge is even announced.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {contestants.map((queen) => (
              <div key={queen.id} className="bg-white rounded-lg p-4 transform hover:scale-105 transition-all shadow-xl">
                <img src={queen.image} alt={queen.name} className="w-full h-36 md:h-44 object-contain mb-3" />
                <h3 className="text-lg md:text-xl font-bold text-center mb-2">{queen.name}</h3>
                <p className="text-sm text-center text-gray-600 mb-3">{queen.personality}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between"><span className="font-semibold">Acting:</span><span>{queen.stats.acting}/10</span></div>
                  <div className="flex justify-between"><span className="font-semibold">Comedy:</span><span>{queen.stats.comedy}/10</span></div>
                  <div className="flex justify-between"><span className="font-semibold">Dance:</span><span>{queen.stats.dance}/10</span></div>
                  <div className="flex justify-between"><span className="font-semibold">Runway:</span><span>{queen.stats.runway}/10</span></div>
                  <div className="flex justify-between"><span className="font-semibold">Lipsync:</span><span>{queen.stats.lipsync}/10</span></div>
                  <div className="flex justify-between"><span className="font-semibold">Design:</span><span>{queen.stats.design}/10</span></div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/20 border border-white/30 rounded-2xl p-4 md:p-6 text-white shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-2"><MessageCircle className="w-6 h-6" /> Promo Tea</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm md:text-base">
              {contestants.slice(0, Math.min(6, contestants.length)).map((queen, index) => {
                const partner = contestants[(index + 1) % contestants.length];
                if (!partner) {
                  return null;
                }
                const relationshipText = describeRelationship(queen, partner, relationships);
                return (
                  <div key={queen.id} className="bg-white/30 rounded-lg p-3 shadow">
                    <h3 className="font-semibold mb-1">{queen.name} & {partner.name}</h3>
                    <p>{relationshipText}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => startEpisode()}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 md:py-4 px-6 md:px-8 rounded-full text-lg md:text-xl shadow-lg transform hover:scale-105 transition-all"
            >
              Start Episode 1 →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'challenge-select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-white rounded-lg p-4 md:p-8 shadow-2xl">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 md:mb-4">Episode {episode}</h1>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-purple-600">{currentChallenge?.name}</h2>

            <div className="mb-6 md:mb-8">
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" /> Queens Remaining: {contestants.length}
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
                {contestants.map((queen) => (
                  <div key={queen.id} className="text-center bg-gradient-to-b from-pink-100 to-purple-100 rounded-lg p-2 shadow">
                    <img src={queen.image} alt={queen.name} className="w-16 h-16 md:w-20 md:h-20 object-contain mx-auto" />
                    <p className="text-xs md:text-sm font-bold mt-1">{queen.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 rounded-lg p-4 md:p-6 shadow-lg">
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" /> This Week's Tea ☕
              </h3>
              {storylines.slice(-3).map((story, idx) => (
                <p key={idx} className="text-sm md:text-lg italic mb-2 border-l-4 border-pink-400 pl-3">{story}</p>
              ))}
            </div>
          </div>

          <div className="text-center space-x-2 md:space-x-4">
            <button
              type="button"
              onClick={() => setShowProducersRoom(true)}
              className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-full text-sm md:text-base shadow-lg transform hover:scale-105 transition-all"
            >
              <Settings className="inline mr-2 w-4 h-4" /> Producers Room
            </button>
            <button
              type="button"
              onClick={() => setScreen('challenge-announcement')}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 md:py-4 px-6 md:px-8 rounded-full text-lg md:text-xl shadow-lg transform hover:scale-105 transition-all"
            >
              Continue to Challenge →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'challenge-announcement') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 p-4 md:p-8 flex items-center">
        <div className="max-w-4xl mx-auto w-full">
          <div className="bg-white rounded-lg p-6 md:p-12 text-center shadow-2xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              🎬 {currentChallenge?.name} 🎬
            </h1>
            <p className="text-lg md:text-2xl mb-6 md:mb-8 text-gray-700">{currentChallenge?.description}</p>
            <div className="text-base md:text-xl text-gray-600">
              <p className="mb-3 md:mb-4 font-bold text-xl md:text-2xl">Key Skills:</p>
              <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                {currentChallenge?.skills.map((skill) => (
                  <span key={skill} className="bg-purple-200 px-3 md:px-4 py-2 rounded-full capitalize font-semibold text-sm md:text-base">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-6 md:mt-8">
            <button
              type="button"
              onClick={() => {
                const previews = contestants.map((queen) => {
                  const score = calculatePerformance(queen, currentChallenge);
                  const adjective =
                    score > 8 ? 'show-stopping' : score > 6 ? 'polished' : score > 4 ? 'rocky' : 'disastrous';
                  const emoji = score > 8 ? '🌟' : score > 6 ? '✨' : score > 4 ? '😬' : '💥';
                  const blurb =
                    score > 8
                      ? 'The judges were gagged by every beat, reveal, and emotion.'
                      : score > 6
                      ? 'Solid execution with memorable moments that impressed the panel.'
                      : score > 4
                      ? 'A few missteps kept the judges wanting more polish.'
                      : 'Nerves took over and the performance fell apart on stage.';
                  return { queen, score, adjective, emoji, blurb };
                });
                setPerformancePreviews(previews);
                setScreen('performances');
              }}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 md:py-4 px-6 md:px-8 rounded-full text-lg md:text-xl shadow-lg transform hover:scale-105 transition-all"
            >
              See Performances →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'performances') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-6 md:mb-8 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8" /> Performances <Sparkles className="w-8 h-8" />
          </h1>

          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            {performancePreviews.map((preview) => (
              <div key={preview.queen.id} className="bg-white rounded-lg p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all">
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                  <img src={preview.queen.image} alt={preview.queen.name} className="w-20 h-20 md:w-24 md:h-24 object-contain" />
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold mb-2">{preview.queen.name}</h3>
                    <p className="text-sm md:text-lg">
                      {preview.queen.name} delivered a <span className="font-bold text-purple-600">{preview.adjective}</span> performance in the {currentChallenge?.name}. {preview.blurb}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {currentChallenge?.skills.map((skill) => (
                        <div key={skill} className="text-xs md:text-sm bg-purple-100 px-2 py-1 rounded">
                          <span className="capitalize font-semibold">{skill}:</span> {preview.queen.stats[skill]}/10
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl">{preview.emoji}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                assignPlacements();
                setScreen('results');
              }}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 md:py-4 px-6 md:px-8 rounded-full text-lg md:text-xl shadow-lg transform hover:scale-105 transition-all"
            >
              Runway & Judging →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-red-900 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center flex items-center justify-center gap-2">
            <Trophy className="w-8 h-8 md:w-12 md:h-12" /> Episode {episode} Results <Trophy className="w-8 h-8 md:w-12 md:h-12" />
          </h1>

          <div className="space-y-4 md:space-y-6">
            {(['WIN', 'HIGH', 'SAFE', 'LOW', 'BTM2'] as Placement[]).map((placementType) => {
              const queensWithPlacement = episodeResults.filter((r) => r.placement === placementType);
              if (queensWithPlacement.length === 0) return null;
              return (
                <div key={placementType}>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
                    {placementType === 'WIN' && (
                      <>
                        <Crown className="w-6 h-6" /> Winner
                      </>
                    )}
                    {placementType === 'HIGH' && (
                      <>
                        <Sparkles className="w-6 h-6" /> High
                      </>
                    )}
                    {placementType === 'SAFE' && (
                      <>
                        <Users className="w-6 h-6" /> Safe
                      </>
                    )}
                    {placementType === 'LOW' && (
                      <>
                        <TrendingUp className="w-6 h-6 rotate-180" /> Low
                      </>
                    )}
                    {placementType === 'BTM2' && (
                      <>
                        <Heart className="w-6 h-6" /> Bottom 2
                      </>
                    )}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {queensWithPlacement.map((result) => (
                      <div key={result.queen.id} className={`rounded-lg p-3 md:p-4 ${PLACEMENT_TYPES[placementType].color} shadow-lg`}>
                        <div className="flex items-center gap-3 md:gap-4">
                          <img src={result.queen.image} alt={result.queen.name} className="w-16 h-16 md:w-20 md:h-20 object-contain bg-white rounded-full p-1" />
                          <div>
                            <h3 className="text-lg md:text-xl font-bold">{result.queen.name}</h3>
                            <p className="text-xs md:text-sm opacity-90">
                              {placementType === 'WIN' && 'Condragulations! You are the winner of this challenge!'}
                              {placementType === 'HIGH' && "Great work this week! You're in the top!"}
                              {placementType === 'SAFE' && "You're safe and may step to the back of the stage."}
                              {placementType === 'LOW' && 'You’re safe, but the judges want more fire.'}
                              {placementType === 'BTM2' && 'You are up for elimination tonight.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white/10 border border-white/20 rounded-2xl p-4 md:p-6 text-white shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-2">
              <MessageCircle className="w-6 h-6" /> Judges Untucked Tea
            </h2>
            <ul className="space-y-2 text-sm md:text-base">
              {episodeResults.map((result) => (
                <li key={result.queen.id} className="bg-white/20 rounded-lg p-3">
                  <strong>{result.queen.name}:</strong>{' '}
                  {result.placement === 'WIN'
                    ? 'A commanding performance that set the bar for the season.'
                    : result.placement === 'HIGH'
                    ? 'Impressed the panel with polish and personality.'
                    : result.placement === 'SAFE'
                    ? 'Solid, but fading in the pack—needs a breakout moment.'
                    : result.placement === 'LOW'
                    ? 'Held on by a thread after a shaky showing.'
                    : 'In danger of sashaying away unless they slay the lip sync.'}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                if (contestants.length <= 4) {
                  setScreen('finale');
                } else {
                  setScreen('lipsync');
                }
              }}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 md:py-4 px-6 md:px-8 rounded-full text-lg md:text-xl shadow-lg transform hover:scale-105 transition-all"
            >
              {contestants.length <= 4 ? 'Crown the Winner →' : 'Lip Sync For Your Life →'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'lipsync') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-4 md:mb-8 flex items-center justify-center gap-2">
            <Flame className="w-8 h-8 md:w-12 md:h-12" /> Lip Sync For Your Life <Flame className="w-8 h-8 md:w-12 md:h-12" />
          </h1>

          <div className="bg-white rounded-lg p-4 md:p-8 mb-6 md:mb-8 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6 text-purple-600">🎵 {lipSyncSong} 🎵</h2>
            <h3 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">Choose who won the lip sync:</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {bottomTwo.map((queen) => (
                <button
                  type="button"
                  key={queen.id}
                  onClick={() => setLipSyncWinner(queen)}
                  className={`cursor-pointer rounded-lg p-4 md:p-6 transition-all transform hover:scale-105 ${
                    lipSyncWinner?.id === queen.id ? 'bg-yellow-400 ring-4 ring-yellow-300 shadow-2xl' : 'bg-gray-100 hover:bg-gray-200 shadow-lg'
                  }`}
                >
                  <img src={queen.image} alt={queen.name} className="w-full h-40 md:h-48 object-contain mb-4" />
                  <h3 className="text-xl md:text-2xl font-bold text-center mb-2">{queen.name}</h3>
                  <p className="text-center text-base md:text-lg mb-4 font-semibold">Lip Sync Skill: {queen.stats.lipsync}/10</p>
                  <p className="text-xs md:text-sm text-center italic bg-white p-3 rounded">
                    {queen.stats.lipsync > 8 && 'Absolutely SLAYED with death drops, splits, reveals, and pure emotion! 🔥'}
                    {queen.stats.lipsync > 6 && queen.stats.lipsync <= 8 && 'Gave a solid, energetic performance with great lipsync accuracy and some tricks! 💪'}
                    {queen.stats.lipsync > 4 && queen.stats.lipsync <= 6 && 'Tried their best but lacked that special spark and connection to the song. 😕'}
                    {queen.stats.lipsync <= 4 && 'Struggled to hit the words and failed to capture the emotion. It was rough. 😬'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                if (lipSyncWinner) {
                  handleElimination();
                }
              }}
              disabled={!lipSyncWinner}
              className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-black font-bold py-3 md:py-4 px-6 md:px-8 rounded-full text-lg md:text-xl shadow-lg transform hover:scale-105 transition-all"
            >
              {lipSyncWinner ? `${lipSyncWinner.name}, shantay you stay! →` : 'Select a Winner'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'finale') {
    const totalEpisodes = trackRecordTable.reduce((max, queen) => Math.max(max, queen.trackRecord.length), 0);

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center flex items-center justify-center gap-2">
            <Crown className="w-10 h-10 md:w-16 md:h-16" /> GRAND FINALE <Crown className="w-10 h-10 md:w-16 md:h-16" />
          </h1>

          {!winner ? (
            <>
              <div className="bg-white rounded-lg p-4 md:p-8 shadow-2xl space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-center">Top {contestants.length} - Choose Your Winner!</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {contestants.map((queen) => {
                    const wins = queen.trackRecord.filter((placement) => placement === 'WIN').length;
                    const highs = queen.trackRecord.filter((placement) => placement === 'HIGH').length;
                    const btms = queen.trackRecord.filter((placement) => placement === 'BTM2').length;
                    return (
                      <button
                        type="button"
                        key={queen.id}
                        onClick={() => crownWinner(queen)}
                        className="cursor-pointer bg-gradient-to-b from-yellow-100 to-pink-100 rounded-lg p-4 md:p-6 hover:shadow-2xl transform hover:scale-105 transition-all shadow-lg"
                      >
                        <img src={queen.image} alt={queen.name} className="w-full h-28 md:h-32 object-contain mb-4" />
                        <h3 className="text-lg md:text-xl font-bold text-center mb-2">{queen.name}</h3>
                        <div className="text-xs md:text-sm space-y-1">
                          <div className="flex justify-between bg-yellow-200 px-2 py-1 rounded"><span>👑 Wins:</span><span className="font-bold">{wins}</span></div>
                          <div className="flex justify-between bg-green-200 px-2 py-1 rounded"><span>⭐ Highs:</span><span className="font-bold">{highs}</span></div>
                          <div className="flex justify-between bg-red-200 px-2 py-1 rounded"><span>💔 Bottoms:</span><span className="font-bold">{btms}</span></div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 md:p-8 shadow-2xl">
                <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center flex items-center justify-center gap-2">
                  <Trophy className="w-6 h-6" /> Full Track Record
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs md:text-sm">
                    <thead>
                      <tr className="bg-purple-700 text-white">
                        <th className="p-2 border border-purple-700 text-left">Queen</th>
                        {Array.from({ length: totalEpisodes }, (_, i) => (
                          <th key={i} className="p-2 border border-purple-700 text-center">E{i + 1}</th>
                        ))}
                        <th className="p-2 border border-purple-700 text-center">Record</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trackRecordTable.map((queen, idx) => (
                        <tr key={queen.id} className={`border-b hover:bg-purple-50 ${idx === 0 ? 'bg-yellow-100' : ''}`}>
                          <td className="p-2 font-bold border text-sm md:text-base">{queen.name}</td>
                          {Array.from({ length: totalEpisodes }).map((_, index) => {
                            const placement = queen.trackRecord[index];
                            return (
                              <td key={index} className="p-1 md:p-2 text-center border">
                                {placement ? (
                                  <span className={`inline-block px-1 md:px-2 py-1 rounded text-xs font-bold ${PLACEMENT_TYPES[placement]?.color}`}>
                                    {PLACEMENT_TYPES[placement]?.label}
                                  </span>
                                ) : (
                                  ''
                                )}
                              </td>
                            );
                          })}
                          <td className="p-2 text-center text-xs md:text-sm font-semibold border">
                            {queen.wins}W {queen.highs}H {queen.btms}B
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="bg-white rounded-lg p-8 md:p-12 mb-6 md:mb-8 shadow-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 animate-pulse">🎉 CONGRATULATIONS 🎉</h2>
                <img src={winner.image} alt={winner.name} className="w-48 h-48 md:w-64 md:h-64 object-contain mx-auto mb-4 md:mb-6" />
                <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 mb-4">
                  {winner.name}
                </h1>
                <p className="text-2xl md:text-3xl font-bold mb-4 md:mb-8">Winner of Pokémon Drag Race!</p>
                <p className="text-lg md:text-xl italic text-gray-600 mb-4">"{winner.storyline}"</p>
                <div className="flex justify-center gap-4 mt-6">
                  <div className="bg-yellow-200 px-4 py-2 rounded-lg">
                    <div className="text-2xl font-bold">{winner.trackRecord.filter((p) => p === 'WIN').length}</div>
                    <div className="text-sm">Challenge Wins</div>
                  </div>
                  <div className="bg-green-200 px-4 py-2 rounded-lg">
                    <div className="text-2xl font-bold">{winner.trackRecord.filter((p) => p === 'HIGH').length}</div>
                    <div className="text-sm">High Placements</div>
                  </div>
                  <div className="bg-purple-200 px-4 py-2 rounded-lg">
                    <div className="text-2xl font-bold">{episode}</div>
                    <div className="text-sm">Episodes</div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setScreen('cast-selection');
                  setSelectedCast([]);
                  setEpisode(0);
                  setContestants([]);
                  setEliminated([]);
                  setEpisodeResults([]);
                  setCurrentChallenge(null);
                  setPerformancePreviews([]);
                  setBottomTwo([]);
                  setLipSyncWinner(null);
                  setWinner(null);
                  setStorylines([]);
                  setRelationships({});
                  setTempPlacements({});
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-full text-lg md:text-xl shadow-lg transform hover:scale-105 transition-all"
              >
                <Play className="inline mr-2" />
                Start New Season
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

