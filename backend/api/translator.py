def translate_to_kinyarwanda(text):
    """
    Simple translation function for Kinyarwanda.
    In a real app, you would use a proper translation API.
    """
    translations = {
        'Banana Bacterial Wilt': 'Indwara ya Banana yo kurwara kuri Bacteria',
        'Maize Leaf Blight': 'Indwara y\'ibimera bya Maize',
        'Potato Late Blight': 'Indwara ya Potato yo kurwara',
        'Bacterial disease causing wilting and yellowing.': 'Indwara ya Bacteria ishobora gutuma ibimera byumva ubucucu no kuba umuhondo.',
        'Fungal leaf spots reducing photosynthesis.': 'Ibiranga by\'ibimera bifite amabara y\'umweru bigabanya ubwoko bw\'ibimera.',
        'Oomycete disease causing dark lesions on leaves and tubers.': 'Indwara ya Oomycete ishobora gutuma haba amabara y\'umukara kuri ibimera n\'ibinyabutumbura.',
        'Rogue infected plants, sanitize tools, use clean planting material.': 'Kuraho ibimera byarwaye, gukoresha ibikoresho byo gusukura, gukoresha ibyatsi byo gutera byera.',
        'Rotate crops, remove residue, apply recommended fungicide if severe.': 'Guhindura ibihingwa, gukuraho ibisigazwa, gukoresha ifungisidi zirinzwe niba byarakaze.',
        'Use certified seed, ensure airflow, apply protective fungicide as advised.': 'Gukoresha imbuto zemewe, kureba neza ko umwuka uhagaze, gukoresha ifungisidi zirinzwe nk\'uko byavuzwe.',
        'Maintain field hygiene; use resistant varieties; avoid tool sharing between fields, or contact one of our expert': 'Komeza gusana isambu; gukoresha ubwoko butakwicwa; kwirinda gusangiza ibikoresho hagati y\'amasambu, cyangwa wabwira umwe mu banyabwenge.',
        'Ensure spacing for airflow; balanced fertilization; timely weeding, or contact one of our expert': 'Kureba neza intera yo gukoresha umwuka; gukoresha ifumbire yuzuye; kubagura ibyatsi mu bihe, cyangwa wabwira umwe mu banyabwenge.',
        'Avoid overhead irrigation late in day; remove infected leaves; monitor weather alerts, or contact one of our expert': 'Kwirinda gutera amazi mu gihe cy\'umunsi; gukuraho ibibabi byarwaye; kureba amakuru y\'ibihe, cyangwa wabwira umwe mu banyabwenge.',
    }
    
    return translations.get(text, f"Translation for: {text}")