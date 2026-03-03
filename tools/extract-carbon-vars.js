const fs = require('fs');
const path = require('path');

const cssPath = path.resolve(__dirname, '../node_modules/@carbon/styles/css/styles.css');
const css = fs.readFileSync(cssPath, 'utf-8');

const varRegex = /(--cds-[\w-]+)\s*:\s*([^;]+);/g;

function extractVars(block) {
    const colorVars = {};
    let match;
    while ((match = varRegex.exec(block))) {
        const [_, name, value] = match;
        if (/#|rgb|hsl|var\(--cds-/.test(value)) {
            colorVars[name] = value.trim();
        }
    }
    return colorVars;
}

function printVars(selector, vars) {
    console.log(`${selector} {`);
    for (const [name, value] of Object.entries(vars)) {
        console.log(`  ${name}: ${value};`);
    }
    console.log('}');
}

// 提取 :root
const rootBlock = css.match(/:root\s*{([\s\S]*?)}/);
if (rootBlock) printVars(':root', extractVars(rootBlock[1]));

// 提取 .cds--white 作为@theme
const whiteBlock = css.match(/\.cds--white\s*{([\s\S]*?)}/);
if (whiteBlock) printVars('.@theme', extractVars(whiteBlock[1]));

// 提取 .cds--g10
const g10Block = css.match(/\.cds--g10\s*{([\s\S]*?)}/);
if (g10Block) printVars('.cds--g10', extractVars(g10Block[1]));

// 提取 .cds--g90
// const g90Block = css.match(/\.cds--g90\s*{([\s\S]*?)}/);
// if (g90Block) printVars('.cds--g90', extractVars(g90Block[1]));
const g90Block = css.match(/\.cds--g90\s*{([\s\S]*?)}/);
if (g90Block) printVars('.dark', extractVars(g90Block[1]));

// 提取 .cds--g100
const g100Block = css.match(/\.cds--g100\s*{([\s\S]*?)}/);
if (g100Block) printVars('.cds--g100', extractVars(g100Block[1]));