import { combineReducers, legacy_createStore } from "@reduxjs/toolkit";
import { setCookie } from "../Asset/Cookie";

const MoneyReducer = (state = {
    Multiple: 1,
    Name: "USD $",
    Symbol: "$"
}, action) => {
    switch (action.type) {
        case "CHANGE-CURRENCY":
            return { ...state, Multiple: action.payload.Multiple, Name: action.payload.Name, Symbol: action.payload.Symbol };
        default:
    }
    return { ...state };
}

const TokenReducer = (state = {
    Token: "",
    Role: ""
}, action) => {
    switch (action.type) {
        case "SET-TOKEN":
            return {
                ...state,
                Token: action.payload.Token,
                Role: action.payload.Role
            };
        default:
    }
    return { ...state };
}

const CartReducer = (state = {
    Data: []
}, action) => {
    switch (action.type) {
        case "CART-COOKIE": {
            return {
                ...state,
                Data: action.payload.Data
            }
        }
        case "ADD-CART": {
            const Check = state.Data.filter(item => item._id === action.payload._id && item.Detail.Size === action.payload.Detail.Size);
            if (Check.length > 0) {
                state.Data = state.Data.map((item) => {
                    if (item._id !== action.payload._id || item.Detail.Size !== action.payload.Detail.Size)
                        return item;
                    if (item.Detail.Quantity + action.payload.Detail.Quantity > item.Detail.Size.quantity)
                        action.payload.Detail.Quantity = item.Detail.Size.quantity;
                    else
                        action.payload.Detail.Quantity = item.Detail.Quantity + action.payload.Detail.Quantity;
                    return action.payload
                })
            } else {
                state.Data = [...state.Data, { ...action.payload }]
            }
            const Cookie = state.Data.map(item => ({
                ClothId: item._id,
                Quantity: item.Detail.Quantity,
                SizeId: item.Detail.Size
            }));
            setCookie("Cart", JSON.stringify(Cookie), 48);
            return {
                ...state,
                Data: [...state.Data]
            }
        }
        case "DELETE-DATA":
            state.Data = [...state.Data.filter((item) => item._id !== action.payload._id || item.Detail.Size !== action.payload.Detail.Size)];
            const Cookie = state.Data.map(item => ({
                ClothId: item._id,
                Quantity: item.Detail.Quantity,
                SizeId: item.Detail.Size
            }));
            setCookie("Cart", JSON.stringify(Cookie), 48);
            return {
                ...state,
                Data: [...state.Data]
            };

        case "UPDATE-SIZE": {
            const Temp = state.Data.filter((item) => item._id !== action.payload.Data._id || item.Detail.Size !== action.payload.Data.Detail.Size);
            var Check = false;
            const NewState = Temp.map((item) => {
                if (item._id !== action.payload.Data._id || item.Detail.Size !== action.payload.Size)
                    return item
                Check = true;
                item.Detail.Quantity += action.payload.Data.Detail.Quantity
                return item;
            })
            if (Check === false) {
                action.payload.Data.Detail.Size = action.payload.Size
                state.Data = [...NewState, action.payload.Data];
            } else
                state.Data = NewState;
            const Cookie = state.Data.map(item => ({
                ClothId: item._id,
                Quantity: item.Detail.Quantity,
                SizeId: item.Detail.Size
            }));
            setCookie("Cart", JSON.stringify(Cookie), 48);
            return {
                ...state,
                Data: [...state.Data]
            };
        }
        case "UPDATE-DATA": {
            state.Data = state.Data.map((item) => {
                return item._id !== action.payload._id || item.Detail.Size !== action.payload.Detail.Size ? item : action.payload
            })
            const Cookie = state.Data.map(item => ({
                ClothId: item._id,
                Quantity: item.Detail.Quantity,
                SizeId: item.Detail.Size
            }));
            setCookie("Cart", JSON.stringify(Cookie), 48);
            return {
                ...state,
                Data: [...state.Data]
            }
        }
        default:
    }
    return { ...state };
}

const reducer = combineReducers({
    CartReducer,
    // DrawerReducer,
    MoneyReducer,
    TokenReducer
})

export const store = legacy_createStore(reducer);