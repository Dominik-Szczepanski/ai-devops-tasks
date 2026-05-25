# Znajdowanie duplikatów — oryginał i optymalizacja

Oryginalna funkcja (brak optymalizacji):

```python
def find_duplicates(list_of_items):
    duplicates = []
    for i in range(len(list_of_items)):
        for j in range(i+1, len(list_of_items)):
            if list_of_items[i] == list_of_items[j] and list_of_items[i] not in duplicates:
                duplicates.append(list_of_items[i])
    return duplicates
```

Optymalna wersja (użycie zbiorów, O(n) średnio):

```python
def find_duplicates_optimized(list_of_items):
    seen = set()
    duplicates = []
    duplicates_set = set()

    for item in list_of_items:
        if item in seen:
            if item not in duplicates_set:
                duplicates.append(item)
                duplicates_set.add(item)
        else:
            seen.add(item)

    return duplicates
```

Dlaczego optymalizacja jest lepsza?

- Złożoność czasowa:
  - Oryginał: O(n^2) dla listy długości n, ponieważ dla każdego elementu sprawdzamy resztę listy (podwójna pętla).
  - Optymalna wersja: O(n) średnio — każdy element jest przetworzony raz, a operacje na zbiorach (`set`) mają średnio O(1).

- Pamięć:
  - Optymalizacja używa dodatkowych struktur (zbiory `seen` i `duplicates_set`), co daje O(n) dodatkowej pamięci w najgorszym przypadku. To typowy kompromis: wymiana czasu (szybsze) za pamięć (dodatkowy set).

- Zachowanie porządku:
  - Zoptymalizowana wersja zachowuje kolejność pierwszego wystąpienia duplikatu tak jak oryginał (pierwszy napotkany duplikat zostanie dołączony do listy `duplicates`). Jeśli porządek nie jest istotny, można zwrócić `duplicates_set` jako zbiór.

Alternatywy:
- Użycie `collections.Counter` do wykrycia elementów występujących więcej niż raz:

```python
from collections import Counter

def find_duplicates_counter(list_of_items):
    return [item for item, count in Counter(list_of_items).items() if count > 1]
```

  - Ta metoda jest czytelna i również działa w O(n), ale zachowanie porządku zależy od implementacji kolekcji (w praktyce w Pythonie 3.7+ zachowanie wstawiania jest utrzymywane przez słowniki, więc kolejność powinna odzwierciedlać pierwsze wystąpienie).

Kiedy użyć której wersji:
- Dla niewielkich list (kilkaset elementów) różnice mogą być nieistotne — czytelność kodu ma większe znaczenie.
- Dla dużych list (dziesiątki tysięcy i więcej) zdecydowanie użyj wersji zoptymalizowanej (lub Counter), żeby uniknąć gwałtownego spadku wydajności.

Przykład użycia i test:
```python
if __name__ == '__main__':
    data = [1,2,3,2,4,1,5,3,3]
    print(find_duplicates(data))
    print(find_duplicates_optimized(data))
    print(find_duplicates_counter(data))
```

Oba zoptymalizowane warianty zwrócą listę elementów, które występują więcej niż raz (np. `[1,2,3]`).
