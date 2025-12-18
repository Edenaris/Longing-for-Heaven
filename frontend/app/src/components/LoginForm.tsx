import React, { useState } from "react";
import googleIcon from "../assets/google.svg"
import facebookIcon from "../assets/facebook.svg"
import { Link, useNavigate } from "react-router";

import { useDispatch } from "react-redux";
import { type AppDispatch } from "../store";
import { setUser } from "../features/user/userSlice";
import { fillCart } from "../features/cart/cartSlice";
import api from "../api";

interface UserLoginInterface {
    username: string;
    password: string;
}

const LoginForm: React.FC = () => {
    const [isVisiblePassword, setIsVisiblePassword] = useState<boolean>(false);
    const [userLogin, setUserLogin] = useState<UserLoginInterface>({
        username: "",
        password: "",
    })

    const [error, setError] = useState<"password" | "server" | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();


    const getUser = async () => {
        try {
            const response = await api.get("/users/me")
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
                
        } catch (error) {
            console.error(error);
        }
    }
    
    const getCart = async () => {
        try {
            const response = await api.get("/carts/user/me");
            console.log("CART DATA: ",response.data);
            dispatch(fillCart(
                response.data.cart_items
            ))
        } catch (error) {
            console.log("Some error", error);
        }
    }

    const handleLogin = async (e:React.FormEvent) => {
        e.preventDefault();

        if (userLogin.password.length < 8) {setError("password"); return;}

        try{
            const response = await api.post("/login", {
                username: userLogin.username,
                password: userLogin.password,
            }, {headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }})
            console.log(response.data);
            await getUser();
            await getCart();
            navigate("/");

        } catch( error: any ) {
            if (error.response) {
                console.error("Server error: ", error.response);
                setError("server");
            } else {
                console.error("Network or other error: ", error);
            }
        }


    }

    return(
        <form className="w-90 h-130 bg-white border-0 border-black rounded-xl shadow-md shadow-gray-300 flex flex-col items-center gap-6 px-5 py-10
                        sm:w-120 sm:h-150 sm:text-base sm:px-10 sm:py-15"
        onSubmit={handleLogin}
        >
            <h2 className="font-normal text-3xl pb-3 sm:pb-5" >Login</h2>
            <div className="w-full flex flex-row gap-0 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clipRule="evenodd" />
                </svg>

                <input 
                    className="px-2 border-b-1 border-dotted border-black w-full text-md sm:text-lg outline-0 rounded-t-md"
                    type="email" 
                    placeholder="Email"
                    name="email"
                    autoComplete="email"
                    required
                    value={userLogin.username}
                    maxLength={255}
                    onChange={(e) => {
                        setUserLogin({...userLogin, username: e.target.value})
                    }}
                />
            </div>
            <div className="w-full flex flex-row gap-0 items-center relative mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
                </svg>
                <input 
                    className="px-2 border-b-1 border-dotted border-black w-full text-md sm:text-lg outline-0 rounded-t-md"
                    type={isVisiblePassword ? "text" : "password"}
                    placeholder="Password"
                    name="current-password"
                    autoComplete="current-password"
                    required
                    maxLength={50}
                    value={userLogin.password}
                    onChange={(e) =>{
                        setUserLogin({ ...userLogin, password: e.target.value})
                    }}
                
                />
                <button 
                    type="button"
                    className="absolute right-0" 
                    onClick={() => setIsVisiblePassword(!isVisiblePassword)}
                >    
                    {isVisiblePassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.745-1.745a10.029 10.029 0 0 0 3.3-4.38 1.651 1.651 0 0 0 0-1.185A10.004 10.004 0 0 0 9.999 3a9.956 9.956 0 0 0-4.744 1.194L3.28 2.22ZM7.752 6.69l1.092 1.092a2.5 2.5 0 0 1 3.374 3.373l1.091 1.092a4 4 0 0 0-5.557-5.557Z" clipRule="evenodd" />
                        <path d="m10.748 13.93 2.523 2.523a9.987 9.987 0 0 1-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 0 1 0-1.186A10.007 10.007 0 0 1 2.839 6.02L6.07 9.252a4 4 0 0 0 4.678 4.678Z" />
                    </svg>
                    ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                        <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clipRule="evenodd" />
                    </svg>
                    )
                    

                    }


                </button>
                {error == "password" && <span className="absolute top-full left-6.5 text-red-500 ">Password cannot be less than 8 characters.</span>}
                {error == "server" && <span className="absolute top-full left-6.5 text-red-500 ">Incorrect email or password.</span>}

            </div>
            
            <div className="flex flex-row w-full">
                <input type="checkbox"
                    className="mr-1.5"
                    id="remember-me"
                />
                <label htmlFor="remember-me">Remember me </label>

                <Link to="/forgot-password/" className="ml-auto text-blue-400 hover:text-blue-700">
                    Forgot password?
                </Link>

            </div>
            <button type="submit" className="w-full px-8 py-2 my-1 mb-4 sm:mb-0 bg-indigo-300 rounded-xl ease-in duration-120 cursor-pointer text-white hover:bg-indigo-400">
                SIGN IN
            </button>

            <div className="w-full flex items-center justify-center">
                <div className="h-1 w-2/5 border-b-1 border-gray-500 inline-block"></div>
                <span className="text-lg mx-4 flex justify-center">OR</span>
                <div className="h-1 w-2/5 border-b-1 border-gray-500 inline-block"></div>

            </div>

            <div className="flex w-full justify-center gap-3 my-auto">
                <img src={googleIcon} alt="Google" className="size-10 cursor-pointer"/>
                <img src={facebookIcon} alt="Facebook" className="size-10 cursor-pointer"/>

            </div>
            <span className="mt-3">Don't have an account yet?
                <Link to="/sign-up" className="text-blue-400 ml-1 hover:text-blue-700">
                    Sign up
                </Link>
                <Link to="/admin" className="text-blue-400 ml-1 hover:text-blue-700">
                    Admin
                </Link>
            </span>
        </form>
    )
}

export default LoginForm;