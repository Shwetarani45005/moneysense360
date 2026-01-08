from fastapi import UploadFile, File
import pandas as pd
import joblib
from pydantic import BaseModel
from typing import List
import csv
import codecs
from pathlib import Path

# MODEL_PATH = "../category_models/transaction_classifier.pkl"
# MODEL_PATH = "backend/uploads_server_utils/category_models/transaction_classifier.pkl"
# MODEL_PATH="transaction_classifier.pkl"

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "transaction_classifier.pkl"
pipeline = joblib.load(MODEL_PATH)

def classify_category(description, withdrawal, deposit):
    desc = description.lower()

    # Opening rule
    if withdrawal == 0 and deposit == 0:
        return "Opening"

    # Refund rule
    if "refund" in desc or "reversal" in desc:
        return "Adjustment"

    # ML prediction
    df = pd.DataFrame([{
        "Description": description,
        "Withdrawal": withdrawal,
        "Deposit": deposit
    }])

    return pipeline.predict(df)[0]

# def csv_dataset_to_json(file: UploadFile = File(...)):
#     csv_reader = csv.DictReader(codecs.iterdecode(file.file, 'utf-8'))
    
#     data = [row for row in csv_reader]

#     return {
#         "total_rows": len(data),
#         "data": data
#     }

# def csv_dataset_to_json(file_path: Path):
#     df = pd.read_csv(file_path)
#     return {
#         "total_rows": len(df),
#         "data": df.to_dict(orient="records")
#     }

# "excel" [ZIP ARCHIVES] != "csv" [TEXT FORMAT]
def csv_dataset_to_json(file_path: Path):
    suffix = file_path.suffix.lower()

    if suffix == ".xlsx":
        df = pd.read_excel(file_path)

    elif suffix == ".csv":
        for enc in ("utf-8", "cp1252", "latin1"):
            try:
                df = pd.read_csv(
                    file_path,
                    encoding=enc,
                    sep=None,
                    engine="python",
                    skip_blank_lines=True,
                    on_bad_lines="warn"
                )
                break
            except UnicodeDecodeError:
                continue
        else:
            raise ValueError("Unsupported CSV encoding")

    else:
        raise ValueError("Unsupported file type")

    return {
        "total_rows": len(df),
        "data": df.to_dict(orient="records")
    }
