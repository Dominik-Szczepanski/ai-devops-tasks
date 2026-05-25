# Skrypt: Sprawdź i uruchom usługę Docker

Poniżej prosty skrypt bash, który sprawdza, czy usługa Docker działa, a jeśli nie — próbuje ją uruchomić.

```bash
#!/usr/bin/env bash
set -euo pipefail

# Sprawdź, czy polecenie 'docker' jest dostępne
if ! command -v docker >/dev/null 2>&1; then
  echo "Docker nie jest zainstalowany lub nie znajduje się w PATH."
  exit 2
fi

# Jeśli system używa systemd, użyjemy systemctl
if command -v systemctl >/dev/null 2>&1; then
  if systemctl is-active --quiet docker; then
    echo "Docker działa."
    exit 0
  else
    echo "Docker nie działa. Próba uruchomienia..."
    if sudo systemctl start docker; then
      echo "Docker uruchomiony pomyślnie."
      exit 0
    else
      echo "Błąd: nie udało się uruchomić Dockera przez systemctl."
      echo "Sprawdź logi: sudo journalctl -u docker --no-pager -n 50"
      exit 1
    fi
  fi
fi

# Fallback: spróbuj wykonać 'docker info' i jeśli nie działa, użyj 'service' (starsze systemy)
if docker info >/dev/null 2>&1; then
  echo "Docker działa (sprawdzony przez 'docker info')."
  exit 0
else
  echo "Docker nie działa. Próba uruchomienia usługi za pomocą 'sudo service docker start'..."
  if sudo service docker start && sleep 2 && docker info >/dev/null 2>&1; then
    echo "Docker uruchomiony pomyślnie (service)."
    exit 0
  else
    echo "Nie udało się uruchomić Dockera. Sprawdź konfigurację i logi."
    exit 1
  fi
fi
```

Wyjaśnienie linia po linii:

1. `#!/usr/bin/env bash` — Shebang uruchamia skrypt z interpretem bash.
2. `set -euo pipefail` — Bezpieczeństwo: skrypt przerywa się przy błędzie, nieużytej zmiennej i propaguje błędy w potokach.
3. `if ! command -v docker >/dev/null 2>&1; then` — Sprawdzamy, czy polecenie `docker` istnieje w PATH; jeśli nie, raportujemy i wychodzimy.
4. `if command -v systemctl >/dev/null 2>&1; then` — Sprawdzamy, czy systemd jest dostępny (polecenie `systemctl`).
5. `systemctl is-active --quiet docker` — Sprawdza, czy usługa `docker` ma status aktywny (nie wypisuje outputu, zwraca kod). Jeśli tak, kończymy.
6. `sudo systemctl start docker` — Próba uruchomienia usługi Docker przez systemd z podwyższonymi uprawnieniami.
7. `journalctl -u docker --no-pager -n 50` — Polecenie, które użytkownik może uruchomić ręcznie, aby zobaczyć ostatnie logi Dockera gdy start się nie powiódł.
8. `docker info` — Fallback: próba komunikacji z demonem Dockera; jeśli działa, demon jest aktywny.
9. `sudo service docker start` — Alternatywa dla systemów niekorzystających z systemd; próba uruchomienia usługi za pomocą `service`.
10. `sleep 2` — Krótka pauza, żeby dać demonu czas na uruchomienie przed ponowną próbą `docker info`.
11. `exit` z kodami 0/1/2 — Zwracamy odpowiedni kod wyjścia: `0` oznacza sukces, `1` błąd uruchomienia, `2` brak zainstalowanego Dockera.

Uwagi dla początkujących:
- Skrypt używa `sudo` przy uruchamianiu usługi — wymagane będą uprawnienia administratora.
- Możesz go zapisać jako `check_docker.sh`, nadać prawa wykonania `chmod +x check_docker.sh` i uruchamiać ręcznie.
- W środowiskach bez systemd (np. niektóre kontenery) niektóre komendy mogą nie działać; wtedy korzystamy z fallbacku `docker info`.
