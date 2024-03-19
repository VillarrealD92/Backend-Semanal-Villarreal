const cartId = document.querySelector(".cartId").value
console.log(cartId);

document.querySelectorAll(".delProdIcon").forEach(icon => {
    icon.onclick = () => {

       document.querySelectorAll(".cartProductId").forEach(prodId => {
        const productId = prodId.value;
        console.log(productId);

        fetch(`/api/carts/${cartId}/products/${productId}`, { method: "delete" })
            .then(response => {
                return response;
            })
            .then(data => {
                console.log(data);
                return document.location.href = `/cart/${cartId}`;
            })
            .catch(error => {
                console.log("Error: " + error);
            });
        });
    }
}); 


const trashIcon = document.querySelector(".trashIcon")
if (trashIcon) {
    trashIcon.onclick = () => {
        
        fetch(`/api/carts/${cartId}`, { method: "delete" })
        .then(response => {return response.json();})
        .then(data => {
            console.log(data);
            document.location.href = `/cart/${cartId}`
        })
        .catch(error => {
            console.log("Error: " + error);
        });
    
    }
    
}

let totalAmount = 0
document.querySelectorAll(".cartProducts").forEach(cartProduct => {
    const price = parseFloat(cartProduct.querySelector(".productPrice").value)
    const quantity = parseInt(cartProduct.querySelector(".productQuantity").value)

    const partialTotal = price * quantity;
    totalAmount+=partialTotal

    cartProduct.querySelector(".totalProductAmount").innerHTML = `Total: $${partialTotal.toFixed(2)}`;
});

const finalAmount = document.querySelector(".finalAmount")
if (finalAmount) {
    finalAmount.innerHTML=`Total: $${totalAmount.toFixed(2)}`
}


const checkout = document.querySelector(".checkOut")
if (checkout) {
    checkout.onclick = () =>{
    
        fetch(`/api/carts/${cartId}/purchase`, { method: "post" })
        .then(response => {return response.json()})
        .then(data => {
            console.log(data);
            
            })
        .catch(error => {
            console.log("Error: " + error);
        });  
    }    
}

