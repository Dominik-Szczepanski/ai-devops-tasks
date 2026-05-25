# GET /api/users

Opis:
Endpoint zwraca paginowaną listę użytkowników. Umożliwia filtrowanie po roli oraz kontrolę rozmiaru strony.

Metoda: GET
Ścieżka: /api/users
Nagłówki:
- `Accept: application/json`
- `Authorization: Bearer <token>` — jeśli endpoint jest chroniony (zalecane)

Parametry zapytania (query):

- `page` (integer, opcjonalny) — numer strony, domyślnie `1`. Musi być >= 1.
- `limit` (integer, opcjonalny) — liczba wyników na stronę, domyślnie `10`, maksymalnie `100`.
- `role` (string, opcjonalny) — filtr po roli użytkownika (np. `admin`, `user`, `viewer`). Jeśli nie podano, zwracane są wszystkie role.

Walidacja i błędy:
- Jeśli `page` lub `limit` nie są liczbami całkowitymi lub są poza dozwolonym zakresem, serwer zwraca `400 Bad Request` z opisem błędu.
- Jeśli endpoint wymaga autoryzacji a nagłówek `Authorization` nie jest podany lub jest nieprawidłowy — `401 Unauthorized`.
- W przypadku błędu serwera — `500 Internal Server Error`.

Przykładowe żądanie (curl):

```bash
curl -X GET "https://api.example.com/api/users?page=2&limit=5&role=admin" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <TOKEN>"
```

Przykładowa odpowiedź (200 OK):

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": [
    { "id": 11, "name": "Anna Kowalska", "email": "anna@example.com", "role": "admin" },
    { "id": 12, "name": "Jan Nowak", "email": "jan@example.com", "role": "admin" }
  ],
  "meta": {
    "page": 2,
    "limit": 5,
    "total": 42,
    "totalPages": 9
  },
  "links": {
    "self": "/api/users?page=2&limit=5&role=admin",
    "first": "/api/users?page=1&limit=5&role=admin",
    "prev": "/api/users?page=1&limit=5&role=admin",
    "next": "/api/users?page=3&limit=5&role=admin",
    "last": "/api/users?page=9&limit=5&role=admin"
  }
}
```

Przykładowa odpowiedź (400 Bad Request):

```json
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Invalid query parameter: limit must be an integer between 1 and 100"
}
```

Wskazówki implementacyjne:
- Zaimplementuj paginację po stronie serwera (OFFSET/LIMIT lub kursory) i zwracaj metadane (`meta`) oraz linki (`links`) aby ułatwić nawigację klientom.
- Waliduj parametry `page` i `limit` i zwracaj czytelne komunikaty błędów.
- Filtr `role` powinien wspierać tylko zdefiniowane role (można zwracać `400` dla nieznanej roli lub ignorować filtr).
- Jeśli zwracasz prywatne pola (np. `email`), upewnij się, że klient jest autoryzowany, lub maskuj dane według uprawnień.
- Rozważ dodanie nagłówków informujących o limitach (Rate-Limit-Remaining itp.) oraz ETag/Cache-Control dla cachowania odpowiedzi.

Sugestia: rozważ opisanie endpointu w OpenAPI (Swagger) aby ułatwić generowanie klienta i walidację.
