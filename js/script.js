let submitBtn = document.getElementById('submit')
let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
let name = document.querySelector('.name')
let email = document.querySelector('.email')
let comment = document.getElementById('comment__value')
let comments = document.querySelector('.comments')

let items = localStorage.getItem('comments') ?
    JSON.parse(localStorage.getItem('comments')) :
    []

displayComments()

function displayComments() {
    if (items.length == 0) {
        comments.innerHTML = ` <h2>Комментариев нет</h2>`
    }
    else {
        let displayComments = '<h2>Комментарии</h2>'
        items.forEach(item => {
            displayComments += `
            <div id='${item.id}' class="comment__item">
                <div class='wrapper'>
                    <h3>${item.name}</h3>
                    <span>${item.date == getNowDate()
                    ? `сегодня в ${item.time}` : checkYesterday(item)}</span>
                </div>
                <div class="comment">
                    <p>${item.comment}</p>
                    <span id='${item.id}' 
                        class="material-symbols-outlined delete"
                    >
                        delete
                    </span> 
                </div>
    
                <span style="color: ${item.like ? 'red' : ''}" 
                    id='${item.id}' 
                    class="material-symbols-outlined like"
                >
                    thumb_up
                </span>
             </div>`
        })
        comments.innerHTML = displayComments
    }
}

submitBtn.addEventListener('click', function (e) {
    e.preventDefault()
    addComment()
})

comments.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete')) {
        let deleteBtnID = e.target.getAttribute('id')
        items = items.filter(item => Number(item.id) !== Number(deleteBtnID))
        localStorage.setItem('comments', JSON.stringify(items))
        displayComments()
    }
    if (e.target.classList.contains('like')) {
        let likeBtnID = e.target.getAttribute('id')
        items.forEach(item => {
            if (Number(item.id) === Number(likeBtnID)) {
                item.like = !item.like
                localStorage.setItem('comments', JSON.stringify(items))
                displayComments()
            }
        })
    }
})


document.onkeydown = (e) => {
    if (e.keyCode === 13) {
        addComment()
    }
}

function addComment() {
    if (name.value == '' || email.value == '' || comment.value == '') {
        alert('Заполните все поля')
    } else if (validate() && minLength()) {
        let date = new Date(document.getElementById('date').value)
        let inputDate

        if (!date.value) {
            inputDate = getNowDate()
        } else {
            inputDate = addZero(date.getFullYear()) + '-' +
                addZero(date.getMonth() + 1) + '-' +
                addZero(date.getDate())
        }

        let commentObj = {
            id: Date.now(),
            email: email.value,
            name: name.value,
            date: inputDate,
            time: getNowTime(),
            comment: comment.value,
            like: false
        }

        items.push(commentObj)
        localStorage.setItem('comments', JSON.stringify(items))
        alert('Комментарий добавлен')
        displayComments()
        name.value = email.value = comment.value = ''
    }
}

function validate() {
    if (reg.test(email.value) == false) {
        alert('Введите корректный e-mail')
        return false
    }
    return true
}

function minLength() {
    if (name.value.length < 3) {
        alert('Имя должно быть больше 3 символов ')
        return false
    }
    return true
}

function checkYesterday(item) {
    let checkingDate = item.date.split('-')
    let nowDate = getNowDate().split('-')

    if (Number(checkingDate[2]) == Number(nowDate[2] - 1)) {
        return 'вчера в ' + item.time
    }
    else {
        return item.date + ' в ' + item.time
    }
}

function addZero(num) {
    if (num >= 0 && num <= 9) {
        return '0' + num
    } else {
        return num
    }
}

function getNowDate() {
    let dateControl = document.querySelector('input[type="date"]')
    let date = new Date

    let now = addZero(date.getFullYear()) + '-' +
        addZero(date.getMonth() + 1) + '-' +
        addZero(date.getDate())

    dateControl.value = now
    return now
}

function getNowTime() {
    let date = new Date
    let time = addZero(date.getHours()) + ':' + addZero(date.getMinutes())
    return time
}