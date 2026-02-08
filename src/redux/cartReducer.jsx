const initialState={
    cartItems:[],
};

export const cartReducer = (state=initialState, action) => {
    switch(action.type) {
        case 'ADD_TO_CART': {
            if(state.cartItems.some((item) =>item.id === action.payload.id )){
                console.log(1);
                return {
                    ...state,
                    cartItems: state.cartItems.map((item) => {
                        if(item.id === action.payload.id){
                            item.qty = Number(item.qty) + Number(action.payload.qty);
                        }
                        return item;
                    })
                }
            }
            return {
                ...state,
                cartItems: [...state.cartItems, action.payload]
            }
        }
        case 'UPDATE_QTY': {
            return {
                ...state,
                cartItems: state.cartItems.map((item) => {
                    if(item.id === action.payload.id){
                        item.qty = action.payload.qty;
                        return item;
                    }
                    return item;
                })
            }
        }
        case 'DELETE_FROM_CART': {
            return {
                ...state,
                cartItems: state.cartItems.filter((item) => item.id !== action.payload.id)
            }
        }
        case 'DELETE_ALL': {
            return {
                ...state,
                cartItems: []
            }
        }
        default: return state;
    }
}