// src/components/PostDetail.tsx
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

interface Post {
  id: number
  title: string
  body: string
}

export default function PostDetail() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao buscar post')
        return response.json()
      })
      .then((data) => {
        setPost(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })
  }, [id])

  if (loading) return <p>Carregando post...</p>
  if (!post) return <p>Post não encontrado.</p>

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
    </div>
  )
}
