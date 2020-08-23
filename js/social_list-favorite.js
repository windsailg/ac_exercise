const model = {
    BASE_URL: 'https://lighthouse-user-api.herokuapp.com/',
    INDEX_URL: 'api/v1/users',
    items: [],
    regions: [],
    filteredItems: [],
    itemPerPage: 20,
    currentPage: 1,
    favList:JSON.parse(localStorage.getItem('favoriteUser')) || [],
    getApiData (){
        axios.get(model.BASE_URL+model.INDEX_URL)
        .then(res => {
            const data = res.data.results
            this.items.push(... data)
            controller.dataIsReady()
        })
    },
    setItemArrayState(){
        let itemsArr = this.filteredItems.length ? this.filteredItems:this.favList;
        return itemsArr
    },
    setFilterItems(){
        this.resetFilter()
        const keyword = view.searchInput.value.trim().toLowerCase();
        if(keyword.length===0){
            this.filteredItems = this.favList;
            // alert('請輸入關鍵字!')
            view.renderList(this.setItemPerPage())
            return;
        }
        for(const item of model.favList){
            if(item.name.toLowerCase().includes(keyword)||item.surname.toLowerCase().includes(keyword)){
                model.filteredItems.push(item);
            }
        }
    },
    setItemPerPage (){
        let itemStart = this.itemPerPage * (this.currentPage-1)
        let itemEnd = (this.itemPerPage * this.currentPage)
        const pageItemQuantity = this.setItemArrayState().slice(itemStart,itemEnd)
        return pageItemQuantity
    },
    removeFavorite(id){
        if(!this.favList) return
        const removeId = this.favList.findIndex((item) => item.id === id)
        this.favList.splice(removeId,1)
        localStorage.setItem('favoriteUser',JSON.stringify(this.favList))
        alert('已刪除使用者！')
        
    },
    resetFilter(){
        this.filteredItems =[];
        this.currentPage = 1;
    },
}


const view = {
    dataPanel: document.querySelector('#data-panel'),
    pagination: document.querySelector('.pagination'),

    searchInput: document.querySelector('#search-input'),
    searchForm: document.querySelector('#SearchForm'),

    ModalTitle: document.querySelector('#info-modal-title'),
    ModalImage: document.querySelector('#modal-image'),
    ModalDetail: document.querySelector('#info-modal-detail'),

    RegionsBlock: document.querySelector('#RegionsList'),
    RegionFilterList: document.querySelector('#RegionFilterList'),
    RegionSelect: document.querySelector('#RegionSelect'),
    
    GenderList: document.querySelector('#GenderList'),
    GenderFilterList: document.querySelector('#GenderFilterList'),
    GenderSelect: document.querySelector('#GenderSelect'),

    tips: document.querySelector('.tips'),

    renderList (data){
        let userItem = '';
        data.forEach(user=>{
            userItem += `
                <div class="col-sm-3">
                    <div class="mb-3 ">
                    <div class="card text-white bg-dark border-secondary ">
                        <img
                        src="${user.avatar}"
                        class="card-img-top "
                        alt="Movie Poster"
                        />
                        <div class="card-body">
                            <h6 class="title">${user.name}</br>${user.surname}　</h6>
                        </div>
                        <div class="card-footer ">
                            <button
                                class="btn btn-info btn-show-detail btn-sm"
                                data-toggle="modal"
                                data-target="#info-modal"
                                data-id="${user.id}"
                                >
                                More
                            </button>
                            <button class="btn btn-secondary btn-remove-favorite btn-sm" data-id="${user.id}">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    </div>
                </div>
            `;
            
        })
        this.dataPanel.innerHTML = userItem;
        this.renderPaginator(model.setItemArrayState())
    },
    renderPaginator (itemsArr){
        const allPages = Math.ceil(itemsArr.length / model.itemPerPage)
        let paginatorItem = ''
        for(i=1;i<=allPages; i++){
            paginatorItem += `
                <li class="page-item ">
                    <a class="page-link text-light border-secondary" id="page${i}" href="#" data-page="${i}">${i}</a>
                </li>
            `
        }
        this.pagination.innerHTML = paginatorItem
        if(document.querySelectorAll('.page-link').length != 0){
            document.querySelectorAll('.page-link')[model.currentPage-1].classList.add('active')
        }else{
            this.tips.classList.remove('isHide')
        }
        
    }
}


