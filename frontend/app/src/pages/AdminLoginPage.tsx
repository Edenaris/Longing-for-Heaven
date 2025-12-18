import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router";

interface AdminLoginProps {
    email: string;
    password: string;
}

const AdminLoginPage: React.FC = () => {

    const [adminLogin, setAdminLogin] = useState<AdminLoginProps>(
        {
            email: "",
            password: "",
        }
    )
    
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent ) => {
        e.preventDefault();

        try {
            console.log("3");
            const response = await api.post("/admin/login", {
                username: adminLogin.email,
                password: adminLogin.password,
            }, {headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }});
            if (response.data) {
                console.log("5");
                navigate("/admin/page")
            }
        } catch ( error: any ) {
            console.log("4");
            if (error.response) {
                console.error("Server error: ", error.response);
            } else {
                console.error("Network or other error: ", error);
            }
        }
    }

    

    return(
        <div id="admin-login-layout" className="w-full h-full flex justify-center items-center">
            <form 
                className="w-100 h-120 flex flex-col items-center gap-5 shadow-lg rounded-lg p-10"
                onSubmit={handleLogin}
            >
                <h2 className="m-10 text-xl">LOGIN</h2>
                <div id="admin-login-email" className="w-full">
                    <input 
                        className="border-b-1 border-dotted pl-1 w-full outline-none"
                        type="email"
                        name="admin-email"
                        placeholder="Enter email"
                        required
                        value={adminLogin.email}
                        onChange={(e) => setAdminLogin({...adminLogin, email: e.target.value})}
                    />
                </div>
                <div id="admin-login-password" className="w-full">
                    <input 
                        className="border-b-1 border-dotted pl-1 w-full outline-none"
                        type="password"
                        name="admin-password"
                        placeholder="Enter password"
                        required
                        value={adminLogin.password}
                        onChange={(e) => setAdminLogin({...adminLogin, password: e.target.value})}
                    />
                </div>

                <button className="m-10 w-full py-2 px-8 border-1 rounded-xl text-white bg-blue-400 duration-120 cursor-pointer hover:bg-blue-500">
                    SIGN IN
                </button>
            </form>
        </div>
    )
}

export default AdminLoginPage;