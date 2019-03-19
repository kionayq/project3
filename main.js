
$(document).ready(function () { //must always be here if you use JQuery

    let db = firebase.firestore().collection('resturants')
    let resList = $('.res-container')
    let table = $('#data-grid')


    var tdate = new Date();
    var dd = tdate.getDate();
    var MM = ((tdate.getMonth().length + 1) === 1) ? (tdate.getMonth() + 1) : '0' + (tdate.getMonth() + 1);
    var yyyy = tdate.getFullYear();
    var currentDate = yyyy + "-" + MM + "-" + dd;
    $('input[name=bday]').attr("placeholder",currentDate)

    // console.log(currentDate)

    getData()

    function getData() {
        table.empty()
        db.get().then(result => {
            let changes = result.docChanges() //gets array of docs
            // console.log(changes)
            changes.forEach(res => {
                // console.log(res.doc.data());


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

            setCalendar()
        }).catch(err => console.log(err))

    }


    db.onSnapshot(result => {
        let changes = result.docChanges(); //gets array of docs
        changes.forEach(res => {
            // console.log(res.doc.data());
            if (res.type == 'added') {
                // console.log(res.doc.data());
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


    $('#remove-table').click(function () {
        $('.table').removeClass('show')
        $('.table').addClass('hide')
        $('.calendar').addClass('show')
        $('.calendar').removeClass('hide')
        // $('.calendar').show()
    })


    $('#remove-calender').click(function () {
        $('.table').addClass('show')
        $('.table').removeClass('hide')
        $('.calendar').removeClass('show')
        $('.calendar').addClass('hide')
    })



    $('#bday').datepicker({
        format: 'yyyy-mm-dd',
        language: 'AR'
    });


    function done() {
        $('.formcontainer').hide()
        $('.done').addClass('show')
    }


    //  full calender //



    var calendarEl = document.getElementById('calendar');
    var calendar;
    eventss = [];
    function setCalendar(){

        
   
    db.get().then(result => {
        let changes = result.docChanges() //gets array of docs
        changes.forEach(res => {


            eventss.push({
                title: `${res.doc.data().name}`,
                start: `${res.doc.data().date}`,
                allDay: true,
                
            });
        });
        calendar = new FullCalendar.Calendar(calendarEl, {
            locale: 'ar-sa',
            plugins: ['interaction', 'dayGrid', 'timeGrid'],
            defaultView: 'dayGridMonth',
            defaultDate: '2019-03-07',
            timeZone: 'UTC',
            code: "ar-sa",
            header: {
                left: 'prev',
                center: 'title',
                right: 'next'
            },
            events: eventss
        });     

calendar.render();





    }).catch(err => console.log(err))

}


    console.log(eventss)



  
})