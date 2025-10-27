import React, { useEffect, useMemo, useState } from "react";

type StatKey =
  | "acting"
  | "improv"
  | "comedy"
  | "dance"
  | "design"
  | "runway"
  | "lipsync"
  | "makeover"
  | "rusical"
  | "rumix";

type Placement =
  | "WIN"
  | "HIGH"
  | "SAFE"
  | "LOW"
  | "BTM2"
  | "ELIM"
  | "WINNER"
  | "RUNNER-UP"
  | "FINALIST"
  | "TOP2"
  | "—";

type Phase =
  | "CAST_SELECTION"
  | "ENTRANCES"
  | "PROMO_CHART"
  | "CHALLENGE_SELECTOR"
  | "CHALLENGE_ANNOUNCEMENT"
  | "PERFORMANCES_DESCRIPTION"
  | "RESULTS_ANNOUNCEMENTS"
  | "LIPSYNC_OUTCOME"
  | "FINALE_SHOWDOWN"
  | "CROWNING";

interface PokemonQueenData {
  id: string;
  name: string;
  image: string;
  tagline: string;
  pronouns: string;
  stats: Record<StatKey, number>;
  relationships: string[];
  storyHooks: string[];
}

interface PerformanceResult {
  queen: string;
  score: number;
  critique: string;
  standoutMoment: string;
}

interface EpisodeResult {
  episodeNumber: number;
  title: string;
  challengeType: string;
  theme: string;
  performances: PerformanceResult[];
  drama: string[];
  lipsyncSong: string;
  placementByQueen: Record<string, Placement>;
  eliminatedQueen?: string;
}

interface SeasonQueen extends PokemonQueenData {
  trackRecord: Placement[];
  storylineLog: string[];
  wins: number;
  highs: number;
  lows: number;
  bottoms: number;
  lipsyncs: number;
  eliminationEpisode?: number;
}

interface EpisodeSkeleton {
  episodeNumber: number;
  title: string;
  challenge: ChallengeTemplate;
  theme: string;
  drama: string[];
  lipsyncSong: string;
  performances: PerformanceResult[];
  placementByQueen: Record<string, Placement>;
}

interface ChallengeTemplate {
  key: StatKey | "branding" | "talent";
  name: string;
  description: string;
  featuredStats: StatKey[];
  miniStoryHook: string;
}

interface FinaleState {
  finalQueens: string[];
  challenge: string;
  narratives: string[];
  scores: PerformanceResult[];
  winner?: string;
  tallies?: { queen: string; total: number; recap: string }[];
}

