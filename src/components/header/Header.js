import "./header.css"

import { IoLogOutOutline, IoSettingsOutline } from "react-icons/io5"
import { BsNewspaper } from "react-icons/bs"
import { GrHelp } from "react-icons/gr"
import { Link, NavLink, useNavigate } from "react-router-dom"

import { useState, useContext } from 'react'
import { AppContext } from "../../App";


export default function Header() {
    // window.addEventListener("scroll", function () {
    //     const header = this.document.querySelector(".header")
    //     header.classList.toggle("active", this.window.scrollY > 100)
    // })
    //comment
    const navigate = useNavigate()

    const { getTokens } = useContext(AppContext)

    const token = getTokens()

    const [profileOpen, setProfileOpen] = useState(false)
    const close = () => {
        setProfileOpen(false)
    }

    const handleLogout = () => {
        sessionStorage.removeItem('token')
        navigate('/')
    }

    const Authen = () => {
        return (
            <div className='profile' >
                {token ? (
                    <>
                        <button className='img' onClick={() => setProfileOpen(!profileOpen)}>
                            <img src='https://images.pexels.com/photos/1097456/pexels-photo-1097456.jpeg?auto=compress&cs=tinysrgb&w=600' alt='' />
                        </button>

                        {profileOpen && (
                            <div className='openProfile boxItems' onClick={close}>
                                <div className='image'>
                                    <div className='img'>
                                        <img src='https://images.pexels.com/photos/1097456/pexels-photo-1097456.jpeg?auto=compress&cs=tinysrgb&w=600' alt='' />
                                    </div>
                                    <div className='text'>
                                        <h5 style={{ margin: 'unset' }}>{token.name}</h5>
                                        <label>address: {token.address}</label>
                                    </div>
                                </div>
                                {
                                    token.role === 1 ? (
                                        <Link to='/dashboard' className="d-flex justify-content-center">
                                            <button className='box '>
                                                <IoSettingsOutline className='icon' />
                                                <h4>Dashboard</h4>
                                            </button>
                                        </Link>
                                    ) : null
                                }
                                <Link to='/myblog' className="d-flex justify-content-center">
                                    <button className='box '>
                                        <BsNewspaper className='icon' />
                                        <h4>My Blogs</h4>
                                    </button>
                                </Link>
                                <Link to='/' className="d-flex justify-content-center">
                                    <button className='box '>
                                        <GrHelp className='icon' />
                                        <h4>Help ?</h4>
                                    </button>
                                </Link>
                                <button className='box ' onClick={handleLogout}>
                                    <IoLogOutOutline className='icon' />
                                    <h4>Logout</h4>
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <ul className="navbar-nav mr-auto" >
                        <li className="nav-item">
                            <NavLink
                                to="/login"
                                className={`${({ isActive, isPending }) =>
                                    isPending ? "pending" : isActive ? "active" : ""} nav-link`}
                            >
                                Login
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/register"
                                className={`${({ isActive, isPending }) =>
                                    isPending ? "pending" : isActive ? "active" : ""} nav-link`}
                            >
                                Register
                            </NavLink>
                        </li>
                    </ul>
                )}
            </div>
        )
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top d-flex justify-content-end">

            <button className="navbar-toggler float-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <NavLink
                            to="/"
                            className={`${({ isActive, isPending }) =>
                                isPending ? "pending" : isActive ? "active" : ""} nav-link`}
                        >
                            Home
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        {
                            token ? (
                                <NavLink
                                    to="/create"
                                    className={`${({ isActive, isPending }) =>
                                        isPending ? "pending" : isActive ? "active" : ""} nav-link`}
                                >
                                    Create Blog
                                </NavLink>
                            ) : null
                        }

                    </li>
                </ul>
                <div className="d-none d-lg-block">
                    <Authen />
                </div>
            </div>
        </nav>

    )
}