import React, {useState, useEffect} from "react";
import api from "../../api";
import ProductForm from "./ProductForm";
import ProductInfo from "./ProductInfo";

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

const AdminProducts: React.FC = () => {
    const [products, setProducts] = useState<ProductProps[]>([])
    const [isProductFormVisible, setIsProductFormVisible] = useState<boolean>(false);
    const [productInfoID, setProductInfoID] = useState<string>('');

    const getProducts = async () => {
        try{
            const response = await api.get("/products");

            setProducts(response.data);
            console.log(response.data);
        } catch (error: any) {
            if (error.response) {
                console.error("Server error", error);
            } else {
                console.error("Network or other error: ", error);
            }
        }
    } 

    const handleRemoveProduct = async (productID: string) => {
        try {
            const response = await api.delete(`/products/delete/${productID}`)
            if (response) {
                getProducts();
            }
        } catch (error: any) {
            if (error.response) {
                console.error("Server error: ", error.response);
            } else {
                console.error("Netowork or other error: ", error);
            }
        }
    }

    useEffect(() => {
        getProducts();
    }, [])
    
    return(
        <>
        <div id="container-admin-products" className="w-full px-1 h-full sm:px-5 sm:pb-5 flex flex-col gap-5 relative font-medium bg-slate-800">
            <div className="w-full h-10 bg-slate-600 text-white flex justify-center items-center rounded-b-lg relative animate-out-top font-medium">
                PRODUCTS ADMINISTRATOR PANEL
            </div>
            <div id="content" className="w-full h-full flex flex-1 flex-col justify-end gap-5 p-2.5 bg-slate-600">

                <div id="all-products-container" className="w-full max-h-150 overflow-auto bg-slate-600 rounded-lg flex flex-col gap-5">
                    <table id="all-products" className="max-fullshadow-md rounded-lg">
                        <thead className="bg-slate-500 text-white text-xs sticky top-0">
                            <tr>
                                <th scope="col" className="border border-slate-400 w-50 px-1 py-3 text-center font-medium uppercase tracking-wider">Name</th>
                                <th scope="col" className="border border-slate-400 w-15 px-1 py-3 text-center font-medium uppercase tracking-wider">Price</th>
                                <th scope="col" className="border border-slate-400 w-15 px-1 py-3 text-center font-medium uppercase tracking-wider">Stock</th>
                                <th scope="col" className="border border-slate-400 w-20 px-1 py-3 text-center font-medium uppercase tracking-wider">Image</th>
                                <th scope="col" className="border border-slate-400 w-20 px-1 py-3 text-center font-medium uppercase tracking-wider">Options</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm  font-medium text-gray-500 uppercase bg-white">
                            {products.map((product) => (
                            <tr key={product.id} className="cursor-pointer" onClick={() => setProductInfoID(product.id)}>
                                <td scope="col" className="border border-slate-400 w-50 px-1 py-3 text-center tracking-wider">{product.name}</td>
                                <td scope="col" className="border border-slate-400 w-15 px-1 py-3 text-center tracking-wider">{product.price}</td>
                                <td scope="col" className="border border-slate-400 w-15 px-1 py-3 text-center tracking-wider">{product.stock}</td>
                                <td align="center" scope="col" className="border border-slate-400 w-20 px-2.5 py-3 tracking-wider bg-white">
                                    {product.images.length > 0 && <img className="size-15" src={`https://longing-heaven-backend.onrender.com/${product.images[0].photo_url}`} alt="img-first-picture" />}
                                </td>
                                <td scope="col" className="border border-slate-400 w-30 px-1 py-3 text-left tracking-wider" onClick={() => handleRemoveProduct(product.id)}>delete</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="py-2 mb-2.5 w-50 text-base text-white bg-gray-400/70 hover:bg-gray-400 duration-120 rounded-lg flex self-center items-center justify-center cursor-pointer" onClick={() => setIsProductFormVisible(true)}>
                        ADD PRODUCT
                    </div>
                </div>

                
            </div>

        </div>
        <ProductForm isVisible={isProductFormVisible} setIsVisible={setIsProductFormVisible}/>
        {productInfoID && <ProductInfo id={productInfoID} setProductInfoID={setProductInfoID}/> }
        
        </>
    )
}

export default AdminProducts;