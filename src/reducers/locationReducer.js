import {
  SEND_LOCATION_REQUEST,
  SEND_LOCATION_SUCCESS,
  SEND_LOCATION_FAIL,
  FETCH_USER_LOCATION_REQUEST,
  FETCH_USER_LOCATION_SUCCESS,
  FETCH_USER_LOCATION_FAIL,
  CLEAR_ERRORS,
} from "../constants/locationConstants";

export const sendLocationReducer = (state = {}, action) => {
  switch (action.type) {
    case SEND_LOCATION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case SEND_LOCATION_SUCCESS:
      return {
        ...state,
        loading: false,
        sendLocation: action.payload,
      };

    case SEND_LOCATION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const nearByUserReducer = (state = { nearByUsers: [] }, action) => {
  switch (action.type) {
    case FETCH_USER_LOCATION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_USER_LOCATION_SUCCESS:
      return {
        ...state,
        loading: false,
        nearByUsers: action.payload,
      };

    case FETCH_USER_LOCATION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
