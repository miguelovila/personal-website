import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { filteredSample, romSamples } from "@/lib/moving-average";
import type { Language } from "@/lib/publishing";
import "./moving-average.css";

const en = {
  label: "Interactive moving-average filter",
  samples: "256 samples · signed 8-bit values",
  intro: "The original ROM signal, one sample at a time.",
  enable: "Enable filter",
  chartTitle: "Original and filtered triangular signal",
  chartDescription: (enabled: boolean, address: number, input: number, output: number) =>
    `The dashed line shows all 256 original ROM samples. The solid line shows ${enabled ? "the four-sample average" : "the unfiltered output"}. At address ${address}, the input is ${input} and the output is ${output}.`,
  romAddress: "ROM address",
  input: "ROM input",
  filteredOutput: "Filtered output",
  bypassOutput: "Bypass output",
  sampleAddress: "Sample address",
  rangeValue: (address: number, input: number, output: number) =>
    `${address} of 255; input ${input}, output ${output}`,
  first: "First sample",
  firstWindow: "First full window",
  last: "Last sample",
  address: "Address",
  enabled: "Filter enabled",
  bypassed: "Filter bypassed",
  bypassNote: "With the filter off, the current input passes through unchanged.",
  boundaryNote:
    "Addresses 0, 1 and 255 pass through unchanged: the four-sample window would extend beyond the ROM.",
  calculationNote:
    "Two previous samples, the current sample and the following sample. Integer division drops the fractional part toward zero.",
  noScript:
    "Enable JavaScript to select a sample or toggle the filter. The plot and calculation above show address 2.",
};
const pt: typeof en = {
  label: "Filtro de média móvel interativo",
  samples: "256 amostras · valores de 8 bits com sinal",
  intro: "O sinal original da ROM, amostra a amostra.",
  enable: "Ativar filtro",
  chartTitle: "Sinal triangular original e filtrado",
  chartDescription: (enabled, address, input, output) =>
    `A linha tracejada mostra as 256 amostras originais da ROM. A linha contínua mostra ${enabled ? "a média de quatro amostras" : "a saída sem filtragem"}. No endereço ${address}, a entrada é ${input} e a saída é ${output}.`,
  romAddress: "Endereço da ROM",
  input: "Entrada da ROM",
  filteredOutput: "Saída filtrada",
  bypassOutput: "Saída sem filtragem",
  sampleAddress: "Endereço da amostra",
  rangeValue: (address, input, output) => `${address} de 255; entrada ${input}, saída ${output}`,
  first: "Primeira amostra",
  firstWindow: "Primeira janela completa",
  last: "Última amostra",
  address: "Endereço",
  enabled: "Filtro ativo",
  bypassed: "Filtro desligado",
  bypassNote: "Com o filtro desligado, o valor de entrada passa para a saída sem alterações.",
  boundaryNote:
    "Nos endereços 0, 1 e 255, o valor passa sem alterações: a janela de quatro amostras ultrapassaria os limites da ROM.",
  calculationNote:
    "As duas amostras anteriores, a atual e a seguinte. A divisão inteira elimina a parte fracionária, truncando em direção a zero.",
  noScript:
    "Ativa o JavaScript para escolher uma amostra ou ligar e desligar o filtro. O gráfico e o cálculo acima mostram o endereço 2.",
};
const copy = { en, pt };

const x = (address: number) => 48 + (address / 255) * 580;
const y = (sample: number) => 150 - (sample / 128) * 116;
const trace = (values: readonly number[]) =>
  values.map((value, address) => `${x(address).toFixed(2)},${y(value).toFixed(2)}`).join(" ");
const rawTrace = trace(romSamples);
const filteredTrace = trace(romSamples.map((_, address) => filteredSample(address)));

