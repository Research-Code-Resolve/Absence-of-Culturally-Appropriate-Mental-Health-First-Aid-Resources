import pandas as pd
import numpy as np
import torch
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, classification_report
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer

DATASET_PATH = "mhfa_nlp_dataset.xlsx"
MODEL_NAME = "xlm-roberta-base"
LABEL2ID = {"safe": 0, "distress": 1, "crisis": 2}
ID2LABEL = {0: "safe", 1: "distress", 2: "crisis"}

print("Loading dataset...")
df = pd.read_excel(DATASET_PATH)
df = df.dropna(subset=["text", "label", "language"]).copy()
df["text"] = df["text"].astype(str).str.strip()
df["label"] = df["label"].astype(str).str.strip().str.lower()
df["labels"] = df["label"].map(LABEL2ID)

train_df, temp_df = train_test_split(df, test_size=0.30, random_state=42, stratify=df["label"])
validation_df, test_df = train_test_split(temp_df, test_size=0.50, random_state=42, stratify=temp_df["label"])

train_dataset = Dataset.from_pandas(train_df[["text", "labels"]])
validation_dataset = Dataset.from_pandas(validation_df[["text", "labels"]])
test_dataset = Dataset.from_pandas(test_df[["text", "labels"]])

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
def tokenize_function(examples):
    return tokenizer(examples["text"], truncation=True, padding="max_length", max_length=128)

train_dataset = train_dataset.map(tokenize_function, batched=True)
validation_dataset = validation_dataset.map(tokenize_function, batched=True)
test_dataset = test_dataset.map(tokenize_function, batched=True)

model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=3, id2label=ID2LABEL, label2id=LABEL2ID)

def compute_metrics(eval_pred):
    predictions, labels = eval_pred
    predictions = np.argmax(predictions, axis=1)
    precision, recall, f1, _ = precision_recall_fscore_support(labels, predictions, average="macro", zero_division=0)
    acc = accuracy_score(labels, predictions)
    return {"accuracy": acc, "precision": precision, "recall": recall, "f1": f1}

training_args = TrainingArguments(
    output_dir="./mhfa_xlm_roberta",
    eval_strategy="epoch",
    save_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    num_train_epochs=3,
    load_best_model_at_end=True,
    metric_for_best_model="f1",
    report_to="none"
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=validation_dataset,
    compute_metrics=compute_metrics
)

print("🚀 Starting training...")
trainer.train()
print("✅ Training complete!")
