// src/components/AuthorPosts.tsx
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

interface Post {
  id: number
  title: string
}

interface User {
  id: number
  name: string
}

export default function AuthorPosts() {
  const { id } = useParams<{ id: string }>()
  const [posts, setPosts] = useState<Post[]>([])
  const [author, setAuthor] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    // Buscar autor e posts dele
    Promise.all([
      fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then(res => res.json()),
      fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`).then(res => res.json()),
    ])
      .then(([authorData, postsData]) => {
        setAuthor(authorData)
        setPosts(postsData)
        setLoading(false)
      })
      .catch(err => {
        console.error('Erro ao carregar dados do autor:', err)
        setLoading(false)
      })
  }, [id])

  if (loading) return <p>Carregando...</p>
  if (!author) return <p>Autor não encontrado.</p>

  return (
    <div>
      <h2>🧑 Posts de {author.name}</h2>
      {posts.length === 0 ? (
        <p>Este autor não tem posts.</p>
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <Link to={`/post/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
