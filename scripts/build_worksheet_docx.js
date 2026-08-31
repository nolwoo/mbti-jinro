const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, AlignmentType, HeadingLevel,
} = require("docx");

const FONT = "Noto Sans CJK KR";
const INK = "0A0A0A";
const SUB = "6A6A6A";
const LINE = "CBD5E1";
const WARN = "F59E0B";
const WARN_BG = "FFF6E0";
const WARN_INK = "92400E";
const CARD_BG = "F5F0E0";

const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const cellNoBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function blankCell(text, opts) {
  opts = opts || {};
  return new TableCell({
    width: { size: opts.width || 2000, type: WidthType.DXA },
    borders: cellNoBorders,
    margins: { top: 40, bottom: 40, left: 0, right: 60 },
    children: [new Paragraph({
      children: [new TextRun({ text: text, font: FONT, size: opts.size || 18, color: opts.color || INK, bold: !!opts.bold })],
    })],
  });
}

function checkboxRow(items) {
  // items: [{code,label}, {code,label}]
  const cells = items.map((it) => new TableCell({
    width: { size: 4600, type: WidthType.DXA },
    borders: cellNoBorders,
    margins: { top: 20, bottom: 20, left: 0, right: 100 },
    children: [new Paragraph({
      children: [
        new TextRun({ text: "☐  ", font: FONT, size: 20, color: INK }),
        new TextRun({ text: it.code + "  ", font: FONT, size: 18, bold: true, color: INK }),
        new TextRun({ text: it.label, font: FONT, size: 18, color: "3A3A3A" }),
      ],
    })],
  }));
  return new TableRow({ children: cells });
}

function areaCell(name, desc) {
  return new TableCell({
    width: { size: 3100, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      left: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      right: { style: BorderStyle.SINGLE, size: 4, color: LINE },
    },
    margins: { top: 40, bottom: 40, left: 100, right: 80 },
    children: [new Paragraph({
      children: [
        new TextRun({ text: "☐  ", font: FONT, size: 18, color: INK }),
        new TextRun({ text: name, font: FONT, size: 17, bold: true, color: INK }),
      ],
    }), new Paragraph({
      children: [new TextRun({ text: desc, font: FONT, size: 15, color: SUB })],
    })],
  });
}

function sectionHeading(text) {
  return new Paragraph({
    spacing: { before: 90, after: 40 },
    border: { left: { style: BorderStyle.SINGLE, size: 24, color: INK, space: 6 } },
    indent: { left: 20 },
    children: [new TextRun({ text: text, font: FONT, size: 20, bold: true, color: INK })],
  });
}

function subNote(text) {
  return new Paragraph({
    spacing: { after: 20 },
    children: [new TextRun({ text: text, font: FONT, size: 16, color: SUB })],
  });
}

function blankLine(short) {
  return new Paragraph({
    spacing: { after: 10, line: 200, lineRule: "auto" },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: LINE, space: 4 } },
    children: [new TextRun({ text: " ", font: FONT, size: 18 })],
  });
}

function typeBox() {
  const cell = () => new TableCell({
    width: { size: 900, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 10, color: INK },
      bottom: { style: BorderStyle.SINGLE, size: 10, color: INK },
      left: { style: BorderStyle.SINGLE, size: 10, color: INK },
      right: { style: BorderStyle.SINGLE, size: 10, color: INK },
    },
    margins: { top: 160, bottom: 160, left: 0, right: 0 },
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "", font: FONT })] })],
  });
  return new Table({
    columnWidths: [900, 300, 900, 300, 900, 300, 900],
    rows: [new TableRow({ children: [cell(), spacer(300), cell(), spacer(300), cell(), spacer(300), cell()] })],
  });
}
function spacer(w) {
  return new TableCell({
    width: { size: w, type: WidthType.DXA }, borders: cellNoBorders,
    children: [new Paragraph({ children: [] })],
  });
}

