export type merge<O> = {
	[K in keyof O]: O[K]
} & {}

type Type = "number" | "string"

type concatStrings<
	arr extends any[],
	acc extends string = "",
> = arr extends []
	? acc
	: arr extends [infer x extends string]
		? concatStrings<[], `${acc}${x}`>
		: arr extends [
					infer x extends string,
					...infer xs extends string[],
				]
			? concatStrings<xs, `${acc}${x}`>
			: never

type getValue<
	type extends Type,
	value extends string | number,
> = type extends "number"
	? value extends `${infer value extends number}`
		? value
		: never
	: value

type trimWhitespace<T extends string> =
	T extends `${" " | "\n" | "\t"}${infer Rest}`
		? trimWhitespace<Rest>
		: T extends `${infer Rest}${" " | "\n" | "\t"}`
			? trimWhitespace<Rest>
			: T

type parseTag<
	str extends string,
	tag extends string,
> = trimWhitespace<str> extends `<${tag}>${infer content}</${tag}>${infer rest}`
	? [
			trimWhitespace<content>,
			trimWhitespace<rest>,
		]
	: never

type parseLet<str extends string> = parseTag<
	str,
	"let"
> extends [
	infer content extends string,
	infer rest extends string,
]
	? parseTag<content, "name"> extends [
			infer name extends string,
			infer nameRest extends string,
		]
		? parseTag<nameRest, "type"> extends [
				infer type extends Type,
				infer typeRest extends string,
			]
			? parseTag<typeRest, "value"> extends [
					infer value extends string,
					infer _,
				]
				? [[name, type, value], rest]
				: never
			: never
		: never
	: never

type parseFnCall<str extends string> = parseTag<
	str,
	"call"
> extends [
	infer content extends string,
	infer rest extends string,
]
	? parseTag<content, "fn"> extends [
			infer fnName extends string,
			infer fnRest extends string,
		]
		? parseFnCallArgs<fnRest> extends infer args extends
				string[]
			? [[fnName, args], rest]
			: never
		: never
	: never

type parseFnCallArgs<
	str extends string,
	acc extends string[] = [],
> = str extends ""
	? acc
	: parseTag<str, "arg"> extends [
				infer content extends string,
				infer rest extends string,
			]
		? parseFnCallArgs<rest, [...acc, content]>
		: never

type FnParams = {
	args: any[]
	ctx: Record<string, string>
	fnCtx: Record<string, string>
}

type parseFnArgsList<
	str extends string,
	acc extends Record<string, Type> = {},
> = str extends ""
	? merge<acc>
	: parseTag<str, "arg"> extends [
				infer content extends string,
				infer argRest extends string,
			]
		? parseTag<content, "name"> extends [
				infer name extends string,
				infer nameRest extends string,
			]
			? parseTag<nameRest, "type"> extends [
					infer type extends Type,
					infer _,
				]
				? parseFnArgsList<
						argRest,
						acc & {
							[_ in name]: type
						}
					>
				: _
			: _
		: _

type parseFnBody<str extends string> = parseTag<
	str,
	"body"
>

export type Fn<str extends string> = parseTag<
	str,
	"fn"
> extends [
	infer content extends string,
	infer rest extends string,
]
	? parseTag<content, "name"> extends [
			infer name extends string,
			infer nameRest extends string,
		]
		? parseTag<nameRest, "args"> extends [
				infer argsText extends string,
				infer argsRest extends string,
			]
			? parseFnArgsList<argsText> extends infer args extends
					Record<string, Type>
				? parseFnBody<argsRest> extends [
						infer body extends string,
						infer _,
					]
					? { name: name; args: args; body: body }
					: never
				: never
			: never
		: never
	: never

type runBody<
	str extends string,
	ctx extends Record<
		string,
		string | number
	> = {},
	buffer extends string = "",
> = trimWhitespace<str> extends ""
	? merge<ctx>
	: parseLet<str> extends [
				[
					infer name extends string,
					infer type extends Type,
					infer value extends string,
				],
				infer rest extends string,
			]
		? runBody<
				rest,
				ctx & {
					[K in name]: getValue<type, value>
				},
				buffer
			>
		: never

type eval<str extends string> = parseTag<
	str,
	"program"
> extends [infer content extends string, infer _]
	? runBody<content>
	: never

type fnResult = Fn<`
  <fn>
    <name>test</name>
    <args>
      <arg>
        <name>a</name>
        <type>string</type>
      </arg>
      <arg>
        <name>b</name>
        <type>number</type>
      </arg>
    </args>
    <body>
      <return>
        test
      </return>
    </body>
  </fn>
`>

type result = eval<`
  <program>
    <let>
      <name>something</name>
      <type>string</type>
      <value>what</value>
    </let>
    <let>
      <name>bar</name>
      <type>string</type>
      <value>what</value>
    </let>
    <let>
      <name>foo</name>
      <type>number</type>
      <value>55</value>
    </let>
  </program>
`>

type _ = result
