# Zadanie 21 — Konwersja JSON → CSV

Dane wejściowe (users.json):

```
{
  "users": [
    {
      "id": 1,
      "name": "Jan Kowalski",
      "email": "jan@example.com",
      "roles": ["admin", "user"]
    },
    {
      "id": 2,
      "name": "Anna Nowak",
      "email": "anna@example.com",
      "roles": ["user"]
    }
  ]
}
```

Wynikowy CSV (`users.csv`) ma kolumny: `id,name,email,roles` i wygląda tak:

```
id,name,email,roles
1,Jan Kowalski,jan@example.com,"admin;user"
2,Anna Nowak,anna@example.com,"user"
```

Proces konwersji:
1. Wczytanie obiektu JSON i iteracja po tablicy `users`.
2. Dla każdego obiektu utworzenie wiersza CSV z wartościami pól `id`, `name`, `email`.
3. Pole `roles` w JSON jest tablicą — w CSV przekształcono je na pojedynczy string rozdzielony średnikami (`;`), i umieszczono w cudzysłowie, aby uniknąć problemów z przecinkami.
4. Zapis pliku w formacie RFC4180: pola oddzielone przecinkiem, wartości zawierające separator lub specjalne znaki w cudzysłowie.

Potencjalne wyzwania i decyzje projektowe:

- Reprezentacja tablicy w jednej komórce CSV:
  - Opcje: a) oddzielnik wewnątrz pola (np. `admin;user`), b) zapis jako JSON-string (np. `"[\"admin\",\"user\"]"`), c) rozbicie na wiele kolumn (roles_1, roles_2,...).
  - W tym przykładzie użyto separatora `;` wewnątrz pola, bo jest czytelny i prosty do parsowania po stronie klienta. Dla bardziej złożonych danych lepiej użyć JSON-string lub kolumn powtarzalnych.

- Znak separacji i escapowanie:
  - Jeśli pola zawierają przecinki, nową linię lub cudzysłów, muszą być poprawnie cytowane i escapowane zgodnie z RFC4180 (podwójne cudzysłowy wewnątrz pola zapisujemy jako `""`).

- Typy danych:
  - CSV jest tekstowy — typy (np. liczby, daty) trzeba interpretować po stronie odczytującej.

- Brak struktury zagnieżdżonej:
  - CSV dobrze nadaje się do płaskich rekordów. Dla danych z zagnieżdżonymi strukturami (tablice, obiekty) CSV wymaga decyzji konwersyjnej (patrz wyżej).

- Unicode i kodowanie:
  - Zapewnij kodowanie UTF-8 podczas zapisu, aby polskie znaki (np. `Ł`, `ó`) były poprawnie przechowywane i odczytywane.

- Pusty lub brakujący klucz:
  - Jeżeli nie wszystkie obiekty mają takie same pola, trzeba ustalić wartość domyślną (pusty string) lub kolumnę optional.

- Skalowalność i streaming:
  - Dla dużych plików JSON należy stosować streaming parsers, aby nie ładować całego pliku do pamięci.

Rekomendacje praktyczne:
- Jeśli rolę chcesz później filtrować w CSV, zamiast łączyć role w jeden string rozważ rozbicie na wiele kolumn (roles_1..roles_n) lub zapis JSON w jednej komórce i parsowanie go.
- Dla interoperacyjności z narzędziami BI i arkuszami kalkulacyjnymi trzymaj prosty separator i pamiętaj o cytowaniu pól.
- Dokumentuj konwencję (np. "pole roles zawiera role rozdzielone średnikiem") aby konsumenci CSV wiedzieli jak interpretować dane.

Pliki utworzone:
- `users.json` (oryginalny JSON)
- `users.csv` (wynikowa konwersja)
- `zadanie-21.md` (ten opis)

Jeśli chcesz, mogę:
- wygenerować alternatywny CSV gdzie `roles` będzie zaprezentowane jako JSON-string,
- dostarczyć kod konwersji w Node.js lub Pythonie,
- obsłużyć streamingową konwersję dla dużych plików.
