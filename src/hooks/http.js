import { useReducer, useCallback } from "react";

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null, data: null, extra: null };
    case "RESPONSE":
      return { ...httpState, loading: false, data: action.responseData, extra: action.extra };
    case "ERROR":
      return { loading: false, error: action.errorData };
    case "CLEAR":
      return { ...httpState, error: null };
    default:
      throw new Error("huj");
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
    data: null,
    extra: null,
  });

  const sendRequest = useCallback((url, method, body, reqExtra) => {
    dispatchHttp({ type: "SEND", extra: reqExtra});
    fetch(url, {
      method: method,
      body,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        dispatchHttp({ type: "RESPONSE", responseData: responseData });
      })
      .catch((error) => {
        dispatchHttp({ type: "ERROR", errorData: error.message });
      });
  }, []);

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    reqExtra: httpState.extra
  };
};

export default useHttp;
