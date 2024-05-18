from fastapi import APIRouter, Request, HTTPException, File, UploadFile
from services.image_services import get_img_references
from database.session import session_manager

router = APIRouter(prefix='/images')


@router.post("/save")
async def save_image(image: UploadFile = File(...)) -> dict:
    try:
        return {"message": "Image uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/load")
def load_image() -> list:
    try:
        with session_manager() as db:
            img_list = get_img_references(db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    else:
        return img_list


@router.get("/overview")
def get_images_overview() -> list:
    try:
        with session_manager() as db:
            img_list = get_img_references(db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    else:
        return img_list


if __name__ == "__main__":
    with session_manager() as db:
        img_list = get_img_references(db)
    print("dddd")
