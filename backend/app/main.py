import sys
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Импорты ваших модулей
import app.core.redis as redis_module
from app.backend_admin_preload import initializate_admin
from app.core.database import async_session
from app.api import main

# 1. Настройка логирования (чтобы видеть ошибки в Render)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Longing for heaven")


# 2. Настройка CORS (Ставим это ДО подключения роутов)
origins = [
    "https://longing-heaven-frontend.onrender.com",
    "http://longing-heaven-frontend.onrender.com", # На случай, если будет http
    "http://localhost:3000", # Для локальной разработки
    "http://localhost:5173", # Vite дефолтный порт
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# 3. Подключение статики
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# 4. События запуска (ВАЖНО: без этого база данных не подключится и будет ошибка 500)
@app.on_event("startup")
async def startup_event():
    logger.info("Startup: initializing application...")
    
    # Инициализация Redis с обработкой ошибок
    try:
        redis_module.init_redis()
        if redis_module.redis is not None:
            logger.info("Redis успешно инициализирован")
        else:
            logger.warning("Redis не инициализирован (переменная равна None)!")
    except Exception as e:
        logger.error(f"Ошибка при подключении Redis: {e}")

    # Инициализация Админа / БД
    try:
        async with async_session() as db:
            admin = await initializate_admin(db)
            if not admin:
                logger.warning("Не удалось создать или получить администратора.")
                # sys.exit(1) # Лучше не убивать приложение сразу, а дать ему работать
            else:
                logger.info("Администратор инициализирован.")
    except Exception as e:
        logger.critical(f"Критическая ошибка базы данных при старте: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    if hasattr(redis_module, 'redis') and redis_module.redis is not None:
        await redis_module.redis.close()
        logger.info("Redis connection closed.")

# 5. Подключение маршрутов (Роуты подключаем в конце)
app.include_router(main.router)

@app.get("/", response_model=dict)
async def read_home():
    return {"data": "The main router of Longing for heaven application."}

if __name__ == "__main__":
    import uvicorn 
    # При деплое на Render хост обычно 0.0.0.0, порт берется из env, но для локального запуска:
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)