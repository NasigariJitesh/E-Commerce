import { API } from "../../backend";
export const getUser=(userId,token)=>{
    return fetch(`${API}/user/${userId}/`,{
        method:"GET",
        headers: {
            Authorization: `Bearer ${token}`
          }
    }).then(response=>{
        return response.json();
    })
    .catch(err => console.log(err));
}
export const updateUser = (userId, token, user) => {
    return fetch(`${API}/user/${userId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type":"application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(user)
    })
    .then(response => {
    return response.json();
    })
    .catch(err => console.log(err));
}
export const getOrders=(userId,token)=>{
  return fetch(`${API}/orders/${userId}`,{
      method:"GET",
      headers:{
          Authorization:`Bearer ${token}`
      }
  }).then(response=>{
      return response.json();
  })
  .catch(err => console.log(err));
}