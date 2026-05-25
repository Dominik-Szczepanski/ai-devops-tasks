# Dlaczego ważne jest ignorowanie tych plików?

Ignorowanie plików w `.gitignore` ma kilka praktycznych powodów:

- Bezpieczeństwo: pliki środowiskowe takie jak `.env` często zawierają hasła, klucze API i dane dostępowe. Dodanie ich do repozytorium naraża te dane na wyciek.
- Rozmiar repozytorium: katalog `node_modules` i lokalne pliki bazy danych (np. `data/db`) mogą zajmować setki megabajtów lub więcej — nie powinny trafić do systemu kontroli wersji.
- Uniknięcie konfliktów i śmieci: pliki generowane lokalnie przez edytory (`.vscode`, `.idea`), system operacyjny (`.DS_Store`) lub narzędzia buildowe (np. `dist/`) nie powinny zaśmiecać historii projektu.
- Reproducibility: zamiast commitować zależności, trzymamy pliki lock (`package-lock.json` lub `yarn.lock`) (jeśli chcemy) i odtwarzamy paczki przez `npm install` lub `yarn install` — to pozwala zachować czystą historię i mniejsze repo.
- Lokalne dane i prywatność: baza danych uruchamiana lokalnie powinna trzymać dane na dysku hosta (volume) i nie być wersjonowana — to zapobiega przypadkowemu ujawnieniu danych użytkowników i ułatwia migracje.

Dobre praktyki:
- Nie commitować `.env` — zamiast tego przechowuj `env.example` z przykładowymi kluczami i instrukcjami konfiguracji.
- Trzymać `package-lock.json` lub `yarn.lock` (jeśli chcesz deterministycznych instalacji), ale nie `node_modules/`.
- Dodawać do `.gitignore` pliki specyficzne dla developerów i środowiska (edytory, tymczasowe pliki, lokalne bazy danych).
- Jeśli używasz Docker Compose i masz plik `docker-compose.override.yml` z lokalnymi hasłami, ignoruj go i trzymaj w repo jedynie bezpieczny przykład `docker-compose.override.sample.yml`.

Podsumowanie: `.gitignore` pomaga utrzymać repo w czystości, zmniejsza ryzyko wycieków danych i sprawia, że historia projektu pozostaje czytelna i łatwa do współdzielenia. 

Pliki stworzone: `.gitignore` oraz `zadanie-10.md`.
