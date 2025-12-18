from typing import List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import ProductImage
from app.schemas import ProductImageCreate, ProductImageUpdateUrl
from app.utils.logger import logger

async def get_product_im_by_id(*, db: AsyncSession, product_im_id: UUID) -> ProductImage:
    db_product_im = await db.get(ProductImage, product_im_id)
    return db_product_im


async def get_product_ims_by_product_id(
    *,
    db: AsyncSession,
    product_id: UUID,
) -> List[ProductImage]:
    query = select(ProductImage)

    query = query.where(ProductImage.product_id == product_id)

    result = await db.execute(query)
    db_product_ims = result.scalars().all()

    return db_product_ims


async def get_product_ims(
    *,
    db: AsyncSession,
    offset: int = 0,
    limit: int = 20,
) -> List[ProductImage]:
    query = select(ProductImage)

    query.offset(offset=offset).limit(limit=limit)

    result = await db.execute(query)
    db_product_ims = result.scalars().all()

    return db_product_ims


async def create_product_im(
    *,
    db: AsyncSession,
    product_im_create: ProductImageCreate
) -> ProductImage:
    new_product_im = ProductImage(
        **product_im_create.model_dump()
    )

    logger.info(f"New product: {new_product_im}")

    db.add(new_product_im)
    await db.commit()
    await db.refresh(new_product_im)

    return new_product_im


async def update_product_im_path(
    *,
    db: AsyncSession,
    product_im_id: UUID,
    product_update_url: ProductImageUpdateUrl,
):
    db_product_im = await get_product_im_by_id(db=db, product_im_id=product_im_id)

    if not db_product_im:
        return None
    
    update_data = product_update_url.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        if v is not None:
            setattr(db_product_im, k, v)
    
    await db.commit()
    await db.refresh(db_product_im)

    return db_product_im


async def delete_product_im(
    *,
    db: AsyncSession,
    product_im_id: UUID,
) -> ProductImage:
    db_product_im = await get_product_im_by_id(db=db, product_im_id=product_im_id)

    if not db_product_im:
        return None
    
    await db.delete(db_product_im)
    await db.commit()

    return db_product_im