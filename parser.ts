import type { Kind, _, apply, cast, pipe } from "./hkt"

type ParserState = {
	input: string
	result: unknown
}

export interface Parser extends Kind {
	f(x: cast<this[_], ParserState>): ParserState
}

type $string<
	state extends ParserState,
	target extends string,
	matchResult extends
		string = state["input"] extends `${target}${string}`
		? target
		: never,
> = matchResult extends never
	? never
	: {
			input: state["input"]
			result: matchResult
		}

interface String_T<S extends string> extends Parser {
	f(x: cast<_, ParserState>): $string<typeof x, S>
}

export interface String extends Kind {
	f(x: cast<this[_], string>): String_T<typeof x>
}

export interface Run extends Kind {
	f(x: cast<this[_], Parser>): _
}
