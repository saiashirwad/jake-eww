// https://www.typescriptlang.org/play/?#code/MYewdgzgLgBAJgQygmBeGBvAUASAJZQCmAthAFwwDaGMYCxhFARKADZ5gAWCwA1hExgBfALoAaXADMQICjQBGCAE4UoSgK6FhEnAHNCsOIUIAHQkoAUASky4cSg+qVh4SBLiFZPWAPQ+YCOpQIKDEJqwGhBABsIQ8nDDQpligkLAgQWgw+lAWiMhiMEwEJBAAdAAMZXQMTFa+-jBNAHoA-FhYkupgwFB44NkGADyp0DAgMIQAHkRgcNEg8gBWhL2FJkgJ07PziWocugB8Frj5CBQgOhtQnADKahSp0krEQ9echdBKBzAAZDAANwQ7HyhAACpshpcYO9DocsFYKDkITcoetNodbDgIrBkEochQEGAAJ5ZM64Uawd5Zd73JRlCDhAgWJhlOq4ADunDwERgFneZQiYF0NxseJyWXFBkoAog3MkuSsAEIRLgHFAnC4pVAvB0fAAqfUwACyeGIeGA0RuWgcEHUrHSkhgAHllqsoGVeIRiRALGV-TZ9T4sFBiWYYF7ic7JFDMahcBNtoQ5tEHAg4OBWKTurwwCAOWBKCIYO0cDgwOpiPJzJMZsndiBKEwhSLOExi6WywADAAkGArVfMQi7djIOEjICdE3+vf7lerSmHuDH2DLOEovBgHAj3sn4xEFE3SZTe2+wpLEbsOEPtZ20QHC4vs94S7XFDAhAB5jsQg3u6nqohmGWisCArBZJG0ZDNQ5yngchTyHINSMDAADk3KoUIQiFAATIUACshQAMwiPCQHhjkADS3pohGca4EedYnhOU4Xo2vCqteEa3vW0Szhwkg1i4x67A+Nb-Cx4zDmxlBgJx76ft+5FaMikLQtSInRF8Bz0TgGlMbs-FgIJSgwJwcRwEIZR9gJNbIDy0mtIMUAopwQxUTR0LmemhyFPZrDwteegGNRxK0bCHShuGQIgkg4JqeiNw8Se2nCusDiSHgUzJbsqW6FkTBMLp+l3jARkmWZFlWTZxl2QgDldiWdjeXAOXRJBMYgJinY4DFeCgq57khZ5hQtb5MD+YUs4mBlWVCH2LVWV2gVBV2oVoQtVWoVu94gLAfWtdIrCgRyPyoX2M2EJlUxCKhI5cSVvE7lGnXdWVF2zTdF2bK+chXn4MCZXMiTqJI11RBN3CwByGSsK1xAIF6kNaBAhC6AwYD7cC-VXhuW4uB1sYHtxmnvRg7zzRgeWOWTl3XZTL6NQpX5KD+f4vUTkXATATwgC8QxQAhCCo3GE1tTAiioxesAUJLhBYEAA

const data = {
	items: [{ name: "colinhacks" }],
	foo: { bar: true },
	get deeper() {
		return data
	},
}

// autocompletes at each step
const out = get(data, "items.0")
//    ^?

function get<const o extends object, path extends string>(
	data: o,
	pathStr: conform<path, string & validatePath<o, path>>,
): getPath<o, path> {
	let target: any = data
	const path = pathStr.split(".")
	while (path.length) target = target[path.shift()!]
	return target
}

/** Mimics the result of Object.keys(...) */
type keyOf<o> = o extends readonly unknown[]
	? number extends o["length"]
		? `${number}`
		: keyof o & `${number}`
	: {
			[k in keyof o]: k extends string ? k : k extends number ? `${k}` : never
		}[keyof o]

type lol = keyOf<[{ a: string; b: { name: "hi" } }, 2, 5, 3]>

type getKey<o, k> = k extends keyof o
	? o[k]
	: k extends `${infer n extends number & keyof o}`
		? o[n]
		: never

type getPath<
	o,
	path extends string,
> = path extends `${infer head}.${infer tail}`
	? getPath<getKey<o, head>, tail>
	: getKey<o, path>

type validatePath<
	o,
	path extends string,
	prefix extends string = "",
> = path extends `${infer head}.${infer tail}`
	? head extends keyOf<o>
		? validatePath<getKey<o, head>, tail, `${prefix}${head}.`>
		: `Key '${head}' is not valid following '${prefix}'`
	: path extends keyOf<o>
		? `${prefix}${path}`
		: {
				// find suffixes that would make the segment valid
				[k in keyOf<o>]: k extends `${path}${string}` ? `${prefix}${k}` : never
			}[keyOf<o>]

type conform<t, base> = t extends base ? t : base
