import samples from "@/content/assets/moving-average-filter/samples.json";

// Signed 8-bit values copied from the original FPGA project's 256-word ROM.
export const romSamples: readonly number[] = samples;

export function filteredSample(address: number, enabled = true): number {
  if (!enabled || address < 2 || address === romSamples.length - 1) {
    return romSamples[address];
  }
  const sum =
    romSamples[address - 2] +
    romSamples[address - 1] +
    romSamples[address] +
    romSamples[address + 1];
  // VHDL integer division truncates toward zero, including negative sums.
  return Math.trunc(sum / 4) || 0;
}
