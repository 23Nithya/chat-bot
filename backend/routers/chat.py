from fastapi import APIRouter
from pydantic import BaseModel
from services.chatbot import get_answer

router = APIRouter()

class ChatRequest(BaseModel):
    question: str
    session_id: str = "default"

class ChatResponse(BaseModel):
    answer: str
    sources: list[str]

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    answer, sources = get_answer(request.question, request.session_id)
    return ChatResponse(answer=answer, sources=sources)