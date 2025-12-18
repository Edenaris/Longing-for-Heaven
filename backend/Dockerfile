FROM python:3.13-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
 && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip \
 && pip install poetry==2.1.2

COPY README.md ./

COPY ./pyproject.toml ./poetry.lock ./

COPY ./app ./app

COPY ./alembic.ini ./

RUN poetry config virtualenvs.create false && poetry install --without dev --no-interaction --no-ansi

EXPOSE 8000

CMD sh -c "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"