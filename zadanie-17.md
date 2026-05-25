# Zadanie 17 — Filtracja i sortowanie zadań

Zaimplementowałem funkcję `getCompletedTitles(tasks)` w pliku `task-filter.js`.

Co robi funkcja:
- Przyjmuje tablicę obiektów `tasks`, gdzie każdy obiekt ma pola `id`, `title`, `status`.
- Filtruje tylko zadania, których `status` (ignorując wielkość liter) to `completed`.
- Sortuje wybrane zadania po `id` rosnąco (najpierw próbuje porównywać id jako liczby, w przeciwnym razie jako napisy z porównaniem numerycznym).
- Zwraca tablicę samych tytułów (`title`).

Implementacja (w pliku `task-filter.js`):

```js
const { getCompletedTitles } = require('./task-filter');
```

Przykład użycia:

```js
const tasks = [
  { id: '3', title: 'Zadanie C', status: 'completed' },
  { id: 1, title: 'Zadanie A', status: 'in-progress' },
  { id: 2, title: 'Zadanie B', status: 'completed' },
  { id: 10, title: 'Zadanie D', status: 'completed' }
];

const titles = getCompletedTitles(tasks);
console.log(titles);
// Wynik: ['Zadanie B', 'Zadanie C', 'Zadanie D']
```

Uwaga:
- Funkcja bezpiecznie obsługuje wejście, które nie jest tablicą — zwróci pustą tablicę.
- Sortowanie traktuje identyfikatory jako liczby, jeśli są numeryczne (np. '2' → 2).
- Jeżeli chcesz, aby sortowanie traktowało `id` zawsze jako string, można uprościć funkcję poprzez porównanie `String(a.id).localeCompare(String(b.id))`.

Pliki utworzone:
- `task-filter.js`
- `zadanie-17.md`

Chcesz, żebym dodał test jednostkowy (Jest) dla tej funkcji i zacommitował zmiany? Jeśli tak, potwierdź.