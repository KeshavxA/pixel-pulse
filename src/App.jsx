import { useReducer, useEffect, useState, useMemo, useCallback } from 'react'
import { favoritesReducer, initialState } from './favoritesReducer'

const MOCK_PHOTOS = [
  { id: 1, url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', title: 'Mountain Lake', category: 'Nature', author: 'John Doe' },
  { id: 2, url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80', title: 'Forest Mist', category: 'Nature', author: 'Jane Smith' },
  { id: 3, url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', title: 'Sunshine Woods', category: 'Nature', author: 'Alex Rivera' },
  { id: 4, url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80', title: 'Ocean Sunset', category: 'Nature', author: 'Sarah Brown' },
  { id: 5, url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80', title: 'Green Meadows', category: 'Nature', author: 'Michael Chen' },
  { id: 6, url: 'https://images.unsplash.com/photo-1532274402911-5a3b953c5bb2?w=800&q=80', title: 'Golden Fields', category: 'Nature', author: 'Emma Wilson' },
  { id: 7, url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', title: 'Quiet Farm', category: 'Rural', author: 'David Clark' },
  { id: 8, url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=80', title: 'Majestic Peaks', category: 'Nature', author: 'Lucas Martin' },
]

function App() {
  const [favorites, dispatch] = useReducer(favoritesReducer, initialState)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = useCallback((photo) => {
    const isFavorite = favorites.some((fav) => fav.id === photo.id)
    if (isFavorite) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: photo })
    } else {
      dispatch({ type: 'ADD_FAVORITE', payload: photo })
    }
  }, [favorites])

  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value)
  }, [])

  const filteredPhotos = useMemo(() => {
    return MOCK_PHOTOS.filter(photo =>
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.author.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Pixel Pulse
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Explore a premium collection of fine photography by world-class artists.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
            <div className="relative w-full max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search by author name..."
                className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchQuery}
                onChange={handleSearch}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="inline-flex items-center px-6 py-3 bg-white rounded-xl shadow-sm border border-slate-200">
              <span className="text-red-500 mr-2">❤️</span>
              <span className="font-semibold text-slate-700">{favorites.length} Favorites</span>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => {
            const isFavorite = favorites.some((fav) => fav.id === photo.id)
            return (
              <div
                key={photo.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-100"
              >
                <div className="overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                <div className="p-4 flex justify-between items-center">
                  <div className="truncate pr-2">
                    <h3 className="text-base font-bold text-slate-800 truncate">{photo.title}</h3>
                    <p className="text-xs font-medium text-blue-600 mb-0.5">@{photo.author.toLowerCase().replace(' ', '')}</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{photo.category}</p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(photo)}
                    className={`p-2 rounded-full transition-all duration-300 flex-shrink-0 ${isFavorite
                      ? 'bg-red-50 text-red-500 shadow-inner rotate-3'
                      : 'bg-slate-50 text-slate-400 hover:text-red-400 hover:bg-red-50'
                      }`}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${isFavorite ? 'fill-current' : 'fill-none'}`}
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

        {filteredPhotos.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 mt-8">
            <p className="text-slate-500 text-lg">No photos found matching "{searchQuery}"</p>
          </div>
        )}

        {favorites.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
              <span className="mr-3">❤️</span> Your Collection
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {favorites.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.url}
                    className="w-full h-24 object-cover rounded-xl shadow-sm border-2 border-white transform transition-transform group-hover:scale-105"
                    alt={photo.title}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <p className="text-[8px] text-white font-bold p-1 text-center truncate">{photo.author}</p>
                  </div>
                  <button
                    onClick={() => dispatch({ type: 'REMOVE_FAVORITE', payload: photo })}
                    className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 z-10"
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
