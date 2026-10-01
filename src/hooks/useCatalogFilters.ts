import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FILTRO_VAZIO, filtrosParaParams, lerFiltros, type FiltroState } from "@/data/catalogFilters";

// Guarda os filtros na URL: o botão "voltar" do navegador mantém a escolha
// e o cliente pode mandar o link filtrado pelo WhatsApp.
export function useCatalogFilters() {
  const [params, setParams] = useSearchParams();
  const state = useMemo(() => lerFiltros(params), [params]);

  const update = useCallback(
    (patch: Partial<FiltroState>) => {
      setParams((prev) => filtrosParaParams({ ...lerFiltros(prev), ...patch }), { replace: true });
    },
    [setParams],
  );

  // Limpa tudo, menos a ordenação escolhida.
  const clear = useCallback(() => update({ ...FILTRO_VAZIO, ordem: state.ordem }), [update, state.ordem]);

  return { state, update, clear };
}
