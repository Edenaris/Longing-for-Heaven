import React, { useState, useEffect, useRef, useMemo } from "react";
import api from "../api";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../store";
import { addToCart } from "../features/cart/cartSlice";
// import { useNavigate } from "react-router";



interface ProductProps {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    images: ProductImageProps[];
    sizes: ProductSizeProps[]
}

interface ProductImageProps {
    id: string;
    photo_url: string;
    product_id: string;
}

interface ProductSizeProps{
    size_id: string;
    product_id: string;
    quantity: number;
    size: {
        id: string,
        name: string;
    }
}



const Product: React.FC<{id: string}> = ({ id }) => {
    const [product, setProduct] = useState<ProductProps | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedImageID, setSelectedImageID] = useState<number>(0);
    const [selectedSizeID, setSelectedSizeID] = useState<string>('');
    const cart = useSelector((state: RootState) => state.cart);
    const user = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch<AppDispatch>();

    const maxQuantity =useRef(0);
    const navigate = useNavigate()

    const productIdsInCart = useMemo(
        () => new Set(cart.cart_items.map(item => `${item.product_id}-${item.size_id}`)),
        [cart.cart_items]
    );

    const handleAddToCart = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;
        const pSize = product.sizes.find(s => s.size_id == selectedSizeID)
        if (!pSize) return; // ✅ проверка

        if (!product) return;
        if (user.name) {
            try {
                const response = await api.post("/cart-items/create/user", {
                    product_id: product.id,
                    size_id: pSize.size_id,
                    quantity: quantity,
                    thumbnail: product.images[0].photo_url,
                });
                if (response) {
                    dispatch(addToCart({
                        id: response.data.id,
                        cart_id: response.data.cart_id,
                        size_id: response.data.size_id,
                        product_id: response.data.product.id,
                        thumbnail: response.data.thumbnail,
                        quantity: response.data.quantity,
                        product: {
                            id: response.data.product.id,
                            description: response.data.product.description,
                            price: response.data.product.price,
                            name: response.data.product.name,
                            stock: response.data.product.stock,
                        },
                        size: {
                            id: response.data.size.id,
                            name: response.data.size.name,
                        },
                        max_quantity: maxQuantity.current
                    }))
                }
            } catch (error) {
                console.error('Some error: ', error);
            }
        } else {
            dispatch(addToCart(
                {
                    id: crypto.randomUUID(),
                    cart_id: 'guest',
                    thumbnail: product.images[0].photo_url,
                    quantity: quantity,
                    product_id: product.id,
                    size_id: pSize.size_id,
                    product: {
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        stock: product.stock,
                    },
                    size: {
                        id: pSize.size_id,
                        name: pSize.size.name
                    },
                    max_quantity: maxQuantity.current
                }
            )) 
            console.log("added successfully!")
        }

    }

    useEffect(() => {
        if (!id) navigate("/");
    }, [id]);

    useEffect(() => {
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
        
        getProduct();
    }, [id])

    useEffect(() => {
        const pSize = product?.sizes.find((temp_ps) => temp_ps.size_id == selectedSizeID)
        if (pSize) {
            maxQuantity.current = pSize.quantity;
        }

    }, [selectedSizeID])

    useEffect(() => {
        if (product) {
            document.title = `Home - Shop - ${product.name} - Longing for Heaven`
        }
        if (product?.sizes?.length) {
            for (let pSize of product.sizes) {
                if (pSize.quantity > 0) {
                    setSelectedSizeID(pSize.size_id)
                    break
                }
                
            }
        }
    }, [product]);
    if (!product) return <div className="flex-grow w-300 justify-center items-center">Loading...</div>;

    
    return(
        <div id="product-container" className="flex-grow min-h-200 flex w-300 pt-20 pb-10   " >
            <div id="product-in-container" className="w-full flex gap-2.5 bg-white">

                <div id="product-picture-content" className="flex">
                    <div id="selector-pictures" className="flex flex-col  max-h-90 overflow-auto items-center ml-5 gap-2.5 w-25 select-none">
                        {
                            product.images.map((image, id) => (
                                <img key={image.id} className={`w-[81px] h-[90px] cursor-pointer duration-120 ${selectedImageID == id ? "brightness-80" : "hover:brightness-80"}`} src={`https://longing-heaven-backend.onrender.com/${image.photo_url}`} alt="product-image" onClick={() => setSelectedImageID(id)} />
                            )) 
                        }
                    </div>
                    <div id="selected-picture" className="w-130 border-gray-100  flex justify-center relative h-[390px] select-none">
                        <img src={`https://longing-heaven-backend.onrender.com/${product.images[selectedImageID].photo_url}`} alt="selected picture" className="w-[350px] h-[390px]"/>
                        <div onClick={() => setSelectedImageID(prev => prev > 0 ? prev -= 1 : product.images.length -1 )} className="h-full hover:bg-gray-800/10 duration-140 w-21.25 cursor-pointer ease-linear absolute left-0 top-0 flex items-center justify-center">
                        </div>
                        <div onClick={() => setSelectedImageID(prev => prev < product.images.length -1 ? prev+=1 : 0 )} className="h-full hover:bg-gray-800/10 duration-140 w-21.25 cursor-pointer ease-linear absolute right-0 top-0 flex items-center justify-center">
                        </div>
                    </div>
                </div>

                <div id="product-info-options" className="flex flex-col gap-5 w-full">
                    <div className="text-xl font-medium">{product.name}</div>


                    <div className="text-xl flex items-center gap-1 ">
                        <span>{product.price}</span>
                        <svg fill="#000000" className="size-3.5" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 423.761 423.761" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M342.012,237.535H213.264c12.956-9.977,26.38-19.162,37.94-28.02c2.867-2.19,5.657-4.442,8.411-6.712h82.396 c11.703,0,21.185-9.483,21.185-21.184s-9.481-21.184-21.185-21.184H298.78c5.894-9.026,10.923-18.708,14.623-29.392 c9.528-27.547,4.776-59.267-11.159-83.374C262.057-13.134,179.492-8.639,121.998,21.565c-24.192,12.711-2.778,49.281,21.385,36.587 c28.538-14.992,60.222-21.76,91.431-11.499c21.35,7.019,39.082,26.4,40.932,49.184c2.087,25.827-13.554,47.487-31.599,64.61H81.749 c-11.7,0-21.185,9.484-21.185,21.184c0,11.701,9.484,21.184,21.185,21.184h107.966c-9.859,7.282-19.544,14.78-28.611,23.1 c-3.969,3.652-7.693,7.548-11.195,11.632h-68.16c-11.7,0-21.185,9.481-21.185,21.185c0,11.697,9.484,21.185,21.185,21.185h43.447 c-13.767,38.236-9.431,81.645,21.55,113.604c42.853,44.213,116.362,33.372,166.114,9.132c24.564-11.969,3.073-48.498-21.386-36.588 c-38.515,18.773-109.106,28.839-127.392-22.721c-8.79-24.789-4.176-45.482,7.19-63.422h170.738 c11.703,0,21.185-9.487,21.185-21.185C363.196,247.034,353.715,237.535,342.012,237.535z"></path> </g> </g></svg>

                    </div>
                    <div className="flex flex-col gap-2.5">
                        <span>Size</span>
                        <div id="sizez-selector" className="flex gap-1">
                            
                            {product.sizes.map((pSize) => (
                                <button key={pSize.size.id} className={`
                                    border-1 border-gray-400 rounded-sm text-sm 
                                    py-2 w-10 text-center cursor-pointer
                                    ${selectedSizeID === pSize.size_id && "bg-slate-400 text-white"}
                                    ${pSize.quantity < 1 && "bg-slate-200 opacity-50"}
                                    `}
                                    disabled={pSize.quantity < 1}
                                    onClick={() => {setSelectedSizeID(pSize.size_id); setQuantity(1)}}
                                >
                                    {pSize.size.name.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                    {(product.stock === 0 ) && (
                        <span className="text-red-400">Not available</span>
                    )}
                    <form className="w-full flex gap-5" onSubmit={handleAddToCart}>
                        <div className="flex border-1 border-gray-200 gap-2.5 px-2.5">
                            <button type="button" className="text-3xl cursor-pointer" onClick={() => setQuantity((prev) => prev > 1 ? prev-=1 : prev)}>
                                -
                            </button>
                            <input
                                className="py-2 w-12.5 text-center text-xl" 
                                type="text"
                                value={quantity}    
                                maxLength={2}
                                readOnly 
                            />
                            <button type="button" className="text-2xl cursor-pointer" onClick={() => setQuantity((prev) => prev < maxQuantity.current ? prev+=1 : prev)}>
                                +
                            </button>
                        </div>
                        <button 
                            disabled={productIdsInCart.has(`${product.id}-${selectedSizeID}`) || product.stock === 0 || maxQuantity.current < 1}
                            className={`py-2 bg-slate-300 w-full cursor-pointer duration-120 ease-in
                                ${productIdsInCart.has(`${product.id}-${selectedSizeID}`) || product.stock === 0 ? "" : "hover:bg-slate-400/70"}
                            `}
                            type="submit"
                        >   
                                {productIdsInCart.has(`${product.id}-${selectedSizeID}`) ? "Already in the cart" : "Add to cart"}
                                
                        </button>
                    </form>
                    

                    <div>
                        <span>{product.description}</span>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Product;