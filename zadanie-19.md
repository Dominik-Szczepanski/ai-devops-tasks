# Zadanie 19 — Refleksje o jakości dokumentacji

Ocena wygenerowanej dokumentacji endpointu `GET /api/users`:

Co jest dobre:
- Dokumentacja zawiera opis endpointu, listę parametrów i ich ograniczenia (domyślne wartości i maksima dla `limit`).
- Podano przykładowe żądanie `curl` oraz przykładową odpowiedź JSON z paginacją i linkami.
- Opisane zostały typowe kody błędów (`400`, `401`, `500`) oraz wskazówki walidacyjne.
- Zamieszczono praktyczne wskazówki implementacyjne i sugestię użycia OpenAPI.

Co można poprawić / braki:
- Brak wskazania czy endpoint wymaga autoryzacji (w dokumentacji jest wzmianka, ale brak formalnej informacji o schemacie auth i wymaganych uprawnieniach/rolach).
- Brak ścisłego schematu odpowiedzi (np. JSON Schema lub OpenAPI types) — to utrudnia automatyczne generowanie klienta i testów.
- Brak przykładów dla pustych wyników (np. gdy `page` jest poza zakresem) oraz dla różnych wartości `role`.
- Brak informacji o limitach rate-limiting i nagłówkach związanych z cache/ETag.
- Nie wymieniono możliwych wartości pola `role` ani czy filtr jest case-sensitive.

Rekomendacje:
1. Dodać OpenAPI spec (YAML/JSON) z pełnym schematem request/response i definicjami modeli.
2. Doprecyzować zabezpieczenia: jakie role lub scope uprawnia do wywołania endpointu; przykładowy nagłówek `Authorization` z opisem.
3. Dodać dodatkowe przykłady odpowiedzi: pusta strona wyników, nieautoryzowany dostęp, przykład błędu walidacji.
4. Wspomnieć o limitach (np. `X-RateLimit-Limit`, `X-RateLimit-Remaining`) i ewentualnej polityce throttlingu.
5. Dodać informacje o polach w modelu `User` (typy, czy `email` jest zawsze zwracany) oraz zasady prywatności.

Podsumowanie:
- Dokumentacja jest przyzwoitym szkieletem, dobre do szybkiego zrozumienia działania endpointu.
- Aby osiągnąć produkcyjny poziom jakości, warto uzupełnić specyfikację o OpenAPI, przykłady błędów, schematy i informacje o autoryzacji oraz politykach rate-limiting i cachowania.

Chętnie wygeneruję OpenAPI spec lub rozszerzę dokumentację o brakujące przykłady, jeśli chcesz.