import type { Kind, _, apply, cast, pipe } from "./hkt"

type ParserResult<
	value extends any,
	rest extends string,
> = {
	value: value
	rest: rest
}

type trimWhitespace<t extends string> =
	t extends `${" " | "\n" | "\t"}${infer Rest}`
		? trimWhitespace<Rest>
		: t

export interface whitespace extends Kind {
	f(x: cast<this[_], string>): trimWhitespace<typeof x>
}

type TakeUntilArgs = {
	ch: string
	input: string
}

type _takeUntil<
	input extends string,
	ch extends string,
	acc extends string = "",
> = input extends `${infer head}${infer rest}`
	? head extends ch
		? ParserResult<acc, input>
		: _takeUntil<rest, ch, `${acc}${head}`>
	: never

export interface takeUntil extends Kind {
	f(
		x: cast<this[_], TakeUntilArgs>,
	): _takeUntil<(typeof x)["input"], (typeof x)["ch"]>
}

type takeUntilResult = apply<
	takeUntil,
	{
		ch: "c"
		input: "asdfasc"
	}
>

// type result = apply<whitespace, "  asdfas. hi">

// type ParserState = {
// 	input: string
// 	result: unknown
// }

// export interface Parser extends Kind {
// 	f(x: cast<this[_], ParserState>): ParserState
// }

// type $string<
// 	state extends ParserState,
// 	target extends string,
// 	matchResult extends
// 		string = state["input"] extends `${target}${string}`
// 		? target
// 		: never,
// > = matchResult extends never
// 	? never
// 	: {
// 			input: state["input"]
// 			result: matchResult
// 		}

// interface String_T<S extends string> extends Parser {
// 	f(x: cast<_, ParserState>): $string<typeof x, S>
// }

// export interface String extends Kind {
// 	f(x: cast<this[_], string>): String_T<typeof x>
// }
