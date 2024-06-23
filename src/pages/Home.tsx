import { getDocs, collection } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { Post } from "./main/post";

export interface Post {
  title: string;
  description: string;
  username: string;
  userId: string;
  id: string;
}

export const Home = () => {

  const [postsList, setPostsList] = useState<Post[] | null>(null);

  useEffect(()=>{
    const postsRef = collection(db, "posts");
    const getPosts = async () => {
      const data = await getDocs(postsRef);
      console.log(data.docs.map((doc)=>({...doc.data(), id:doc.id})));
      setPostsList(
        data.docs.map((doc)=>({...doc.data(), id:doc.id})) as Post[]
      );
    }
    getPosts();
  },[])

  return (
    <div className="main">
      <h1><span className="supportText">Welcome to</span> SocialPedia</h1>
      <div className="posts">
        {postsList && postsList?.map((post)=>(
          <Post post={post}/>
        ))}
      </div>
    </div>
  )
}