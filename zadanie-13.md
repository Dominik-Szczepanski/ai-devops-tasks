# fetchUserData z komentarzami JSDoc

```js
/**
 * User data returned by fetchUserData
 * @typedef {Object} UserData
 * @property {string} name - User's full name
 * @property {string} email - User's email address
 * @property {Date} lastLogin - Date object representing last login time
 */

/**
 * Fetch user data from the API and normalize the response.
 *
 * @param {(string|number)} userId - ID of the user to fetch.
 * @returns {Promise<UserData|null>} Promise that resolves to normalized user data,
 * or `null` if there was an error while fetching or parsing.
 *
 * The function will log errors to the console and return `null` on failure,
 * so callers should handle the `null` case.
 */
function fetchUserData(userId) {
  return fetch(`https://api.example.com/users/${userId}`)
    .then(response => {
      if (!response.ok) {
        // Rzuć błąd, aby przejść do bloku .catch
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Parsuj odpowiedź jako JSON
      return response.json();
    })
    .then(data => {
      // Normalizuj strukturę i konwertuj timestamp na obiekt Date
      return {
        name: data.name,
        email: data.email,
        lastLogin: new Date(data.lastLoginTimestamp)
      };
    })
    .catch(error => {
      // Zaloguj błąd i zwróć null – wywołujący powinien to obsłużyć
      console.error('Fetch error:', error);
      return null;
    });
}
```

Uwagi:
- Typ `UserData` ułatwia zrozumienie, co trafia do zwracanego obiektu.
- Funkcja zwraca `Promise<UserData|null>`: warto w kodzie wywołującym sprawdzać, czy wynik nie jest `null`.
- Jeśli wolisz async/await, tę samą funkcję można napisać czytelniej przy użyciu `async` i `try/catch`.
