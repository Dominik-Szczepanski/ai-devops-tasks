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

=====================================

Ulepszony diagram:

```
      +--------+
      | Client |
      +---+----+
            |
            v
     +--------------+
     | Load Balancer|
     +------+-------+
                |
      +-----+-----+
      |           |
 +--v--+     +--v--+
 |App1 |     |App2 |
 |Srv  |     |Srv  |
 +--+--+     +--+--+
      |           |
      +-----+-----+
                |
                v
     +--------------+
     |   Database   |
     | Primary/Replica |
     +--------------+
```
