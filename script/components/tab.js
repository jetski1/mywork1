class Tab extends ElementQuery {
  constructor(data) {
    super(data);
    this.class = data.activeClass
    this.links = [...[...this.el.children][0].children]
    this.contents = [...[...this.el.children][1].children]
    this.active = data.activeTab - 1 > this.links.length - 1 ? this.links.length - 1 : data.activeTab - 1
    this.links[this.active].classList.add(this.class)
    this.contents[this.active].classList.add(this.class)

    this.links.forEach((link, index) => {
        link.onclick = e => this.openContent(e, link, index)
    })
  }
  openContent(e, link, i) {
    e.preventDefault()
    this.links.forEach((linkActive, index) => {
        linkActive.classList.remove(this.class)
        this.contents[index].classList.remove(this.class)
    })
    link.classList.add(this.class)
    this.contents[i].classList.add(this.class)
  }
}

const tab = new Tab({
    el: '.works__tabs',
    activeTab: 1,
    activeClass: 'active'
})
