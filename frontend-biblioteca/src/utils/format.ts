export const formatDate = (value: string | Date, lang: string) =>
  new Date(value).toLocaleDateString(lang === "en" ? "en-GB" : "it-IT");