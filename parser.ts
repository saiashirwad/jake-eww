import type { Kind, $1, apply, cast, pipe } from "./hkt"

type ParserState = {
	input: string
	result: unknown
}

export interface parser extends Kind {
	f(x: cast<this[$1], ParserState>): ParserState
}
