import "./details.css"
import { BsFillUnlockFill, BsPencilSquare } from "react-icons/bs"
import { AiOutlineDelete } from "react-icons/ai"
import { useParams } from "react-router-dom"
import { useContext, useEffect, useRef, useState } from "react"
import { formatRelative, subDays } from "date-fns"
import { vi } from "date-fns/locale"
import { AppContext } from "../../App"
import { HiLockClosed } from "react-icons/hi"
import { toast } from "react-hot-toast"


export default function Detail() {
    console.log(`Detail.js`)
    const { id } = useParams()

    const { getTokens } = useContext(AppContext)

    const token = getTokens()


    const [blog, setBlog] = useState()

    const [comments, setComments] = useState()

    const [author, setAuthor] = useState()

    const titelRef = useRef()
    const descRef = useRef()

    const contentRef = useRef()

    const [isComment, setIsComment] = useState(false)

    useEffect(() => {
        const api = `http://localhost:3005/blogs/${id}`
        console.log(`call api ${api}`)
        fetch(api, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(json => setBlog(json))
            .catch(err => console.log(err))
    }, [id])

    useEffect(() => {
        const api = `http://localhost:3005/comments?blog_id=${id}`
        console.log(`call api ${api}`)
        fetch(api, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(json => setComments(json))
            .catch(err => console.log(err))
    }, [id, isComment])

    const uid = blog ? blog.uid : null

    useEffect(() => {
        if (!uid) return
        const api = `http://localhost:3005/accounts/${uid}`
        console.log(`call api ${api}`)
        fetch(api, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(json => setAuthor(json))
            .catch(err => console.log(err))
    }, [uid])
    //Xu ly ham xoa Blob
    const handleDelete = () => {
        const check = window.confirm('Are you sure you want to delete this blog?')

        if (!check) return

        const api = `http://localhost:3005/blogs/${id}`
        console.log(`call api ${api}`)
        fetch(api, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(json => {
                if (json.error) {
                    toast.error('Something wrong !')
                    return
                } else {
                    toast.success('Delete Blog Success !')
                    comments.forEach(comment => {
                        const api2 = `http://localhost:3005/comments/${comment.id}`
                        console.log(`call api ${api2}`)
                        fetch(api2, {
                            method: 'DELETE'
                        })
                            .then(res => res.json())
                            .then(() => {

                                setTimeout(() => {
                                    window.location.href = '/'
                                }, 1000)
                            })
                            .catch(err => console.log(err))
                    })
                }

            })
            .catch(err => console.log(err))
    }

    const handleUpdate = () => {
        const title = titelRef.current.value
        const desc = descRef.current.value

        console.log(title, desc)

        const newblog = {
            id: blog.id,
            title: title,
            desc: desc,
            cover: blog.cover,
            uid: blog.uid,
            date: blog.date,
            category: blog.category,
            like: blog.like
        }

        const api = `http://localhost:3005/blogs/${id}`
        console.log(`call api ${api}`)
        fetch(api, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newblog)
        })
            .then(res => res.json())
            .then(json => {
                console.log(json)
                toast.success('Update Blog Success !')
                setTimeout(() => {
                    window.location.reload()
                }, 1500)
            })
            .catch(err => toast.error('Something wrong !'))
    }

    const handleComment = () => {
        const content = contentRef.current.value


        const newComment = {
            blog_id: id,
            name: token.name,
            email: token.email,
            content: content,
            createDate: new Date().toISOString(),
            published: true
        }

        const api = `http://localhost:3005/comments`
        console.log(`call api ${api}`)
        fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newComment)

        }).then(res => res.json())
            .then(json => {
                console.log(json)
                setIsComment(!isComment)
            })
            .then(() => {
                toast.success('Comment Success !')
                contentRef.current.value = ''
            })

    }


    return (
        blog ? (
            <section className='singlePage mt-5'>
                {
                    token && token.id === blog.uid ? (
                        <div className='buttons'>
                            <button className='button' data-toggle="modal" data-target="#edit">
                                <BsPencilSquare />
                            </button>
                            <div>
                                <div className="modal fade" id="edit" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">Edit Blog</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">×</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">

                                                <div className="form-group">
                                                    <label htmlFor="recipient-name" className="col-form-label">Title: </label>
                                                    <input ref={titelRef} type="text" className="form-control" defaultValue={blog.title} id="recipient-name" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="message-text" className="col-form-label">Description: </label>
                                                    <textarea ref={descRef} className="form-control" rows={10} id="message-text" defaultValue={blog.desc} />
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-primary" onClick={handleUpdate}>Save Change</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>



                            <button className='button bg-danger' onClick={handleDelete}>
                                <AiOutlineDelete />
                            </button>
                        </div>
                    ) : null
                }

                <div className='container-fluid d-flex justify-content-center'>
                    <div className='col-4'>
                        <img src={blog.cover} alt='' height='' />
                    </div>
                    <div className='col'>
                        <h1>Title: {blog.title}</h1>
                        <p>Description: {blog.desc}</p>
                        <div>
                            {
                                author ? (
                                    <span className="mx-2">Author: {author.name}</span>
                                ) : null
                            }
                            <span className="mx-2">Time: {formatRelative(subDays(new Date(blog.date), 0), new Date(), { locale: vi })}</span>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="container">
                    <h3>Comments</h3>
                </div>
                {
                    comments ? (
                        <div className="container">
                            <div className="d-flex flex-column col-12">

                                <div className="coment-bottom bg-white  px-4">
                                    {
                                        token ? (
                                            <div className="d-flex flex-row add-comment-section mt-4 mb-4">
                                                <img className="img-fluid img-responsive rounded-circle mr-4" style={{ height: '3rem', width: '3rem' }} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb-BFR1Gzx3_HNo0lZrnnOe8r7k1-sUZPEBgAWiBX0M8QCeXTTj8URfmxNElwR5De8vdI&usqp=CAU' alt='avatar' />
                                                <input type="text" className="form-control mr-3" placeholder="Add comment" required ref={contentRef} />
                                                <button className="btn btn-primary" type="button" onClick={handleComment}>Comment</button>
                                            </div>
                                        ) : null
                                    }

                                    {
                                        comments.map((comment, index) => (
                                            <div className="commented-section mt-2" key={index}>
                                                <div className="d-flex justify-content-between commented-user">
                                                    <div className="d-flex flex-row align-items-center commented-user">
                                                        <h5 className="mr-2">{comment.name}</h5><span className="dot mb-1" />
                                                        <span className="mb-1 ml-2">
                                                            {formatRelative(subDays(new Date(comment.createDate), 0), new Date(), { locale: vi })}
                                                        </span>
                                                    </div>
                                                    {/* {
                                                        comment.published === true ? (
                                                            <HiLockClosed className="icon" style={{ fontSize: '1.5rem' }} />
                                                        ) : <BsFillUnlockFill className="icon" style={{ fontSize: '1.5rem' }} />
                                                    } */}
                                                </div>
                                                <div className="comment-text-sm">
                                                    <span>{comment.content}</span>
                                                </div>
                                            </div>
                                        ))
                                    }

                                </div>
                            </div>
                        </div>
                    ) : null
                }

            </section>
        ) : null

    )

}

