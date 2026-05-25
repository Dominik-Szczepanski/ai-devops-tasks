# Zadanie 15 — Refaktoryzacja `getEnvironmentConfig`

Utworzyłem dwa pliki:
- `config.js` — oryginalna funkcja bez zmian.
- `config-refactored.js` — zrefaktoryzowana, bardziej czytelna i łatwiejsza do utrzymania wersja.

## Co zmieniłem

1. Zamiast wielu instrukcji `if/else` użyłem obiektu `CONFIGS`, który mapuje nazwę środowiska na konfigurację.
2. Funkcja `getEnvironmentConfig` przyjmuje domyślny argument `env = 'development'`, a następnie zwraca `CONFIGS[env]` lub `CONFIGS.development` jeśli podane środowisko jest nieznane.
3. Dodałem krótki komentarz JSDoc opisujący zwracany typ.

## Zalety refaktoryzacji

- Czytelność: konfiguracje są zebrane w jednym miejscu, łatwiej je porównać i edytować.
- Łatwość rozbudowy: dodanie nowego środowiska sprowadza się do dopisania wpisu w `CONFIGS`.
- Mniejsza liczba gałęzi logicznych: unikasz rozrastającego się łańcucha `if/else`.
- Mniej podatne na błędy: unikamy powtarzania domyślnej konfiguracji w wielu miejscach.
- Lepsze testowanie: łatwiej jest testować mapę `CONFIGS` oraz funkcję która ją zwraca.

## Pliki dodane
- `config.js` — oryginalna funkcja (niezmieniona).
- `config-refactored.js` — zrefaktoryzowana funkcja.
- `zadanie-15.md` — ten plik z opisem zmian.

Jeśli chcesz, mogę także:
- Dodać walidację argumentu `env` oraz wypisać ostrzeżenie jeśli podano nieznane środowisko.
- Eksportować wszystkie dostępne klucze konfiguracji (np. `module.exports = { getEnvironmentConfig, CONFIGS }`).
- Zacommitować i wypchnąć zmiany do `origin/main`.