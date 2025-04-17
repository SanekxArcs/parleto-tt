// Import modułu do mierzenia wydajności
const { performance } = require("node:perf_hooks");

// Import funkcji z głównego pliku
const path = require('path');
const mainScriptPath = path.join(__dirname, 'scritp.js');
let solution1, solution2;

try {
  // Próba pobrania funkcji z głównego pliku
  const main = require(mainScriptPath);
  solution1 = main.solution1;
  solution2 = main.solution2;
} catch (error) {
  // Jeśli funkcje nie są eksportowane, wyświetl instrukcję
  console.error(`
============================================================
Błąd: Nie można zaimportować funkcji solution1 i solution2.
Upewnij się, że w pliku scritp.js znajdują się eksporty:

module.exports = {
  solution1,
  solution2
};

Uruchamiam wersję lokalną testów...
============================================================
`);

  // Implementacja funkcji pomocniczych na potrzeby testu
  const getFirstSunday = (year, month) => {
    const date = new Date(year, month - 1, 1);
    return ((7 - date.getDay()) % 7) + 1;
  };

  const getExpensesUpToFirstSunday = (expenses) => {
    const result = [];
    for (const [yearMonth, days] of Object.entries(expenses)) {
      const [year, month] = yearMonth.split("-").map(Number);
      const firstSunday = getFirstSunday(year, month);
      for (const [day, categories] of Object.entries(days)) {
        if (Number(day) <= firstSunday) {
          for (const category of Object.values(categories)) {
            if (Array.isArray(category)) {
              for (let i = 0; i < category.length; i++) {
                const exp = Number(category[i]);
                if (exp > 0) {
                  result.push(exp);
                }
              }
            }
          }
        }
      }
    }
    return result;
  };

  const partition = (arr, left, right) => {
    const randomIndex = Math.floor(Math.random() * (right - left + 1)) + left;
    [arr[randomIndex], arr[right]] = [arr[right], arr[randomIndex]];
    
    const pivot = arr[right];
    let i = left - 1;
    for (let j = left; j < right; j++) {
      if (arr[j] <= pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
    return i + 1;
  };

  const quickSelect = (arr, left, right, k) => {
    if (left === right) return arr[left];
    const pivotIndex = partition(arr, left, right);
    if (k === pivotIndex) return arr[k];
    else if (k < pivotIndex) return quickSelect(arr, left, pivotIndex - 1, k);
    else return quickSelect(arr, pivotIndex + 1, right, k);
  };

  // Implementacja rozwiązań
  solution1 = (expenses) => {
    const expensesList = getExpensesUpToFirstSunday(expenses);
    if (expensesList.length === 0) return null;
    expensesList.sort((a, b) => a - b);
    const mid = Math.floor(expensesList.length / 2);
    return expensesList.length % 2 === 0
      ? (expensesList[mid - 1] + expensesList[mid]) / 2
      : expensesList[mid];
  };

  solution2 = (expenses) => {
    const expensesList = getExpensesUpToFirstSunday(expenses);
    const n = expensesList.length;
    if (n === 0) return null;
    if (n % 2 === 1) {
      return quickSelect(expensesList, 0, n - 1, Math.floor(n / 2));
    } else {
      const arrCopy1 = [...expensesList];
      const left = quickSelect(arrCopy1, 0, n - 1, Math.floor((n - 1) / 2));
      const arrCopy2 = [...expensesList];
      const right = quickSelect(arrCopy2, 0, n - 1, Math.floor(n / 2));
      if (left === null || right === null) {
        console.error("Quickselect failed to find one or both middle elements.");
        return null;
      }
      return (left + right) / 2;
    }
  };
}

// Funkcja do mierzenia czasu wykonania
const measureTime = (fn, data, label) => {
  const start = performance.now();
  const result = fn(data);
  const time = performance.now() - start;
  console.log(`${label} - Wynik: ${result}, Czas: ${time.toFixed(4)}ms`);
  return { time, result };
};

// Funkcja porównująca wyniki dwóch rozwiązań
const compareResults = (data, name) => {
  const result1 = solution1(data);
  const result2 = solution2(data);
  const areEqual = result1 === result2 || 
                    (result1 !== null && result2 !== null && 
                     Math.abs(result1 - result2) < 0.000001); // Uwzględnia błędy zaokrąglenia
  console.log(`${name}: ${areEqual ? 'ZGODNE' : 'RÓŻNE!'} (solution1: ${result1}, solution2: ${result2})`);
  return areEqual;
};

// Zestaw danych testowych - wzięty z treści zadania
const originalExpenses = {
  "2023-01": {
    "01": {
      food: [22.11, 43, 11.72, 2.2, 36.29, 2.5, 19],
      fuel: [210.22],
    },
    "09": {
      food: [11.9],
      fuel: [190.22],
    },
  },
  "2023-03": {
    "07": {
      food: [20, 11.9, 30.2, 11.9],
    },
    "04": {
      food: [10.2, 11.5, 2.5],
      fuel: [],
    },
  },
  "2023-04": {},
};

// ===== SPECYFICZNE ZESTAWY TESTOWE =====

// Przypadek 1: Dokładnie jedna niedziela w każdym miesiącu
const exactlyOneSunday = {
  "2023-01-01": { // Niedziela
    "01": { food: [10, 20, 30] }
  },
  "2023-02-05": { // Niedziela
    "05": { food: [15, 25, 35] }
  }
};

// Przypadek 2: Różne lata
const multipleYears = {
  "2022-12": {
    "04": { food: [100, 200] } // Niedziela w 2022-12
  },
  "2023-01": {
    "01": { food: [150, 250] } // Niedziela w 2023-01
  },
  "2024-02": {
    "04": { food: [300, 400] } // Niedziela w 2024-02
  }
};

// Przypadek 3: Wartości skrajne (bardzo duże i małe)
const extremeValues = {
  "2023-01": {
    "01": { 
      food: [0.01, 9999999.99, 0.001, 1000000],
      fuel: [0.0001, 5000000]
    }
  }
};

// Przypadek 4: Dużo kategorii wydatków
const manyCategories = {
  "2023-01": {
    "01": {
      food: [10, 20],
      fuel: [100, 200],
      entertainment: [50, 60],
      bills: [300, 400],
      shopping: [25, 75],
      travel: [500, 1000],
      health: [150, 250],
      education: [80, 120]
    }
  }
};

// Przypadek 5: Wiele dni w miesiącu
const manyDaysInMonth = {
  "2023-01": {
    "01": { food: [10, 20] },
    "02": { food: [30, 40] },
    "03": { food: [50, 60] },
    "04": { food: [70, 80] },
    "05": { food: [90, 100] },
    "06": { food: [110, 120] },
    "07": { food: [130, 140] },
    "08": { food: [150, 160] }, // Dni po 7 nie powinny być uwzględniane
    "09": { food: [170, 180] },
    "10": { food: [190, 200] }
  }
};

// Przypadek 6: Nieprawidłowe dane
const invalidData = {
  "2023-01": {
    "01": {
      food: [NaN, "abc", undefined, null, -10, 30], // Tylko 30 powinno być uwzględnione
      fuel: ["xyz", {}, [], true, 50] // Tylko 50 powinno być uwzględnione
    }
  }
};

// Przypadek 7: Dużo powtarzających się wartości
const repeatedValues = {
  "2023-01": {
    "01": { food: [10, 10, 10, 10, 10, 20, 20, 20, 20, 20] }
  }
};

// Przypadek 8: Generowanie dużego zestawu danych
const generateLargeDataset = (size = 100000, distribution = 'random') => {
  const largeExpenses = {};
  const yearMonth = "2023-01";
  const day = "01";
  const expenses = [];
  
  switch (distribution) {
    case 'random':
      for (let i = 0; i < size; i++) {
        expenses.push(parseFloat((Math.random() * 1000).toFixed(2)));
      }
      break;
    case 'normal':
      for (let i = 0; i < size; i++) {
        let sum = 0;
        for (let j = 0; j < 6; j++) sum += Math.random();
        expenses.push(parseFloat(((sum - 3) * 167 + 500).toFixed(2)));
      }
      break;
    case 'sorted':
      for (let i = 0; i < size; i++) {
        expenses.push(parseFloat((i * (1000 / size)).toFixed(2)));
      }
      break;
    case 'reverse-sorted':
      for (let i = 0; i < size; i++) {
        expenses.push(parseFloat(((size - i) * (1000 / size)).toFixed(2)));
      }
      break;
    case 'almost-sorted':
      for (let i = 0; i < size; i++) {
        const base = i * (1000 / size);
        // 90% wartości są prawie posortowane, 10% jest losowych
        if (Math.random() < 0.9) {
          expenses.push(parseFloat((base + Math.random() * 10 - 5).toFixed(2)));
        } else {
          expenses.push(parseFloat((Math.random() * 1000).toFixed(2)));
        }
      }
      break;
  }
  
  largeExpenses[yearMonth] = { [day]: { food: expenses } };
  return largeExpenses;
};

// Zestaw wszystkich testów
const testCases = {
  "Podstawowy z zadania": originalExpenses,
  "Dokładnie jedna niedziela": exactlyOneSunday,
  "Różne lata": multipleYears,
  "Wartości skrajne": extremeValues,
  "Dużo kategorii": manyCategories,
  "Wiele dni w miesiącu": manyDaysInMonth,
  "Nieprawidłowe dane": invalidData,
  "Powtarzające się wartości": repeatedValues
};

// ===== URUCHAMIANIE TESTÓW =====

console.log("===== TESTY DOKŁADNOŚCI =====");
let allTestsPassed = true;

for (const [name, data] of Object.entries(testCases)) {
  console.log(`\nTest: ${name}`);
  const testPassed = compareResults(data, name);
  if (!testPassed) allTestsPassed = false;
}

console.log("\n===== TESTY WYDAJNOŚCI =====");
console.log("\n--- Testy na standardowych danych ---");

for (const [name, data] of Object.entries(testCases)) {
  console.log(`\nTest: ${name}`);
  const { time: time1 } = measureTime(solution1, data, "Rozwiązanie 1");
  const { time: time2 } = measureTime(solution2, data, "Rozwiązanie 2");
  
  if (time1 > 0 && time2 > 0) {
    const speedup = time1 / time2;
    console.log(`Przyspieszenie: ${speedup.toFixed(2)}x`);
  }
}

console.log("\n--- Testy na dużych zbiorach danych ---");
const distributionTypes = ['random', 'normal', 'sorted', 'reverse-sorted', 'almost-sorted'];
const sizes = [1000, 10000, 100000];

// Przygotowanie tabeli wyników
const results = [];

for (const size of sizes) {
  console.log(`\nRozmiar danych: ${size.toLocaleString()} elementów`);
  
  for (const dist of distributionTypes) {
    console.log(`\nRozkład: ${dist}`);
    const testData = generateLargeDataset(size, dist);
    
    const { time: time1, result: result1 } = measureTime(solution1, testData, "Rozwiązanie 1");
    const { time: time2, result: result2 } = measureTime(solution2, testData, "Rozwiązanie 2");
    
    const speedup = time1 / time2;
    console.log(`Przyspieszenie: ${speedup.toFixed(2)}x`);
    
    // Sprawdź poprawność wyników
    const areEqual = result1 === result2 || 
                     (result1 !== null && result2 !== null && 
                      Math.abs(result1 - result2) < 0.000001);
    
    results.push({
      size,
      distribution: dist,
      solution1Time: time1,
      solution2Time: time2,
      speedup,
      resultsMatch: areEqual
    });
  }
}

// Wyświetlanie podsumowania
console.log("\n===== PODSUMOWANIE TESTÓW =====");
console.log(`\nTesty dokładności: ${allTestsPassed ? 'WSZYSTKIE ZDANE' : 'NIEKTÓRE NIE POWIODŁY SIĘ'}`);

console.log("\nŚrednie przyspieszenie według rozmiaru danych:");
const sizeGroups = {};
for (const result of results) {
  if (!sizeGroups[result.size]) sizeGroups[result.size] = [];
  sizeGroups[result.size].push(result.speedup);
}

for (const [size, speedups] of Object.entries(sizeGroups)) {
  const avgSpeedup = speedups.reduce((sum, val) => sum + val, 0) / speedups.length;
  console.log(`- ${size.padStart(6)} elementów: ${avgSpeedup.toFixed(2)}x`);
}

console.log("\nPrzyspieszenie według typu rozkładu (dla wszystkich rozmiarów):");
const distGroups = {};
for (const result of results) {
  if (!distGroups[result.distribution]) distGroups[result.distribution] = [];
  distGroups[result.distribution].push(result.speedup);
}

for (const [dist, speedups] of Object.entries(distGroups)) {
  const avgSpeedup = speedups.reduce((sum, val) => sum + val, 0) / speedups.length;
  console.log(`- ${dist.padEnd(15)}: ${avgSpeedup.toFixed(2)}x`);
}

console.log("\nNajwiększe przyspieszenie:");
const maxSpeedup = results.reduce((max, result) => Math.max(max, result.speedup), 0);
const bestResult = results.find(result => result.speedup === maxSpeedup);
console.log(`- ${maxSpeedup.toFixed(2)}x dla ${bestResult.size.toLocaleString()} elementów z rozkładem "${bestResult.distribution}"`);

console.log("\nNajmniejsze przyspieszenie:");
const minSpeedup = results.reduce((min, result) => Math.min(min, result.speedup), Infinity);
const worstResult = results.find(result => result.speedup === minSpeedup);
console.log(`- ${minSpeedup.toFixed(2)}x dla ${worstResult.size.toLocaleString()} elementów z rozkładem "${worstResult.distribution}"`);

// Wniosek końcowy
console.log("\n===== WNIOSEK =====");
const overallAvgSpeedup = results.reduce((sum, result) => sum + result.speedup, 0) / results.length;
console.log(`Średnie przyspieszenie dla wszystkich testów: ${overallAvgSpeedup.toFixed(2)}x`);

if (overallAvgSpeedup > 1) {
  console.log("Rozwiązanie 2 (Quick Select) jest średnio szybsze od rozwiązania 1 (sortowanie).");
  if (sizes.includes(100000)) {
    const bigSizeResults = results.filter(result => result.size === 100000);
    const bigSizeAvgSpeedup = bigSizeResults.reduce((sum, result) => sum + result.speedup, 0) / bigSizeResults.length;
    console.log(`Dla dużych zestawów danych (100K) przyspieszenie wynosi średnio: ${bigSizeAvgSpeedup.toFixed(2)}x`);
    
    if (bigSizeAvgSpeedup > overallAvgSpeedup) {
      console.log("Różnica wydajności staje się bardziej znacząca przy większych zbiorach danych.");
    }
  }
} else {
  console.log("Rozwiązanie 1 (sortowanie) jest średnio szybsze od rozwiązania 2 (Quick Select).");
}