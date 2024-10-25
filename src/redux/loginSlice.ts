import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 초기 상태 타입 정의
interface AuthState {
  login: boolean;
  userName: string | null;
  userEmail: string | null;
}

// 초기 상태 설정
const initialState: AuthState = {
  login: false,
  userName:
    JSON.parse(localStorage.getItem('userInfo') || '{}')?.userName || null,
  userEmail:
    JSON.parse(localStorage.getItem('userInfo') || '{}')?.userEmail || null,
};

// Slice 생성 (Reducer와 Actions를 함께 관리)
const loginSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ userName: string; userEmail: string }>
    ) => {
      state.login = true; // 로그인 상태로 변경
      state.userName = action.payload.userName;
      state.userEmail = action.payload.userEmail;
    },
    logout: (state) => {
      state.login = false; // 로그아웃 상태로 변경
      state.userName = null;
      state.userEmail = null;
    },
  },
});

// 액션을 export
export const { login, logout } = loginSlice.actions;
export default loginSlice.reducer;
