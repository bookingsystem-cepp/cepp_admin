import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect,useState } from "react";

export default function ApproveOrderPage() {
    const router = useRouter();
    const [orderInfo, setOrderInfo] = useState();
    const {id} = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/items?id='+id).then(response => {
            setItemInfo(response.data);
        });
    }, [id]);
    function goBack() {
        router.push('/orders');
    }    
    async function deleteItem() {
        await axios.delete('/api/items?id='+id);
        goBack();
    }
    return (
        <Layout>
            <h1 className="text-center">Do you really want to approve &nbsp;"{itemInfo?.title}"?</h1>
            
            <div className='flex gap-2 justify-center'>
                <button className='bg-green-500' onClick={deleteItem}>Yes</button>
                <button className='btn-default' onClick={goBack}>No</button>
            </div>
            
        </Layout>
    );
}