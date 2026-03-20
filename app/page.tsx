"use client";

import { useState, useMemo } from "react";

/* ─── CONSTANTS ─── */
const MORTGAGE_BALANCE_SJM = 4_385_000;
const MORTGAGE_RATE_SJM = 1.89;
const MORTGAGE_PAYMENT_SJM = 23_335;
const MORTGAGE_BALANCE_KUCERA = 4_400_000;
const MORTGAGE_PAYMENT_KUCERA = 29_622;
const MORTGAGE_RATE_KUCERA = 4.45;
const PRODUCTS_TOTAL = 3_147_486;
const PRODUCTS_HALF = Math.round(PRODUCTS_TOTAL / 2);
const PLOT_TOTAL = 2_999;

/* ─── HELPERS ─── */
const fmt = (n: number) => Math.round(n).toLocaleString("cs-CZ");
const fmtK = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".", ",")} mil`;
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
          : suffix === "m2"
            ? `${fmt(value)} m²`
            : suffix === "Kč/m²"
              ? `${fmt(value)} Kč/m²`
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

/* ─── ROW ─── */
function Row({
  label,
  value,
  color = "text-white",
  bold,
  border,
  sub,
}: {
  label: string;
  value: string;
  color?: string;
  bold?: boolean;
  border?: boolean;
  sub?: string;
}) {
  return (
    <>
      <div
        className={`row ${border ? "border-t border-surface-700 mt-1 pt-2" : ""}`}
      >
        <span className={`row-label ${bold ? "text-white font-medium" : ""}`}>
          {label}
        </span>
        <span
          className={`${color} ${bold ? "font-bold" : "font-medium"} font-mono text-[0.85rem]`}
        >
          {value}
        </span>
      </div>
      {sub && (
        <div className="px-3 -mt-0.5 mb-1">
          <span className="text-[0.7rem] text-slate-500">{sub}</span>
        </div>
      )}
    </>
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
  /* ─── STATE: shared ─── */
  const [energy, setEnergy] = useState(8_000);

  /* ─── STATE: vysvobození ─── */
  const [fixedClaim, setFixedClaim] = useState(7_000_000);

  /* ─── STATE: kučera flip ─── */
  const [buyPrice, setBuyPrice] = useState(8_000_000);
  const [houseAsIsNoSplit, setHouseAsIsNoSplit] = useState(7_500_000);
  const [monthsToSell, setMonthsToSell] = useState(9);
  const [kuceraInterestRate, setKuceraInterestRate] = useState(5);
  const [kuceraProfit, setKuceraProfit] = useState(10);
  const [rkPct, setRkPct] = useState(4);

  /* ─── STATE: court scenario ─── */
  const [courtHouseValue, setCourtHouseValue] = useState(6_000_000);
  const [courtMonths, setCourtMonths] = useState(30);
  const [courtLawyerMonthly, setCourtLawyerMonthly] = useState(8_000);

  /* ─── CALC: vysvobození ─── */
  const vClaim = Math.max(
    0,
    Math.round((fixedClaim - MORTGAGE_BALANCE_SJM) / 2)
  );
  const vProducts = PRODUCTS_HALF;
  const vTotal = vClaim + vProducts;

  /* ─── CALC: kučera flip ─── */
  const kf = useMemo(() => {
    const bronislavShare = Math.round(
      (buyPrice - MORTGAGE_BALANCE_SJM) / 2
    );
    const cashOutOfPocket = bronislavShare;

    /* Proper declining-balance amortization */
    let remaining = MORTGAGE_BALANCE_KUCERA;
    let totalInterest = 0;
    let totalPrincipal = 0;
    for (let i = 0; i < monthsToSell; i++) {
      const mi = remaining * (MORTGAGE_RATE_KUCERA / 100 / 12);
      const mp = MORTGAGE_PAYMENT_KUCERA - mi;
      totalInterest += mi;
      totalPrincipal += mp;
      remaining -= mp;
    }
    const mortgageRemaining = Math.round(remaining);
    totalInterest = Math.round(totalInterest);
    totalPrincipal = Math.round(totalPrincipal);

    /* First-month values for display */
    const firstMonthInterest = Math.round(
      MORTGAGE_BALANCE_KUCERA * (MORTGAGE_RATE_KUCERA / 100 / 12)
    );
    const firstMonthPrincipal = MORTGAGE_PAYMENT_KUCERA - firstMonthInterest;

    /* Cash interest */
    const monthlyCashInterest = Math.round(
      cashOutOfPocket * (kuceraInterestRate / 100 / 12)
    );
    const monthlyTotal =
      MORTGAGE_PAYMENT_KUCERA + energy + monthlyCashInterest;

    /* Kučera's total real running costs (what he actually pays out monthly) */
    const totalRunningCosts = monthlyTotal * monthsToSell;

    /* Revenue — always selling as whole (plot split removed — zone 14c = garden, no building allowed) */
    const houseRevenue = houseAsIsNoSplit;
    const rkTotal = Math.round(houseRevenue * (rkPct / 100));
    const netRevenue = houseRevenue - rkTotal;

    /* Available after mortgage payoff */
    const availableFromSale = netRevenue - mortgageRemaining;

    /* Kučera reimbursement */
    const energyCostTotal = energy * monthsToSell;
    const cashInterestTotal = monthlyCashInterest * monthsToSell;
    const kuceraReimbursement =
      cashOutOfPocket + cashInterestTotal + energyCostTotal + totalInterest;

    /* Surplus */
    const surplus = availableFromSale - kuceraReimbursement;
    const kuceraShare =
      surplus > 0 ? Math.round(surplus * (kuceraProfit / 100)) : 0;
    const vlastimilFromFlip =
      surplus > 0 ? surplus - kuceraShare : surplus;

    const vlastimilTotal = vlastimilFromFlip + PRODUCTS_HALF;

    /* Old mortgage comparison */
    const sjmFirstInterest = Math.round(
      MORTGAGE_BALANCE_SJM * (MORTGAGE_RATE_SJM / 100 / 12)
    );
    const sjmFirstPrincipal = MORTGAGE_PAYMENT_SJM - sjmFirstInterest;
    let sjmRemaining = MORTGAGE_BALANCE_SJM;
    let sjmTotalInterest = 0;
    for (let i = 0; i < monthsToSell; i++) {
      const mi = sjmRemaining * (MORTGAGE_RATE_SJM / 100 / 12);
      sjmTotalInterest += mi;
      sjmRemaining -= MORTGAGE_PAYMENT_SJM - mi;
    }
    sjmTotalInterest = Math.round(sjmTotalInterest);
    const interestDifference = totalInterest - sjmTotalInterest;

    return {
      bronislavShare,
      cashOutOfPocket,
      firstMonthInterest,
      firstMonthPrincipal,
      monthlyCashInterest,
      monthlyTotal,
      totalRunningCosts,
      totalInterest,
      totalPrincipal,
      mortgageRemaining,
      houseRevenue,
      rkTotal,
      netRevenue,
      availableFromSale,
      energyCostTotal,
      cashInterestTotal,
      kuceraReimbursement,
      surplus,
      kuceraShare,
      vlastimilFromFlip,
      vlastimilTotal,
      sjmFirstInterest,
      sjmFirstPrincipal,
      sjmTotalInterest,
      interestDifference,
    };
  }, [
    buyPrice,
    houseAsIsNoSplit,
    monthsToSell,
    kuceraInterestRate,
    kuceraProfit,
    rkPct,
    energy,
  ]);

  const diff = kf.vlastimilTotal - vTotal;
  const diffPerMonth =
    diff !== 0 ? Math.round(diff / monthsToSell) : 0;

  /* ─── CALC: court scenario ─── */
  const courtHalfHouse = Math.round(courtHouseValue / 2);
  const courtHalfMortgage = Math.round(MORTGAGE_BALANCE_SJM / 2);
  const courtClaimFromHouse = courtHalfHouse - courtHalfMortgage;
  const courtMonthlyCost = Math.round(MORTGAGE_PAYMENT_SJM / 2 + energy + courtLawyerMonthly);
  const courtTotalCost = courtMonthlyCost * courtMonths;
  const courtProducts = PRODUCTS_HALF;
  const courtNet = courtClaimFromHouse + courtProducts - courtTotalCost;

  /* Bronislava at court */
  const courtBronislavaFromHouse = courtClaimFromHouse; // same half
  const courtBronislavaTotal = courtBronislavaFromHouse + courtProducts - courtTotalCost;

  /* ─── STATE: Bronislava interactive sale price ─── */
  const [bronislavaSalePrice, setBronislavaSalePrice] = useState(9_000_000);
  const bronislavaFromHouse = bronislavaSalePrice - MORTGAGE_BALANCE_SJM - vClaim;
  const bronislavaTotal = bronislavaFromHouse + PRODUCTS_HALF;

  /* ═══════════════════════ RENDER ═══════════════════════ */
  return (
    <main className="max-w-6xl mx-auto px-3 py-6 md:px-6 md:py-10">
      {/* ─── HEADER ─── */}
      <header className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold text-white mb-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          K Cihelně 733
        </h1>
        <p className="text-slate-400 text-sm">
          Rozhodovací kalkulačka &mdash; Vysvobození vs. Kučera Flip
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
            <strong className="text-white">Pozemek (ústupek):</strong> Pozemek pod domem
            a zahrada (celkem {fmt(PLOT_TOTAL)} m², parcely 2036/16 a 2036/233) jsou výlučným vlastnictvím
            Vlastimila &mdash; nespadají do SJM. U soudu by se oceňoval &bdquo;dům na cizím pozemku&ldquo;,
            což výrazně snižuje jeho tržní hodnotu. V rámci smírného řešení se Vlastimil vzdává tohoto
            zvýhodnění a pozemek vkládá do SJM pro účely vypořádání.
            Dle územního plánu Vacenovic je zadní část pozemku v zóně <strong>14c &mdash; Zahrady</strong> (nepřípustná
            zástavba), proto nelze pozemek rozdělit na stavební parcelu. Prodává se vždy jako celek.
          </p>
          <p>
            <strong className="text-white">Technický stav:</strong> Zpráva
            DEKPROJEKT (07/2025, 74 stran) identifikuje vady za 2,5&ndash;3,65
            mil. Kč bez DPH. Hlavní problémy: hydroizolace, střešní krytina pod
            minimálním sklonem, fasáda. Nosná konstrukce v pořádku.
          </p>
          <p>
            <strong className="text-white">Petr Kučera:</strong> Známý
            Vlastimila, původně nabízel 9 mil. Kč. Po prostudování zprávy
            DEKPROJEKT se ochota snížila. Pokud do transakce jde, jedná se de
            facto o formu půjčky &mdash; Kučera by koupil dům, přebral/nahradil
            hypotéku, vyplatil Bronislavu, a Vlastimilův podíl by se stal jeho
            dluhem vůči Kučerovi. Kučerova nová hypotéka by byla za aktuální
            tržní sazbu ~{MORTGAGE_RATE_KUCERA} % (výrazně horší než stávající{" "}
            {MORTGAGE_RATE_SJM} %).
          </p>
          <p>
            <strong className="text-white">Vysvobození:</strong> Vlastimil si
            stanoví fixní nárok (½ z dohodnuté ceny minus hypotéka) a přenechá
            prodej kompletně Bronislavě. Od podpisu dohody nehradí žádné
            náklady spojené s domem. Finanční produkty se vypořádají okamžitě
            (každý svou polovinu). Svůj fixní nárok z domu Vlastimil obdrží
            z výtěžku prodeje &mdash; vše nad jeho nárok je Bronislavy, ale
            riziko nižší ceny nese ona.
          </p>
          <p>
            <strong className="text-white">Časový rámec prodeje:</strong> Na
            prodej v režii Bronislavy je stanovena lhůta{" "}
            <strong>12 měsíců</strong> od podpisu dohody. Pokud v této lhůtě
            nedojde k prodeji, je Bronislava povinna přistoupit k prodeji za
            nejlepší aktuální nabídku, případně svěřit prodej RK s mandátem
            prodat za tržní cenu v další lhůtě <strong>3 měsíců</strong>. Pokud
            ani po 15 měsících nedojde k prodeji (žádná nabídka), bude
            nemovitost prodána formou{" "}
            <strong>veřejné dobrovolné dražby</strong> organizované nezávislým
            dražebníkem, přičemž vyvolávací cena bude stanovena znaleckým
            posudkem. Výtěžek se rozdělí dle dohody (fixní nárok + hypotéka).
          </p>
          <p className="text-[0.75rem] text-slate-500 border-t border-surface-700 pt-3">
            Všechny částky orientační. Zdroje: odhad RE/MAX Valuo (02/2026),
            CenováMapa.cz, zpráva DEKPROJEKT (07/2025), přípisy AK Švecová a AK
            Mandilas (02/2026).
          </p>
        </div>
      </details>

      {/* ═══ VYSVOBOZENÍ ═══ */}
      <section className="card mb-5" style={{ borderColor: "var(--color-vysv-dim)" }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-vysv" />
          <h2 className="text-sm font-semibold text-vysv uppercase tracking-wider">
            Vysvobození &mdash; parametry
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
              Tvůj fixní nárok: ½ &times; ({fmt(fixedClaim)} &minus;{" "}
              {fmt(MORTGAGE_BALANCE_SJM)})
            </span>
            <span className="text-lg font-bold text-vysv font-mono">
              {fmt(vClaim)} Kč
            </span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Stat
            label="Fixní nárok z domu (po prodeji)"
            value={`${fmt(vClaim)} Kč`}
            color="text-vysv"
            sub="Dostaneš až Bronislava prodá"
          />
          <Stat
            label="Finanční produkty (ihned)"
            value={`${fmt(vProducts)} Kč`}
            color="text-vysv"
            sub="Vypořádání okamžitě při podpisu"
          />
        </div>
      </section>

      {/* ═══ KUČERA FLIP PARAMS ═══ */}
      <section className="card mb-5" style={{ borderColor: "var(--color-flip-dim)" }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-flip" />
          <h2 className="text-sm font-semibold text-flip uppercase tracking-wider">
            Kučera Flip &mdash; parametry
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
          <Slider label="Kupní cena" value={buyPrice} min={6_500_000} max={9_000_000} step={250_000} onChange={setBuyPrice} accent="#3b82f6" />
          <Slider label="Prodejní cena (dům + pozemek)" value={houseAsIsNoSplit} min={5_000_000} max={10_000_000} step={250_000} onChange={setHouseAsIsNoSplit} accent="#3b82f6" />
          <Slider label="Měsíce do prodeje" value={monthsToSell} min={3} max={24} step={1} onChange={setMonthsToSell} suffix="m" accent="#3b82f6" />
          <Slider label="Úrok Kučerovi (na cash)" value={kuceraInterestRate} min={0} max={10} step={0.5} onChange={setKuceraInterestRate} suffix="%" accent="#3b82f6" />
          <Slider label="Kučerův podíl na zisku" value={kuceraProfit} min={0} max={30} step={5} onChange={setKuceraProfit} suffix="%" accent="#3b82f6" />
          <Slider label="RK provize" value={rkPct} min={0} max={5} step={0.5} onChange={setRkPct} suffix="%" accent="#3b82f6" />
        </div>
        <div className="mt-3 bg-surface-800 rounded-lg p-3 flex items-center gap-2">
          <span className="text-xs text-slate-400">
            ⚠️ Pozemek nelze rozdělit &mdash; zahrada (zóna 14c ÚP) nepřipouští zástavbu. Prodává se vždy celý komplex dům + {fmt(PLOT_TOTAL)} m².
          </span>
        </div>
      </section>

      {/* ═══ KUČERA FLIP MECHANICS ═══ */}
      <section className="card mb-5" style={{ borderColor: "var(--color-flip-dim)" }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-flip" />
          <h2 className="text-sm font-semibold text-flip uppercase tracking-wider">
            Kučera Flip &mdash; mechanika
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* LEFT — Monthly debt */}
          <div className="space-y-4">
            <div>
              <div className="text-[0.7rem] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Měsíční náklady (1. měsíc)
              </div>
              <div className="space-y-0.5">
                <Row label="Splátka hypotéky" value={`${fmt(MORTGAGE_PAYMENT_KUCERA)} Kč`} color="text-red-400" />
                <Row label="Energie" value={`${fmt(energy)} Kč`} color="text-red-400" />
                <Row label={`Úrok z cashe (${kuceraInterestRate} %)`} value={`${fmt(kf.monthlyCashInterest)} Kč`} color="text-red-400" />
                <Row label="Celkem měsíčně" value={`${fmt(kf.monthlyTotal)} Kč`} color="text-red-400" bold border />
              </div>
            </div>
            <div>
              <div className="text-[0.7rem] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Co Kučera dává do hry
              </div>
              <div className="space-y-0.5">
                <Row label="Hypotéka (přebírá úvěr)" value={`${fmt(MORTGAGE_BALANCE_KUCERA)} Kč`} color="text-amber-400" sub="Splatí se z prodeje — vrací se mu" />
                <Row label="Cash vyplacený Bronislavě" value={`${fmt(kf.cashOutOfPocket)} Kč`} color="text-amber-400" sub="Z vlastní kapsy — chce zpět z prodeje" />
                <Row label={`Splátky hypo za ${monthsToSell} měs.`} value={`${fmt(MORTGAGE_PAYMENT_KUCERA * monthsToSell)} Kč`} color="text-amber-400" sub={`Z toho jistina ${fmt(kf.totalPrincipal)} (snižuje zůstatek) + úroky ${fmt(kf.totalInterest)} (ztracené)`} />
                <Row label={`Energie (${monthsToSell} × ${fmt(energy)})`} value={`${fmt(kf.energyCostTotal)} Kč`} color="text-amber-400" />
                <Row label={`Úrok z cashe (${kuceraInterestRate} %, ${monthsToSell} měs.)`} value={`${fmt(kf.cashInterestTotal)} Kč`} color="text-amber-400" />
                <Row label="Celkem Kučera investoval" value={`${fmt(MORTGAGE_BALANCE_KUCERA + kf.cashOutOfPocket + kf.totalRunningCosts)} Kč`} color="text-red-400" bold border />
                <Row label="Z toho se vrátí z prodeje" value={`${fmt(MORTGAGE_BALANCE_KUCERA + kf.totalPrincipal)} Kč`} color="text-green-400" sub={`Hypo zůstatek ${fmt(kf.mortgageRemaining)} + splacená jistina ${fmt(kf.totalPrincipal)}`} />
                <Row label="Z toho ztracené náklady" value={`${fmt(kf.totalInterest + kf.energyCostTotal + kf.cashInterestTotal)} Kč`} color="text-red-400" sub="Úroky bance + energie + úrok z cashe — chce kompenzovat" />
              </div>
            </div>
          </div>

          {/* RIGHT — Sale proceeds */}
          <div className="space-y-4">
            <div>
              <div className="text-[0.7rem] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Amortizace hypotéky ({monthsToSell} měs.)
              </div>
              <div className="space-y-0.5">
                <Row label="1. splátka = úrok + jistina" value={`${fmt(kf.firstMonthInterest)} + ${fmt(kf.firstMonthPrincipal)}`} />
                <Row label={`Splacená jistina za ${monthsToSell} měs.`} value={`${fmt(kf.totalPrincipal)} Kč`} color="text-green-400" />
                <Row label="Zaplacené úroky bance" value={`${fmt(kf.totalInterest)} Kč`} color="text-red-400" />
                <Row label="Zůstatek hypotéky při prodeji" value={`${fmt(kf.mortgageRemaining)} Kč`} color="text-amber-400" bold border sub={`(z původních ${fmt(MORTGAGE_BALANCE_KUCERA)} — splaceno ${fmt(MORTGAGE_BALANCE_KUCERA - kf.mortgageRemaining)} na jistině)`} />
              </div>
            </div>
            <div>
              <div className="text-[0.7rem] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Příjmy z prodeje (dům + celý pozemek)
              </div>
              <div className="space-y-0.5">
                <Row label="Dům + celý pozemek" value={`${fmt(kf.houseRevenue)} Kč`} color="text-green-400" />
                <Row label={`RK ${rkPct} %`} value={`−${fmt(kf.rkTotal)} Kč`} color="text-red-400" />
                <Row label="Čistý příjem" value={`${fmt(kf.netRevenue)} Kč`} color="text-green-400" bold border />
              </div>
            </div>
            <div>
              <div className="text-[0.7rem] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Po splacení hypotéky
              </div>
              <div className="space-y-0.5">
                <Row label="Čistý příjem z prodeje" value={`${fmt(kf.netRevenue)} Kč`} color="text-green-400" />
                <Row label="Splacení hypotéky (zůstatek)" value={`−${fmt(kf.mortgageRemaining)} Kč`} color="text-red-400" />
                <Row label="Dostupné" value={`${fmt(kf.availableFromSale)} Kč`} color={kf.availableFromSale >= 0 ? "text-green-400" : "text-red-400"} bold border />
              </div>
            </div>
            <div>
              <div className="text-[0.7rem] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Kučera potřebuje zpět
              </div>
              <div className="space-y-0.5">
                <Row label="Cash za Bronislavu" value={`${fmt(kf.cashOutOfPocket)} Kč`} color="text-red-400" />
                <Row label={`Úrok z cashe (${kuceraInterestRate} %, ${monthsToSell} měs.)`} value={`${fmt(kf.cashInterestTotal)} Kč`} color="text-red-400" />
                <Row label={`Úroky z hypotéky bance (${monthsToSell} měs.)`} value={`${fmt(kf.totalInterest)} Kč`} color="text-red-400" />
                <Row label={`Energie (${monthsToSell} × ${fmt(energy)})`} value={`${fmt(kf.energyCostTotal)} Kč`} color="text-red-400" />
                <Row label="Kučera celkem zpět" value={`${fmt(kf.kuceraReimbursement)} Kč`} color="text-red-400" bold border sub={`Jistina hypotéky ${fmt(kf.totalPrincipal)} se vrátila přes nižší zůstatek — není náklad`} />
              </div>
            </div>
          </div>
        </div>

        {/* Surplus cards */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <Stat
            label="Přebytek / deficit"
            value={`${kf.surplus >= 0 ? "+" : ""}${fmt(kf.surplus)} Kč`}
            color={kf.surplus >= 0 ? "text-green-400" : "text-red-400"}
            sub="Po splacení Kučery"
          />
          <Stat
            label={`Kučerův zisk (${kuceraProfit} %)`}
            value={`${fmt(kf.kuceraShare)} Kč`}
            color="text-blue-400"
          />
          <Stat
            label="Vlastimil z flipu"
            value={`${fmt(kf.vlastimilFromFlip)} Kč`}
            color={kf.vlastimilFromFlip >= 0 ? "text-green-400" : "text-red-400"}
          />
        </div>
        {kf.surplus < 0 && (
          <div className="mt-3 bg-danger/10 border border-danger/30 rounded-lg p-3 text-sm text-red-300">
            <strong>Flip nepokryje ani Kučerovy náklady.</strong> Deficit{" "}
            {fmt(Math.abs(kf.surplus))} Kč. Prodej by se musel realizovat za
            vyšší cenu, nebo Vlastimil zůstane v dluhu.
          </div>
        )}
      </section>

      {/* ═══ MORTGAGE COMPARISON ═══ */}
      <section className="card mb-5" style={{ borderColor: "var(--color-warn-dim)" }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-warn" />
          <h2 className="text-sm font-semibold text-warn uppercase tracking-wider">
            Srovnání hypoték &mdash; proč flip ničí výhodnou sazbu
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[0.7rem] text-slate-400 uppercase border-b border-surface-700">
                <th className="text-left py-2 pr-3" />
                <th className="text-center py-2 px-3 text-green-400">
                  Stará SJM ({MORTGAGE_RATE_SJM} %)
                </th>
                <th className="text-center py-2 px-3 text-red-400">
                  Kučerova nová ({MORTGAGE_RATE_KUCERA} %)
                </th>
                <th className="text-center py-2 px-3 text-amber-400">
                  Rozdíl
                </th>
              </tr>
            </thead>
            <tbody className="font-mono text-[0.85rem]">
              <tr className="border-b border-surface-800">
                <td className="py-2 pr-3 text-slate-400 font-sans">Úrok / měs. (1. splátka)</td>
                <td className="text-center py-2 text-green-400">{fmt(kf.sjmFirstInterest)}</td>
                <td className="text-center py-2 text-red-400">{fmt(kf.firstMonthInterest)}</td>
                <td className="text-center py-2 text-amber-400">+{fmt(kf.firstMonthInterest - kf.sjmFirstInterest)}</td>
              </tr>
              <tr className="border-b border-surface-800">
                <td className="py-2 pr-3 text-slate-400 font-sans">Jistina / měs. (1. splátka)</td>
                <td className="text-center py-2 text-green-400">{fmt(kf.sjmFirstPrincipal)}</td>
                <td className="text-center py-2 text-red-400">{fmt(kf.firstMonthPrincipal)}</td>
                <td className="text-center py-2 text-amber-400">{fmt(kf.firstMonthPrincipal - kf.sjmFirstPrincipal)}</td>
              </tr>
              <tr className="bg-surface-800/50">
                <td className="py-2 pr-3 text-white font-sans font-medium">Celkem úroky za {monthsToSell} měs.</td>
                <td className="text-center py-2 text-green-400 font-bold">{fmt(kf.sjmTotalInterest)}</td>
                <td className="text-center py-2 text-red-400 font-bold">{fmt(kf.totalInterest)}</td>
                <td className="text-center py-2 text-amber-400 font-bold">+{fmt(kf.interestDifference)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[0.75rem] text-slate-500 mt-3">
          Stará hypotéka má fixaci do konce 2027. Flip tuto výhodu okamžitě
          zničí &mdash; za {monthsToSell} měsíců zaplatíte na úrocích o{" "}
          <strong className="text-amber-400">{fmt(kf.interestDifference)} Kč víc</strong>.
          Ve Vysvobození si Bronislava nízkou sazbu ponechá.
        </p>
      </section>

      {/* ═══ MAIN COMPARISON TABLE ═══ */}
      <section className="card-flush overflow-hidden mb-5" style={{ borderColor: "var(--color-warn-dim)", borderWidth: "2px" }}>
        <div className="px-5 py-4">
          <h2
            className="text-lg font-bold text-warn"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Srovnání &mdash; co dostaneš
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[0.7rem] uppercase border-b border-surface-600 bg-surface-800/50">
                <th className="text-left py-2.5 px-4" />
                <th className="text-center py-2.5 px-3 text-vysv font-bold">
                  Vysvobození
                  <br />
                  <span className="font-normal text-[0.65rem] normal-case text-slate-400">
                    (z {fmtK(fixedClaim)})
                  </span>
                </th>
                <th className="text-center py-2.5 px-3 text-flip font-bold">
                  Kučera Flip
                  <br />
                  <span className="font-normal text-[0.65rem] normal-case text-slate-400">
                    (koupí za {fmtK(buyPrice)})
                  </span>
                </th>
                <th className="text-center py-2.5 px-3 text-slate-400 font-bold">
                  Soud
                </th>
              </tr>
            </thead>
            <tbody className="font-mono text-[0.85rem]">
              <tr className="border-b border-surface-800">
                <td className="py-2.5 px-4 text-slate-400 font-sans">Z domu</td>
                <td className="text-center py-2.5 px-3 text-vysv">
                  {fmt(vClaim)}
                  <div className="text-[0.6rem] text-slate-500 font-sans">po prodeji</div>
                </td>
                <td className="text-center py-2.5 px-3 text-flip">{fmt(kf.vlastimilFromFlip)}</td>
                <td className="text-center py-2.5 px-3 text-red-400">{fmt(courtClaimFromHouse)}</td>
              </tr>
              <tr className="border-b border-surface-800">
                <td className="py-2.5 px-4 text-slate-400 font-sans">Finanční produkty</td>
                <td className="text-center py-2.5 px-3">
                  {fmt(vProducts)}
                  <div className="text-[0.6rem] text-slate-500 font-sans">ihned</div>
                </td>
                <td className="text-center py-2.5 px-3">{fmt(PRODUCTS_HALF)}</td>
                <td className="text-center py-2.5 px-3">{fmt(PRODUCTS_HALF)}</td>
              </tr>
              <tr className="border-b border-surface-800">
                <td className="py-2.5 px-4 text-slate-400 font-sans">Pozemek (ústupek)</td>
                <td className="text-center py-2.5 px-3 text-amber-400 font-sans text-[0.75rem]">
                  vložen do SJM
                  <div className="text-[0.6rem] text-slate-500">výlučný majetek → vzdáváš se</div>
                </td>
                <td className="text-center py-2.5 px-3 text-amber-400 font-sans text-[0.75rem]">
                  v ceně domu
                </td>
                <td className="text-center py-2.5 px-3 text-green-400 font-sans text-[0.75rem]">
                  NECHÁVÁŠ SI
                  <div className="text-[0.6rem] text-slate-500">dům na cizím pozemku</div>
                </td>
              </tr>
              <tr className="border-b border-surface-800">
                <td className="py-2.5 px-4 text-slate-400 font-sans">Náklady za dobu trvání</td>
                <td className="text-center py-2.5 px-3 text-vysv font-bold font-sans">0 Kč</td>
                <td className="text-center py-2.5 px-3 text-amber-400 font-sans">{fmt(kf.monthlyTotal * monthsToSell)}</td>
                <td className="text-center py-2.5 px-3 text-red-400 font-sans">{fmt(courtTotalCost)}</td>
              </tr>
              <tr className="border-b border-surface-800 bg-surface-800/40">
                <td className="py-2.5 px-4 text-white font-sans font-bold">Celkem v ruce</td>
                <td className="text-center py-2.5 px-3 text-vysv font-bold text-base">
                  {fmt(vTotal)}
                </td>
                <td className="text-center py-2.5 px-3 text-flip font-bold text-base">
                  {fmt(kf.vlastimilTotal)}
                </td>
                <td className="text-center py-2.5 px-3 text-red-400 font-bold text-base">
                  {fmt(courtNet)}
                </td>
              </tr>
              <tr className="border-b border-surface-800">
                <td className="py-2.5 px-4 text-slate-400 font-sans">Měsíční náklady</td>
                <td className="text-center py-2.5 px-3 text-vysv font-bold font-sans">0 Kč</td>
                <td className="text-center py-2.5 px-3 text-amber-400 font-sans">{fmt(kf.monthlyTotal)}/měs.</td>
                <td className="text-center py-2.5 px-3 text-red-400 font-sans">{fmt(courtMonthlyCost)}/měs.</td>
              </tr>
              <tr className="border-b border-surface-800">
                <td className="py-2.5 px-4 text-slate-400 font-sans">Čas</td>
                <td className="text-center py-2.5 px-3 text-vysv font-sans">Měsíce (prodej Br.)</td>
                <td className="text-center py-2.5 px-3 text-amber-400 font-sans">{monthsToSell} měs.</td>
                <td className="text-center py-2.5 px-3 text-red-400 font-sans">{courtMonths} měs.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 text-slate-400 font-sans">Riziko</td>
                <td className="text-center py-2.5 px-3 text-vysv font-sans">Nulové</td>
                <td className="text-center py-2.5 px-3 text-amber-400 font-sans">Střední&ndash;vysoké</td>
                <td className="text-center py-2.5 px-3 text-red-400 font-sans">Vysoké</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ═══ VERDICT ═══ */}
      <section
        className={`card mb-5 ${
          diff > 200_000
            ? "!border-flip/50 bg-flip/5"
            : diff > 0
              ? "!border-vysv/50 bg-vysv/5"
              : "!border-vysv/50 bg-vysv/5"
        }`}
      >
        <h2
          className="text-base md:text-lg font-bold text-white mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {diff > 200_000
            ? `Flip ti vynese o ${fmt(diff)} Kč víc. Stojí ti to za ${monthsToSell} měsíců?`
            : diff > 0
              ? `Flip ti vynese o ${fmt(diff)} Kč víc — za ${monthsToSell} měsíců práce a rizika.`
              : `Vysvobození je lepší i na penězích. Flip prodělává.`}
        </h2>
        <p className="text-sm text-slate-300">
          {diff > 0 ? (
            <>
              To je{" "}
              <strong className="text-white font-mono">
                {fmt(diffPerMonth)} Kč/měs.
              </strong>{" "}
              za tvůj čas, stres a riziko. Kučera riskuje{" "}
              {fmtK(kf.cashOutOfPocket)} cash + {fmtK(MORTGAGE_BALANCE_KUCERA)}{" "}
              na hypotéce za profit {fmt(kf.kuceraShare)} Kč.
              {diff <= 200_000 && (
                <strong className="text-amber-400">
                  {" "}
                  Rozdíl je příliš malý na to, aby ospravedlnil riziko.
                </strong>
              )}
            </>
          ) : (
            <>
              Flip generuje{" "}
              <strong className="text-red-400">
                ztrátu {fmt(Math.abs(diff))} Kč
              </strong>{" "}
              oproti Vysvobození. Kučera navíc riskuje svůj kapitál. Nemá to
              ekonomický smysl.
            </>
          )}
        </p>
        {kf.surplus < 0 && (
          <p className="text-sm text-red-400 font-medium mt-2">
            Flip nepokryje ani Kučerovy náklady — deficit{" "}
            {fmt(Math.abs(kf.surplus))} Kč. Vlastimil zůstává dlužníkem.
          </p>
        )}
      </section>

      {/* ═══ COURT SCENARIO PARAMS ═══ */}
      <section className="card mb-5" style={{ borderColor: "var(--color-danger-dim)" }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-danger" />
          <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider">
            Soud &mdash; parametry
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
          <Slider label="Znalecký odhad domu (na cizím pozemku)" value={courtHouseValue} min={4_000_000} max={8_000_000} step={250_000} onChange={setCourtHouseValue} accent="#ef4444" />
          <Slider label="Délka soudu" value={courtMonths} min={12} max={48} step={3} onChange={setCourtMonths} suffix="m" accent="#ef4444" />
          <Slider label="Právnička měsíčně" value={courtLawyerMonthly} min={3_000} max={15_000} step={1_000} onChange={setCourtLawyerMonthly} accent="#ef4444" />
        </div>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="½ domu − ½ hypotéky" value={`${fmt(courtClaimFromHouse)} Kč`} color={courtClaimFromHouse >= 0 ? "text-green-400" : "text-red-400"} sub={`½ × ${fmtK(courtHouseValue)} − ½ × ${fmtK(MORTGAGE_BALANCE_SJM)}`} />
          <Stat label={`Náklady (${courtMonths} měs.)`} value={`−${fmt(courtTotalCost)} Kč`} color="text-red-400" sub={`${fmt(courtMonthlyCost)}/měs. (½ hypo + energie + právník)`} />
          <Stat label="Produkty" value={`${fmt(courtProducts)} Kč`} color="text-slate-300" />
          <Stat label="Čistá pozice" value={`${fmt(courtNet)} Kč`} color={courtNet >= 0 ? "text-green-400" : "text-red-400"} sub="Ale pozemek ti zůstane" />
        </div>
        <p className="text-[0.75rem] text-slate-500 mt-3">
          U soudu se oceňuje <strong className="text-slate-300">dům na cizím pozemku</strong> (tvůj pozemek nespadá do SJM).
          Znalec ocení stavbu výrazně níž než celý komplex. Pozemek ti zůstane &mdash; ale je pod domem (zamčené aktivum).
          Hypotéka je dle judikatury společný dluh 50/50. Soud trvá 1&ndash;4 roky, celou dobu platíš.
        </p>
      </section>

      {/* ═══ BRONISLAVA PERSPECTIVE — INTERACTIVE ═══ */}
      <section className="card mb-5" style={{ borderColor: "var(--color-surface-600)" }}>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Pohled Bronislavy &mdash; co dostane při Vysvobození
        </h2>
        <div className="mb-4">
          <Slider label="Prodejní cena domu (Bronislava prodává)" value={bronislavaSalePrice} min={6_000_000} max={12_000_000} step={250_000} onChange={setBronislavaSalePrice} accent="#a855f7" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Z domu (po hypo + tvůj nárok)" value={`${fmt(bronislavaFromHouse)} Kč`} color={bronislavaFromHouse >= 0 ? "text-green-400" : "text-red-400"} sub={`${fmtK(bronislavaSalePrice)} − ${fmtK(MORTGAGE_BALANCE_SJM)} hypo − ${fmtK(vClaim)} tvůj nárok`} />
          <Stat label="Finanční produkty" value={`${fmt(PRODUCTS_HALF)} Kč`} color="text-slate-300" sub="½ z celkových produktů" />
          <Stat label="Bronislava CELKEM" value={`${fmt(bronislavaTotal)} Kč`} color="text-green-400" sub={bronislavaTotal >= 4_181_243 ? "✓ Víc než požadovala (4,18 mil)" : `Méně než požadovala (4,18 mil) — potřebuje prodat dráž`} />
          <Stat label="Ona požadovala" value="4 181 243 Kč" color="text-warn" sub="Přípis AK Mandilas, 25. 2. 2026" />
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[0.7rem] text-slate-400 uppercase border-b border-surface-700">
                <th className="text-left py-2 px-3">Prodá za</th>
                <th className="text-center py-2 px-3">Z domu</th>
                <th className="text-center py-2 px-3">+ produkty</th>
                <th className="text-center py-2 px-3">Celkem</th>
                <th className="text-center py-2 px-3">vs. požadavek</th>
              </tr>
            </thead>
            <tbody className="font-mono text-[0.8rem]">
              {[7_000_000, 8_000_000, 9_000_000, 10_000_000, 12_000_000].map((price) => {
                const fromHouse = price - MORTGAGE_BALANCE_SJM - vClaim;
                const total = fromHouse + PRODUCTS_HALF;
                const diff2 = total - 4_181_243;
                return (
                  <tr key={price} className={`border-b border-surface-800 ${price === bronislavaSalePrice ? "bg-surface-800/50" : ""}`}>
                    <td className="py-2 px-3 text-slate-300 font-sans">{fmtK(price)}</td>
                    <td className="text-center py-2 px-3 text-green-400">{fmt(fromHouse)}</td>
                    <td className="text-center py-2 px-3 text-slate-400">{fmt(PRODUCTS_HALF)}</td>
                    <td className="text-center py-2 px-3 text-white font-bold">{fmt(total)}</td>
                    <td className={`text-center py-2 px-3 ${diff2 >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {diff2 >= 0 ? "+" : ""}{fmt(diff2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[0.75rem] text-slate-500 mt-3">
          Vysvobození je pro Bronislavu výhodné: ponechá si hypotéku se sazbou{" "}
          {MORTGAGE_RATE_SJM} % (fixace do konce 2027), má čas prodat za vlastní cenu,
          a vše nad tvůj fixní nárok je její. <strong className="text-slate-300">Čím víc věří, že dům má vyšší hodnotu, tím víc by měla chtít vysvobození.</strong>
        </p>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="text-center text-[0.7rem] text-slate-600 py-4 space-y-1">
        <p>
          Orientační model. SJM hypotéka: {fmt(MORTGAGE_BALANCE_SJM)} Kč,{" "}
          {fmt(MORTGAGE_PAYMENT_SJM)}/měs., {MORTGAGE_RATE_SJM} % (fixace do
          12/2027)
        </p>
        <p>
          Kučerova nová hypotéka: {fmt(MORTGAGE_BALANCE_KUCERA)} Kč,{" "}
          {fmt(MORTGAGE_PAYMENT_KUCERA)}/měs., {MORTGAGE_RATE_KUCERA} % |
          Finanční produkty: {fmt(PRODUCTS_TOTAL)} Kč (50/50)
        </p>
      </footer>
    </main>
  );
}
