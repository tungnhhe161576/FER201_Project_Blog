import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import { createContext, memo, useEffect, useState } from 'react';

import { Toaster } from "react-hot-toast";

import { Routes, Route } from 'react-router-dom'

import Home from './layouts/home/Home'
import Login from './layouts/authenication/login/Login'
import Register from './layouts/authenication/login/Register'
import Detail from './layouts/blog/Detail'
import Create from './layouts/blog/Create'
import Dashboard from './layouts/dashboard/Dashboard';

export const AppContext = createContext();

export const getTokens = () => {
	const tokenString = sessionStorage.getItem('token');
	const userToken = JSON.parse(tokenString);
	return userToken
}

export const setTokens = (userToken) => {
	sessionStorage.setItem('token', JSON.stringify(userToken));
}

export const Sort = (array) => {
	for (let i = 0; i < array.length - 1; i++) {
		for (let j = array.length - 1; j > i; j--) {
			if (new Date(array[j].date) > new Date(array[j - 1].date)) {
				let t = array[j];
				array[j] = array[j - 1];
				array[j - 1] = t;
			}
		}
	}
}


function App() {

	const [blogs, setBlogs] = useState([])

	const [display, setDisplay] = useState([])

	const [page, setPage] = useState(1)
	const [totalPage, setTotalPage] = useState(0)


	useEffect(() => {
		const api = 'http://localhost:3005/blogs?_order=desc&_sort=date'

		console.log(`call api ${api}`)
		fetch(api, {
			method: 'GET'
		})
			.then(res => res.json())
			.then(json => {
				Sort(json)
				setBlogs(json)
			})
			.catch(err => console.log(err))
	}, [])

	useEffect(() => {
		const api = `http://localhost:3005/blogs?_order=desc&_sort=date&published=true&_page=${page}&_limit=8`

		console.log(`call api ${api}`)
		fetch(api, {
			method: 'GET'
		})
			.then(res => res.json())
			.then(json => {
				setTotalPage(Math.ceil(blogs.length / 8))

				console.log(`page ${page}`)

				if(page === 1) {
					setDisplay([])
				}

				const uniqueData = [...new Set(json)]

				const newData = [...new Set([...display, ...uniqueData])]
				console.log(`before sort ${display}`)


				setDisplay(newData)
				console.log(`after sort ${display}`)

			})
			.catch(err => console.log(err))


		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, blogs])

	return (
		<AppContext.Provider value={{
			getTokens, setTokens,
			blogs, setBlogs, display, setDisplay, page, setPage, totalPage, setTotalPage
		}}>
			<Header />

			<Routes>
				<Route exact path='' element={<Home />} />
				<Route path='/detail/:id' element={<Detail />} />
				<Route path='/create' element={<Create />} />
				<Route exact path='/login' element={<Login />} />
				<Route exact path='/register' element={<Register />} />
				<Route exact path='/dashboard' element={<Dashboard />} />
			</Routes>

			<Footer />

			<Toaster position="top-right" />
		</AppContext.Provider>


	);
}

export default memo(App);
