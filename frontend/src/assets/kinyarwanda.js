// Manual English to Kinyarwanda translation mapping
export const EN_RW_TRANSLATIONS = {
  "Banana Bacterial Wilt": "Indwara y’uruhumbu rw’igitoki",
  "Bacterial disease causing wilting and yellowing.": "Indwara iterwa na bagiteri itera kugwa no guhinduka umuhondo kw’ibyatsi.",
  "Rogue infected plants, sanitize tools, use clean planting material.": "Kurandura ibimera byanduye, gusukura ibikoresho, gukoresha imbuto zifite isuku.",
  "Maintain field hygiene; use resistant varieties; avoid tool sharing between fields.": "Gusukura umurima, gukoresha imbuto zirwanya indwara, kwirinda gusangira ibikoresho hagati y’imirima.",

  "Maize Leaf Blight": "Indwara y’icyorezo cy’ibyatsi bya mahindi",
  "Fungal leaf spots reducing photosynthesis.": "Uduheri duterwa na bagiteri tugabanya ubushobozi bwo gukora ifumbire y’ibyatsi.",
  "Rotate crops, remove residue, apply recommended fungicide if severe.": "Guhinduranya imyaka, gukuraho ibisigazwa, gukoresha umuti wica udukoko igihe indwara ikaze.",
  "Ensure spacing for airflow; balanced fertilization; timely weeding.": "Gushyiraho intera ihagije y’ihingwa, gukoresha ifumbire ikwiye, kurandura ibyatsi bibi ku gihe.",

  "Potato Late Blight": "Indwara y’icyorezo cya patate",
  "Oomycete disease causing dark lesions on leaves and tubers.": "Indwara iterwa na Oomycete itera uduheri dutukura ku mababi no ku tubura.",
  "Use certified seed, ensure airflow, apply protective fungicide as advised.": "Gukoresha imbuto zemewe, gushyiraho intera ihagije, gukoresha umuti wica udukoko nk’uko inama igirwa.",
  "Avoid overhead irrigation late in day; remove infected leaves; monitor weather alerts.": "Kwirinda kuvomera hejuru mu masaha y’umugoroba, gukuraho amababi yanduye, gukurikirana itangazo ry’ikirere.",
  // Add more phrases as needed
}

export function translateToKinyarwanda(text) {
  // Returns the Kinyarwanda translation if available, otherwise returns the original English text.
  // Fill in the values above with your translations.
  return EN_RW_TRANSLATIONS[text] || text;
}
