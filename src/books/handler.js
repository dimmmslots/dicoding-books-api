/* eslint-disable no-unreachable */
const { nanoid } = require('nanoid');
const books = require('./books');
const { getBooksByReadingHandler } = require('./readingResponse');
const { getBooksByFinishedHandler } = require('./finishedResponse');
const { getBooksByContainHandler } = require('./containResponse');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = readPage === pageCount;

  // check all fields should be filled
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if ((readPage < pageCount || finished) && name) {
    books.push({
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    });
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  // generic server error

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan.',
  });
  response.code(500);
  return response;
};

const getBookHandler = (request, h) => {
  const { id } = request.params;

  if (request.query.reading) {
    return getBooksByReadingHandler(request, h);
  }

  if (request.query.finished) {
    return getBooksByFinishedHandler(request, h);
  }

  if (request.query.contain) {
    return getBooksByContainHandler(request, h);
  }

  if (id) {
    const book = books.find((b) => b.id === id);
    const data = {
      book,
    };
    if (!book) {
      const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      });
      response.code(404);
      return response;
    }

    const response = h.response({
      status: 'success',
      data,
    });
    response.code(200);
    return response;
  }

  if (books.length === 0) {
    const response = h.response({
      status: 'success',
      data: [],
    });
    response.code(200);
    return response;
  }

  const formattedBooks = books.map((b) => ({
    id: b.id,
    name: b.name,
    publisher: b.publisher,
  }));

  const data = {
    books: formattedBooks,
  };

  const response = h.response({
    status: 'success',
    data,
  });
  response.code(200);
  return response;
};

const editBookHandler = (request, h) => {
  const { id } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const book = books.find((b) => b.id === id);
  if (!book) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const updatedAt = new Date().toISOString();
  const finished = readPage === pageCount;
  // find the book index
  const index = books.findIndex((b) => b.id === id);
  books[index] = {
    id: book.id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt: book.insertedAt,
    updatedAt,
  };
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteBookHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((b) => b.id === id);
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books.splice(index, 1);
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200);
  return response;
};

module.exports = {
  addBookHandler,
  getBookHandler,
  editBookHandler,
  deleteBookHandler,
};
