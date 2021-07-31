document.addEventListener("DOMContentLoaded", function() {
    renderAllBooks()
});

const menu = document.querySelector('div#list-panel ul#list')
const bookinfo = document.querySelector("#show-panel")

function renderList(book){
    const li = document.createElement('li')
    li.dataset.id = book.id
    li.classList.add('book')
    li.textContent = book.title
    menu.append(li)
}

function renderAllBooks() {
    fetch('http://localhost:3000/books')
        .then(r => r.json())
        .then(books => {
    
            books.forEach(book => {
                renderList(book)
            })
        })
}
function oneBook(book){
    const bookinfo = document.querySelector("#show-panel")
    bookinfo.innerHTML = ''
    const outerDiv = document.createElement('div')
   
    outerDiv.dataset.id = book.id
  
    outerDiv.innerHTML = `
    <h2>${book.title}</h2>
    <img src=${book.img_url} alt=${book.title}/>
    <h3>${book.subtitle}</h3>
    <h3>${book.author}</h3>
    <p>${book.description}</p>
  `
  
    bookinfo.append(outerDiv)
  const ul= document.createElement('ul')
  ul.classList.add('likedusers')
  ul.dataset.id = book.id
  book.users.forEach(user => {
      const li = document.createElement('li')
      li.dataset.id = user.id
      li.textContent = user.username
      ul.append(li)
  })
bookinfo.append(ul)
  const likebtn= document.createElement('button')
  likebtn.classList.add('like-btn')
  likebtn.textContent='LIKE'
  bookinfo.append(likebtn)
  }

menu.addEventListener('click', e => {

    if (e.target.matches('li')) {
        console.log('click ', e.target)
        const id = e.target.dataset.id

        fetch('http://localhost:3000/books/' + id)
            .then(r => r.json())
            .then(book => {
                oneBook(book)
            })
    }
})

function fetchBook(id) {
    return fetch(`http://localhost:3000/books/${id}`)
    .then(r => r.json())
}

bookinfo.addEventListener('click', e=> {
    if(e.target.matches('button.like-btn')){
    let liked=bookinfo.querySelector('ul.likedusers')
    let likebtn=bookinfo.querySelector('button')
    let status = likebtn.textContent
    let like
    if (status==="LIKE"){
        likebtn.textContent= "UNLIKE"
        like = true
    }
    else{
        likebtn.textContent= "LIKE"
        like = false
    }
    if (like){
        const current={
            'id':1,
            'username': "pouros"
        }
        const li = document.createElement('li')
        li.classList.add('liked')
        li.dataset.id=current['id']
        li.textContent =current['username']
        liked.append(li)

        let currentbook= fetchBook(liked.dataset.id)
        currentbook.then(book =>{let likedusers= book.users
            likedusers.push(current)
            fetch(`http://localhost:3000/books/${liked.dataset.id}`, {
                method:'PATCH',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({users:likedusers})
        })
        })
        }
        else{
            const current={
                'id':1,
                'username': "pouros"
            }
            const currentUser = liked.querySelector(`[data-id='${current.id}']`)
    
                currentUser.remove()
         let currentbook= fetchBook(liked.dataset.id)
                currentbook.then(book =>{let likedusers= book.users
                    likedusers.pop()
                    fetch(`http://localhost:3000/books/${liked.dataset.id}`, {
                        method:'PATCH',
                        headers: {
                            'Content-Type':'application/json'
                        },
                        body: JSON.stringify({users:likedusers})
                })})
        }
    }
})