const POKEMON_QUEENS: PokemonQueenData[] = [
  {
    id: "gardevoir",
    name: "Gardevoir",
    image: "https://img.pokemondb.net/artwork/large/gardevoir.jpg",
    tagline: "A psychic vision wrapped in haute couture.",
    pronouns: "she/her",
    stats: {
      acting: 9,
      improv: 8,
      comedy: 7,
      dance: 6,
      design: 9,
      runway: 10,
      lipsync: 8,
      makeover: 8,
      rusical: 9,
      rumix: 7,
    },
    relationships: ["Has history with Gallade's ballroom", "Secret rivalry with Gothitelle"],
    storyHooks: ["Wants to prove elegance can still gag the competition."],
  },
  {
    id: "lopunny",
    name: "Lopunny",
    image: "https://img.pokemondb.net/artwork/large/lopunny.jpg",
    tagline: "A bounce, a split, and a wink for the judges!",
    pronouns: "she/her",
    stats: {
      acting: 6,
      improv: 7,
      comedy: 8,
      dance: 10,
      design: 6,
      runway: 8,
      lipsync: 9,
      makeover: 7,
      rusical: 8,
      rumix: 9,
    },
    relationships: ["Gym bunny pals with Tsareena", "Playful flirtation with Primarina"],
    storyHooks: ["Athletic queen desperate to be seen as more than flips."],
  },
  {
    id: "tsareena",
    name: "Tsareena",
    image: "https://img.pokemondb.net/artwork/large/tsareena.jpg",
    tagline: "Kicked out of the jungle and onto the runway.",
    pronouns: "she/her",
    stats: {
      acting: 7,
      improv: 6,
      comedy: 6,
      dance: 9,
      design: 8,
      runway: 9,
      lipsync: 8,
      makeover: 7,
      rusical: 7,
      rumix: 8,
    },
    relationships: ["Frenemies with Lopunny", "Protective mentor to Lilligant"],
    storyHooks: ["Determined to lead the season with royal authority."],
  },
  {
    id: "primarina",
    name: "Primarina",
    image: "https://img.pokemondb.net/artwork/large/primarina.jpg",
    tagline: "A siren song wrapped in iridescent glamour.",
    pronouns: "she/her",
    stats: {
      acting: 8,
      improv: 7,
      comedy: 5,
      dance: 7,
      design: 7,
      runway: 9,
      lipsync: 10,
      makeover: 6,
      rusical: 10,
      rumix: 9,
    },
    relationships: ["Duet partner with Meloetta", "Secret alliance with Milotic"],
    storyHooks: ["Ballad diva eager to surprise with edgy choices."],
  },
  {
    id: "delphox",
    name: "Delphox",
    image: "https://img.pokemondb.net/artwork/large/delphox.jpg",
    tagline: "Read the flames, darling—they spell legendary.",
    pronouns: "she/her",
    stats: {
      acting: 9,
      improv: 8,
      comedy: 7,
      dance: 6,
      design: 7,
      runway: 8,
      lipsync: 7,
      makeover: 9,
      rusical: 9,
      rumix: 7,
    },
    relationships: ["Old-school beef with Jynx", "Mystic confidante of Gardevoir"],
    storyHooks: ["Veteran queen fighting whispers that she's dated."],
  },
  {
    id: "hatterene",
    name: "Hatterene",
    image: "https://img.pokemondb.net/artwork/large/hatterene.jpg",
    tagline: "Quiet storm with psychic couture thunder.",
    pronouns: "she/her",
    stats: {
      acting: 8,
      improv: 5,
      comedy: 6,
      dance: 5,
      design: 10,
      runway: 9,
      lipsync: 7,
      makeover: 10,
      rusical: 7,
      rumix: 6,
    },
    relationships: ["Telepathic tension with Mismagius", "Soft spot for Alcremie"],
    storyHooks: ["Silent assassin plotting a fashion takeover."],
  },
  {
    id: "mismagius",
    name: "Mismagius",
    image: "https://img.pokemondb.net/artwork/large/mismagius.jpg",
    tagline: "A spectral chanteuse conjuring chaos.",
    pronouns: "she/her",
    stats: {
      acting: 7,
      improv: 9,
      comedy: 9,
      dance: 6,
      design: 6,
      runway: 7,
      lipsync: 8,
      makeover: 6,
      rusical: 8,
      rumix: 7,
    },
    relationships: ["Occult sisterhood with Froslass", "Shade battle with Hatterene"],
    storyHooks: ["Wants to be known for more than spooky camp."],
  },
  {
    id: "froslass",
    name: "Froslass",
    image: "https://img.pokemondb.net/artwork/large/froslass.jpg",
    tagline: "Frostbite chic with a chilling smile.",
    pronouns: "she/her",
    stats: {
      acting: 7,
      improv: 6,
      comedy: 6,
      dance: 8,
      design: 8,
      runway: 9,
      lipsync: 7,
      makeover: 7,
      rusical: 7,
      rumix: 7,
    },
    relationships: ["Sisterhood pact with Mismagius", "Playful rivalry with Salazzle"],
    storyHooks: ["Ice queen melting her heart for the crown."],
  },
  {
    id: "gothitelle",
    name: "Gothitelle",
    image: "https://img.pokemondb.net/artwork/large/gothitelle.jpg",
    tagline: "Galactic glam with a dark sense of humor.",
    pronouns: "she/her",
    stats: {
      acting: 8,
      improv: 8,
      comedy: 7,
      dance: 5,
      design: 7,
      runway: 8,
      lipsync: 6,
      makeover: 7,
      rusical: 7,
      rumix: 6,
    },
    relationships: ["Nemesis energy with Gardevoir", "Clashes with Jynx"],
    storyHooks: ["Out to snatch psychic supremacy and confessionals."],
  },
  {
    id: "meloetta",
    name: "Meloetta",
    image: "https://img.pokemondb.net/artwork/large/meloetta.jpg",
    tagline: "The melody of victory never hits a flat note.",
    pronouns: "she/her",
    stats: {
      acting: 8,
      improv: 7,
      comedy: 6,
      dance: 8,
      design: 7,
      runway: 8,
      lipsync: 9,
      makeover: 6,
      rusical: 10,
      rumix: 8,
    },
    relationships: ["Harmony pact with Primarina", "Admired by Sylveon"],
    storyHooks: ["Legendary voice balancing diva behavior."],
  },
  {
    id: "salazzle",
    name: "Salazzle",
    image: "https://img.pokemondb.net/artwork/large/salazzle.jpg",
    tagline: "Toxic, tantalizing, totally televised.",
    pronouns: "she/her",
    stats: {
      acting: 7,
      improv: 8,
      comedy: 8,
      dance: 9,
      design: 6,
      runway: 8,
      lipsync: 10,
      makeover: 6,
      rusical: 7,
      rumix: 9,
    },
    relationships: ["Flirt feud with Lopunny", "Alliance of convenience with Tsareena"],
    storyHooks: ["Villain edit queen who lives for the confessional."],
  },
  {
    id: "lilligant",
    name: "Lilligant",
    image: "https://img.pokemondb.net/artwork/large/lilligant.jpg",
    tagline: "Blooming beauty with petals of perfection.",
    pronouns: "she/her",
    stats: {
      acting: 6,
      improv: 6,
      comedy: 6,
      dance: 7,
      design: 9,
      runway: 8,
      lipsync: 6,
      makeover: 9,
      rusical: 7,
      rumix: 6,
    },
    relationships: ["Protégé of Tsareena", "Secret crush on Roserade"],
    storyHooks: ["Young upstart trying to shake the pageant label."],
  },
  {
    id: "nidoqueen",
    name: "Nidoqueen",
    image: "https://img.pokemondb.net/artwork/large/nidoqueen.jpg",
    tagline: "Matriarch of mayhem and mother of camp.",
    pronouns: "she/her",
    stats: {
      acting: 8,
      improv: 9,
      comedy: 8,
      dance: 6,
      design: 7,
      runway: 7,
      lipsync: 7,
      makeover: 8,
      rusical: 7,
      rumix: 6,
    },
    relationships: ["Den mother to the room", "Side-eye rivalry with Salazzle"],
    storyHooks: ["Wants respect for old-school showgirl chops."],
  },
  {
    id: "milotic",
    name: "Milotic",
    image: "https://img.pokemondb.net/artwork/large/milotic.jpg",
    tagline: "Serpentine glamour with serene grace.",
    pronouns: "she/her",
    stats: {
      acting: 6,
      improv: 6,
      comedy: 5,
      dance: 7,
      design: 9,
      runway: 10,
      lipsync: 8,
      makeover: 7,
      rusical: 8,
      rumix: 7,
    },
    relationships: ["Alliance with Primarina", "Jealousy spark from Gardevoir"],
    storyHooks: ["Wants to prove beauty can strategize and slay."],
  },
  {
    id: "jynx",
    name: "Jynx",
    image: "https://img.pokemondb.net/artwork/large/jynx.jpg",
    tagline: "Frosty diva from the nightclub circuit.",
    pronouns: "she/her",
    stats: {
      acting: 9,
      improv: 7,
      comedy: 9,
      dance: 6,
      design: 6,
      runway: 7,
      lipsync: 8,
      makeover: 6,
      rusical: 7,
      rumix: 7,
    },
    relationships: ["Old flames with Delphox", "Reads Gothitelle daily"],
    storyHooks: ["Wants a redemption arc from a past reality flop."],
  },
  {
    id: "roserade",
    name: "Roserade",
    image: "https://img.pokemondb.net/artwork/large/roserade.jpg",
    tagline: "Masked seductress with poisonous petals.",
    pronouns: "she/her",
    stats: {
      acting: 7,
      improv: 6,
      comedy: 6,
      dance: 8,
      design: 8,
      runway: 9,
      lipsync: 8,
      makeover: 8,
      rusical: 7,
      rumix: 7,
    },
    relationships: ["Floral feud with Lilligant", "Secret admiration for Nidoqueen"],
    storyHooks: ["Wants the judges to look past the mask and see heart."],
  },
  {
    id: "bellossom",
    name: "Bellossom",
    image: "https://img.pokemondb.net/artwork/large/bellossom.jpg",
    tagline: "Luau darling with a sneaky competitive streak.",
    pronouns: "she/her",
    stats: {
      acting: 6,
      improv: 7,
      comedy: 7,
      dance: 8,
      design: 7,
      runway: 7,
      lipsync: 7,
      makeover: 8,
      rusical: 7,
      rumix: 6,
    },
    relationships: ["Vacation bestie with Alcremie", "Jealous of Tsareena's royalty"],
    storyHooks: ["Wants to be taken seriously beyond sweet vibes."],
  },
  {
    id: "espeon",
    name: "Espeon",
    image: "https://img.pokemondb.net/artwork/large/espeon.jpg",
    tagline: "Solar-powered strategist with psychic wit.",
    pronouns: "she/her",
    stats: {
      acting: 7,
      improv: 8,
      comedy: 7,
      dance: 7,
      design: 7,
      runway: 8,
      lipsync: 7,
      makeover: 7,
      rusical: 8,
      rumix: 7,
    },
    relationships: ["Bonded with Sylveon", "Strategic rivalry with Mismagius"],
    storyHooks: ["Game theory queen turning confessionals into chess."],
  },
  {
    id: "sylveon",
    name: "Sylveon",
    image: "https://img.pokemondb.net/artwork/large/sylveon.jpg",
    tagline: "Ribbon fantasy and heart-healing hugs.",
    pronouns: "she/her",
    stats: {
      acting: 7,
      improv: 7,
      comedy: 7,
      dance: 8,
      design: 8,
      runway: 9,
      lipsync: 8,
      makeover: 8,
      rusical: 8,
      rumix: 8,
    },
    relationships: ["Ride-or-die with Espeon", "Confessional crush on Primarina"],
    storyHooks: ["Sweetheart energy hiding a killer instinct."],
  },
  {
    id: "alcremie",
    name: "Alcremie",
    image: "https://img.pokemondb.net/artwork/large/alcremie.jpg",
    tagline: "Dessert queen serving saccharine scandals.",
    pronouns: "she/her",
    stats: {
      acting: 6,
      improv: 6,
      comedy: 7,
      dance: 6,
      design: 9,
      runway: 8,
      lipsync: 7,
      makeover: 9,
      rusical: 7,
      rumix: 7,
    },
    relationships: ["Bestie pact with Bellossom", "Surprising beef with Salazzle"],
    storyHooks: ["Looks sweet but confessional confetti is pure shade."],
  },
];

