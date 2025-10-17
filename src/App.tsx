// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import PostList from './components/PostList'
import PostDetail from './components/PostDetail'
import AuthorPosts from './components/AuthorPosts'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PostList />} />
        <Route path="post/:id" element={<PostDetail />} />
        <Route path="author/:id" element={<AuthorPosts />} /> {/* ✅ nova rota */}
      </Route>
    </Routes>
  )
}

export default App