function boxParagraphs(lines, opts) {
  return lines.map((t, i) => new Paragraph({
    spacing: { after: i === lines.length - 1 ? 0 : 40 },
    children: [new TextRun({ text: t, font: FONT, size: opts.size || 17, color: opts.color, bold: opts.bold && i === 0 })],
  }));
}

const doc = new Document({
  sections: [{
    properties: {
      page: { margin: { top: 160, bottom: 120, left: 560, right: 560 } },
    },
    children: [

      // ── 헤더 ──
      new Table({
        columnWidths: [5200, 4800],
        rows: [new TableRow({
          children: [
            new TableCell({
              width: { size: 5200, type: WidthType.DXA }, borders: cellNoBorders,
              children: [
                new Paragraph({ children: [new TextRun({ text: "내 성격유형 결과 옮겨적기", font: FONT, size: 32, bold: true, color: INK })] }),
                new Paragraph({ spacing: { before: 60 }, children: [new TextRun({ text: "태블릿 화면에 나온 내 결과를 보고, 아래 빈칸을 손으로 채워보세요.", font: FONT, size: 16, color: SUB })] }),
              ],
            }),
            new TableCell({
              width: { size: 4800, type: WidthType.DXA }, borders: cellNoBorders,
              verticalAlign: "bottom",
              children: [
                new Table({
                  columnWidths: [500, 900, 600, 900, 500, 1400],
                  rows: [new TableRow({ children: [
                    blankCell("반", { width: 500, size: 16, color: SUB }),
                    blankCell("", { width: 900 }),
                    blankCell("번호", { width: 600, size: 16, color: SUB }),
                    blankCell("", { width: 900 }),
                    blankCell("이름", { width: 500, size: 16, color: SUB }),
                    blankCell("", { width: 1400 }),
                  ] })],
                }),
              ],
            }),
          ],
        })],
      }),
      new Paragraph({
        spacing: { before: 120, after: 160 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 16, color: INK, space: 6 } },
        children: [],
      }),

      // ── 안내 박스 ──
      new Table({
        columnWidths: [9400],
        rows: [new TableRow({ children: [
          new TableCell({
            width: { size: 9400, type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, fill: WARN_BG, color: "auto" },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 8, color: WARN },
              bottom: { style: BorderStyle.SINGLE, size: 8, color: WARN },
              left: { style: BorderStyle.SINGLE, size: 8, color: WARN },
              right: { style: BorderStyle.SINGLE, size: 8, color: WARN },
            },
            margins: { top: 70, bottom: 70, left: 140, right: 140 },
            children: [new Paragraph({
              children: [
                new TextRun({ text: "이렇게 채워요.  ", font: FONT, size: 16, bold: true, color: "7C2D12" }),
                new TextRun({ text: "화면에서 굵은 글씨·진한 색으로 강조된 쪽이 “나에게 더 가까운 쪽”이에요. 각 줄에서 나에게 더 가까운 네모에 √ 표시하고, 그 알파벳 네 개를 아래 칸에 옮겨 적으세요.", font: FONT, size: 16, color: WARN_INK }),
              ],
            })],
          }),
        ] })],
      }),

      // ── ① ──
      sectionHeading("① 나의 네 가지 방향"),
      new Table({
        columnWidths: [4600, 4600],
        rows: [
          checkboxRow([{ code: "E", label: "밖으로 힘을 얻는다" }, { code: "I", label: "안에서 힘을 얻는다" }]),
          checkboxRow([{ code: "S", label: "눈에 보이는 걸 믿는다" }, { code: "N", label: "떠오르는 걸 믿는다" }]),
          checkboxRow([{ code: "T", label: "이유를 따져본다" }, { code: "F", label: "마음을 살핀다" }]),
          checkboxRow([{ code: "J", label: "계획하고 정리한다" }, { code: "P", label: "자유롭게 맞춰간다" }]),
        ],
      }),
      new Paragraph({
        spacing: { before: 100, after: 80 },
        children: [new TextRun({ text: "나의 유형 (√ 한 알파벳 네 개를 순서대로)", font: FONT, size: 16, color: SUB })],
      }),
      typeBox(),

      // ── ② ──
      sectionHeading("② 내 별명과 잘하는 것"),
      subNote("화면에 나온 별명을 옮겨 적고, 잘하는 것 세 가지도 그대로 적어보세요."),
      blankLine(), blankLine(), blankLine(), blankLine(),

      // ── ③ ──
      sectionHeading("③ 내가 흥미를 느끼는 영역 (화면에 나온 세 가지에 √)"),
      new Table({
        columnWidths: [3100, 3100, 3100],
        rows: [
          new TableRow({ children: [
            areaCell("실재형", "손으로 만들고 움직이는"),
            areaCell("탐구형", "파고들어 알아내는"),
            areaCell("예술형", "상상하고 표현하는"),
          ] }),
          new TableRow({ children: [
            areaCell("사회형", "사람을 돕고 어울리는"),
            areaCell("진취형", "이끌고 설득하는"),
            areaCell("관습형", "정리하고 꼼꼼하게 하는"),
          ] }),
        ],
      }),

      // ── ④⑤ 두 칸 ──
      new Table({
        columnWidths: [4700, 4700],
        rows: [new TableRow({ children: [
          new TableCell({
            width: { size: 4700, type: WidthType.DXA }, borders: cellNoBorders,
            margins: { right: 200, top: 160 },
            children: [
              sectionHeading("④ 관심 가는 직업"),
              ...twoLineBox("화면에 나온 직업들 중, 제일 궁금한 것 두세 가지만 적어보세요."),
            ],
          }),
          new TableCell({
            width: { size: 4700, type: WidthType.DXA }, borders: cellNoBorders,
            margins: { left: 100, top: 160 },
            children: [
              sectionHeading("⑤ 이번 주에 해볼 것"),
              ...twoLineBox("화면에 나온 것 중에서, 이번 주에 진짜로 해볼 한 가지를 골라 적어보세요."),
            ],
          }),
        ] })],
      }),

      // ── ⑥ ──
      sectionHeading("⑥ 더 생각해보기"),
      subNote("위에서 찾은 직업 중 제일 궁금한 것을 하나 골라, 더 알고 싶은 것 세 가지를 적어보세요."),
      blankLine(), blankLine(), blankLine(),

      // ── ⑦ ──
      sectionHeading("⑦ 활동을 마치고"),
      subNote("오늘 활동을 하고 나서 느낀 점이나, 더 알아보고 싶은 내용을 자유롭게 적어보세요."),
      blankLine(), blankLine(), blankLine(),

      // ── 마무리 박스 ──
      new Table({
        columnWidths: [9400],
        rows: [new TableRow({ children: [
          new TableCell({
            width: { size: 9400, type: WidthType.DXA },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 8, color: INK },
              bottom: { style: BorderStyle.SINGLE, size: 8, color: INK },
              left: { style: BorderStyle.SINGLE, size: 8, color: INK },
              right: { style: BorderStyle.SINGLE, size: 8, color: INK },
            },
            margins: { top: 70, bottom: 70, left: 160, right: 160 },
            children: [new Paragraph({
              children: [
                new TextRun({ text: "기억해요.  ", font: FONT, size: 16, bold: true, color: INK }),
                new TextRun({ text: "성격은 자라면서 얼마든지 바뀌고, 한 사람에게 어울리는 일은 하나가 아니에요. 오늘 적은 건 정식 심리검사 결과가 아니라, 나를 알아가는 첫 걸음이에요.", font: FONT, size: 16, color: "3A3A3A" }),
              ],
            })],
          }),
        ] })],
      }),
    ],
  }],
});

function twoLineBox(note) {
  return [
    new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: note, font: FONT, size: 15, color: SUB })] }),
    blankLine(), blankLine(),
  ];
}

const path = require("path");
Packer.toBuffer(doc).then((buf) => {
  const out = path.join(__dirname, "..", "worksheet.docx");
  fs.writeFileSync(out, buf);
  console.log("written:", out);
});
