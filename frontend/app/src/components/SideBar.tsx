import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeSideBar } from "../features/sideBar/sideBarSlice";
import { clearUser } from "../features/user/userSlice";
import { type AppDispatch, type RootState } from "../store";
import api from "../api";
import { Link, useNavigate } from "react-router";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { clearCart } from "../features/cart/cartSlice";

const SideBar: React.FC = () => {
    const sideBar = useSelector((state: RootState) => state.ui);
    const user = useSelector((state: RootState) => state.user);
    const [isShow, setIsShow] = useState<boolean>(true);
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate();

    const signOut = async () => {
        try {
            const response = await api.get("/clear-cookie");
            if (response) {
                dispatch(clearUser());
                dispatch(closeSideBar());
                dispatch(clearCart());
                navigate("/login");
            }
            
            
        } catch (error) {
            console.error(error);
        }
    }
    useLockBodyScroll(sideBar.sideBarOpen);
    if (!sideBar.sideBarOpen) return null;

    return(
        <>
            <div id="blur" className="fixed left-0 top-0 h-full w-full z-40 backdrop-blur-xs" onClick={() => dispatch(closeSideBar())}></div>
            <div id='side-bar' className={`fixed right-0 top-0 h-full w-100 bg-white z-50 shadow-lg px-4 py-2.5 ${isShow == true ? "animate-out-here" : "animation-out-away"}`}>
                <div 
                    id="cross-x"
                    onClick={() => {
                                setIsShow(false);
                                setTimeout(
                                    () => {dispatch(closeSideBar()); setIsShow(true)}, 300)
                            }}
                    className="  top-0 left-0 h-0 w-full relative cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 w-10 absolute top- right-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </div>
                <div id="user-info" className="flex items-center text-base w-full h-15 gap-2.5 mb-2.5">
                    <img src={user.avatar_url? `https://longing-heaven-backend.onrender.com/${user.avatar_url}` : "https://longing-heaven-backend.onrender.com/static/avatars/d-avatar.jpg"} alt="user-logo" className="size-12 rounded-full shadow-md" />
                    <span  id="user-name-email" className="flex flex-col">
                        {user.name} 
                        <span className="text-sm">{user.email}</span>
                    </span>
                </div>

                <div className="w-full h-px bg-gray-300/50"></div>

                <div id="profile-link" className="flex my-5 cursor-pointer" onClick={() => navigate("/my-profile/")}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 w-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <span className="hover:text-gray-600">My profile</span>
                </div>
                <div id="profile-link" className="flex my-5 roboto-slab-cho">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 w-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    <Link to={"/my-orders/"} className="hover:text-gray-600">My orders</Link>
                </div>
                <div className="w-full h-px bg-gray-300/50"></div>
                <div id="profile-link" className="flex my-5 cursor-pointer" onClick={() => signOut()}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 w-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                    </svg>
                    <span>Sign out</span>
                </div>
            </div>
        </>
        
    )
}

export default SideBar;

