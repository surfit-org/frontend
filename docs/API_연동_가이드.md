# API 연동 가이드

우리 프로젝트의 **타입 안전 API 연동** 방식 가이드입니다.
백엔드 Swagger 문서를 기반으로 TypeScript 타입이 자동 생성되며, 잘못된 API 호출은 빌드 전에 감지됩니다.

---

### 핵심 개념

```
백엔드 Swagger (localhost:8080/v3/api-docs)
        ↓  npm run gen:api
types/api.ts          ← 자동 생성된 타입
        ↓
api/index.ts          ← openapi-fetch 클라이언트
        ↓
features/xxx/services/  ← API 호출 함수
        ↓
features/xxx/hooks/     ← TanStack Query로 캐싱
        ↓
app/(tabs)/xxx.tsx      ← 화면에서 사용
```

---

### 타입 자동 생성

백엔드 서버가 실행 중인 상태에서 아래 명령어를 실행합니다.

```bash
npm run gen:api
```

`types/api.ts` 파일이 자동으로 갱신됩니다. **백엔드 API가 추가되거나 변경될 때마다 실행**해주세요.

---

### API 클라이언트 구조 (`api/index.ts`)

```ts
import createClient from 'openapi-fetch';
import type { paths } from '@/types/api';

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const client = createClient<paths>({ baseUrl: BASE_URL });
```

`client`를 통해 모든 API 호출이 이루어집니다. 잘못된 경로나 파라미터는 TypeScript가 빌드 시점에 잡아줍니다.

---

### API 호출 패턴

#### GET 요청

```ts
// features/surf/services/surf.service.ts
import { client } from '@/api';

export async function getSurfSpots() {
  const { data, error } = await client.GET('/surf/spots');
  if (error) throw new Error('서핑 스팟 조회 실패');
  return data;
}
```

#### POST 요청

```ts
// features/auth/services/auth.service.ts
import { client } from '@/api';

export async function login(body: { email: string; password: string }) {
  const { data, error } = await client.POST('/auth/login', { body });
  if (error) throw new Error('로그인 실패');
  return data;
}
```

---

### TanStack Query 연동

#### 조회 (useQuery)

```ts
// features/surf/hooks/use-surf-spots.ts
import { useQuery } from '@tanstack/react-query';
import { getSurfSpots } from '../services/surf.service';

export function useSurfSpots() {
  return useQuery({
    queryKey: ['surf', 'spots'],
    queryFn: getSurfSpots,
  });
}
```

#### 변경 (useMutation)

```ts
// features/auth/hooks/use-login.ts
import { useMutation } from '@tanstack/react-query';
import { login } from '../services/auth.service';

export function useLogin() {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // 토큰 저장 등 후처리
    },
  });
}
```

#### 화면에서 사용

```tsx
// app/(tabs)/surf.tsx
import { useSurfSpots } from '@/features/surf/hooks/use-surf-spots';

export default function SurfScreen() {
  const { data, isLoading, isError } = useSurfSpots();

  if (isLoading) return <LoadingView />;
  if (isError) return <ErrorView />;

  return <SurfSpotList spots={data} />;
}
```

---

### 인증 헤더 추가

로그인 후 토큰이 필요한 API는 `stores/auth.store.ts`에서 토큰을 가져와 헤더에 추가합니다.

```ts
import { useAuthStore } from '@/stores/auth.store';

const token = useAuthStore.getState().token;

const { data, error } = await client.GET('/my/profile', {
  headers: { Authorization: `Bearer ${token}` },
});
```

---
