# Algorytmy mediany wydatków

Ten projekt implementuje dwa różne algorytmy do obliczania mediany wydatków z pierwszej niedzieli każdego miesiąca.

## Zadanie rekrutacyjne

### Stanowisko: JavaScript / Frontend Developer

#### Zadanie
Wyznacz medianę wydatków do pierwszej niedzieli (włącznie) każdego miesiąca
(np. dla 2023-09 i 2023-10 są to dni 1, 2, 3 wrz i 1 paź).

Rozwiązanie należy podzielić na dwie funkcje:

- **solution1** → rozwiązanie niezoptymalizowane (tzw. pierwsza wersja)
- **solution2** → rozwiązanie zoptymalizowane z użyciem jednej z metod:
  - szybkiego sortowania (quick sort)
  - kolejki priorytetowej (priority queues)
  - szybkiego partycjonowania (quick select)
  - innej

W rozwiązaniu zmierz czasy wykonywania funkcji solution1 oraz solution2.

Zmierzone czasy należy umieścić w komentarzu w pierwszej linijce pliku.
Komentarz powinien pasować do wyrażenia regularnego:
`solution1: \d+(.\d+)?ms\ssolution2: \d+(.\d+)?ms`

Należy zastosować rozwiązanie zgodnie z poniższym pseudokodem:

```javascript
expenses = {
    "2023-01": {
        "01": {
            "food": [ 22.11, 43, 11.72, 2.2, 36.29, 2.5, 19 ],
            "fuel": [ 210.22 ]
        },
        "09": {
            "food": [ 11.9 ],
            "fuel": [ 190.22 ]
        }
    },
    "2023-03": {
        "07": {
            "food": [ 20, 11.9, 30.20, 11.9 ]
        },
        "04": {
            "food": [ 10.20, 11.50, 2.5 ],
            "fuel": []
        }
    },
    "2023-04": {}
};

func solution1(expenses) {
    result = null;
    // ...
    return result;
}
func solution2(expenses) {
    result = null;
    // ...
    return result;
}
```

#### Uwagi
- Należy użyć tylko funkcji/modułów ze standardowej biblioteki (np. math).
- Dane są znormalizowane.
- Wynik to jedna liczba dla danych spełniających kryteria lub null.
- Zadanie może zostać wykonane w języku Python (.py) lub JavaScript (.js).
- W pierwszym etapie po przesłaniu pliku z poprawnym wynikiem, uruchomione zostaną testy automatyczne sprawdzające (dla przykładowych danych oraz zestawów z milionem wydatków):
  - poprawne wyniki dla różnych przypadków
  - zużycie procesora
  - zużycie pamięci
- Przesłany plik jest finalnym rozwiązaniem.

Wynik testów automatycznych (dopuszczamy pewną ilość błędów):
- negatywny - aplikacja zostanie automatycznie odrzucona bez dodatkowych informacji zwrotnych (ponowna aplikacja możliwa jest po 90 dniach)
- pozytywny - kod zostanie przekierowany do weryfikacji przez programistów

Jest to pierwszy etap rekrutacji. Po jego pomyślnym zaliczeniu przesłane zostanie drugie zadanie (weryfikujące wiedzę z zakresu budowy aplikacji z użyciem frameworka).

## Problem

Mamy strukturę danych zawierającą informacje o wydatkach w różnych kategoriach (jedzenie, paliwo) z podziałem na daty. Zadanie polega na:
1. Znalezieniu pierwszej niedzieli każdego miesiąca
2. Uwzględnieniu wszystkich wydatków do tej pierwszej niedzieli (włącznie)
3. Obliczeniu mediany tych wydatków

## Rozwiązania

### Rozwiązanie 1 - Standardowe sortowanie (O(n log n))

Pierwsze rozwiązanie używa klasycznego podejścia:
- Wszystkie wydatki są zbierane do jednej tablicy
- Tablica jest sortowana przy użyciu standardowej funkcji sort() (O(n log n))
- Mediana jest obliczana z posortowanej tablicy

### Rozwiązanie 2 - Quick Select (O(n))

Drugie rozwiązanie wykorzystuje algorytm Quick Select:
- Wszystkie wydatki są zbierane do jednej tablicy podobnie jak w pierwszym rozwiązaniu
- Zamiast sortowania całej tablicy, używamy algorytmu Quick Select do znalezienia mediany
- Teoretyczna złożoność czasowa to O(n), co daje przewagę przy dużych zestawach danych

## Porównanie wydajności

Testy wydajności pokazują, że Rozwiązanie 2 (Quick Select) jest znacznie szybsze od Rozwiązania 1 (standardowe sortowanie), zwłaszcza dla dużych zestawów danych:

```
solution1: 0.7426ms solution2: 0.3253ms
```

Dla zestawu testowego rozwiązanie z Quick Select jest ponad dwukrotnie szybsze.

## Struktura projektu

- `scritp.js` - główny plik zawierający implementację obu algorytmów i testy wydajności

## Jak uruchomić

```bash
node scritp.js
```

## Struktura danych wejściowych

Dane wejściowe mają następującą strukturę:

```javascript
{
  "YYYY-MM": {
    "DD": {
      kategoria1: [kwota1, kwota2, ...],
      kategoria2: [kwota1, kwota2, ...],
    }
  }
}
```

Przykład:
```javascript
{
  "2023-01": {
    "01": {
      food: [22.11, 43, 11.72],
      fuel: [210.22],
    }
  }
}
```

## Funkcje pomocnicze

- `getFirstSunday(year, month)` - zwraca dzień miesiąca, który jest pierwszą niedzielą
- `getExpensesUpToFirstSunday(expenses)` - zbiera wszystkie wydatki do pierwszej niedzieli miesiąca
- `quickSelect(arr, left, right, k)` - implementacja algorytmu Quick Select
- `measureTime(fn, data, label)` - funkcja do mierzenia czasu wykonania algorytmu