const { build } = require("esbuild");

async function main() {
    const buildOpt = {
        entryPoints: ["./app.ts"],
        bundle: true,
        platform: "browser",
        outfile: "./index.js",
        logLevel: "error",
        tsconfig: "./tsconfig.json",
    };
    await build(buildOpt);
}

main();
