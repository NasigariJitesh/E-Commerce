export const addproducttocart=(product,next)=>{
    let cart = [];
    if(typeof window !== undefined){
        if(localStorage.getItem("cart")){
            cart=JSON.parse(localStorage.getItem("cart"));
        }
        cart.push({
            ...product
        });
        localStorage.setItem("cart",JSON.stringify(cart));
        next();
    }
};
export const removeproductfromcart=(productId)=>{
    let cart = [];
    if(typeof window !== undefined){
        if(localStorage.getItem("cart")){
            cart=JSON.parse(localStorage.getItem("cart"));
        }
        cart.map((product,index)=>{
            if(product._id===productId){
                cart.splice(index,1);
            }
        });
        localStorage.setItem("cart",JSON.stringify(cart));
    }
    return cart;
};
export const changeproductcount=(productId,newcount)=>{
    let cart = [];
    
    if(typeof window !== undefined){
        if(localStorage.getItem("cart")){
            cart=JSON.parse(localStorage.getItem("cart"));
        }
        cart.map((product,index)=>{
            if(product._id===productId){
                product.count=newcount;    
            }
        });
        localStorage.setItem("cart",JSON.stringify(cart));
    }
    return cart;
};

export const loadcart=()=>{
    if(typeof window !== undefined){
        if(localStorage.getItem("cart")){
            return JSON.parse(localStorage.getItem("cart"));
        }
    }
}
export const cartEmpty=next=>{
    if(typeof window !== undefined){
        localStorage.removeItem("cart");
        let cart = [];
        localStorage.setItem("cart",JSON.stringify(cart));
        next();
    }
}