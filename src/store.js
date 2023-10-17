import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { allUsersReducer, userReducer } from "./reducers/userReducer";
import {sendLocationReducer, nearByUserReducer} from "./reducers/locationReducer"

const reducer = combineReducers({
  user: userReducer,
  users: allUsersReducer,
  location:sendLocationReducer,
  nearByLocation:nearByUserReducer
});

let initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
