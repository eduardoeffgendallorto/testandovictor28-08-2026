import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { familiaDeCor, type Condicao, type Facets, type FiltroState } from "@/data/catalogFilters";
import { cn } from "@/lib/utils";

// Bolinha de cor ao lado do nome (escolhida pela família da cor).
const AMOSTRA: Record<string, string> = {
  Preto: "#1d1d1f",
  Branco: "#f5f5f0",
  Azul: "#3b6ea5",
  Verde: "#5b8a72",
  Rosa: "#f4c2c2",
  Roxo: "#8e6bbf",
  Dourado: "#d9b77e",
  Amarelo: "#f5d547",
  Laranja: "#e8762c",
  "Prateado/Cinza": "#c7c9cc",
  "Titânio natural": "#b8b2a7",
};

const Secao = ({ titulo, children }: { titulo: string; children: ReactNode }) => (
  <fieldset className="min-w-0">
    <legend className="text-sm font-semibold mb-3">{titulo}</legend>
    {children}
  </fieldset>
);

const Chip = ({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={ativo}
    className={cn(
      "inline-flex items-center gap-2 px-3.5 py-1.5 text-sm rounded-full border transition",
      ativo
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-surface text-foreground border-border hover:border-foreground/30",
    )}
  >
    {children}
  </button>
);

const alternar = (lista: string[], item: string) =>
  lista.includes(item) ? lista.filter((x) => x !== item) : [...lista, item];

const paraNumero = (v: string): number | null => {
  const n = Number(v);
  return v.trim() === "" || !Number.isFinite(n) || n < 0 ? null : Math.round(n);
};

const CONDICOES: { value: Condicao; label: string }[] = [
  { value: "todas", label: "Todos" },
  { value: "novo", label: "Novos" },
  { value: "seminovo", label: "Seminovos" },
];

type Props = {
  facets: Facets;
  state: FiltroState;
  onChange: (patch: Partial<FiltroState>) => void;
};

export const CatalogFilters = ({ facets, state, onChange }: Props) => {
  const mostrarPreco = facets.precoMax > facets.precoMin;
  const mostrarCondicao = facets.temNovo && facets.temSeminovo;
  const campo =
    "w-full h-11 rounded-xl bg-secondary border border-transparent focus:border-primary focus:bg-surface focus:outline-none focus:ring-4 focus:ring-primary/15 px-3 text-sm transition";

  return (
    <div
      role="group"
      aria-label="Filtros do catálogo"
      className="rounded-3xl border border-border bg-surface p-5 md:p-6 mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {mostrarPreco && (
        <Secao titulo="Preço (R$)">
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={100}
              aria-label="Preço mínimo"
              placeholder={`De ${facets.precoMin}`}
              value={state.precoMin ?? ""}
              onChange={(e) => onChange({ precoMin: paraNumero(e.target.value) })}
              className={campo}
            />
            <span className="text-muted-foreground text-sm">até</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={100}
              aria-label="Preço máximo"
              placeholder={`${facets.precoMax}`}
              value={state.precoMax ?? ""}
              onChange={(e) => onChange({ precoMax: paraNumero(e.target.value) })}
              className={campo}
            />
          </div>
        </Secao>
      )}

      {mostrarCondicao && (
        <Secao titulo="Condição">
          <div className="flex flex-wrap gap-2">
            {CONDICOES.map((c) => (
              <Chip key={c.value} ativo={state.condicao === c.value} onClick={() => onChange({ condicao: c.value })}>
                {c.label}
              </Chip>
            ))}
          </div>
        </Secao>
      )}

      {facets.tipos.length > 1 && (
        <Secao titulo="Tipo de aparelho">
          <div className="flex flex-wrap gap-2">
            {facets.tipos.map((t) => (
              <Chip key={t} ativo={state.tipos.includes(t)} onClick={() => onChange({ tipos: alternar(state.tipos, t) })}>
                {t}
              </Chip>
            ))}
          </div>
        </Secao>
      )}

      {facets.armazenamentos.length > 1 && (
        <Secao titulo="Armazenamento">
          <div className="flex flex-wrap gap-2">
            {facets.armazenamentos.map((a) => (
              <Chip
                key={a}
                ativo={state.armazenamentos.includes(a)}
                onClick={() => onChange({ armazenamentos: alternar(state.armazenamentos, a) })}
              >
                {a}
              </Chip>
            ))}
          </div>
        </Secao>
      )}

      {facets.cores.length > 1 && (
        <div className="sm:col-span-2 lg:col-span-3">
          <Secao titulo="Cor">
            <div className="flex flex-wrap gap-2">
              {facets.cores.map((cor) => {
                const ativo = state.cores.includes(cor);
                return (
                  <Chip key={cor} ativo={ativo} onClick={() => onChange({ cores: alternar(state.cores, cor) })}>
                    <span
                      aria-hidden
                      className="h-4 w-4 rounded-full border border-black/15 inline-flex items-center justify-center"
                      style={{ backgroundColor: AMOSTRA[familiaDeCor(cor)] ?? "#d1d1d6" }}
                    >
                      {ativo && <Check className="h-3 w-3 text-white mix-blend-difference" strokeWidth={3} />}
                    </span>
                    {cor}
                  </Chip>
                );
              })}
            </div>
          </Secao>
        </div>
      )}
    </div>
  );
};
