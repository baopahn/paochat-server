const Formidable = require("formidable");

const parseForm = async (req) => {
  const form = new Formidable.IncomingForm();
  const formParse = await new Promise(function (resolve, reject) {
    form.parse(req, function (err, fields, files) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ files, fields });
    });
  });

  return formParse;
};

module.exports = parseForm;
