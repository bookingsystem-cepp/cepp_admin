import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ItemForm({
_id,
title:existingTitle, 
description:existingDescription, 
amount: existingAmount,
images: existingImages,
}) {
    const [title, setTitle] =  useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [amount, setAmount] = useState(existingAmount || '');
    const [images, setImages] = useState(existingImages || []);
    const [goToItems, setGoToItems] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();
    async function saveItem(ev) {
        ev.preventDefault();
        const data = {title, description, amount, images}
        if (_id) {
            //update
            await axios.put('/api/items', {...data, _id});
        } else {
            //create
            await axios.post('/api/items', data)
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

            <label>Photos</label>
            <div className='mb-2 flex flex-wrap gap-1'>
                <ReactSortable 
                    list={images} 
                    className="flex flex-wrap gap-1"
                    setList={updateImagesOrder}
                >
                    {!!images?.length && images.map(link => (
                        <div key={link} className="h-24">
                            <img src={link}  alt="" className="rounded-lg"/>
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-24 flex items-center">
                        <Spinner/>
                    </div>
                )}
                <label className='w-24 h-24 cursor-pointer text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>
                        Upload 
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
                onChange={ev => setAmount(ev.target.value)}
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