const controller = {
    initialize (){
        model.getApiData()
        this.setEventListener()
    },
    dataIsReady(){
        view.renderList(model.setItemPerPage())
        // view.renderRegionList(model.regions)
        // this.matchFavoriteBtnId()
    },
    setEventListener (){
        view.pagination.addEventListener('click',this.onPaginationClick)
        view.dataPanel.addEventListener('click',this.onDataPanelClick)
        view.searchForm.addEventListener('submit',this.onSearchSubmit)
        // view.RegionFilterList.addEventListener('click',this.onRegionFilterClick)
        // view.GenderFilterList.addEventListener('click',this.onGenderFilterClick)
    },
    onPaginationClick (e){
        if(e.target.matches('.page-link')){
            const paginationItem = document.querySelectorAll('.page-link');
            paginationItem.forEach(item => item.classList.remove('active'))
            model.currentPage = Number(e.target.dataset.page)
            e.target.classList.add('active')
            view.renderList(model.setItemPerPage())
            controller.matchFavoriteBtnId()
        }
    },
    onDataPanelClick (e){
        if(e.target.matches('.btn-show-detail')){
            const userId = Number(e.target.dataset.id)
            controller.changeModalInfo(userId)
        }else if(e.target.matches('.btn-remove-favorite')){
            model.removeFavorite(Number(e.target.dataset.id));
            model.setFilterItems()
            view.renderList(model.setItemPerPage())
        }
    },
    onSearchSubmit (e){
        e.preventDefault();
        model.resetFilter()
        model.setFilterItems()
        if(!model.filteredItems.length) return alert('您的搜尋無結果');
        view.renderList(model.setItemPerPage())
    },
    changeModalInfo (userId){
        const userInfo = model.items.find(user => user.id===userId)
        let ModalImageItem = ''
        ModalImageItem +=`
            <img src="${userInfo.avatar}" title="info-poster" class="img-fluid rounded-circle">
        `
        view.ModalImage.innerHTML = ModalImageItem
        view.ModalTitle.innerHTML = userInfo.name +' '+userInfo.surname
        let ModalDetailItem = ''
        ModalDetailItem +=`
            ID:  <em>${userInfo.id}</em></br>
            name:  <em>${userInfo.name}</em></br>
            surname:  <em>${userInfo.surname}</em></br>
            e-mail:  <em>${userInfo.email}</em></br>
            age:  <em>${userInfo.age}</em></br>
            birthday:  <em>${userInfo.birthday}</em></br>
            region:  <em>${userInfo.region}</em></br>
            gender:  <em>${userInfo.gender}</em></br>
        `
        view.ModalDetail.innerHTML = ModalDetailItem
    },
    matchFavoriteBtnId(){
        let btnArr = Array.from(view.AddFavoriteBtns)
        model.favList.forEach(item =>{
            btnArr.forEach(btn => {
                if(Number(btn.dataset.id) === item.id){
                    view.updateList(btn)
                }
            })
        })
    }
}

controller.initialize()


function newMethod(){
    toLowerCase();//將string轉小寫
    includes();//比對陣列中的key有無相符
    matches();//偵測點擊的元素是否為...
    push(...data);
    find();
    slice(5,15);//5是起點 15是終點
    Math.ceil(5.15);//將傳入的值無條件進位 5.15 > 6
    localStorage.setItem('key','value')//存入資料 
    localStorage.getItem('key')//取出資料
    localStorage.removeItem('key')//移除資料

    Object.getPrototypeOf()//查找物件原形
}

 
