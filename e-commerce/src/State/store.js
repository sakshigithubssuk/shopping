import { applyMiddleware, combineReducers, legacy_createStore } from 'redux';
import { thunk } from 'redux-thunk'; // <-- IMPORT THUNK HERE
import { authReducers } from './Auth/Reducers'; // Make sure authReducers is a valid reducer function
import { CustomerProductReducer } from './product/Reducer';
import { cartReducer } from './Cart/Reducer';
import { orderReducer } from './Order/Reducer';

// Combine your reducers (conventionally named rootReducer)
const rootReducer = combineReducers({
  auth: authReducers,
  product:CustomerProductReducer,
  cart:cartReducer,
  order:orderReducer,
});

// Create the store using legacy_createStore
const store = legacy_createStore(
  rootReducer,
  applyMiddleware(thunk) // Pass the imported thunk middleware
);

// Export the store as the default export to match `import store from ...`
export default store;