const UNIQUE_QUEENS: PokemonQueenData[] = POKEMON_QUEENS;

const CHALLENGES: ChallengeTemplate[] = [
  {
    key: "acting",
    name: "Drama Justice Acting Challenge",
    description: "The queens reenact the courtroom saga of Team Rocket vs. Pikachu.",
    featuredStats: ["acting", "improv"],
    miniStoryHook: "Who can cry on cue and who will get the villain edit?",
  },
  {
    key: "comedy",
    name: "Snatch Synthesis",
    description: "A celebrity impersonation improv show judged by Jynx herself.",
    featuredStats: ["comedy", "improv"],
    miniStoryHook: "Read the room or get read for filth.",
  },
  {
    key: "dance",
    name: "Ultra Space Dance Marathon",
    description: "A high-energy dance battle across wormholes.",
    featuredStats: ["dance", "rumix"],
    miniStoryHook: "Splits, spins, and psychic choreography galore.",
  },
  {
    key: "design",
    name: "Legendary Ball",
    description: "Craft three lewks inspired by legendary Pokémon lore.",
    featuredStats: ["design", "runway"],
    miniStoryHook: "Hot glue won't save you this time, sis.",
  },
  {
    key: "makeover",
    name: "Trainer Makeover Madness",
    description: "Design signature looks for rookie trainers.",
    featuredStats: ["makeover", "design"],
    miniStoryHook: "Transformation thrills and emotional reveals.",
  },
  {
    key: "rusical",
    name: "Poké-Rusical Live",
    description: "A fully staged musical about gym leaders through the ages.",
    featuredStats: ["rusical", "dance", "acting"],
    miniStoryHook: "Belting high notes while hitting choreography.",
  },
  {
    key: "rumix",
    name: "Final Rumix Recording",
    description: "Write and record verses about your evolution journey.",
    featuredStats: ["rumix", "dance", "runway"],
    miniStoryHook: "Wordplay meets pop princess energy.",
  },
  {
    key: "branding",
    name: "PokéMart Branding Challenge",
    description: "Create a signature product and sell it on live TV.",
    featuredStats: ["acting", "comedy"],
    miniStoryHook: "Is your charisma high enough to move potions?",
  },
  {
    key: "talent",
    name: "All-Star Talent Showcase",
    description: "Show the multiverse exactly what makes you iconic.",
    featuredStats: ["lipsync", "dance", "acting"],
    miniStoryHook: "No excuses, only star quality.",
  },
];

const LIPSYNC_SONGS = [
  "Eterna Forest Vogue",
  "Team Skull Anthem",
  "Cerulean City Nights",
  "Battle Frontier Remix",
  "Galarian Disco Fever",
  "Sinnoh Siren Ballad",
  "Unova Club Kids",
];

const EPISODE_TITLES = [
  "Queens of the Poké-Verse",
  "Shade in the Safari Zone",
  "Alliances and Evolutions",
  "Drama at the Daycare",
  "The Legendary Ball",
  "Lip Flips and Psychic Trips",
  "The Makeover Meltdown",
  "Rumix and Rivalry",
  "The Semi-Final Showdown",
];

const THEMES = [
  "Neon Johto realness",
  "Mysterious Moonlight Masquerade",
  "Steam-powered Kalos couture",
  "Festival of Alola",
  "Shadow-trimmed Galar glam",
  "Crystal cavern fantasy",
  "Starfall Street chaos",
];

const DRAMA_PROMPTS = [
  "calls out the fake alliance in the werkroom",
  "shares a tearful story about life at the Pokémon Center",
  "spills tea about rehearsals being sabotaged",
  "declares herself the trade of the season and the room cackles",
  "threatens to walk off the set if critiqued again",
  "breaks the tension with a perfectly timed joke",
  "accidentally reveals a secret choreography plan",
  "inspires a group hug after a vulnerable untucked moment",
];

const STORY_BEATS = [
  "confesses she slept only two hours to finish her garment",
  "borrows rhinestones and returns them dripping in shade",
  "finds a surprise note from a former champion in her station",
  "leads the warm-up and flexes secret choreography skills",
  "quotes RuPaul in three languages during critiques",
  "reveals a hidden Mega Evolution prop on the runway",
  "accuses another queen of copying her runway concept",
  "turns untucked into a therapy session for the entire cast",
];

const randomFromArray = <T,>(arr: T[]): T => {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
};

const statAverage = (stats: Record<StatKey, number>, keys: StatKey[]): number => {
  const total = keys.reduce((sum, key) => sum + stats[key], 0);
  return total / keys.length;
};

const buildPerformanceScore = (
  queen: PokemonQueenData,
  challenge: ChallengeTemplate
): PerformanceResult => {
  const base = statAverage(queen.stats, challenge.featuredStats);
  const bonus = Math.random() * 2 - 1;
  const score = Math.max(1, Math.min(10, base + bonus));
  const critiqueFragments = [
    `delivered ${score >= 8 ? "polished" : score >= 6 ? "solid" : "shaky"} ${challenge.name.toLowerCase()} energy`,
    score >= 8
      ? "and the judges gagged over the confidence"
      : score >= 6
      ? "but the judges wanted a stronger point of view"
      : "and the judges clocked the nerves",
  ];
  const standout = randomFromArray(STORY_BEATS);
  return {
    queen: queen.name,
    score,
    critique: `${queen.name} ${critiqueFragments.join(" ")}.`,
    standoutMoment: `${queen.name} ${standout}.`,
  };
};

const ensureUniqueTitle = (episodes: EpisodeResult[], episodeNumber: number): string => {
  const base = EPISODE_TITLES[(episodeNumber - 1) % EPISODE_TITLES.length];
  if (!episodes.find(ep => ep.title === base)) {
    return base;
  }
  return `${base} ${episodeNumber}`;
};

const generateEpisodeSkeleton = (
  episodeNumber: number,
  episodes: EpisodeResult[]
): EpisodeSkeleton => {
  const challenge = randomFromArray(CHALLENGES);
  const theme = randomFromArray(THEMES);
  const drama: string[] = [];
  const lipsyncSong = randomFromArray(LIPSYNC_SONGS);
  return {
    episodeNumber,
    title: ensureUniqueTitle(episodes, episodeNumber),
    challenge,
    theme,
    drama,
    lipsyncSong,
    performances: [],
    placementByQueen: {},
  };
};

