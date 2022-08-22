const getAllFormatResponse = (data) => {
  const response = {
    id: data.id,
    name: data.name,
    publisher: data.publisher,
  };
  return response;
};

module.exports = { getAllFormatResponse };
