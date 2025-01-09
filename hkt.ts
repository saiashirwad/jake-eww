export type Fn = (...x: never[]) => unknown

export declare const ARG1: unique symbol
export type ARG1 = typeof ARG1

export declare abstract class Kind<F extends Fn = Fn> {
	abstract readonly [ARG1]: unknown
	f: F
}

export type Input<F extends Kind> = F extends { f: (x: infer X) => any }
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

export type apply<F extends Kind, X extends Input<F>> = ReturnType<
	(F & {
		readonly [ARG1]: X
	})["f"]
>
