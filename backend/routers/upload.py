from fastapi import APIRouter, UploadFile, File, HTTPException
from services.ingest import ingest_document
import shutil
import os

router = APIRouter()

UPLOAD_DIR = "uploaded_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Validate file type
    if not file.filename.endswith((".pdf", ".txt")):
        raise HTTPException(status_code=400, detail="Only PDF and TXT files allowed")

    # Save file
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Ingest into Pinecone
    chunk_count = ingest_document(file_path, file.filename)

    return {
        "message": f"File uploaded and ingested successfully",
        "filename": file.filename,
        "chunks_stored": chunk_count
    }