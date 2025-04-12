import { createContext, useEffect } from "react";
import PropTypes from "prop-types"; 
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios"

const ShopContext = createContext();

const ShopContextProvider = ( props) => {
    const currency = "$";
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search , setSearch] = useState('');
    const [showSearch , setShowSearch] = useState(false);
    const [cartItems , setCartItems] = useState({});
    const [products,setProducts] = useState([])
    const navigate = useNavigate();

    const addToCart = async(itemId , size)=>{
        
        if(!size){
            toast.error("Please select a size")
            return;
        }

        let cartData = structuredClone(cartItems);

        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1;
            }
            else{
                cartData[itemId][size]= 1;
            }
        }
        else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);
    }

    const getCartCount = () =>{
        let totalCount = 0;
        for(const items in cartItems){
            for(const item in cartItems[items]){
                try {
                    if (cartItems[items][item]>0){
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    console.log(error);
                    toast.error(error.message)
                }
            }
        }
        return totalCount;
    }

    const getProductsData = async () =>{
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            if(response.data.success){
                console.log(response.data);
                
                setProducts(response.data.product)
            }else{
                toast.error(response.data.message)
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message)
            
        }
    }

    useEffect(() =>{
        getProductsData()
    },[])


    const updateQuantity = async (itemId , size , quantity) =>{
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
    }
    const getCartAmount = () => {
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product) => product._id === items)
            for (const item in cartItems[items]){
                try {
                    if(cartItems[items][item] > 0){
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {
                    console.log(error);
                    toast.error(error.message)
                }
            }
        }
        return totalAmount;
    }

    const value = {
        products, // No usamos useState porque los productos son estáticos
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

// Validación de PropTypes
ShopContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export {ShopContext,ShopContextProvider};