from fastapi import HTTPException, Request
from services.auth_service import verify_token

# Routes that don't need authentication
PUBLIC_ROUTES = [
    "/",
    "/auth/login",
    "/auth/callback",
    "/docs",
    "/openapi.json"
]

async def verify_request(request: Request):
    # Skip auth for public routes
    if request.url.path in PUBLIC_ROUTES:
        return

    # Check Authorization header
    # auth_header = request.headers.get("Authorization")
    # if not auth_header or not auth_header.startswith("Bearer "):
    #     raise HTTPException(
    #         status_code=401,
    #         detail="Authentication required"
    #     )
    # token = auth_header.split(" ")[1]
    
    # ✅ Read token from cookie instead of header
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    payload = verify_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    # Attach user info to request state
    request.state.user = payload