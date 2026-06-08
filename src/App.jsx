import { useReducer, useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { favoritesReducer, initialState } from './favoritesReducer'
import { useFetchPhotos } from './useFetchPhotos'

function App() {
  const { photos, loading, error, loadMore, hasMore } = useFetchPhotos()
  const observer = useRef()
  
  const lastPhotoElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore()
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore, loadMore])
  
  const [favorites, dispatch] = useReducer(favoritesReducer, initialState)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [sortBy, setSortBy] = useState('default')
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode)
  }, [isDarkMode])

  const categories = useMemo(() => {
    if (!photos) return ['All']
    const uniqueCategories = new Set(photos.map(photo => photo.category).filter(Boolean))
    return ['All', ...Array.from(uniqueCategories)]
  }, [photos])

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
    let result = photos.filter(photo => {
      const matchesSearch = photo.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            photo.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || photo.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    
    if (sortBy === 'authorAsc') {
      result = [...result].sort((a, b) => a.author.localeCompare(b.author))
    } else if (sortBy === 'authorDesc') {
      result = [...result].sort((a, b) => b.author.localeCompare(a.author))
    } else if (sortBy === 'newest') {
      result = [...result].sort((a, b) => parseInt(b.id) - parseInt(a.id))
    } else if (sortBy === 'oldest') {
      result = [...result].sort((a, b) => parseInt(a.id) - parseInt(b.id))
    }
    
    return result
  }, [photos, searchQuery, selectedCategory, sortBy])

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'} py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center relative">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="absolute top-0 right-0 p-3 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors z-10"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 transition-colors">
            Pixel Pulse
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 transition-colors">
            Explore a premium collection of fine photography by world-class artists.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
            <div className="relative w-full max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 dark:text-slate-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search by author name..."
                className="block w-full pl-10 pr-10 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors placeholder-slate-400 dark:placeholder-slate-500"
                value={searchQuery}
                onChange={handleSearch}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none w-full sm:w-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-3 pl-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent font-medium cursor-pointer transition-colors"
                >
                  <option value="default">Default Sort</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="authorAsc">Author (A-Z)</option>
                  <option value="authorDesc">Author (Z-A)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="inline-flex items-center px-6 py-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                <span className="text-red-500 mr-2">❤️</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200 transition-colors">{favorites.length} Favorites</span>
              </div>
            </div>
          </div>

          {!loading && !error && categories.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-md transform scale-105'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:shadow-sm'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </header>

        <main>
          {error && (
            <div className="text-center py-12 px-6 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-900/30 mb-8 transition-colors">
              <p className="text-red-600 font-semibold mb-2">Oops! Something went wrong.</p>
              <p className="text-red-500 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Try Again
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPhotos.map((photo, index) => {
              const isFavorite = favorites.some((fav) => fav.id === photo.id)
              const isLastItem = index === filteredPhotos.length - 1
              return (
                <div
                  ref={isLastItem ? lastPhotoElementRef : null}
                  key={`${photo.id}-${index}`}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-100 dark:border-slate-700 cursor-pointer"
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
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate transition-colors">{photo.title}</h3>
                        <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-0.5 transition-colors">@{photo.author.toLowerCase().replace(' ', '')}</p>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold transition-colors">{photo.category}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(photo)
                        }}
                        className={`p-2 rounded-full transition-all duration-300 flex-shrink-0 ${isFavorite
                            ? 'bg-red-50 dark:bg-red-900/30 text-red-500 shadow-inner rotate-3'
                            : 'bg-slate-50 dark:bg-slate-700 text-slate-400 hover:text-red-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-600'
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
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-12 mt-4 w-full col-span-full">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-blue-400"></div>
              <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium transition-colors">Loading more photography...</p>
            </div>
          )}

          {!loading && !error && filteredPhotos.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 mt-8 transition-colors">
              <p className="text-slate-500 dark:text-slate-400 text-lg transition-colors">No photos found matching "{searchQuery}"</p>
            </div>
          )}
          
          {!hasMore && filteredPhotos.length > 0 && !loading && (
             <div className="text-center py-10 mt-4">
               <p className="text-slate-400 dark:text-slate-500 font-medium transition-colors">You've reached the end of the gallery.</p>
             </div>
          )}
        </main>

        {favorites.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center transition-colors">
              <span className="mr-3">❤️</span> Your Collection
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {favorites.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.url}
                    className="w-full h-24 object-cover rounded-xl shadow-sm border-2 border-white dark:border-slate-800 transform transition-transform group-hover:scale-105"
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

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/90 backdrop-blur-sm transition-opacity duration-300" onClick={() => setSelectedPhoto(null)}>
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row max-h-[90vh] animate-in fade-in zoom-in duration-300 transition-colors" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="w-full md:w-2/3 bg-slate-100 dark:bg-slate-900 flex items-center justify-center transition-colors">
               <img src={selectedPhoto.url} alt={selectedPhoto.title} className="max-h-[50vh] md:max-h-[90vh] object-contain w-full" />
            </div>
            <div className="w-full md:w-1/3 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">{selectedPhoto.title}</h2>
                </div>
                <p className="text-lg text-blue-600 dark:text-blue-400 font-medium mb-6 transition-colors">@{selectedPhoto.author.toLowerCase().replace(' ', '')}</p>
                
                <div className="space-y-4 mb-8">
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Photo Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 transition-colors">Camera</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors">Sony A7R IV</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 transition-colors">Lens</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors">24-70mm f/2.8</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 transition-colors">Aperture</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors">f/8.0</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 transition-colors">ISO</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors">100</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-4">
                <button 
                  className="flex-1 bg-slate-900 dark:bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors flex justify-center items-center gap-2"
                  onClick={() => window.open(selectedPhoto.url, '_blank')}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Original
                </button>
                <button 
                  className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" 
                  title="Copy link"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedPhoto.url);
                    alert("Image URL copied to clipboard!");
                  }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
