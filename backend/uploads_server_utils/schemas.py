from pydantic import BaseModel
from typing import List

class SingleFileCreationModel(BaseModel):
    file_name: str
    file_loc: str
    # classification_details: List[dict]
    classification_details: dict

    class Config:
        from_attributes = True

class MultipleFilesCreationModel(BaseModel):
    files_list: List[SingleFileCreationModel]