const send = document.querySelector('#send-button');

send.addEventListener("click", (e) => {
    const search = document.querySelector('#search').value;
    const newLimit = document.querySelector('#limit').value;
    const sort = document.querySelector('#price-sort').value;
    document.location.href = `http://localhost:8080/?limit=${newLimit}&query=${search}&sort=${sort}`
}
)

const addButtons= document.getElementsByClassName("btn");

for (const button of addButtons) {
    

    button.addEventListener('click', (e)=>{
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
    })
}