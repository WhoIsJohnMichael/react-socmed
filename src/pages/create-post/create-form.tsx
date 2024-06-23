import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { serverTimestamp, addDoc, collection} from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

//addDoc - function to call when adding document to database
//colection - used to specify which collection we are referring to / adding to

interface CreateFormData {
  title: string;
  description: string;
}

export const CreateForm = () => {

  const schema = yup.object().shape({
    title: yup.string().required("You must add a title."),
    description: yup.string().required("You must add a description."),
  });

  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const {register, handleSubmit, formState: {errors}} = useForm<CreateFormData>({
    resolver: yupResolver(schema),
  });

  const postsRef = collection(db, "posts");

  const onCreatePost = async (data: CreateFormData) => {
    try {
      await addDoc(postsRef, {
        ...data,
        username: user?.displayName || "Anonymous",
        userId: user?.uid,
        timeStamp: serverTimestamp(), 
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form>
        <input type="text" placeholder="Title" {...register("title")}/>
        <p className="errors">{errors.title?.message}</p>
        <textarea cols={30} rows={10} placeholder='Description...' {...register("description")}></textarea>
        <p className="errors">{errors.description?.message}</p>
        <button className="btn" onClick={handleSubmit(onCreatePost)}>Post</button>
      </form>
    </>
  )
}