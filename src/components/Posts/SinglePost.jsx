import React, { useEffect, useState } from 'react'
import TestPost from './TestPost'
import { useParams } from 'react-router-dom';
import fetchPostData from '../../hooks/fetchPostData';

export default function SinglePost() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState('');

    async function getPostData(){
        try{
            const temp = await fetchPostData(postId);
            console.log(temp)
            setPost(temp);
            }
            catch(error){
                setError(error.message);
            }
    }

    useEffect( ()=>{
        getPostData();
    },[])
  return (
    <div className='w-full mt-16 flex items-center justify-center'>
        {post && (
        <div className='wi-full'>
        <TestPost post={post} updatePostData={()=>{}}/>
        </div>
        )}
        {error && <div className='text-black dark:text-white'><h2>{error}</h2></div>}
    </div>
  )
}
