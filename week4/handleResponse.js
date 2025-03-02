function handleResponse(res, statusCode, jsonData = null) {
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };
  res.writeHead(statusCode, headers);

  if (jsonData === null)
    res.write(
      JSON.stringify({
        status: "success",
      })
    );
  if (jsonData !== null) res.write(JSON.stringify(jsonData));

  res.end();
}

function handleSuccess(res, successData) {
  const dataReturned = {
    status: "success",
    data: successData,
  };
  handleResponse(res, 200, dataReturned);
}

function handleError(res, statusCode, errorMessage) {
  const data = {
    status: "error",
    message: errorMessage,
  };
  handleResponse(res, statusCode, data);
}

module.exports = { handleResponse, handleSuccess, handleError };
