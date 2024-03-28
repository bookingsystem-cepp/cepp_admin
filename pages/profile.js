import Layout from "@/components/Layout";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const Profile = ()=> {
    const [user, setUser] = useState([]);
    const {data: session} = useSession();

    const fetchData = async ()=>{
        await axios.get('http://54.179.58.129:8000/api/user/get-by-id/'+session?.user?.id)
        .then(response => {setUser(response.data)})
    }

    useEffect(() => {
        fetchData();
    }, [])

    // function approve(order) {
    //     swal
    //       .fire({
    //         title: "Are you sure?",
    //         text: `Do you want to approve`,
    //         showCancelButton: true,
    //         cancelButtonTitle: "Cancel",
    //         confirmButtonText: "Yes, Approve!",
    //         confirmButtonColor: "#39e75f",
    //       })
    //       .then(async (result) => {
    //         if (result.isConfirmed) {
    //           const { _id } = order;
    //           const result = await axios.post("http://localhost:8000/api/history/approve",{historyId:_id});
    //           if (result.data === "error") {
    //             swal.fire({
    //               title: "Can't Approve",
    //               text: `Error to approve`,
    //               confirmButtonColor: "primary",
    //             });
    //           }
    //           fetchData();
    //         }
    //       });
    //   }

    return (
        <Layout>
            <div className="mx-auto max-w-242.5">
                <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-5">
                    <div className="text-3xl pb-5">profile</div>
                    <img src={user?.image} ></img>
                    <div className="text-xl py-5">username : {user?.username}</div>
                    <div className="text-xl pb-5">name : {user?.name}</div>
                    <div className="text-xl pb-5">email : {user?.email}</div>
                    <div className="text-xl pb-5">scores : {user?.scores}</div>
                    <div className="text-xl pb-5">year : {user?.year}</div>
                </div>
            </div>
        </Layout>
    );
}

export default Profile;