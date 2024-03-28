import Layout from "@/components/Layout";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const {data: session} = useSession();

    const fetchData = async ()=>{
        await axios.get('http://localhost:8000/api/history/get-by-owner/'+session?.user?.id)
        .then(response => {setOrders(response.data)})
    }

    useEffect(() => {
        console.log(session?.user?.id)
        fetchData();
    }, [])

    function approve(order) {
        swal
          .fire({
            title: "Are you sure?",
            text: `Do you want to approve`,
            showCancelButton: true,
            cancelButtonTitle: "Cancel",
            confirmButtonText: "Yes, Approve!",
            confirmButtonColor: "#39e75f",
          })
          .then(async (result) => {
            if (result.isConfirmed) {
              const { _id } = order;
              const result = await axios.post("http://localhost:8000/api/history/approve",{historyId:id});
              if (result.data === "error") {
                swal.fire({
                  title: "Can' Delete!",
                  text: `Might have items in this category or child category`,
                  confirmButtonColor: "primary",
                });
              }
              fetchCategories();
            }
          });
      }

    return (
        <Layout>
            <table className='basic mt-2'>
                <thead>
                    <tr>
                        <td>No.</td>
                        <td>name</td>
                        <td>borrower</td>
                        <td>status</td>
                        <td>amount</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) =>(
                        <tr key={order._id}>
                            <td>{index+1}</td>
                            <td>{order.item.title}</td>
                            <td>{order.borrower.email}</td>
                            <td>{order.status}</td>
                            <td>{order.count}</td>
                            <td>{order.status==='pending'?
                            <button type="submit" onClick={()=>approve(order)}></button>
                            :<></>}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}