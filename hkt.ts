// Inspired by https://github.com/poteat/hkt-toolbelt
// and https://code.lol/post/programming/higher-kinded-types/

export type Fn = (...x: never[]) => unknown

export type FnReturn<T> = T extends (...args: never[]) => infer R ? R : never
export type FnInput<F extends Kind> = F extends { f: (x: infer X) => any }
	? X
	: unknown

export declare const _: unique symbol
export type _ = typeof _

export declare abstract class Kind<F extends Fn = Fn> {
	abstract readonly [_]: unknown
	f: F
}

export type pipe<T extends Kind[], X> = T extends [
	infer Head extends Kind,
	...infer Tail extends Kind[],
]
	? [X] extends [never]
		? never
		: pipe<Tail, apply<Head, cast<X, FnInput<Head>>>>
	: X

export type cast<T, U> = T extends U ? T : U

export type first<T extends unknown[]> = T extends [] ? never : T[0]

export interface First extends Kind {
	f(x: cast<this[_], unknown[]>): first<typeof x>
}

export type apply<F extends Kind, X extends FnInput<F>> = FnReturn<
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
