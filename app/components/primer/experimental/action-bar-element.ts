/* eslint-disable custom-elements/expose-class-on-global */
/* eslint-disable custom-elements/define-tag-after-class-definition */

import {controller, targets, target} from '@github/catalyst'
import {positionedOffset} from '@primer/behaviors'

@controller
export class ActionBarElement extends HTMLElement {
  @targets items: HTMLElement[]
  @targets menuItems: HTMLElement[]
  @target moreMenu: HTMLElement

  // eslint-disable-next-line prettier/prettier
  #observer: ResizeObserver
  #initialBarWidth: number
  #itemGap: number

  connectedCallback() {
    this.#initialBarWidth = this.offsetWidth
    this.#itemGap = parseInt(window.getComputedStyle(this)?.columnGap) || 0

    for (const item of this.items) {
      const width = item.getBoundingClientRect().width
      const marginLeft = parseInt(window.getComputedStyle(item)?.marginLeft)
      const marginRight = parseInt(window.getComputedStyle(item)?.marginRight)
      item.setAttribute('data-offset-width', `${width + marginLeft + marginRight}`)
    }

    while (this.#availableSpace() < this.#itemGap && !this.items[0].hidden) {
      this.#calculateVisibleItems()
    }

    this.#observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (this.#initialBarWidth !== entry.contentRect.width) {
          this.#calculateVisibleItems()
        }
      }
    })

    this.#observer.observe(this)
  }

  disconnectedCallback() {
    this.#observer.unobserve(this)
  }

  #availableSpace(): number {
    // Get the offset of the first item from the container edge
    const offset = positionedOffset(this.items[0], this)
    if (!offset) {
      return this.clientWidth - this.moreMenu.clientWidth
    }

    return offset.left
  }

  #calculateVisibleItems() {
    const space = this.#availableSpace()

    if (space < this.#itemGap) {
      this.#hideItem()
    } else if (space > this.#itemGap + this.#nextItemWidth()) {
      this.#showItem()
    }
    this.#toggleMoreMenu()
  }

  #nextItemWidth(): number {
    const nextItem = this.#hiddenItems()[0] || this.items[0]

    return parseInt(nextItem.getAttribute('data-offset-width') || '0')
  }

  #hideItem() {
    const visibleItems = this.#visibleItems()
    const hiddenMenuItems = this.#hiddenMenuItems()

    if (visibleItems.length === 0) {
      return
    }
    visibleItems[visibleItems.length - 1].hidden = true
    hiddenMenuItems[hiddenMenuItems.length - 1].hidden = false
  }

  #showItem() {
    const hiddenItems = this.#hiddenItems()
    const visibleMenuItems = this.#visibleMenuItems()

    if (hiddenItems.length === 0) {
      return
    }
    hiddenItems[0].hidden = false
    visibleMenuItems[0].hidden = true
  }

  #hiddenItems(): HTMLElement[] {
    return this.items.filter(item => item.hidden)
  }

  #visibleItems(): HTMLElement[] {
    return this.items.filter(item => !item.hidden)
  }

  #hiddenMenuItems(): HTMLElement[] {
    return this.menuItems.filter(item => item.hidden)
  }

  #visibleMenuItems(): HTMLElement[] {
    return this.menuItems.filter(item => !item.hidden)
  }

  #toggleMoreMenu() {
    this.moreMenu.hidden = this.#hiddenItems().length === 0
  }
}

declare global {
  interface Window {
    ActionBarElement: typeof ActionBarElement
  }
}
