import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trash2, Edit, Check, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux'
import { editComment, deleteComment } from '../store/assignmentsSlice';

const CommentsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const assignmentId = Number(id);
  const dispatch = useDispatch()
  const comments = useSelector(s => s.assignments.comments)
  const assignments = useSelector(s => s.assignments.items)
  const assignment = assignments.find(a => a.id === assignmentId);

  const myComments = comments.filter(c => Number(c.assignmentId) === assignmentId);

  const [editingId, setEditingId] = useState(null);
  const [draftText, setDraftText] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const startEdit = (c) => {
    setEditingId(c.id);
    setDraftText(c.text);
  };

  const saveEdit = (idToSave) => {
    if (draftText && draftText.trim()) {
      dispatch(editComment({ commentId: idToSave, newText: draftText.trim() }))
    }
    setEditingId(null);
    setDraftText('');
  };

  const confirmDelete = (idToDelete) => {
    setPendingDelete(idToDelete);
  };

  const handleDeleteAccept = () => {
    if (pendingDelete) dispatch(deleteComment(pendingDelete));
    setPendingDelete(null);
  };

  const handleDeleteDecline = () => {
    setPendingDelete(null);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-start justify-center p-6">
      <main className="w-full max-w-5xl">
        <div className="bg-[#E5E7EB] rounded-[2rem] p-8 sm:p-12 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Comments — {assignment?.applicationCode || `Assignment ${assignmentId}`}</h2>
              <div className="text-gray-600 mt-1">{assignment?.title}</div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="px-4 py-2 bg-white rounded-full shadow">Back</button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 min-h-[40vh]">
            {myComments.length === 0 ? (
              <div className="py-12 text-center text-gray-500">No comments yet for this assignment.</div>
            ) : (
              <div className="space-y-4">
                {myComments.map((c) => (
                  <div key={c.id} className="border rounded-lg p-4 flex justify-between items-start">
                    <div className="flex-1">
                      {editingId === c.id ? (
                        <textarea value={draftText} onChange={(e) => setDraftText(e.target.value)} className="w-full bg-gray-100 p-2 rounded-md" rows={3} />
                      ) : (
                        <p className="text-gray-800 whitespace-pre-wrap">{c.text}</p>
                      )}

                      <div className="text-xs text-gray-500 mt-2">{new Date(c.date).toLocaleString()}{c.editedAt ? ' • edited' : ''}</div>
                    </div>
                    <div className="ml-4 flex flex-col gap-2">
                      {editingId === c.id ? (
                        <>
                          <button onClick={() => saveEdit(c.id)} className="px-3 py-1 rounded-md bg-gray-200 text-gray-800 flex items-center gap-2"><Check size={14} />Save</button>
                          <button onClick={() => { setEditingId(null); setDraftText(''); }} className="px-3 py-1 rounded-md bg-gray-200 text-gray-800 flex items-center gap-2"><X size={14} />Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(c)} className="px-3 py-1 rounded-md bg-gray-200 text-gray-800 flex items-center gap-2"><Edit size={14} />Edit</button>
                          <button onClick={() => confirmDelete(c.id)} className="px-3 py-1 rounded-md bg-red-600 text-white flex items-center gap-2"><Trash2 size={14} />Delete</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end text-sm text-gray-600">{myComments.length} comments</div>
        </div>
      </main>

      {/* Delete confirmation modal */}
      {pendingDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setPendingDelete(null)} />
          <div className="relative bg-white rounded-lg w-full max-w-md p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Do you want to delete this comment?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex items-center justify-center gap-4">
              <button onClick={handleDeleteDecline} className="px-4 py-2 rounded-md bg-gray-200">Decline</button>
              <button onClick={handleDeleteAccept} className="px-4 py-2 rounded-md bg-red-600 text-white">Accept</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsPage;
