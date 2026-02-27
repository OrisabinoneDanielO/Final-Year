import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit, Check, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { editComment, deleteComment } from '../../features/assignments/assignmentsSlice';

const CommentsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const assignmentId = Number(id);
  const dispatch = useDispatch();
  const comments = useSelector((s) => s.assignments.comments);
  const assignments = useSelector((s) => s.assignments.items);
  const assignment = assignments.find((a) => a.id === assignmentId);
  const currentUser = useSelector((s) => s.auth.user);

  const myComments = comments.filter((c) => Number(c.assignmentId) === assignmentId);

  const [editingId, setEditingId] = useState(null);
  const [draftText, setDraftText] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const startEdit = (c) => { setEditingId(c.id); setDraftText(c.text); };
  const saveEdit = (idToSave) => {
    if (draftText && draftText.trim()) dispatch(editComment({ commentId: idToSave, newText: draftText.trim() }));
    setEditingId(null); setDraftText('');
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-6">

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} className="text-gray-800" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Comments — {assignment?.applicationCode || `Assignment ${assignmentId}`}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{assignment?.title}</p>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {myComments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="font-bold text-gray-500">No comments yet</p>
            <p className="text-gray-400 text-sm mt-1">Comments you add during review will appear here.</p>
          </div>
        ) : (
          myComments.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl p-5 shadow-sm">
              {/* Editing mode */}
              {editingId === c.id ? (
                <>
                  <textarea
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    className="w-full bg-[#F3F4F6] rounded-xl p-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={4}
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => saveEdit(c.id)}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-[#003B95] text-white rounded-full text-sm font-semibold"
                    >
                      <Check size={14} /> Save
                    </button>
                    <button
                      onClick={() => { setEditingId(null); setDraftText(''); }}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold"
                    >
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">{c.text}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {new Date(c.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        {c.editedAt && ' · edited'}
                      </span>
                      {c.section && (
                        <span className="bg-blue-50 text-[#003B95] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-blue-100">
                          {c.section}
                        </span>
                      )}
                    </div>
                    {/* Only show edit/delete if current user owns the comment or is admin */}
                    {(currentUser?.role === 'admin' || !c.authorEmail || c.authorEmail === currentUser?.email) && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(c)}
                        className="flex items-center gap-1 px-3 py-1 bg-[#E5E7EB] text-gray-700 rounded-full text-xs font-semibold hover:bg-gray-300 transition-colors"
                      >
                        <Edit size={12} /> Edit
                      </button>
                      <button
                        onClick={() => setPendingDelete(c.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-semibold hover:bg-red-200 transition-colors"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Comment count footer */}
      {myComments.length > 0 && (
        <p className="text-center text-gray-400 text-sm font-medium mt-6">{myComments.length} comment{myComments.length !== 1 ? 's' : ''}</p>
      )}

      {/* Delete confirmation modal */}
      {pendingDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setPendingDelete(null)} />
          <div className="relative bg-white rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Delete comment?</h3>
            <p className="text-sm text-gray-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setPendingDelete(null)}
                className="flex-1 py-2.5 rounded-full bg-[#E5E7EB] text-gray-700 font-semibold text-sm hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { if (pendingDelete) dispatch(deleteComment(pendingDelete)); setPendingDelete(null); }}
                className="flex-1 py-2.5 rounded-full bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsPage;