// export default function Detail() {
//     console.log(`Detail.js`)
//     const { id } = useParams()

//     const { getTokens } = useContext(AppContext)

//     const token = getTokens()


//     const [blog, setBlog] = useState()

//     const [comments, setComments] = useState()

//     const [author, setAuthor] = useState()

//     const titelRef = useRef()
//     const descRef = useRef()

//     const contentRef = useRef()

//     const [isComment, setIsComment] = useState(false)

//     useEffect(() => {
//         const api = `http://localhost:3005/blogs/${id}`
//         console.log(`call api ${api}`)
//         fetch(api, {
//             method: 'GET'
//         })
//             .then(res => res.json())
//             .then(json => setBlog(json))
//             .catch(err => console.log(err))
//     }, [id])

//     useEffect(() => {
//         const api = `http://localhost:3005/comments?blog_id=${id}`
//         console.log(`call api ${api}`)
//         fetch(api, {
//             method: 'GET'
//         })
//             .then(res => res.json())
//             .then(json => setComments(json))
//             .catch(err => console.log(err))
//     }, [id, isComment])

//     const uid = blog ? blog.uid : null

//     useEffect(() => {
//         if (!uid) return
//         const api = `http://localhost:3005/accounts/${uid}`
//         console.log(`call api ${api}`)
//         fetch(api, {
//             method: 'GET'
//         })
//             .then(res => res.json())
//             .then(json => setAuthor(json))
//             .catch(err => console.log(err))
//     }, [uid])

// const api = `http://localhost:3005/comments`
//         console.log(`call api ${api}`)
//         fetch(api, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(newComment)

//         }).then(res => res.json())
//             .then(json => {
//                 console.log(json)
//                 setIsComment(!isComment)
//             })
//             .then(() => {
//                 toast.success('Comment Success !')
//                 contentRef.current.value = ''
//             })

//     }