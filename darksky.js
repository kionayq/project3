$.ajax({  
    url:'https://accesscontrolalloworiginall.herokuapp.com/https://api.darksky.net/forecast/b75e2d1c7e13742e005531c0f9c4db7a/37.8267,-122.4233',
    type:"get",  
    // headers :{
    //     "Access-Control-Allow-Origin" : "*"
    // },
    success:function(data){
  console.log(data.latitude)
    },error:function(a,b,c){
        console.error(a,b,c);
      }      
    });
      
