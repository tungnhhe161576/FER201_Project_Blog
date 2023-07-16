import { useContext, useRef } from "react";
import "./login.css"
import { AppContext } from "../../../App";
import background from "./my-account.jpg"

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";


export default function Login() {

    const { getTokens, setTokens } = useContext(AppContext);

    const navigate = useNavigate();

    const userNameRef = useRef();
    const passwordRef = useRef();


    const handleLogin = () => {
        console.log(`login`)
        const userName = userNameRef.current.value;
        const password = passwordRef.current.value;

        fetch(`http://localhost:3005/accounts?userName=${userName}&password=${password}`, {
            method: 'get',
        })
            .then(res => res.json())
            .then(json => {
                if (json.length > 0) {
                    setTokens(json[0])
                    toast.success('Login Success !')
                    navigate('/')
                } else {
                    toast.error('Tài Khoản Hoặc Mật Khẩu Không Đúng !')
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <section className='login'>
            <div className='container-fluid'>
                <div className='backImg'>
                    <img src={background} alt='' />
                    <div className='text'>
                        <h3>Login</h3>
                        <h1>My account</h1>
                    </div>
                </div>

                {
                    getTokens() ? <h1 className="text-center my-2">Bạn Đã Đăng Nhập Rồi</h1> : <form >
                        <span>Username *</span>
                        <input type='text' ref={userNameRef} required />
                        <span>Password *</span>
                        <input type='password' ref={passwordRef} required />
                        <button className='button' type='button' onClick={handleLogin}>Log in</button>
                    </form>
                }

            </div>
        </section>
    )



}