import React, { useEffect, useState } from "react";
import {  useSelector } from "react-redux";
import { type RootState } from "../store";
import { useNavigate, Link } from "react-router";
import api from "../api";

interface OrderInterface {
    id: string,
    created_at: string,
    total_price: number,
    status: string,
    payment_method: string;
    number: number;
}

const UserOrders: React.FC = () => {
    const user = useSelector((state: RootState) => state.user)
    const navigate = useNavigate();
    const [orders, setOrders] = useState<OrderInterface[]>([]);

    const handleGetOrders = async () => {
        try {
            const response = await api.get("/orders/current-user/")
            setOrders(response.data)
            console.log(response.data);

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
        if(user.id) {
            handleGetOrders()
        }
    }, [user])

    useEffect(() => {
        console.log("Changed: ", orders);
    }, [orders])

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
                            <Link to={"/my-profile/"} className="hover:text-gray-600">My profile</Link>
                        </div>
                        <div id="profile-link" className="flex my-5 roboto-slab-cho">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 w-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            <span className="hover:text-gray-600">My orders</span>
                        </div>
                    </div>
                </div>

            </aside>
            <main className="w-full xl:w-200 flex flex-col">
                <h1 className="text-2xl pb-2.5 font-normal">Orders</h1>
                <div id="orders-list" className="w-200 h-full overflow-auto rounded-md">
                    <table className="border border-gray-400 rounded-md">
                        <thead className="">
                            <tr>
                                <th className="w-50 break-words border border-gray-300 bg-slate-400 font-normal text-white py-1">Number</th>
                                <th className="w-40 break-words border border-gray-300 bg-slate-400 font-normal text-white py-1">Date</th>
                                <th className="w-40 break-words border border-gray-300 bg-slate-400 font-normal text-white py-1">Total price</th>
                                <th className="w-30 break-words border border-gray-300 bg-slate-400 font-normal text-white py-1">Pay method</th>
                                <th className="w-40 break-words border border-gray-300 bg-slate-400 font-normal text-white py-1">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 && orders.map((oItem) => (
                                <tr key={oItem.id}>
                                    <td className="w-60 break-words text-center border border-gray-300 py-1">#{String(oItem.number).padStart(9, "0")}</td>
                                    <td className="w-40 break-words text-center border border-gray-300 py-1">{new Date(oItem.created_at).toLocaleDateString()}</td>
                                    <td className="w-40 break-words text-center border border-gray-300 py-1">
                                        <span className="inline-flex items-center gap-1 w-fit">
                                            {oItem.total_price}
                                            <svg fill="#000000" className="size-3" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 423.761 423.761" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M342.012,237.535H213.264c12.956-9.977,26.38-19.162,37.94-28.02c2.867-2.19,5.657-4.442,8.411-6.712h82.396 c11.703,0,21.185-9.483,21.185-21.184s-9.481-21.184-21.185-21.184H298.78c5.894-9.026,10.923-18.708,14.623-29.392 c9.528-27.547,4.776-59.267-11.159-83.374C262.057-13.134,179.492-8.639,121.998,21.565c-24.192,12.711-2.778,49.281,21.385,36.587 c28.538-14.992,60.222-21.76,91.431-11.499c21.35,7.019,39.082,26.4,40.932,49.184c2.087,25.827-13.554,47.487-31.599,64.61H81.749 c-11.7,0-21.185,9.484-21.185,21.184c0,11.701,9.484,21.184,21.185,21.184h107.966c-9.859,7.282-19.544,14.78-28.611,23.1 c-3.969,3.652-7.693,7.548-11.195,11.632h-68.16c-11.7,0-21.185,9.481-21.185,21.185c0,11.697,9.484,21.185,21.185,21.185h43.447 c-13.767,38.236-9.431,81.645,21.55,113.604c42.853,44.213,116.362,33.372,166.114,9.132c24.564-11.969,3.073-48.498-21.386-36.588 c-38.515,18.773-109.106,28.839-127.392-22.721c-8.79-24.789-4.176-45.482,7.19-63.422h170.738 c11.703,0,21.185-9.487,21.185-21.185C363.196,247.034,353.715,237.535,342.012,237.535z"></path> </g> </g></svg>
                                       </span>
                                    </td>
                                    <td className="w-30 break-words text-center border border-gray-300 py-1">{oItem.payment_method}</td>
                                    <td className="w-30 break-words text-center border border-gray-300 py-1">{oItem.status}</td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </table>
                    
                </div>
            </main>
        </div>
    )
}

export default UserOrders;