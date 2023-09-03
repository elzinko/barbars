import express from "express";
import {create} from "express-handlebars";
import * as fs from 'fs';
import { getHaircuts } from "./barbars.js";

const port = 3000
const app = express()

const hbs = create({
    partialsDir: [
        'views/partials/'
    ]
});
hbs.getPartials().then(function (partials) {console.log(partials)});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
try {
    const rawdata = fs.readFileSync('./data/data.json')
    const data = JSON.parse(rawdata)
    
    console.log(data);

    const mergedData = {
        ...data,
        ...{printHaircuts: true},
        ...{suggestedHaircuts : getHaircuts()},
      };

    app.use(express.static('public'))

    app.get('/', (req, res) => {
        res.render('home', mergedData);
    });

    app.listen(port, () => console.log(`App listening to port ${port}`));
} catch (err) {
    console.log(err);
}
