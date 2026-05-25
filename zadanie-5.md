# Diagram: Połączenie klienta, serwera aplikacji i bazy danych

Poniżej prosty diagram ASCII przedstawiający połączenie komponentów:

```
+--------+      +---------------+      +----------+
| Client | ---> | App Server    | ---> | Database |
+--------+      +---------------+      +----------+
                 ^
                 |
            (opcjonalne połączenie)
```

Opis:
- `Client` — użytkownik lub przeglądarka
- `App Server` — serwer aplikacji (np. Node.js, Python)
- `Database` — baza danych (np. PostgreSQL, MongoDB)
