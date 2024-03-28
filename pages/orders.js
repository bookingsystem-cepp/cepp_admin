import Layout from "@/components/Layout";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Orders({ swal }) {
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
              const result = await axios.post("http://localhost:8000/api/history/approve",{historyId:_id});
              if (result.data === "error") {
                swal.fire({
                  title: "Can't Approve",
                  text: `Error to approve`,
                  confirmButtonColor: "primary",
                });
              }
              fetchData();
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
                            <td><Link className="" href={"/profile/"+order.borrower._id}>{order.borrower.email}</Link></td>
                            <td>{order.status}</td>
                            <td>{order.count}</td>
                            <td>{order.status==='pending'?
                            <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-full" type="submit" onClick={()=>approve(order)}>Approve</button>
                            :<></>}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}

export default withSwal(({ swal }, ref) => <Orders swal={swal} />);
