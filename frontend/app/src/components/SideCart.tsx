import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../store";
import { closeSideCart } from "../features/sideBar/sideBarSlice";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { Link, useNavigate } from "react-router";
import { removeFromCart, incrementQTY, decrementQTY } from "../features/cart/cartSlice";
import api from "../api";

const SideCart: React.FC = () => {
    const sideCart = useSelector((state: RootState) => state.ui);
    const user = useSelector((state: RootState) => state.user);
    const cart = useSelector((state: RootState) => state.cart);
    const [total, setTotal] = useState<number>(0);
    const [isShow, setIsShow] = useState<boolean>(true);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    useLockBodyScroll(sideCart.sideCartOpen);

    const handleRemoveFromCart = async (cartItemID: string) => {
        if (user.email) {
            try {
                const response = await api.delete(`/cart-items/delete/${cartItemID}`)
                if (response) dispatch(removeFromCart(cartItemID));
            } catch (error) {
                console.error("Some error: ", error);
            }
        } else {
            dispatch(removeFromCart(cartItemID))
        }
    }

    const handleIncrementQTY = async (cartItemID: string) => {
        if ( user.email ) {
            try {
                const response = await api.patch(`/cart-items/${cartItemID}/increment`)
                if (response) {
                    dispatch(incrementQTY(cartItemID));
                }
            } catch (error) {
                console.error("Some error while incrementing qty: ", error);
            }
        } else {
            dispatch(incrementQTY(cartItemID))
        }
    }

    const handleDecrementQTY = async (cartItemID: string) => {
        if ( user.email ) {
            try {
                const response = await api.patch(`/cart-items/${cartItemID}/decrement`)
                if (response) {
                    dispatch(decrementQTY(cartItemID));
                }
            } catch (error) {
                console.error("Some error while decrementing qty: ", error);
            }
        } else {
            dispatch(decrementQTY(cartItemID))
        }
    }

    useEffect(() => {
        let imggs = undefined;
        if (cart.cart_items) {
            imggs = cart.cart_items.map((cartItem) => cartItem.thumbnail  );
        }
        console.log(imggs)
    }, []);

    useEffect(() => {
        let total_price: number = 0;
        if (cart.cart_items) {
            total_price = cart.cart_items.reduce((summary, cartItem) => summary += cartItem.quantity * cartItem.product.price, 0)

        }
        setTotal(total_price);
    }, [cart.cart_items])

    

    if (!sideCart.sideCartOpen) return null;


    return(
        <>
        <div id="blur" className="fixed left-0 top-0 h-full w-full z-40 backdrop-blur-xs" onClick={() => dispatch(closeSideCart())}>
        </div>
        <div id='side-bar' className={`fixed right-0 top-0 h-full w-100 bg-white z-50 shadow-lg px-4 py-2.5 ${isShow == true ? "animate-out-here" : "animation-out-away"}`}>
            <div id="cross-x"
                onClick={() => {
                    setIsShow(false);
                    setTimeout(
                        () => {dispatch(closeSideCart()); setIsShow(true)}, 300)
                }}
                className="top-0 left-0 h-0 w-full relative cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 w-10 absolute right-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </div>
            <div id="cart-items-container" className="flex flex-col mt-10 gap-2.5 overflow-auto max-h-[800px]">
                { cart.cart_items && cart.cart_items.length === 0 && 
                    <span className="flex justify-center text-lg"> Your cart is empty...</span>
                }
                { cart.cart_items && cart.cart_items.length > 0 && cart.cart_items.map((cartItem) => (
                    <div key={cartItem.id} className="w-[350px] h-30 flex">
                        <img src={`https://longing-heaven-backend.onrender.com/${cartItem.thumbnail}`} alt="cart-item" onClick={() => navigate(`/shop/${cartItem.product_id}`)} className="h-[99px] w-[89.1px]"/>
                        <div id="info" className="flex flex-col w-full gap-1.5 pb-2.5 pl-2">
                            <span className="text-xl">{cartItem.product.name}</span>
                            <div id="price-increment" className="flex justify-between">
                                <span>{cartItem.product.price}</span>
                                
                                <div className="flex border-1 border-slate-100 w-20 items-center justify-evenly">
                                    <button className="w-8 hover:bg-gray-100 cursor-pointer" onClick={() => handleDecrementQTY(cartItem.id)}>-</button>
                                    <span className="w-4 text-center">{cartItem.quantity}</span>
                                    <button className="w-8 hover:bg-gray-100 cursor-pointer" onClick={() => handleIncrementQTY(cartItem.id)}>+</button>
                                </div>
                                
                            </div>
                            <div>
                                {cartItem.size.name.toUpperCase()}
                            </div>
                            <button onClick={() => handleRemoveFromCart(cartItem.id)} className="hover:text-slate-700 mt-auto cursor-pointer">Remove</button>
                        </div>
                    </div>
                ))}
                {cart.cart_items && cart.cart_items.length > 0 && (
                    <div className="w-full h-60 py-5 absolute bottom-0 left-0 flex flex-col gap-2">
                        <span className="indent-2 text-sm">Shipping cost</span>
                        <div className="h-px w-full bg-gray-300"></div>
                        <span className="indent-2">Total price: {total}</span>
                        <div className="flex flex-col justify-evenly h-full w-full px-5">
                            <Link to={'/shop/checkout'} className="w-full text-center border-1 py-2 border-gray-400 hover:border-gray-500/90 bg-gray-400 hover:bg-gray-500/90 duration-120 cursor-pointer ease-linear text-white">Checkout</Link>
                            <button onClick={() => dispatch(closeSideCart())} className="w-full border-[1.5px] py-2 border-gray-400 shadow-sm text-gray-600 hover:bg-gray-400 duration-150 ease-linear cursor-pointer hover:text-white">Continue shopping</button>
                        </div>
                    </div>
                )}

            </div>

        </div>
        
        </>
        
    )
}

export default SideCart;
