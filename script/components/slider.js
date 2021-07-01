class ElementQuery {
    constructor(data) {
        if (typeof data.el === 'string') {
            this.el = document.querySelector(data.el)
            this.name = data.el.replace('.', '')
        }
        else if (data.el instanceof HTMLElement) {
            this.el = data.el
            this.name = this.el.className
        }
    }
    createElement(parent, geo, html) {
        parent.insertAdjacentHTML(geo, html)
    }
}

class Slider extends ElementQuery {
    constructor(data) {
        super(data)
        this.sliderInner = this.el.querySelector(`.${this.name}__inner`)
        this.slides = [...this.sliderInner.children]

        this.queryBtn(data)

        this.dir = data.direction.toUpperCase() === 'X' ? 'X' : 'Y'
        this.timeMove = data.time != undefined || data.time >= 200 ? data.time : 1000

        this.width = this.size().w
        this.height = this.size().h

        this.activeSlide = 0
        this.genPosition()

        this.interval = isNaN(data.interval) || data.interval <= this.timeMove
            ? this.timeMove + 500
            : data.interval

        if (data.autoplay) {
            let interval = setInterval(() => {
                this.move(this.next)
            }, this.interval);

            this.el.onmouseenter = () => {
                clearInterval(interval)
                this.childrenLineEls[this.activeSlide].classList.add('paused')
            }
            this.el.onmouseleave = () => {
                interval = setInterval(() => {
                    this.move(this.next)
                }, this.interval);
                this.childrenLineEls[this.activeSlide].classList.remove('paused')
                this.childrenLineEls[this.activeSlide].classList.remove('active')
                setTimeout(() => this.childrenLineEls[this.activeSlide].classList.add('active'), 10)
            }

        }



        window.onresize = () => this.resize()

        if (this.next && this.prev) {
            this.next.onclick = () => this.move(this.next)
            this.prev.onclick = () => this.move(this.prev)
        }

        this.eventActive = new Event('changeactive')
        this.el.addEventListener('changeactive', (e) => this.lineGen(e))
        this.lineGen()
    }
    lineGen(e) {
        if (!e) {
            const parentLine = '<div class="slider__line"></div>'
            this.createElement(this.el, 'afterend', parentLine);
        }
        const nextEl = this.line = this.el.nextElementSibling
        if (!e) {
            this.slides.forEach(key => {
                const itemLine = '<span class="slider__line-item"></span>'
                this.createElement(nextEl, 'beforeend', itemLine)
            })
        }

        this.childrenLineEls = [...this.line.children]
        this.childrenLineEls.forEach((el, index) => {
            if (index < this.activeSlide) {
                el.classList.add('show')
                el.classList.remove('active')
            } else if (index === this.activeSlide) {
                el.classList.add('active')
            } else {
                el.classList.remove('show')
            }
        })
    }
    queryBtn(data) {
        if (data?.btn?.create) {
            this.createElement(this.el, 'beforeend', `<div class="${data.btn.parent}"></div>`)
            const parentControls = this.el.querySelector('.' + data.btn.parent)
            const createBtns = ['prev', 'next']
            createBtns.forEach(dir => {
                const HTML = `<button data-arrow="${dir}">${data.btn[`${dir}InnerBtn`]}</button>`
                this.createElement(parentControls, 'beforeend', HTML)
            })
        }

        this.btns = [...this.el.querySelectorAll('[data-arrow]')]

        if (this.btns.length) {
            this.btns.forEach(btn => {
                const dataArrow = btn.getAttribute('data-arrow')
                this[dataArrow] = btn
            })
        }
    }
    size() {
        return {
            w: this.el.clientWidth,
            h: this.el.clientHeight
        }
    }
    resize() {
        this.width = this.size().w
        this.height = this.size().h
        this.genPosition()
    }
    genPosition() {

        this.moveSize = this.dir === 'X' ? this.width : this.height

        this.sliderInner.style.position = 'relative'

        this.sliderInner.style.overflow = `hidden`

        this.slides.forEach((slide, index) => {
            slide.style.position = 'absolute'
            slide.style.width = `${this.width}px`
            slide.style.height = `${this.height}px`

            if (index !== this.activeSlide) slide.style.transform = `translate${this.dir}(${this.moveSize}px)`

            const leftSlide = this.activeSlide === 0 ? this.slides.length - 1 : index - 1

            if (leftSlide === index) slide.style.transform = `translate${this.dir}(${-this.moveSize}px)`
        })
        this.sliderInner.style.height = `${this.height}px`
    }
    move(btn) {

        if (this.next && this.prev) {
            this.next.disabled = this.prev.disabled = true
        }
        if (this.next && this.prev) {
            setTimeout(() => {

                this.next.disabled = this.prev.disabled = false
            }, this.timeMove)
        }
        const btnLeftOrRight = btn === this.next
            ? this.moveSize * -1
            : this.moveSize

        this.slides.forEach((slide, index) => {
            slide.style.transition = '0ms'

            if (index !== this.activeSlide) {
                slide.style.transform = `translate${this.dir}(${btnLeftOrRight * -1}px)`
            }
        })

        this.slides[this.activeSlide].style.transform = `translate${this.dir}(${btnLeftOrRight}px)`
        this.slides[this.activeSlide].style.transition = `${this.timeMove}ms`

        if (this.next === btn) {
            this.activeSlide++
            if (this.activeSlide === this.slides.length) this.activeSlide = 0
        } else if (this.prev === btn) {
            this.activeSlide--
            if (this.activeSlide < 0) this.activeSlide = this.slides.length - 1
        }

        this.slides[this.activeSlide].style.transform = `translate${this.dir}(${0}px)`
        this.slides[this.activeSlide].style.transition = `${this.timeMove}ms`
        this.el.dispatchEvent(this.eventActive)
    }
}

const slider = new Slider({
    el: '.slider',
    direction: 'X',
    time: 500,
    autoplay: true,
    interval: 5000,
    btn: {
        create: false,
        defaultBtn: false
    }
})