import type { Kind, _, apply, cast, pipe } from "./hkt"

type JQNode =
	| FieldAccess<any>
	| ArrayMapping<any>
	| ArrayIndex
	| ObjectConstruction
	| Pipeline
	| Identity

// Represents .foo, .foo.bar
type FieldAccess<
	params extends {
		field: string
		optional?: boolean
		next?: JQNode | null
	},
> = {
	type: "field_access"
	field: params["field"]
	optional: params["optional"] // for .foo?
	next: params["next"] // for chaining
}

// Represents []
type ArrayMapping<params extends { next: null }> = {
	type: "array_mapping"
	next: params["next"]
}

// Represents [0]
type ArrayIndex = {
	type: "array_index"
	index: number
	next?: JQNode
}

// Represents {foo: .bar}
type ObjectConstruction = {
	type: "object"
	properties: {
		key: string
		value: JQNode
	}[]
}

// Represents expr1 | expr2
type Pipeline = {
	type: "pipeline"
	left: JQNode
	right: JQNode
}

// Represents .
type Identity = {
	type: "identity"
}

// .users[].name
//
// {
//   type: "field_access",
//   field: "users",
//   next: {
//     type: "array_mapping",
//     next: {
//       type: "field_access",
//       field: "name"
//     }
//   }
// }

// {userNames: .users[].name}
//
// {
//   type: "object",
//   properties: [{
//     key: "userNames",
//     value: {
//       type: "field_access",
//       field: "users",
//       next: {
//         type: "array_mapping",
//         next: {
//           type: "field_access",
//           field: "name"
//         }
//       }
//     }
//   }]
// }

// .users[] | {id, name}

// {
//   type: "pipeline",
//   left: {
//     type: "field_access",
//     field: "users",
//     next: {
//       type: "array_mapping"
//     }
//   },
//   right: {
//     type: "object",
//     properties: [
//       {
//         key: "id",
//         value: {
//           type: "field_access",
//           field: "id"
//         }
//       },
//       {
//         key: "name",
//         value: {
//           type: "field_access",
//           field: "name"
//         }
//       }
//     ]
//   }
// }

type trimWhitespace<t extends string> =
	t extends `${" " | "\n" | "\t"}${infer Rest}`
		? trimWhitespace<Rest>
		: t

type parser<
	str extends string,
	ctx extends object,
> = trimWhitespace<str> extends "" ? ctx : never

type ParserResult<
	value extends any,
	rest extends string,
> = {
	value: value
	rest: rest
}

type parseArrayMapping<str extends string> =
	trimWhitespace<str> extends `[]${infer rest}`
		? ParserResult<ArrayMapping<{ next: null }>, rest>
		: never

type wordTerminator = "." | " " | "[" | "|" | ","

type parseWord<
	str extends string,
	acc extends string = "",
> = str extends `${infer x}${infer rest}`
	? x extends wordTerminator
		? ParserResult<acc, str>
		: parseWord<rest, `${acc}${x}`>
	: str extends `${infer x}`
		? ParserResult<`${acc}${x}`, "">
		: never

type parseNumber<
	str extends string,
	acc extends string = "",
> = str extends `${infer d extends number}${infer rest}`
	? parseNumber<rest, `${acc}${d}`>
	: ParserResult<acc, str>

type char<
	str extends string,
	ch extends string,
> = str extends `${ch}${infer rest}`
	? ParserResult<ch, rest>
	: never

type parseFieldAccess<str extends string> =
	trimWhitespace<str> extends `.${infer rest}`
		? parseWord<rest> extends ParserResult<
				infer word extends string,
				infer rest
			>
			? ParserResult<
					FieldAccess<{
						field: word
						next: null
						optional: false
					}>,
					rest
				>
			: never
		: never

type lol = char<"{hi there", "{">

// type parseObject<str extends string, acc = {}> =

// type haha = parseNumber<"23ha ha">

// type asdf = " " extends wordTerminator
// 	? true
// 	: false

interface capitalize extends Kind {
	f(x: cast<this[_], Record<string, unknown>>): {
		[key in keyof typeof x as Capitalize<
			key & string
		>]: (typeof x)[key]
	}
}

interface optional extends Kind {
	f(x: cast<this[_], Record<string, unknown>>): {
		[key in keyof typeof x]?: (typeof x)[key]
	}
}

export interface head extends Kind {
	f(
		x: cast<this[_], unknown[]>,
	): typeof x extends [] ? never : (typeof x)[0]
}

type result = pipe<
	[optional, capitalize],
	{ hi: "there"; age: 5 }
>
//   ^?

type result2 = apply<optional, { hi: "there" }>
//   ^?

type result3 = apply<head, [1, 2, 3]>
//   ^?
