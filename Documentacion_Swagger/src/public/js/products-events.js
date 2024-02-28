const send = document.querySelector('#send-button');
const nameUser=document.querySelector('#nameUser');
const cartVisit=document.getElementById('visitCart');

send.addEventListener("click", (e) => {
    const search = document.querySelector('#search').value;
    const newLimit = document.querySelector('#limit').value;
    const sort = document.querySelector('#price-sort').value;

    document.location.href = `http://localhost:8080/?limit=${newLimit}&query=${search}&sort=${sort}`
}
);

cartVisit.addEventListener('click', async ()=>{

    const findCart= await fetch(`/api/session/user`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const responseUser = await findCart.json();


    cartVisit.href=`/carts/${responseUser.result}`
})

const addButtons= document.getElementsByClassName("btn");

for (const button of addButtons) {

    button.addEventListener('click', async () => {

      const findCart= await fetch(`/api/session/user`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    console.log(findCart);

    const responseUser = await findCart.json();

   const existCart= await fetch(`/api/carts/${responseUser.result}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const resultCart= await existCart.json();

   if(resultCart == false){
    await fetch(`/api/carts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })}

    await fetch(`/api/carts/${resultCart.status.userCart}/product/${button.id}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    }
})

Swal.fire({
    icon:'success',
    title: 'Agregado al carrito',
    position: 'top-end',
    showConfirmButton: false,
    toast: true,
    timer: 1000,
    background:'black',
    color: "white"
})

})}

Toastify({

    text: `Bienvenido: ${nameUser.innerText}`,
    duration: 1000,
    style: {
        background: '#0f3443'
      }
    }).showToast();