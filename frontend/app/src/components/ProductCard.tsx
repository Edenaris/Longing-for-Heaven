import React, {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router";

interface ProductCardProps {
    product: ProductProps;
    onAddToCart: (id: string, size_id: string, maxQuantity: number) => void;
    productIdsInCart: Set<string>;
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

const ProductCard: React.FC<ProductCardProps> = ({product, onAddToCart, productIdsInCart }) => {
    const [selectedSizeID, setSelectedSizeID] = useState<string>(product.sizes[0].size_id);
    const [hover, setHover] = useState<boolean>(false);
    const navigate = useNavigate();
    const maxQuantity = useRef(0);

    useEffect(() => {
        const pSize = product.sizes.find((temp_ps) => temp_ps.size_id === selectedSizeID)
        if (pSize) {
            maxQuantity.current = pSize.quantity;
        }
        console.log(product.images)
    }, [selectedSizeID])
    

    return(
        <div key={product.id} className={`flex flex-col  h-[550px] bg-white py-10 px-4 sm:w-[320px] items-center relative rounded-md hover:z-20 overflow-visible ${hover && "md:hover:shadow-[0_2px_10px_rgba(0,0,0,0.25)]"}`}   onMouseLeave={() => setHover(false)} >
            <div className="flex flex-col gap-3 group" onMouseEnter={() => setHover(true)}>
                <img src={`https://longing-heaven-backend.onrender.com/${product.images[0].photo_url}`} alt="" className="cursor-pointer h-[300px] min-w-[270px]" onClick={() => navigate(`/shop/${product.id}`)}/>
                <span className="font-normal">{product.name}</span>
                <span className="flex items-center gap-1">{product.price}
                    <svg fill="#000000" className="size-3" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 423.761 423.761" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M342.012,237.535H213.264c12.956-9.977,26.38-19.162,37.94-28.02c2.867-2.19,5.657-4.442,8.411-6.712h82.396 c11.703,0,21.185-9.483,21.185-21.184s-9.481-21.184-21.185-21.184H298.78c5.894-9.026,10.923-18.708,14.623-29.392 c9.528-27.547,4.776-59.267-11.159-83.374C262.057-13.134,179.492-8.639,121.998,21.565c-24.192,12.711-2.778,49.281,21.385,36.587 c28.538-14.992,60.222-21.76,91.431-11.499c21.35,7.019,39.082,26.4,40.932,49.184c2.087,25.827-13.554,47.487-31.599,64.61H81.749 c-11.7,0-21.185,9.484-21.185,21.184c0,11.701,9.484,21.184,21.185,21.184h107.966c-9.859,7.282-19.544,14.78-28.611,23.1 c-3.969,3.652-7.693,7.548-11.195,11.632h-68.16c-11.7,0-21.185,9.481-21.185,21.185c0,11.697,9.484,21.185,21.185,21.185h43.447 c-13.767,38.236-9.431,81.645,21.55,113.604c42.853,44.213,116.362,33.372,166.114,9.132c24.564-11.969,3.073-48.498-21.386-36.588 c-38.515,18.773-109.106,28.839-127.392-22.721c-8.79-24.789-4.176-45.482,7.19-63.422h170.738 c11.703,0,21.185-9.487,21.185-21.185C363.196,247.034,353.715,237.535,342.012,237.535z"></path> </g> </g></svg>
                </span>

                <div className={`flex gap-1 ${hover ? "block" : "md:hidden"} `}>
                    {product.sizes.map((pSize) => (
                        <button 
                            key={pSize.size_id}
                            disabled={pSize.quantity < 1}
                            onClick={() => setSelectedSizeID(pSize.size_id)} className={
                                `border-1 border-gray-400 rounded-sm 
                                py-1.5 w-8.5 text-center cursor-pointer
                            ${selectedSizeID === pSize.size_id && "bg-slate-400 text-white"}
                            ${pSize.quantity < 1 && "bg-slate-200 opacity-50"}
                            `}>
                            {pSize.size.name}
                        </button>

                    ))}
                </div>
                
                <button
                    disabled={productIdsInCart.has(`${product.id}-${selectedSizeID}`) || product.stock === 0 || maxQuantity.current < 1}
                    className={`mb-5 relative w-full p-2.5 rounded-xs duration-150 bg-slate-300 
                                ${productIdsInCart.has(`${product.id}-${selectedSizeID}`) || product.stock === 0 || maxQuantity.current < 1  ? "" : "hover:bg-slate-300/70 cursor-pointer" }
                                mt-5 ${hover ? "block" : "md:hidden"} transition-all`} 
                    onClick={() => onAddToCart(product.id, selectedSizeID, maxQuantity.current)}>
                    { productIdsInCart.has(`${product.id}-${selectedSizeID}`) ? "Already in cart" : "Add to cart"}
                </button>
            </div>
            
        </div>
    )
}

export default ProductCard;