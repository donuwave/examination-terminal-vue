import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import type { Plugin } from 'vite'

const VIRTUAL_ID = 'virtual:svg-sprite'
const RESOLVED_ID = `\0${VIRTUAL_ID}`

interface Options {
  /** Папка с .svg-файлами. Имя файла = имя иконки. */
  dir: string
  /** Куда записать union-тип с именами иконок. */
  typesFile: string
}

const listIcons = (dir: string) =>
  existsSync(dir)
    ? readdirSync(dir)
        .filter((file) => file.endsWith('.svg'))
        .sort()
    : []

/** Атрибуты корневого <svg>, которые нужно сохранить на <symbol>: на него они не наследуются сами. */
const KEPT_ATTRS = [
  'fill',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'fill-rule',
  'clip-rule',
]

const toSymbol = (file: string, dir: string) => {
  const name = basename(file, '.svg')
  const source = readFileSync(resolve(dir, file), 'utf-8')
  const root = source.match(/<svg[^>]*>/)?.[0] ?? ''
  const viewBox = root.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 24 24'
  const attrs = KEPT_ATTRS.flatMap((attr) => {
    const value = root.match(new RegExp(`\\s${attr}="([^"]*)"`))?.[1]
    return value === undefined ? [] : [`${attr}="${value}"`]
  }).join(' ')
  const inner = source
    .replace(/<\?xml[^>]*>/g, '')
    .replace(/<svg[^>]*>|<\/svg>/g, '')
    .trim()
  return `<symbol id="icon-${name}" viewBox="${viewBox}" ${attrs}>${inner}</symbol>`
}

const buildSprite = (dir: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${listIcons(dir)
    .map((file) => toSymbol(file, dir))
    .join('')}</svg>`

const writeTypes = (dir: string, typesFile: string) => {
  const names = listIcons(dir).map((file) => `  | '${basename(file, '.svg')}'`)
  const content = `// Файл генерируется плагином svg-sprite. Не редактировать вручную.\nexport type IconName =\n${
    names.join('\n') || '  never'
  }\n`
  mkdirSync(resolve(typesFile, '..'), { recursive: true })
  if (!existsSync(typesFile) || readFileSync(typesFile, 'utf-8') !== content) {
    writeFileSync(typesFile, content)
  }
}

export const svgSprite = ({ dir, typesFile }: Options): Plugin => ({
  name: 'svg-sprite',
  buildStart() {
    writeTypes(dir, typesFile)
  },
  configureServer(server) {
    server.watcher.add(dir)
    const onChange = (path: string) => {
      if (!path.startsWith(dir) || !path.endsWith('.svg')) return
      writeTypes(dir, typesFile)
      const module = server.moduleGraph.getModuleById(RESOLVED_ID)
      if (module) server.moduleGraph.invalidateModule(module)
      server.ws.send({ type: 'full-reload' })
    }
    server.watcher.on('add', onChange).on('change', onChange).on('unlink', onChange)
  },
  resolveId(id) {
    if (id === VIRTUAL_ID) return RESOLVED_ID
  },
  load(id) {
    if (id === RESOLVED_ID) return `export default ${JSON.stringify(buildSprite(dir))}`
  },
})
