const socket = io();
let selected_user=[]

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
addComment.click(()=>{
      const value=$('#comment').val()
      const imageName=$('#imageName').val()   
      const userWall=$('#userWall').val()   
      const viewinguser=$('#viewinguser').val()
      $('#comments').append($(`<li>${viewinguser} : ${value}</li>`))
      $('#comment').val(' ')
      $.ajax({
        url: '/user/wall/viewImage', 
        type: 'POST', 
        contentType: 'application/json', 
        data: JSON.stringify({
            comment:value,
            imageName:imageName,
            userWall:userWall,   
        })}
    )

})

