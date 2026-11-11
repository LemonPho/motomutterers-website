import re

def sanitize_html(text):
    cleaned_text = re.compile(r'<[^>]+>')
    cleaned_text = re.sub(cleaned_text, '\n', text)
    cleaned_text = re.sub(r'\n+', '\n', cleaned_text)
    cleaned_text = cleaned_text.strip()
    return cleaned_text

