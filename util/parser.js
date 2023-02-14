function parseError(error) {
  if (error.name == "ValidationError") {
    return Object.values(error.errors).map((v) => v.message); // ако искаме само 1вата грешка Object.values(error.errors)[0].message


  } else if (Array.isArray(error)) {
    return error.map((x) => x.msg);
  } else {
    return error.message.split("\n");
  }
}

module.exports = {
  parseError,
};