const episodePlacements = (
  performances: PerformanceResult[],
  remainingQueens: number
): {
  placementByQueen: Record<string, Placement>;
  ordered: string[];
  win: string;
  highs: string[];
  lows: string[];
  bottom: string[];
  safe: string[];
} => {
  const ordered = [...performances]
    .sort((a, b) => b.score - a.score)
    .map(result => result.queen);

  const placementByQueen: Record<string, Placement> = {};
  const win = ordered[0];
  const highs = ordered.slice(1, 3);
  const bottom = ordered.slice(-2);
  const lows: string[] = [];
  const safe: string[] = [];

  if (remainingQueens <= 5) {
    ordered.slice(3, -2).forEach(name => safe.push(name));
  } else {
    const lowCandidate = ordered[ordered.length - 3];
    lows.push(lowCandidate);
    ordered.slice(3, -3).forEach(name => safe.push(name));
  }

  placementByQueen[win] = "WIN";
  highs.forEach(name => {
    placementByQueen[name] = "HIGH";
  });
  safe.forEach(name => {
    placementByQueen[name] = "SAFE";
  });
  lows.forEach(name => {
    placementByQueen[name] = "LOW";
  });
  bottom.forEach(name => {
    placementByQueen[name] = "BTM2";
  });

  return { placementByQueen, ordered, win, highs, lows, bottom, safe };
};

const recalcSeasonFromEpisodes = (
  selected: PokemonQueenData[],
  episodes: EpisodeResult[]
): { queens: SeasonQueen[]; active: string[] } => {
  const queenMap = new Map<string, SeasonQueen>();
  selected.forEach(base => {
    queenMap.set(base.name, {
      ...base,
      trackRecord: [],
      storylineLog: [base.tagline, ...base.storyHooks],
      wins: 0,
      highs: 0,
      lows: 0,
      bottoms: 0,
      lipsyncs: 0,
    });
  });

  episodes.forEach(episode => {
    selected.forEach(base => {
      const queen = queenMap.get(base.name);
      if (!queen) {
        return;
      }
      const alreadyEliminated =
        queen.eliminationEpisode !== undefined &&
        queen.eliminationEpisode < episode.episodeNumber;
      if (alreadyEliminated) {
        queen.trackRecord.push("—");
        return;
      }
      const placement = episode.placementByQueen[base.name];
      const finalPlacement: Placement = placement ?? "SAFE";
      queen.trackRecord.push(finalPlacement);
      switch (finalPlacement) {
        case "WIN":
          queen.wins += 1;
          break;
        case "HIGH":
          queen.highs += 1;
          break;
        case "LOW":
          queen.lows += 1;
          break;
        case "BTM2":
          queen.bottoms += 1;
          queen.lipsyncs += 1;
          break;
        case "ELIM":
          queen.bottoms += 1;
          queen.lipsyncs += 1;
          queen.eliminationEpisode = episode.episodeNumber;
          break;
        case "WINNER":
          queen.wins += 1;
          break;
        case "RUNNER-UP":
        case "FINALIST":
        case "TOP2":
        case "SAFE":
        case "—":
        default:
          break;
      }
      episode.drama.forEach(drama => {
        if (drama.includes(base.name)) {
          queen.storylineLog.push(drama);
        }
      });
    });
  });

  const queens = Array.from(queenMap.values());
  const active = queens
    .filter(queen => queen.eliminationEpisode === undefined || queen.trackRecord.includes("WINNER"))
    .map(queen => queen.name);
  return { queens, active };
};

const placementColor = (placement: Placement): string => {
  switch (placement) {
    case "WIN":
      return "bg-emerald-100 text-emerald-700";
    case "HIGH":
      return "bg-blue-100 text-blue-700";
    case "SAFE":
      return "bg-gray-100 text-gray-600";
    case "LOW":
      return "bg-amber-100 text-amber-700";
    case "BTM2":
      return "bg-rose-100 text-rose-700";
    case "ELIM":
      return "bg-rose-500 text-white";
    case "WINNER":
      return "bg-purple-600 text-white";
    case "RUNNER-UP":
      return "bg-purple-200 text-purple-800";
    case "FINALIST":
      return "bg-fuchsia-100 text-fuchsia-700";
    case "TOP2":
      return "bg-indigo-100 text-indigo-700";
    case "—":
    default:
      return "bg-slate-100 text-slate-500";
  }
};

const ProducersRoom: React.FC<{
  episodes: EpisodeResult[];
  queens: PokemonQueenData[];
  onOverride: (episodeIndex: number, override: Record<string, Placement>) => void;
}> = ({ episodes, queens, onOverride }) => {
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState<number>(episodes.length - 1);
  const [localPlacements, setLocalPlacements] = useState<Record<string, Placement>>({});

  useEffect(() => {
    if (episodes.length === 0) {
      setSelectedEpisodeIndex(-1);
      setLocalPlacements({});
      return;
    }
    const index = selectedEpisodeIndex >= 0 ? selectedEpisodeIndex : episodes.length - 1;
    const safeIndex = Math.min(Math.max(index, 0), episodes.length - 1);
    setSelectedEpisodeIndex(safeIndex);
    setLocalPlacements(episodes[safeIndex]?.placementByQueen ?? {});
  }, [episodes]);

  useEffect(() => {
    if (selectedEpisodeIndex >= 0 && episodes[selectedEpisodeIndex]) {
      setLocalPlacements(episodes[selectedEpisodeIndex].placementByQueen);
    }
  }, [selectedEpisodeIndex, episodes]);

  if (episodes.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur rounded-2xl shadow-lg p-4">
        <h2 className="text-xl font-semibold text-rose-600 mb-2">Producer's Room</h2>
        <p className="text-sm text-gray-500">Run an episode to unlock your shady powers.</p>
      </div>
    );
  }

  const handlePlacementChange = (queenName: string, value: Placement) => {
    setLocalPlacements(prev => ({ ...prev, [queenName]: value }));
  };

  return (
    <div className="bg-white/70 backdrop-blur rounded-2xl shadow-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-rose-600">Producer's Room</h2>
        <select
          value={selectedEpisodeIndex}
          onChange={event => setSelectedEpisodeIndex(Number(event.target.value))}
          className="rounded-full border border-rose-200 px-3 py-1 text-sm"
        >
          {episodes.map((episode, index) => (
            <option key={episode.episodeNumber} value={index}>
              Episode {episode.episodeNumber}: {episode.title}
            </option>
          ))}
        </select>
      </div>
      <p className="text-sm text-gray-600">
        Rewrite placements, save a queen, or orchestrate a double shantay.
      </p>
      <div className="max-h-72 overflow-y-auto space-y-2 pr-2">
        {queens.map(queen => (
          <div
            key={queen.id}
            className="flex items-center justify-between gap-3 bg-white/80 border border-rose-100 rounded-xl px-3 py-2"
          >
            <div>
              <p className="font-semibold text-sm text-rose-700">{queen.name}</p>
              <p className="text-xs text-gray-500">{queen.tagline}</p>
            </div>
            <select
              value={localPlacements[queen.name] ?? "SAFE"}
              onChange={event => handlePlacementChange(queen.name, event.target.value as Placement)}
              className="text-xs rounded-full border border-rose-200 px-2 py-1"
            >
              {["WIN", "HIGH", "SAFE", "LOW", "BTM2", "ELIM", "WINNER", "RUNNER-UP", "FINALIST", "TOP2", "—"].map(
                option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                )
              )}
            </select>
          </div>
        ))}
      </div>
      <button
        onClick={() => selectedEpisodeIndex >= 0 && onOverride(selectedEpisodeIndex, localPlacements)}
        className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 rounded-full shadow"
      >
        Lock Override
      </button>
    </div>
  );
};

