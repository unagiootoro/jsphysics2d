const { build } = require("esbuild");

async function main() {
    const buildOpt = {
        entryPoints: ["./test.ts"],
        bundle: true,
        platform: "browser",
        outfile: "./index.js",
        external: ["fs"],
        logLevel: "error",
        tsconfig: "./tsconfig.json"
    };
    build(buildOpt);
}

main();
