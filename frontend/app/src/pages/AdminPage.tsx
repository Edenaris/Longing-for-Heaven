import React, { useEffect, useState } from "react";
import AdminSideBar from "../components/admin/AdminSideBar";
import AdminProducts from "../components/admin/AdminProducts";
import AdminUsers from "../components/admin/AdminUsers";
import AdminOptions from "../components/admin/AdminOptions";
import AdminOrders from "../components/admin/AdminOrders";
import api from "../api";
import { useNavigate } from "react-router";

const AdminPage: React.FC = () => {
    const [choosenRow, setChoosenRow] = useState<"users" | "products" | "orders" | "options" | null>(null);
    const navigate = useNavigate()
    useEffect(() => {
        const checkAdmin = async () => {
            try {
                console.log("1");
                const response = await api.get("/admins/current")
                console.log(response.data);
                
            }   catch (error) {
                console.log("2");
                console.log("Error", error);
                navigate("/")
            }
        } 
        checkAdmin()
    })

    return(
        <div id="admin-layout" className="h-screen bg-slate-800 flex ">
            <AdminSideBar choosenRow={choosenRow} setChoosenRow={setChoosenRow} />
            <div className="flex-1 overflow-hidden">
                {choosenRow === "users" && <AdminUsers />}
                {choosenRow === "products" && <AdminProducts />}
                {choosenRow === "orders" && <AdminOrders />}
                {choosenRow === "options" && <AdminOptions />}
            </div>
        </div>
    )
}

export default AdminPage;
