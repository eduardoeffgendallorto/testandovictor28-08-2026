import { CategoryPage } from "@/components/CategoryPage";

const IPhones = () => (
  <CategoryPage
    categoria="iphone"
    title="Novos & Lacrados"
    subtitle="A tecnologia mais avançada da Apple, com garantia oficial de 1 ano."
    filters={["iPhone 17", "iPhone 16", "iPhone 15", "iPhone 14", "iPhone 13"]}
  />
);

export default IPhones;
