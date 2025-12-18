from pydantic import Field, EmailStr, BaseModel
from uuid import UUID
from enum import Enum as PyEnum
from datetime import datetime   

class AdminBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50, description="Admin name")
    email: EmailStr = Field(..., description="Admin email adress")
    phone_number: str = Field(..., min_length=8, max_length=15, description="Admin phone number")
    avatar_url: str = Field("static/avatars/d-avatar.jpg", min_length=1)


class AdminCreate(AdminBase):
    password: str = Field(..., min_length=8, max_length=50)


class AdminRead(AdminBase):
    id: UUID

    model_config = {"from_attributes": True}


class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    email: EmailStr = Field(...)
    phone_number: str | None = Field(None, min_length=8, max_length=15)
    avatar_url: str = Field("static/avatars/d-avatar.jpg", min_length=1)
    country: str | None = Field(None, min_length=2, max_length=50, description="User country for shipping")
    city: str | None = Field(None, min_length=2, max_length=100, description="User city for shipping")
    street: str | None = Field(None, min_length=2, max_length=100, description="User street for shipping")

    
class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=50)


class UserPublic(UserBase):
    id: UUID

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=50)
    email: EmailStr | None= Field(None)
    phone_number: str | None = Field(None, min_length=8, max_length=15)
    avatar_url: str | None = Field(None, min_length=1)
    country: str | None = Field(None, min_length=2, max_length=50)
    city: str | None = Field(None, min_length=2, max_length=100)
    street: str | None = Field(None, min_length=2, max_length=100)


class UserUpdatePassword(BaseModel):
    current_password: str = Field(..., min_length=8, max_length=50)
    new_password: str = Field(..., min_length=8, max_length=50)


class UserRecoverPassword(BaseModel):
    token: str
    new_password: str


class ProductBase(BaseModel): 
    name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=255)
    price: int = Field(...)
    stock: int = Field(0)


class ProductCreate(ProductBase):
    pass


class ProductPublic(ProductBase):
    id: UUID

    images: list["ProductImagePublic"]
    sizes: list["ProductSizePublicS"]

    model_config = {"from_attributes": True}


class ProductPublicWithoutSP(ProductBase):
    id: UUID

    model_config = {"from_attributes": True}


class ProductUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    description: str | None = Field(None, min_length=1, max_length=255)
    price: int | None = Field(None)
    stock: int | None = Field(None)


class ProductImageBase(BaseModel):
    product_id: UUID = Field(...)
    photo_url: str = Field(..., min_length=1, max_length=255)


class ProductImageCreate(ProductImageBase): 
    pass


class ProductImagePublic(ProductImageBase):
    id: UUID
    created_at: datetime
    model_config = {"from_attributes": True}


class ProductImageUpdateUrl(BaseModel):
    photo_url: str = Field(..., min_length=1, max_length=255)


class SizeEnum(str, PyEnum):
    M = "m"
    L = "l"
    XL = "xl"
    XXL = "xxl"


class SizeBase(BaseModel):
    name: SizeEnum = Field(...)


class SizeCreate(SizeBase):
    pass


class SizePublic(SizeBase):
    id: UUID
    
    model_config = {"from_attributes": True}


class ProductSizeBase(BaseModel):
    product_id: UUID
    size_id: UUID
    quantity: int = Field(default=0, ge=0)


class ProductSizeCreate(ProductSizeBase):
    pass 


class ProductSizePublicP(ProductSizeBase):
    product: "ProductPublic"

    model_config = {"from_attributes": True}


class ProductSizePublicS(ProductSizeBase):
    size: "SizePublic"
    
    model_config = {"from_attributes": True}


class ProductSizePublic(ProductSizeBase):
    model_config = {"from_attributes": True}
    

class OrderStatus(str, PyEnum):
    PENDING = "pending"
    PAID = "paid"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    CANCELLED = "cancelled"
    RETURNED = "returned"


class PaymentStatusEnum(str, PyEnum):
    PENDING = "pending"     
    PAID = "paid"
    REFUNDED = "refunded"


class PaymentMethodEnum(str, PyEnum):
    CARD = "card"
    COD = "cod"


class OrderBase(BaseModel):
    user_id: UUID | None
    total_price: int = Field(..., ge=0)
    status: OrderStatus = Field(OrderStatus.PENDING)
    receiver_name: str = Field(..., min_length=1)
    receiver_phone: str = Field(..., min_length=10)
    receiver_email: EmailStr = Field(...)
    shipping_city: str = Field(..., min_length=1)
    shipping_street: str = Field(..., min_length=1)
    payment_method: PaymentMethodEnum = Field(PaymentMethodEnum.CARD)
    payment_status: PaymentStatusEnum = Field(PaymentStatusEnum.PENDING)
    
class OrderCreate(OrderBase):
    pass


class OrderPublic(OrderBase):
    id: UUID

    order_items: list["OrderItemPublic"]
    number: int
    created_at: datetime

    model_config = {"from_attributes": True}


class OrderRead(OrderBase):
    id: UUID
    
    model_config = {"from_attributes": True}


class OrderUpdate(BaseModel):
    total_price: int | None = Field(None, ge=0)
    status: OrderStatus | None = Field(None)
    receiver_name: str | None = Field(None, min_length=1)
    receiver_phone: str | None = Field(None, min_length=10)
    receiver_email: EmailStr | None = Field(None)
    shipping_city: str | None = Field(None, min_length=1)
    shipping_street: str | None = Field(None, min_length=1)
    payment_method: PaymentMethodEnum | None = Field(None)
    payment_status: PaymentStatusEnum | None = Field(None)


class OrderItemBase(BaseModel):
    order_id: UUID 
    product_id: UUID
    size_id: UUID
    quantity: int = Field(default=1, ge=1)
    thumbnail: str = Field(..., min_length=1)

class OrderItemCreate(OrderItemBase):
    pass


class OrderItemPublic(OrderItemBase):
    id: UUID

    product: "ProductPublicWithoutSP"
    size: "SizePublic"

    model_config = {"from_attributes": True}


class OrderItemUpdate(BaseModel):
    quantity: int | None = Field(None, ge=1)


class CartBase(BaseModel):
    user_id: UUID


class CartCreate(CartBase):
    pass


class CartPublic(CartBase):
    id: UUID

    cart_items: list["CartItemPublic"]

    model_config = {"from_attributes": True}


class CartItemBase(BaseModel):
    cart_id: UUID
    product_id: UUID
    size_id: UUID
    quantity: int = Field(default=1, ge=1)
    thumbnail: str = Field(..., min_length=1)


class CartItemCreate(CartItemBase):
    pass


class CartItemCreateWCart(BaseModel): #without cart
    product_id: UUID
    size_id: UUID
    quantity: int = Field(default=1, ge=1)
    thumbnail: str = Field(..., min_length=1)


class CartItemPublic(CartItemBase):
    id: UUID

    product: "ProductPublicWithoutSP"
    size: "SizePublic"

    model_config = {"from_attributes": True}


class CartItemUpdate(BaseModel):
    quantity: int | None = Field(None, ge=1)
    price: int | None = Field(None)


class TokenPayload(BaseModel):
    sub: str
    exp: float
    

class Message(BaseModel):
    data: str


class EmailRequest(BaseModel):
    email: EmailStr

OrderPublic.model_rebuild()
OrderItemPublic.model_rebuild()
CartPublic.model_rebuild()
CartItemPublic.model_rebuild()