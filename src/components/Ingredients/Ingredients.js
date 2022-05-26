import React, { useReducer, useCallback, useMemo, useEffect } from "react";
import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "./../UI/ErrorModal";
import useHttp from "../../hooks/http";

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("huj");
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const { isLoading, error, data, sendRequest, reqExtra } = useHttp();

  useEffect(() => {
    dispatch({ type: "DELETE", id: reqExtra });
  }, [data, reqExtra]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = useCallback((ingredient) => {
    sendRequest(
      "https://react-http-d03fd-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json",
      "POST",
      JSON.stringify(ingredient)
    );
    // dispatchHttp({ type: "SEND" });
    // fetch(
    //   "https://react-http-d03fd-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json",
    //   {
    //     method: "POST",
    //     body: JSON.stringify(ingredient),
    //     hedaers: { "Content-Type": "application/json" },
    //   }
    // )
    //   .then((response) => {
    //     dispatchHttp({ type: "RESPONSE" });
    //     return response.json();
    //   })
    //   .then((responseData) => {
    //     // setUserIngredients((prevState) => [
    //     //   ...prevState,
    //     //   { id: responseData.name, ...ingredient },
    //     // ]);
    //     dispatch({
    //       type: "ADD",
    //       ingredient: { id: responseData.name, ...ingredient },
    //     });
    //   });
  }, []);

  const removeIngredientHandler = useCallback(
    (ingredientId) => {
      sendRequest(
        `https://react-http-d03fd-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${ingredientId}.json`,
        "DELETE",
        null,
        ingredientId
      );
    },
    [sendRequest]
  );

  const clearError = useCallback(() => {
    // dispatchHttp({ type: "CLEAR" });
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
