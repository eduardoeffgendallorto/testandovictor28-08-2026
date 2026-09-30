import { CategoryPage } from "@/components/CategoryPage";

const Seminovos = () => (
  <CategoryPage
    categoria="seminovo"
    title="iPhones Seminovos"
    subtitle="Aparelhos verificados, com excelente custo-benefício e procedência."
    filters={["iPhone 17", "iPhone 16", "iPhone 15"]}
  />
);

export default Seminovos;
