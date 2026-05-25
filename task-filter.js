/**
 * Filtruje zadania o statusie 'completed', sortuje po `id` rosnąco
 * i zwraca tablicę tytułów.
 *
 * @param {Array<{id: number|string, title: string, status: string}>} tasks
 * @returns {string[]} tablica tytułów zadań zakończonych
 */
function getCompletedTitles(tasks) {
  if (!Array.isArray(tasks)) return [];

  return tasks
    .filter(task => task && String(task.status).toLowerCase() === 'completed')
    .sort((a, b) => {
      // porównaj id jako liczby jeśli to możliwe, inaczej jako string
      const ai = Number(a.id);
      const bi = Number(b.id);
      if (!Number.isNaN(ai) && !Number.isNaN(bi)) {
        return ai - bi;
      }
      return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
    })
    .map(task => task.title);
}

module.exports = { getCompletedTitles };
