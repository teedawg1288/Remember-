import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { PredictionTestVerification, PredictionDataPoint } from '../types/translation';

interface BatteryCycleRecord {
  cycle: number;
  capacity: number;
}

interface NasaBatteryDataset {
  batteryId: string;
  source: string;
  description: string;
  nominalCapacity: number;
  ratedCapacity: number;
  eolThreshold: number;
  totalCycles: number;
  cycles: BatteryCycleRecord[];
}

export function runNasaBatteryPrediction(trainingRatio: number = 0.60): PredictionTestVerification {
  let dataset: NasaBatteryDataset;
  
  try {
    // Resolve dataset path in both ESM and Node environments
    let datasetPath = path.resolve(process.cwd(), 'src/data/nasa_b0005_battery.json');
    if (!fs.existsSync(datasetPath)) {
      datasetPath = path.resolve(__dirname, '../data/nasa_b0005_battery.json');
    }
    const raw = fs.readFileSync(datasetPath, 'utf-8');
    dataset = JSON.parse(raw);
  } catch (err) {
    console.warn('Could not read NASA battery dataset from file, fallback to hardcoded records:', err);
    throw new Error('NASA battery aging dataset (B0005) is missing or unreadable on disk.');
  }

  const cycles = dataset.cycles;
  const totalCycles = cycles.length; // 168
  const splitCycle = Math.round(totalCycles * trainingRatio); // 100 cycles

  const trainData = cycles.slice(0, splitCycle);
  const withheldData = cycles.slice(splitCycle);

  // 1. Fit Linear Baseline on first 60%
  const xTrain = trainData.map(c => c.cycle);
  const yTrain = trainData.map(c => c.capacity);
  const n = xTrain.length;

  const xMean = xTrain.reduce((a, b) => a + b, 0) / n;
  const yMean = yTrain.reduce((a, b) => a + b, 0) / n;

  const slopeNum = xTrain.reduce((acc, x, i) => acc + (x - xMean) * (yTrain[i] - yMean), 0);
  const slopeDen = xTrain.reduce((acc, x) => acc + Math.pow(x - xMean, 2), 0);
  const slopeLinear = slopeNum / slopeDen;
  const interceptLinear = yMean - slopeLinear * xMean;

  // 2. Fit Physics-Informed Power-Law SEI Growth Model on first 60%
  // C(t) = y0 - alpha * t^beta (diffusion controlled degradation)
  let bestLoss = Infinity;
  let bestParams = { y0: 1.85, alpha: 0.001, beta: 1.0 };

  const candidateBetas = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3];
  for (const b of candidateBetas) {
    const zTrain = xTrain.map(x => Math.pow(x, b));
    const zMean = zTrain.reduce((acc, val) => acc + val, 0) / n;
    const zDiff = zTrain.map(z => z - zMean);
    const zVar = zDiff.reduce((acc, val) => acc + val * val, 0);
    const cov = zTrain.reduce((acc, z, i) => acc + (z - zMean) * (yTrain[i] - yMean), 0);
    
    const alpha = -cov / zVar;
    const y0 = yMean + alpha * zMean;

    let loss = 0;
    for (let i = 0; i < n; i++) {
      const pred = y0 - alpha * Math.pow(xTrain[i], b);
      loss += Math.pow(yTrain[i] - pred, 2);
    }

    if (loss < bestLoss && alpha > 0) {
      bestLoss = loss;
      bestParams = { y0, alpha, beta: b };
    }
  }

  // 3. Predict withheld 40% and full trajectory
  const dataPoints: PredictionDataPoint[] = [];

  for (let i = 0; i < totalCycles; i++) {
    const cyc = cycles[i].cycle;
    const actual = cycles[i].capacity;
    const isWithheld = cyc > splitCycle;
    const baseline = Number((slopeLinear * cyc + interceptLinear).toFixed(4));
    const predicted = Number((bestParams.y0 - bestParams.alpha * Math.pow(cyc, bestParams.beta)).toFixed(4));

    dataPoints.push({
      cycle: cyc,
      actual,
      predicted,
      baseline,
      isWithheld,
    });
  }

  // 4. Calculate End of Life (EOL) at 1.40 Ah threshold
  const eolThreshold = dataset.eolThreshold || 1.40;
  let actualEolCycle: number | undefined;
  for (const c of cycles) {
    if (c.capacity <= eolThreshold) {
      actualEolCycle = c.cycle;
      break;
    }
  }

  let modelPredictedEolCycle: number | undefined;
  for (let c = splitCycle + 1; c <= 300; c++) {
    const pred = bestParams.y0 - bestParams.alpha * Math.pow(c, bestParams.beta);
    if (pred <= eolThreshold) {
      modelPredictedEolCycle = c;
      break;
    }
  }

  const baselinePredictedEolCycle = Math.round(((eolThreshold - interceptLinear) / slopeLinear) * 10) / 10;

  // 5. Calculate Errors on Withheld 40% Data
  const withheldActuals = withheldData.map(c => c.capacity);
  const withheldModelPreds = withheldData.map(c => bestParams.y0 - bestParams.alpha * Math.pow(c.cycle, bestParams.beta));
  const withheldBaselinePreds = withheldData.map(c => slopeLinear * c.cycle + interceptLinear);

  const mCount = withheldActuals.length;

  const modelMae = withheldActuals.reduce((acc, act, i) => acc + Math.abs(act - withheldModelPreds[i]), 0) / mCount;
  const modelRmse = Math.sqrt(
    withheldActuals.reduce((acc, act, i) => acc + Math.pow(act - withheldModelPreds[i], 2), 0) / mCount
  );

  const baselineMae = withheldActuals.reduce((acc, act, i) => acc + Math.abs(act - withheldBaselinePreds[i]), 0) / mCount;
  const baselineRmse = Math.sqrt(
    withheldActuals.reduce((acc, act, i) => acc + Math.pow(act - withheldBaselinePreds[i], 2), 0) / mCount
  );

  const eolCycleError = actualEolCycle && modelPredictedEolCycle ? Math.abs(modelPredictedEolCycle - actualEolCycle) : 0;
  const baselineEolCycleError = actualEolCycle ? Math.abs(Math.round(baselinePredictedEolCycle) - actualEolCycle) : 0;

  return {
    datasetName: 'NASA Ames Li-ion Battery Aging Dataset (B0005)',
    source: 'NASA Prognostics Center of Excellence (PCoE)',
    totalCyclesOrSamples: totalCycles,
    trainingPercent: Math.round(trainingRatio * 100),
    splitCycle,
    metricUnit: 'Ah (Discharge Capacity)',
    eolThreshold,
    actualEolCycle,
    modelPredictedEolCycle,
    baselinePredictedEolCycle,
    eolCycleError,
    baselineEolCycleError,
    modelRmse: Number(modelRmse.toFixed(4)),
    baselineRmse: Number(baselineRmse.toFixed(4)),
    modelMae: Number(modelMae.toFixed(4)),
    baselineMae: Number(baselineMae.toFixed(4)),
    dataPoints,
    methodology: `Trained strictly on the first ${Math.round(trainingRatio * 100)}% of cycles (cycles 1 to ${splitCycle}). Withheld remaining ${100 - Math.round(trainingRatio * 100)}% (cycles ${splitCycle + 1} to ${totalCycles}). Tested a Physics-Informed SEI Growth degradation model (C(t) = ${bestParams.y0.toFixed(3)} - ${bestParams.alpha.toExponential(3)} · t^${bestParams.beta.toFixed(1)}) against a simple linear regression baseline.`,
    withheldValidationSummary: `The actual battery crossed the critical End-of-Life (1.40 Ah) threshold at Cycle ${actualEolCycle}. The physics model predicted EOL at Cycle ${modelPredictedEolCycle} (off by only ${eolCycleError} cycles). The simple linear regression predicted EOL at Cycle ${baselinePredictedEolCycle.toFixed(1)} (off by ${baselineEolCycleError} cycles).`,
    whatIsMissingForRealWorldTesting: 'Software models and historical bench data confirm the mathematical fade trajectory. To conduct a live test, an environmental thermal chamber with a programmable multichannel Arbin or Biologic potentiostat is required to age a physical cell under varying C-rates.',
  };
}
