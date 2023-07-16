import { useContext, useEffect, useRef, useState } from "react";
import "./create.css"

import { AppContext } from "../../App";
import { toast } from "react-hot-toast";

export default function Create() {

    const titleRef = useRef();
    const descRef = useRef();
    const categoryRef = useRef();

    const [categories, setCategories] = useState([]);

    const { getTokens } = useContext(AppContext);

    const token = getTokens();

    useEffect(() => {
        const api = 'http://localhost:3005/categories'
        console.log(`call api ${api}`)
        fetch(api, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(json => setCategories(json))
            .catch(err => console.log(err))

    }, [])
    //Xu ly ham tao Blog
    const handleCreate = () => {
        const token = getTokens();
        const title = titleRef.current.value;
        const desc = descRef.current.value;
        const category = categoryRef.current.value;

        const newPost = {
            uid: token.id,
            title: title,
            desc: desc,
            category: Number(category),
            cover: 'https://www.shutterstock.com/shutterstock/photos/1029506242/display_1500/stock-photo-blogging-blog-concepts-ideas-with-white-worktable-1029506242.jpg',
            date: new Date().toISOString(),
            like: [],
            published: false
        }

        const api = 'http://localhost:3005/blogs'
        console.log(`call api ${api}`)
        fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPost)
        })
            .then(res => res.json())
            .then(json => {
                if (json.error) {
                    toast.error(json.error)
                } else {
                    toast.success('Create post successfully')

                    setTimeout(() => {
                        window.location.href = '/'
                    }, 1000)
                }
            })
            .catch(err => console.log(err))

    }

    return (
        token ? (
            <section className='newPost'>
                <div className='container boxItems'>
                    <div className='img border' style={{ height: '500px' }}>
                        <img style={{ width: '100%', height: '100%' }} src='https://www.shutterstock.com/shutterstock/photos/1029506242/display_1500/stock-photo-blogging-blog-concepts-ideas-with-white-worktable-1029506242.jpg' alt='cover' className='image-preview' />
                    </div>
                    <form className="mt-4">

                        <div className="form-group">
                            <label htmlFor="select">Category</label>
                            <select className="form-control" id="select" ref={categoryRef}>
                                {
                                    categories.map((item, index) => (
                                        <option key={index} value={item.id}>{item.category}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <label htmlFor="select">Title</label>
                        <input type='text' placeholder='Enter Title' className="form-control" ref={titleRef} required />

                        <label htmlFor="select">Description</label>
                        <textarea name='' id='' cols='30' rows='10' placeholder="Enter Description" className="form-control" ref={descRef} required></textarea>

                        <button className='button' type='button' onClick={handleCreate}>Create Post</button>
                    </form>
                </div>
            </section>
        ) : (
            <div  style={{marginTop: '8rem'}}>
                <h1 className="text-center">Access denied</h1>
            </div>
        )

    )
}

// export default function Create() {

//     const titleRef = useRef();
//     const descRef = useRef();
//     const categoryRef = useRef();

//     const [categories, setCategories] = useState([]);

//     const { getTokens } = useContext(AppContext);

//     const token = getTokens();

//     useEffect(() => {
//         const api = 'http://localhost:3005/categories'
//         console.log(`call api ${api}`)
//         fetch(api, {
//             method: 'GET'
//         })
//             .then(res => res.json())
//             .then(json => setCategories(json))
//             .catch(err => console.log(err))

//     }, [])

// const handleCreate = () => {
//     const token = getTokens();
//     const title = titleRef.current.value;
//     const desc = descRef.current.value;
//     const category = categoryRef.current.value;