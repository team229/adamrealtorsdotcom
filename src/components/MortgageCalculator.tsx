import { useMemo, useState } from 'react';

type Mode = 'payment' | 'affordability' | 'closing';

interface Props {
  mode: Mode;
}

const money = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? Math.max(0, value) : 0);

function Field({
  label,
  value,
  onChange,
  min,
  max,
  step,
  suffix,
  prefix,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  prefix?: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5">
          {prefix && <span className="text-xs text-muted-foreground">{prefix}</span>}
          <input
            id={id}
            type="number"
            value={Number.isFinite(value) ? value : 0}
            min={min}
            max={max}
            step={step}
            onChange={(event) => onChange(Number(event.target.value))}
            className="w-20 bg-transparent text-right text-sm font-semibold text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        aria-label={`${label} slider`}
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 w-full accent-primary"
      />
    </div>
  );
}

export default function MortgageCalculator({ mode }: Props) {
  const [price, setPrice] = useState(mode === 'closing' ? 850000 : 850000);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(6.74);
  const [term, setTerm] = useState(30);
  const [income, setIncome] = useState(150000);
  const [debts, setDebts] = useState(500);
  const [dti, setDti] = useState(36);

  const result = useMemo(() => {
    const down = (price * downPct) / 100;
    const loan = Math.max(0, price - down);
    const monthlyRate = rate / 100 / 12;
    const payments = Math.max(1, term * 12);
    const pi =
      monthlyRate === 0
        ? loan / payments
        : (loan * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -payments));

    if (mode === 'payment') {
      const taxes = (price * 0.011) / 12;
      const insurance = (price * 0.0035) / 12;
      const total = pi + taxes + insurance;
      return {
        rows: [
          { label: 'Principal & interest', value: money(pi) },
          { label: 'Property taxes (est. 1.1%/yr)', value: money(taxes) },
          { label: 'Home insurance (est.)', value: money(insurance) },
          { label: 'Loan amount', value: money(loan) },
          { label: 'Total interest over term', value: money(pi * payments - loan) },
        ],
        headline: money(total),
        caption: 'Estimated monthly payment',
        note: 'Taxes and insurance are estimates. Your lender will confirm the final figures.',
      };
    }

    if (mode === 'affordability') {
      const maxMonthly = Math.max(0, (income / 12) * (dti / 100) - debts);
      const maxLoan =
        monthlyRate === 0
          ? maxMonthly * payments
          : (maxMonthly * (1 - Math.pow(1 + monthlyRate, -payments))) / monthlyRate;
      const maxPrice = maxLoan / Math.max(0.05, 1 - downPct / 100);
      return {
        rows: [
          { label: 'Comfortable monthly payment', value: money(maxMonthly) },
          { label: 'Estimated loan amount', value: money(maxLoan) },
          { label: `Down payment (${downPct}%)`, value: money(maxPrice - maxLoan) },
          { label: 'Debt-to-income target', value: `${dti}%` },
        ],
        headline: money(maxPrice),
        caption: 'Estimated buying power',
        note: 'A lender will also weigh credit, reserves, employment history and loan program limits.',
      };
    }

    const origination = loan * 0.01;
    const titleEscrow = price * 0.006;
    const appraisal = 650;
    const recording = 350;
    const prepaid = (loan * (rate / 100)) / 12 + (price * 0.011) / 12 * 3;
    const total = origination + titleEscrow + appraisal + recording + prepaid;
    return {
      rows: [
        { label: 'Loan origination (est. 1%)', value: money(origination) },
        { label: 'Title & escrow (est. 0.6%)', value: money(titleEscrow) },
        { label: 'Appraisal', value: money(appraisal) },
        { label: 'Recording & misc.', value: money(recording) },
        { label: 'Prepaid interest & reserves', value: money(prepaid) },
      ],
      headline: money(total),
      caption: 'Estimated cash to close (plus down payment)',
      note: `Add your ${money((price * downPct) / 100)} down payment. Seller credits, lender fees and prepaid items vary by contract.`,
    };
  }, [price, downPct, rate, term, income, debts, dti, mode]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M8 9h8M8 13h5M8 17h3" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-bold text-foreground">
              {mode === 'payment' && 'Monthly payment calculator'}
              {mode === 'affordability' && 'Home affordability calculator'}
              {mode === 'closing' && 'Closing cost estimator'}
            </p>
            <p className="text-xs text-muted-foreground">
              {mode === 'payment' && 'Principal, interest, taxes and insurance'}
              {mode === 'affordability' && 'What a lender may approve you for'}
              {mode === 'closing' && 'Cash you may need beyond the down payment'}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-medium text-muted-foreground">
          Editable estimate
        </span>
      </div>

      <div className="grid gap-8 p-5 sm:p-6 lg:grid-cols-2">
        <div className="space-y-6">
          {mode !== 'affordability' && (
            <Field label="Home price" value={price} onChange={setPrice} min={200000} max={4000000} step={5000} prefix="$" />
          )}
          <Field label="Down payment" value={downPct} onChange={setDownPct} min={3} max={50} step={1} suffix="%" />
          <Field label="Interest rate" value={rate} onChange={setRate} min={2} max={12} step={0.01} suffix="%" />
          <Field label="Loan term" value={term} onChange={setTerm} min={10} max={30} step={5} suffix="yrs" />

          {mode === 'affordability' && (
            <>
              <Field label="Gross annual income" value={income} onChange={setIncome} min={40000} max={600000} step={5000} prefix="$" />
              <Field label="Monthly debt payments" value={debts} onChange={setDebts} min={0} max={5000} step={50} prefix="$" />
              <Field label="Target debt-to-income" value={dti} onChange={setDti} min={25} max={45} step={1} suffix="%" />
            </>
          )}
        </div>

        <div className="flex flex-col justify-center rounded-xl bg-secondary/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {result.caption}
          </p>
          <p
            className="mt-1 text-4xl font-bold leading-tight text-primary"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {result.headline}
          </p>
          <dl className="mt-5 space-y-2.5 border-t border-border pt-4">
            {result.rows.map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-muted-foreground">{row.label}</dt>
                <dd className="text-sm font-semibold text-foreground">{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">{result.note}</p>
        </div>
      </div>
    </div>
  );
}
