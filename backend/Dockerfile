
FROM python:3.8
WORKDIR /backend

COPY poetry.lock pyproject.toml ./

RUN pip install poetry

RUN poetry config virtualenvs.create false \
  && poetry config --list

RUN poetry install --no-dev

COPY . .
ENV PYTHONPATH=/backend/

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3333"]
