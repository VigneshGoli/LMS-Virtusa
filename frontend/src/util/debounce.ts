export const debounce = (fn: () => void, delay: number) => {
  let timer: number | undefined

  const wrapper = () => {
    if (timer) {
      window.clearTimeout(timer)
    }
    timer = window.setTimeout(() => {
      fn()
    }, delay)
  }

  wrapper.cancel = () => {
    if (timer) {
      window.clearTimeout(timer)
    }
  }

  return wrapper
}

