# Jak rozwiązać problem z dużym zużyciem pamięci przez kontener Docker?

Najpierw sprawdź, co dokładnie zużywa pamięć, używając `docker stats` albo logów aplikacji. Następnie ustaw limity pamięci dla kontenera, na przykład przez `--memory` i `--memory-swap`, żeby jeden proces nie zajmował całej dostępnej RAM. Warto też zoptymalizować aplikację: zamknąć niepotrzebne procesy, usunąć wycieki pamięci i ograniczyć bufory lub cache. Jeśli kontener działa zbyt ciężko, rozważ zmianę obrazu na lżejszy, na przykład `alpine`, oraz przeniesienie ciężkich zadań do osobnych usług.


---

Jako doświadczony DevOps Engineer z 10-letnim doświadczeniem zacząłbym od ustalenia, czy problem wynika z samej aplikacji, czy z konfiguracji kontenera. Najszybciej diagnozujesz to przez `docker stats`, metryki z Prometheusa lub logi aplikacji, a potem ustawiasz twarde limity pamięci i testujesz, czy proces nie jest ubijany przez OOM. Jeśli aplikacja stale rośnie w pamięci, sprawdzasz wycieki, konfigurację JVM lub Node.js, rozmiar cache i liczbę równoległych workerów. W produkcji najlepiej też stosować mniejsze obrazy, pojedynczą odpowiedzialność kontenera i skalowanie poziome zamiast dokładania RAM do jednego procesu.
(napisalem to ja jako doswiadczony DevOps)
