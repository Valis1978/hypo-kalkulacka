"use client";

import { useState } from "react";

/* ─── CONSTANTS ─── */
const MORTGAGE_BALANCE_SJM = 4_385_000;
const MORTGAGE_RATE_SJM = 1.89;
const MORTGAGE_PAYMENT_SJM = 23_335;
const PRODUCTS_TOTAL = 3_147_486;
const PRODUCTS_HALF = Math.round(PRODUCTS_TOTAL / 2);
const PLOT_TOTAL = 2_999;
const BRONISLAVA_DEMAND = 4_181_243;

/* ─── HELPERS ─── */
const fmt = (n: number) => Math.round(n).toLocaleString("cs-CZ");
const fmtK = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1).replace(".", ",")} mil`;
  if (abs >= 1_000) return `${Math.round(n / 1_000)} tis`;
  return fmt(n);
};

/* ─── SLIDER ─── */
function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix = "Kč",
  accent,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  suffix?: string;
  accent?: string;
}) {
  const display =
    suffix === "Kč"
      ? `${fmt(value)} Kč`
      : suffix === "%"
        ? `${value} %`
        : suffix === "m"
          ? `${value} měs.`
          : `${fmt(value)} ${suffix}`;

  const pct = ((value - min) / (max - min)) * 100;
  const trackColor = accent || "#cbd5e1";

  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-slate-400">{label}</span>
        <span className="text-white font-medium font-mono text-[0.8rem]">
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full"
        style={{
          background: `linear-gradient(to right, ${trackColor} 0%, ${trackColor} ${pct}%, var(--color-surface-700) ${pct}%, var(--color-surface-700) 100%)`,
        }}
      />
    </div>
  );
}

/* ─── STAT CARD ─── */
function Stat({
  label,
  value,
  color,
  sub,
}: {
  label: string;
  value: string;
  color: string;
  sub?: string;
}) {
  return (
    <div className="bg-surface-800 rounded-lg p-3 min-w-0">
      <div className="text-[0.7rem] text-slate-400 mb-1 leading-tight">
        {label}
      </div>
      <div className={`text-lg md:text-xl font-bold font-mono ${color}`}>
        {value}
      </div>
      {sub && (
        <div className="text-[0.65rem] text-slate-500 mt-0.5">{sub}</div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/* ═══  MAIN PAGE                                    ═══ */
/* ═══════════════════════════════════════════════════════ */
export default function Page() {
  /* ─── STATE ─── */
  const [fixedClaim, setFixedClaim] = useState(6_500_000);
  const [bronislavaSalePrice, setBronislavaSalePrice] = useState(9_000_000);

  /* ─── CALC: vysvobození ─── */
  const vClaim = Math.max(
    0,
    Math.round((fixedClaim - MORTGAGE_BALANCE_SJM) / 2)
  );
  const vProducts = PRODUCTS_HALF;
  const vTotal = vClaim + vProducts;

  /* ─── CALC: Bronislava ─── */
  const bronislavaFromHouse =
    bronislavaSalePrice - MORTGAGE_BALANCE_SJM - vClaim;
  const bronislavaTotal = bronislavaFromHouse + PRODUCTS_HALF;

  /* ═══════════════════════ RENDER ═══════════════════════ */
  return (
    <main className="max-w-5xl mx-auto px-3 py-6 md:px-6 md:py-10">
      {/* ─── HEADER ─── */}
      <header className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold text-white mb-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          K Cihelně 733 &mdash; Vypořádání SJM
        </h1>
        <p className="text-slate-400 text-sm">
          Návrh &bdquo;Vysvobození&ldquo; &mdash; interaktivní kalkulačka
        </p>
      </header>

      {/* ─── CONTEXT ─── */}
      <details className="card-flush mb-6 group">
        <summary className="px-5 py-4 cursor-pointer text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2 select-none">
          <svg
            className="w-4 h-4 transition-transform group-open:rotate-90 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          O co jde? &mdash; kontext a popis situace
        </summary>
        <div className="px-5 pb-5 text-sm text-slate-400 space-y-3 border-t border-surface-700 pt-4">
          <p className="text-slate-300 font-medium">
            Vypořádání SJM po rozvodu &mdash; RD K Cihelně 733, Vacenovice
          </p>
          <p>
            <strong className="text-white">Výchozí situace:</strong> Vlastimil
            a Bronislava Valentovi se rozvedli v dubnu 2024. Hlavní položkou k
            vypořádání je rodinný dům (287 m², novostavba 2010, bazén, kinosál)
            na adrese K Cihelně 733, Vacenovice. Na domě vázne společná
            hypotéka: zůstatek {fmt(MORTGAGE_BALANCE_SJM)} Kč, splátka{" "}
            {fmt(MORTGAGE_PAYMENT_SJM)} Kč/měs., sazba {MORTGAGE_RATE_SJM} %
            (fixace do konce 2027). V SJM jsou také finanční produkty v celkové
            hodnotě {fmt(PRODUCTS_TOTAL)} Kč.
          </p>
          <p>
            <strong className="text-white">Pozemek:</strong> Pozemek pod domem
            a zahrada (celkem {fmt(PLOT_TOTAL)} m², parcely 2036/16 a 2036/233)
            jsou výlučným vlastnictvím Vlastimila &mdash; nespadají do SJM. Pro
            účely smírného vypořádání je Vlastimil vkládá do dohody, jako by
            byly součástí SJM &mdash; budou prodány společně s domem jako celek.
          </p>
          <p>
            <strong className="text-white">Technický stav:</strong> Zpráva
            DEKPROJEKT (07/2025, 74 stran) identifikuje vady za 2,5&ndash;3,65
            mil. Kč bez DPH. Hlavní problémy: hydroizolace, střešní krytina pod
            minimálním sklonem, fasáda. Nosná konstrukce v pořádku. Zpráva bude
            povinnou přílohou kupní smlouvy.
          </p>
          <p>
            <strong className="text-white">Princip Vysvobození:</strong>{" "}
            Vlastimil si stanoví fixní nárok (½ z dohodnuté fiktivní ceny minus
            hypotéka). Prodej organizuje Bronislava &mdash; sama volí RK, cenu,
            kupce. Od podpisu dohody Vlastimil nehradí žádné náklady.
            Hypotéku hradí výhradně Bronislava do prodeje, kdy se zůstatek
            splatí z kupní ceny. Finanční produkty se vypořádají okamžitě.
            Vše nad fixní nárok Vlastimila je Bronislavy &mdash; čím dráž prodá,
            tím víc má ona.
          </p>
          <p>
            <strong className="text-white">Lhůta:</strong> 12 měsíců na prodej.
            Pokud nedojde k prodeji, povinnost přistoupit k nejlepší nabídce
            nebo svěřit RK (další 3 měs.). Po 15 měsících &mdash; veřejná
            dobrovolná dražba se znaleckým posudkem.
          </p>
          <p className="text-[0.75rem] text-slate-500 border-t border-surface-700 pt-3">
            Zdroje: odhad RE/MAX Valuo (02/2026), CenováMapa.cz, zpráva
            DEKPROJEKT (07/2025), přípisy AK Švecová a AK Mandilas (02/2026).
          </p>
        </div>
      </details>

      {/* ═══ VYSVOBOZENÍ ═══ */}
      <section
        className="card mb-5"
        style={{ borderColor: "var(--color-vysv-dim)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-vysv" />
          <h2 className="text-sm font-semibold text-vysv uppercase tracking-wider">
            Vlastimil &mdash; fixní nárok
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Slider
            label="Dohodnutá fiktivní cena domu"
            value={fixedClaim}
            min={5_000_000}
            max={9_000_000}
            step={250_000}
            onChange={setFixedClaim}
            accent="#22c55e"
          />
          <div className="bg-surface-800 rounded-lg p-3 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Fixní nárok: ½ &times; ({fmt(fixedClaim)} &minus;{" "}
              {fmt(MORTGAGE_BALANCE_SJM)})
            </span>
            <span className="text-lg font-bold text-vysv font-mono">
              {fmt(vClaim)} Kč
            </span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat
            label="Fixní nárok z domu"
            value={`${fmt(vClaim)} Kč`}
            color="text-vysv"
            sub="Z výtěžku prodeje — neměnný"
          />
          <Stat
            label="Finanční produkty"
            value={`${fmt(vProducts)} Kč`}
            color="text-vysv"
            sub="Ihned při podpisu dohody"
          />
          <Stat
            label="VLASTIMIL CELKEM"
            value={`${fmt(vTotal)} Kč`}
            color="text-vysv"
            sub="Stejné bez ohledu na prodejní cenu"
          />
        </div>
      </section>

      {/* ═══ BRONISLAVA ═══ */}
      <section className="card mb-5" style={{ borderColor: "#7c3aed30" }}>
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: "#a855f7" }}
          />
          <h2
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: "#a855f7" }}
          >
            Bronislava &mdash; co dostane při Vysvobození
          </h2>
        </div>
        <div className="mb-4">
          <Slider
            label="Prodejní cena domu (Bronislava prodává)"
            value={bronislavaSalePrice}
            min={6_000_000}
            max={12_000_000}
            step={250_000}
            onChange={setBronislavaSalePrice}
            accent="#a855f7"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat
            label="Z domu (po hypo + fixní nárok)"
            value={`${fmt(bronislavaFromHouse)} Kč`}
            color={
              bronislavaFromHouse >= 0 ? "text-green-400" : "text-red-400"
            }
            sub={`${fmtK(bronislavaSalePrice)} − ${fmtK(MORTGAGE_BALANCE_SJM)} hypo − ${fmtK(vClaim)} fixní nárok`}
          />
          <Stat
            label="Finanční produkty"
            value={`${fmt(PRODUCTS_HALF)} Kč`}
            color="text-slate-300"
            sub="½ z celkových produktů"
          />
          <Stat
            label="BRONISLAVA CELKEM"
            value={`${fmt(bronislavaTotal)} Kč`}
            color="text-green-400"
            sub={
              bronislavaTotal >= BRONISLAVA_DEMAND
                ? `✓ Víc než požadovala (${fmtK(BRONISLAVA_DEMAND)})`
                : `Méně než požadovala (${fmtK(BRONISLAVA_DEMAND)})`
            }
          />
          <Stat
            label="Její požadavek"
            value={`${fmt(BRONISLAVA_DEMAND)} Kč`}
            color="text-warn"
            sub="Přípis AK Mandilas, 25. 2. 2026"
          />
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[0.7rem] text-slate-400 uppercase border-b border-surface-700">
                <th className="text-left py-2 px-3">Prodá za</th>
                <th className="text-center py-2 px-3">
                  Bronislava z domu
                </th>
                <th className="text-center py-2 px-3">+ produkty</th>
                <th className="text-center py-2 px-3">
                  Bronislava celkem
                </th>
                <th className="text-center py-2 px-3">Vlastimil celkem</th>
                <th className="text-center py-2 px-3">
                  Ona vs. požadavek
                </th>
              </tr>
            </thead>
            <tbody className="font-mono text-[0.8rem]">
              {[
                7_000_000, 8_000_000, 9_000_000, 10_000_000, 12_000_000,
              ].map((price) => {
                const fromHouse = price - MORTGAGE_BALANCE_SJM - vClaim;
                const total = fromHouse + PRODUCTS_HALF;
                const diff = total - BRONISLAVA_DEMAND;
                return (
                  <tr
                    key={price}
                    className={`border-b border-surface-800 ${price === bronislavaSalePrice ? "bg-surface-800/50" : ""}`}
                  >
                    <td className="py-2 px-3 text-slate-300 font-sans">
                      {fmtK(price)}
                    </td>
                    <td className="text-center py-2 px-3 text-green-400">
                      {fmt(fromHouse)}
                    </td>
                    <td className="text-center py-2 px-3 text-slate-400">
                      {fmt(PRODUCTS_HALF)}
                    </td>
                    <td className="text-center py-2 px-3 text-white font-bold">
                      {fmt(total)}
                    </td>
                    <td className="text-center py-2 px-3 text-vysv">
                      {fmt(vTotal)}
                    </td>
                    <td
                      className={`text-center py-2 px-3 ${diff >= 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {diff >= 0 ? "+" : ""}
                      {fmt(diff)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[0.75rem] text-slate-500 mt-3">
          Bronislava si ponechá hypotéku se sazbou {MORTGAGE_RATE_SJM} % (fixace
          do konce 2027), má čas prodat za vlastní cenu, a vše nad fixní nárok
          Vlastimila je její.{" "}
          <strong className="text-slate-300">
            Čím víc věří, že dům má vyšší hodnotu, tím víc by měla chtít
            Vysvobození.
          </strong>
        </p>
      </section>

      {/* ═══ SUMMARY ═══ */}
      <section className="card mb-5 !border-vysv/50 bg-vysv/5">
        <h2
          className="text-base md:text-lg font-bold text-white mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Shrnutí návrhu
        </h2>
        <div className="space-y-2 text-sm text-slate-300">
          <p>
            Při fiktivní ceně{" "}
            <strong className="text-vysv font-mono">
              {fmt(fixedClaim)} Kč
            </strong>{" "}
            Vlastimil dostane fixní nárok{" "}
            <strong className="text-vysv font-mono">
              {fmt(vClaim)} Kč
            </strong>{" "}
            z výtěžku prodeje + produkty{" "}
            <strong className="font-mono">{fmt(vProducts)} Kč</strong> ihned ={" "}
            <strong className="text-vysv font-mono">
              celkem {fmt(vTotal)} Kč
            </strong>
            .
          </p>
          <p>
            Bronislava při prodeji za 9 mil. dostane{" "}
            <strong className="font-mono">
              {fmt(
                9_000_000 - MORTGAGE_BALANCE_SJM - vClaim + PRODUCTS_HALF
              )}{" "}
              Kč
            </strong>{" "}
            &mdash;{" "}
            {9_000_000 - MORTGAGE_BALANCE_SJM - vClaim + PRODUCTS_HALF >=
            BRONISLAVA_DEMAND ? (
              <span className="text-green-400">
                víc než požadovala ({fmt(BRONISLAVA_DEMAND)})
              </span>
            ) : (
              <span className="text-amber-400">
                méně než požadovala ({fmt(BRONISLAVA_DEMAND)})
              </span>
            )}
            .
          </p>
          <p className="text-slate-400">
            Od podpisu dohody Vlastimil nehradí žádné náklady. Hypotéku hradí
            Bronislava. Pozemky parc. č. 2036/233 a 2036/16 ({fmt(PLOT_TOTAL)}{" "}
            m²) vloženy do vypořádání. Zpráva DEKPROJEKT povinná příloha kupní
            smlouvy. Lhůta na prodej 12 + 3 měsíce, poté dražba.
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="text-center text-[0.7rem] text-slate-600 py-4 space-y-1">
        <p>
          Orientační model. SJM hypotéka: {fmt(MORTGAGE_BALANCE_SJM)} Kč,{" "}
          {fmt(MORTGAGE_PAYMENT_SJM)}/měs., {MORTGAGE_RATE_SJM} % (fixace do
          12/2027)
        </p>
        <p>
          Finanční produkty: {fmt(PRODUCTS_TOTAL)} Kč (50/50) | Pozemek:{" "}
          {fmt(PLOT_TOTAL)} m² (výlučný majetek, vložen do SJM pro účely
          dohody)
        </p>
      </footer>
    </main>
  );
}
