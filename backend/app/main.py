import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import app.core.redis as redis_module
from app.backend_admin_preload import initializate_admin
from app.core.database import async_session
from app.api import main



app = FastAPI(title="Longing for heaven")

app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.include_router(main.router)

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


# @app.on_event("startup")
# async def startup_event():
#     print("Startup: initializing Redis...")
#     redis_module.init_redis()
#     if redis_module.redis is not None:
#         print("Redis успешно инициализирован")
#     else:
#         print("Redis не инициализирован!")

#     async with async_session() as db:
#         admin = await initializate_admin(db)
#         if not admin:
#             print("Не удалось создать или получить администратора. Завершение приложения.")
#             sys.exit(1)


    

# @app.on_event("shutdown")
# async def shutdown_event():
#     if redis_module.redis is not None:
#         await redis_module.redis.close()


@app.get("/", response_model=dict)
async def read_home():
    return {"data": "The main router of Longing for heaven application."}

if __name__ == "__main__":
    import uvicorn 
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
    