window.addEventListener('load',()=>{
    const load_screen=document.getElementById('load_screen')
    load_screen.parentNode.removeChild(load_screen)
    $('body').css('text-align','left')
})