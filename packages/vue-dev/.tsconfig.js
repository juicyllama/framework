module.exports = {
	"compilerOptions": {
		"target": "esnext",
		"types": ["node", "vite/client", "vitest/globals"],
		"module": "esnext",
		"moduleResolution": "node",
		"strict": true,
		"skipLibCheck": true,
		"jsx": "preserve",
		"sourceMap": true,
		"resolveJsonModule": true,
		"esModuleInterop": true,
		"allowSyntheticDefaultImports": true,
		"forceConsistentCasingInFileNames": true,
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