export const isMainRune = (id) => {
  const mains = [
    8112, 8124, 8128, 9923, 8351,
    8360, 8369, 8005, 8008, 8021,
    8010, 8437, 8439, 8465, 8214,
    8229, 8230
  ]
  return mains.includes(id)
}