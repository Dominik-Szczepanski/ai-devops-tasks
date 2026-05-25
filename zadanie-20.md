# Walidator IPv4 — wyrażenie regularne i testy

Wyrażenie regularne (JavaScript):

```
/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/
```

Wyjaśnienie krok po kroku:

- ^ and $ — zaczyna i kończy dopasowanie (upewniamy się, że cały string jest adresem IPv4).
- Cały wzorzec składa się z 4 oktetów rozdzielonych kropkami: `(...\.){3}...`.
- Każdy oktet to alternacja dopuszczająca liczby z zakresu 0–255:
  - `25[0-5]` — dopasowuje 250–255
  - `2[0-4]\d` — dopasowuje 200–249
  - `1\d{2}` — dopasowuje 100–199
  - `[1-9]?\d` — dopasowuje 0–99 bez wiodącego zera dla wielocyfrowych liczb (np. `0`, `9`, `10`, `99`)

Uwagi dotyczące formatów:
- Wyrażenie odrzuci oktety większe niż 255 (np. `256`).
- Nie akceptuje wielocyfrowych oktetów ze wiodącymi zerami (np. `01` jest odrzucone) — to jest celowe, aby uniknąć niejednoznaczności. Jeśli chcesz zaakceptować wiodące zera, można zmodyfikować wzorzec.

Przykłady testów (oczekiwany wynik):

- `0.0.0.0` -> true
- `127.0.0.1` -> true
- `192.168.1.1` -> true
- `255.255.255.255` -> true
- `256.0.0.1` -> false (256 poza zakresem)
- `192.168.1` -> false (brak jednego oktetu)
- `192.168.1.01` -> false (wiodące zero w wielocyfrowym oktetu)
- `01.02.03.04` -> false (wiodące zera)
- `abc.def.gha.bcd` -> false (nie cyfry)

Jak przetestować w Node.js:

1. Utwórz plik `ipv4-validator.js` (gotowy w repozytorium) i uruchom:

```bash
node ipv4-validator.js
```

2. Albo użyj funkcji w swoim kodzie:

```js
const { isValidIPv4 } = require('./ipv4-validator');
console.log(isValidIPv4('192.168.1.1')); // true
```

Plik z funkcją walidującą: `ipv4-validator.js`.
