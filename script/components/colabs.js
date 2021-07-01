class Collapse extends ElementQuery {
    constructor(data) {
        super(data)
        this.heads = [...this.el.querySelectorAll('.cap__tech-head')]
        this.descs = [...this.el.querySelectorAll('.cap__tech-desc')]
        this.parents = []
        this.heads.forEach(head => {
            this.parents.push(head.closest('.cap__tech-item'))
            head.onclick = () => this.openOrClose(head)
        })
    }
    openOrClose(el) {
        const parent = el.closest('.cap__tech-item')
        const desc = parent.querySelector('.cap__tech-desc')
        this.parents.forEach(parentItem => {
            if(parent !== parentItem) {
                parentItem.classList.remove('show')
                const desc = parentItem.querySelector('.cap__tech-desc')
                desc.style.height = '0px'
            }
        })
        parent.classList.toggle('show')
        if(parent.classList.contains('show')) {
            desc.style.height = `${desc.scrollHeight}px`
        } else {
            desc.style.height = `0px`
        }
    }
}

const col = new Collapse({
    el: '.cap__tech'
})
console.log(col);