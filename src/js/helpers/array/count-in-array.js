export default function countInArray(array, what) {
    var count = 0;

    for (let i = 0; i < array.length; i++) {
        if (array[i] === what) {
            count++;
        }
    }
    return count;
}
