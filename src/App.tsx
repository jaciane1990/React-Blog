import './App.css'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import PostList from './components/PostList'
import PostDetail from './components/PostDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PostList />} />
        <Route path="post/:id" element={<PostDetail />} />
      </Route>
    </Routes>
  )
}

export default App

