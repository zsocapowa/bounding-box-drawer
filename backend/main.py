import uuid

import uvicorn
from fastapi import FastAPI, Security, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from routes import image_routes

from config import ENV


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)


app.include_router(image_routes.router, prefix="/api")


@app.get("/health")
async def health():
    return {"msg": "ok"}


def main():
    if ENV == 'dev':
        uvicorn.run('main:app', host="0.0.0.0", port=3333, reload=True, reload_dirs=['/app'])
    uvicorn.run('main:app', host="0.0.0.0", port=3333)


if __name__ == "__main__":
    main()
