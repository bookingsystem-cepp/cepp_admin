import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import { useSession } from "next-auth/react";

export default function ItemForm({
_id,
title:existingTitle, 
description:existingDescription, 
amount: existingAmount,
available: existingAvailable,
period: existingPeriod,
image: existingImages,
category:assignedCategory,
}) {
    const [title, setTitle] =  useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [category, setCategory] = useState(assignedCategory || '');
    const [amount, setAmount] = useState(existingAmount || '');
    const [available, setAvailable] = useState(existingAvailable || '');
    const [period, setPeriod] = useState(existingPeriod || '');
    const [images, setImages] = useState(existingImages || []);
    const [goToItems, setGoToItems] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const router = useRouter();
    const { data: session } = useSession();
    useEffect(() => {
        axios.get('https://backend.tirk101.online/api/category/get-by-owner/'+session?.user?.id)
        .then(result => {
            setCategories(result.data);
        })
        console.log(title,images,existingImages)
    }, [])
    async function saveItem(ev) {
        ev.preventDefault();
        let data = {title, description, amount, available, period, images, category}
        if (_id) {
            //update
            await axios.put('https://backend.tirk101.online/api/item/update', {
                id: _id,
                title: title,
                description: description,
                amount: amount,
                period: period,
            });
        } else {
            //create
            data.available = amount;
            await axios.post('https://backend.tirk101.online/api/item/create', {
                title: title,
                description: description,
                amount: amount,
                period: period,
                image: images,
                category: category
            })
        }
        setGoToItems(true);
    }
    if (goToItems) {
        router.push('/items');
    }
    async function uploadImages(ev){
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files){
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            })
            setIsUploading(false);
        }
    }
    function updateImagesOrder(images) {
        setImages(images);
    }
    return (
        <form onSubmit={saveItem}>
            <label>Item name</label>
            <input 
                type='text' 
                placeholder='item name' 
                value={title} 
                onChange={ev => setTitle(ev.target.value)}
            />
            <label>Category</label>
            <select 
                value={category}
                onChange={ev => setCategory(ev.target.value)}
            >
                <option value=''>Uncategorized</option>
                {categories.length > 0 && categories.map((category, key) => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                ))}
            </select>

            <label>Photos</label>
            <div className='mb-2 flex flex-wrap gap-1'>
                <ReactSortable 
                    list={images} 
                    className="flex flex-wrap gap-1"
                    setList={updateImagesOrder}
                >
                    {!!images?.length && images.map(link => (
                        <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                            <img src={link}  alt="" className="rounded-lg"/>
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-24 flex items-center">
                        <Spinner/>
                    </div>
                )}
                <label className='w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>
                        Add image 
                    </div>
                    <input type='file' onChange={uploadImages} className='hidden'/>
                </label>
            </div>

            <label>Description</label>
            <textarea 
                placeholder='description' 
                value={description}
                onChange={ev => setDescription(ev.target.value)}
            />
            
            <label>Amount</label>
            <input 
                type='number' 
                placeholder='amount'
                value={amount}
                onChange={ev => {
                    setAmount(ev.target.value)
                }}
            />

            <label>Lending period</label>
            <input 
                type='number' 
                placeholder='days'
                value={period}
                onChange={ev => setPeriod(ev.target.value)}
            />

            <button 
                type="submit" 
                className='btn-primary'
            >
                Save
            </button> 
        </form>       
    );
}