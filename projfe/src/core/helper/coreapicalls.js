import { API } from "../../backend";

export const getProducts=(page)=>{
    page=page?parseInt(page):1
    return fetch(`${API}/products?page=${page}`,{
        method:"GET",
        
    }).then(response=>{
        return response.json();
    })
    .catch(err => console.log(err));
}
export const getProductsByCategories=(categoryid)=>{
    return fetch(`${API}/products/categories?categoryId=${categoryid}`,{
        method:"GET",
    }).then(response=>{
        return response.json();
    })
    .catch(err => console.log(err));
}
export const createOrder = (userId, usertoken, orderData) => {
    return fetch(`${API}/create/order/${userId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${usertoken}`
      },
      body: JSON.stringify({ order: orderData })
    })
    .then(reponse => {
        return reponse.json();
    })
    .catch(err => console.log(err));
}
export const payment=(token,products)=>{
    const body={token,products};
    return fetch(`${API}/stripepayment`,{
        method:"POST",
        headers:{Accept:"application/json",
        "Content-Type":"application/json"
        },
        body:JSON.stringify(body)
    }).then(reponse => {
        return reponse.json();
    })
    .catch(err => console.log(err));
}
export const getCategories = ()=>{
    return fetch(`${API}/categories/`,{
        method:"GET",
    }).then(response=>{
        return response.json();
    })
    .catch(err => console.log(err));
}