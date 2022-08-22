/* eslint-disable no-unused-vars */
const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNotesHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    id,
    title,
    tags,
    body,
    createdAt,
    updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Note created successfully',
      data: {
        noteId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Note creation failed',
  });
  response.code(500);
  return response;
};

const getNotesHandler = (request, h) => {
  const isEmpty = notes.length === 0;

  if (isEmpty) {
    const response = h.response({
      status: 'success',
      message: 'No notes found',
      data: null,
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'success',
    message: 'Notes found',
    length: notes.length,
    data: notes,
  });
  response.code(200);
  return response;
};

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const selectedNote = notes.find((note) => note.id === id);
  if (selectedNote) {
    const response = h.response({
      status: 'success',
      message: 'Note found',
      data: selectedNote,
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Note not found',
    data: null,
  });
  response.code(404);
  return response;
};

const editNoteHandler = (request, h) => {
  const { id } = request.params;
  const selectedNote = notes.find((note) => note.id === id);
  if (selectedNote) {
    const { title, tags, body } = request.payload;
    selectedNote.title = title;
    selectedNote.tags = tags;
    selectedNote.body = body;
    selectedNote.updatedAt = new Date().toISOString();
    const response = h.response({
      status: 'success',
      message: 'Note updated successfully',
      data: selectedNote,
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Note not found',
    data: null,
  });
  response.code(404);
  return response;
};

const deleteNoteHandler = (request, h) => {
  const { id } = request.params;
  const selectedNote = notes.find((note) => note.id === id);
  if (selectedNote) {
    notes.splice(notes.indexOf(selectedNote), 1);
    const response = h.response({
      status: 'success',
      message: 'Note deleted successfully',
      data: selectedNote.id,
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Note not found',
    data: null,
  });
  response.code(404);
  return response;
};

module.exports = {
  addNotesHandler, getNotesHandler, getNoteByIdHandler, editNoteHandler, deleteNoteHandler,
};
