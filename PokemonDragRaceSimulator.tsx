import React, { useState, useMemo } from 'react';
import { Crown, Sparkles, Trophy, Users, TrendingUp, MessageCircle, Settings, Play, X, Flame, Heart, Zap } from 'lucide-react';

const POKEMON_QUEENS = [
  {
    id: 1,
    name: "Gardevoir",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/282.png",
    stats: { acting: 9, improv: 8, comedy: 7, dance: 9, design: 8, runway: 10, lipsync: 9, makeover: 9, rusical: 8, rumix: 9 },
    storyline: "The ethereal fashion queen with a heart of gold",
    personality: "Elegant, emotional, motherly"
  },
  {
    id: 2,
    name: "Lopunny",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/428.png",
    stats: { acting: 7, improv: 8, comedy: 8, dance: 10, design: 7, runway: 9, lipsync: 10, makeover: 7, rusical: 9, rumix: 10 },
    storyline: "The dancing diva who brings high energy to every challenge",
    personality: "Bubbly, flirty, competitive"
  },
  {
    id: 3,
    name: "Primarina",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/730.png",
    stats: { acting: 8, improv: 7, comedy: 6, dance: 8, design: 7, runway: 8, lipsync: 9, makeover: 7, rusical: 10, rumix: 9 },
    storyline: "The theatrical performer with Broadway dreams",
    personality: "Dramatic, talented, perfectionist"
  },
  {
    id: 4,
    name: "Jynx",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/124.png",
    stats: { acting: 9, improv: 9, comedy: 10, dance: 7, design: 6, runway: 7, lipsync: 8, makeover: 6, rusical: 8, rumix: 7 },
    storyline: "The comedy queen who doesn't take herself too seriously",
    personality: "Hilarious, bold, controversial"
  },
  {
    id: 5,
    name: "Milotic",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/350.png",
    stats: { acting: 7, improv: 6, comedy: 5, dance: 7, design: 9, runway: 10, lipsync: 7, makeover: 10, rusical: 7, rumix: 7 },
    storyline: "The pageant queen with stunning beauty",
    personality: "Confident, graceful, shady"
  },
  {
    id: 6,
    name: "Tsareena",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/763.png",
    stats: { acting: 8, improv: 9, comedy: 8, dance: 9, design: 7, runway: 9, lipsync: 8, makeover: 7, rusical: 8, rumix: 8 },
    storyline: "The fierce competitor who plays to win",
    personality: "Assertive, strategic, intimidating"
  },
  {
    id: 7,
    name: "Florges",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/671.png",
    stats: { acting: 6, improv: 7, comedy: 6, dance: 7, design: 10, runway: 9, lipsync: 6, makeover: 9, rusical: 7, rumix: 6 },
    storyline: "The crafty design queen with an eye for detail",
    personality: "Artistic, quiet, surprising"
  },
  {
    id: 8,
    name: "Gothitelle",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/576.png",
    stats: { acting: 10, improv: 7, comedy: 6, dance: 6, design: 8, runway: 8, lipsync: 7, makeover: 8, rusical: 7, rumix: 6 },
    storyline: "The method actress who lives for the drama",
    personality: "Mysterious, intense, cerebral"
  },
  {
    id: 9,
    name: "Vespiquen",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/416.png",
    stats: { acting: 7, improv: 8, comedy: 7, dance: 7, design: 8, runway: 9, lipsync: 7, makeover: 8, rusical: 7, rumix: 7 },
    storyline: "The leader who organizes everyone backstage",
    personality: "Bossy, organized, strategic"
  },
  {
    id: 10,
    name: "Delcatty",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/301.png",
    stats: { acting: 6, improv: 8, comedy: 9, dance: 8, design: 6, runway: 7, lipsync: 8, makeover: 6, rusical: 7, rumix: 7 },
    storyline: "The quirky comedy queen with unexpected wit",
    personality: "Playful, unpredictable, lovable"
  },
  {
    id: 11,
    name: "Salazzle",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/758.png",
    stats: { acting: 8, improv: 9, comedy: 7, dance: 8, design: 7, runway: 8, lipsync: 9, makeover: 7, rusical: 8, rumix: 8 },
    storyline: "The sultry performer who knows how to work a room",
    personality: "Seductive, cunning, charismatic"
  },
  {
    id: 12,
    name: "Rapidash",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/78.png",
    stats: { acting: 6, improv: 7, comedy: 6, dance: 9, design: 7, runway: 8, lipsync: 8, makeover: 6, rusical: 7, rumix: 8 },
    storyline: "The athletic queen with fire in her heart",
    personality: "Energetic, passionate, hotheaded"
  },
  {
    id: 13,
    name: "Froslass",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/478.png",
    stats: { acting: 7, improv: 6, comedy: 5, dance: 8, design: 8, runway: 9, lipsync: 7, makeover: 8, rusical: 7, rumix: 7 },
    storyline: "The ice queen with a cool exterior and warm heart",
    personality: "Reserved, elegant, underestimated"
  },
  {
    id: 14,
    name: "Nidoqueen",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/31.png",
    stats: { acting: 7, improv: 8, comedy: 8, dance: 6, design: 7, runway: 7, lipsync: 7, makeover: 7, rusical: 6, rumix: 7 },
    storyline: "The strong queen who defies expectations",
    personality: "Tough, genuine, relatable"
  },
  {
    id: 15,
    name: "Alcremie",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/869.png",
    stats: { acting: 6, improv: 7, comedy: 8, dance: 7, design: 9, runway: 8, lipsync: 6, makeover: 9, rusical: 7, rumix: 6 },
    storyline: "The sweet queen who serves looks good enough to eat",
    personality: "Kind, creative, underestimated"
  },
  {
    id: 16,
    name: "Ninetales",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/38.png",
    stats: { acting: 8, improv: 7, comedy: 6, dance: 7, design: 8, runway: 10, lipsync: 7, makeover: 8, rusical: 7, rumix: 7 },
    storyline: "The mystical beauty with ancient wisdom",
    personality: "Wise, mysterious, regal"
  },
  {
    id: 17,
    name: "Kangaskhan",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/115.png",
    stats: { acting: 7, improv: 8, comedy: 7, dance: 6, design: 7, runway: 7, lipsync: 6, makeover: 7, rusical: 6, rumix: 6 },
    storyline: "The motherly queen who takes care of everyone",
    personality: "Nurturing, protective, emotional"
  },
  {
    id: 18,
    name: "Meowscarada",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/908.png",
    stats: { acting: 9, improv: 8, comedy: 7, dance: 8, design: 8, runway: 9, lipsync: 8, makeover: 8, rusical: 8, rumix: 8 },
    storyline: "The magician queen with tricks up her sleeve",
    personality: "Sly, talented, mysterious"
  },
  {
    id: 19,
    name: "Hatterene",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/858.png",
    stats: { acting: 8, improv: 6, comedy: 5, dance: 7, design: 9, runway: 10, lipsync: 7, makeover: 9, rusical: 7, rumix: 6 },
    storyline: "The avant-garde queen who serves high fashion",
    personality: "Eccentric, fashionable, misunderstood"
  },
  {
    id: 20,
    name: "Lilligant",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/549.png",
    stats: { acting: 6, improv: 7, comedy: 6, dance: 9, design: 8, runway: 8, lipsync: 7, makeover: 7, rusical: 8, rumix: 7 },
    storyline: "The graceful dancer with natural beauty",
    personality: "Gentle, graceful, underestimated"
  }
];

