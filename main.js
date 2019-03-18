$(document).ready(function () { //must always be here if you use JQuery

    let db = firebase.firestore().collection('resturants')
    let resList = $('.res-container')
    let table = $('#data-grid')


    var tdate = new Date();
    var dd = tdate.getDate();
    var MM = ((tdate.getMonth().length + 1) === 1) ? (tdate.getMonth() + 1) : '0' + (tdate.getMonth() + 1);
    var yyyy = tdate.getFullYear();
    var currentDate = yyyy + "-" + MM + "-" + dd;
    $('input[name=bday]').val(currentDate)

    console.log(currentDate)

    getData()



    function getData() {
        table.empty()
        db.get().then(result => {
            let changes = result.docChanges() //gets array of docs
            console.log(changes)
            changes.forEach(res => {
                console.log(res.doc.data());
                // resList.append(`<li data-id="${res.doc.id}" class="li-look d-flex justify-content-lg-between px-3 py-1"> 
                // <span class="nameClass">${res.doc.data().name} </span> - 
                // <span class="locationClass"> ${res.doc.data().location} </span> -
                //  <span class="dateClass">${res.doc.data().date} </span>
                //  <button class="edit btn btn-default" data-toggle="modal" data-target="#popUp">edit</button> 
                //  <button class="delete btn btn-danger">delete</button> </li>`)


                table.append(`  <tr id="${res.doc.id}" data-id="${res.doc.id}">
            <th scope="row" class="nameClass">${res.doc.data().name}</th>
            <td class="locationClass" >${res.doc.data().location}</td>
            <td  class="dateClass" > ${res.doc.data().date}  </td>
            <td>  
               <button class="edit btn btn-info" data-toggle="modal" data-target="#popUp">edit</button> 
               <button class="delete btn btn-danger">delete</button> 
            </td>     
        </tr>`)


            });
        }).catch(err => console.log(err))

    }


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


    table.on('click', ".delete", function () {
        //  console.log(id)
        let id = $(this).closest('tr').data("id")
        console.log(id)


        db.doc(id).delete()
        // // .then()
        $(this).parent().parent().hide()

    })



    table.on('click', ".edit", function () {
        // $(this).parent().attr("data-id")
        let id = $(this).closest('tr').data("id")
        $('.submit').replaceWith(`<button class="update btn btn-info w-100 mt-2">تحديث</button>`)
        let date = $('input[name=bday]').val()
        db.doc(id).get().then(res => {
            // console.log(res.data());            
            $('input[name=name]').val(res.data().name)
            $('input[select=location]').val(res.data().location)
            $('input[name=bday]').val(res.data().date)
            // $('.formcontainer').append(`<button class="update">Update</button>`)
            // $('.submit').replaceWith(`<button class="update btn btn-info w-100 mt-2">تحديث</button>`)
            $('.update').click(function () {
                let nameI = $('input[name=name]').val()
                let locationI = $('select[name=location]').val()
                let dateI = $('input[name=bday]').val()
                db.doc(id).update({
                    name: nameI,
                    location: locationI,
                    date: dateI,
                }).then(docRef => {
                    $(".update").remove();
                    getData()
                    $('input[name=name]').val('')
                    $('input[name=location]').val('')
                    $('input[name=bday]').val('')
                    done()
                })
            })
        })



    })

    $('button[name=close]').click(function () {
        $('input[name=name]').val('')
        $('input[name=location]').val('')
        $('input[name=bday]').val('')
        $('.update').replaceWith(`<button class="submit btn btn-primary w-100 mt-2">احجز</button>`)
    })


    //create data and store to restaurants collection
    $('.submit').click(function () {
        let nameI = $('input[name=name]').val()
        let locationI = $('select[name=location]').val()
        let dateI = $('input[name=bday]').val()
        db.add({
            name: nameI,
            location: locationI,
            date: dateI

        }).then(res => {
            getData()
        })

        $('input[name=name]').val('')
        $('input[name=location]').val('')
        $('input[name=bday]').val(currentDate)
        done()
    })
})

$('#remove-table').click(function(){
    $('.table').removeClass('show')
    $('.table').addClass('hide')    
    $('.calendar').addClass('show')
    $('.calendar').removeClass('hide')    
    // $('.calendar').show()
})


$('#remove-calender').click(function(){
    $('.table').addClass('show')
    $('.table').removeClass('hide')       
    $('.calendar').removeClass('show')
    $('.calendar').addClass('hide')
})



function done(){
    $('.formcontainer').hide()
    $('.done').addClass('show')
}
