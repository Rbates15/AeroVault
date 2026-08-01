import { createContext, useContext, useReducer, useCallback } from 'react';

// ── State shape ───────────────────────────────────────────────────────────────
const initialState = {
  // Search form fields
  search: {
    origin:      '',
    destination: '',
    date:        '',
  },

  // Flight results from GET /api/flights
  results: {
    flights:     [],
    count:       0,
    loading:     false,
    error:       null,
    hasSearched: false,
  },

  // Sort preference applied client-side after initial fetch
  sort: 'recommended', // 'recommended' | 'price' | 'duration'

  // The flight the user clicked "Select" on — triggers BookingModal
  selectedFlight: null,

  // My Trips modal state
  myTrips: {
    open:    false,
    loading: false,
    error:   null,
    booking: null,
  },

  // Confirmation data after a successful booking
  confirmation: null,
};

// ── Actions ───────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    case 'SET_SEARCH_FIELD':
      return {
        ...state,
        search: { ...state.search, [action.field]: action.value },
      };

    case 'SET_SEARCH':
      return {
        ...state,
        search: { ...action.payload },
      };

    case 'SEARCH_START':
      return {
        ...state,
        results: { ...state.results, loading: true, error: null, hasSearched: true },
      };

    case 'SEARCH_SUCCESS':
      return {
        ...state,
        results: {
          flights:     action.payload.flights,
          count:       action.payload.count,
          loading:     false,
          error:       null,
          hasSearched: true,
        },
      };

    case 'SEARCH_ERROR':
      return {
        ...state,
        results: { ...state.results, loading: false, error: action.error },
      };

    case 'SET_SORT':
      return { ...state, sort: action.sort };

    case 'SELECT_FLIGHT':
      return { ...state, selectedFlight: action.flight, confirmation: null };

    case 'DESELECT_FLIGHT':
      return { ...state, selectedFlight: null };

    case 'SET_CONFIRMATION':
      return { ...state, confirmation: action.payload, selectedFlight: null };

    case 'CLEAR_CONFIRMATION':
      return { ...state, confirmation: null };

    case 'MY_TRIPS_OPEN':
      return {
        ...state,
        myTrips: { open: true, loading: false, error: null, booking: null },
      };

    case 'MY_TRIPS_CLOSE':
      return {
        ...state,
        myTrips: { open: false, loading: false, error: null, booking: null },
      };

    case 'MY_TRIPS_LOADING':
      return {
        ...state,
        myTrips: { ...state.myTrips, loading: true, error: null, booking: null },
      };

    case 'MY_TRIPS_SUCCESS':
      return {
        ...state,
        myTrips: { ...state.myTrips, loading: false, booking: action.payload },
      };

    case 'MY_TRIPS_ERROR':
      return {
        ...state,
        myTrips: { ...state.myTrips, loading: false, error: action.error },
      };

    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────
export const AppContext = createContext(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Search for flights — calls GET /api/flights
  const searchFlights = useCallback(async ({ origin, destination, date, sort = 'recommended' } = {}) => {
    dispatch({ type: 'SEARCH_START' });
    try {
      const params = new URLSearchParams();
      if (origin)      params.set('origin',      origin.trim().toUpperCase());
      if (destination) params.set('destination', destination.trim().toUpperCase());
      if (date)        params.set('date',         date);
      params.set('sort', sort);

      const res  = await fetch(`/api/flights?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error?.message || 'Failed to load flights.');

      dispatch({ type: 'SEARCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'SEARCH_ERROR', error: err.message });
    }
  }, []);

  // Look up a booking by confirmation code — calls GET /api/bookings/:code
  const lookupBooking = useCallback(async (code) => {
    dispatch({ type: 'MY_TRIPS_LOADING' });
    try {
      const res  = await fetch(`/api/bookings/${encodeURIComponent(code.trim().toUpperCase())}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error?.message || 'Booking not found.');

      dispatch({ type: 'MY_TRIPS_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'MY_TRIPS_ERROR', error: err.message });
    }
  }, []);

  const value = {
    // State slices
    search:         state.search,
    results:        state.results,
    sort:           state.sort,
    selectedFlight: state.selectedFlight,
    myTrips:        state.myTrips,
    confirmation:   state.confirmation,

    // Dispatch helpers
    setSearchField:  (field, value) => dispatch({ type: 'SET_SEARCH_FIELD', field, value }),
    setSearch:       (payload)      => dispatch({ type: 'SET_SEARCH', payload }),
    setSort:         (sort)         => dispatch({ type: 'SET_SORT', sort }),
    selectFlight:    (flight)       => dispatch({ type: 'SELECT_FLIGHT', flight }),
    deselectFlight:  ()             => dispatch({ type: 'DESELECT_FLIGHT' }),
    setConfirmation: (payload)      => dispatch({ type: 'SET_CONFIRMATION', payload }),
    clearConfirmation:()            => dispatch({ type: 'CLEAR_CONFIRMATION' }),
    openMyTrips:     ()             => dispatch({ type: 'MY_TRIPS_OPEN' }),
    closeMyTrips:    ()             => dispatch({ type: 'MY_TRIPS_CLOSE' }),

    // Async actions
    searchFlights,
    lookupBooking,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
