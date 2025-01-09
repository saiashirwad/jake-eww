export type Contravariant<A> = (_: A) => void
export type Covariant<A> = (_: never) => A
export type Invariant<A> = (_: A) => A

export declare const URI: unique symbol

export interface TypeClass<F extends TypeLambda> {
	readonly [URI]?: F
}

export interface TypeLambda {
	readonly In: unknown
	readonly Out2: unknown
	readonly Out1: unknown
	readonly Target: unknown
}

export type Kind<
	F extends TypeLambda,
	In,
	Out2,
	Out1,
	Target,
> = F extends {
	readonly type: unknown
}
	? (F & {
			readonly In: In
			readonly Out2: Out2
			readonly Out1: Out1
			readonly Target: Target
		})["type"]
	: {
			readonly F: F
			readonly In: Contravariant<In>
			readonly Out2: Covariant<Out2>
			readonly Out1: Covariant<Out1>
			readonly Target: Invariant<Target>
		}

interface ArrayHKT extends TypeLambda {
	readonly type: Array<this["In"]>
}

type X = Kind<ArrayHKT, number, never, never, never>
type Y = Kind<ArrayHKT, string, never, never, never>
