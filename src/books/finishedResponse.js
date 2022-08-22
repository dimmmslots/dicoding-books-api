/* eslint-disable no-unreachable */
const books = require('./books');
const { getAllFormatResponse } = require('./getAllFormatResponse');

const getBooksByFinishedHandler = (request, h) => {
  const finished = request.query;
  const finishedState = parseInt(finished.finished, 10);
  if (finishedState === 1) {
    const data = {
      books: books.filter((b) => b.finished === true),
    };
    data.books = data.books.map((b) => getAllFormatResponse(b));
    const response = h.response({
      status: 'success',
      data,
    });
    response.code(200);
    return response;
  }

  if (finishedState === 0) {
    const data = {
      books: books.filter((b) => b.finished === false),
    };
    data.books = data.books.map((b) => getAllFormatResponse(b));
    const response = h.response({
      status: 'success',
      data,
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Parameter finished harus 0 atau 1',
  });
  response.code(400);
  return response;
};

module.exports = { getBooksByFinishedHandler };
