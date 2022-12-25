import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";

import heroes from "../reducers/heroes";
import filters from "../reducers/filters";

const stringMiddleware = () => (next) => (action) => {
  /* внутри первых круглыхскобок можно подставить store или деструктурировать его вот так - { dispatch, getState }, но мы не используем ни dispatch, ни getState, поэтому оставляем сскобочки пустые */
  if (typeof action === "string") {
    return next({
      type: action,
    });
  }
  return next(action);
};

const enhancer = (createStore) => (...args) => {
  const store = createStore(...args);

  const oldDisptach = store.dispatch; /* оригинальный dispatch */
  store.dispatch = (action) => {
    if (typeof action === "string") {
      return oldDisptach({
        type: action,
      });
    }
    return oldDisptach(action);
  };
  return store;
};

const store = createStore(
  combineReducers({
    heroes: heroes,
    filters: filters,
  }),
  compose(
    applyMiddleware(ReduxThunk, stringMiddleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
  /* теперь обращаться к стэйту нужно вот так - state.heroes.heroes, если нужен список героев, state.filters.filters, если нужны фильтры  */
  // compose(
  //   enhancer,
  //   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  // )
);

export default store;
