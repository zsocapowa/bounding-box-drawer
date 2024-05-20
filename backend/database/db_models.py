import uuid

from sqlalchemy import Column, ForeignKey, Integer, String, UUID
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import MetaData

metadata = MetaData(schema="public")

Base = declarative_base(metadata=metadata)


class Picture(Base):
    __tablename__ = 'pictures'

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    file_name = Column(String)

    bounding_boxes = relationship("BoundingBox", back_populates="picture")


class BoundingBox(Base):
    __tablename__ = 'bounding_boxes'

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    picture_id = Column(UUID, ForeignKey('pictures.id'))
    box_data = Column(JSONB)

    picture = relationship("Picture", back_populates="bounding_boxes")
