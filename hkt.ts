// Inspired by https://github.com/poteat/hkt-toolbelt
// and https://code.lol/post/programming/higher-kinded-types/

export type Fn = (...x: never[]) => unknown

export type FnInput<F extends Kind> = F extends { f: (x: infer X) => any }
	? X
	: unknown

export declare const _: unique symbol
export type _ = typeof _

export declare abstract class Kind<F extends Fn = Fn> {
	abstract readonly [_]: unknown
	f: F
}

export type pipe<X, T extends Kind[]> = T extends [
	infer Head extends Kind,
	...infer Tail extends Kind[],
]
	? [X] extends [never]
		? never
		: pipe<apply<Head, cast<X, FnInput<Head>>>, Tail>
	: X

export type cast<T, U> = T extends U ? T : U

export type first<T extends unknown[]> = T extends [] ? never : T[0]

export type apply<F extends Kind, X extends FnInput<F>> = ReturnType<
	(F & {
		readonly [_]: X
	})["f"]
>
