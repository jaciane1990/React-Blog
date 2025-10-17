import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './PostList.css'

interface Post {
  id: number
  userId: number
  title: string
}

interface User {
  id: number
  name: string
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json()),
      fetch('https://jsonplaceholder.typicode.com/users').then(res => res.json())
    ])
      .then(([postsData, usersData]) => {
        setPosts(postsData)
        setUsers(usersData)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="container">Carregando posts...</p>

  const getAuthorName = (userId: number) => {
    const user = users.find(u => u.id === userId)
    return user ? user.name : 'Autor desconhecido'
  }

  return (
    <div className="container">
      <h1>Posts</h1>
      <ul className="post-list">
        {posts.map(post => (
          <li key={post.id} className="post-item">
            <Link to={`/post/${post.id}`} className="post-title">
              {post.title}
            </Link>
            <p className="post-author">
              por{' '}
              <Link to={`/author/${post.userId}`}>
                {getAuthorName(post.userId)}
              </Link>
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
