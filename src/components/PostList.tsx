// src/components/PostList.tsx
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

interface PostListProps {
  posts: Post[]
  users: User[]
}

export default function PostList({ posts, users }: PostListProps) {
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
