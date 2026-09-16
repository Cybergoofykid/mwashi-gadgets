const heroProducts = [

{
name:"iPhone 17 Pro",
price:"From TZS 3,800,000",
image:"images/apple/17-pro.webp"
},


{
name:"Samsung Galaxy S26 Ultra",
price:"From TZS 2,700,000",
image:"images/samsung/26-ULTRA.webp"
},


{
name:"Google Pixel 10 Pro",
price:"From TZS 2,900,000",
image:"images/pixel/pixel10pro.webp"
}


];


let heroIndex = 0;


function changeHeroProduct(){


const product = heroProducts[heroIndex];


document.getElementById("hero-image").src =
product.image;


document.getElementById("hero-name").textContent =
product.name;


document.getElementById("hero-price").textContent =
product.price;



heroIndex++;


if(heroIndex >= heroProducts.length){

heroIndex=0;

}


}



setInterval(changeHeroProduct,4000);