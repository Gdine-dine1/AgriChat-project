import { useEffect, useState } from 'react';
import axios from 'axios';

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/comments/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Error loading comments:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await axios.post(
        `http://localhost:5000/api/comments/${postId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText('');
      fetchComments();
    } catch {
      alert('Failed to post comment');
    }
  };

  const deleteComment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments();
    } catch {
      alert('Failed to delete comment');
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="mt-8 max-w-2xl mx-auto bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4 text-green-700">Comments</h3>

      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border rounded p-2 mb-2"
          rows={3}
          placeholder="Write a comment..."
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
        >
          Post Comment
        </button>
      </form>

      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        comments.map((c) => (
          <div
            key={c._id}
            className="border-t pt-2 mt-2 text-sm text-gray-800 flex justify-between"
          >
            <div>
              <p>{c.text}</p>
              <span className="text-xs text-gray-500">
                {c.username} · {new Date(c.createdAt).toLocaleString()}
              </span>
            </div>
            {user?.id === c.userId && (
              <button
                onClick={() => deleteComment(c._id)}
                className="text-red-500 text-xs hover:underline ml-2"
              >
                Delete
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default CommentSection;
