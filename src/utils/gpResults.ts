import { Results } from "../services/resultsService";

export type GpResultsRow = {
  tulosId: number;
  gpId: number;
  keilaajaId: number;
  nimi: string;
  sarja1: number;
  sarja2: number;
  yhteensa: number;
  sija: number;
  eroVoittajaan: number; // 0 voittajalle ja tasatuloksille
  osallistui: boolean;
};
export const computeGpResults = (result: Results[]): GpResultsRow[] => {
  // Otetaan mukaan vain osallistuneet rivit
  const osallistuneet = result.filter((r) => r.osallistui);

  // Lasketaan yhteensä ja nimi
  const withTotals = osallistuneet.map((r) => ({
    tulosId: r.tulosId,
    gpId: r.gpId,
    keilaajaId: r.keilaajaId,
    nimi: `${r.keilaajaEtunimi} ${r.keilaajaSukunimi}`,
    sarja1: r.sarja1,
    sarja2: r.sarja2,
    yhteensa: r.sarja1 + r.sarja2,
    osallistui: r.osallistui,
  }));

  // Järjestetään yhteistuloksen mukaan (isoin ensin)
  const sorted = [...withTotals].sort((a, b) => b.yhteensa - a.yhteensa);

  const winnerTotal = sorted[0]?.yhteensa ?? 0;

  // Lasketaan sija “rankkaamalla” – tasatulokset samalla sijalla
  let currentRank = 0;
  let lastTotal: number | null = null;
  let playerCount = 0;

  const ranked: GpResultsRow[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const row = sorted[i];
    playerCount++;

    if (lastTotal === null || row.yhteensa < lastTotal) {
        currentRank = playerCount;
        lastTotal = row.yhteensa;
    }
    const eroVoittajaan = winnerTotal - row.yhteensa;

    ranked.push({
        ...row,
        sija: currentRank,
        eroVoittajaan,
    });
  };

  return ranked;
};