import sprite from 'virtual:svg-sprite'

/** Вставляет спрайт со всеми иконками в DOM один раз. */
export const mountIconSprite = () => {
  if (document.getElementById('icon-sprite')) return
  const holder = document.createElement('div')
  holder.id = 'icon-sprite'
  holder.innerHTML = sprite
  document.body.prepend(holder)
}
