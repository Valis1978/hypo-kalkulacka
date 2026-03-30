"use client";

import { useState } from "react";

/* ─── CONSTANTS ─── */
const MORTGAGE_BALANCE = 4_385_000;
const MORTGAGE_RATE = 1.89;
const MORTGAGE_PAYMENT = 23_335;
const PRODUCTS_TOTAL = 3_147_486;
const PRODUCTS_HALF = Math.round(PRODUCTS_TOTAL / 2);
const ASKING_PRICE = 12_980_000;
const REMAX_COMMISSION_PCT = 4.0;
const DPH_RATE = 1.21;
const PLOT_HOUSE = 3_000; // 2036/16 (2767) + 2036/233 (233)
const PLOT_OTHER = 4_290; // remaining 10 parcels

/* ─── HELPERS ─── */
const fmt = (n: number) => Math.round(n).toLocaleString("cs-CZ");
const fmtK = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1).replace(".", ",")} mil`;
  if (abs >= 1_000) return `${Math.round(n / 1_000)} tis`;
  return fmt(n);
};
const fmtPct = (n: number) => n.toFixed(1).replace(".", ",");

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
        ? `${fmtPct(value)} %`
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
  const [salePrice, setSalePrice] = useState(ASKING_PRICE);
  const [commissionPct, setCommissionPct] = useState(REMAX_COMMISSION_PCT);

  /* ─── CALC ─── */
  const commissionNet = Math.round(salePrice * (commissionPct / 100));
  const commissionWithDph = Math.round(commissionNet * DPH_RATE);
  const netAfterMortgage = salePrice - MORTGAGE_BALANCE;
  const netAfterAll = netAfterMortgage - commissionWithDph;
  const eachFromHouse = Math.round(netAfterAll / 2);
  const eachTotal = eachFromHouse + PRODUCTS_HALF;

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
          Prodej přes RE/MAX Permanentia, dělení 50/50
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
            hypotéka: zůstatek {fmt(MORTGAGE_BALANCE)} Kč, splátka{" "}
            {fmt(MORTGAGE_PAYMENT)} Kč/měs., sazba {MORTGAGE_RATE} %
            (fixace do konce 2027). V SJM jsou také finanční produkty v celkové
            hodnotě {fmt(PRODUCTS_TOTAL)} Kč.
          </p>
          <p>
            <strong className="text-white">Dohoda:</strong> Obě strany se
            dohodly na vypořádání SJM formou 50/50 &mdash; dům se prodá přes
            RE/MAX Permanentia (makléř Dušan Rouzek), z výtěžku se splatí
            hypotéka, odečte provize RK, a čistý zisk se rozdělí napůl.
            Finanční produkty se vypořádají zvlášť (½ každý).
          </p>
          <p>
            <strong className="text-white">Pozemky:</strong> Všechny nemovitosti
            jsou vedeny na LV 2572 jako výlučný majetek Vlastimila (kupní
            smlouva 2008). Zahrnují pozemek pod domem + zahradu (parc. 2036/16
            a 2036/233, celkem {fmt(PLOT_HOUSE)} m²) a dalších 10 parcel
            (pole, les, cesty &mdash; celkem {fmt(PLOT_OTHER)} m²), které jsou
            pro účely vypořádání vloženy do SJM a prodávají se jako celek.
          </p>
          <p>
            <strong className="text-white">RE/MAX:</strong> Výhradní smlouva
            o zprostředkování. Provize {fmtPct(REMAX_COMMISSION_PCT)} % + DPH
            (efektivně {fmtPct(REMAX_COMMISSION_PCT * DPH_RATE)} %).
            Požadovaná cena {fmt(ASKING_PRICE)} Kč. Smlouva do 30. 7. 2026.
            Advokátní úschova přes Mgr. Rotterovou.
          </p>
          <p>
            <strong className="text-white">Technický stav:</strong> Zpráva
            DEKPROJEKT (07/2025, 74 stran) identifikuje vady za 2,5&ndash;3,65
            mil. Kč bez DPH. Hlavní problémy: hydroizolace, střešní krytina pod
            minimálním sklonem, fasáda. Nosná konstrukce v pořádku.
          </p>
        </div>
      </details>

      {/* ═══ PRODEJ & DĚLENÍ ═══ */}
      <section className="card mb-5" style={{ borderColor: "var(--color-vysv-dim)" }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-vysv" />
          <h2 className="text-sm font-semibold text-vysv uppercase tracking-wider">
            Prodej &amp; dělení 50/50
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Slider
            label="Prodejní cena"
            value={salePrice}
            min={7_000_000}
            max={15_000_000}
            step={100_000}
            onChange={setSalePrice}
            accent="#22c55e"
          />
          <Slider
            label="Provize RE/MAX (bez DPH)"
            value={commissionPct}
            min={2.0}
            max={5.0}
            step={0.5}
            onChange={setCommissionPct}
            suffix="%"
            accent="#f59e0b"
          />
        </div>

        {/* Waterfall */}
        <div className="space-y-1 mb-4">
          <div className="row">
            <span className="row-label">Prodejní cena</span>
            <span className="font-mono font-bold text-white">{fmt(salePrice)} Kč</span>
          </div>
          <div className="row">
            <span className="row-label">− Splacení hypotéky</span>
            <span className="font-mono text-red-400">−{fmt(MORTGAGE_BALANCE)} Kč</span>
          </div>
          <div className="row">
            <span className="row-label">
              − Provize RE/MAX ({fmtPct(commissionPct)} % + 21 % DPH = {fmtPct(commissionPct * DPH_RATE)} %)
            </span>
            <span className="font-mono text-red-400">−{fmt(commissionWithDph)} Kč</span>
          </div>
          <div className="row !bg-surface-700/50">
            <span className="text-slate-200 font-medium">Čistý výtěžek k dělení</span>
            <span className={`font-mono font-bold ${netAfterAll >= 0 ? "text-vysv" : "text-red-400"}`}>
              {fmt(netAfterAll)} Kč
            </span>
          </div>
          <div className="row">
            <span className="row-label">÷ 2 (50/50)</span>
            <span className="font-mono text-white">{fmt(eachFromHouse)} Kč</span>
          </div>
          <div className="row">
            <span className="row-label">+ Finanční produkty (½ z {fmt(PRODUCTS_TOTAL)})</span>
            <span className="font-mono text-slate-300">+{fmt(PRODUCTS_HALF)} Kč</span>
          </div>
          <div className="row !bg-vysv/10 !border !border-vysv/30 !rounded-lg">
            <span className="text-vysv font-semibold">Každý dostane celkem</span>
            <span className="font-mono font-bold text-vysv text-lg">{fmt(eachTotal)} Kč</span>
          </div>
        </div>
      </section>

      {/* ═══ SROVNÁVACÍ TABULKA ═══ */}
      <section className="card mb-5" style={{ borderColor: "#3b82f630" }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full" style={{ background: "#3b82f6" }} />
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#3b82f6" }}>
            Scénáře dle prodejní ceny
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[0.7rem] text-slate-400 uppercase border-b border-surface-700">
                <th className="text-left py-2 px-3">Prodá za</th>
                <th className="text-center py-2 px-3">Provize RK</th>
                <th className="text-center py-2 px-3">Po hypo + RK</th>
                <th className="text-center py-2 px-3">Každý z domu</th>
                <th className="text-center py-2 px-3">+ produkty</th>
                <th className="text-center py-2 px-3 !text-vysv">Celkem každý</th>
              </tr>
            </thead>
            <tbody className="font-mono text-[0.8rem]">
              {[
                8_000_000, 9_000_000, 10_000_000, 11_000_000,
                ASKING_PRICE, 14_000_000,
              ].map((price) => {
                const comm = Math.round(price * (commissionPct / 100) * DPH_RATE);
                const net = price - MORTGAGE_BALANCE - comm;
                const each = Math.round(net / 2);
                const total = each + PRODUCTS_HALF;
                const isActive = price === salePrice || (price === ASKING_PRICE && salePrice === ASKING_PRICE);
                const isAsking = price === ASKING_PRICE;
                return (
                  <tr
                    key={price}
                    className={`border-b border-surface-800 ${isActive ? "bg-surface-800/50" : ""}`}
                  >
                    <td className="py-2 px-3 text-slate-300 font-sans">
                      {fmtK(price)}
                      {isAsking && (
                        <span className="ml-1.5 text-[0.6rem] text-amber-400 font-sans uppercase">
                          inzerát
                        </span>
                      )}
                    </td>
                    <td className="text-center py-2 px-3 text-red-400">
                      {fmt(comm)}
                    </td>
                    <td className={`text-center py-2 px-3 ${net >= 0 ? "text-slate-300" : "text-red-400"}`}>
                      {fmt(net)}
                    </td>
                    <td className="text-center py-2 px-3 text-white">
                      {fmt(each)}
                    </td>
                    <td className="text-center py-2 px-3 text-slate-500">
                      {fmt(PRODUCTS_HALF)}
                    </td>
                    <td className="text-center py-2 px-3 text-vysv font-bold">
                      {fmt(total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[0.75rem] text-slate-500 mt-3">
          Provize RE/MAX se počítá z&nbsp;reálné prodejní ceny, ne z&nbsp;inzerované.
          Hypotéka se splácí z&nbsp;kupní ceny přes advokátní úschovu (Mgr. Rotterová).
        </p>
      </section>

      {/* ═══ SHRNUTÍ ═══ */}
      <section className="card mb-5 !border-vysv/50 bg-vysv/5">
        <h2
          className="text-base md:text-lg font-bold text-white mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Shrnutí
        </h2>
        <div className="space-y-2 text-sm text-slate-300">
          <p>
            Při prodeji za{" "}
            <strong className="text-white font-mono">{fmt(salePrice)} Kč</strong>{" "}
            a provizi {fmtPct(commissionPct)} % + DPH ({fmt(commissionWithDph)} Kč)
            zbude po splacení hypotéky čistý výtěžek{" "}
            <strong className="text-vysv font-mono">{fmt(netAfterAll)} Kč</strong>.
          </p>
          <p>
            Každý dostane{" "}
            <strong className="text-vysv font-mono">{fmt(eachFromHouse)} Kč</strong>{" "}
            z domu + <strong className="font-mono">{fmt(PRODUCTS_HALF)} Kč</strong>{" "}
            finanční produkty ={" "}
            <strong className="text-vysv font-mono">celkem {fmt(eachTotal)} Kč</strong>.
          </p>
          <p className="text-slate-400">
            Výhradní smlouva RE/MAX Permanentia do 30. 7. 2026. Prodej zahrnuje
            dům + zahradu (parc. 2036/16 a 2036/233) a dalších 10 parcel
            (pole, les, cesty) z LV 2572. Advokátní úschova, PENB se zajistí.
          </p>
        </div>
      </section>

      {/* ═══ DETAIL SMLOUVY ═══ */}
      <details className="card-flush mb-5 group">
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
          Detail smlouvy RE/MAX
        </summary>
        <div className="px-5 pb-5 text-sm text-slate-400 space-y-2 border-t border-surface-700 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="row"><span className="row-label">Typ</span><span className="text-white">Výhradní zprostředkování</span></div>
            <div className="row"><span className="row-label">RK</span><span className="text-white">RE/MAX Permanentia (PERMANENTIA CZ s.r.o.)</span></div>
            <div className="row"><span className="row-label">Makléř</span><span className="text-white">Dušan Rouzek (602 501 559)</span></div>
            <div className="row"><span className="row-label">Asistentka</span><span className="text-white">Alena Rusňáková (603 940 856)</span></div>
            <div className="row"><span className="row-label">Požadovaná cena</span><span className="text-white font-mono">{fmt(ASKING_PRICE)} Kč</span></div>
            <div className="row"><span className="row-label">Provize</span><span className="text-white">{fmtPct(REMAX_COMMISSION_PCT)} % + DPH 21 %</span></div>
            <div className="row"><span className="row-label">Platnost do</span><span className="text-white">30. 7. 2026</span></div>
            <div className="row"><span className="row-label">Ochranná doba</span><span className="text-white">12 měsíců po skončení</span></div>
            <div className="row"><span className="row-label">Úschova</span><span className="text-white">Mgr. Michaela Rotterová (advokátní)</span></div>
            <div className="row"><span className="row-label">Odstupné při odmítnutí</span><span className="text-warn">1,5 % z ceny</span></div>
          </div>
        </div>
      </details>

      {/* ─── FOOTER ─── */}
      <footer className="text-center text-[0.7rem] text-slate-600 py-4 space-y-1">
        <p>
          Orientační kalkulačka. Hypotéka: {fmt(MORTGAGE_BALANCE)} Kč,{" "}
          {fmt(MORTGAGE_PAYMENT)}/měs., {MORTGAGE_RATE} % (fixace do 12/2027)
        </p>
        <p>
          Finanční produkty: {fmt(PRODUCTS_TOTAL)} Kč (50/50) |
          Pozemky: {fmt(PLOT_HOUSE + PLOT_OTHER)} m² celkem z LV 2572
        </p>
      </footer>
    </main>
  );
}
