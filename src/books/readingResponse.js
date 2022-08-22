/* eslint-disable no-unreachable */
const books = require('./books');
const { getAllFormatResponse } = require('./getAllFormatResponse');

const getBooksByReadingHandler = (request, h) => {
  const reading = request.query;
  const readingState = parseInt(reading.reading, 10);
  if (readingState === 1) {
    const data = {
      books: books.filter((b) => b.reading === true),
    };
    data.books = data.books.map((b) => getAllFormatResponse(b));
    const response = h.response({
      status: 'success',
      data,
    });
    response.code(200);
    return response;
  }

  if (readingState === 0) {
    const data = {
      books: books.filter((b) => b.reading === false),
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
    message: 'Parameter reading harus 0 atau 1',
  });
  response.code(400);
  return response;
};

module.exports = { getBooksByReadingHandler };
