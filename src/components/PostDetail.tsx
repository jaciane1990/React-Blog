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

export default function PostDetail() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [author, setAuthor] = useState<User | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  // Campos do novo comentário
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return

    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then(res => res.json())
      .then((postData: Post) => {
        setPost(postData)

        fetch(`https://jsonplaceholder.typicode.com/users/${postData.userId}`)
          .then(res => res.json())
          .then((userData: User) => setAuthor(userData))
          .catch(err => console.error('Erro ao buscar autor:', err))

        fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
          .then(res => res.json())
          .then((commentsData: Omit<Comment, 'approved'>[]) => {
            // Simular que todos os comentários da API estão aprovados
            const approvedComments = commentsData.map(comment => ({
              ...comment,
              approved: true
            }))
            setComments(approvedComments)
          })
          .catch(err => console.error('Erro ao buscar comentários:', err))

        setLoading(false)
      })
      .catch(err => {
        console.error('Erro ao buscar post:', err)
        setLoading(false)
      })
  }, [id])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name || !email || !body) return

    const newComment: Omit<Comment, 'id' | 'approved'> = {
      name,
      email,
      body
    }

    setSubmitting(true)

    fetch(`https://jsonplaceholder.typicode.com/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...newComment,
        postId: id
      })
    })
      .then(res => res.json())
      .then((data: Omit<Comment, 'approved'>) => {
        // Adicionar localmente o novo comentário com approved = true
        setComments(prev => [
          ...prev,
          { ...data, id: Date.now(), approved: true }
        ])
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
          por {author ? (
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
              <li key={comment.id} className="comment-item">
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
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Email:<br />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Comentário:<br />
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              required
              rows={4}
            ></textarea>
          </label>
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Enviando...' : 'Enviar Comentário'}
        </button>
      </form>
    </div>
  )
}
