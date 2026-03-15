import { useReducer, useMemo } from 'react'
import { favoritesReducer, initialState } from './favoritesReducer'

const MOCK_PHOTOS = [
  { id: 1, url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', title: 'Mountain Lake' },
  { id: 2, url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80', title: 'Forest Mist' },
  { id: 3, url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', title: 'Sunshine Woods' },
  { id: 4, url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80', title: 'Ocean Sunset' },
  { id: 5, url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80', title: 'Green Meadows' },
  { id: 6, url: 'https://images.unsplash.com/photo-1532274402911-5a3b953c5bb2?w=800&q=80', title: 'Golden Fields' },
]

function App() {
  const [favorites, dispatch] = useReducer(favoritesReducer, initialState)

  const toggleFavorite = (photo) => {
    const isFavorite = favorites.some((fav) => fav.id === photo.id)
    if (isFavorite) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: photo })
    } else {
      dispatch({ type: 'ADD_FAVORITE', payload: photo })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Pixel Pulse
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A premium photo gallery built with Vite, Tailwind CSS, and React Reducers.
          </p>
          <div className="mt-6 inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
            <span className="text-red-500 mr-2">❤️</span>
            <span className="font-semibold text-slate-700">{favorites.length} Favorites</span>
          </div>
        </header>

        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_PHOTOS.map((photo) => {
            const isFavorite = favorites.some((fav) => fav.id === photo.id)
            return (
              <div
                key={photo.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="aspect-w-16 aspect-h-12 overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="p-5 flex justify-between items-center bg-white">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{photo.title}</h3>
                    <p className="text-sm text-slate-500">Nature Collection</p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(photo)}
                    className={`p-3 rounded-full transition-all duration-300 ${isFavorite
                        ? 'bg-red-50 text-red-500 shadow-inner'
                        : 'bg-slate-50 text-slate-400 hover:text-red-400 hover:bg-red-50'
                      }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 ${isFavorite ? 'fill-current' : 'fill-none'}`}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )
          })}
        </main>

        {favorites.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
              <span className="mr-3">❤️</span> Your Collection
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {favorites.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.url}
                    className="w-full h-32 object-cover rounded-xl shadow-sm border-2 border-white"
                    alt={photo.title}
                  />
                  <button
                    onClick={() => dispatch({ type: 'REMOVE_FAVORITE', payload: photo })}
                    className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default App
