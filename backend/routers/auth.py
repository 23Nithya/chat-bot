from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse
from authlib.integrations.starlette_client import OAuth
from services.auth_service import create_access_token
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()

# Setup OAuth
oauth = OAuth()
oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"}
)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

@router.get("/auth/login")
async def login(request: Request):
    # Redirect user to Google login page
    redirect_uri = str(request.base_url) + "auth/callback"
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/auth/callback")
async def auth_callback(request: Request):
    try:
        # Exchange auth code for token
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get("userinfo")

        if not user_info:
            raise HTTPException(status_code=400, detail="Could not get user info")

        # Create our own JWT
        access_token = create_access_token({
            "sub": user_info["email"],
            "name": user_info["name"],
            "picture": user_info["picture"],
            "email": user_info["email"]
        })

        response = RedirectResponse(url=f"{FRONTEND_URL}/")
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,        # ← JS cannot access
            secure=False,          # ← HTTPS only (use False for local dev)
            samesite="lax",       # ← CSRF protection
            max_age=86400         # ← 24 hours in seconds
        )
        return response

        # Redirect to frontend with token as localstorage
        # return RedirectResponse(
        #     url=f"{FRONTEND_URL}/auth/success?token={access_token}"
        # )

    except Exception as e:
        return RedirectResponse(url=f"{FRONTEND_URL}/login?error=auth_failed")

@router.get("/auth/me")
async def get_current_user(request: Request):
    # Get token from Authorization header
    # auth_header = request.headers.get("Authorization")
    # if not auth_header or not auth_header.startswith("Bearer "):
    #     raise HTTPException(status_code=401, detail="Not authenticated")

    # token = auth_header.split(" ")[1]
    token = request.cookies.get("access_token")
    from services.auth_service import verify_token
    payload = verify_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return {
        "email": payload.get("email"),
        "name": payload.get("name"),
        "picture": payload.get("picture")
    }

@router.post("/auth/logout")
async def logout():
    return JSONResponse({"message": "Logged out successfully"})