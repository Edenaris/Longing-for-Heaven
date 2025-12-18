from typing import List, Any
from uuid import UUID, uuid4
import os
import shutil

from fastapi import APIRouter, HTTPException, Query, status, UploadFile, File

from app.utils.logger import logger
from app.schemas import ProductImageCreate, ProductImagePublic, Message, ProductImageUpdateUrl
from app.services.product.image import (
    get_product_im_by_id,
    get_product_ims,
    get_product_ims_by_product_id,
    create_product_im,
    delete_product_im
)
from app.api.deps import SessionDep
from app.core.config import settings

router = APIRouter(prefix="/product-images", tags=["ProductImage"])


@router.get("/", response_model=List[ProductImagePublic])
async def read_product_images(
    db: SessionDep,
    offset: int = Query(0, title="Number of product images to skip."),
    limit: int = Query(20, title="Maximum number of products images to return.")
) -> Any:
    """
    Retrieve product images.
    """

    db_product_ims = await get_product_ims(db=db, offset=offset, limit=limit)

    if not db_product_ims:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product images were not found!")
    
    return db_product_ims


@router.get("/{product_im_id}", response_model=ProductImagePublic)
async def read_product_im_by_id(db: SessionDep, product_im_id: UUID) -> Any:
    """
    Retrieve product image by his id.
    """

    db_product_im = await get_product_im_by_id(db=db, product_im_id=product_im_id)

    if not db_product_im:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product image was not found!")
    
    return db_product_im


@router.get("/product/{product_id}", response_model=List[ProductImagePublic])
async def read_product_images_by_product_id(db: SessionDep, product_id: UUID) -> Any:
    """
    Retrieve product images by product id.
    """
    
    db_product_ims = await get_product_ims_by_product_id(db=db, product_id=product_id)

    if not db_product_ims:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product images were not found!")

    return db_product_ims


# reorganizate create function with receiving file and seving it in static proudcts/images
@router.post("/create", response_model=ProductImagePublic)
async def create_new_product_im(db: SessionDep, product_im_create: ProductImageCreate) -> Any:
    """
    Creating new product image.
    """

    new_product_image = await create_product_im(db=db, product_im_create=product_im_create)

    if not new_product_image:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong while creating new product image."
        )
    
    return new_product_image


@router.put("/{product_im_id}", response_model=ProductImagePublic)
async def update_product_image_path_by_id(
    db: SessionDep,
    product_im_id: UUID,
    product_update_url: ProductImageUpdateUrl,
):
    updated_product_im = await update_product_im_path(db=db, product_im_id=product_im_id, product_update_url=product_update_url)

    if not updated_product_im:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found!")
    
    return updated_product_im


@router.post("/upload/{product_id}", response_model=ProductImagePublic)
async def upload_new_product_image(db: SessionDep, product_id: UUID, file: UploadFile = File()) -> Any:
    """
    Uploadin new product image.
    """ 
    file_ext = file.filename.split(".")[-1]
    unique_filename = f"{uuid4()}.{file_ext}"

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    APP_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "..", ".."))
    # CURRENT PRODUCT .. ROUTERS .. API .. APP


    # MAKE PATH TO SAVE FILE
    product_image_dir = os.path.join(APP_DIR, settings.PRODUCT_UPLOAD_DIR)
    # product_image_dir = path/to/backend/app/static/products

    # and creating path to file
    file_path = os.path.join(product_image_dir, unique_filename)
    logger.info(f"{BASE_DIR}")
    logger.info(f"{APP_DIR}")
    logger.info(f"{product_image_dir}")
    logger.info(f"{file_path}")

    os.makedirs(product_image_dir, exist_ok=True) # creaing path to save images if not exists


    # creating file with unique name alias
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image_url = f"{settings.PRODUCT_UPLOAD_DIR}/{unique_filename}"

    uploaded_pi = await create_product_im(db=db, product_im_create=ProductImageCreate(product_id= product_id, photo_url=image_url))

    if not uploaded_pi:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong while creating new product image."
        )
    
    return uploaded_pi


@router.delete("/delete/{product_im_id}", response_model=Message)
async def delete_product_image_by_id(db: SessionDep, product_im_id: UUID) -> Any:
    """
    Deleting product image by his id
    """

    deleted_product_im = await delete_product_im(db=db, product_im_id=product_im_id)

    if not deleted_product_im:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product image was not found!")
    
    return Message(data="Product image deleted successfully!")