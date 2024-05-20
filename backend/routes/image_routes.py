from fastapi import APIRouter, HTTPException, File, UploadFile
from services.image_services import get_img_references, save_img_reference, save_bounding_boxes, upload_img_to_s3, \
    generate_presigned_img_url, get_img_data
from database.session import session_manager
from database.db_models import Picture
from backend.config import BUCKET

router = APIRouter(prefix='/images')


@router.post("/upload")
async def save_image(image: UploadFile = File(...)) -> dict:
    try:
        upload_img_to_s3(image.file, image.filename)
        with session_manager() as db:
            new_img_data = save_img_reference(db, {"file_name": image.filename})
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    else:
        return new_img_data


@router.post("/save")
async def save_image(img_data: dict):
    try:
        with session_manager() as db:
            img_id = img_data.get("imgage_id")
            boxes = img_data.get("boxes")
            save_bounding_boxes(db, img_id, boxes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/load")
def load_image(img_id: str) -> dict:
    try:
        with session_manager() as db:
            img_dict = get_img_data(db, img_id)
            # TODO: this doesnt't work, probably AWS permission related issue, templ solution is added
            # img_dict["url"] = generate_presigned_img_url(img_dict.get("img_file_name"))
            file_name = img_dict.get("img_file_name")
            img_dict["url"] = f"https://{BUCKET}.s3.eu-central-1.amazonaws.com/{file_name}"
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    else:
        return img_dict


@router.get("/overview")
def get_images_overview() -> list:
    try:
        with session_manager() as db:
            img_list = get_img_references(db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    else:
        return img_list
