export type Fn = (...x: never[]) => unknown

export declare const _: unique symbol
export type _ = typeof _

export declare abstract class Kind<F extends Fn = Fn> {
	abstract readonly [_]: unknown
	f: F
	a: this[_]
}

export type Input<F extends Kind> = F extends {
	f: (x: infer X) => any
}
	? X
	: unknown

export type pipe<T extends Kind[], X> = T extends [
	infer Head extends Kind,
	...infer Tail extends Kind[],
]
	? X extends never
		? never
		: pipe<Tail, apply<Head, cast<X, Input<Head>>>>
	: X

export type cast<T, U> = T extends U ? T : U

export type apply<
	F extends Kind,
	X extends Input<F>,
> = ReturnType<
	(F & {
		[_]: X
	})["f"]
>
