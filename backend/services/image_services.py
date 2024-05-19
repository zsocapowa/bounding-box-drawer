from sqlalchemy.orm import Session

from database.session import session_manager
from database.db_models import Picture, BoundingBox

from logger import logger


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


def get_img_references(db: Session) -> list:
    try:
        rows = db.query(Picture).all()
        relevant_fields = [{"file_id": str(row.id), "file_name": row.file_name} for row in rows]
    except Exception as e:
        db.rollback()
        logger.exception(f"Failed to get all images, error: {e}")
    else:
        return relevant_fields


if __name__ == "__main__":
    with session_manager() as db:
        rows = get_img_references(db)
        relevant_fields = [{"file_id": str(row.id), "file_name": row.file_name} for row in rows]
        print("dd")
    # file_list = [
    #     {
    #         "file_name": "picture1.jpg",
    #         "s3_path": "s3://bucket/picture1.jpg"
    #     },
    #     {
    #         "file_name": "picture2.jpg",
    #         "s3_path": "s3://bucket/picture2.jpg"
    #     },
    #     {
    #         "file_name": "picture3.jpg",
    #         "s3_path": "s3://bucket/picture3.jpg"
    #     }
    # ]
    # with session_manager() as db:
    #     for file in file_list:
    #         save_img_reference(db, file)
