import {
  SEND_LOCATION_REQUEST,
  SEND_LOCATION_SUCCESS,
  SEND_LOCATION_FAIL,
  FETCH_USER_LOCATION_REQUEST,
  FETCH_USER_LOCATION_SUCCESS,
  FETCH_USER_LOCATION_FAIL,
} from "../constants/locationConstants";
import axios from "axios";

export const sendLocation = (location) => async (dispatch) => {
  try {
    dispatch({ type: SEND_LOCATION_REQUEST });

    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/api/v1/location/upsert",
      location,
      config
    );
    dispatch({ type: SEND_LOCATION_SUCCESS, payload: data.message });
  } catch (error) {
    dispatch({
      type: SEND_LOCATION_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const nearByUser = (latitude, longitude) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_USER_LOCATION_REQUEST });

    const { data } = await axios.get(
      `/api/v1/nearby/users/?latitude=${latitude}&longitude=${longitude}`
    );
    console.log(data);
    dispatch({
      type: FETCH_USER_LOCATION_SUCCESS,
      payload: data.userLocations,
    });
  } catch (error) {
    dispatch({
      type: FETCH_USER_LOCATION_FAIL,
      payload: error.response.data.message,
    });
  }
};
