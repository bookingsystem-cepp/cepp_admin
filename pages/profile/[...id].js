import Layout from "@/components/Layout";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Profile = ()=> {
    const router = useRouter();
    const {id} = router.query;
    const [user, setUser] = useState([]);

    const fetchData = async ()=>{
        await axios.get('https://backend.tirk101.online/api/user/get-by-id/'+id)
        .then(response => {setUser(response.data)})
    }

    useEffect(() => {
        fetchData();
    }, [])
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