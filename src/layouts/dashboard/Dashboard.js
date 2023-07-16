// import "./dashboard.css"
import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../App"
import image from "../../assets/images/input.png"

import { format } from 'date-fns'
import { toast } from "react-hot-toast"


export default function Dashboard() {

    const { getTokens, blogs, setBlogs, setPage } = useContext(AppContext)

    const token = getTokens()

    const handleChangePublished = (id, published) => {
        const confirm = window.confirm('Are you sure ?')
        if (confirm) {
            const blog = blogs.find(item => item.id === id)

            const api = `http://localhost:3005/blogs/${id}`
            fetch(api, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...blog,
                    published: !published
                })
            })
                .then(res => res.json())
                .then(json => {
                    const newBlogs = blogs.map(item => {
                        if (item.id === json.id) {
                            return json
                        } else {
                            return item
                        }
                    })
                    toast.success('Change Success !')
                    setBlogs(newBlogs)
                    setPage(1)
                })
                .catch(err => console.log(err))
        }
    }

    const [users, setUsers] = useState([])

    useEffect(() => {
        const api = 'http://localhost:3005/accounts'
        console.log(`call api ${api}`)
        fetch(api, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(json => setUsers(json))
            .catch(err => console.log(err))
    }, [])

    const getUser = (id) => {
        const user = users?.find(item => item.id === id)
        return user?.userName
    }

    const handleRemove = (id) => {
        const confirm = window.confirm('Are you sure ?')
        if (confirm) {
            const api = `http://localhost:3005/blogs/${id}`
            fetch(api, {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then(json => {
                    const index = blogs.findIndex(item => item.id === id)
                    blogs.splice(index, 1)

                    toast.success('Delete Success !')
                    const newBlogs = [...blogs]
                    setBlogs(newBlogs)
                    setPage(1)

                })
                .catch(err => console.log(err))
        }
    }

    return (
        <div className="container" style={{ marginTop: '8rem' }} >
            {
                token ? (
                    token.role === 1 ? (
                        <div>
                            <h3 className="text-center mb-3">Blogs List</h3>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th >STT</th>
                                        <th >Title</th>
                                        <th >Create Date</th>
                                        <th >Owner</th>
                                        <th >Published</th>
                                        <th >Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        blogs.map((item, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{item.title}</td>
                                                <td>{format(new Date(item.date), "dd/MM/yyyy")}</td>
                                                <td>{getUser(item.uid)}</td>
                                                <td className={item.published ? 'text-success' : 'text-danger'}>{item.published ? 'Published' : 'UnPublished'}</td>
                                                <td>
                                                    <button className="btn btn-primary mx-1" onClick={() => handleChangePublished(item.id, item.published)}>Change Published</button>
                                                    <button className="btn btn-danger mx-1" onClick={() => handleRemove(item.id)}>Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div>Access Denied</div>
                    )
                ) : (
                    <div>Access Denied</div>
                )
            }
        </div>
    )
}