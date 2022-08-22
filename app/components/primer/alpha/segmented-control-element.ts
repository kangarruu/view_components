/* eslint-disable custom-elements/no-constructor */
export default class SegmentedControlElement extends HTMLElement {
  constructor() {
    super()

    this.addEventListener('click', (event: MouseEvent) => {
      const controls = Array.from(this.querySelectorAll<HTMLElement>('ul button')).filter(
        tab => tab instanceof HTMLElement && tab.closest(this.tagName) === this
      ) as HTMLElement[]

      if (!(event.target instanceof Element)) return
      if (event.target.closest(this.tagName) !== this) return

      const selectedControl = event.target.closest('button')
      if (!(selectedControl instanceof HTMLElement) || !selectedControl.closest('ul')) return

      for (const control of controls) {
        control.closest('li')?.classList.remove('SegmentedControl-item--selected')
        control.setAttribute('aria-current', 'false')
      }

      selectedControl.closest('li')?.classList.add('SegmentedControl-item--selected')
      selectedControl.setAttribute('aria-current', 'true')
      selectedControl.focus()
    })
  }
}

declare global {
  interface Window {
    SegmentedControlElement: typeof SegmentedControlElement
  }
}

if (!window.customElements.get('segmented-control')) {
  window.SegmentedControlElement = SegmentedControlElement
  window.customElements.define('segmented-control', SegmentedControlElement)
}