import sys
import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Импорты ваших модулей
import app.core.redis as redis_module
from app.backend_admin_preload import initializate_admin
from app.core.database import async_session
from app.api import main

# 1. Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 2. Создание приложения (ОДИН РАЗ!)
app = FastAPI(title="Longing for heaven")

# 3. Настройка CORS (ДО подключения роутов)
origins = [
    "https://longing-heaven-frontend.onrender.com",
    "http://longing-heaven-frontend.onrender.com",
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# 4. Подключение статики (ОДИН РАЗ!)
static_path = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_path):
    app.mount("/static", StaticFiles(directory=static_path), name="static")
    logger.info(f"Static files mounted from: {static_path}")
else:
    logger.warning(f"Static directory not found: {static_path}")

# 5. События запуска
@app.on_event("startup")
async def startup_event():
    logger.info("Startup: initializing application...")
    
    # Инициализация Redis
    try:
        redis_module.init_redis()
        if redis_module.redis is not None:
            logger.info("Redis успешно инициализирован")
        else:
            logger.warning("Redis не инициализирован")
    except Exception as e:
        logger.error(f"Ошибка при подключении Redis: {e}")

    # Инициализация Админа
    try:
        async with async_session() as db:
            admin = await initializate_admin(db)
            if not admin:
                logger.warning("Не удалось создать администратора")
            else:
                logger.info("Администратор инициализирован")
    except Exception as e:
        logger.critical(f"Критическая ошибка БД при старте: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    if hasattr(redis_module, 'redis') and redis_module.redis is not None:
        await redis_module.redis.close()
        logger.info("Redis connection closed")

# 6. Подключение маршрутов
app.include_router(main.router)

@app.get("/", response_model=dict)
async def read_home():
    return {"data": "The main router of Longing for heaven application."}

if __name__ == "__main__":
    import uvicorn 
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)