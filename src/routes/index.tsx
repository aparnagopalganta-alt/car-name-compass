import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Fuel,
  Gauge,
  Search,
  ShieldCheck,
  Star,
  Timer,
  Users,
  X,
  Zap,
  Check,
  Minus,
  Cog,
  Weight,
  Ruler,
  CarFront,
} from "lucide-react";
import heroCar from "@/assets/hero-car.jpg";
import { cars, searchCars, type Car } from "@/data/cars";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AutoLens — Find Every Detail of Any Car" },
      {
        name: "description",
        content:
          "Type a car name and instantly see its engine, performance, price, safety and more.",
      },
      { property: "og:title", content: "AutoLens — Find Every Detail of Any Car" },
      {
        property: "og:description",
        content: "Type a car name and instantly see its engine, performance, price, safety and more.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const POPULAR: [string, string][] = [
  ["porsche-911", "Porsche 911"],
  ["tesla-model-3", "Tesla Model 3"],
  ["mahindra-thar", "Mahindra Thar"],
  ["bmw-m3", "BMW M3"],
  ["hyundai-creta", "Hyundai Creta"],
];

function Index() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<Car | null>(null);
  const [notFound, setNotFound] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => searchCars(query).slice(0, 6), [query]);

  useEffect(() => setActive(0), [query]);

  const choose = (car: Car) => {
    setSelected(car);
    setNotFound(null);
    setQuery(`${car.make} ${car.model}`);
    setOpen(false);
    requestAnimationFrame(() =>
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  const submit = () => {
    if (!query.trim()) return inputRef.current?.focus();
    const match = suggestions[active] ?? suggestions[0];
    if (match) choose(match);
    else {
      setSelected(null);
      setNotFound(query.trim());
      setOpen(false);
      requestAnimationFrame(() =>
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroCar}
          alt="Sports car lit by warm studio light"
          width={1920}
          height={1088}
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-hero-fade" />

        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2 font-display text-xl font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
              <CarFront className="h-5 w-5" />
            </span>
            AutoLens
          </div>
          <span className="hidden text-sm text-muted-foreground sm:block">
            {cars.length} cars in the garage
          </span>
        </nav>

        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-28 pt-20 text-center sm:pt-28">
          <span className="animate-rise glass rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-glow">
            Car details, instantly
          </span>
          <h1
            className="animate-rise mt-6 max-w-3xl text-5xl font-extrabold leading-[1.02] sm:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            Know every detail of <span className="text-gradient-primary">any car</span>.
          </h1>
          <p
            className="animate-rise mt-5 max-w-xl text-base text-muted-foreground sm:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            Type a car name to see its engine, performance, price, safety rating and more.
          </p>

          {/* Search */}
          <div
            className="animate-rise relative mt-10 w-full max-w-2xl"
            style={{ animationDelay: "240ms" }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="glass flex items-center gap-2 rounded-2xl border p-2 shadow-card transition focus-within:shadow-glow"
            >
              <Search className="ml-3 h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                onKeyDown={onKey}
                placeholder="Try “Porsche 911”, “Thar” or “Model 3”"
                aria-label="Car name"
                role="combobox"
                aria-expanded={open && suggestions.length > 0}
                aria-controls="car-suggestions"
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent px-2 py-3 text-base outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:brightness-110 active:scale-[0.98]"
              >
                Search <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {open && query && suggestions.length > 0 && (
              <ul
                id="car-suggestions"
                role="listbox"
                className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border bg-popover text-left shadow-card"
              >
                {suggestions.map((car, i) => (
                  <li key={car.id} role="option" aria-selected={i === active}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => choose(car)}
                      className={`flex w-full items-center justify-between px-5 py-3 transition ${
                        i === active ? "bg-accent" : ""
                      }`}
                    >
                      <span>
                        <span className="font-semibold">{car.make}</span>{" "}
                        <span className="text-muted-foreground">{car.model}</span>
                      </span>
                      <span className="text-xs text-muted-foreground">{car.body}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div
            className="animate-rise mt-6 flex flex-wrap justify-center gap-2"
            style={{ animationDelay: "320ms" }}
          >
            <span className="py-1.5 text-xs text-muted-foreground">Popular:</span>
            {POPULAR.map(([id, label]) => {
              const car = cars.find((c) => c.id === id)!;
              return (
                <button
                  key={id}
                  onClick={() => choose(car)}
                  className="glass rounded-full border px-3 py-1.5 text-xs font-medium transition hover:border-primary hover:text-primary-glow"
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results */}
      <div ref={resultsRef} className="scroll-mt-6">
        {selected && <CarDetails key={selected.id} car={selected} />}
        {notFound && <NotFound term={notFound} onPick={choose} />}
        {!selected && !notFound && <Browse onPick={choose} />}
      </div>

      <footer className="mx-auto max-w-6xl border-t px-6 py-8 text-center text-xs text-muted-foreground">
        Figures are indicative and may vary by market and trim.
      </footer>
    </main>
  );
}

function CarDetails({ car }: { car: Car }) {
  const stats = [
    { icon: Zap, label: "Power", value: `${car.horsepower}`, unit: "hp" },
    { icon: Timer, label: "0–100 km/h", value: `${car.zeroToSixty}`, unit: "sec" },
    { icon: Gauge, label: "Top speed", value: `${car.topSpeed}`, unit: "km/h" },
    { icon: Fuel, label: car.fuel === "Electric" ? "Range" : "Efficiency", value: car.efficiency, unit: "" },
  ];

  const specs = [
    { icon: Cog, label: "Engine", value: car.engine },
    { icon: Zap, label: "Torque", value: car.torque },
    { icon: Cog, label: "Transmission", value: car.transmission },
    { icon: CarFront, label: "Drivetrain", value: car.drivetrain },
    { icon: Fuel, label: "Fuel type", value: car.fuel },
    { icon: Users, label: "Seating", value: `${car.seats} seats` },
    { icon: Weight, label: "Kerb weight", value: car.weight },
    { icon: Ruler, label: "Length", value: car.length },
  ];

  const bars = [
    { label: "Power", pct: Math.min(100, (car.horsepower / 650) * 100) },
    { label: "Acceleration", pct: Math.min(100, Math.max(8, ((13 - car.zeroToSixty) / 10) * 100)) },
    { label: "Top speed", pct: Math.min(100, (car.topSpeed / 330) * 100) },
    { label: "Safety", pct: (car.safety / 5) * 100 },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="animate-rise flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            {car.year} · {car.body}
          </p>
          <h2 className="mt-2 text-4xl font-extrabold sm:text-6xl">
            {car.make} <span className="text-gradient-primary">{car.model}</span>
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">{car.tagline}</p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-2xl border bg-card px-5 py-4">
            <p className="text-xs text-muted-foreground">Starting price</p>
            <p className="font-display text-2xl font-bold">{car.price}</p>
          </div>
          <div className="rounded-2xl border bg-card px-5 py-4">
            <p className="text-xs text-muted-foreground">Our rating</p>
            <p className="flex items-center gap-1 font-display text-2xl font-bold">
              <Star className="h-5 w-5 fill-primary text-primary" />
              {car.rating.toFixed(1)}
              <span className="text-sm font-medium text-muted-foreground">/10</span>
            </p>
          </div>
        </div>
      </div>

      {/* Key stats */}
      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="animate-rise group rounded-2xl border bg-gradient-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-glow"
            style={{ animationDelay: `${100 + i * 70}ms` }}
          >
            <s.icon className="h-5 w-5 text-primary" />
            <p className="mt-6 font-display text-3xl font-bold sm:text-4xl">
              {s.value}
              {s.unit && <span className="ml-1 text-base font-medium text-muted-foreground">{s.unit}</span>}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Specs */}
        <div className="animate-rise rounded-2xl border bg-card p-6 lg:col-span-3" style={{ animationDelay: "350ms" }}>
          <h3 className="text-lg font-bold">Specifications</h3>
          <dl className="mt-4 grid gap-x-8 sm:grid-cols-2">
            {specs.map((s) => (
              <div key={s.label} className="flex items-center justify-between gap-4 border-b py-3.5 last:border-0 sm:[&:nth-last-child(2)]:border-0">
                <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                  <s.icon className="h-4 w-4" /> {s.label}
                </dt>
                <dd className="text-right text-sm font-semibold">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Performance bars */}
        <div className="animate-rise rounded-2xl border bg-card p-6 lg:col-span-2" style={{ animationDelay: "420ms" }}>
          <h3 className="text-lg font-bold">Performance profile</h3>
          <div className="mt-5 space-y-5">
            {bars.map((b, i) => (
              <div key={b.label}>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{b.label}</span>
                  <span className="font-semibold">{Math.round(b.pct)}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="animate-bar h-full rounded-full bg-gradient-primary"
                    style={{ width: `${b.pct}%`, animationDelay: `${500 + i * 100}ms` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-2 rounded-xl bg-muted px-4 py-3 text-sm">
            <ShieldCheck className="h-4 w-4 text-success" />
            Safety
            <span className="ml-auto flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < car.safety ? "fill-primary text-primary" : "text-muted-foreground"}`}
                />
              ))}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="animate-rise rounded-2xl border bg-card p-6" style={{ animationDelay: "480ms" }}>
          <h3 className="text-lg font-bold">What we love</h3>
          <ul className="mt-4 space-y-3">
            {car.pros.map((p) => (
              <li key={p} className="flex gap-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="animate-rise rounded-2xl border bg-card p-6" style={{ animationDelay: "540ms" }}>
          <h3 className="text-lg font-bold">Keep in mind</h3>
          <ul className="mt-4 space-y-3">
            {car.cons.map((c) => (
              <li key={c} className="flex gap-3 text-sm">
                <Minus className="mt-0.5 h-4 w-4 shrink-0 text-destructive" /> {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="animate-rise rounded-2xl border bg-card p-6" style={{ animationDelay: "600ms" }}>
          <h3 className="text-lg font-bold">Available colours</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {car.colors.map((c) => (
              <span key={c} className="rounded-full border bg-muted px-3 py-1.5 text-xs font-medium">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function NotFound({ term, onPick }: { term: string; onPick: (c: Car) => void }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="animate-rise rounded-3xl border bg-card p-10 text-center">
        <Search className="mx-auto h-8 w-8 text-primary" />
        <h2 className="mt-4 text-2xl font-bold sm:text-3xl">We couldn't find “{term}”</h2>
        <p className="mt-2 text-muted-foreground">
          Check the spelling, or try one of these instead.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {cars.slice(0, 6).map((c) => (
            <button
              key={c.id}
              onClick={() => onPick(c)}
              className="rounded-full border bg-muted px-4 py-2 text-sm transition hover:border-primary hover:text-primary-glow"
            >
              {c.make} {c.model}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Browse({ onPick }: { onPick: (c: Car) => void }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-end justify-between">
        <h2 className="text-3xl font-extrabold sm:text-4xl">Browse the garage</h2>
        <p className="hidden text-sm text-muted-foreground sm:block">Tap any car to see details</p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map((car, i) => (
          <button
            key={car.id}
            onClick={() => onPick(car)}
            className="animate-rise group rounded-2xl border bg-gradient-card p-6 text-left shadow-card transition hover:-translate-y-1 hover:shadow-glow"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="flex items-start justify-between">
              <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {car.body}
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
            </div>
            <p className="mt-6 text-sm text-muted-foreground">{car.make}</p>
            <p className="font-display text-xl font-bold">{car.model}</p>
            <div className="mt-5 flex gap-5 text-sm">
              <span><b>{car.horsepower}</b> <span className="text-muted-foreground">hp</span></span>
              <span><b>{car.zeroToSixty}s</b> <span className="text-muted-foreground">0–100</span></span>
              <span className="ml-auto font-semibold text-primary-glow">{car.price.split(" ")[0]}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
