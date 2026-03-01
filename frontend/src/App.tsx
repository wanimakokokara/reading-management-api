import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'https://e5s41jlkx2.execute-api.ap-northeast-1.amazonaws.com/prod/'

function App() {
  const [books, setBooks] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [review, setReview] = useState('')
  const [rating, setRating] = useState<number>(5)

  const fetchBooks = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        if (data.books) {
          setBooks(data.books)
        }
      })
      .catch(err => console.error("データ取得エラー:", err))
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newBook = { title, review, rating }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook)
      })

      if (response.ok) {
        setTitle('')
        setReview('')
        setRating(5)
        fetchBooks()
        alert('本を登録しました！')
      } else {
        alert('登録に失敗しました...')
      }
    } catch (error) {
      console.error("登録エラー:", error)
      alert('通信エラーが発生しました。')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('本当にこの本を削除しますか？')) return;

    try {
      const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      if (response.ok) {
        fetchBooks()
        alert('削除しました！')
      } else {
        alert('削除に失敗しました...')
      }
    } catch (error) {
      console.error("削除エラー:", error)
      alert('通信エラーが発生しました。')
    }
  }

  return (
    <div className="app-container">
      <h1 className="app-title">📚 読書管理アプリ</h1>

      <div className="card">
        <h2>新しく本を登録する</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">タイトル:</label>
            <input 
              type="text" 
              className="form-input"
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              placeholder="例: リーダブルコード" 
            />
          </div>
          <div className="form-group">
            <label className="form-label">レビュー:</label>
            <textarea 
              className="form-textarea"
              value={review} 
              onChange={(e) => setReview(e.target.value)} 
              required 
              placeholder="感想を入力してください" 
            />
          </div>
          <div className="form-group">
            <label className="form-label">評価 (1〜5):</label>
            <input 
              type="number" 
              className="form-input"
              min="1" max="5" 
              value={rating} 
              onChange={(e) => setRating(Number(e.target.value))} 
              required 
            />
          </div>
          <button type="submit" className="submit-btn">登録する</button>
        </form>
      </div>

      <div className="card">
        <h2>登録されている本の一覧</h2>
        {books.length === 0 ? (
          <p className="loading-text">データを読み込み中...</p>
        ) : (
          <ul className="book-list">
            {books.map((book) => (
              <li key={book.id} className="book-item">
                <div className="book-info">
                  <h3 className="book-title">
                    {book.title} <span className="book-rating">★{book.rating}</span>
                  </h3>
                  <p className="book-review">{book.review}</p>
                </div>
                {/* 👇 ここに削除ボタンが追加されています！ */}
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(book.id)} 
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App