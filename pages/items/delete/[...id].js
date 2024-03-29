import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect,useState } from "react";

export default function DeleteItemPage() {
    const router = useRouter();
    const [itemInfo, setItemInfo] = useState();
    const {id} = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('https://backend.tirk101.online/api/item/get-by-id/'+id).then(response => {
            setItemInfo(response.data);
        });
    }, [id]);
    function goBack() {
        router.push('/items');
    }    
    async function deleteItem() {
        await axios.delete('https://backend.tirk101.online/api/item/delete/'+id);
        goBack();
    }
    return (
        <Layout>
            <h1 className="text-center">Do you really want to delete &nbsp;"{itemInfo?.title}"?</h1>
            
            <div className='flex gap-2 justify-center'>
                <button className='btn-red' onClick={deleteItem}>Yes</button>
                <button className='btn-default' onClick={goBack}>No</button>
            </div>
            
        </Layout>
    );
}