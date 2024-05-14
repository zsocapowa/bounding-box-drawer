import uuid

from sqlalchemy import Column, ForeignKey, Integer, String, UUID
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Picture(Base):
    __tablename__ = 'pictures'

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    file_name = Column(String)
    # TODO: add unique constraint to file_name?
    s3_path = Column(String)

    bounding_boxes = relationship("BoundingBox", back_populates="picture")


class BoundingBox(Base):
    __tablename__ = 'bounding_boxes'

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    label = Column(String)
    coordinates = Column(String)
    picture_id = Column(UUID, ForeignKey('pictures.id'))

    picture = relationship("Picture", back_populates="bounding_boxes")
