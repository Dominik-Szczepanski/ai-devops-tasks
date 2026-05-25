# Poprawiony plik docker-compose (chyba błędy w YAML)

Poniżej poprawiony kod YAML (dodano brakujący dwukropek przy `ports`, poprawiono wcięcia i zapis zmiennej środowiskowej):

```yaml
version: "3.8"
services:
  web:
    image: nginx
    ports:
      - "80:80"
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
  db:
    image: postgres
    environment:
      POSTGRES_PASSWORD: "password"
```
