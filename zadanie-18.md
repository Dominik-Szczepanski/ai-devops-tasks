# Bezpieczeństwo aplikacji Dockerowych — 5 kluczowych praktyk

1. Używaj minimalnych obrazów i uruchamiaj procesy jako nie-root (oddzielny użytkownik)
2. Skanuj obrazy pod kątem podatności i podpisuj zaufane obrazy
3. Ogranicz uprawnienia i zasoby (capabilities, read-only filesystem, limity pamięci/CPU)
4. Zarządzaj sekretami bez umieszczania ich w obrazie (secrets manager, Docker secrets, env vars z vault)
5. Segmentuj sieć i stosuj zasadę najmniejszych uprawnień (oddzielne sieci, ograniczone exposed ports)

---

Implementacja praktyki nr 1 — przykład Dockerfile i docker-compose.yml

Cel: upewnić się, że obraz jest jak najmniejszy (mniejsza powierzchnia ataku) i że proces aplikacji nie działa z uprawnieniami root.

Przykładowy `Dockerfile` (Node.js, minimalny obraz Alpine, tworzenie użytkownika aplikacji):

```dockerfile
FROM node:18-alpine

# Ustaw katalog roboczy
WORKDIR /app

# Kopiujemy tylko pliki potrzebne do instalacji zależności (cache warstwy)
COPY package*.json ./

# Instalujemy zależności jako root (potrzebne uprawnienia do instalacji)
RUN npm ci --only=production

# Kopiujemy resztę aplikacji
COPY . .

# Tworzymy nieuprzywilejowanego użytkownika i przypisujemy prawa do katalogu
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && chown -R appuser:appgroup /app

# Przełączamy się na nie-root użytkownika
USER appuser

# Ujawniony port
EXPOSE 3000

CMD ["node", "index.js"]
```

Wyjaśnienie najważniejszych linii:
- `node:18-alpine` — lekki obraz bazowy zmniejsza liczbę pakietów i podatności.
- `npm ci --only=production` — instalujemy tylko zależności produkcyjne oraz korzystamy z lockfile dla powtarzalności.
- `adduser` / `addgroup` i `chown` — tworzymy nieuprzywilejowanego użytkownika i przekazujemy mu prawa do katalogu aplikacji.
- `USER appuser` — uruchomienie procesu jako nie-root znacząco ogranicza skutki ewentualnego przełamania aplikacji.

Przykładowy `docker-compose.yml` z dodatkowymi zabezpieczeniami uruchomieniowymi:

```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    # Można ustawić user na UID:GID jeśli potrzebujesz konkretnego numeru
    # user: "1000:1000"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 5s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.50'
    security_opt:
      - no-new-privileges:true
    tmpfs: /tmp:rw,size=64m
    read_only: true
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE # tylko jeśli naprawdę potrzebne

    volumes:
      - ./config:/app/config:ro

    # Jeśli używasz Docker Swarm / Compose v3 deploy, możesz ustawić polityki restart/placement

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: "${POSTGRES_PASSWORD}"
    volumes:
      - db-data:/var/lib/postgresql/data:rw

volumes:
  db-data:
```

Wyjaśnienie zabezpieczeń w `docker-compose.yml`:
- `read_only: true` — montuje system plików kontenera tylko do odczytu (zmniejsza ryzyko modyfikacji przez atakera). Wymaga to wskazania wolumenów dla katalogów, które muszą być zapisywalne.
- `tmpfs` — tymczasowe katalogi zapisujemy w pamięci (bez zapisu na dysk hosta).
- `cap_drop: - ALL` i ewentualne `cap_add` — usuwamy wszystkie dodatkowe capabilities, a dodajemy tylko te, które są absolutnie niezbędne.
- `no-new-privileges:true` — zapobiega podnoszeniu uprawnień przez procesy w kontenerze.
- `security_opt` i `cap_drop` pomagają wymusić zasadę najmniejszych uprawnień.
- `volumes` z `:ro` — montowanie konfiguracji tylko do odczytu.
- `healthcheck` — pozwala orchestratorowi wykryć problem z aplikacją i reagować (restart/odstąpienie routingu).
- `deploy.resources.limits` — zasoby ograniczają nadużycie pamięci/CPU.

Dodatkowe kroki związane z praktyką nr 1:
- Usuń nieużywane narzędzia z obrazu (np. build deps) lub buduj w dwóch etapach (multi-stage builds), by ostateczny obraz był minimalny.
- Upewnij się, że pliki i katalogi wymagane do zapisu są udostępnione jako wolumeny z odpowiednimi uprawnieniami; resztę trzymaj jako `read-only`.
- Testuj uruchamianie aplikacji z nieuprzywilejowanym UID/GID lokalnie przed wdrożeniem.

---

Podsumowanie (na szybko):
- 5 kluczowych praktyk: minimalne obrazy + non-root, skanowanie, ograniczenia uprawnień i zasobów, zarządzanie sekretami, segmentacja sieci.
- Przykład implementuje praktykę 1: minimalistyczny Dockerfile tworzący nie-root użytkownika oraz `docker-compose.yml` z ustawieniami bezpieczeństwa uruchomieniowego.

Jeśli chcesz, mogę:
- przygotować multi-stage Dockerfile (build + tidy runtime) i zacommitować pliki,
- dodać przykładowe skanowanie obrazu (np. `trivy`) w instrukcjach CI,
- wygenerować konkretny przykład testów uruchamiania jako nie-root.