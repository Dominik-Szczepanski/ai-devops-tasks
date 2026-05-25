# Zadanie 23 - analiza zlozonosci i optymalizacja

## Oryginalny algorytm

```js
function findPairs(arr, targetSum) {
  const pairs = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === targetSum) {
        pairs.push([arr[i], arr[j]]);
      }
    }
  }
  return pairs;
}
```

### Zlozonosc czasowa

- Petla zewnetrzna wykonuje sie `n` razy.
- Petla wewnetrzna lacznie sprawdza wszystkie pary indeksow `(i, j)` dla `i < j`.
- Liczba porownan to `n * (n - 1) / 2`.

Wynik: **O(n^2)**.

### Zlozonosc pamieciowa

- Poza wynikiem (`pairs`) algorytm uzywa stalej liczby zmiennych pomocniczych.

Wynik pomocniczy: **O(1)**.

Jesli liczymy pamiec na wynik, to w najgorszym przypadku liczba par moze wyniesc **O(n^2)**.

## Zoptymalizowana wersja

```js
function findPairsOptimized(arr, targetSum) {
  const pairs = [];
  const seenCounts = new Map();

  for (const num of arr) {
    const complement = targetSum - num;
    const complementCount = seenCounts.get(complement) || 0;

    for (let i = 0; i < complementCount; i++) {
      pairs.push([complement, num]);
    }

    seenCounts.set(num, (seenCounts.get(num) || 0) + 1);
  }

  return pairs;
}
```

### Na czym polega optymalizacja

- Zamiast sprawdzac kazda pare elementow, przechodzimy tablice jeden raz.
- Dla kazdego elementu sprawdzamy w `Map`, ile razy pojawil sie jego dopelniacz do `targetSum`.
- Kazde takie wczesniejsze wystapienie tworzy jedna poprawna pare.

### Zlozonosc czasowa

- Dostepy do `Map` sa srednio **O(1)**.
- Glowne przejscie po tablicy to **O(n)**.
- Dodatkowa praca jest proporcjonalna do liczby zwracanych par `p`.

Wynik: **O(n + p)** srednio, gdzie `p` to liczba znalezionych par.

Uwaga: w najgorszym przypadku `p` moze byc **O(n^2)** (np. wiele duplikatow), wiec calkowity czas nadal moze dojsc do **O(n^2)**.

### Zlozonosc pamieciowa

- `Map` przechowuje czestosci elementow: do **O(n)**.
- Wynik (`pairs`) ma rozmiar **O(p)**.

Wynik pomocniczy: **O(n)**.
