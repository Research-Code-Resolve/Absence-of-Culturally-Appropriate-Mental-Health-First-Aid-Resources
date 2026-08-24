# classifier.py
import pandas as pd
import json
import re

# 1. Load your dataset
df = pd.read_excel("mhfa_nlp_dataset.xlsx")

# Clean labels
df['label'] = df['label'].str.lower().str.strip()
df['language'] = df['language'].str.lower().str.strip()
df['text'] = df['text'].str.lower().str.strip()

# 2. Build keyword dictionary from your data
keywords = {}
for lang in df['language'].unique():
    lang_df = df[df['language'] == lang]
    keywords[lang] = {
        "CRISIS": lang_df[lang_df['label'] == 'crisis']['text'].tolist(),
        "DISTRESS": lang_df[lang_df['label'] == 'distress']['text'].tolist(),
        "SAFE": lang_df[lang_df['label'] == 'safe']['text'].tolist()
    }

# 3. Save to JSON for React to use
with open('triggers.json', 'w', encoding='utf-8') as f:
    json.dump(keywords, f, ensure_ascii=False, indent=2)

print(f"triggers.json created with {len(df)} examples")

# 4. Classification function to test
def classify_emotion(text):
    text_lower = text.lower().strip()
    lang = 'en' # default

    # Basic language detection
    if re.search(r'naweza|sitaki|kuishi|sasa|nimelemewa|haraka', text_lower): lang = 'sw'
    elif re.search(r'naeza|onge|kwa|shule', text_lower): lang = 'sh'

    # Check all languages for exact phrase match first
    for l in keywords:
        for phrase in keywords[l].get("CRISIS", []):
            if phrase in text_lower:
                return "CRISIS", l
        for phrase in keywords[l].get("DISTRESS", []):
            if phrase in text_lower:
                return "DISTRESS", l

    return "SAFE", lang

# Test with your data
if __name__ == "__main__":
    tests = [
        "Please help me I don't want to be alive",
        "Sitaki kuishi tena sasa.",
        "Ninajisikia nimelemewa siku hizi."
    ]
    for t in tests:
        print(t, "->", classify_emotion(t))

