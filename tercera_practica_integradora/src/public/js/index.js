const socket= io();

const containerProducts= document.querySelector(".container-products");

socket.on('newP', data =>{

    containerProducts.innerHTML +=`
    
    <div class="product">

<ul>
    <h3>${data.title}</h3>
    <p>${data.description}</p>
    <p>${data.price}</p>
    <p>${data.stock}</p>
    <p>${data.thumbnails}</p>
    <p>${data.code}</p>
    <p>${data.stock}</p>
    <p>${data.status}</p>
    <p>${data.category}</p>
</ul>

</div>
    `
});


socket.on('deletProduct', data=> {

containerProducts.innerHTML='';

data.forEach(product => {

    containerProducts.innerHTML+=`

    <div class="product">
    
    <ul>
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p>${product.price}</p>
        <p>${product.stock}</p>
        <p>${product.thumbnails}</p>
        <p>${product.code}</p>
        <p>${product.stock}</p>
        <p>${product.status}</p>
        <p>${product.category}</p>
    </ul>
    
    </div>
    
    `
});

})

