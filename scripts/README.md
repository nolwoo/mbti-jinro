# worksheet.docx 재생성

`worksheet.docx`는 `docx`(npm) 라이브러리로 만든 스크립트 산출물입니다.
문항이나 문구를 바꾸려면 이 스크립트를 고치고 다시 빌드하세요 — 반대로
worksheet.docx를 Word에서 직접 고쳐도 됩니다(더 쉬움). 이 스크립트는
"틀을 다시 뽑고 싶을 때"만 필요합니다.

```bash
cd scripts
npm install docx   # 최초 1회
node build_worksheet_docx.js
```

폰트는 "Apple SD Gothic Neo"로 고정돼 있습니다(맥 표준 폰트, 미설치
걱정 없음). Windows에서 열어도 자동으로 맑은 고딕 등으로 대체되어
보입니다.
