import { createI18n } from "vue-i18n";
import enLanguage from "./en.json";
import esLanguaje from "./es.json";

const i18n = createI18n({
  locale: "en",
  messages: {
    en: enLanguage,
    es: esLanguaje
  },
});

export default i18n;