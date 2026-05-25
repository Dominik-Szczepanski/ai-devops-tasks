# Simple Task API

Opis
----
Simple Task API to proste REST API do zarządzania zadaniami (tasks). Aplikacja napisana jest w Node.js z użyciem Express i MongoDB. Umożliwia tworzenie, odczyt, aktualizację i usuwanie zadań, filtrowanie po statusie i priorytecie oraz prostą autoryzację użytkowników.

Wymagania
---------
- Node.js >= 18
- npm
- MongoDB (lokalnie lub zdalnie)

Instalacja
----------
1. Sklonuj repozytorium:

```bash
git clone <repo-url>
cd Simple-Task-API
```

2. Zainstaluj zależności:

```bash
npm install
```

3. Skonfiguruj zmienne środowiskowe (przykład w `.env`):

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/simple-task-api
JWT_SECRET=your_jwt_secret
```

Użycie (lokalne)
----------------
Uruchom aplikację w trybie deweloperskim:

```bash
npm run dev
```

Uruchom produkcyjnie:

```bash
npm start
```

Endpointy API
-------------
Wszystkie endpointy zwracają i przyjmują JSON.
Autoryzacja: większość endpointów wymagających modyfikacji danych wymaga nagłówka `Authorization: Bearer <token>`.

- GET /api/tasks
  - Opis: Zwraca listę zadań (paginowana).
  - Parametry zapytania:
    - `page` (opcjonalny, domyślnie 1)
    - `limit` (opcjonalny, domyślnie 10, max 100)
    - `status` (opcjonalny, np. `pending`, `in-progress`, `completed`)
    - `priority` (opcjonalny, np. `low`, `medium`, `high`)
  - Przykład:

```bash
curl "http://localhost:3000/api/tasks?page=1&limit=20&status=completed"
```

- POST /api/tasks
  - Opis: Tworzy nowe zadanie.
  - Body (JSON):
    - `title` (string, wymagane)
    - `description` (string, opcjonalne)
    - `status` (string, domyślnie `pending`)
    - `priority` (string, np. `low`, `medium`, `high`)
  - Przykład:

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Nowe zadanie","description":"Opis"}'
```

- GET /api/tasks/:id
  - Opis: Pobiera zadanie po identyfikatorze.

- PUT /api/tasks/:id
  - Opis: Aktualizuje zadanie. Przyjmuje body z polami do zmiany.

- DELETE /api/tasks/:id
  - Opis: Usuwa zadanie.

Przykładowa struktura obiektu `task`:

```json
{
  "id": "642f1c2e4f1a2b3c4d5e6f7",
  "title": "Przykładowe zadanie",
  "description": "Opis zadania",
  "status": "pending",
  "priority": "medium",
  "createdAt": "2025-05-25T10:00:00Z",
  "updatedAt": "2025-05-25T10:00:00Z"
}
```

Testy
-----
- Użyj `npm test` jeśli w projekcie skonfigurowano testy (np. Jest).

Rozszerzenia i uwagi
--------------------
- Dodaj walidację wejścia (np. przy użyciu `Joi` lub `express-validator`).
- Zaimplementuj obsługę ról i granularnych uprawnień w autoryzacji.
- Dodaj rate-limiting i logging w produkcji.

Kontakt
-------
W razie pytań otwórz issue lub PR w repozytorium.
