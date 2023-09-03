  import express from 'express';
  import { create } from 'express-handlebars';
  import fs from 'fs';
  import path from 'path';
  import { fileURLToPath } from 'url';

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const app = express();
  const port = 3000;

  // const configDir = path.join(__dirname, 'conf');
  const configDir = path.join('conf');
  const exampleNames = fs.readdirSync(configDir).filter((dir) => fs.statSync(path.join(configDir, dir)).isDirectory());

  const layoutDirs = path.join('views', 'layouts')

  const hbs = create({
    layoutsDir: layoutDirs,
    defaultLayout: 'main',
  });

  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');

  let viewsDirs = exampleNames.map((example) => path.join(configDir, example));
  viewsDirs.push('views');
  app.set('views', viewsDirs);

  app.get('/', (req, res) => {
    res.render('index', { layout: 'main', examples: exampleNames }); // Utilisez le layout 'main'
  });

  exampleNames.forEach((example) => {
    const examplePath = path.join(configDir, example);

    // Static files for styles
    const stylePath = path.join(examplePath, 'style', 'style.css');
    if (fs.existsSync(stylePath)) {
      app.use('/' + example, express.static(path.join(examplePath, 'style')));
    }

    app.get('/' + example, (req, res) => {
      const dataPath = path.join(examplePath, 'data.json');
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
        // Charger les données et les options de mise en page
        const layoutOptions = {
          layout: 'barbars', // Utilisez le layout 'barbars'
          title: example,
          style: {
            location: `/${example}/style.css`
          },
          ...data  // Ajoutez vos autres données ici
        };
      
        // Rendre le template avec le moteur de template
        try {
          res.render(example, layoutOptions);
        } catch (err) {
          res.status(500).send('Erreur de rendu: ' + err.message);
        }
      } else {
        res.status(404).send('Template not found');
      }
    });
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
