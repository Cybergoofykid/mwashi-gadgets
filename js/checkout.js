
let cart=JSON.parse(localStorage.getItem('cart')||'[]');
let total=cart.reduce((a,b)=>a+b.price*b.qty,0);
if(document.getElementById('cart')){
document.getElementById('cart').innerHTML=cart.map(i=>`<p>${i.qty} x ${i.name} - TZS ${(i.price*i.qty).toLocaleString()}</p>`).join('');
document.getElementById('total').innerText='Total: TZS '+total.toLocaleString();
}
function checkout(){
let msg='NEW ORDER - MWASHI GADGETS\n\n';
msg+='Customer: '+name.value+'\nPhone: '+phone.value+'\nAddress: '+address.value+'\n\n';
cart.forEach(i=>msg+=`${i.qty} x ${i.name}\n`);
msg+='\nTOTAL: TZS '+total.toLocaleString();
window.open('https://wa.me/255623468239?text='+encodeURIComponent(msg));
}
