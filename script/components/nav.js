class Nav {
    constructor(data) {
        if (data.nav instanceof HTMLElement)
            this.nav = data.nav
        else if (typeof data.nav === 'string')
            this.nav = document.querySelector(data.nav)

        if (data.btn instanceof HTMLElement)
            this.btn = data.btn
        else if (typeof data.btn === 'string')
            this.btn = document.querySelector(data.btn)

        this.navName = data.nav
        this.btnName = data.btn 
        this.class = data.toggleClass
        this.btn.onclick = e => this.open()
        window.onclick = e => this.close(e)
    }
    open() {
        this.nav.classList.add(this.class)
    }
    close(event) {

        this.nav.classList.contains(this.class)
        && event.target !== this.btn
        && event.target.closest(this.btnName) !== this.btn
        && event.target !== this.nav
        && event.target.closest(this.navName) !== this.nav
            ? this.nav.classList.remove(this.class)
            : ''
    }
}

const nav = new Nav({
    nav: '.header__nav-list',
    btn: '.header__nav-btn',
    toggleClass: 'show'
})

var $btnTop = $(".btn-top")
$(window).on("scroll", function () {
  if ($(window).scrollTop() >= 20){
    $btnTop.fadeIn();
  }else {
    $btnTop.fadeOut();
  }
})

$btnTop.on("click", function() {
  $("html,body").animate({scrollTop:0}, 900)
})