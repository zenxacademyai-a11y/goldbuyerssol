const fs = require('fs');
let code = fs.readFileSync('src/components/GoldCalculator.tsx', 'utf8');

// Replace the grid container classes to be centered and not have 12 cols
code = code.replace(
  '<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">',
  '<div className="max-w-xl mx-auto w-full">'
);

// Replace the left column class
code = code.replace(
  '<div className="lg:col-span-5 bg-neutral-50 rounded-xl border border-neutral-200 p-6 flex flex-col justify-between shadow-sm min-h-[450px]">',
  '<div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 flex flex-col justify-between shadow-sm min-h-[450px]">'
);

code = code.replace(
  '<div className="lg:col-span-5 bg-neutral-50 rounded-xl border border-neutral-200 p-6 flex flex-col justify-between shadow-sm min-h-[450px] animate-pulse">',
  '<div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 flex flex-col justify-between shadow-sm min-h-[450px] animate-pulse">'
);

// We want to delete everything from {/* Outputs & Breakdown Section (lg:col-span-7) */} to the end of the outputs block
const outputsStart = '              {/* Outputs & Breakdown Section (lg:col-span-7) */}';
const outputsEnd = '              </div>\n            </>\n          )}';

if (code.includes(outputsStart) && code.includes(outputsEnd)) {
  const parts = code.split(outputsStart);
  const part2 = parts[1].split(outputsEnd);
  code = parts[0] + '\n            </>\n          )}' + part2.slice(1).join(outputsEnd);
}

// Remove the skeleton outputs section
const skeletonStart = '              {/* Outputs Section Skeleton (lg:col-span-7) */}';
const skeletonEnd = '                </div>\n              </div>\n            </>\n          ) : (';

if (code.includes(skeletonStart) && code.includes(skeletonEnd)) {
  const parts = code.split(skeletonStart);
  const part2 = parts[1].split(skeletonEnd);
  code = parts[0] + '\n            </>\n          ) : (' + part2.slice(1).join(skeletonEnd);
}

fs.writeFileSync('src/components/GoldCalculator.tsx', code);
console.log('Fixed calculator layout');
