type Union = 'a' | 'b' | 'c'

export type prettify<t> = {
	[k in keyof t]: t[k]
} & {}

type MappedUnion = {
  [key in Union]: `${key}${key}`
}[Union]

type dict = {
  name: 'hi'
  age: number
  person: {
    name: string
    age: number
    child: {
      name: string
      age: number
    }
  }
}

type deepOptional<d> = {
  [k in keyof d]?: d[k] extends object ? prettify<deepOptional<d[k]>> : d[k]
}

type lol = DeepPartial<dict>

type thing = 'cat' | 'dog' | 'catter' | 'dogger' | 'catman'

type cattyThing = {
  [Animal in thing]: Animal extends `cat${infer _}` ? Animal : never
}[thing]

type DeepPartial<T> = T extends object ?  {
  [P in keyof T]?: DeepPartial<T[P]>
} : T

type ValidateString<T extends string> = T extends `${infer First}${infer Rest}` 
  ? First extends Uppercase<First>
    ? `${First}${Rest}`
    : never
  : never

type First<S extends String> = S[0]

type CapKeys<T> = {
  [K in keyof T as First<K & string>]: T[K]
}

type lollol = CapKeys<{
  name: 'hi'
  Age: 5
  AAge: 6
}>

type WithGetters<T> = prettify<{
  [K in keyof T as `get${Capitalize<string & K>}`]: T[K]
} & {
  [K in keyof T]: T[K]
}>

type PersonGetters = WithGetters<{name: 'hi'}>

type RemoveId<T> = {
  [K in keyof T as K extends `cat${infer _}` ? K : never]: T[K]
}

type haha = RemoveId<{
  id: string
  name: 'hi'
  cat: 'hi'
  cata: 'hi'
}>

interface Items {
    sword: { damage: number };
    shield: { defense: number };
    potion: { healing: number };
}

type InventoryItems = prettify<{
  [item in keyof Items]: Items[item] & { quantity: number }
}>

type ObjToUrlPath<o extends Record<string, any>> = {
  [k in keyof o]: k extends infer k_ extends string ? `${k_}/$${k_}` : never
}[keyof o]

type route = ObjToUrlPath<{id: string, content: string}>

type user = {
  name: 'hi'
  age: 5
}

type mapAccum<u, acc = {}> = {
  [k in keyof u]: {hi: 'there'}
}

type ha = mapAccum<user>

type Actions = {
    getUser: { id: string };
    createPost: { title: string; content: string };
    deleteComment: { postId: string; commentId: string };
}

type APIEndpoints = {
    [K in keyof Actions as `/api/${string & K}`]: Actions[K]
}

type capitalizedOnly<T> = {
  [K in keyof T as K extends string ? K extends Capitalize<K> ? K : never : never]: T[K]
}
