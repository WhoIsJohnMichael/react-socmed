import { auth, provider } from '../config/firebase'
import { signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

export const Login = () => {

  const navigate = useNavigate();

  async function signInWithGoogle () {
    const result = await signInWithPopup(auth, provider);
    console.log(result);
    navigate('/');
  }

  return (
    <div className="main">
      <h1>Login</h1>
      <p className='supportText'>Sign In With Google To Continue</p>
      <button onClick={signInWithGoogle}>Sign In With Google</button>
    </div>
  )
}
