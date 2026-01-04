# 모바일 청첩장 Starter (정적 Export + Google Drive/Sheets)

## 빠른 시작
npm i
npm run dev

## 정적 빌드
npm run build   # out/ 폴더 배포

## 슬러그 규칙
- /w/[slug] → public/registry/[slug].json 필요
- 데모 링크: /w/demo-2026-06-14

## 이미지(구글 드라이브)
- 링크 공개(보기) 권한
- FILE_ID를 coverId, imageIds에 입력

## 방명록(Apps Script)
- 시트 Guestbook 헤더: created_at | name | message | password_hash | status
- 웹앱 URL을 gasGuestbookUrl에 입력
- 기본 PENDING → APPROVED만 노출
