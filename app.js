import express from 'express';
import { create } from 'express-handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
const hbs = create();

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public')); // for global static files

const configDir = path.join(__dirname, 'conf');
const exampleNames = fs.readdirSync(configDir).filter((dir) => fs.statSync(path.join(configDir, dir)).isDirectory());

app.get('/', (req, res) => {
  res.render('index', { examples: exampleNames });
});

exampleNames.forEach((example) => {
  const examplePath = path.join(configDir, example);

  // Static files for styles
  app.use('/' + example, express.static(path.join(examplePath, 'style')));

  app.get('/' + example, (req, res) => {
    const dataPath = path.join(examplePath, 'data/data.json');
    let data = {};

    if (fs.existsSync(dataPath)) {
      data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }

    const partialsDir = path.join(examplePath, 'partials');
    if (fs.existsSync(partialsDir)) {
      const partialFiles = fs.readdirSync(partialsDir).filter((file) => path.extname(file) === '.handlebars');

      partialFiles.forEach((file) => {
        const filePath = path.join(partialsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const partialName = path.basename(file, '.handlebars');
        hbs.handlebars.registerPartial(partialName, fileContent);
      });
    }

    const templatePath = path.join(examplePath, example + '.handlebars');
    if (fs.existsSync(templatePath)) {
      const templateString = fs.readFileSync(templatePath, 'utf8');
      const template = hbs.handlebars.compile(templateString);
      const renderedHTML = template(data);

      res.send(renderedHTML);
    } else {
      res.status(404).send('Template not found');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
