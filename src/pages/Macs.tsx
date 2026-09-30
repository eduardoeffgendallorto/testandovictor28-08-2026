import { CategoryPage } from "@/components/CategoryPage";

const Macs = () => (
  <CategoryPage
    categoria="mac"
    title="MacBook Novos"
    subtitle="Potência e eficiência para você trabalhar, estudar e criar."
    filters={["Air", "Pro"]}
  />
);

export default Macs;
