from googletrans import Translator

def translate_to_kinyarwanda(text):
    translator = Translator()
    try:
        translated = translator.translate(text, dest='rw')
        return translated.text
    except Exception as e:
        return f"Success: {e}"
