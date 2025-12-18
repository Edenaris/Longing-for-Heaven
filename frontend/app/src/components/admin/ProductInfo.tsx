import React, { useEffect, useState } from "react";
import api from "../../api";

interface ProductInfoProps {
    id: string;
    setProductInfoID: (value: string) => void;
}

interface ProductProps {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    images: ProductImageProps[];
    sizes: ProductSizesProps[];
}

interface ProductImageProps {
    id: string;
    photo_url: string;
    product_id: string;
}

interface ProductSizesProps {
    product_id: string;
    size_id: string;
    quantity: number;
    size: {
        id: string;
        name: string;
    }
}



const ProductInfo: React.FC<ProductInfoProps> = ({id, setProductInfoID}) => {
    const [product, setProduct] = useState<ProductProps>();

    const getProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            setProduct(response.data);
        } catch (error: any) {
            if (error.response) {
                console.error("Server error: ", error.response);
            } else {
                console.error("Network or other error: ", error);
            }
        } 
    }

    useEffect(() => {
        getProduct();
    }, []);
    if (!product) return <div>Error</div>;
    return (
        <>
        <div id="blur" className="fixed left-0 top-0 h-full w-full z-20 backdrop-blur-xs" onClick={() => setProductInfoID('')}></div>

        <div id="product-info-container" className="fixed w-250 h-screen bg-white z-30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 py-2.5 px-2.5">
            <div className="flex flex-col w-full h-full">
                <h1 className="self-center text-2xl font-semibold ">Product info</h1>
                <div className="w-1/2 flex flex-col gap-2.5 font-semibold">
                    <span className="self-center">Product description</span>
                    <span className="w-100">ID: <span className="font-normal">{product.id}</span></span>
                    <span>Name:  <span className="font-normal">{product.name}</span></span>
                    <span>Price: <span className="font-normal">{product.price}</span></span>
                    <span>Stock: <span className="font-normal">{product.stock}</span></span>
                    <span>Description: <br /> <span className="font-normal">{product.description}</span></span>
                </div>
                <div className="w-1/2 flex flex-col gap-2.5 font-semibold">
                    <span className="self-center">Product sizes</span>
                    {product.sizes.length > 0 && product.sizes.map((pSize) => (
                        <div key={pSize.size_id} className="flex w-full">
                            <span className="w-20">{pSize.size.name}</span>
                            <span>{pSize.quantity}</span>
                        </div>
                    ))}
                </div>
                <div className="w-1/2 flex flex-col gap-2.5 font-semibold">
                    <span className="self-center">Product images</span>
                    <div className="grid grid-cols-2 auto-rows-[150px] h-100 overflow-auto">

                    {product.images.length > 0 && product.images.map((image, index) => (
                        <div key={image.id} className="flex w-full justify-center gap-5 items-center">
                            <span>{index + 1}</span>
                            <img src={`https://longing-heaven-backend.onrender.com/${image.photo_url}`} alt="product-image" className="w-[108px] h-[120px]"/>
                        </div>
                    ))}
                    </div>

                </div>

            </div>
            
        </div>
        </>
    )
}

export default ProductInfo;