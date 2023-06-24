const c = (el)=>document.querySelector(el);
const cs = (lel)=>document.querySelectorAll(lel);
//quantidade de pizzas adicionadas:
let PizzaQt = 1;
//o carrinho da loja:
let cart = []
//necessario para saber qual pizza estou selecionando:
let modalKey = 0
//Listagem das pizzas
pizzaJson.map( (pizza, NumberPizza) => {
    let pizzaItem = c('.models .pizza-item').cloneNode(true) //esta clonando o pizza-item e models e com true pegando tudo q esta dentro do models e pizza-item (clonando tudo)

    pizzaItem.setAttribute('data-key', NumberPizza)//setar um atributo q iremos chamar de data-key(quando colocamos um atributo com uma informação, bota um prefixo DATA q o sistema entende q tem uma informção)
    pizzaItem.querySelector('.pizza-item--name').innerHTML = pizza.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = pizza.description;
    pizzaItem.querySelector('.pizza-item--img img').src = pizza.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${pizza.price};`

           //evento de clique para abrir o MODAL
    pizzaItem.querySelector('a').addEventListener('click', (a)=>{
        a.preventDefault()  //previnir a ação padrão
        let key = a.target.closest('.pizza-item').getAttribute('data-key') //closest e target target vai procurar algo enquanto closest + target, vai procurar o 'a' mais proximo de pizza-item, //enquanto o getAttribute ira pegar o atributo 'data-key'
        modalKey = key;
        
        PizzaQt = 1
        c('.pizzaInfo--size.selected').classList.remove('selected')
        

 
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if(sizeIndex === 2) {
                size.classList.add('selected')
            }
             size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        })

                //informações do MODAL

        c('.pizzaInfo--qt').innerHTML = PizzaQt

        c('.pizzaInfo--pricearea .pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price}`
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name
        c('.pizzaBig img').src = pizzaJson[key].img
        c('.pizzaInfo .pizzaInfo--desc').innerHTML = pizzaJson[key].description
        c('.pizzaWindowArea').style.opacity = 0
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout( ()=> {          //função para definir um delay de 100ms ao clicar no botao A
            c('.pizzaWindowArea').style.opacity = 1
        },100)
       
});  
  c('.pizza-area').append(pizzaItem);//pizza-area é onde iremos colocar todas as pizzas (append pega o conteudo q ja tem em pizza-are e colocar outro conteudo )

});
//Eventos do MODAL
//fechando o MODAL
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0
    setTimeout( ()=> {          //função para definir um delay de 100ms ao clicar no botao A
        c('.pizzaWindowArea').style.display = 'none'
    },500)

}
//adicionando quantidade de pizzas e removendo quantidades ate um limite
cs('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach( (item) => {
    item.addEventListener('click', closeModal)
})

c('.pizzaInfo--qtmais').addEventListener('click', ()=> {
        PizzaQt++
    c('.pizzaInfo--qt').innerHTML = PizzaQt
})
c('.pizzaInfo--qtmenos').addEventListener('click', ()=> {
    if(PizzaQt > 1) {
        PizzaQt--
        c('.pizzaInfo--qt').innerHTML = PizzaQt
    }


})
//alterando e mudando o selecionados de PEQUENA MEDIA E GRANDE 
cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', ()=> {
        c('.pizzaInfo--size.selected').classList.remove('selected')
        size.classList.add('selected') //aqui estou pegando o proprio e e vendo na lista de classes se tem o 'selected', se não estiver vou adicionar(add)
        //inves de usar o e.target, como ja estou dentro de um loop, irei colocar o proprio size(pizzaInfo--size) como o item(size.target.classList)
    })
})
//adicionando ao carrinho e abrindo a aba de pagamento

c('.pizzaInfo--addButton').addEventListener('click', () => {

    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'))//estou pegando o tamanho da pizza //parseInt apenas utilizado para tranformar uma string em inteiro

    let identifier = pizzaJson[modalKey].id+'@'+size

        //verificando se o identifier ja tem no carrinho:
        // findIndex para descobrir a posição do item dentro do carrinho
        let key = cart.findIndex((item)=> item.identifier == identifier) //verificando se os identifiers do carrinho  qual q tem o mesmo identifier q o meu se ele tiver vai retornar o index se n tiver vai retornar -1

    if(key > -1) {
        cart[key].qt += PizzaQt
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: PizzaQt
        })
    }
    //adicionando coisas no array
    updateCart()
    closeModal()
})

c('.menu-openner').addEventListener('click', ()=> {
    if(cart.length > 0) {
        c('aside').style.left = '0'
    }
})
c('.menu-closer').addEventListener('click', ()=> {
    c('aside').style.left = '100vw'
})
function updateCart() {
    c('.menu-openner span').innerHTML = cart.length

    if(cart.length > 0) {
        c('aside').classList.add('show')
        c('.cart').innerHTML = ''

        let subtotal = 0
        let desconto = 0
        let total = 0

        for(let i in cart) {

            
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id) //com o find iremos procurar dentro do pizzaJson item q tem o ID que temos
           subtotal += pizzaItem.price * cart[i].qt
           
           
           
           
           
            let cartItem = c('.models .cart--item').cloneNode(true)//clonei

           let PizzaSizeName;
           switch (cart[i].size) {
            case 0:
                PizzaSizeName = 'P'
                break;
            case 1:
                PizzaSizeName = 'M'
                break;
            case 2:
                PizzaSizeName = 'G'
                break;
           }
          
            let pizzaName = `${pizzaItem.name} (${PizzaSizeName})`

            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName  //contatenar para colocar o tamanho junto com nome
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=> {
                if(cart[i].qt > 1) {
                    cart[i].qt--
                }else {
                    cart.splice(i, 1) //estou removendo um item do carrinho com o splice
                }
                updateCart()
            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=> {
                cart[i].qt++  //incrementando um item em qt do contexto especifico
                updateCart()
            })
           c('.cart').append(cartItem)// adicionei informaçõpes
        }
        desconto = subtotal * 0.1
        total = subtotal - desconto
        
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`


    }else {
        c('aside').classList.remove('show')
        c('aside').style.left = '100vw'
    }
    
}

