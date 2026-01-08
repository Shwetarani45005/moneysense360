from fastapi import APIRouter, File, UploadFile, HTTPException, status, Depends, Header
from .services import upload_file, upload_files 
from .schemas import SingleFileCreationModel, MultipleFilesCreationModel
from typing import List

upload_router = APIRouter()

@upload_router.post("/file", response_model=SingleFileCreationModel)
async def classify_file(file: UploadFile=File(...)):
    res = await upload_file(file)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Failed to upload document in db"
        )
    return res

@upload_router.post("/files", response_model=MultipleFilesCreationModel)
async def classify_files(files: List[UploadFile]=File(...)):
    res = await upload_files(files)
    
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Failed to upload document in db"
        )
    # return res 
    return {"files_list": res}