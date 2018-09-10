
export default async function asyncForEach(array, callback) {
  for (let i = 0; i < array.length; i += 1) {
    await callback(array[i], i, array);
  }
}
