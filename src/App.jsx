import { Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import Info from './components/Info.jsx';
import Story from './components/Story.jsx';
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/story" element={<Story />} />
      <Route path="/info" element={<Info />} />
    </Routes>
  )
}

export default App
