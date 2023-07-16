
import { useRef } from "react"
import "./login.css"
import toast from "react-hot-toast";
import background from "./my-account.jpg"


export default function Register() {

    const emailRef = useRef()
    const userNameRef = useRef()
    const passwordRef = useRef()
    const confirmRef = useRef()

    const messageEmailRef = useRef()
    const messageUsernameRef = useRef()
    const messagePasswordRef = useRef()
    const messageConfirmRef = useRef()

    const check = (param) => String(param) === '' || String(param) === 'undefined'

    const checkEmail = () => {
        const email = emailRef.current
        const messageEmail = messageEmailRef.current

        if (check(email.value)) {
            email.style.borderColor = 'Red'
            email.focus()
            messageEmail.classList.remove('d-none')
            messageEmail.classList.add('d-block')
            messageEmail.innerHTML = 'Email is not Empty'
            email.classList.remove('ok')
            email.classList.add('nok')
        } else {
            if (!email.value.includes('@')) {
                email.style.borderColor = 'Red'
                messageEmail.classList.remove('d-none')
                messageEmail.classList.add('d-block')
                messageEmail.innerHTML = 'Email Must Have @'
                email.classList.remove('ok')
                email.classList.add('nok')
            } else {

                const api = `http://localhost:3005/accounts?email_like=${email.value}`

                fetch(api, {
                    method: 'get',
                })
                    .then(res => res.json())
                    .then(json => {
                        if (json.length !== 0) {
                            email.style.borderColor = 'Red'
                            messageEmail.classList.remove('d-none')
                            messageEmail.classList.add('d-block')
                            messageEmail.innerHTML = 'Email Was Exist'
                            email.classList.remove('ok')
                            email.classList.add('nok')
                        } else {
                            email.style.borderColor = 'green'
                            messageEmail.classList.remove('d-block')
                            messageEmail.classList.add('d-none')
                            email.classList.remove('nok')
                            email.classList.add('ok')
                        }
                    })
                    .then(() => console.log(`call api: ${api}`))
                    .catch(err => console.log(err))
            }
        }
    }
    const checkUserName = () => {
        const userName = userNameRef.current
        const messageUserName = messageUsernameRef.current

        if (check(userName.value)) {
            userName.style.borderColor = 'Red'
            messageUserName.classList.remove('d-none')
            messageUserName.classList.add('d-block')
            messageUserName.innerHTML = 'User Name can\'t Empty'
            userName.classList.remove('ok')
            userName.classList.add('nok')
        } else {
            const api = `http://localhost:3005/accounts?userName_like=${userName.value}`

            fetch(api, {
                method: 'get',
            })
                .then(res => res.json())
                .then(json => {
                    if (json.length !== 0) {
                        userName.style.borderColor = 'Red'
                        messageUserName.classList.remove('d-none')
                        messageUserName.classList.add('d-block')
                        messageUserName.innerHTML = 'User Name was Exists'
                        userName.classList.remove('ok')
                        userName.classList.add('nok')
                    } else {
                        userName.style.borderColor = 'green'
                        messageUserName.classList.remove('d-block')
                        messageUserName.classList.add('d-none')
                        userName.classList.remove('nok')
                        userName.classList.add('ok')


                    }
                })
                .then(() => console.log(`call api: ${api}`))
                .catch(err => console.log(err))
        }
    }

    const checkPassword = () => {
        const password = passwordRef.current
        const messagePassword = messagePasswordRef.current

        if (check(password.value)) {
            password.style.borderColor = 'Red'
            messagePassword.classList.remove('d-none')
            messagePassword.classList.add('d-block')
            messagePassword.innerHTML = 'Password can\'t Empty'
            return false
        } else {
            const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,32}$/
            if (password.value.match(regex)) {
                password.style.borderColor = 'green'
                messagePassword.classList.remove('d-block')
                messagePassword.classList.add('d-none')
                return true
            } else {
                password.style.borderColor = 'Red'
                messagePassword.classList.remove('d-none')
                messagePassword.classList.add('d-block')
                messagePassword.innerHTML = 'Password Must: between 8 to 32 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character'
                return false;
            }
        }
    }

    const checkConfirmPassword = () => {

        const confirm = confirmRef.current
        const password = passwordRef.current

        const messageConfirmPassword = messageConfirmRef.current

        if (check(confirm.value)) {
            confirm.style.borderColor = 'Red'
            messageConfirmPassword.classList.remove('d-none')
            messageConfirmPassword.classList.add('d-block')
            messageConfirmPassword.innerHTML = 'Confirm Password can\'t Empty'
            return false
        } else {
            const pw = password.value
            if (confirm.value === pw) {
                password.style.borderColor = 'green'
                confirm.style.borderColor = 'green'
                messageConfirmPassword.classList.remove('d-block')
                messageConfirmPassword.classList.add('d-none')
                return true
            } else {
                password.style.borderColor = 'Red'
                confirm.style.borderColor = 'Red'
                messageConfirmPassword.classList.remove('d-none')
                messageConfirmPassword.classList.add('d-block')
                messageConfirmPassword.innerHTML = 'Confirm Password must be the same password'
                return false;
            }
        }

    }

    const validation = () => {
        checkEmail()
        checkUserName()

        const check1 = emailRef.current.classList.contains('ok')
        const check2 = userNameRef.current.classList.contains('ok')
        const check3 = checkPassword()
        const check4 = checkConfirmPassword()

        return check1 && check2 && check3 && check4
    }

    const handleRegister = () => {

        if (validation()) {
            const email = emailRef.current.value
            const userName = userNameRef.current.value
            const password = passwordRef.current.value
            const newAccount = {
                "name": "",
                "email": email,
                "userName": userName,
                "password": password,
                "role": 2,
                "avatar": "",
                "createDate": new Date(),
                "status": true
            }

            const api = `http://localhost:3005/accounts`
            fetch(api, {
                method: 'post',
                body: JSON.stringify(newAccount),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(json => {
                    if (json.id) {
                        toast.success('Register Success !')
                    } else {
                        toast.error('Something Wrong. Please Try Again !')

                    }

                })
        } else {
            console.log('Vui Lòng Điền Full Thông Tin!')
        }

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
                
                <form>
                    <div style={{ marginBottom: '1rem' }}>
                        <span>Email address *</span>
                        <input onBlur={checkEmail} style={{ marginBottom: 'unset' }} type='email' ref={emailRef} />
                        <small className="d-none text-danger px-3" ref={messageEmailRef}></small>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <span>Username *</span>
                        <input onBlur={checkUserName} style={{ marginBottom: 'unset' }} type='text' ref={userNameRef} />
                        <small className="d-none text-danger px-3" ref={messageUsernameRef}></small>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <span>Password *</span>
                        <input onBlur={checkPassword} style={{ marginBottom: 'unset' }} type='password' ref={passwordRef} />
                        <small className="d-none text-danger px-3" ref={messagePasswordRef}></small>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <span>Conform Password *</span>
                        <input onBlur={checkConfirmPassword} style={{ marginBottom: 'unset' }} type='password' ref={confirmRef} />
                        <small className="d-none text-danger px-3" ref={messageConfirmRef}></small>
                    </div>

                    <button className='button' type='button' onClick={handleRegister}>Register</button>
                </form>
            </div>
        </section>
    )
}
