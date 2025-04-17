// Import modułu do mierzenia wydajności
const { performance } = require("node:perf_hooks");

// solution1: 0.7426ms solution2: 0.3253ms
const expenses = {
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

// Funkcja pomocnicza do znalezienia pierwszej niedzieli miesiąca
const getFirstSunday = (year, month) => {
  const date = new Date(year, month - 1, 1);
  return ((7 - date.getDay()) % 7) + 1;
};

// Funkcja pomocnicza do spłaszczenia wydatków do pierwszej niedzieli (dla dużych danych)
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

// Funkcja pomocnicza Quick Select dla rozwiązania 2
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

// Rozwiązanie 1: Niezoptymalizowane
const solution1 = (expenses) => {
  const expensesList = getExpensesUpToFirstSunday(expenses);
  if (expensesList.length === 0) return null;
  expensesList.sort((a, b) => a - b);
  const mid = Math.floor(expensesList.length / 2);
  return expensesList.length % 2 === 0
    ? (expensesList[mid - 1] + expensesList[mid]) / 2
    : expensesList[mid];
};

// Rozwiązanie 2: Zoptymalizowane - Używa Quick Select do znalezienia mediany
const solution2 = (expenses) => {
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

// Funkcja do mierzenia czasu i testowania
const measureTime = (fn, data, label) => {
  const start = performance.now();
  const result = fn(data);
  const time = performance.now() - start;
  console.log(`${label} - result: ${result}, time: ${time.toFixed(4)}ms`);
  return time;
};

const duration1Ms = measureTime(solution1, expenses, "solution1:");
const duration2Ms = measureTime(solution2, expenses, "solution2:");

console.log(`solution1: ${duration1Ms.toFixed(4)}ms solution2: ${duration2Ms.toFixed(4)}ms`);

// Eksport funkcji dla testów
module.exports = {
  solution1,
  solution2
};