// console.log(bubbleMilkTea)
// console.log(bubbleMilkTea.price())
// console.log(lemonGreenTea)
// console.log(lemonGreenTea.price())
// console.log(matchaLatte)

function drink (name,sugar,ice){
    this.name = name
    this.sugar = sugar
    this.ice = ice
}


function AlphaPos (){

}

const model = {
    bubbleMilkTea: new drink('Bubble Milk Tea','No Sugar','Less Ice'),
    lemonGreenTea: new drink('Lemon Green Tea','No Sugar','Less Ice'),
    matchaLatte: new drink('Matcha Latte', 'Less Sugar', 'Regular Ice'),
    AlphaPos: new AlphaPos(),
    price (){
        switch(this.name){
            case 'Black Tea':
            case 'Oolong Tea':
            case 'Baozong Tea':
            case 'Green Tea':
                return 30
            case 'Bubble Milk Tea':
            case 'Lemon Green Tea':
                return 50
            case 'Black Tea Latte':
            case 'Matcha Latte':
                return 55
            default:
                console.log('No this drink')
        }
    },
    getCheckedValue (inputName){
        let inputs = document.querySelectorAll(`[name=${inputName}]`)
        let selectOption = ''
        for(option of inputs){
            if(option.checked){
                selectOption = option.value
            }
        }
        return selectOption
    },
    checkOut (){
        let totalAmount = 0
        document.querySelectorAll('[data-drink-price]').forEach(drink => {
            totalAmount += Number(drink.textContent)
        })
        return totalAmount
    },
    clearOrder (target){
        target.querySelectorAll('.card').forEach(card=>{
            card.remove()
        })
    },
    deleteDrink (target){
        target.remove()
    },
}

const view = {
    addDrinkBTN : document.querySelector('[data-alpha-pos="add-drink"]'),
    checkoutBTN : document.querySelector('[data-alpha-pos="checkout"'),
    orderList: document.querySelector('[data-order-lists]'),
    
    onAlert(title,text,icon){
        swal({
            title: title,
            text: text,
            icon: icon,
        })
    },
    addDrink(drink){
        let orderListCard = `
            <div class="card mb-3">
                <div class="card-body pt-3 pr-3">
                    <div class="text-right">
                        <span data-alpha-pos="delete-drink">×</span>
                    </div>
                    <h6 class="card-title mb-1">${drink.name}</h6>
                    <div class="card-text">${drink.ice}</div>
                    <div class="card-text">${drink.sugar}</div>
                </div>
                <div class="card-footer text-right py-2">
                    <div class="card-text text-muted">$ <span data-drink-price>${drink.price()}</span></div>
                </div>
            </div>
        `
        this.orderList.insertAdjacentHTML('afterbegin', orderListCard)
    }
}

const controller = {
    init(){
        drink.prototype.price = model.price
        AlphaPos.prototype.getCheckedValue  = model.getCheckedValue
        AlphaPos.prototype.deleteDrink  = model.deleteDrink
        AlphaPos.prototype.checkOut  = model.checkOut
        AlphaPos.prototype.clearOrder  = model.clearOrder
        view.addDrinkBTN.addEventListener('click',this.onAddDrinkBTNClick)
        view.orderList.addEventListener('click',this.onOrderListClick)
        view.checkoutBTN.addEventListener('click',this.onChickOutButtonClick)
    },
    onAddDrinkBTNClick(){
        const drinkName = model.AlphaPos.getCheckedValue('drink')
        const ice = model.AlphaPos.getCheckedValue('ice')
        const sugar = model.AlphaPos.getCheckedValue('sugar')
        if(!drinkName){
            view.onAlert('Please choose at least one item','','info')
            return
        }
        // view.onAlert('Here is your order',`${drinkName} , ${ice} , ${sugar}`,'success')
        const newDrink = new drink(drinkName,sugar,ice)
        view.addDrink(newDrink)

    },
    onOrderListClick(event){
        if(event.target.matches('[data-alpha-pos="delete-drink"]')){
            model.AlphaPos.deleteDrink(event.target.parentElement.parentElement.parentElement)
            view.onAlert('Delete order success','','')
        }
    },
    onChickOutButtonClick(){
        view.onAlert(`Total amount of drinks：$${model.checkOut()}`,'','success')
        model.AlphaPos.clearOrder(view.orderList)
    }
}



controller.init()


function newMethod(){
    //beforebegin, afterbegin, beforeend,afterend
    //beforeBegin：在該元素前插入
    //afterBegin：在該元素第一個子元素前插入
    //beforeEnd：在該元素最後一個子元素後面插入
    //afterEnd：在該元素後插入
    Element.insertAdjacentHTML('afterbegin', orderItemHTML)
}


