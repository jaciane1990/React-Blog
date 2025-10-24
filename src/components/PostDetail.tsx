// src/components/PostDetail.tsx
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState, FormEvent } from 'react'
import './PostDetail.css'

interface Post {
  id: number
  userId: number
  title: string
  body: string
}

interface User {
  id: number
  name: string
}

interface Comment {
  id: number
  name: string
  body: string
  email: string
  approved: boolean
}

interface PostDetailProps {
  posts: Post[]
  users: User[]
}

export default function PostDetail({ posts, users }: PostDetailProps) {
  const { id } = useParams<{ id: string }>()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [body, setBody] = useState('')

  const post = posts.find(p => p.id === Number(id))
  const author = users.find(u => u.id === post?.userId)

  useEffect(() => {
    if (!id) return

    fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
      .then(res => res.json())
      .then((commentsData: Omit<Comment, 'approved'>[]) => {
        const approvedComments = commentsData.map(comment => ({
          ...comment,
          approved: true
        }))
        setComments(approvedComments)
      })
      .catch(err => console.error('Erro ao buscar comentários:', err))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name || !email || !body) return

    setSubmitting(true)

    fetch('https://jsonplaceholder.typicode.com/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, body, postId: id })
    })
      .then(res => res.json())
      .then(data => {
        setComments(prev => [...prev, { ...data, id: Date.now(), approved: true }])
        setName('')
        setEmail('')
        setBody('')
      })
      .catch(err => console.error('Erro ao enviar comentário:', err))
      .finally(() => setSubmitting(false))
  }

  if (loading || !post) return <p>Carregando post...</p>

  return (
    <div className="container">
      <h2>{post.title}</h2>
      <p className="post-author">
        <em>
          por{' '}
          {author ? (
            <Link to={`/author/${author.id}`}>{author.name}</Link>
          ) : (
            'Autor desconhecido'
          )}
        </em>
      </p>
      <p className="post-body">{post.body}</p>

      <hr />

      <h3>🗨️ Comentários Aprovados</h3>
      {comments.filter(c => c.approved).length === 0 ? (
        <p>Nenhum comentário aprovado encontrado.</p>
      ) : (
        <ul className="comments-list">
          {comments
            .filter(comment => comment.approved)
            .map(comment => (
              <li key={comment.id}>
                <strong>{comment.name}</strong> (<em>{comment.email}</em>)
                <p>{comment.body}</p>
              </li>
            ))}
        </ul>
      )}

      <hr />

      <h3>✍️ Deixe um comentário</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nome:<br />
            <input type="text" value={name} onChange={e => setName(e.target.value)} required />
          </label>
        </div>
        <div>
          <label>
            Email:<br />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </label>
        </div>
        <div>
          <label>
            Comentário:<br />
            <textarea value={body} onChange={e => setBody(e.target.value)} required rows={4}></textarea>
          </label>
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Enviando...' : 'Enviar Comentário'}
        </button>
      </form>
    </div>
  )
}
