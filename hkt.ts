// Inspired by https://github.com/poteat/hkt-toolbelt
// and https://code.lol/post/programming/higher-kinded-types/

export type Fn = (...x: never[]) => unknown

export type returnType<T> = T extends (...args: never[]) => infer R ? R : never

export declare const _: unique symbol
export type _ = typeof _

export declare abstract class Kind<F extends Fn = Fn> {
	abstract readonly [_]: unknown
	f: F
}

export type fnInput<F extends Kind> = F extends {
	f: (x: infer X) => any
}
	? X
	: unknown

export type reify<K extends Kind> = K & {
	<X extends fnInput<K>>(
		x: inferType<X>,
	): apply<K, X> extends infer Result
		? Result extends Kind
			? reify<Result>
			: apply<K, X>
		: never
}

export type pipe<T extends Kind[], X> = T extends [
	infer Head extends Kind,
	...infer Tail extends Kind[],
]
	? [X] extends [never]
		? never
		: pipe<Tail, apply<Head, cast<X, fnInput<Head>>>>
	: X

export type cast<T, U> = T extends U ? T : U

type inferred =
	| string
	| number
	| boolean
	| undefined
	| null
	| Fn
	| Kind
	| inferredTuple
	| {
			[key: string]: inferred
	  }

type inferredTuple = inferred[] | ReadonlyArray<inferred>

export type inferType<
	X,
	Narrow = cast<X, inferred> | [...cast<X, inferredTuple>],
> = Narrow extends unknown[] ? { [key in keyof X]: inferType<X[key]> } : Narrow

export type first<T extends unknown[]> = T extends [] ? never : T[0]

export interface First extends Kind {
	f(x: cast<this[_], unknown[]>): first<typeof x>
}

export type apply<F extends Kind, X extends fnInput<F>> = returnType<
	(F & {
		readonly [_]: X
	})["f"]
>

type OmitNonStrings<O extends Record<string, unknown>> = {
	[key in keyof O as O[key] extends string ? key : never]: O[key]
}

interface OmitNonStringsKind extends Kind {
	f(x: cast<this[_], Record<string, unknown>>): OmitNonStrings<typeof x>
}
