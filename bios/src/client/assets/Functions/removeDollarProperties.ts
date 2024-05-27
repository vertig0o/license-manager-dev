function removeDollarProperties(obj) {
  const result = { ...obj }
  for (const key in result) {
    if (key.startsWith('$')) {
      delete result[key]
    }
  }
  return result
}

export default removeDollarProperties
