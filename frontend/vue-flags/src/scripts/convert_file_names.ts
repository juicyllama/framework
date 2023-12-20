const fs = require('fs');
const { getCode } = require('country-list');

const type = 'hexagonal'
const file_type = 'svg'

const directory = `../assets/flags/${type}/${file_type}/`;

fs.readdir(directory, (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    if (file.endsWith(`.${file_type}`)) {
      const countryName = file.split('-')[1].split('.')[0];
      const countryCode = getCode(countryName);
      if (countryCode) {
        const newFilename = `${countryCode}.${file.split('.')[1]}`;
        fs.rename(`${directory}${file}`, `${directory}${newFilename}`, err => {
          if (err) throw err;
        });
      }
    }
  });
});