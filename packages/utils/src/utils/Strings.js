"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strings = void 0;
class Strings {
    static capitalize(str) {
        if (!str) {
            return '';
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    static replacer(template, obj) {
        const keys = Object.keys(obj);
        const func = Function(...keys, 'return `' + template + '`;');
        return func(...keys.map((k) => obj[k]));
    }
    static numbersToLetters(number) {
        let letters = '';
        const alphabet = 'ABCDEFGHIJ';
        for (let n = 0; n < number.toString().length; n++) {
            const num = Number(number.toString().slice(n, n + 1));
            letters += alphabet.charAt(num);
        }
        return letters;
    }
    static numbersTo26Letters(number) {
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(number);
    }
    static toHTMLConversion(string) {
        string = string.replace(/\n/g, '<br />');
        return string;
    }
    static fromHTMLtoStringConversion(string) {
        string = string.replace(/<[^>]*>/g, '');
        return string;
    }
    static az09Lowercase(string) {
        string = string.replace(/-/gi, '');
        string = string.replace(/ /gi, '');
        return string.toLowerCase();
    }
    static onlyNumbers(string) {
        return string.replace(/\D/g, '');
    }
    static plural(word, amount) {
        if (amount !== undefined && amount === 1) {
            return word;
        }
        const plural = {
            '(quiz)$': '$1zes',
            '^(ox)$': '$1en',
            '([m|l])ouse$': '$1ice',
            '(matr|vert|ind)ix|ex$': '$1ices',
            '(x|ch|ss|sh)$': '$1es',
            '([^aeiouy]|qu)y$': '$1ies',
            '(hive)$': '$1s',
            '(?:([^f])fe|([lr])f)$': '$1$2ves',
            '(shea|lea|loa|thie)f$': '$1ves',
            sis$: 'ses',
            '([ti])um$': '$1a',
            '(tomat|potat|ech|her|vet)o$': '$1oes',
            '(bu)s$': '$1ses',
            '(alias)$': '$1es',
            '(octop)us$': '$1i',
            '(ax|test)is$': '$1es',
            '(us)$': '$1es',
            '([^s]+)$': '$1s',
        };
        const irregular = {
            move: 'moves',
            foot: 'feet',
            goose: 'geese',
            sex: 'sexes',
            child: 'children',
            man: 'men',
            tooth: 'teeth',
            person: 'people',
        };
        const uncountable = [
            'sheep',
            'fish',
            'deer',
            'moose',
            'series',
            'species',
            'money',
            'rice',
            'information',
            'equipment',
            'bison',
            'cod',
            'offspring',
            'pike',
            'salmon',
            'shrimp',
            'swine',
            'trout',
            'aircraft',
            'hovercraft',
            'spacecraft',
            'sugar',
            'tuna',
            'you',
            'wood',
        ];
        if (uncountable.indexOf(word.toLowerCase()) >= 0) {
            return word;
        }
        for (const w in irregular) {
            const pattern = new RegExp(`${w}$`, 'i');
            const replace = irregular[w];
            if (pattern.test(word)) {
                return word.replace(pattern, replace);
            }
        }
        for (const reg in plural) {
            const pattern = new RegExp(reg, 'i');
            if (pattern.test(word)) {
                return word.replace(pattern, plural[reg]);
            }
        }
        return word;
    }
    static singular(word, amount) {
        if (amount !== undefined && amount !== 1) {
            return word;
        }
        const singular = {
            '(quiz)zes$': '$1',
            '(matr)ices$': '$1ix',
            '(vert|ind)ices$': '$1ex',
            '^(ox)en$': '$1',
            '(alias)es$': '$1',
            '(octop|vir)i$': '$1us',
            '(cris|ax|test)es$': '$1is',
            '(shoe)s$': '$1',
            '(o)es$': '$1',
            '(bus)es$': '$1',
            '([m|l])ice$': '$1ouse',
            '(x|ch|ss|sh)es$': '$1',
            '(m)ovies$': '$1ovie',
            '(s)eries$': '$1eries',
            '([^aeiouy]|qu)ies$': '$1y',
            '([lr])ves$': '$1f',
            '(tive)s$': '$1',
            '(hive)s$': '$1',
            '(li|wi|kni)ves$': '$1fe',
            '(shea|loa|lea|thie)ves$': '$1f',
            '(^analy)ses$': '$1sis',
            '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$': '$1$2sis',
            '([ti])a$': '$1um',
            '(n)ews$': '$1ews',
            '(h|bl)ouses$': '$1ouse',
            '(corpse)s$': '$1',
            '(us)es$': '$1',
            s$: '',
        };
        const irregular = {
            move: 'moves',
            foot: 'feet',
            goose: 'geese',
            sex: 'sexes',
            child: 'children',
            man: 'men',
            tooth: 'teeth',
            person: 'people',
        };
        const uncountable = [
            'sheep',
            'fish',
            'deer',
            'moose',
            'series',
            'species',
            'money',
            'rice',
            'information',
            'equipment',
            'bison',
            'cod',
            'offspring',
            'pike',
            'salmon',
            'shrimp',
            'swine',
            'trout',
            'aircraft',
            'hovercraft',
            'spacecraft',
            'sugar',
            'tuna',
            'you',
            'wood',
        ];
        if (uncountable.indexOf(word.toLowerCase()) >= 0) {
            return word;
        }
        for (const w in irregular) {
            const pattern = new RegExp(`${irregular[w]}$`, 'i');
            const replace = w;
            if (pattern.test(word)) {
                return word.replace(pattern, replace);
            }
        }
        for (const reg in singular) {
            const pattern = new RegExp(reg, 'i');
            if (pattern.test(word)) {
                return word.replace(pattern, singular[reg]);
            }
        }
        return word;
    }
    static stringToEmojis(string) {
        string = string.replace(/:warning:/g, '⚠️');
        string = string.replace(/:zero:/g, '0️⃣️');
        string = string.replace(/:one:/g, '1️⃣️');
        string = string.replace(/:two:/g, '2️⃣️');
        string = string.replace(/:three:/g, '3️⃣');
        string = string.replace(/:four:/g, '4️⃣️');
        string = string.replace(/:five:/g, '5️⃣️');
        string = string.replace(/:six:/g, '6️⃣️');
        string = string.replace(/:seven:/g, '7️⃣');
        string = string.replace(/:eight:/g, '8️⃣️');
        string = string.replace(/:nine:/g, '9️⃣️');
        return string;
    }
    static numberToSlackEmojis(number) {
        const parts = number.toString().slice();
        let string = '';
        for (const part of parts) {
            switch (part) {
                case '0':
                    string += ':zero:';
                    break;
                case '1':
                    string += ':one:';
                    break;
                case '2':
                    string += ':two:';
                    break;
                case '3':
                    string += ':three:';
                    break;
                case '4':
                    string += ':four:';
                    break;
                case '5':
                    string += ':five:';
                    break;
                case '6':
                    string += ':six:';
                    break;
                case '7':
                    string += ':seven:';
                    break;
                case '8':
                    string += ':eight:';
                    break;
                case '9':
                    string += ':nine:';
                    break;
            }
        }
        return string;
    }
}
exports.Strings = Strings;
