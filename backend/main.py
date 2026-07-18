from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from routers import upload, chat,auth
from middleware.auth_middleware import verify_request
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Study Chatbot API")

# Allow React frontend to talk to FastAPI
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY")
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        os.getenv("FRONTEND_URL", "")
    ],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api",dependencies=[Depends(verify_request)])
app.include_router(chat.router, prefix="/api",dependencies=[Depends(verify_request)])
app.include_router(auth.router)

@app.get("/")
def root():
    return {"status": "Study Chatbot API running"}