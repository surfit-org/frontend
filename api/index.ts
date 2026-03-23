import createClient from 'openapi-fetch';
import type { paths } from '@/types/api'; // 아까 생성한 파일

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL!;

export const client = createClient<paths>({
  baseUrl: BASE_URL,
  // 여기에 나중에 인증 토큰(Header) 등을 공통으로 넣을 수 있습니다.
});
