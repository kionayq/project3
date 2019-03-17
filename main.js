$(document).ready(function () { //must always be here if you use JQuery

    let db = firebase.firestore().collection('resturants')
    let resList = $('.res-container')

    var tdate = new Date();
    var dd = tdate.getDate();
    var MM = ((tdate.getMonth().length + 1) === 1) ? (tdate.getMonth() + 1) : '0' + (tdate.getMonth() + 1);
    var yyyy = tdate.getFullYear();
    var currentDate = yyyy + "-" + MM + "-" + dd;
    $('input[name=bday]').val(currentDate)

    console.log(currentDate)

    db.get().then(result => {
        let changes = result.docChanges() //gets array of docs
        console.log(changes)
        changes.forEach(res => {
            console.log(res.doc.data());
            resList.append(`<li data-id="${res.doc.id}"> <span class="nameClass">${res.doc.data().name} </span> - <span class="locationClass"> ${res.doc.data().location} </span> - <span class="dateClass">${res.doc.data().date} </span> <button class="edit">edit</button> <button class="delete">delete</button> </li>`)
        });
    }).catch(err => console.log(err))


    db.onSnapshot(result => {
        let changes = result.docChanges(); //gets array of docs
        changes.forEach(res => {
            // console.log(res.doc.data());
            if (res.type == 'added') {
                console.log(res.doc.data());
                // ready(res.doc)
            } else if (res.type == 'removed') {
                let li = resList.$('[date-id=' + res.doc.id + ']')
                resList.removeChild(li)
            }
            // resList.append(`<li data-id="${res.doc.id}">${res.doc.data().name} - ${res.doc.data().location} - ${res.doc.data().date} <button class="edit">edit</button> <button class="delete">delete</button> </li>`)


        });

    })


    resList.on('click', ".delete", function () {
        //$(this).parent().attr("data-id")
        let id = $(this).parent().data("id")

        db.doc(id).delete()
        // .then()
        $(this).parent().hide()

    })

    

    resList.on('click', ".edit", function () {
        // $(this).parent().attr("data-id")
        let id = $(this).parent().data("id")

        

        let nameI = $('input[name=name]').val()
        let locationI = $('input[name=location]').val()


        let date = $('input[name=bday]').val()
        db.doc(id).get().then(res => {
            // console.log(res.data());            
            $('input[name=name]').val(res.data().name)
            $('input[name=location]').val(res.data().location)
            $('input[name=bday]').val(res.data().date)
            $('.formcontainer').append(`<button class="update">Update</button>`)


            $('.update').click(function () {
                
        let nameI = $('input[name=name]').val()
        let locationI = $('input[name=location]').val()
        let dateI = $('input[name=bday]').val()


                db.doc(id).update({
                    name: nameI,
                    location: locationI,


                })
                    .then(docRef => {

console.log($(`[data-id="${id}"]`));


                    $(".update").remove();
                    
                    $(`[data-id="${id}"]`).replaceWith(`<li data-id="${id}"> <span class="nameClass" > ${nameI} </span> - <span class="locationClass"> ${locationI} </span>- <span class="locationClass"> ${dateI} </span> <button class="edit">edit</button> <button class="delete">delete</button></li>`)
                    
                    $('input[name=name]').val('')
                    $('input[name=location]').val('')
                    $('input[name=bday]').val('')
                    })



                    

                    

            })
        })



    })

    //create data and store to restaurants collection
    $('.submit').click(function () {

        let nameI = $('input[name=name]').val()
        let locationI = $('input[name=location]').val()
        let dateI = $('input[name=bday]').val()



        db.add({
            name: nameI,
            location: locationI,
            date: dateI
        }).then(res => {

            console.log(` ${name} - ${locationI}`);

            resList.append(`<li data-id="${res.id}"> <span class="nameClass" > ${nameI} </span>- <span class="locationClass"> ${locationI} </span>- <span class="locationClass"> ${dateI} </span> <button class="edit">edit</button> <button class="delete">delete</button></li>`)
        })

        $('input[name=name]').val('')
        $('input[name=location]').val('')
        $('input[name=bday]').val(currentDate)


    })

})