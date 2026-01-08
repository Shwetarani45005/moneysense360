# this is for the sklearn error fix (caused due to the joblib() loading the model)
# AttributeError: Can't get attribute '_RemainderColsList' on 
# <module 'sklearn.compose._column_transformer' from '/home/arka/Desktop/moneysense360/backend/venv_moneysense_360/lib/python3.12/site-packages/sklearn/compose/_column_transformer.py'>

# THE CODE MUST RUN BEFORE LOADING THE PICKLE MODEL BY THE joblib.load() FUNCTION, THUS, ADDDING AT THE VERY BEGINNING OF CODE EXECUTION...
# A MONKEY-PATCH, NOT INDUSTRIALLY RECOMMENDED.
# INDUSTRIALLY RECMENDED: RETRAIN THE MODEL WITH THE CODE:

from sklearn.compose import _column_transformer
class _RemainderColsList(list):
    pass

_column_transformer._RemainderColsList = _RemainderColsList

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from uploads_server_utils.routes import upload_router



app = FastAPI(
    title="MoneySense 360",
    description="Authentication Service",
    version="v1",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4500",
        "http://127.0.0.1:4500",
        "http://localhost:4500",
        "http://127.0.0.1:4500"
    ],
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=[
        "Authorization",
        "Content-Type"
    ],
)

@app.get("/")
def read_root():
    return {"message": "Moneysense 360 server is runnibg..."}

app.include_router(upload_router, prefix="/classify", tags=["Uploads"])