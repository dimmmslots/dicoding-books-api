const books = require('./books');
const { getAllFormatResponse } = require('./getAllFormatResponse');

const getBooksByContainHandler = (request, h) => {
  let { name } = request.query;
  name = name.toLowerCase();
  name = name.trim();
  if (name === 'dicoding') {
    const data = {
      books: books.filter((b) => b.name.includes(name)),
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
    message: 'Parameter name harus Dicoding',
  });
  response.code(400);
  return response;
};

module.exports = { getBooksByContainHandler };
