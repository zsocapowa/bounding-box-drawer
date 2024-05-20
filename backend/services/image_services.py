import boto3
from botocore.client import Config
from typing import BinaryIO
from sqlalchemy.orm import Session
from database.session import session_manager
from database.db_models import Picture, BoundingBox
from config import AWS_REGION, AWS_CLIENT_ID, AWS_CLIENT_SECRET, BUCKET

from logger import logger


def upload_img_to_s3(file: BinaryIO, file_name: str):
    client = boto3.client(
        service_name="s3",
        region_name=AWS_REGION,
        aws_access_key_id=AWS_CLIENT_ID,
        aws_secret_access_key=AWS_CLIENT_SECRET,
    )
    client.upload_fileobj(file, BUCKET, file_name)


def generate_presigned_img_url(file_name: str) -> str:
    client = boto3.client(
        service_name="s3",
        region_name=AWS_REGION,
        aws_access_key_id=AWS_CLIENT_ID,
        aws_secret_access_key=AWS_CLIENT_SECRET,
        config=Config(signature_version='s3v4')
    )
    presigned_url = client.generate_presigned_url(
        "get_object",
        Params={"Bucket": BUCKET, "Key": file_name},
        ExpiresIn=600
    )
    return presigned_url


def save_img_reference(db: Session, data: dict) -> dict:
    try:
        file_name = data.get("file_name")
        new_img_ref = Picture(**data)
        db.add(new_img_ref)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception(f"Failed to add new img to table, file_name: {file_name}, error: {e}")
    else:
        return {"file_id": new_img_ref.id, "file_name": new_img_ref.file_name}


def get_img_data(db: Session, img_id: str) -> dict:
    try:
        with session_manager() as db:
            picture = db.query(Picture).filter(Picture.id == img_id).one()
            bounding_boxes = picture.bounding_boxes
            boxes_data = [{"id": str(box.id), **box.box_data} for box in bounding_boxes]
            img_name = picture.file_name
        return {"img_id": img_id, "img_file_name": img_name, "img_boxes": boxes_data}
    except Exception as e:
        db.rollback()
        logger.exception(f"Failed to get img and boxes, img_id: {img_id}, error: {e}")


def get_img_references(db: Session) -> list:
    try:
        rows = db.query(Picture).all()
        relevant_fields = [{"file_id": str(row.id), "file_name": row.file_name} for row in rows]
    except Exception as e:
        db.rollback()
        logger.exception(f"Failed to get all images, error: {e}")
    else:
        return relevant_fields


def save_bounding_boxes(db: Session, img_id: str, boxes: list):
    try:
        bounding_boxes = [
            BoundingBox(picture_id=img_id, id=box.pop("id"), box_data=box)
            for box in boxes
        ]
        db.bulk_save_objects(bounding_boxes)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception(f"Failed to perform bulk insert for boxoes, error: {e}")
