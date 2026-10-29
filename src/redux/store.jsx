import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./rootReducer";

const composeEnhancers = composeWithDevTools({});

const loadCartItems = () => {
  try {
    const raw = localStorage.getItem("cartItems");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const initialStore = {
  cartReducer: {
    cartItems: loadCartItems(),
  },
};

export const store = createStore(
  rootReducer,
  initialStore,
  composeEnhancers()
);

store.subscribe(() => {
  const cartItems = store.getState().cartReducer?.cartItems ?? [];
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
});