const { build } = require("esbuild");

async function main() {
    const buildOpt = {
        entryPoints: ["./main.js"],
        bundle: true,
        platform: "browser",
        outfile: "./index.js",
        logLevel: "error",
        tsconfig: "./tsconfig.json",
    };
    await build(buildOpt);
}

main();
