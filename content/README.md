# 스토리 이벤트 콘텐츠

게임의 스토리(멀티스텝) 이벤트 원본이 있는 폴더다. 게임은 이 JSON 을 직접 읽지 않는다:
`node tools/events.mjs build` 가 검증한 뒤 `js/story-content.js` 를 만들고, 게임은 그 파일만 쓴다.
(게임은 실행할 때도 한 번 더 검증해서, 잘못된 이벤트는 빼고 나머지로 정상 동작한다.)

```
content/
├─ events/<category>/<id>.json   ← 게임에 들어가는 이벤트 (커밋한다)
├─ inbox/                        ← LLM 결과를 넣는 곳 (import 후 inbox/done/ 으로 옮겨진다)
└─ rejected/                     ← import 에서 거절된 이벤트 + 이유(.errors.txt)
```

## 역할 나누기

- **LLM = 작가**: 제목, 상황, 선택지, 판정 상황, 성공 / 부분성공 / 실패 이야기, 결말, 후속 조건을 JSON 으로 쓴다.
- **게임 엔진 = 규칙**: 성공률 계산, 판정, 효과 적용, 저장, 일정 배정. 이벤트 데이터는 엔진 규칙을 바꿀 수 없다.
- **검증기(`js/story-schema.js`) = 관문**: 허용된 키, 멤버, 스탯, 태그, 조건, 효과, 수치 범위만 통과시킨다.

## 이벤트를 늘리는 순서

```bash
# 1) 지금 분포 확인 (어떤 구조가 많이 / 적게 쓰였는지)
node tools/events.mjs stats

# 2-a) 프롬프트만 만들어 LLM 에 직접 붙여 넣기
node tools/events.mjs prompt music 5            # → tools/out/prompt.md
#      LLM 이 준 JSON 배열을 content/inbox/아무이름.json 으로 저장

# 2-b) 또는 API 로 바로 생성 (선택: cd tools && npm install, 인증은 ANTHROPIC_API_KEY 또는 `ant auth login`)
node tools/events.mjs generate music 5          # → content/inbox/gen_music_....json

# 3) 검증 + 중복 / 유사도 검사 + build
node tools/events.mjs import                    # 통과분만 content/events/ 로, 나머지는 content/rejected/

# 4) 보상 밸런스 확인 (기존 이벤트 대비 튀는 것 표시)
node tools/events.mjs balance

# 5) 전체 테스트 후 커밋
node tests/run-all.mjs
```

- 한 번에 5~8개씩 카테고리를 바꿔 가며 요청하면 품질과 다양성 관리가 쉽다.
- 프롬프트는 매번 **덜 쓰인 conflict × resolution 조합**과 **이미 있는 이벤트 목록**을 넣어 비슷한 이벤트가 반복되지 않게 한다.
- `import` 는 기존 이벤트와 구조(theme + conflict + resolution + setting)가 같거나 문장이 55% 이상 겹치면 거절한다. 의도한 변형이면 `--allow-similar`.
- 거절 이유(`content/rejected/*.errors.txt`)를 LLM 에게 그대로 보여 주고 고쳐 달라고 하면 대부분 한 번에 통과한다.

## 형식 요약

자세한 형식과 허용 값은 `js/story-schema.js` 상단 주석, 또는 `node tools/events.mjs prompt <category>` 결과에 모두 들어 있다.

| 노드 | 역할 |
|---|---|
| `story` | 이야기 장면 (계속 버튼) |
| `choice` | 선택지 1~4개, 각 선택지가 다른 노드로 이어진다 (조건 없는 선택지 1개 이상) |
| `check` | 스탯 판정 → `success` / `partial` / `fail` (+ 선택 `great`) 결과 이야기 |
| `branch` | HP / 관계도 / 스탯 / 플래그에 따라 자동 분기 (화면에 보이지 않음) |
| `end` | 결말 (`success` / `partial` / `fail` / `neutral`) + 효과 |

후속 이벤트는 `flags` / `memberFlags` 효과 + `requiredFlags` / `memberFlags` / `afterEventId` / `storyResult` 조건으로 잇는다.
(예: `st_game_fps_cup` 에서 탈락하면 그 멤버에게만 3일 뒤 `st_game_fps_rematch` 가 열린다)
