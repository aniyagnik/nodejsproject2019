

/*
    const exphbs = require('express-handlebars');
            
    // Register Handlebars view engine
    app.engine('handlebars', exphbs());
    Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

switch (operator) {
    case '==':
        return (v1 == v2) ? options.fn(this) : options.inverse(this);
    case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);
    case '!=':
        return (v1 != v2) ? options.fn(this) : options.inverse(this);
    case '!==':
        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
    case '<':
        return (v1 < v2) ? options.fn(this) : options.inverse(this);
    case '<=':
        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
    case '>':
        return (v1 > v2) ? options.fn(this) : options.inverse(this);
    case '>=':
        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
    case '&&':
        return (v1 && v2) ? options.fn(this) : options.inverse(this);
    case '||':
        return (v1 || v2) ? options.fn(this) : options.inverse(this);
    default:
        return options.inverse(this);
}
});
*/
const addComment=$('#addComment')
const comments=$('#comments')

addComment.click(()=>{
      let value=$('#comment').val()
      const imageName=$('#imageName').val()   
      const userWall=$('#userWall').val()   
      let viewinguser=$('#viewinguser').val()
      let arr=value.split(' ')
      var name=arr[0]
      console.log('assd',name, arr)
      if(value[0]=='@'){
        name=name.substr(1)
        arr.shift()
        arr.shift()
        value=arr.toString()
        value=value.split(',').join(' ')
        console.log('ha',name, arr)
        console.log('ds',viewinguser) 
        comments.append($(`<li><b>${viewinguser}</b> <a href="/user/dashboard/search?searchUser=${name}">:@${name}</a> ${value}</li>`))
      }
      else{
        name=false
        comments.append($(`<li><b>${viewinguser}</b> : ${value}</li>`))  
        }
      $('#comment').val('')
      $.ajax({
        url: '/user/wall/viewImage', 
        type: 'POST', 
        contentType: 'application/json', 
        data: JSON.stringify({
            comment:value,
            tagged:name,
            imageName:imageName,
            userWall:userWall,   
        })}
    )

})

comments.click((e)=>{
    const index=e.target.innerText.split(' ')[0]
    console.log(index)
    $('#comment').val(`@${index} : `)
})