const CHALLENGES = [
  { name: "Talent Show Extravaganza", type: "talent", skills: ["lipsync", "dance", "comedy"], description: "Showcase your unique talents!" },
  { name: "Fashion Design Challenge", type: "design", skills: ["design", "runway"], description: "Create a look from unconventional materials!" },
  { name: "Acting Challenge: Pokémon Hospital", type: "acting", skills: ["acting", "comedy"], description: "Star in a medical drama parody!" },
  { name: "Snatch Game", type: "improv", skills: ["improv", "comedy"], description: "Impersonate celebrities in this improv comedy classic!" },
  { name: "Pokémon: The Rusical", type: "rusical", skills: ["rusical", "dance", "acting"], description: "Sing and dance in an original musical!" },
  { name: "Makeover Challenge", type: "makeover", skills: ["makeover", "runway"], description: "Transform your partner into a glamazon!" },
  { name: "Ball Eleganza Extravaganza", type: "ball", skills: ["design", "runway"], description: "Three looks: Elegance, Glamour, and one you made!" },
  { name: "Roast of the Judges", type: "comedy", skills: ["comedy", "improv"], description: "Roast the judges with killer comedy!" },
  { name: "Choreography Challenge", type: "dance", skills: ["dance", "lipsync"], description: "Create and perform an original dance!" },
  { name: "Acting Challenge: PokéDrama", type: "acting", skills: ["acting", "improv"], description: "Dramatic acting challenge!" },
  { name: "Final Rumix Performance", type: "rumix", skills: ["rumix", "dance", "lipsync"], description: "Perform the season's rumix!" }
];

const PLACEMENT_TYPES = {
  WIN: { label: "WIN", color: "bg-yellow-400 text-black", points: 4 },
  HIGH: { label: "HIGH", color: "bg-green-400 text-black", points: 2 },
  SAFE: { label: "SAFE", color: "bg-gray-300 text-black", points: 0 },
  LOW: { label: "LOW", color: "bg-orange-400 text-black", points: -1 },
  BTM2: { label: "BTM2", color: "bg-red-500 text-white", points: -2 },
  ELIM: { label: "ELIM", color: "bg-black text-white", points: -3 }
};

