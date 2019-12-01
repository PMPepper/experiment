export default function arrayHasDuplicates(a) {
  return (new Set(a)).size !== a.length;
}
