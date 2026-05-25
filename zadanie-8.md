# Błąd: bind: address already in use (port 3000)

ERROR: for app  Cannot start service app: driver failed programming external connectivity on endpoint app (172.18.0.2): Error starting userland proxy: listen tcp4 0.0.0.0:3000: bind: address already in use

Co to znaczy:
- Kontener próbuje zmapować port 3000 kontenera na port 3000 hosta (np. `-p 3000:3000`), ale port 3000 na hoście jest już zajęty przez inny proces.
- `userland proxy` to mechanizm Dockera, który odpowiada za przekierowanie ruchu z hosta do kontenera; komunikat oznacza, że nie może nasłuchiwać na danym porcie.

Jak to szybko sprawdzić:

- Sprawdź działające kontenery i ich mapowania portów:

```bash
docker ps --format "table {{.Names}}\t{{.Ports}}"
```

- Znajdź proces nasłuchujący na porcie 3000 (Linux):

```bash
sudo ss -ltnp | grep :3000
# lub
sudo lsof -i :3000
```

- Jeśli problem to inny kontener, sprawdź wszystkie kontenery:

```bash
docker ps -a
```

Możliwe przyczyny i jak je rozwiązać:

1) Inna aplikacja na hoście używa portu 3000
- Rozwiązanie: zatrzymaj tę aplikację albo zmień port, np. do 3001.

```bash
# znajdź PID i zabij proces (uwaga: sprawdź co to za proces!)
sudo lsof -t -i :3000 | xargs -r sudo kill
```

2) Inny kontener już zmapował ten port
- Rozwiązanie: zatrzymaj/usuń tamten kontener lub zmień mapowanie portów w `docker run` / `docker-compose.yml`.

```bash
# zatrzymaj kontener
docker ps
docker stop <container-name-or-id>

# lub w docker-compose.yml zmień:
# ports:
#   - "3001:3000"
```

3) Docker nie zdołał zwolnić portu (rare)
- Rozwiązanie: restart Dockera może pomóc:

```bash
sudo systemctl restart docker
# lub
sudo service docker restart
```

4) Problem z userland proxy (IPv4/IPv6 binding)
- Jeśli masz konflikt między IPv4 i IPv6, rozważ ustawienie w daemon.json opcję `"userland-proxy": false` (wymaga restartu Dockera). To sprawi, że Docker użyje mechanizmów kernelowych zamiast userland proxy.

Plik `/etc/docker/daemon.json`:

```json
{
  "userland-proxy": false
}
```

Następnie:

```bash
sudo systemctl restart docker
```

5) Tymczasowe obejścia
- Uruchom kontener na innym hoście porcie:

```bash
docker run -p 3001:3000 myimage
```

- W docker-compose użyj innego portu:

```yaml
ports:
  - "3001:3000"
```

Podsumowanie kroków diagnostycznych:
1. `docker ps` — sprawdź które kontenery działają i jakie porty są zmapowane.
2. `ss -ltnp | grep :3000` lub `lsof -i :3000` — znajdź proces zajmujący port.
3. Jeśli to proces hosta — zatrzymaj go lub zmień port.
4. Jeśli to inny kontener — zatrzymaj/usuń lub zmień mapowanie portów.
5. Jeśli nic nie pomaga — zrestartuj Dockera lub sprawdź `daemon.json` (`userland-proxy`).

Jeśli chcesz, mogę przeanalizować wynik `ss -ltnp | grep :3000` lub `docker ps` i zasugerować konkretny krok. Załaduj tu wynik poleceń, a pomogę dalej.