const pdf = require("pdf-creator-node");
const fs = require("fs");
const express = require('express');
const path = require('path');
const router = express.Router();
// Read HTML Template
const html = fs.readFileSync('./views/test.hbs', "utf8");

router.get('/', (req, res) => {
  const options = {
    format: "A3",
    orientation: "portrait",
    border: "10mm",
    header: {
      height: "45mm",
      contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
    },
    footer: {
      height: "28mm",
      contents: {
        first: 'Cover page',
        2: 'Second page', // Any page number is working. 1-based index
        default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        last: 'Last Page'
      }
    }
  };

  const users = [
    {
      name: "Shyam",
      age: "26",
    },
    {
      name: "Navjot",
      age: "26",
    },
    {
      name: "Vitthal",
      age: "26",
    },
  ];
  const document = {
    html: html,
    data: {
      users: users,
    },
    path: "",
    type: "",
  };

  pdf.create(document, options)
    .then(() => {
      const pdfStream = fs.createReadStream("output.pdf");
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=output.pdf`);
      pdfStream.pipe(res);
      console.log("PDF sent as a download");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error generating the PDF");
    });


})

module.exports = router