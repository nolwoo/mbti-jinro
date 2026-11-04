/* 직업 배치 점검
 *  규칙 1) 모든 직업은 최소 2개 유형에 등장한다
 *          ("이 유형이니까 이 직업" 결정론을 막는 장치)
 *  규칙 2) 6개 흥미영역에 직업이 고르게 들어간다 (영역당 7~8개)
 *  실행: node check_jobs.js
 */
const fs = require("fs");
const vm = require("vm");
const src = fs.readFileSync(__dirname + "/index.html", "utf8");
const grab = (name, open, close) => {
  const m = src.match(new RegExp("var " + name + " = (\\" + open + "[\\s\\S]*?\\n\\" + close + ";)"));
  if (!m) { console.error(name + " 를 찾지 못했습니다."); process.exit(1); }
  return m[1];
};
// index.html에서 잘라낸 객체 리터럴을 eval 대신 별도 컨텍스트에서 평가한다
// (이 스크립트의 변수·require가 보이지 않고, 1초 넘게 걸리면 중단).
// 단, Node 문서대로 vm은 보안 경계가 아니다 — 남이 고친 index.html을 검증 없이 돌리지 말 것.
const literal = (code) => vm.runInNewContext("(" + code.replace(/;\s*$/, "") + ")", Object.create(null), { timeout: 1000 });
const TYPES = literal(grab("TYPES", "{", "}"));
const JOB_AREA = literal(grab("JOB_AREA", "{", "}"));

const AREA = { R:"실재형", I:"탐구형", A:"예술형", S:"사회형", E:"진취형", C:"관습형" };
const areaOf = {};
Object.keys(JOB_AREA).forEach(a => JOB_AREA[a].forEach(j => { areaOf[j] = a; }));

const types = Object.keys(TYPES);
const count = {}, untagged = [];
types.forEach(t => (TYPES[t].jobs || []).forEach(j => {
  (count[j] = count[j] || []).push(t);
  if (!areaOf[j]) untagged.push(j + " (" + t + ")");
}));

const jobs = Object.keys(areaOf);
const lonely = jobs.filter(j => (count[j] || []).length < 2);
const unused = jobs.filter(j => !count[j]);
const sizes = Object.keys(AREA).map(a => JOB_AREA[a].length);
const spread = Math.max(...sizes) - Math.min(...sizes);

console.log(`작성된 유형: ${types.length} / 16`);
console.log(`직업 종류: ${jobs.length}개\n`);
console.log("흥미영역별 직업 수");
Object.keys(AREA).forEach(a => {
  const n = JOB_AREA[a].length;
  console.log(`  ${AREA[a]}  ${String(n).padStart(2)}개  ${"■".repeat(n)}`);
});
console.log(`  → 최대-최소 편차: ${spread}개`);

const problems = [];
if (untagged.length) problems.push("영역 태그 없는 직업: " + [...new Set(untagged)].join(", "));
if (unused.length)   problems.push("어느 유형에도 안 쓰인 직업: " + unused.join(", "));
if (lonely.length)   problems.push("한 유형에만 있는 직업: " + lonely.map(j => `${j}(${count[j]})`).join(", "));
if (spread > 2)      problems.push(`흥미영역 편차가 ${spread}개로 큼 (2 이하 권장)`);

console.log("");
if (problems.length) { problems.forEach(x => console.log("⚠️  " + x)); process.exit(1); }
console.log("✅ 모든 직업이 2개 이상 유형에 등장하고, 흥미영역도 고르게 분포합니다.");