const SeasonStatsCard: React.FC<{ queens: SeasonQueen[] }> = ({ queens }) => {
  const totals = useMemo(() => {
    return queens.reduce(
      (acc, queen) => {
        acc.wins += queen.wins;
        acc.highs += queen.highs;
        acc.lows += queen.lows;
        acc.bottoms += queen.bottoms;
        acc.lipsyncs += queen.lipsyncs;
        return acc;
      },
      { wins: 0, highs: 0, lows: 0, bottoms: 0, lipsyncs: 0 }
    );
  }, [queens]);

  const standout = [...queens]
    .sort((a, b) => b.wins - a.wins || (a.eliminationEpisode ?? 99) - (b.eliminationEpisode ?? 99))
    .slice(0, 3);

  return (
    <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-fuchsia-600">Season Stats & Tea</h2>
        <span className="text-sm text-gray-500">Total Episodes: {queens[0]?.trackRecord.length ?? 0}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-emerald-50 text-emerald-700 rounded-2xl px-3 py-2 font-semibold">Wins: {totals.wins}</div>
        <div className="bg-blue-50 text-blue-700 rounded-2xl px-3 py-2 font-semibold">Highs: {totals.highs}</div>
        <div className="bg-amber-50 text-amber-700 rounded-2xl px-3 py-2 font-semibold">Lows: {totals.lows}</div>
        <div className="bg-rose-50 text-rose-700 rounded-2xl px-3 py-2 font-semibold">Bottom 2: {totals.bottoms}</div>
        <div className="bg-indigo-50 text-indigo-700 rounded-2xl px-3 py-2 font-semibold col-span-2 text-center">
          Lipsyncs: {totals.lipsyncs}
        </div>
      </div>
      <div className="bg-gradient-to-r from-purple-100 to-fuchsia-100 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-fuchsia-700 mb-2">Most talked-about queens</h3>
        <ul className="space-y-1 text-sm text-gray-700">
          {standout.map(queen => (
            <li key={queen.id} className="flex items-center justify-between">
              <span>{queen.name}</span>
              <span className="text-xs text-gray-500">{queen.wins} wins · {queen.bottoms} bottom appearances</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const TrackRecordTable: React.FC<{ queens: SeasonQueen[] }> = ({ queens }) => {
  const sorted = [...queens].sort((a, b) => {
    const aEpisode = a.eliminationEpisode ?? 999;
    const bEpisode = b.eliminationEpisode ?? 999;
    if (aEpisode !== bEpisode) {
      return bEpisode - aEpisode;
    }
    return b.wins - a.wins;
  });

  const episodeCount = Math.max(...sorted.map(q => q.trackRecord.length), 0);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-white/60">
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-widest text-gray-500">Queen</th>
            {Array.from({ length: episodeCount }).map((_, index) => (
              <th
                key={index}
                className="px-3 py-2 text-xs font-semibold uppercase tracking-widest text-gray-500 text-center"
              >
                Ep {index + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(queen => (
            <tr key={queen.id} className="odd:bg-white/70 even:bg-white/40">
              <td className="px-4 py-3 align-top">
                <div className="flex items-center gap-3">
                  <img
                    src={queen.image}
                    alt={queen.name}
                    className="w-10 h-10 rounded-full object-cover border border-fuchsia-200"
                  />
                  <div>
                    <p className="font-semibold text-sm text-fuchsia-700">{queen.name}</p>
                    <p className="text-xs text-gray-500">
                      {queen.eliminationEpisode ? `Elim Ep ${queen.eliminationEpisode}` : "Still in the running"}
                    </p>
                  </div>
                </div>
              </td>
              {Array.from({ length: episodeCount }).map((_, index) => {
                const placement = queen.trackRecord[index] ?? "—";
                return (
                  <td key={`${queen.id}-${index}`} className="px-3 py-2 text-center">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full inline-block min-w-[64px] ${placementColor(
                        placement
                      )}`}
                    >
                      {placement}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PokemonDragRaceSimulator: React.FC = () => {
  const [selectedQueens, setSelectedQueens] = useState<PokemonQueenData[]>([]);
  const [phase, setPhase] = useState<Phase>("CAST_SELECTION");
  const [episodes, setEpisodes] = useState<EpisodeResult[]>([]);
  const [seasonQueens, setSeasonQueens] = useState<SeasonQueen[]>([]);
  const [activeQueens, setActiveQueens] = useState<string[]>([]);
  const [seasonTea, setSeasonTea] = useState<string[]>([]);
  const [pendingEpisode, setPendingEpisode] = useState<EpisodeSkeleton | null>(null);
  const [eliminationChoice, setEliminationChoice] = useState<string | null>(null);
  const [finaleState, setFinaleState] = useState<FinaleState | null>(null);

  const canStartSeason = selectedQueens.length >= 8 && selectedQueens.length <= 12;

  useEffect(() => {
    if (selectedQueens.length === 0) {
      setSeasonQueens([]);
      setActiveQueens([]);
      return;
    }
    const { queens, active } = recalcSeasonFromEpisodes(selectedQueens, episodes);
    setSeasonQueens(queens);
    setActiveQueens(active);
  }, [episodes, selectedQueens]);

  const toggleQueen = (queen: PokemonQueenData) => {
    setSelectedQueens(prev => {
      const exists = prev.find(entry => entry.id === queen.id);
      if (exists) {
        return prev.filter(entry => entry.id !== queen.id);
      }
      if (prev.length >= 12) {
        return prev;
      }
      return [...prev, queen];
    });
  };

  const startSeason = () => {
    if (!canStartSeason) {
      return;
    }
    setEpisodes([]);
    setSeasonTea([]);
    setPendingEpisode(null);
    setFinaleState(null);
    setEliminationChoice(null);
    setPhase("ENTRANCES");
  };

  const handleAdvancePhase = () => {
    switch (phase) {
      case "ENTRANCES":
        setPhase("PROMO_CHART");
        break;
      case "PROMO_CHART":
        if (activeQueens.length <= 4 && episodes.length > 0) {
          prepareFinale(activeQueens);
          break;
        }
        if (!pendingEpisode) {
          const skeleton = generateEpisodeSkeleton(episodes.length + 1, episodes);
          setPendingEpisode(skeleton);
        }
        setPhase("CHALLENGE_SELECTOR");
        break;
      case "CHALLENGE_SELECTOR":
        setPhase("CHALLENGE_ANNOUNCEMENT");
        break;
      case "CHALLENGE_ANNOUNCEMENT":
        if (pendingEpisode) {
          const performances = activeQueens.map(name => {
            const queenData = selectedQueens.find(queen => queen.name === name);
            if (!queenData) {
              throw new Error("Queen data missing");
            }
            return buildPerformanceScore(queenData, pendingEpisode.challenge);
          });
          const dramaMoments = performances.slice(0, 3).map(performance => {
            const prompt = randomFromArray(DRAMA_PROMPTS);
            return `${performance.queen} ${prompt}.`;
          });
          setPendingEpisode(prev =>
            prev
              ? { ...prev, performances, drama: [...prev.drama, ...dramaMoments] }
              : prev
          );
        }
        setPhase("PERFORMANCES_DESCRIPTION");
        break;
      case "PERFORMANCES_DESCRIPTION":
        if (pendingEpisode) {
          const { placementByQueen, win, highs, lows, bottom, safe } = episodePlacements(
            pendingEpisode.performances,
            activeQueens.length
          );
          const announcementLines = [
            `${win} snatches the win with a ${pendingEpisode.challenge.name.toLowerCase()} triumph!`,
            ...highs.map(name => `${name} is high and praised by the judges.`),
            ...safe.map(name => `${name} is declared safe and scurries back to Untucked.`),
            ...lows.map(name => `${name} is low and warned to step it up.`),
            `${bottom.join(" and ")} must now lipsync for their lives!`,
          ];
          setPendingEpisode(prev =>
            prev
              ? {
                  ...prev,
                  placementByQueen,
                  drama: [...prev.drama, ...announcementLines],
                }
              : prev
          );
          setEliminationChoice(bottom[0]);
        }
        setPhase("RESULTS_ANNOUNCEMENTS");
        break;
      case "RESULTS_ANNOUNCEMENTS":
        setPhase("LIPSYNC_OUTCOME");
        break;
      default:
        break;
    }
  };

  const prepareFinale = (finalList: string[]) => {
    const topFour = finalList.slice(0, 4);
    const challenge = "Grand Finale Rumix & Eleganza Extravaganza";
    const talentChallenge = CHALLENGES.find(challenge => challenge.key === "talent") ?? CHALLENGES[0];
    const narratives = topFour.map(name => {
      const queen = selectedQueens.find(entry => entry.name === name);
      const descriptor = queen?.storyHooks[0] ?? "has fought every week for this crown";
      return `${name} revisits her journey: ${descriptor}`;
    });
    const scores = topFour.map(name => {
      const queen = selectedQueens.find(entry => entry.name === name);
      if (!queen) {
        throw new Error("Missing queen for finale");
      }
      return buildPerformanceScore(queen, talentChallenge);
    });
    setFinaleState({ finalQueens: topFour, challenge, narratives, scores });
    setPhase("FINALE_SHOWDOWN");
  };

  const finalizeElimination = () => {
    if (!pendingEpisode) {
      return;
    }
    const bottomTwo = Object.entries(pendingEpisode.placementByQueen)
      .filter(([, placement]) => placement === "BTM2")
      .map(([name]) => name);
    if (bottomTwo.length < 2 || !eliminationChoice) {
      return;
    }
    const elimination = eliminationChoice;
    const placementByQueen: Record<string, Placement> = { ...pendingEpisode.placementByQueen };
    placementByQueen[elimination] = "ELIM";

    const newEpisode: EpisodeResult = {
      episodeNumber: pendingEpisode.episodeNumber,
      title: pendingEpisode.title,
      challengeType: pendingEpisode.challenge.name,
      theme: pendingEpisode.theme,
      performances: pendingEpisode.performances,
      drama: [
        ...pendingEpisode.drama,
        `${bottomTwo.join(" vs. ")} lipsync to ${pendingEpisode.lipsyncSong}.`,
        `${elimination} sashays away after the lipsync showdown.`,
      ],
      lipsyncSong: pendingEpisode.lipsyncSong,
      placementByQueen,
      eliminatedQueen: elimination,
    };

    const nextActive = activeQueens.filter(name => name !== elimination);
    setEpisodes(prev => [...prev, newEpisode]);
    setSeasonTea(prev => [
      ...prev,
      `Episode ${newEpisode.episodeNumber} • ${newEpisode.title}: ${newEpisode.drama[newEpisode.drama.length - 1]}`,
    ]);
    setPendingEpisode(null);
    setEliminationChoice(null);

    if (nextActive.length <= 4) {
      prepareFinale(nextActive);
    } else {
      setPhase("PROMO_CHART");
    }
  };

  const revealWinner = () => {
    if (!finaleState || finaleState.winner) {
      return;
    }
    const queenTallies = finaleState.scores.map(performance => {
      const queenSeason = seasonQueens.find(queen => queen.name === performance.queen);
      const trackBonus = (queenSeason?.wins ?? 0) * 0.75 + (queenSeason?.highs ?? 0) * 0.2 - (queenSeason?.bottoms ?? 0) * 0.3;
      const total = Number((performance.score + trackBonus).toFixed(2));
      const recap = `${performance.queen} scores ${performance.score.toFixed(1)} with bonus ${trackBonus >= 0 ? "+" : ""}${trackBonus.toFixed(2)}.`;
      return {
        queen: performance.queen,
        total,
        recap,
      };
    });
    const crowned = queenTallies.reduce((best, current) => (current.total > best.total ? current : best), queenTallies[0]);

    const placementByQueen: Record<string, Placement> = {};
    queenTallies
      .sort((a, b) => b.total - a.total)
      .forEach((entry, index) => {
        if (entry.queen === crowned.queen) {
          placementByQueen[entry.queen] = "WINNER";
        } else if (index === 1) {
          placementByQueen[entry.queen] = "RUNNER-UP";
        } else {
          placementByQueen[entry.queen] = "FINALIST";
        }
      });

    const finaleEpisode: EpisodeResult = {
      episodeNumber: episodes.length + 1,
      title: "Grand Finale",
      challengeType: finaleState.challenge,
      theme: "Crowning Eleganza",
      performances: finaleState.scores,
      drama: [
        ...finaleState.narratives,
        ...queenTallies.map(entry => entry.recap),
        `${crowned.queen} is crowned the next Pokémon Drag Superstar!`,
      ],
      lipsyncSong: "Finale Megamix",
      placementByQueen,
      eliminatedQueen: undefined,
    };

    setEpisodes(prev => [...prev, finaleEpisode]);
    setFinaleState(prev => (prev ? { ...prev, winner: crowned.queen, tallies: queenTallies } : prev));
    setSeasonTea(prev => [...prev, `Grand Finale: ${crowned.queen} claims the crown!`]);
    setPhase("CROWNING");
  };

  const handleProducerOverride = (episodeIndex: number, override: Record<string, Placement>) => {
    let overrideNote = "";
    setEpisodes(prev => {
      if (!prev[episodeIndex]) {
        return prev;
      }
      const updated = [...prev];
      const target = { ...updated[episodeIndex] };
      target.placementByQueen = { ...override };
      const eliminationEntry = Object.entries(override).find(([, placement]) => placement === "ELIM");
      target.eliminatedQueen = eliminationEntry?.[0];
      overrideNote = `Producer twist: Episode ${target.episodeNumber} placements were re-scripted.`;
      if (!target.drama.some(line => line.includes("Producer override"))) {
        target.drama = [...target.drama, "Producer override: placements rewritten."];
      }
      updated[episodeIndex] = target;
      return updated;
    });
    if (overrideNote) {
      setSeasonTea(prev => [...prev, overrideNote]);
    }
  };

  const placementGroups = useMemo(() => {
    if (!pendingEpisode) {
      return null;
    }
    const groups: Record<Placement, string[]> = {
      WIN: [],
      HIGH: [],
      SAFE: [],
      LOW: [],
      BTM2: [],
      ELIM: [],
      "WINNER": [],
      "RUNNER-UP": [],
      "FINALIST": [],
      "TOP2": [],
      "—": [],
    };
    Object.entries(pendingEpisode.placementByQueen).forEach(([name, placement]) => {
      if (groups[placement]) {
        groups[placement].push(name);
      } else {
        groups["—"].push(name);
      }
    });
    return groups;
  }, [pendingEpisode]);

  const renderPhaseContent = () => {
    switch (phase) {
      case "CAST_SELECTION":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-fuchsia-600">Cast Construction</h2>
              <p className="text-sm text-gray-600 max-w-2xl">
                Pick between eight and twelve queens to craft your perfect Pokémon season. Tap a portrait to add or
                remove her. When you're ready, press <span className="font-semibold">Start Season</span> and let the drama
                unfold.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {UNIQUE_QUEENS.map(queen => {
                const selected = selectedQueens.some(entry => entry.id === queen.id);
                return (
                  <button
                    key={queen.id}
                    onClick={() => toggleQueen(queen)}
                    className={`text-left rounded-3xl p-4 shadow-lg transition transform hover:-translate-y-1 border ${
                      selected ? "border-fuchsia-500 bg-white" : "border-transparent bg-white/80"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <img src={queen.image} alt={queen.name} className="w-20 h-20 rounded-3xl object-cover" />
                      <div className="space-y-1">
                        <h3 className="text-xl font-semibold text-fuchsia-700">{queen.name}</h3>
                        <p className="text-xs uppercase tracking-wide text-gray-400">{queen.pronouns}</p>
                        <p className="text-sm text-gray-600">{queen.tagline}</p>
                        <div className="flex flex-wrap gap-1 text-[10px] text-gray-500">
                          {queen.relationships.slice(0, 2).map(rel => (
                            <span key={rel} className="bg-fuchsia-50 text-fuchsia-600 px-2 py-1 rounded-full">
                              {rel}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-5 gap-1 text-[10px] text-center">
                      {(["acting", "comedy", "dance", "design", "lipsync"] as StatKey[]).map(stat => (
                        <div key={stat} className="bg-gray-100 rounded-full py-1">
                          <p className="font-semibold text-gray-700">{queen.stats[stat]}</p>
                          <p className="uppercase text-gray-400">{stat}</p>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Selected queens: <span className="font-semibold text-fuchsia-600">{selectedQueens.length}</span>
              </p>
              <button
                onClick={startSeason}
                disabled={!canStartSeason}
                className={`px-6 py-3 rounded-full font-semibold shadow-lg transition ${
                  canStartSeason ? "bg-fuchsia-500 text-white hover:bg-fuchsia-600" : "bg-gray-200 text-gray-400"
                }`}
              >
                Start Season
              </button>
            </div>
          </div>
        );
      case "ENTRANCES":
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-fuchsia-600">Werkroom Entrances</h2>
            <ul className="space-y-3">
              {selectedQueens.map((queen, index) => (
                <li
                  key={queen.id}
                  className="bg-white/80 border border-fuchsia-100 rounded-3xl px-4 py-3 shadow flex items-start gap-3"
                >
                  <span className="text-xl font-bold text-fuchsia-500">#{index + 1}</span>
                  <div>
                    <p className="font-semibold text-lg text-fuchsia-700">{queen.name}</p>
                    <p className="text-sm text-gray-600">
                      "{queen.tagline}"
                    </p>
                    <p className="text-xs text-gray-500">Relationships: {queen.relationships.join(" · ")}</p>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={handleAdvancePhase}
              className="self-end bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-6 py-3 rounded-full shadow"
            >
              Proceed to Promo Chart
            </button>
          </div>
        );
      case "PROMO_CHART":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-fuchsia-600">Promo Power Chart</h2>
                <p className="text-sm text-gray-600">Episode {episodes.length + 1} • Queens remaining: {activeQueens.length}</p>
              </div>
              <button
                onClick={handleAdvancePhase}
                className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-6 py-3 rounded-full shadow"
              >
                Spin the Challenge Wheel
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {seasonQueens.map(queen => (
                <div key={queen.id} className="bg-white/80 rounded-3xl border border-fuchsia-100 p-4 shadow">
                  <div className="flex items-center gap-3">
                    <img src={queen.image} alt={queen.name} className="w-14 h-14 rounded-2xl object-cover" />
                    <div>
                      <p className="font-semibold text-fuchsia-700">{queen.name}</p>
                      <p className="text-xs text-gray-500">Wins: {queen.wins} · Bottoms: {queen.bottoms}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-5 gap-1 text-[10px] text-center">
                    {(["acting", "improv", "design", "runway", "lipsync"] as StatKey[]).map(stat => (
                      <div key={`${queen.id}-${stat}`} className="bg-fuchsia-50 text-fuchsia-600 rounded-full py-1">
                        <p className="font-semibold">{queen.stats[stat]}</p>
                        <p className="uppercase">{stat}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "CHALLENGE_SELECTOR":
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-fuchsia-600">Challenge Selector</h2>
            {pendingEpisode && (
              <div className="bg-white/80 rounded-3xl border border-fuchsia-100 p-6 shadow space-y-3">
                <p className="text-sm uppercase tracking-wide text-gray-500">Episode {pendingEpisode.episodeNumber}</p>
                <p className="text-2xl font-semibold text-fuchsia-700">{pendingEpisode.challenge.name}</p>
                <p className="text-gray-600">{pendingEpisode.challenge.description}</p>
                <p className="text-sm text-gray-500">Theme: {pendingEpisode.theme}</p>
                <p className="text-sm text-gray-500">Producer whisper: {pendingEpisode.challenge.miniStoryHook}</p>
                <button
                  onClick={handleAdvancePhase}
                  className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-6 py-3 rounded-full shadow"
                >
                  Announce Challenge Brief
                </button>
              </div>
            )}
          </div>
        );
      case "CHALLENGE_ANNOUNCEMENT":
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-fuchsia-600">Challenge Announcement</h2>
            {pendingEpisode && (
              <div className="bg-gradient-to-r from-fuchsia-100 to-purple-100 rounded-3xl p-6 shadow space-y-3">
                <p className="text-gray-700">{pendingEpisode.challenge.description}</p>
                <ul className="text-sm text-gray-600 list-disc list-inside">
                  {pendingEpisode.challenge.featuredStats.map(stat => (
                    <li key={stat}>Judges are tracking {stat.toUpperCase()} tonight.</li>
                  ))}
                </ul>
                <button
                  onClick={handleAdvancePhase}
                  className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-6 py-3 rounded-full shadow"
                >
                  Rehearse & Perform
                </button>
              </div>
            )}
          </div>
        );
      case "PERFORMANCES_DESCRIPTION":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-fuchsia-600">Performance Highlights</h2>
              <button
                onClick={handleAdvancePhase}
                className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-6 py-3 rounded-full shadow"
              >
                Deliver Results
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {pendingEpisode?.performances.map(performance => (
                <div key={performance.queen} className="bg-white/80 rounded-3xl border border-fuchsia-100 p-4 shadow space-y-2">
                  <p className="text-lg font-semibold text-fuchsia-700">{performance.queen}</p>
                  <p className="text-sm text-gray-600">Score: {performance.score.toFixed(1)}</p>
                  <p className="text-sm text-gray-600">{performance.critique}</p>
                  <p className="text-xs text-gray-500">Moment: {performance.standoutMoment}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "RESULTS_ANNOUNCEMENTS":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-fuchsia-600">Judges' Decisions</h2>
              <button
                onClick={handleAdvancePhase}
                className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-6 py-3 rounded-full shadow"
              >
                Prepare Lipsync
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {placementGroups &&
                Object.entries(placementGroups)
                  .filter(([placement]) => placement !== "—")
                  .map(([placement, names]) => (
                    <div key={placement} className="bg-white/80 rounded-3xl border border-fuchsia-100 p-4 shadow">
                      <p className={`text-sm font-semibold uppercase mb-2 ${placementColor(placement as Placement)}`}>
                        {placement}
                      </p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {names.map(name => (
                          <li key={name}>{name}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
            </div>
          </div>
        );
      case "LIPSYNC_OUTCOME":
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-fuchsia-600">Lipsync for Your Life</h2>
            {pendingEpisode && (
              <>
                <p className="text-sm text-gray-600">Song: {pendingEpisode.lipsyncSong}</p>
                <div className="grid md:grid-cols-2 gap-3">
                  {Object.entries(pendingEpisode.placementByQueen)
                    .filter(([, placement]) => placement === "BTM2")
                    .map(([name]) => (
                      <button
                        key={name}
                        onClick={() => setEliminationChoice(name)}
                        className={`border rounded-3xl p-4 shadow transition ${
                          eliminationChoice === name
                            ? "border-rose-500 bg-rose-50"
                            : "border-transparent bg-white/80"
                        }`}
                      >
                        <p className="text-lg font-semibold text-rose-600">{name}</p>
                        <p className="text-sm text-gray-600">Begging to stay another week.</p>
                      </button>
                    ))}
                </div>
                <button
                  onClick={finalizeElimination}
                  disabled={!eliminationChoice}
                  className={`px-6 py-3 rounded-full font-semibold shadow-lg ${
                    eliminationChoice ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-gray-200 text-gray-400"
                  }`}
                >
                  Confirm Elimination
                </button>
              </>
            )}
          </div>
        );
      case "FINALE_SHOWDOWN":
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-fuchsia-600">Finale Showdown</h2>
            {finaleState && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Challenge: {finaleState.challenge}</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  {finaleState.narratives.map((line, index) => (
                    <li key={index} className="bg-white/80 border border-fuchsia-100 rounded-3xl px-4 py-2 shadow">
                      {line}
                    </li>
                  ))}
                </ul>
                <div className="grid md:grid-cols-2 gap-3">
                  {finaleState.scores.map(performance => (
                    <div key={performance.queen} className="bg-white/80 rounded-3xl border border-fuchsia-100 p-4 shadow">
                      <p className="text-lg font-semibold text-fuchsia-700">{performance.queen}</p>
                      <p className="text-sm text-gray-600">Score: {performance.score.toFixed(1)}</p>
                      <p className="text-xs text-gray-500">{performance.standoutMoment}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={revealWinner}
                  className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-6 py-3 rounded-full shadow"
                >
                  Reveal the Winner
                </button>
              </div>
            )}
          </div>
        );
      case "CROWNING":
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-fuchsia-600">Crowning Moment</h2>
            {finaleState?.winner ? (
              <div className="bg-white/90 rounded-3xl border border-fuchsia-200 p-6 shadow space-y-3 text-center">
                <h3 className="text-2xl font-semibold text-fuchsia-700">{finaleState.winner} is our champion!</h3>
                <p className="text-sm text-gray-600">
                  After {episodes.length} episodes, {finaleState.winner} claims the Drag Superstar title.
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  {finaleState.tallies?.map(entry => (
                    <div key={entry.queen} className="bg-fuchsia-50 rounded-3xl px-4 py-3">
                      <p className="text-sm font-semibold text-fuchsia-700">{entry.queen}</p>
                      <p className="text-xs text-gray-600">Final score: {entry.total.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{entry.recap}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-600">The crown is still up for grabs. Reveal the winner to complete the season!</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="bg-white/70 backdrop-blur rounded-3xl shadow-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-fuchsia-600">Pokémon Drag Race Simulator</h1>
            <p className="text-sm text-gray-600">
              Stage: {phase.replace(/_/g, " ")} · Episodes filmed: {episodes.length}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <span className="bg-white/80 px-4 py-2 rounded-full shadow text-sm text-gray-600">
              Queens Remaining: {activeQueens.length || selectedQueens.length}
            </span>
            <span className="bg-white/80 px-4 py-2 rounded-full shadow text-sm text-gray-600">
              Tea Spilled: {seasonTea.length}
            </span>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl p-6 min-h-[480px]">
              {renderPhaseContent()}
            </div>
            {episodes.length > 0 && (
              <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl p-6 space-y-4">
                <h2 className="text-2xl font-bold text-fuchsia-600">Season Storyboard</h2>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {episodes.map(episode => (
                    <div key={episode.episodeNumber} className="bg-white/70 border border-fuchsia-100 rounded-3xl px-4 py-3 shadow">
                      <p className="text-sm font-semibold text-fuchsia-700">
                        Episode {episode.episodeNumber}: {episode.title}
                      </p>
                      <p className="text-xs text-gray-500">Challenge: {episode.challengeType}</p>
                      <ul className="mt-2 text-xs text-gray-600 space-y-1">
                        {episode.drama.slice(-3).map((moment, index) => (
                          <li key={index}>• {moment}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <SeasonStatsCard queens={seasonQueens} />
            <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl p-4">
              <h2 className="text-xl font-semibold text-fuchsia-600 mb-3">Season Tea & Drama</h2>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 text-sm text-gray-600">
                {seasonTea.length === 0 ? (
                  <p className="text-gray-400">No tea yet—run an episode!</p>
                ) : (
                  seasonTea.map((entry, index) => (
                    <div key={index} className="bg-fuchsia-50 border border-fuchsia-100 rounded-2xl px-3 py-2">
                      {entry}
                    </div>
                  ))
                )}
              </div>
            </div>
            <ProducersRoom episodes={episodes} queens={selectedQueens} onOverride={handleProducerOverride} />
          </div>
        </div>

        {seasonQueens.length > 0 && (
          <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl p-6 space-y-4">
            <h2 className="text-2xl font-bold text-fuchsia-600">Track Record</h2>
            <TrackRecordTable queens={seasonQueens} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonDragRaceSimulator;
