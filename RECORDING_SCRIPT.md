# 5-Minute Recording — Full Script (speak this)

Read this aloud while you show the app and code. Practice once, then record. Stay under 5 minutes.

---

## PART 1 — Show the app (about 1 minute)

**[DO: Have the app open in the browser. Refresh the page.]**

"This is my photo gallery app, Pixel Pulse. It fetches 30 photos from the Picsum API. When I refresh, you see the loading spinner first, then the grid of photos loads."

**[DO: Type in the search box.]**

"The search bar at the top filters photos by author name in real time. There’s no page reload and no extra API call — we filter the data we already have in memory."

**[DO: Click the heart on one or two photos.]**

"The heart icon toggles a photo as a favourite. When I click it, the photo is added to favourites."

**[DO: Refresh the page.]**

"If I refresh the page, my favourites are still here. That’s because we persist them in localStorage, so they survive a refresh."

---

## PART 2 — useFetchPhotos hook (about 1 minute)

**[DO: Open src/useFetchPhotos.js in the editor.]**

"I extracted the fetch logic into a custom hook called useFetchPhotos. The hook returns three things: photos, loading, and error. The main App component uses this hook and doesn’t call fetch directly."

"We call the Picsum API with limit 30. We map the response to our own shape — id, url, author, title — and then set photos and clear any previous error. If the API fails — for example a network error or a non-OK response — we catch it in the catch block, set the error message in state, and the component shows an error message and a Try Again button instead of crashing. We use a finally block to set loading to false so the spinner stops whether the request succeeds or fails."

---

## PART 3 — useReducer for favourites (about 1 minute)

**[DO: Open src/favoritesReducer.js.]**

"Favourites are managed with useReducer, not useState. The reducer handles three actions. ADD_FAVORITE: we check if the photo is already in the list; if not, we add it. REMOVE_FAVORITE: we filter out the photo by id. SET_FAVORITES: we replace the entire list with the payload, which is useful if we ever need to reset or sync from somewhere else."

**[DO: Open App.jsx and show the useReducer line and the useEffect that saves to localStorage.]**

"The initial state comes from localStorage — we parse whatever is stored under the key 'favorites', or an empty array if nothing is there. So on first load, favourites are restored. In App we have a useEffect that runs whenever the favorites state changes; it writes the current favorites to localStorage. So the reducer is the single source of truth, and localStorage stays in sync with it. That’s why favourites persist after a refresh."

---

## PART 4 — useCallback and useMemo (about 1 minute)

**[DO: In App.jsx, scroll to handleSearch, toggleFavorite, and filteredPhotos — around lines 14–31.]**

"I used useCallback for the search handler and for the toggle-favourite handler. useCallback returns a stable function reference. Without it, we’d create a new function on every render. If we passed that new function down to a child, the child might re-render every time the parent re-renders, even when nothing meaningful changed. So useCallback helps avoid unnecessary re-renders and keeps references stable."

"For the filtered list I used useMemo. We only recompute the filtered photos when photos or searchQuery change. If we didn’t use useMemo, we’d run the filter on every render — including when we toggle a favourite or do something else that doesn’t affect the list. So useMemo avoids doing that filter work when the inputs haven’t changed. The filtered list is only recalculated when its real dependencies change."

---

## PART 5 — One thing that was difficult (about 30–45 seconds)

**Pick one of these and say it in your own words:**

**Option A — SVG path:**  
"One thing that was tricky was the heart icon. The browser was throwing an error saying the SVG path must start with a moveto command — M or m. The path I had started with numbers. I looked it up and added a capital M at the beginning of the path string so the path is valid. That fixed the error."

**Option B — Vite and dependencies:**  
"Getting the project to run was a bit difficult. The Tailwind Vite plugin expected an older version of Vite, and the React plugin expected Vite 8. So there was a peer dependency conflict. I fixed it by running npm install with the flag --legacy-peer-deps, so both packages could be installed and the dev server runs correctly."

**Option C — localStorage and reducer:**  
"Making favourites persist was the part I thought about most. We need to read from localStorage when the app loads for the initial state, and we need to write to localStorage whenever favourites change. I did the read in the reducer’s initial state and the write in a useEffect in App that depends on favorites. That way the reducer stays the single source of truth and the UI and localStorage stay in sync."

---

## End

**[DO: You can say:]**

"That’s my photo gallery and how I implemented the requirements. Thanks for watching."

---

**Before you record:**  
- App running in browser.  
- Editor open with the repo (you’ll open useFetchPhotos.js, favoritesReducer.js, App.jsx).  
- Read the script once so you’re comfortable.  
- Start your screen recorder, then go through all 5 parts in order.