const DRAMA_EVENTS = [
  "had a heated argument in the workroom about creative choices",
  "broke down crying about the competition pressure and missing home",
  "threw major shade at another queen's runway presentation",
  "formed a secret alliance to make it to the finale together",
  "had a vulnerable moment sharing their personal journey",
  "got into an impromptu lip sync battle during rehearsal",
  "called out another queen for being fake and playing a character",
  "had a touching heart-to-heart that brought everyone to tears",
  "made shady confessionals questioning others' talents",
  "surprised everyone with a hidden talent nobody expected",
  "clashed with the group over leadership during the challenge",
  "received an emotional message from home that changed everything",
  "had a runway malfunction but turned it into a fierce moment",
  "confronted another queen about stealing their ideas",
  "became the mom of the group and helped queens in crisis",
  "threw their wig across the room in frustration",
  "gave an iconic quote that everyone keeps repeating",
  "had beef with another queen that started on day one",
  "revealed a shocking secret about their past",
  "slayed so hard that other queens were visibly shook"
];

const LIPSYNC_SONGS = [
  "Fighter by Christina Aguilera",
  "Toxic by Britney Spears",
  "I Will Survive by Gloria Gaynor",
  "Stronger by Britney Spears",
  "So What by P!nk",
  "I'm Coming Out by Diana Ross",
  "Sissy That Walk by RuPaul",
  "Born This Way by Lady Gaga",
  "Roar by Katy Perry",
  "Confident by Demi Lovato"
];

