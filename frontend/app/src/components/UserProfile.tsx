import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../store";
import { setUser } from "../features/user/userSlice";
import { Link, useNavigate } from "react-router";
import api from "../api";
import { PatternFormat } from "react-number-format";
import { clearUser } from "../features/user/userSlice";
import { clearCart } from "../features/cart/cartSlice";

interface ChanePasswordInterface {
    current_password: string;
    new_password: string;
}

interface changeUserInfoInterface {
    name: string;
    email: string;
    phone_number: string;
    city: string;
    street: string;
}

const UserProfile: React.FC = () => {
    const user = useSelector((state: RootState) => state.user)
    const [isChangePasswordForm, setIsChangePasswordForm] = useState<boolean>(false);
    const [isChangeUserInfoForm, setIsChangeUserInfoForm] = useState<boolean>(false);
    const [changeUserInfo, setChangeUserInfo] = useState<changeUserInfoInterface>({
        name: user.name!,
        email: user.email!,
        phone_number: user.phone_number ? user.phone_number : "",
        city: user.city ? user.city : "",
        street: user.street ? user.street : "",
    })
    const [changePassword, setChangePassword] = useState<ChanePasswordInterface>({
        current_password: '',
        new_password: ''
    });
    const [isDeleteAccountForm, setIsDeleteAccountForm] = useState<boolean>(false);
    const [error, setError] = useState<"passwords" | "phone_number" | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();


    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (changePassword.current_password == changePassword.new_password) {setError("passwords"); return};
        setError(null);

        const updatePasswords = {
            'current_password': changePassword.current_password,
            'new_password': changePassword.new_password
        }

        try {
            const response = await api.patch("/users/update-password/my", updatePasswords);

            console.log(response.data);
        } catch (error: any) {
            if (error.response) {
                console.error("Server error: ", error.response);
            } else {
                console.error("Network or other error: ", error);
            }
        }
    }

    const handleUpdateUserInfo = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!changeUserInfo.phone_number.startsWith("0")) {setError("phone_number"); return};
        
        try {
            const response = await api.put("/users/update/me", changeUserInfo);
            console.log(response);
            setIsChangeUserInfoForm(false);
            const { id, name, email, phone_number, avatar_url, country, city, street } = response.data;
            dispatch(setUser({
                "id": id,
                "name": name,
                "email": email ,
                "phone_number": phone_number,
                "avatar_url": avatar_url,
                "country": country,
                "city": city,
                "street": street,
            }));

        } catch (error: any) {
            if (error.response) {
                console.error("Server error: ", error.response);
            } else {
                console.error("Network or other error: ", error);
            }
        }
    }

    const handleDeleteAccount = async (e: React.FormEvent) => {
        e.preventDefault() 
        try {
            const response = await api.delete("/users/delete/me");
            console.log(response.data);
            dispatch(clearUser());
            dispatch(clearCart())
            navigate("/")
        } catch (error: any) {
            if (error.response) {
                console.error("Server error: ", error.response);
            } else {
                console.error("Network or other error: ", error);
            }
        }
    }

    useEffect(() => {
        if (!user.email) {
            navigate('/')
        }
    }, [user.email, navigate])

    useEffect(() => {
        document.body.style.overflow = isDeleteAccountForm ? 'hidden' : '';
        console.log("yeah")
    }, [isDeleteAccountForm]);

    if (!user.id) return null;

    return(
        <div id="user-profile-container" className="xl:w-300 h-160 pt-10 flex justify-center">
            <aside className="min-w-100 flex flex-col">
                <div id="user-nav" className=" flex flex-col px-5" >
                    <div id="short-user-info" className="flex gap-1 items-center w-full mb-5" >
                        {user.avatar_url ? ( 
                            user.avatar_url.startsWith("s") ? (
                                <img src={`https://longing-heaven-backend.onrender.com/${user.avatar_url}`} alt="user-avatar" className="size-14 rounded-full mr-2.5 shadow-md"/> 
                            ) : ( 
                                <img src={user.avatar_url} alt="user-avatar" className="size-10 rounded-full mr-2.5"/>
                            )
                        ) : null}
                        
                        <div className="flex flex-col">
                            <span className="text-base">{user.name}</span>
                            <span className="text-sm">{user.email}</span>
                        </div>
                    </div>
                    <div className="w-full h-px bg-gray-300/50"></div>

                    <div id="nav-container">
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
                    </div>
                </div>

            </aside>
            <main className="w-full xl:w-200 flex flex-col">
                <h1 className="text-2xl pb-2.5 font-normal">Profile</h1>
                { isChangeUserInfoForm ? (
                <form id="user-info-container" className="flex flex-col items-center mb-5 w-full" onSubmit={handleUpdateUserInfo}>
                    <div id="sup-div" className="flex w-200">
                        <div id="main-info" className="flex flex-col gap-2.5 w-100">
                            <div className="flex flex-col">
                                <label htmlFor="change-input-name" className="text-gray-500 text-sm">Name</label>
                                <input 
                                    className="border-b-1 border-dotted w-[90%] outline-none"
                                    id="change-input-name"
                                    name="name"
                                    autoComplete="cc-name"
                                    value={changeUserInfo.name}
                                    onChange={(e) => setChangeUserInfo({...changeUserInfo, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="change-input-email" className="text-gray-500 text-sm">Email</label>
                                <input 
                                    className="border-b-1 border-dotted w-[90%] outline-none"
                                    id="change-input-email"
                                    name="email"
                                    autoComplete="email"
                                    value={changeUserInfo.email}
                                    onChange={(e) => setChangeUserInfo({...changeUserInfo, email: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="change-input-phone" className="text-gray-500 text-sm">Phone number</label>
                                <PatternFormat 
                                    className="border-b-1 border-dotted w-[90%] outline-none"
                                    inputMode="numeric"
                                    type="text"
                                    id="change-input-phone"
                                    placeholder="Phone number"
                                    value={changeUserInfo.phone_number}
                                    onValueChange={(e) => {
                                        setChangeUserInfo({ ...changeUserInfo, phone_number: e.value });
                                    }}
                                    format="+38 (###) ###-##-##"
                                    mask="_"
                                />
                            </div>
                        </div>
                        <div id="shipping-info" className="w-100 flex flex-col gap-2.5">
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">Country</span>
                                { user.country ? <span>{user.city}</span> : <span>Ukrainian</span> }
                            </div>  
                            <div className="flex flex-col">
                                <label htmlFor="change-input-city" className="text-gray-500 text-sm">City</label>
                                <input 
                                    className="border-b-1 border-dotted w-[90%] outline-none"
                                    id="change-input-city"
                                    name="address-level2"
                                    autoComplete="address-level2"        
                                    value={changeUserInfo.city}
                                    onChange={(e) => setChangeUserInfo({...changeUserInfo, city: e.target.value})}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="change-input-street-address" className="text-gray-500 text-sm">Street</label>
                                <input 
                                    className="border-b-1 border-dotted w-[90%] outline-none"
                                    id="change-input-street-address"
                                    name="street-address"
                                    autoComplete="street-address"
                                    value={changeUserInfo.street}
                                    onChange={(e) => setChangeUserInfo({...changeUserInfo, street: e.target.value})}
                                />
                            </div>

                        </div>
                    </div>
                        <button 
                            className="py-2 w-[210px] my-2.5 bg-slate-200 hover:bg-slate-300 stone-700 hover:text-stone-100 duration-120 ease-in cursor-pointer" 
                            type="submit"
                        >
                            Submit
                        </button>

                </form>
                ) : (
                <div id="user-info-container" className="flex mb-5">
                    <div id="main-info" className="flex flex-col gap-2.5 w-100">
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-sm">Name</span>
                            <span>{user.name}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-sm">Email</span>
                            <span>{user.email}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-sm">Phone number</span>
                            <span>{user.phone_number}</span>
                        </div>
                    </div>
                    <div id="shipping-info" className="w-100 flex flex-col gap-2.5">
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-sm">Country</span>
                            { user.country ? <span>{user.country}</span> : <span>Ukrainian</span> }
                        </div>  
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-sm">City</span>
                            {user.city ? <span>{user.city}</span> : <span>None</span>}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-sm">Street</span>
                            {user.street ?<span>{user.street}</span> : <span>None</span> }
                        </div>
                        
                    </div>
                    
                </div> )}

                <button 
                    className={`
                        py-2 w-[210px] bg-slate-200 hover:bg-slate-300 stone-700 hover:text-stone-100 duration-120 ease-in cursor-pointer
                        ${isChangeUserInfoForm ? "animate-to-cross" : ""}   
                    `}
                    onClick={() => setIsChangeUserInfoForm(!isChangeUserInfoForm)}
                >
                    {isChangeUserInfoForm ? "X" : "Edit info"}
                </button>
                
                <div className="w-full h-px bg-gray-300/50 my-3"></div>
                <div id="password-actions">
                    <button 
                        className={`
                            py-2 w-[210px] mr-1 bg-slate-200 hover:bg-slate-300 stone-700 hover:text-stone-100 duration-120 ease-in cursor-pointer
                            ${isDeleteAccountForm ? "animate-to-cross" : ""}   
                        `}
                        onClick={() => { setIsDeleteAccountForm(!isDeleteAccountForm); setIsChangePasswordForm(false) }}
                    >
                        {isDeleteAccountForm ? "X" : "Delete account"}
                    </button>
                    <button 
                        className={`
                            py-2 w-[210px] bg-slate-200 hover:bg-slate-300 stone-700 hover:text-stone-100 duration-120 ease-in cursor-pointer
                            ${isChangePasswordForm ? "animate-to-cross" : ""}   
                        `}
                        onClick={() => { setIsChangePasswordForm(!isChangePasswordForm); setIsDeleteAccountForm(false) }}
                    >
                        {isChangePasswordForm ? "X" : "Change password"}
                    </button>
                    {isDeleteAccountForm && 
                        <>
                        <div id="blur" className="fixed inset-0 h-screen w-screen z-40 backdrop-blur-xs" onClick={() => setIsDeleteAccountForm(false)}>
                        </div>
                        <form className="fixed z-50" onSubmit={handleDeleteAccount}>
                            <div className="z-50 fixed flex flex-col items-center">
                                <span>Do your really want to delete account ?</span>
                                <button className=" py-2 w-[210px] bg-slate-200 hover:bg-slate-300 stone-700 hover:text-stone-100 duration-120 ease-in cursor-pointer my-2" type="submit">Yes</button>
                                <button className=" py-2 w-[210px] bg-slate-200 hover:bg-slate-300 stone-700 hover:text-stone-100 duration-120 ease-in cursor-pointer" onClick={() => setIsDeleteAccountForm(false)}>No</button>
                            </div>
                        </form>
                        </>
                    }
                    {isChangePasswordForm &&
                        <form className="flex flex-col gap-2.5 w-100" onSubmit={handleUpdatePassword}>
                            <div className="flex flex-col gap-2 mt-2.5">
                                <label htmlFor="current-password" className="text-gray-500 text-sm">Current password</label>
                                <input
                                    className="w-50 border-b-1 border-dotted outline-none border-gray-900"
                                    id="current-password"
                                    autoComplete="current-password"
                                    type="password"
                                    value={changePassword.current_password}
                                    onChange={(e) => setChangePassword({ ...changePassword, current_password: e.target.value})}
                                    placeholder="Enter new password"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="new-password" className="text-gray-500 text-sm">New password</label>
                                <input
                                    className="w-50 border-b-1 border-dotted outline-none border-gray-900"
                                    id="new-password"
                                    autoComplete="new-password"
                                    type="password"
                                    value={changePassword.new_password}
                                    onChange={(e) => setChangePassword({ ...changePassword, new_password: e.target.value})}
                                    placeholder="Enter new password"
                                    required
                                />
                            </div>
                            {error == "passwords" && <span className="text-red-400">Pasword can not be like previous</span>}
                            <button className="self-start py-2 w-[210px] bg-slate-200 hover:bg-slate-300 stone-700 hover:text-stone-100 duration-120 ease-in cursor-pointer" type="submit">SUBMIT</button>
                        </form>
                    
                    }
                </div>
                    
            </main>
        </div>
    )
}

export default UserProfile;