# JobNest - 청년 일자리 기반 주거 공간 플랫폼

## 🚀 프로젝트 소개
**JobNest**는 청년들의 **이직과 주거 문제를 동시에 해결**하는 플랫폼입니다. 
사용자는 일자리와 연계된 주거 공간을 탐색하고, 공인중개사는 매물을 효과적으로 관리할 수 있습니다.

## 🎯 주요 기능
### 🔹 공인중개사용 플랫폼
- **회원 관리**: 가입, 로그인(Google OAuth 지원)
- **매물 검색**: 필터링(가격, 위치, 편의시설 등)을 통한 맞춤 검색
- **매물 등록 및 관리**: Handsontable을 활용한 엑셀 스타일 UI 지원
- **지도 기능**: KakaoMap API를 사용한 매물 위치 확인
- **등기/대장 열람**: 법적 정보 확인 기능 추가 예정

## 🛠 기술 스택
- **Frontend**: `React`, `TypeScript`, `Vite`, `Tailwind CSS`
- **Backend**: `AWS`, `MySQL`, `postgresql`
- **API**: `Google Calendar API`, `KakaoMap API`
- **Deployment**: `Vercel`

## 🎬 데모 및 스크린샷
🚀 **[JobNest 배포 사이트](https://job-nest-iota.vercel.app)**

*(여기에 스크린샷이나 GIF 추가)*

## 🏗 프로젝트 구조
```plaintext
/src
  ├── assets       # 이미지, 아이콘
  ├── components       # 재사용 가능한 UI 컴포넌트
  ├── redux       # 상태 관리
  ├── types       # 유틸리티 함수
  ├── views      # 페이지 단위 컴포넌트
```

## 🔧 설치 및 실행 방법
```bash
# 레포지토리 클론
git clone [https://github.com/JIWOO/jobnest.git](https://github.com/jiwoopark727/job-nest.git)
cd jobnest

# 패키지 설치
npm install

# 환경 변수 설정 (.env 파일 생성 후 환경 변수 추가)
(생략...)

# 개발 서버 실행
npm run dev
```

## 📜 라이선스
본 프로젝트는 **MIT 라이선스**를 따릅니다.

