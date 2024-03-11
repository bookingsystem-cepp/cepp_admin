import ItemForm from '@/components/ItemForm'
import Layout from '@/components/Layout'

export default function NewItem() {
    return(
        <Layout>
            <h1>New Item</h1>
            <ItemForm />
        </Layout>
    );
}