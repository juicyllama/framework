module.exports = {
	"extends": "../../tsconfig.base.json",
	"compilerOptions": {
		"target": "esnext",
		"types": ["node", "vite/client", "vitest/globals"],
		"module": "esnext",
		"strict": true,
		"jsx": "preserve",
		"resolveJsonModule": true,
		"esModuleInterop": true,
		"useDefineForClassFields": true,
		"lib": ["esnext", "dom",  "dom.iterable"],
		"outDir": "./dist",
		"baseUrl": "./",
		"paths": {
			"@/*": ["src/*"]
		}
	},
	"include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
	"exclude": ["node_modules"]
}