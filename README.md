# mbti-jinro — 나를 알아보는 성격유형 탐험

스무 고개 형식의 문항에 답하며 성격 유형과 흥미 영역을 찾아보는 **진로 수업 활동**입니다.
정식 심리검사가 아니며, 결과는 "나는 이런 사람이구나" 하고 생각해 보는 힌트로 씁니다
(앱 화면과 인쇄용 결과지에도 같은 안내가 있습니다).

## 파일

| 파일 | 내용 |
|---|---|
| `index.html` | 활동 앱 (정적 페이지, 빌드 없음) |
| `worksheet.html` · `worksheet.docx` · `worksheet-example.pdf` | 인쇄용 학습지와 작성 예시 |
| `scripts/build_worksheet_docx.js` | `worksheet.docx` 재생성 스크립트 ([사용법](scripts/README.md)) |
| `check_jobs.js` | 유형별 직업 배치 점검 — 모든 직업이 2개 이상 유형에 나오는지, 흥미영역이 고르게 분포하는지 |

```bash
node check_jobs.js
```

## 라이선스

[MIT](LICENSE)
