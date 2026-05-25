# Zadanie 14 — analiza logów Dockera

Dane logów:

```
May 19 10:15:32 server dockerd[1234]: time="2025-05-19T10:15:32.123456789Z" level=info msg="Container 78a2b3c4 health status changed from starting to healthy"
May 19 10:16:45 server dockerd[1234]: time="2025-05-19T10:16:45.987654321Z" level=info msg="Container 78a2b3c4 failed to connect to 172.17.0.3:5432: connection refused"
May 19 10:16:47 server dockerd[1234]: time="2025-05-19T10:16:47.246813579Z" level=warning msg="Container 78a2b3c4 health status changed from healthy to unhealthy"
```

Analiza (po polsku):

- 10:15:32 — Kontener `78a2b3c4` zmienił status health check z `starting` na `healthy`.
  - Znaczy to, że w tym momencie mechanizm sprawdzający zdrowie kontenera (healthcheck) uznał aplikację wewnątrz kontenera za działającą poprawnie.

- 10:16:45 — Pojawił się błąd: kontener `78a2b3c4` nie mógł się połączyć z adresem `172.17.0.3:5432` — "connection refused".
  - Adres i port wskazują typowo na usługę bazy danych PostgreSQL (domyślny port 5432) uruchomioną na innym kontenerze lub hoście w sieci Dockera.
  - "connection refused" oznacza, że na wskazanym porcie nikt nie nasłuchuje lub połączenie było odrzucane (może usługa nie wystartowała, zamknięty port, firewall, albo proces nasłuchuje na innym interfejsie).
  - Możliwe przyczyny:
    - Docelowy kontener (baza danych) nie działa lub nie jest w pełni gotowy do przyjmowania połączeń.
    - Sieć Dockera między kontenerami ma problem (np. niewłaściwy adres IP, kontenery w różnych sieciach, usunięcie/restart DB).
    - Baza danych nasłuchuje tylko na `localhost` wewnątrz swojego kontenera zamiast na `0.0.0.0`.
    - Firewall/iptables lub inna reguła blokuje połączenia.

- 10:16:47 — Po 2 sekundach od błędu healthcheck zmienia status z `healthy` na `unhealthy`.
  - To sugeruje, że mechanizm healthcheck (prawdopodobnie uruchamiany cyklicznie co kilka sekund) wykrył błąd i oznaczył kontener za niezdrowy.
  - Wiele orchestratorów/compose reaguje na `unhealthy` w różny sposób (restart, routing wyłączenia, alerty) — warto sprawdzić konfigurację restartów i sposób obsługi health status.

Wnioski i kroki diagnostyczne (co sprawdzić teraz):

1. Sprawdź stan kontenera bazy danych i jego logi:

```bash
docker ps -a --filter "id=78a2b3c4" # lub docker ps -a by znaleźć kontenery
# znajdź kontener z IP 172.17.0.3 (docker inspect lub docker ps --format)
```

2. Sprawdź, czy kontener DB działa i nasłuchuje na porcie 5432:

```bash
docker ps
# sprawdź logs bazy danych
docker logs <db-container-id>
# z poziomu hosta lub innego kontenera spróbuj połączyć się na ten port
# z hosta (jeśli port wystawiony):
ss -ltnp | grep 5432
# lub w sieci dockera uruchom tymczasowy kontener i sprawdź:
docker run --rm --network container:<db-container-id> alpine sh -c "apk add --no-cache netcat-openbsd && nc -vz 127.0.0.1 5432"
```

3. Sprawdź adresację i sieć Dockera:

```bash
docker inspect <db-container-id> | jq '.[0].NetworkSettings'
docker network inspect <network-name>
```

4. Sprawdź konfigurację healthcheck aplikacji `78a2b3c4` i ustawienia retry/timeout — być może healthcheck jest zbyt agresywny:

- W `Dockerfile` lub `docker-compose.yml` sprawdź instrukcję `HEALTHCHECK` lub `healthcheck:` (timeout, interval, retries).
- Rozważ zwiększenie `interval`/`timeout` lub dodanie logicznego retry w aplikacji przy łączeniu do DB.

5. Sprawdź, czy aplikacja obsługuje ponawianie połączeń (retry/backoff). Jeśli nie, pojedyncze odrzucenie połączenia może spowodować natychmiastowe przejście do `unhealthy`.

6. Sprawdź czy PostgreSQL jest skonfigurowany do nasłuchu na wszystkich interfejsach (w `postgresql.conf` parametr `listen_addresses`), lub czy bind address nie jest ograniczony.

7. Przejrzyj logi aplikacji w kontenerze `78a2b3c4` (docker logs) — mogą być dodatkowe informacje, np. stack trace, błędy połączenia.

Proponowane naprawy i środki zaradcze:

- Jeżeli DB startuje wolniej niż aplikacja, ustaw zależności startowe i healthchecks tak, aby aplikacja czekała: np. w compose użyć `depends_on` z `condition: service_healthy` (w starszych wersjach), albo lepiej wprowadzić retry w aplikacji.
- Upewnij się, że DB nasłuchuje na właściwym interfejsie i porcie.
- Zwiększ tolerancję healthchecków (więcej retries, dłuższy timeout) lub zmień warunek healthchecka, żeby uwzględniał czasowe błędy połączeń.
- Jeśli to błąd sieciowy — sprawdź konfigurację sieci Dockera i ewentualne konflikty CIDR.
- Dodaj monitoring/logowanie, żeby zbierać statystyki i alarmy przy przejściach `healthy`→`unhealthy`.

Krótka synteza:
- Sekwencja logów pokazuje: najpierw kontener był zdrowy, potem nastąpiła nieudana próba połączenia do usług zewnętrznych (prawdopodobnie DB) i w efekcie container został oznaczony jako `unhealthy`.
- Główne podejrzenie: problem z osiągalnością PostgreSQL (usługa DB niedostępna lub sieć/konfiguracja blokuje połączenia).

Plik zapisano jako `zadanie-14.md`.
