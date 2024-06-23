import { addDoc, collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { Post as PostData } from "../Home";
import { db, auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";

export interface Props {
  post: PostData;
}

interface Like {
  userId: string;
  id: string;
}

export const Post = (prop:Props) => {
  const { post } = prop;
  const [ user ]= useAuthState(auth);

  const likesRef = collection(db, "likes");

  const [likes, setLikes] = useState<Like[] | null>(null);
  const likesDoc = query(likesRef, where("postId", "==", post.id));

  const getLikes = async() => {
    const data = await getDocs(likesDoc);
    setLikes(data.docs.map(doc=>({userId: doc.data().userId, id: doc.id})));
  }

  const onLikePost = async () => {
    try{
      const newLike = await addDoc(likesRef, {
        userId: user?.uid,
        postId: post.id,
      })
      if(user){
        setLikes((prev)=> 
          prev ? [...prev, {userId: user?.uid, id: newLike.id}] : [{userId: user?.uid, id: newLike.id}]
        );
      }
      getLikes();
    }catch(error){
      console.error(error);
      alert("Something went wrong.");
    }
  }

  const removeLike = async () => {
    try {
      if(user){
        const likeToDeleteQuery = query(
          likesRef,
          where("userId", "==", user?.uid),
          where("postId", "==", post.id),
        )
        const likeToDeleteData = await getDocs(likeToDeleteQuery);
        const likeId = likeToDeleteData.docs[0].id;
        const likeToDelete = doc(db, "likes", likeId);
        await deleteDoc(likeToDelete);
        setLikes((prev)=>( prev && prev?.filter((like)=>like.id !== likeId)));
      }
    } catch (error) {
      console.log(error);
    }
  }

  //looping thru the array and find the element
  const hasUserLiked = likes?.find(like=>like.userId === user?.uid);

  useEffect(()=>{
    const likesRef = collection(db, "likes");
    const likesDoc = query(likesRef, where("postId", "==", post.id));

    const getLikes = async() => {
      const data = await getDocs(likesDoc);
      // console.log(data.docs.map(doc=>({...doc.data(), id: doc.id})));
      setLikes(data.docs.map(doc=>({userId: doc.data().userId, id:doc.id})));
    }

    getLikes();
  },[post.id])

  return (
    <>
      <div className="post">
        <div className="post-body">
          <h3>{post.title}</h3>
          <p className="post-username">
            by {post.username}
          </p>
          <p className="post-description">{post.description}</p>
        </div>
        <div className="post-like">
          <button onClick={()=>{
            if(hasUserLiked){
              removeLike();
            }else{
              onLikePost();
            }
          }} className={hasUserLiked ? "liked" : ""}>
            <i className="bi bi-heart-fill"></i>
            { likes && likes?.length > 0 && <span>{likes?.length}</span>}
          </button>
        </div>
      </div>
    </>
  )
}