# Zadanie 24 - interpretacja metryk API (ostatnie 24h)

## Dane wejsciowe

- Sredni czas odpowiedzi: 230 ms
- 95 percentyl czasu odpowiedzi (p95): 450 ms
- 99 percentyl czasu odpowiedzi (p99): 1200 ms
- Liczba zapytan: 15 000
- Liczba bledow 5xx: 120
- Uzycie CPU: srednio 45%, max 80%
- Uzycie pamieci: srednio 2.1 GB, max 3.5 GB (z 4 GB dostepnych)

## Szybkie obliczenia i wskazniki

- Error rate (5xx):

$$
\frac{120}{15000} = 0.008 = 0.8\%
$$

- Sukces odpowiedzi (bez 5xx): 99.2%
- Maksymalne zuzycie pamieci: 87.5% dostepnej pamieci

## Interpretacja

1. Opoznienia (latency)
- Srednia 230 ms jest akceptowalna dla wielu API.
- p95 = 450 ms sugeruje, ze wiekszosc odpowiedzi nadal miesci sie ponizej 0.5 s.
- p99 = 1200 ms pokazuje wyrazny "dlugi ogon" opoznien: okolo 1% zapytan trwa znacznie dluzej.
- Roznica miedzy p95 i p99 jest duza, co zwykle wskazuje na sporadyczne problemy: wolne zapytania DB, blokady, GC pauses, timeouty zaleznosci zewnetrznych lub przeciazenia chwilowe.

2. Bledy 5xx
- 0.8% to sygnal ostrzegawczy.
- Dla stabilnych systemow produkcyjnych czesto celuje sie w poziom << 0.5%, a w uslugach krytycznych jeszcze nizej.
- 120 bledow dziennie to na tyle duzo, ze warto ustalic dominujace kody (500/502/503/504) i zrodla bledow.

3. CPU
- Srednio 45% i max 80% nie wygladaja na glowny bottleneck.
- Brak oznak stalej saturacji CPU, ale piki do 80% moga wzmacniac opoznienia, gdy zbiegaja sie z innymi czynnikami (np. I/O, GC, skoki ruchu).

4. Pamiec
- Srednio 2.1 GB jest bezpieczne, ale max 3.5 GB z 4 GB to juz wysoki poziom.
- To moze prowadzic do:
  - czestszego i dluzszego garbage collectora,
  - ryzyka OOM przy naglym skoku ruchu,
  - wzrostu p99.
- Pamiec jest potencjalnym obszarem ryzyka bardziej niz CPU.

## Potencjalne problemy

- Wysoki p99 (1.2 s) i duzy rozjazd p95 -> p99 (long-tail latency).
- Error rate 5xx na poziomie 0.8%.
- Maksymalne zuzycie RAM na poziomie 87.5% (maly margines bezpieczenstwa).
- Mozliwe korelacje: piki opoznien + 5xx + wysokie zuzycie pamieci.

## Rekomendacje poprawy wydajnosci

1. Zmniejszenie p99 i stabilizacja opoznien
- Wprowadz tracing per endpoint (lub rozbuduj istniejacy), aby znalezc najwolniejsze operacje.
- Przeanalizuj top N endpointow wg p95/p99 i wolne zapytania SQL.
- Dodaj/zweryfikuj indeksy DB dla najczestszych i najwolniejszych zapytan.
- Ogranicz kosztowne operacje synchroniczne; przenies ciezkie zadania do kolejek asynchronicznych.
- Rozwaz cache (np. Redis) dla czesto odczytywanych danych i odpowiedzi read-heavy.

2. Redukcja bledow 5xx
- Rozbij 5xx wedlug kodu i endpointu (500/502/503/504), ustaw alerty na trendy.
- Zastosuj timeouty i circuit breaker dla zaleznosci zewnetrznych.
- Dodaj retry z backoff tylko tam, gdzie operacje sa idempotentne.
- Ujednolic obsluge bledow i logowanie przyczyn (stack trace + request id + dependency status).

3. Zarzadzanie pamiecia
- Wlacz profilowanie heap i monitoruj wzrost pamieci w czasie (wykrywanie leakow).
- Sprawdz, czy duze obiekty nie sa niepotrzebnie utrzymywane (cache bez TTL, globalne mapy, bufory).
- Ustaw limity i polityki cache (TTL, max entries, eviction).
- Rozwaz podniesienie limitu pamieci instancji lub poziome skalowanie, jesli piki ruchu sa regularne.

4. SLO i obserwowalnosc
- Ustal cele SLO, np. p95 < 500 ms, p99 < 800 ms, 5xx < 0.3%.
- Dodaj dashboard korelacyjny: latency percentyle, 5xx, CPU, RAM, GC, throughput per endpoint.
- Skonfiguruj alerty wielowarunkowe (np. p99 + 5xx + RAM), aby szybciej wykrywac incydenty.

## Priorytety dzialan (kolejnosc)

1. Diagnostyka 5xx wedlug endpointow i kodow bledu.
2. Analiza long-tail latency (p99) z tracingiem i slow query log.
3. Profilowanie pamieci i polityka cache/TTL.
4. Dalsza optymalizacja i ewentualne skalowanie po potwierdzeniu bottleneckow.

## Podsumowanie

System dziala umiarkowanie stabilnie przy srednim obciazeniu, ale widoczne sa sygnaly ryzyka: podwyzszony p99, niezerowy i istotny poziom 5xx oraz wysoki pik zuzycia pamieci. Najwiekszy potencjal poprawy jest w redukcji long-tail latency, ograniczeniu 5xx i zwiekszeniu marginesu bezpieczenstwa pamieci.
