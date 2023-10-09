import Handlebars from 'handlebars';
import fs from 'fs';
// Charger les données de localisation depuis i18n.json
// open file form ./i18n/fr.json
const localizationData = JSON.parse(fs.readFileSync('i18n/fr.json', 'utf8'));
// const localizationData = JSON.parse(fs.readFileSync('../i18n/fr.json', 'utf8'));


export const barbarsHelpers = {
    toUpperCase: function (text) {
        return text.toUpperCase();
    },
    toLowerCase: function (text) {
        return text.toLowerCase();
    },
    firstLetter: function (text) {
        return text.charAt(0);
    },
    lastLetter: function (text) {
        return text.charAt(text.length - 1);
    },
    firstWord: function (text) {
        return text.split(' ')[0];
    },
    lastWord: function (text) {
        return text.split(' ').pop();
    },
    capitalize: function (text) {
        return text.replace(/\b\w/g, l => l.toUpperCase());
    },
    capitalizeAll: function (text) {
        return text.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    },
    capitalizeFirst: function (text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    },
    capitalizeFirstAll: function (text) {
        return text.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
    },
    capitalizeWords: function (text) {
        return text.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    },
    eq: function(a, b, options) {
        if (a === b) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    },
    not_eq: function(a, b, options) {
        if (a !== b) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    },
    lt: function (a, b) {
        return a < b;
    },
    gt: function (a, b) {
        return a > b;
    },
    or: function (a, b) {
        return a || b;
    },
    and: function (a, b, options) {
        if (a && b) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
    },
    not_in: function(value, list, options) {
        const array = list.split(',');
        if (!array.includes(value)) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    },
    to_uppercase: function (a) {
        return a.toUpperCase();
    },
    replace: function (a, b, c) {
        return a.replace(b, c);
    },
    inc: function (a) {
        return a + 1;
    },
    dec: function (a) {
        return a - 1;
    },
    abs: function (a) {
        return Math.abs(a);
    }
    ,
    if_created_after_date: function (a, b) {
        return a > b;
    },
    if_created_before_date: function (a, b) {
        return a < b;
    },
    tt: function(key) {
        const keys = key.split('.');
        let value = localizationData;
      
        for (const key of keys) {
          value = value[key];
          if (value === undefined) return "Clé introuvable";
        }
        
        return new Handlebars.SafeString(value);
    },
    in: function(value, list, options) {
        const array = list.split(',');
        if (array.includes(value)) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    },
      
}