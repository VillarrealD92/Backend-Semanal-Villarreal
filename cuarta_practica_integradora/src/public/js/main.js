
const cartIcon = document.getElementById("cartIcon")
if (cartIcon) {
    cartIcon.onclick = () =>{
        const mainCartId = document.getElementById("mainCartId").value
        console.log(mainCartId);
    
        if (!mainCartId) { return console.log("No cartId is available.") }
    
        document.location.href = `/cart/${mainCartId}`
    }
}

const userRoleElement = document.getElementById("userRole")
if (userRoleElement){
    const userRoleValue = userRoleElement.value
    const realTimeBtn = document.getElementById("RTProductsBTN")

    if (userRoleValue == "admin" || userRoleValue =="premium") {
        realTimeBtn.classList.remove("d-none")
    }
}