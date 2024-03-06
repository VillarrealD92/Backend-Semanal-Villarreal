const pass = document.getElementById('newpass');
const send = document.getElementById('recoverpass')

send.addEventListener('click', async (e) => {

   let recover= await fetch(`/api/session/recoverPassword/${pass.value}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    const result= await recover.json();  

    if(result === true){
        Swal.fire({
            icon:'error',
            title: 'Tu contraseña es igua a la anterior, por favor rectifica',
            position: 'top-end',
            showConfirmButton: false,
            toast: true,
            timer: 1000,
            background:'red',
            color: "white"
        })
    }

    if(result === false){
        Swal.fire({
            icon:'error',
            title: 'Tu contraseña ha sido cambiada con exito',
            position: 'top-end',
            showConfirmButton: false,
            toast: true,
            timer: 1000,
            background:'green',
            color: "white"
        }).then((next) => {
            document.location.href = `http://localhost:8080/api/session/login`
        }) 
    }

    
})