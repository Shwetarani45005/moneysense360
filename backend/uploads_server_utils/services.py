from fastapi import UploadFile, HTTPException, status, File
from typing import List
from datetime import datetime
from pathlib import Path
import os
from .classification_utils import classify_category, csv_dataset_to_json
from starlette.concurrency import run_in_threadpool
from .utils import generate_analytics

ALLOWED_MIME_TYPES = {
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
}

ALLOWED_EXTENSIONS = {".csv", ".xlsx"}


def get_upload_dir() -> Path:
    path = Path("uploaded_files") / datetime.utcnow().strftime("%Y-%m-%d")
    path.mkdir(parents=True, exist_ok=True)
    return path


async def save_file_to_disk(file: UploadFile, destination: Path):
    await run_in_threadpool(
        lambda: destination.write_bytes(file.file.read())
    )


def validate_file(file: UploadFile):
    ext = Path(file.filename).suffix.lower()

    if file.content_type not in ALLOWED_MIME_TYPES or ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only .csv and .xlsx files are allowed"
        )
    
async def upload_file(file: UploadFile):
    validate_file(file)

    upload_dir = get_upload_dir()
    safe_name = os.path.basename(file.filename)
    file_path = upload_dir / safe_name

    await save_file_to_disk(file, file_path)

    # file.file.seek(0)
    # data = csv_dataset_to_json(file)
    file_path = Path(file_path)
    data = csv_dataset_to_json(file_path)

    print("\n\n===============================", data, "\n\n")

    cls_details = generate_analytics(data)

    return {
        "file_name": safe_name,
        "file_loc": str(file_path),
        "classification_details": cls_details["classification_details"]
    }

async def upload_files(files: List[File]):
    upload_dir = get_upload_dir()
    uploads = []    

    for file in files:
        validate_file(file)

        safe_name = os.path.basename(file.filename)
        file_path = upload_dir / safe_name

        await save_file_to_disk(file, file_path)

        uploads.append({
            "name": safe_name,
            "path": str(file_path), 
        })

    return uploads