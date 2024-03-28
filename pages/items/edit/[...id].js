import ItemForm from "@/components/ItemForm";
import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditItemPage() {
    const [itemInfo, setItemInfo] = useState(null)
    const router = useRouter();
    const {id} = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('http://localhost:8000/api/item/get-by-id/'+id)
        .then(response => {
            console.log(response.data)
            setItemInfo(response.data);
        });
    }, [id]);
    return (
        <Layout>
            <h1>Edit Item</h1>
            {itemInfo && (
                <ItemForm {...itemInfo} />
            )}
        </Layout>
    );
}