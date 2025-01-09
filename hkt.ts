// Copied verbatim from https://github.com/poteat/hkt-toolbelt

export namespace Function {
	export type Function = (
		...x: never[]
	) => unknown

	export type _$returnType<T> = T extends (
		...args: never[]
	) => infer R
		? R
		: never
}

export namespace Kind {
	export declare const _: unique symbol
	export type _ = typeof _

	export declare abstract class Kind<
		F extends Function = Function,
	> {
		abstract readonly [_]: unknown
		f: F
	}

	export type _$inputOf<F extends Kind.Kind> =
		F extends {
			f: (x: infer X) => any
		}
			? X
			: unknown

	export type _$reify<K extends Kind.Kind> = K & {
		<X extends Kind._$inputOf<K>>(
			x: Type._$infer<X>,
		): $<K, X> extends infer Result
			? Result extends Kind.Kind
				? _$reify<Result>
				: $<K, X>
			: never
	}

	export type _$pipe<
		T extends Kind.Kind[],
		X,
	> = T extends [
		infer Head extends Kind.Kind,
		...infer Tail extends Kind.Kind[],
	]
		? [X] extends [never]
			? never
			: _$pipe<
					Tail,
					$<
						Head,
						Type._$cast<X, Kind._$inputOf<Head>>
					>
				>
		: X
}

export namespace Type {
	export type _$cast<T, U> = [T] extends [U]
		? T
		: U
	type _$inferred =
		| string
		| number
		| boolean
		| undefined
		| null
		| Function.Function
		| Kind.Kind
		| _$inferredTuple
		| {
				[key: string]: _$inferred
		  }

	type _$inferredTuple =
		| _$inferred[]
		| ReadonlyArray<_$inferred>

	export type _$infer<
		X,
		Narrow =
			| Type._$cast<X, _$inferred>
			| [...Type._$cast<X, _$inferredTuple>],
	> = Narrow extends unknown[]
		? { [key in keyof X]: _$infer<X[key]> }
		: Narrow
}

export namespace List {
	export type _$first<T extends unknown[]> =
		T extends [] ? never : T[0]

	export interface First extends Kind.Kind {
		f(
			x: Type._$cast<this[Kind._], unknown[]>,
		): _$first<typeof x>
	}

	export const first = ((x: unknown[]) =>
		x[0]) as Kind._$reify<First>
}

export type $<
	F extends Kind.Kind,
	X extends Kind._$inputOf<F>,
> = Function._$returnType<
	(F & {
		readonly [Kind._]: X
	})["f"]
>

export type $$<
	FX extends Kind.Kind[],
	X extends FX extends []
		? unknown
		: Kind._$inputOf<List._$first<FX>>,
> = Kind._$pipe<FX, X>

type OmitNonStrings<
	O extends Record<string, unknown>,
> = {
	[key in keyof O as O[key] extends string
		? key
		: never]: O[key]
}

interface OmitNonStringsKind extends Kind.Kind {
	f(
		x: Type._$cast<
			this[Kind._],
			Record<string, unknown>
		>,
	): OmitNonStrings<typeof x>
}