export default function MovingAverageDemo({ language = "en" }: { language?: Language }) {
  const t = copy[language];
  const number = new Intl.NumberFormat(language === "pt" ? "pt-PT" : "en-GB");
  const [address, setAddress] = useState(2);
  const [enabled, setEnabled] = useState(true);
  const [ready, setReady] = useState(false);
  const id = useId();
  useEffect(() => setReady(true), []);

  const boundary = address < 2 || address === 255;
  const window = boundary ? [address] : [address - 2, address - 1, address, address + 1];
  const output = filteredSample(address, enabled);
  const sum = window.reduce((total, index) => total + romSamples[index], 0);

  return (
    <section className="filter-demo" aria-label={t.label}>
      <div className="filter-demo-heading">
        <div>
          <p className="filter-demo-label">{t.samples}</p>
          <p className="filter-demo-intro">{t.intro}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          aria-pressed={enabled}
          disabled={!ready}
          onClick={() => setEnabled((value) => !value)}
        >
          {t.enable}
          <span aria-hidden="true">{enabled ? "✓" : "○"}</span>
        </Button>
      </div>

      <svg
        className="filter-demo-chart"
        viewBox="0 0 660 310"
        role="img"
        aria-labelledby={`${id}-title ${id}-description`}
      >
        <title id={`${id}-title`}>{t.chartTitle}</title>
        <desc id={`${id}-description`}>
          {t.chartDescription(enabled, address, romSamples[address], output)}
        </desc>
        {[-128, -64, 0, 64, 128].map((tick) => (
          <g key={tick}>
            <line x1="48" x2="628" y1={y(tick)} y2={y(tick)} className="filter-demo-grid" />
            <text x="38" y={y(tick) + 4} textAnchor="end">
              {tick}
            </text>
          </g>
        ))}
        {[0, 64, 128, 192, 255].map((tick) => (
          <text key={tick} x={x(tick)} y="286" textAnchor="middle">
            {tick}
          </text>
        ))}
        <text x="338" y="306" textAnchor="middle">
          {t.romAddress}
        </text>
        <polyline points={rawTrace} className="filter-demo-raw" />
        <polyline points={enabled ? filteredTrace : rawTrace} className="filter-demo-output" />
        <line x1={x(address)} x2={x(address)} y1="30" y2="266" className="filter-demo-cursor" />
        {(enabled ? window : [address]).map((index) => (
          <circle
            key={index}
            cx={x(index)}
            cy={y(romSamples[index])}
            r="4"
            className="filter-demo-sample"
          />
        ))}
        <circle cx={x(address)} cy={y(output)} r="5" className="filter-demo-result" />
      </svg>

      <div className="filter-demo-legend" aria-hidden="true">
        <span>
          <i className="filter-demo-key-raw" /> {t.input}
        </span>
        <span>
          <i className="filter-demo-key-output" /> {enabled ? t.filteredOutput : t.bypassOutput}
        </span>
      </div>

      <div className="filter-demo-control">
        <Label htmlFor={`${id}-address`}>
          {t.sampleAddress}: {address}
        </Label>
        <Input
          id={`${id}-address`}
          type="range"
          min="0"
          max="255"
          step="1"
          value={address}
          disabled={!ready}
          aria-valuetext={t.rangeValue(address, romSamples[address], output)}
          onChange={(event) => setAddress(Number(event.target.value))}
          className="filter-demo-slider"
        />
        <div className="filter-demo-jumps">
          <Button type="button" variant="outline" disabled={!ready} onClick={() => setAddress(0)}>
            {t.first}
          </Button>
          <Button type="button" variant="outline" disabled={!ready} onClick={() => setAddress(2)}>
            {t.firstWindow}
          </Button>
          <Button type="button" variant="outline" disabled={!ready} onClick={() => setAddress(255)}>
            {t.last}
          </Button>
        </div>
      </div>

      <div className="filter-demo-calculation" aria-live="polite" aria-atomic="true">
        <p className="filter-demo-label">
          {t.address} {address} · {enabled ? t.enabled : t.bypassed}
        </p>
        <p className="filter-demo-equation">
          {!enabled || boundary
            ? `${romSamples[address]} → ${output}`
            : `(${window.map((index) => romSamples[index]).join(" + ")}) ÷ 4 = ${number.format(sum / 4)} → ${output}`}
        </p>
        <p className="filter-demo-note">
          {!enabled ? t.bypassNote : boundary ? t.boundaryNote : t.calculationNote}
        </p>
      </div>
      <noscript>
        <p className="filter-demo-note">{t.noScript}</p>
      </noscript>
    </section>
  );
}
