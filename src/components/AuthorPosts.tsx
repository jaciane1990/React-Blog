// src/components/AuthorPosts.tsx
import { useParams, Link } from 'react-router-dom'

interface Post {
  id: number
  userId: number
  title: string
}

interface User {
  id: number
  name: string
}

interface AuthorPostsProps {
  posts: Post[]
  users: User[]
}

export default function AuthorPosts({ posts, users }: AuthorPostsProps) {
  const { id } = useParams<{ id: string }>()
  const author = users.find(u => u.id === Number(id))
  const authorPosts = posts.filter(p => p.userId === Number(id))

  if (!author) return <p>Autor não encontrado.</p>

  return (
    <div>
      <h2>🧑 Posts de {author.name}</h2>
      {authorPosts.length === 0 ? (
        <p>Este autor não tem posts.</p>
      ) : (
        <ul>
          {authorPosts.map(post => (
            <li key={post.id}>
              <Link to={`/post/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
