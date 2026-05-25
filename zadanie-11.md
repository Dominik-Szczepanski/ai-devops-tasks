# Test jednostkowy z użyciem Jest

Utwworzyłem plik `sum.js` z funkcją oraz `sum.test.js` z testem jednostkowym.

Pliki utworzone:
- `sum.js` — zawiera funkcję `sum(a, b)`.
- `sum.test.js` — zawiera prosty test dla tej funkcji.

Treść `sum.js`:
```js
function sum(a, b) {
  return a + b;
}

module.exports = sum;
```

Treść `sum.test.js`:
```js
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

Czym jest Jest?
- Jest to framework do testów JavaScript stworzony przez Facebook (Meta). Umożliwia pisanie testów jednostkowych, integracyjnych oraz snapshotów. Ma wbudowany runner, matchery (`expect`) i mechanizmy mockowania.

Jak zainstalować w projekcie Node.js:
1. Zainicjuj projekt (jeśli jeszcze nie masz `package.json`):

```bash
npm init -y
```

2. Zainstaluj Jest jako zależność developerską:

```bash
npm install --save-dev jest
```

3. Dodaj skrypt testowy do `package.json` (w sekcji `scripts`):

```json
"scripts": {
  "test": "jest"
}
```

Jak uruchomić test:
- Uruchom wszystkie testy:

```bash
npm test
# lub
npx jest
```

- Uruchom konkretny plik testowy:

```bash
npx jest sum.test.js
```

Struktura plików projektu (prosty przykład):

```
my-project/
├─ node_modules/
├─ sum.js
├─ sum.test.js
├─ package.json
├─ package-lock.json
└─ .gitignore
```

Dodatkowe uwagi:
- Możesz używać nowoczesnego importu (ESM) zamiast CommonJS, ale wtedy może być wymagana konfiguracja `type: "module"` w `package.json` lub dodatkowy runner.
- Jest wykrywa pliki testowe według nazwy (`*.test.js`, `*.spec.js`) lub lokalizacji (`__tests__`), więc `sum.test.js` będzie automatycznie uruchamiany.

Chcesz, żebym dodał `package.json` z ustawionym skryptem `test` i wykonał commit + push tych plików? Jeśli tak, potwierdź, a zrobię to.