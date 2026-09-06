export type SceneData = {
  id: string
  title: string
  type: 'intro' | 'feature' | 'outro'
  code?: string
  diagram?:
    | 'array'
    | 'error-chain'
    | 'venn-set'
    | 'buffer'
    | 'promise-pipeline'
    | 'module'
    | 'class'
    | 'object'
    | 'iterator'
    | 'float16'
}

export const SCENES: SceneData[] = [
  {
    id: 'intro',
    title: '16 Fitur JavaScript Modern (2022-2025)',
    type: 'intro',
  },
  {
    id: 'top-level-await',
    title: '1. Top-Level await',
    type: 'feature',
    code: `// await di root level modul\nconst data = await fetch('api/data');\nconsole.log(data);`,
    diagram: 'module',
  },
  {
    id: 'private-class-fields',
    title: '2. Private Class Fields',
    type: 'feature',
    code: `class User {\n  #password = 'secret';\n  \n  check(pwd) {\n    return pwd === this.#password;\n  }\n}`,
    diagram: 'class',
  },
  {
    id: 'error-cause',
    title: '3. Error.cause',
    type: 'feature',
    code: `try {\n  fetchData();\n} catch (err) {\n  throw new Error('Gagal ambil data', { cause: err });\n}`,
    diagram: 'error-chain',
  },
  {
    id: 'object-has-own',
    title: '4. Object.hasOwn()',
    type: 'feature',
    code: `const obj = { prop: 42 };\n// Pengganti hasOwnProperty yang lebih aman\nObject.hasOwn(obj, 'prop'); // true`,
    diagram: 'object',
  },
  {
    id: 'array-at',
    title: '5. Array.at()',
    type: 'feature',
    code: `const arr = ['a', 'b', 'c'];\n// Ambil elemen dari belakang dengan minus\narr.at(-1); // 'c'`,
    diagram: 'array',
  },
  {
    id: 'immutable-array',
    title: '6. Immutable Array Methods',
    type: 'feature',
    code: `const arr = [3, 1, 2];\n// Mengembalikan array baru tanpa mengubah array asli\nconst sorted = arr.toSorted(); // [1, 2, 3]\nconst reversed = arr.toReversed();`,
    diagram: 'array',
  },
  {
    id: 'find-last',
    title: '7. findLast / findLastIndex',
    type: 'feature',
    code: `const arr = [5, 12, 50, 130, 44];\n// Mencari dari urutan paling belakang\narr.findLast(n => n > 40); // 44`,
    diagram: 'array',
  },
  {
    id: 'object-groupby',
    title: '8. Object.groupBy()',
    type: 'feature',
    code: `const users = [\n  { name: 'Ali', role: 'admin' },\n  { name: 'Budi', role: 'user' }\n];\nObject.groupBy(users, u => u.role);`,
    diagram: 'object',
  },
  {
    id: 'promise-with-resolvers',
    title: '9. Promise.withResolvers()',
    type: 'feature',
    code: `// Ekstrak resolve dan reject tanpa callback di dalam Promise\nconst { promise, resolve, reject } = Promise.withResolvers();\n\nresolve('selesai!');`,
    diagram: 'promise-pipeline',
  },
  {
    id: 'resizable-arraybuffer',
    title: '10. Resizable ArrayBuffer',
    type: 'feature',
    code: `const buffer = new ArrayBuffer(8, { maxByteLength: 16 });\n// Mengubah ukuran buffer tanpa membuat objek baru\nbuffer.resize(12);`,
    diagram: 'buffer',
  },
  {
    id: 'iterator-helpers',
    title: '11. Iterator Helpers',
    type: 'feature',
    code: `function* gen() { yield 1; yield 2; yield 3; }\n\n// Menggunakan method map/filter pada iterator\nconst iter = gen().map(x => x * 2);\nconsole.log(iter.next().value); // 2`,
    diagram: 'iterator',
  },
  {
    id: 'new-set-methods',
    title: '12. New Set Methods',
    type: 'feature',
    code: `const A = new Set([1, 2, 3]);\nconst B = new Set([2, 3, 4]);\n\n// Operasi himpunan secara native\nA.intersection(B); // Set {2, 3}\nA.union(B); // Set {1, 2, 3, 4}`,
    diagram: 'venn-set',
  },
  {
    id: 'regexp-escape',
    title: '13. RegExp.escape()',
    type: 'feature',
    code: `const str = 'harga: $100.00';\n// Escaping otomatis untuk karakter spesial RegEx\nconst regex = new RegExp(RegExp.escape(str));`,
    diagram: 'module',
  },
  {
    id: 'promise-try',
    title: '14. Promise.try()',
    type: 'feature',
    code: `// Membungkus synchronous atau asynchronous code\n// agar selalu mengembalikan Promise\nPromise.try(() => doSomething());`,
    diagram: 'promise-pipeline',
  },
  {
    id: 'float16',
    title: '15. Float16Array',
    type: 'feature',
    code: `// Tipe array untuk 16-bit floating point\n// berguna untuk WebGL / Machine Learning\nconst f16 = new Float16Array([1.5, 2.5]);`,
    diagram: 'float16',
  },
  {
    id: 'array-from-async',
    title: '16. Array.fromAsync()',
    type: 'feature',
    code: `// Mengonversi async iterable menjadi array\nasync function* asyncGen() { yield 1; yield 2; }\nconst arr = await Array.fromAsync(asyncGen());`,
    diagram: 'array',
  },
  {
    id: 'outro',
    title: 'Terima Kasih!',
    type: 'outro',
  },
]
