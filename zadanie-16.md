# Zadanie 16 — konwersja skryptu backupu do PowerShell

Utworzyłem dwa skrypty:

- `backup-db.sh` — oryginalny skrypt bash (Linux):
  - używa `mysqldump` i bezpośrednio pakuje wynik do `gzip` przy pomocy potoku.
  - ścieżki i formaty nazw są typowe dla Linuksa (`/var/backups/db`, `.sql.gz`).

- `backup-db.ps1` — ekwiwalent w PowerShell (Windows):
  - wywołuje `mysqldump` i zapisuje wynik do pliku tymczasowego `.sql`.
  - używa biblioteki .NET (`System.IO.Compression.GZipStream`) do spakowania pliku do formatu `.gz`.
  - wynika to z faktu, że Windows nie zawsze ma dostępny polecenie `gzip` podobne do Linuksa.

Główne różnice i uwagi (bash vs PowerShell):

1. Ścieżki i format nazewnictwa:
   - Bash (Linux): używa `/var/backups/db` oraz separatora `/`.
   - PowerShell (Windows): typowe miejsce backupu `C:\Backups\db`, używamy `Join-Path` dla bezpiecznego łączenia ścieżek.

2. Kompresja strumieniowa:
   - W bashu można bezpośrednio pipować `mysqldump | gzip > file.sql.gz` co jest prostym i efektywnym podejściem.
   - W PowerShell domyślnie nie ma `gzip` jako wbudowanego polecenia; dlatego zapisujemy najpierw plik `.sql`, a następnie używamy .NET `GZipStream` do kompresji, po czym usuwamy plik tymczasowy.

3. Sprawdzanie błędów:
   - W bashu używamy kodu wyjścia `$?` (lub bezpośrednio `$?` sprawdzane przez `if [ $? -eq 0 ]`).
   - W PowerShell sprawdzamy `$LASTEXITCODE` po uruchomieniu zewnętrznego procesu; błędy .NET obsługujemy w `try/catch`.

4. Uprawnienia i interaktywne wprowadzanie hasła:
   - Bash: `mysqldump -u root -p` spowoduje interaktywne promptowanie o hasło w terminalu.
   - PowerShell: podobnie, polecenie z `-p` spowoduje zapytanie o hasło jeśli `mysqldump` tak działa na Windows. Alternatywnie można użyć parametrów bezpośrednio lub poświadczeń (bardziej bezpieczne rozwiązanie to użycie menadżera sekretów zamiast umieszczania haseł w skrypcie).

5. Obsługa plików i operacje I/O:
   - Bash używa standardowych narzędzi shellowych i potoków.
   - PowerShell korzysta z obiektów .NET (np. `System.IO.File`), co daje większą kontrolę nad strumieniami i kompresją.

6. Format skompresowanego pliku:
   - W obu skryptach wynik końcowy to plik z kompresją gzip (`.gz`) — w PowerShell dokonaliśmy kompresji ręcznie.

7. Wyjścia i komunikaty:
   - Oba skrypty wypisują komunikaty do konsoli o powodzeniu lub błędzie i zwracają kod wyjścia (`0` lub `1`).

Rekomendacje praktyczne:
- Na Windows rozważ użycie narzędzi dostosowanych do środowiska (np. korzystanie z usług kopii zapasowej lub modułów PowerShell z obsługą MySQL), albo umieszczenie `gzip` w PATH (np. z Git for Windows), jeśli chcesz zachować prosty potok.
- Unikaj podawania hasła w parametrze `-p` na linii poleceń (może być widoczne w historii/procesach). Zamiast tego użyj menadżera sekretów lub pliku konfiguracyjnego z odpowiednimi uprawnieniami.

Pliki utworzone:
- `backup-db.sh`
- `backup-db.ps1`
- `zadanie-16.md`

Jeśli chcesz, mogę:
- Dodać parametry do skryptu (np. nazwa bazy, katalog backupów, użytkownik),
- Dodać obsługę bezpiecznego wczytywania hasła (np. `Read-Host -AsSecureString` i konwersja do plain-text tylko dla wywołania),
- Zademonstrować testowy przebieg (jeśli udostępnisz środowisko lub wyniki poleceń).