export default function PokemonDragRace() {
  const [screen, setScreen] = useState('cast-selection');
  const [selectedCast, setSelectedCast] = useState([]);
  const [episode, setEpisode] = useState(0);
  const [contestants, setContestants] = useState([]);
  const [eliminated, setEliminated] = useState([]);
  const [episodeResults, setEpisodeResults] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [bottomTwo, setBottomTwo] = useState([]);
  const [lipSyncWinner, setLipSyncWinner] = useState(null);
  const [lipSyncSong, setLipSyncSong] = useState('');
  const [showProducersRoom, setShowProducersRoom] = useState(false);
  const [tempPlacements, setTempPlacements] = useState({});
  const [winner, setWinner] = useState(null);
  const [storylines, setStorylines] = useState([]);
  const [relationships, setRelationships] = useState({});

  const toggleCast = (queen) => {
    if (selectedCast.find(q => q.id === queen.id)) {
      setSelectedCast(selectedCast.filter(q => q.id !== queen.id));
    } else if (selectedCast.length < 12) {
      setSelectedCast([...selectedCast, queen]);
    }
  };

  const startCompetition = () => {
    if (selectedCast.length < 8) {
      alert('Please select at least 8 queens!');
      return;
    }
    const cast = selectedCast.map(q => ({
      ...q,
      trackRecord: [],
      relationships: {}
    }));
    setContestants(cast);
    setScreen('entrances');
    generateRelationships(cast);
  };

  const generateRelationships = (cast) => {
    const rels = {};
    cast.forEach(q1 => {
      rels[q1.id] = {};
      cast.forEach(q2 => {
        if (q1.id !== q2.id) {
          const rand = Math.random();
          if (rand > 0.7) rels[q1.id][q2.id] = 'ally';
          else if (rand < 0.3) rels[q1.id][q2.id] = 'rival';
          else rels[q1.id][q2.id] = 'neutral';
        }
      });
    });
    setRelationships(rels);
  };

  const nextPhase = () => {
    if (screen === 'entrances') setScreen('promo');
    else if (screen === 'promo') startEpisode();
    else if (screen === 'challenge-select') setScreen('challenge-announcement');
    else if (screen === 'challenge-announcement') setScreen('performances');
    else if (screen === 'performances') setScreen('results');
    else if (screen === 'results') {
      if (contestants.length <= 4) {
        setScreen('finale');
      } else {
        setScreen('lipsync');
      }
    }
    else if (screen === 'lipsync') handleElimination();
  };

  const startEpisode = () => {
    const ep = episode + 1;
    setEpisode(ep);
    
    if (ep > CHALLENGES.length || contestants.length <= 4) {
      setScreen('finale');
      return;
    }

    const challenge = CHALLENGES[Math.min(ep - 1, CHALLENGES.length - 1)];
    setCurrentChallenge(challenge);
    setScreen('challenge-select');
    
    const newStorylines = [];
    const numStorylines = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < numStorylines; i++) {
      newStorylines.push(generateStoryline());
    }
    setStorylines([...storylines, ...newStorylines]);
  };

  const generateStoryline = () => {
    const queen1 = contestants[Math.floor(Math.random() * contestants.length)];
    const queen2 = contestants[Math.floor(Math.random() * contestants.length)];
    const event = DRAMA_EVENTS[Math.floor(Math.random() * DRAMA_EVENTS.length)];
    
    if (queen1.id === queen2.id) {
      return `${queen1.name} ${event}`;
    }
    return `${queen1.name} and ${queen2.name} ${event}`;
  };

  const calculatePerformance = (queen, challenge) => {
    const skills = challenge.skills;
    let score = 0;
    skills.forEach(skill => {
      score += queen.stats[skill] || 0;
    });
    score = score / skills.length;
    score += (Math.random() * 2 - 1);
    
    const trackRecordBonus = queen.trackRecord.filter(p => p === 'WIN').length * 0.5;
    score += trackRecordBonus;
    
    return Math.max(0, Math.min(10, score));
  };

  const assignPlacements = () => {
    if (Object.keys(tempPlacements).length > 0) {
      const results = Object.entries(tempPlacements).map(([id, placement]) => {
        const queen = contestants.find(q => q.id === parseInt(id));
        return { queen, placement, score: 0 };
      });
      
      setEpisodeResults(results);
      updateTrackRecords(results);
      
      const btm = results.filter(r => r.placement === 'BTM2').map(r => r.queen);
      setBottomTwo(btm);
      setTempPlacements({});
      return;
    }

    const performances = contestants.map(queen => ({
      queen,
      score: calculatePerformance(queen, currentChallenge)
    })).sort((a, b) => b.score - a.score);

    const results = [];
    const numQueens = contestants.length;
    const isFinal5 = numQueens === 5;

    if (isFinal5) {
      results.push({ ...performances[0], placement: 'WIN' });
      results.push({ ...performances[1], placement: 'HIGH' });
      results.push({ ...performances[2], placement: 'HIGH' });
      results.push({ ...performances[3], placement: 'BTM2' });
      results.push({ ...performances[4], placement: 'BTM2' });
    } else {
      results.push({ ...performances[0], placement: 'WIN' });
      results.push({ ...performances[1], placement: 'HIGH' });
      results.push({ ...performances[2], placement: 'HIGH' });
      
      for (let i = 3; i < numQueens - 3; i++) {
        results.push({ ...performances[i], placement: 'SAFE' });
      }
      
      results.push({ ...performances[numQueens - 3], placement: 'LOW' });
      results.push({ ...performances[numQueens - 2], placement: 'BTM2' });
      results.push({ ...performances[numQueens - 1], placement: 'BTM2' });
    }

    setEpisodeResults(results);
    updateTrackRecords(results);
    
    const btm = results.filter(r => r.placement === 'BTM2').map(r => r.queen);
    setBottomTwo(btm);
    setLipSyncSong(LIPSYNC_SONGS[Math.floor(Math.random() * LIPSYNC_SONGS.length)]);
  };

  const updateTrackRecords = (results) => {
    const updated = contestants.map(queen => {
      const result = results.find(r => r.queen.id === queen.id);
      if (result) {
        return {
          ...queen,
          trackRecord: [...queen.trackRecord, result.placement]
        };
      }
      return queen;
    });
    setContestants(updated);
  };

  const handleElimination = () => {
    if (!lipSyncWinner) return;
    
    const elimQueen = bottomTwo.find(q => q.id !== lipSyncWinner.id);
    
    const updatedContestants = contestants.map(q => 
      q.id === elimQueen.id ? { ...q, trackRecord: [...q.trackRecord.slice(0, -1), 'ELIM'] } : q
    );
    
    setEliminated([elimQueen, ...eliminated]);
    setContestants(updatedContestants.filter(q => q.id !== elimQueen.id));
    setBottomTwo([]);
    setLipSyncWinner(null);
    setEpisodeResults([]);
    
    if (contestants.length - 1 <= 4) {
      setScreen('finale');
    } else {
      startEpisode();
    }
  };

  const crownWinner = (queen) => {
    setWinner(queen);
  };

  const trackRecordTable = useMemo(() => {
    const all = [...contestants, ...eliminated].map(q => {
      const wins = q.trackRecord.filter(p => p === 'WIN').length;
      const highs = q.trackRecord.filter(p => p === 'HIGH').length;
      const btms = q.trackRecord.filter(p => p === 'BTM2').length;
      const score = q.trackRecord.reduce((acc, p) => acc + (PLACEMENT_TYPES[p]?.points || 0), 0);
      
      return { ...q, wins, highs, btms, score };
    });

    return all.sort((a, b) => {
      const aElimIndex = eliminated.findIndex(q => q.id === a.id);
      const bElimIndex = eliminated.findIndex(q => q.id === b.id);
      
      if (aElimIndex === -1 && bElimIndex === -1) {
        return b.score - a.score;
      }
      if (aElimIndex === -1) return -1;
      if (bElimIndex === -1) return 1;
      
      return bElimIndex - aElimIndex;
    });
  }, [contestants, eliminated]);

  if (screen === 'cast-selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <button
              onClick={nextPhase}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 md:py-4 px-6 md:px-8 rounded-full text-lg md:text-xl shadow-lg transform hover:scale-105 transition-all"
            >
              Continue to Promo Shoot →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'promo') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-red-700 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-6 md:mb-8">📸 Meet the Queens 📸</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {contestants.map(queen => (
              <div key={queen.id} className="bg-white rounded-lg p-3 md:p-4 transform hover:scale-105 transition-all shadow-xl">
                <img src={queen.image} alt={queen.name} className="w-full h-32 md:h-40 object-contain mb-2" />
                <h3 className="text-lg md:text-xl font-bold text-center mb-2">{queen.name}</h3>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between"><span className="font-semibold">Acting:</span><span className="bg-purple-200 px-2 rounded">{queen.stats.acting}/10</span></div>
                  <div className="flex justify-between"><span className="font-semibold">Comedy:</span><span className="bg-yellow-200 px-2 rounded">{queen.stats.comedy}/10</span></div>
                  <div className="flex justify-between"><span className="font-semibold">Dance:</span><span className="bg-pink-200 px-2 rounded">{queen.stats.dance}/10</span></div>
                  <div className="flex justify-between"><span className="font-semibold">Runway:</span><span className="bg-blue-200 px-2 rounded">{queen.stats.runway}/10</span></div>
                  <div className="flex justify-between"><span className="font-semibold">Lipsync:</span><span className="bg-red-200 px-2 rounded">{queen.stats.lipsync}/10</span></div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={nextPhase}
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
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg p-4 md:p-8 mb-6 md:mb-8 shadow-2xl">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 md:mb-4">Episode {episode}</h1>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-purple-600">{currentChallenge?.name}</h2>
            
            <div className="mb-6 md:mb-8">
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Queens Remaining: {contestants.length}
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
                {contestants.map(queen => (
                  <div key={queen.id} className="text-center bg-gradient-to-b from-pink-100 to-purple-100 rounded-lg p-2 shadow">
                    <img src={queen.image} alt={queen.name} className="w-16 h-16 md:w-20 md:h-20 object-contain mx-auto" />
                    <p className="text-xs md:text-sm font-bold mt-1">{queen.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 rounded-lg p-4 md:p-6 shadow-lg">
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                This Week's Tea ☕
              </h3>
              {storylines.slice(-3).map((story, idx) => (
                <p key={idx} className="text-sm md:text-lg italic mb-2 border-l-4 border-pink-400 pl-3">{story}</p>
              ))}
            </div>
          </div>

          <div className="text-center space-x-2 md:space-x-4">
            <button
              onClick={() => setShowProducersRoom(true)}
              className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-full text-sm md:text-base shadow-lg transform hover:scale-105 transition-all"
            >
              <Settings className="inline mr-2 w-4 h-4" />
              Producers Room
            </button>
            <button
              onClick={nextPhase}
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
            <p className="text-lg md:text-2xl mb-6 md:mb-8 text-gray-700">
              {currentChallenge?.description}
            </p>
            <div className="text-base md:text-xl text-gray-600">
              <p className="mb-3 md:mb-4 font-bold text-xl md:text-2xl">Key Skills:</p>
              <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                {currentChallenge?.skills.map(skill => (
                  <span key={skill} className="bg-purple-200 px-3 md:px-4 py-2 rounded-full capitalize font-semibold text-sm md:text-base">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-6 md:mt-8">
            <button
              onClick={nextPhase}
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
            <Sparkles className="w-8 h-8" />
            Performances
            <Sparkles className="w-8 h-8" />
          </h1>
          
          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            {contestants.map(queen => {
              const performance = calculatePerformance(queen, currentChallenge);
              const adjectives = performance > 8 ? ['stunning', 'incredible', 'outstanding', 'phenomenal', 'showstopping'] :
                               performance > 6 ? ['solid', 'good', 'competent', 'respectable', 'impressive'] :
                               performance > 4 ? ['okay', 'mediocre', 'underwhelming', 'lackluster', 'forgettable'] :
                               ['poor', 'disappointing', 'struggled', 'failed to impress', 'disastrous'];
              const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
              
              return (
                <div key={queen.id} className="bg-white rounded-lg p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all">
                  <div className="flex items-center gap-3 md:gap-4">
                    <img src={queen.image} alt={queen.name} className="w-20 h-20 md:w-24 md:h-24 object-contain" />
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold mb-2">{queen.name}</h3>
                      <p className="text-sm md:text-lg">
                        {queen.name} delivered a <span className="font-bold text-purple-600">{adj}</span> performance in the {currentChallenge?.name}.
                        {performance > 8 && " The judges were absolutely gagging! 🌟"}
                        {performance > 6 && performance <= 8 && " The judges nodded in approval. 👍"}
                        {performance > 4 && performance <= 6 && " The judges had mixed reactions. 😐"}
                        {performance <= 4 && " The judges looked visibly concerned. 😬"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {currentChallenge?.skills.map(skill => (
                          <div key={skill} className="text-xs md:text-sm bg-purple-100 px-2 py-1 rounded">
                            <span className="capitalize font-semibold">{skill}:</span> {queen.stats[skill]}/10
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-2xl md:text-3xl">
                      {performance > 8 ? "🌟" : performance > 6 ? "👍" : performance > 4 ? "😐" : "😬"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                assignPlacements();
                nextPhase();
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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-6 md:mb-8 flex items-center justify-center gap-2">
            <Trophy className="w-8 h-8 md:w-12 md:h-12" />
            Episode {episode} Results
            <Trophy className="w-8 h-8 md:w-12 md:h-12" />
          </h1>
          
          <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
            {['WIN', 'HIGH', 'SAFE', 'LOW', 'BTM2'].map(placementType => {
              const queensWithPlacement = episodeResults.filter(r => r.placement === placementType);
              if (queensWithPlacement.length === 0) return null;
              
              return (
                <div key={placementType}>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
                    {placementType === 'WIN' && <><Crown className="w-6 h-6" /> Winner</>}
                    {placementType === 'HIGH' && <><Sparkles className="w-6 h-6" /> High</>}
                    {placementType === 'SAFE' && <><Users className="w-6 h-6" /> Safe</>}
                    {placementType === 'LOW' && <><TrendingUp className="w-6 h-6 rotate-180" /> Low</>}
                    {placementType === 'BTM2' && <><Heart className="w-6 h-6" /> Bottom 2</>}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {queensWithPlacement.map(result => (
                      <div key={result.queen.id} className={`rounded-lg p-3 md:p-4 ${PLACEMENT_TYPES[placementType].color} shadow-lg`}>
                        <div className="flex items-center gap-3 md:gap-4">
                          <img src={result.queen.image} alt={result.queen.name} className="w-16 h-16 md:w-20 md:h-20 object-contain bg-white rounded-full p-1" />
                          <div>
                            <h3 className="text-lg md:text-xl font-bold">{result.queen.name}</h3>
                            <p className="text-xs md:text-sm opacity-90">
                              {placementType === 'WIN' && "Condragulations! You are the winner of this challenge!"}
                              {placementType === 'HIGH' && "Great work this week! You're in the top!"}
                              {placementType === 'SAFE' && "You're safe and may step to the back of the stage."}
                              {placementType === 'LOW' && "You're safe, but you need to step up your game."}
                              {placementType === 'BTM2' && "You are up for elimination tonight."}
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

          <div className="text-center">
            <button
              onClick={nextPhase}
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
            <Flame className="w-8 h-8 md:w-12 md:h-12" />
            Lip Sync For Your Life
            <Flame className="w-8 h-8 md:w-12 md:h-12" />
          </h1>
          
          <div className="bg-white rounded-lg p-4 md:p-8 mb-6 md:mb-8 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6 text-purple-600">
              🎵 {lipSyncSong} 🎵
            </h2>
            <h3 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">Choose who won the lip sync:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {bottomTwo.map(queen => (
                <div
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
                    {queen.stats.lipsync > 8 && "Absolutely SLAYED with death drops, splits, reveals, and pure emotion! The crowd went WILD! 🔥"}
                    {queen.stats.lipsync > 6 && queen.stats.lipsync <= 8 && "Gave a solid, energetic performance with great lip sync accuracy and some tricks! 💪"}
                    {queen.stats.lipsync > 4 && queen.stats.lipsync <= 6 && "Tried their best but lacked that special spark and connection to the song. 😕"}
                    {queen.stats.lipsync <= 4 && "Struggled to hit the words and failed to capture the emotion. It was rough. 😬"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={nextPhase}
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-6 md:mb-8 flex items-center justify-center gap-2">
            <Crown className="w-10 h-10 md:w-16 md:h-16" />
            GRAND FINALE
            <Crown className="w-10 h-10 md:w-16 md:h-16" />
          </h1>
          
          {!winner ? (
            <>
              <div className="bg-white rounded-lg p-4 md:p-8 mb-6 md:mb-8 shadow-2xl">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
                  Top {contestants.length} - Choose Your Winner!
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                  {contestants.map(queen => {
                    const wins = queen.trackRecord.filter(p => p === 'WIN').length;
                    const highs = queen.trackRecord.filter(p => p === 'HIGH').length;
                    const btms = queen.trackRecord.filter(p => p === 'BTM2').length;
                    
                    return (
                      <div
                        key={queen.id}
                        onClick={() => crownWinner(queen)}
                        className="cursor-pointer bg-gradient-to-b from-yellow-100 to-pink-100 rounded-lg p-4 md:p-6 hover:shadow-2xl transform hover:scale-105 transition-all shadow-lg"
                      >
                        <img src={queen.image} alt={queen.name} className="w-full h-28 md:h-32 object-contain mb-4" />
                        <h3 className="text-lg md:text-xl font-bold text-center mb-2">{queen.name}</h3>
                        <div className="text-xs md:text-sm space-y-1">
                          <div className="flex justify-between bg-yellow-200 px-2 py-1 rounded">
                            <span>👑 Wins:</span>
                            <span className="font-bold">{wins}</span>
                          </div>
                          <div className="flex justify-between bg-green-200 px-2 py-1 rounded">
                            <span>⭐ Highs:</span>
                            <span className="font-bold">{highs}</span>
                          </div>
                          <div className="flex justify-between bg-red-200 px-2 py-1 rounded">
                            <span>💔 Bottoms:</span>
                            <span className="font-bold">{btms}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 md:p-8 shadow-2xl">
                <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center flex items-center justify-center gap-2">
                  <Trophy className="w-6 h-6" />
                  Full Track Record
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-purple-600 text-white">
                        <th className="p-2 text-left border border-purple-700">Queen</th>
                        {Array.from({ length: episode }, (_, i) => (
                          <th key={i} className="p-2 border border-purple-700 text-sm">E{i + 1}</th>
                        ))}
                        <th className="p-2 border border-purple-700">Record</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trackRecordTable.map((queen, idx) => (
                        <tr key={queen.id} className={`border-b hover:bg-purple-50 ${idx === 0 ? 'bg-yellow-100' : ''}`}>
                          <td className="p-2 font-bold border text-sm md:text-base">{queen.name}</td>
                          {queen.trackRecord.map((placement, pIdx) => (
                            <td key={pIdx} className="p-1 md:p-2 text-center border">
                              <span className={`inline-block px-1 md:px-2 py-1 rounded text-xs font-bold ${PLACEMENT_TYPES[placement]?.color}`}>
                                {PLACEMENT_TYPES[placement]?.label}
                              </span>
                            </td>
                          ))}
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
                    <div className="text-2xl font-bold">{winner.trackRecord.filter(p => p === 'WIN').length}</div>
                    <div className="text-sm">Challenge Wins</div>
                  </div>
                  <div className="bg-green-200 px-4 py-2 rounded-lg">
                    <div className="text-2xl font-bold">{winner.trackRecord.filter(p => p === 'HIGH').length}</div>
                    <div className="text-sm">High Placements</div>
                  </div>
                  <div className="bg-purple-200 px-4 py-2 rounded-lg">
                    <div className="text-2xl font-bold">{episode}</div>
                    <div className="text-sm">Episodes</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setScreen('cast-selection');
                  setSelectedCast([]);
                  setEpisode(0);
                  setContestants([]);
                  setEliminated([]);
                  setEpisodeResults([]);
                  setCurrentChallenge(null);
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

  if (showProducersRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-white flex items-center gap-2">
              <Settings className="w-6 h-6 md:w-8 md:h-8" />
              Producers Room - Episode {episode}
            </h1>
            <button
              onClick={() => setShowProducersRoom(false)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transform hover:scale-105 transition-all"
            >
              <X className="inline mr-2" />
              Close
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 md:p-8 mb-6 md:mb-8 shadow-2xl">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Override Episode {episode} Placements</h2>
            <p className="text-gray-300 mb-4 md:mb-6">Manually assign placements for this episode. Changes will apply when you continue.</p>
            
            <div className="space-y-3 md:space-y-4">
              {contestants.map(queen => (
                <div key={queen.id} className="bg-gray-700 rounded-lg p-3 md:p-4 hover:bg-gray-600 transition-all">
                  <div className="flex items-center gap-3 md:gap-4">
                    <img src={queen.image} alt={queen.name} className="w-12 h-12 md:w-16 md:h-16 object-contain" />
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-white">{queen.name}</h3>
                      <p className="text-xs md:text-sm text-gray-400">{queen.personality}</p>
                    </div>
                    <select
                      value={tempPlacements[queen.id] || ''}
                      onChange={(e) => setTempPlacements({ ...tempPlacements, [queen.id]: e.target.value })}
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
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => setTempPlacements({})}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all"
              >
                Clear Overrides
              </button>
              <button
                onClick={() => setShowProducersRoom(false)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all"
              >
                Save & Continue
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 md:p-8 mb-6 md:mb-8 shadow-2xl">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Season Statistics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-3 md:p-4 text-center shadow-lg">
                <div className="text-3xl md:text-4xl font-bold text-white">{episode}</div>
                <div className="text-white text-xs md:text-sm mt-1">Episodes</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 md:p-4 text-center shadow-lg">
                <div className="text-3xl md:text-4xl font-bold text-white">{contestants.length}</div>
                <div className="text-white text-xs md:text-sm mt-1">Queens Left</div>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-3 md:p-4 text-center shadow-lg">
                <div className="text-3xl md:text-4xl font-bold text-white">{eliminated.length}</div>
                <div className="text-white text-xs md:text-sm mt-1">Eliminated</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 md:p-4 text-center shadow-lg">
                <div className="text-3xl md:text-4xl font-bold text-white">{storylines.length}</div>
                <div className="text-white text-xs md:text-sm mt-1">Drama Moments</div>
              </div>
            </div>

            <div className="mt-6 md:mt-8">
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Season Tea & Drama ☕
              </h3>
              <div className="space-y-2 max-h-48 md:max-h-64 overflow-y-auto">
                {storylines.map((story, idx) => (
                  <div key={idx} className="bg-gray-700 rounded p-2 md:p-3 text-gray-200 text-sm md:text-base hover:bg-gray-600 transition-all">
                    <span className="font-bold text-yellow-400">Ep {Math.floor(idx / 2) + 1}:</span> {story}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 md:p-8 shadow-2xl">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              Current Track Records
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {contestants.map(queen => {
                const wins = queen.trackRecord.filter(p => p === 'WIN').length;
                const highs = queen.trackRecord.filter(p => p === 'HIGH').length;
                const btms = queen.trackRecord.filter(p => p === 'BTM2').length;
                const score = queen.trackRecord.reduce((acc, p) => acc + (PLACEMENT_TYPES[p]?.points || 0), 0);
                
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
            </div>
          </div>

          {eliminated.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-4 md:p-8 mt-6 md:mt-8 shadow-2xl">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Eliminated Queens (In Order)
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {eliminated.map((queen, idx) => (
                  <div key={queen.id} className="bg-gray-700 rounded-lg p-3 text-center hover:bg-gray-600 transition-all">
                    <img src={queen.image} alt={queen.name} className="w-16 h-16 md:w-20 md:h-20 object-contain mx-auto mb-2 opacity-60" />
                    <h3 className="text-sm md:text-base font-bold text-white">{queen.name}</h3>
                    <p className="text-xs text-gray-400">Elim Ep {queen.trackRecord.length}</p>
                    <p className="text-xs text-red-400 mt-1">
                      {eliminated.length - idx === 1 && "First Out"}
                      {eliminated.length - idx === 2 && "Second Out"}
                      {eliminated.length - idx === 3 && "Third Out"}
                      {eliminated.length - idx > 3 && `${eliminated.length - idx}th Out`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 md:w-12 md:h-12" />
              Pokémon Drag Race
              <Sparkles className="w-8 h-8 md:w-12 md:h-12" />
            </h1>
            <p className="text-xl md:text-2xl text-white">Select Your Cast (8-12 Queens)</p>
            <p className="text-lg md:text-xl text-white mt-2 font-bold">Selected: {selectedCast.length}/12</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
            {POKEMON_QUEENS.map(queen => {
              const isSelected = selectedCast.find(q => q.id === queen.id);
              return (
                <div
                  key={queen.id}
                  onClick={() => toggleCast(queen)}
                  className={`cursor-pointer rounded-lg p-3 md:p-4 transition-all transform hover:scale-105 ${
                    isSelected ? 'bg-yellow-400 ring-4 ring-yellow-300 shadow-xl' : 'bg-white hover:shadow-lg'
                  }`}
                >
                  <img src={queen.image} alt={queen.name} className="w-full h-24 md:h-32 object-contain mb-2" />
                  <h3 className="font-bold text-center text-sm md:text-lg">{queen.name}</h3>
                  <p className="text-xs text-center text-gray-600">{queen.personality}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={startCompetition}
              disabled={selectedCast.length < 8}
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
                <div key={queen.id} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg shadow">
                  <img src={queen.image} alt={queen.name} className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                  <div className="flex-1">
                    <h3 className="text-lg md:text-2xl font-bold">{queen.name}</h3>
                    <p className="text-sm md:text-base text-gray-700 italic">"{queen.storyline}"</p>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">Personality: {queen.personality}</p>
                  </div>
                  <div className="text-2xl md:text-3xl">✨</div>
                </div>
              ))}
            </div>
          </div>

          <div className="
