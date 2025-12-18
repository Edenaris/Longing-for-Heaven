from typing import Annotated, Any

from fastapi import APIRouter, Depends, Response, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm

from app.schemas import Message
from app.api.deps import SessionDep
from app.core.security import create_access_token
from app.utils.logger import logger
from app.services.admin import authenticate
router = APIRouter(tags=["Admin login"])

@router.post("/admin/login", response_model=Message)
async def login(
    db: SessionDep,
    response: Response,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Any:
    """
    Authenticate an admin using their email and password, and set an access token as a cookie.
    """
    db_admin = await authenticate(db=db, admin_email=form_data.username, password=form_data.password)

    if not db_admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password!"
        )
    
    access_token = create_access_token(sub=db_admin.id)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="none"
    )

    return Message(data="Signed in successfully!")

