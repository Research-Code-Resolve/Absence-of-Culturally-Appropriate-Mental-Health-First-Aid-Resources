'''
This script analyzes interview data from university students (Nairobi, Kenya) on mental health support on campus.

It loads data from an Excel file and processes both single-response and 
Multi-response columns (where answers may contain multiple values separated by commas).

A helper function is used to split, clean, and standardize multi-response data 
For accurate counting and visualization.

The script generates five charts:
1. Bar chart of main barriers to accessing mental health support
2. Pie chart showing awareness of mental health resource locations
3. Bar chart of preferred support formats (handling multiple selections)
4. Bar chart of satisfaction levels with current services
5. Bar chart of language preferences with standardized labels

NB: 'language_preference' bar 'english' is labeled 'english + naitive language' 
to reflect student's request for mixed language support

All charts are formatted for readability and saved as image files 
For reporting and presentation purposes.

Author: Palesa Emily Thetele
Group: WG-3
'''


import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Loading the dataset
df = pd.read_excel("University_Students.xlsx")
sns.set(style="whitegrid") #Style

def split_and_count(col):
    # handles NaN, splits by comma, cleans spaces, makes lowercase
    return df[col].dropna().str.split(',').explode().str.strip().str.lower()

# 1. MAIN BARRIERS (BAR CHART)
plt.figure(figsize=(9,5))
split_and_count('barrier_main').value_counts().plot(kind='bar', color='salmon')
plt.title("Main Barriers to Mental Health Support")
plt.ylabel("Number of Mentions")
plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.savefig("barriers_chart.png")
plt.show()

# 2. AWARENESS (PIE CHART)
plt.figure(figsize=(6,6))
df['knows_resource_location'].value_counts().plot(kind='pie', autopct='%1.1f%%', colors=['#ff9999','#66b3ff'])
plt.title("Awareness of Mental Health Resources office Location")
plt.ylabel("")
plt.savefig("awareness_chart.png")
plt.show()

# 3. PREFERED FORMAT (BAR CHART)
plt.figure(figsize=(9,5))
split_and_count('preferred_format').value_counts().plot(kind='bar', color='skyblue')
plt.title("Preferred Support Format")
plt.ylabel("Number of Mentions")
plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.savefig("format_chart.png")
plt.show()

# 4. SATISFACTION LEVEL (BAR CHART)
plt.figure(figsize=(7,5))
df['satisfaction_current_service'].value_counts().sort_index().plot(kind='bar', color='lightgreen')
plt.title("Satisfaction with Current Services")
plt.xlabel("Satisfaction 1=Low, 5=High")
plt.ylabel("Number of Students")
plt.xticks(rotation=0)
plt.tight_layout()
plt.savefig("satisfaction_chart.png")
plt.show()

# 5. LANGUAGE PREFERENCE (BAR CHART)
plt.figure(figsize=(8,5))
langs = split_and_count('language_preference')
langs = langs.replace({'swahili':'kiswahili', 'sh':'sheng', 'eng':'english'})
counts = langs.value_counts()
counts.rename({'english': 'english + native language'}, inplace=True)
counts.plot(kind='bar', color='plum')
plt.title("Language Preference")
plt.ylabel("Number of Mentions")
plt.xticks(rotation=0)
plt.tight_layout()
plt.savefig("language_chart.png")
plt.show()

print("All 5 charts generated and saved!")

