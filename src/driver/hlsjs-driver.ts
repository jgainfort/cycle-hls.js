export function makeHlsjsDriver(): (id: string) => string {
  function hlsjsDriver(id: string): string {
    return `Hello ${id}`
  }
  return hlsjsDriver
}
