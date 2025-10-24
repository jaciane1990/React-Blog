// src/App.tsx
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Layout from './components/Layout'
import PostList from './components/PostList'
import PostDetail from './components/PostDetail'
import AuthorPosts from './components/AuthorPosts'

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

export default function App() {
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
      .catch(err => console.error('Erro ao carregar dados:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Carregando...</p>

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PostList posts={posts} users={users} />} />
        <Route path="post/:id" element={<PostDetail posts={posts} users={users} />} />
        <Route path="author/:id" element={<AuthorPosts posts={posts} users={users} />} />
      </Route>
    </Routes>
  )
}
