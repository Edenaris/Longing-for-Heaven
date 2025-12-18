from typing import Annotated, Any

from fastapi import APIRouter, Depends, Response, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm

from app.schemas import Message
from app.api.deps import SessionDep
from app.core.security import create_access_token, is_blocked, increment_attempts
from app.services.user import authenticate
import app.core.redis as redis_module
from app.utils.logger import logger

router = APIRouter(tags=["Login"])

@router.post("/login", response_model=Message)
async def login(
    db: SessionDep,
    response: Response,
    request: Request,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Any:
    """
    Authenticate a user using their email and password, and set an access token as a cookie.
    """

    
    
    db_user = await authenticate(db=db, user_email=form_data.username, password=form_data.password)

    if not db_user:
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password!"
        )
    
    access_token = create_access_token(sub=db_user.id)
    logger.info("Access token: %s ", access_token)

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="none"
    )
   

    return Message(data="Signed in successfully!")


@router.get("/clear-cookie", response_model=Message)
async def clear_cookie(response: Response):
    """
        This route is required to sign out from account and clear cookie data
    """
    response.delete_cookie("access_token")
    return Message(data="Cookie have been cleared!")