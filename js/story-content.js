// story-content.js — 자동 생성 파일. 직접 고치지 말 것.
// 원본: content/events/**/*.json → node tools/events.mjs build
// 이벤트 52개
export const STORY_EVENTS = [
  {
    "id": "st_game_aos_league",
    "title": "방송인 AOS 리그",
    "category": "game",
    "description": "파트너와 한 팀으로 AOS 리그에 출전한다. 라인전 → 오브젝트 → 한타로 이어지는 경기.",
    "meta": {
      "theme": "game_tournament",
      "setting": "aos_league",
      "conflict": "big_opportunity",
      "resolution": "teamwork",
      "activity": "moba",
      "tone": "hype"
    },
    "collab": {
      "min": 2,
      "max": 3
    },
    "conditions": {
      "activityCategories": [
        "game"
      ],
      "blockedActivityCategories": [
        "horror"
      ],
      "cooldown": 8
    },
    "weight": 0.8,
    "start": "intro",
    "steps": {
      "intro": {
        "type": "story",
        "text": [
          {
            "when": {
              "partyMinRelationship": 35
            },
            "text": "방송인 AOS 리그에 {member}와 {partners}가 한 팀으로 나섰다. 평소 합이 좋은 사이라 음성 채팅부터 척척 맞는다."
          },
          {
            "text": "방송인 AOS 리그에 {member}와 {partners}가 한 팀으로 나섰다. 아직 서로의 플레이 스타일을 잘 모르는 만큼, 초반 호흡이 관건이다."
          }
        ],
        "next": "lane"
      },
      "lane": {
        "type": "check",
        "text": "라인전 단계. 상대 정글이 쉴 새 없이 {member} 쪽 라인을 노린다.",
        "check": {
          "stat": "Ga",
          "difficulty": 74,
          "traitBonus": {
            "competitive": 5,
            "brain": 5,
            "calm": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "갱킹을 역으로 받아쳐 선취점을 따냈다. 초반 주도권은 우리 팀이다.",
            "effects": {
              "fans": 30
            },
            "next": "objective"
          },
          "success": {
            "text": "몇 번의 위기를 넘기며 라인전을 무난하게 버텼다.",
            "next": "objective"
          },
          "partial": {
            "text": "CS 차이가 조금씩 벌어졌다. 크게 밀리진 않았지만 불안하다.",
            "next": "behind"
          },
          "fail": {
            "text": "킬을 연달아 내줬다. 상대 쪽으로 성장이 크게 기울었다.",
            "next": "behind"
          }
        }
      },
      "objective": {
        "type": "choice",
        "text": "첫 대형 오브젝트가 곧 등장한다. 팀의 선택은?",
        "choices": [
          {
            "text": "시야를 잡고 오브젝트를 먼저 챙긴다",
            "next": "fight"
          },
          {
            "text": "상대 정글을 먼저 끊으러 간다",
            "next": "fight_risky"
          }
        ]
      },
      "behind": {
        "type": "choice",
        "text": "밀리는 흐름. 채팅창에는 걱정과 응원이 섞여 올라온다.",
        "choices": [
          {
            "text": "무리하지 않고 후반을 바라본다",
            "next": "fight_late"
          },
          {
            "text": "과감하게 한타를 열어 흐름을 뒤집는다",
            "next": "fight_risky"
          }
        ]
      },
      "fight": {
        "type": "check",
        "text": "오브젝트 앞에서 양 팀이 맞붙었다. 교전의 시작을 누가 여느냐가 승부를 가른다.",
        "check": {
          "stat": "Ga",
          "difficulty": 74,
          "traitBonus": {
            "competitive": 5,
            "host": 5,
            "brain": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "완벽한 진입이었다. 한타 대승 후 그대로 넥서스까지 밀어붙였다.",
            "next": "end_win"
          },
          "partial": {
            "text": "한타는 이겼지만 마무리가 늦어 장기전 끝에 아깝게 무너졌다.",
            "next": "end_close"
          },
          "fail": {
            "text": "진입 타이밍이 어긋났다. 흐름을 한 번 내주자 되찾지 못했다.",
            "next": "end_lose"
          }
        }
      },
      "fight_risky": {
        "type": "check",
        "text": "상대의 허를 찌르는 과감한 움직임. 성공하면 단숨에 흐름을 가져오고, 실패하면 그대로 끝이다.",
        "check": {
          "stat": "Ga",
          "difficulty": 80,
          "traitBonus": {
            "spontaneous": 10,
            "competitive": 5,
            "highTension": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "아무도 예상하지 못한 한 수였다. 해설진이 '오늘의 플레이'로 이 장면을 뽑았다.",
            "effects": {
              "fans": 50,
              "fame": 1
            },
            "next": "end_win"
          },
          "success": {
            "text": "도박이 통했다. 한타 대승으로 경기를 끝냈다.",
            "next": "end_win"
          },
          "partial": {
            "text": "절반의 성공. 상대 정글은 잡았지만 우리 팀도 둘이 쓰러지며 결국 역전당했다.",
            "next": "end_close"
          },
          "fail": {
            "text": "무리한 진입이었다. 전멸과 함께 경기가 끝났다.",
            "next": "end_lose"
          }
        }
      },
      "fight_late": {
        "type": "check",
        "text": "버티고 또 버텼다. 40분이 넘어가자 성장 차이가 조금씩 줄어든다. 마지막 한타가 온다.",
        "check": {
          "stat": "Ga",
          "difficulty": 78,
          "traitBonus": {
            "calm": 10,
            "brain": 5,
            "diligent": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "끝까지 버틴 보람이 있었다. 후반 한타에서 역전에 성공했다.",
            "next": "end_win"
          },
          "partial": {
            "text": "마지막까지 팽팽했지만 한 끗 차이로 넥서스를 내줬다.",
            "next": "end_close"
          },
          "fail": {
            "text": "버티는 것만으로는 부족했다.",
            "next": "end_lose"
          }
        }
      },
      "end_win": {
        "type": "end",
        "result": "success",
        "text": "승리. 경기가 끝나자 {member}와 {partners}의 음성 채팅이 환호로 뒤덮였다. 팀 합방 클립이 리그 채널 메인에 걸렸다.",
        "effects": {
          "fans": 160,
          "fame": 1,
          "relationship": 3
        }
      },
      "end_close": {
        "type": "end",
        "result": "partial",
        "text": "아쉬운 패배. 하지만 끝까지 포기하지 않은 경기에 '졌지만 잘 싸웠다'는 반응이 쏟아졌다.",
        "effects": {
          "fans": 80,
          "relationship": 3
        }
      },
      "end_lose": {
        "type": "end",
        "result": "fail",
        "text": "완패. 그래도 경기 후 복기 방송에서 서로의 실수를 웃으며 짚어 주는 모습은 꽤 훈훈했다.",
        "effects": {
          "fans": 30,
          "relationship": 1
        }
      }
    }
  },
  {
    "id": "st_game_fps_cup",
    "title": "방송인 FPS 친선 대회",
    "category": "game",
    "description": "5대5 전술 FPS 친선 대회 초대. 준비 방식에 따라 예선 난이도가 달라진다.",
    "meta": {
      "theme": "game_tournament",
      "setting": "online_fps_cup",
      "conflict": "early_disadvantage",
      "resolution": "comeback_win",
      "activity": "fps",
      "tone": "hype"
    },
    "conditions": {
      "activityCategories": [
        "game"
      ],
      "minDay": 3
    },
    "activityWeights": {
      "fps": 3
    },
    "traitWeights": {
      "fps": 2,
      "competitive": 1.5
    },
    "once": true,
    "start": "intro",
    "steps": {
      "intro": {
        "type": "story",
        "text": [
          {
            "when": {
              "maxHp": 59
            },
            "text": "{member}에게 5대5 전술 FPS 친선 대회 초대장이 도착했다. 상위권 팀의 하이라이트는 대회 채널에 걸린다. 다만 요즘 일정이 빡빡했던 탓에 {member}의 얼굴에는 피곤한 기색이 역력하다."
          },
          {
            "text": "{member}에게 5대5 전술 FPS 친선 대회 초대장이 도착했다. 방송인 팀들이 모이는 작은 대회지만, 상위권 팀의 하이라이트는 대회 채널에 걸린다."
          }
        ],
        "next": "prep"
      },
      "prep": {
        "type": "choice",
        "text": "대회까지 남은 시간은 이틀. 어떻게 준비할까?",
        "choices": [
          {
            "text": "밤늦게까지 스크림을 돌린다",
            "story": "연습 경기를 몇 판이고 돌렸다. 손은 확실히 풀렸지만 눈 밑이 무겁다.",
            "effects": {
              "hp": -8,
              "stats": {
                "Ga": 1
              }
            },
            "next": "qual_trained"
          },
          {
            "text": "기본 전략만 맞추고 컨디션을 챙긴다",
            "story": "무리하지 않고 역할과 기본 전략만 정리했다. 대신 실전 감각은 조금 걱정이다.",
            "effects": {
              "hp": -2
            },
            "next": "qual_light"
          },
          {
            "text": "이번 대회는 즐기는 데 의의를 둔다",
            "story": "승패는 내려놓고 참가 신청서만 보냈다. 목표는 우승이 아니라 대회 최고의 리액션이다.",
            "next": "qual_fun"
          }
        ]
      },
      "qual_trained": {
        "type": "check",
        "text": "예선 첫 경기. 상대는 대회 경험이 많은 팀이다. 초반 라운드를 연달아 내주며 점수가 1대 5까지 벌어졌다.",
        "check": {
          "stat": "Ga",
          "difficulty": 72,
          "traitBonus": {
            "fps": 10,
            "competitive": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "연습 때 맞춰 둔 전략을 꺼내 들자 흐름이 뒤집혔다. 연속 라운드를 따내며 예선을 1위로 통과했다.",
            "effects": {
              "fans": 50
            },
            "next": "final"
          },
          "success": {
            "text": "위기가 계속됐지만 막판 세 라운드를 내리 따내며 본선 티켓을 잡았다.",
            "effects": {
              "fans": 20
            },
            "next": "final"
          },
          "partial": {
            "text": "끝내 역전은 못 했지만 마지막까지 따라붙은 경기력이 인정받아 와일드카드로 본선에 올랐다.",
            "effects": {
              "fans": 20
            },
            "next": "underdog"
          },
          "fail": {
            "text": "벌어진 격차를 끝내 좁히지 못했다. 예선 탈락이다.",
            "next": "end_out"
          }
        }
      },
      "qual_light": {
        "type": "check",
        "text": "예선 첫 경기. 연습량이 부족한 게 초반부터 드러났다. 합이 맞지 않아 라운드를 연달아 내준다.",
        "check": {
          "stat": "Ga",
          "difficulty": 80,
          "traitBonus": {
            "fps": 10,
            "competitive": 5,
            "calm": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "컨디션을 아낀 보람이 있었다. 후반 집중력이 살아나며 역전승으로 예선을 통과했다.",
            "effects": {
              "fans": 50
            },
            "next": "final"
          },
          "success": {
            "text": "느리게 발동이 걸렸지만 결국 흐름을 잡았다. 본선 진출이다.",
            "effects": {
              "fans": 20
            },
            "next": "final"
          },
          "partial": {
            "text": "한 끗 차이로 졌지만, 다른 경기 결과 덕분에 와일드카드 자리가 생겼다.",
            "effects": {
              "fans": 10
            },
            "next": "underdog"
          },
          "fail": {
            "text": "끝까지 호흡이 맞지 않았다. 예선에서 대회를 마무리했다.",
            "next": "end_out"
          }
        }
      },
      "qual_fun": {
        "type": "check",
        "text": "승패보다 리액션. {member}는 경기 내내 중계하듯 떠들며 분위기를 끌어올린다.",
        "check": {
          "stat": "Bs",
          "difficulty": 66,
          "traitBonus": {
            "chatter": 10,
            "highTension": 5,
            "spontaneous": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "패배 장면마저 웃음으로 바꿔 버렸다. 대회 공식 채널이 {member}의 리액션을 따로 클립으로 올렸다.",
            "next": "end_fun_good"
          },
          "partial": {
            "text": "경기는 금방 끝났지만 채팅창은 내내 즐거웠다.",
            "next": "end_fun_ok"
          },
          "fail": {
            "text": "경기도 리액션도 조용하게 끝났다.",
            "next": "end_fun_quiet"
          }
        }
      },
      "underdog": {
        "type": "story",
        "text": "와일드카드 팀에게 기대를 거는 사람은 없었다. 그래서 오히려 부담 없이 결승까지 치고 올라갔다.",
        "next": "final"
      },
      "final": {
        "type": "choice",
        "text": "결승 상대는 우승 후보로 꼽히던 팀. 마지막 라운드, 1대1 클러치 상황이 {member}에게 걸렸다.",
        "choices": [
          {
            "text": "과감하게 먼저 치고 들어간다",
            "next": "clutch_aggressive"
          },
          {
            "text": "발소리를 듣고 침착하게 기다린다",
            "next": "clutch_calm"
          }
        ]
      },
      "clutch_aggressive": {
        "type": "check",
        "text": "{member}가 연막 속으로 먼저 뛰어들었다. 상대가 반응하기 전에 끝내야 한다.",
        "check": {
          "stat": "Ga",
          "difficulty": 82,
          "traitBonus": {
            "competitive": 10,
            "fps": 5,
            "spontaneous": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "먼저 본 쪽이 {member}였다. 마지막 한 발이 정확히 들어갔다.",
            "next": "end_win"
          },
          "partial": {
            "text": "한 명은 잡았지만 숨어 있던 마지막 상대에게 당했다.",
            "next": "end_second"
          },
          "fail": {
            "text": "돌진 타이밍이 읽혔다. 상대가 기다리고 있었다.",
            "next": "end_second"
          }
        }
      },
      "clutch_calm": {
        "type": "check",
        "text": "{member}는 숨을 죽이고 소리에 집중했다. 시간은 흐르고, 먼저 움직이는 쪽이 불리하다.",
        "check": {
          "stat": "Ga",
          "difficulty": 76,
          "traitBonus": {
            "calm": 10,
            "brain": 10,
            "fps": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "상대가 먼저 발소리를 냈다. {member}의 조준선 위로 정확히 걸어 들어왔다.",
            "next": "end_win"
          },
          "partial": {
            "text": "위치는 읽었지만 한 끗 차이로 먼저 맞았다.",
            "next": "end_second"
          },
          "fail": {
            "text": "기다리는 사이 폭탄 타이머가 끝났다.",
            "next": "end_second"
          }
        }
      },
      "end_win": {
        "type": "end",
        "result": "success",
        "text": "우승이다. 마지막 한 발이 들어가는 순간 {member}의 환호가 방송을 가득 채웠다. 우승 하이라이트는 하루 만에 대회 채널 최다 조회수를 찍었다.",
        "effects": {
          "fans": 190,
          "fame": 1,
          "money": 90000,
          "flags": {
            "fpsCupWinner": true
          }
        }
      },
      "end_second": {
        "type": "end",
        "result": "partial",
        "text": "아쉽게 준우승. 그래도 결승까지 가는 과정이 클립으로 퍼지며 '다음엔 우승각'이라는 반응이 줄을 이었다.",
        "effects": {
          "fans": 110,
          "fame": 1,
          "money": 40000,
          "memberFlags": {
            "fpsCupRematch": true
          }
        }
      },
      "end_out": {
        "type": "end",
        "result": "fail",
        "text": "대회는 짧게 끝났다. {member}는 방송을 마치며 '다음엔 예선부터 이기고 온다'고 선언했다.",
        "effects": {
          "fans": 20,
          "memberFlags": {
            "fpsCupRematch": true
          }
        }
      },
      "end_fun_good": {
        "type": "end",
        "result": "success",
        "text": "성적은 하위권이었지만 대회 최고의 리액션상을 받았다. 대회 채널 클립 조회수 1위는 결승이 아니라 {member}의 비명 모음이었다.",
        "effects": {
          "fans": 100,
          "fame": 1
        }
      },
      "end_fun_ok": {
        "type": "end",
        "result": "partial",
        "text": "짧지만 즐거운 대회였다. 시청자들은 다음 대회도 나가 달라고 했다.",
        "effects": {
          "fans": 50
        }
      },
      "end_fun_quiet": {
        "type": "end",
        "result": "fail",
        "text": "대회는 조용히 끝났다. 가볍게 나간 만큼 아쉬움도 크지는 않다.",
        "effects": {
          "fans": 10
        }
      }
    }
  },
  {
    "id": "st_game_fps_rematch",
    "title": "복수전 제안",
    "category": "game",
    "description": "FPS 대회에서 아쉽게 물러난 멤버에게 다시 기회가 왔다. (대회 후속 이벤트)",
    "meta": {
      "theme": "game_tournament",
      "setting": "fps_showmatch",
      "conflict": "rivalry",
      "resolution": "clutch_moment",
      "activity": "fps",
      "tone": "tense"
    },
    "conditions": {
      "memberFlags": [
        "fpsCupRematch"
      ],
      "afterEventId": {
        "id": "st_game_fps_cup",
        "minDays": 3
      },
      "blockedActivityCategories": [
        "rest",
        "music"
      ]
    },
    "weight": 2,
    "urgent": true,
    "once": true,
    "start": "intro",
    "steps": {
      "intro": {
        "type": "story",
        "text": "지난 대회에서 {member}를 꺾었던 팀이 방송에서 쇼매치를 제안해 왔다. 채팅창은 벌써 '복수전'이라는 단어로 가득하다.",
        "next": "prep"
      },
      "prep": {
        "type": "choice",
        "text": "이번엔 어떻게 준비할까?",
        "choices": [
          {
            "text": "지난 경기 영상을 보며 상대 습관을 분석한다",
            "story": "상대가 곤란할 때마다 같은 자리로 도망친다는 걸 알아냈다.",
            "effects": {
              "hp": -4
            },
            "next": "match_analyzed"
          },
          {
            "text": "하루 동안 전문 코치에게 코칭을 받는다",
            "story": "코치는 {member}의 에임보다 판단 속도를 먼저 고쳤다.",
            "effects": {
              "money": -50000,
              "stats": {
                "Ga": 1
              }
            },
            "next": "match_coached"
          },
          {
            "text": "준비 없이 그날의 감으로 붙는다",
            "next": "match_raw"
          }
        ]
      },
      "match_analyzed": {
        "type": "check",
        "text": "쇼매치 당일. 스코어는 동률, 마지막 라운드가 시작됐다. 분석해 둔 그 자리로 상대가 움직이기 시작한다.",
        "check": {
          "stat": "Ga",
          "difficulty": 76,
          "traitBonus": {
            "brain": 10,
            "fps": 5,
            "competitive": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "예상한 자리에서 정확히 상대를 잡아냈다. 복수 성공이다.",
            "next": "end_revenge"
          },
          "partial": {
            "text": "읽기는 맞았지만 한 발이 빗나갔다. 연장까지 간 끝에 비겼다.",
            "next": "end_draw"
          },
          "fail": {
            "text": "상대도 지난 경기를 분석해 왔다. 습관을 바꾼 상대에게 허를 찔렸다.",
            "next": "end_lost"
          }
        }
      },
      "match_coached": {
        "type": "check",
        "text": "쇼매치 당일. 코칭받은 대로 한 박자 빠르게 판단하려 애쓴다. 마지막 라운드가 {member}의 손에 걸렸다.",
        "check": {
          "stat": "Ga",
          "difficulty": 72,
          "traitBonus": {
            "diligent": 10,
            "fps": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "지난 대회와는 완전히 다른 움직임이었다. 상대 해설진마저 감탄했다.",
            "effects": {
              "fans": 40
            },
            "next": "end_revenge"
          },
          "success": {
            "text": "배운 대로 움직였고, 결과가 따라왔다. 복수 성공이다.",
            "next": "end_revenge"
          },
          "partial": {
            "text": "아직 몸에 덜 익은 판단이 한 번 흔들렸다. 아슬아슬하게 비겼다.",
            "next": "end_draw"
          },
          "fail": {
            "text": "새로 배운 것과 원래 습관이 부딪혔다. 이번에도 상대가 한 수 위였다.",
            "next": "end_lost"
          }
        }
      },
      "match_raw": {
        "type": "check",
        "text": "쇼매치 당일. 준비는 없지만 기세는 있다. {member}가 첫 라운드부터 몸을 던진다.",
        "check": {
          "stat": "Ga",
          "difficulty": 84,
          "traitBonus": {
            "spontaneous": 10,
            "highTension": 5,
            "competitive": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "기세가 계산을 이겼다. 상대가 당황하는 사이 경기가 끝났다.",
            "next": "end_revenge"
          },
          "partial": {
            "text": "기세로 절반은 가져왔지만 나머지 절반은 상대의 준비가 이겼다.",
            "next": "end_draw"
          },
          "fail": {
            "text": "준비한 팀과 준비하지 않은 팀의 차이는 분명했다.",
            "next": "end_lost"
          }
        }
      },
      "end_revenge": {
        "type": "end",
        "result": "success",
        "text": "복수전 승리. 경기 후 두 팀은 서로 다음 대회에서 다시 보자며 웃었다. 이 쇼매치는 이번 달 가장 많이 돌려 본 영상이 됐다.",
        "effects": {
          "fans": 160,
          "fame": 1,
          "memberFlags": {
            "fpsCupRematch": false
          }
        }
      },
      "end_draw": {
        "type": "end",
        "result": "partial",
        "text": "무승부. 결판을 내지 못한 게 오히려 다음 경기에 대한 기대를 키웠다.",
        "effects": {
          "fans": 80,
          "fame": 1,
          "memberFlags": {
            "fpsCupRematch": false
          }
        }
      },
      "end_lost": {
        "type": "end",
        "result": "fail",
        "text": "또 졌다. 그래도 {member}는 '세 번째는 무조건 이긴다'며 끝까지 웃었고, 시청자들은 그 모습에 박수를 보냈다.",
        "effects": {
          "fans": 40,
          "memberFlags": {
            "fpsCupRematch": false
          }
        }
      }
    }
  },
  {
    "id": "st_game_offer_estimate",
    "title": "대회 참가 견적서",
    "category": "game",
    "group": "game_tournament_offer",
    "description": "게임 대회 참가 제안(event_002) 변형 B. 주인공의 컨디션과 실력에 따라 첫 장면이 갈리고, 견적서를 앞에 두고 고른 길마다 다른 판정과 결말이 이어진다.",
    "meta": {
      "theme": "game_tournament",
      "setting": "tournament_cost_meeting",
      "conflict": "budget_limit",
      "resolution": "graceful_loss",
      "activity": "online_tournament",
      "tone": "emotional"
    },
    "conditions": {
      "blockedActivityCategories": [
        "music",
        "rest"
      ]
    },
    "activityWeights": {
      "game": 3
    },
    "weight": 1,
    "start": "condition",
    "steps": {
      "condition": {
        "type": "branch",
        "branches": [
          {
            "when": {
              "maxHp": 45
            },
            "next": "tired_intro"
          },
          {
            "when": {
              "minStat": {
                "Ga": 88
              }
            },
            "next": "ace_intro"
          }
        ],
        "next": "fresh_intro"
      },
      "tired_intro": {
        "type": "story",
        "text": "게임단에서 온라인 대회 참가 제안이 들어왔다. 요즘 일정이 빡빡했던 {member}는 제안서를 받아 들고 잠깐 눈을 감았다. 하고 싶은 마음과 지친 몸이 동시에 대답하는 것 같다.",
        "next": "estimate"
      },
      "ace_intro": {
        "type": "story",
        "text": "게임단에서 온라인 대회 참가 제안이 들어왔다. 제안서에는 \"{member} 님이라면 본선도 충분하다\"는 코치의 메모가 붙어 있다. 기대가 큰 만큼 준비도 만만치 않을 것이다.",
        "next": "estimate"
      },
      "fresh_intro": {
        "type": "story",
        "text": "게임단에서 온라인 대회 참가 제안이 들어왔다. 컨디션이 좋은 {member}는 제안서를 보자마자 눈이 반짝였다. 다만 함께 온 견적서를 펼치자 표정이 조금 굳었다.",
        "next": "estimate"
      },
      "estimate": {
        "type": "choice",
        "text": [
          {
            "when": {
              "memberFlags": [
                "tourneyCoachInvite"
              ]
            },
            "text": "\"지난번 연습 경기 기억하시죠?\" 코치의 메시지와 함께 견적서가 왔다. 참가비, 장비 대여비, 연습 상대 섭외비가 줄줄이 적혀 있다. 잘 풀리면 채널에 큰 자극이 되겠지만, 무리하면 다른 일정이 밀린다."
          },
          {
            "when": {
              "activity": [
                "fps"
              ]
            },
            "text": "견적서에는 FPS 대회 참가비, 장비 대여비, 연습 상대 섭외비가 줄줄이 적혀 있다. 잘 풀리면 채널에 큰 자극이 되겠지만, 무리하면 다른 일정이 밀린다."
          },
          {
            "when": {
              "activity": [
                "fighting"
              ]
            },
            "text": "견적서에는 격투게임 대회 참가비, 대회용 컨트롤러 대여비, 연습 상대 섭외비가 줄줄이 적혀 있다. 잘 풀리면 채널에 큰 자극이 되겠지만, 무리하면 다른 일정이 밀린다."
          },
          {
            "when": {
              "activity": [
                "rhythm"
              ]
            },
            "text": "견적서에는 리듬게임 대회 참가비, 전용 컨트롤러 대여비, 연습실 대여비가 줄줄이 적혀 있다. 잘 풀리면 채널에 큰 자극이 되겠지만, 무리하면 다른 일정이 밀린다."
          },
          {
            "text": "견적서에는 대회 참가비, 장비 대여비, 연습 상대 섭외비가 줄줄이 적혀 있다. 잘 풀리면 채널에 큰 자극이 되겠지만, 무리하면 다른 일정이 밀린다."
          }
        ],
        "choices": [
          {
            "text": "본선을 노리고 진지하게 준비한다",
            "effects": {
              "money": -120000,
              "hp": -6
            },
            "story": "{member}가 견적서에 서명했다. 다음 날 대진표가 나왔다.",
            "next": "bracket"
          },
          {
            "text": "재미로 가볍게 참가한다",
            "effects": {
              "hp": -3
            },
            "story": "\"성적보다 재밌게!\" {member}가 가장 저렴한 참가 옵션에 체크했다.",
            "next": "fun_check"
          },
          {
            "text": "이번엔 쉬어가고 다음 기회를 노린다",
            "story": "{member}가 견적서를 조용히 접었다. \"이번엔 보는 쪽으로 할게요.\"",
            "next": "pass_story"
          },
          {
            "text": "참가비를 나눌 후원사를 먼저 찾아본다",
            "story": "매니저와 {member}가 함께 후원 제안서를 만들었다. 오늘 안에 두 곳과 통화가 잡혔다.",
            "next": "sponsor_check"
          }
        ]
      },
      "bracket": {
        "type": "story",
        "text": "대진표를 본 {member}가 웃음을 터뜨렸다. 첫 상대가 이번 대회 우승 후보다. 코치가 \"오히려 좋다, 잃을 게 없다\"며 어깨를 두드렸다.",
        "next": "serious_check"
      },
      "serious_check": {
        "type": "check",
        "text": "우승 후보와의 첫 경기. 초반만 버티면 해볼 만하다는 게 코치의 분석이다.",
        "check": {
          "stat": "Ga",
          "difficulty": 80,
          "traitBonus": {
            "competitive": 10,
            "diligent": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "초반을 버틴 {member}가 중반부터 흐름을 가져왔다. 우승 후보를 꺾는 이변이 일어났다.",
            "next": "b_end_upset"
          },
          "partial": {
            "text": "세트 스코어 동점까지 끌고 갔지만 마지막 세트를 내줬다. 상대 팀이 경기 후 먼저 악수를 청했다.",
            "next": "b_end_close"
          },
          "fail": {
            "text": "우승 후보의 벽은 높았다. 완패였지만 {member}는 끝까지 고개를 들고 경기를 마쳤다.",
            "next": "b_end_bow"
          }
        }
      },
      "b_end_upset": {
        "type": "end",
        "text": "\"우승 후보 잡은 스트리머\"라는 제목의 클립이 퍼졌다. 들인 비용 이상의 관심이 채널로 돌아왔다.",
        "effects": {
          "fans": 90,
          "fame": 2,
          "stats": {
            "Ga": 3
          }
        },
        "result": "success"
      },
      "b_end_close": {
        "type": "end",
        "text": "아쉽게 졌지만, 경기 내용은 \"대회 최고의 접전\"으로 꼽혔다. 다만 들인 비용에 비해 손에 남은 건 박수뿐이라는 생각도 들었다.",
        "effects": {
          "fans": 60,
          "fame": 2,
          "stats": {
            "Ga": 2
          }
        },
        "result": "partial"
      },
      "b_end_bow": {
        "type": "end",
        "text": "완패 직후 {member}가 \"많이 배웠다, 다음엔 더 버티겠다\"고 남기자 팬들이 응원 댓글을 줄줄이 달았다. 비용은 아팠지만, 진 경기를 깔끔하게 인정한 모습이 오래 기억됐다.",
        "effects": {
          "fans": 35,
          "fame": 1,
          "stats": {
            "Ga": 2
          },
          "memberFlags": {
            "tourneySeasonRetry": true
          }
        },
        "result": "fail"
      },
      "fun_check": {
        "type": "check",
        "text": "가벼운 마음으로 들어간 예선. 긴장감은 없지만, 대신 즐거운 장면을 만들어야 한다.",
        "check": {
          "stat": "Ga",
          "difficulty": 68,
          "traitBonus": {
            "spontaneous": 10,
            "highTension": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "{member}가 엉뚱한 작전으로 상대를 당황시키며 예선 몇 판을 이겼다.",
            "next": "b_end_fun_clip"
          },
          "partial": {
            "text": "이길 때와 질 때가 반반이었다. 재미있는 장면은 있었지만 하이라이트로 쓰기엔 조금 짧았다.",
            "next": "b_end_fun_mid"
          },
          "fail": {
            "text": "첫 경기에서 바로 탈락했다. {member}가 \"참가에 의의를 둔다\"며 웃었다.",
            "next": "b_end_fun_flop"
          }
        }
      },
      "b_end_fun_clip": {
        "type": "end",
        "text": "\"재미로 나갔다더니 제일 재밌었다\"는 반응이 이어졌다. 짧은 예선이 의외로 채널 분위기를 띄웠다.",
        "effects": {
          "fans": 50,
          "stats": {
            "Ga": 1
          }
        },
        "result": "success"
      },
      "b_end_fun_mid": {
        "type": "end",
        "text": "부담 없이 즐긴 덕에 몸은 가벼웠다. 다만 기억에 남을 만한 장면은 많지 않았다.",
        "effects": {
          "fans": 35,
          "stats": {
            "Ga": 1
          }
        },
        "result": "partial"
      },
      "b_end_fun_flop": {
        "type": "end",
        "text": "첫 경기 탈락 장면은 팬들 사이에서 작은 밈이 됐다. {member}는 다음 대회 때는 연습을 조금 하고 가겠다고 했다.",
        "effects": {
          "fans": 15,
          "stats": {
            "Ga": 1
          }
        },
        "result": "fail"
      },
      "pass_story": {
        "type": "story",
        "text": "대회 날, {member}는 참가 대신 쉬는 시간을 가졌다. 휴대폰에는 대회 중계 알림이 떠 있다.",
        "next": "pass_choice"
      },
      "pass_choice": {
        "type": "choice",
        "text": "중계를 볼지, 아예 잊고 쉴지 정해야 한다.",
        "choices": [
          {
            "text": "대회 중계를 보며 팬 커뮤니티에 감상을 남긴다",
            "story": "{member}가 경기마다 짧은 감상글을 올리며 팬들과 함께 대회를 지켜봤다.",
            "next": "b_end_watch"
          },
          {
            "text": "알림을 끄고 푹 쉰다",
            "story": "{member}가 휴대폰을 뒤집어 놓았다. 오랜만에 아무 일정 없는 시간이다.",
            "next": "b_end_rest"
          }
        ]
      },
      "b_end_watch": {
        "type": "end",
        "text": "경기를 같이 보며 남긴 감상글에 팬들이 반응했다. 대회에 나가지 않은 아쉬움은 조금 덜었지만, 쉬는 시간도 그만큼 줄었다.",
        "effects": {
          "hp": 4,
          "fans": -5,
          "fame": -1
        },
        "result": "partial"
      },
      "b_end_rest": {
        "type": "end",
        "text": "푹 쉬고 나니 머리가 맑아졌다. 대회 소식을 뒤늦게 확인한 {member}는 다음 시즌 일정을 달력에 적어 두었다.",
        "effects": {
          "hp": 8,
          "fans": -25,
          "fame": -1
        },
        "result": "neutral"
      },
      "sponsor_check": {
        "type": "check",
        "text": "후원사 담당자와의 통화. 채널의 장점을 짧고 분명하게 전해야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 74,
          "traitBonus": {
            "host": 10,
            "chatter": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "담당자가 참가비의 절반 이상을 부담하겠다고 했다. 대회 유니폼에 로고 하나만 달면 된다.",
            "next": "b_end_sponsor"
          },
          "partial": {
            "text": "작은 후원사 한 곳이 장비 대여비만 맡아 주기로 했다. 나머지는 직접 내야 한다.",
            "next": "b_end_sponsor_half"
          },
          "fail": {
            "text": "두 곳 모두 \"이번 분기 예산이 끝났다\"고 했다. 대회 신청 마감까지 남은 시간이 없다.",
            "next": "b_end_sponsor_none"
          }
        }
      },
      "b_end_sponsor": {
        "type": "end",
        "text": "후원 덕에 부담을 덜고 대회에 나갔다. 예선을 무난히 통과하며 후원사 로고와 함께 {member}의 이름이 중계에 몇 번 비쳤다.",
        "effects": {
          "money": -40000,
          "fans": 70,
          "fame": 1,
          "stats": {
            "Ga": 2
          },
          "hp": -6
        },
        "result": "success"
      },
      "b_end_sponsor_half": {
        "type": "end",
        "text": "반쪽 후원으로 대회에 나갔다. 성적은 무난했지만, 비용 걱정에 준비 기간을 줄인 게 내내 아쉬웠다.",
        "effects": {
          "money": -80000,
          "fans": 50,
          "stats": {
            "Ga": 2
          },
          "hp": -5
        },
        "result": "partial"
      },
      "b_end_sponsor_none": {
        "type": "end",
        "text": "이번 대회는 결국 접었다. {member}는 후원 제안서를 버리지 않고 \"다음 시즌용\"이라는 이름으로 저장해 두었다. 코치도 다음 시즌엔 일찍 연락하겠다고 답했다.",
        "effects": {
          "fans": 10,
          "hp": -2,
          "memberFlags": {
            "tourneySeasonRetry": true
          }
        },
        "result": "fail"
      }
    }
  },
  {
    "id": "st_game_offer_tryout",
    "title": "대회 제안 전 연습 경기",
    "category": "game",
    "group": "game_tournament_offer",
    "description": "게임 대회 참가 제안(event_002) 변형 A. 게임단과의 연습 경기 판정이 먼저 오고, 그 결과에 따라 코치의 제안과 본선 도전의 난이도가 달라진다.",
    "meta": {
      "theme": "game_tournament",
      "setting": "pro_team_tryout_scrim",
      "conflict": "early_disadvantage",
      "resolution": "clutch_moment",
      "activity": "online_tournament",
      "tone": "tense"
    },
    "conditions": {
      "blockedActivityCategories": [
        "music",
        "rest"
      ]
    },
    "activityWeights": {
      "game": 3
    },
    "weight": 1,
    "start": "tryout",
    "steps": {
      "tryout": {
        "type": "check",
        "text": [
          {
            "when": {
              "memberFlags": [
                "tourneySeasonRetry"
              ]
            },
            "text": "지난번 후원사를 못 구해 대회를 접었던 {member}에게 게임단이 다시 연락해 왔다. 이번에는 제안서보다 연습 경기가 먼저다. 상대는 게임단 2군. 시작하자마자 {member} 쪽이 밀리기 시작했다."
          },
          {
            "when": {
              "activity": [
                "fps"
              ]
            },
            "text": "{member}에게 게임단에서 FPS 온라인 대회 참가 제안이 들어왔다. 조건은 하나, 먼저 게임단 2군과 연습 경기를 한 판 해 보자는 것. 첫 라운드부터 상대의 합이 맞아 {member} 쪽이 내리 점수를 내줬다."
          },
          {
            "when": {
              "activity": [
                "fighting"
              ]
            },
            "text": "{member}에게 게임단에서 격투게임 온라인 대회 참가 제안이 들어왔다. 조건은 하나, 먼저 게임단 소속 선수와 연습 대전을 해 보자는 것. 첫 두 판을 내리 내주며 {member}가 크게 밀렸다."
          },
          {
            "when": {
              "activity": [
                "rhythm"
              ]
            },
            "text": "{member}에게 게임단에서 리듬게임 온라인 대회 참가 제안이 들어왔다. 조건은 하나, 먼저 게임단 선수와 같은 곡으로 점수 대결을 해 보자는 것. 첫 곡부터 점수 차이가 크게 벌어졌다."
          },
          {
            "text": "{member}에게 게임단에서 온라인 게임 대회 참가 제안이 들어왔다. 조건은 하나, 먼저 게임단 2군과 연습 경기를 해 보자는 것. 시작하자마자 상대의 합이 맞아 {member} 쪽이 크게 밀렸다."
          }
        ],
        "check": {
          "stat": "Ga",
          "difficulty": 74,
          "traitBonus": {
            "competitive": 10,
            "brain": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "마지막 고비에서 {member}의 집중력이 터졌다. 벌어졌던 점수를 끝내 뒤집자, 지켜보던 코치가 \"본선도 노려볼 만하다\"고 말했다.",
            "next": "offer_hot"
          },
          "partial": {
            "text": "끝까지 따라붙었지만 한 끗 차이로 졌다. 코치는 가능성은 봤다면서도, 본선을 노리려면 준비가 꽤 필요하다고 했다.",
            "next": "offer_mid"
          },
          "fail": {
            "text": "초반 열세를 끝내 뒤집지 못했다. 코치는 정중하게 \"재미로 나와도 환영\"이라고 말했다.",
            "next": "offer_low"
          }
        }
      },
      "offer_hot": {
        "type": "choice",
        "text": "코치가 대회 일정표를 내밀었다. 준비에 시간과 비용이 꽤 들지만, 지금 감이라면 채널에 큰 자극이 될 수 있다. 무리하면 다른 일정이 밀린다는 점도 생각해야 한다.",
        "choices": [
          {
            "text": "본선을 노리고 진지하게 준비한다",
            "effects": {
              "money": -120000,
              "hp": -6
            },
            "story": "게임단 연습실에서 일주일 집중 훈련이 잡혔다. 첫날부터 코치가 {member}의 습관을 하나하나 짚어 줬다.",
            "next": "hot_final"
          },
          {
            "text": "재미로 가볍게 참가한다",
            "effects": {
              "hp": -3
            },
            "story": "\"좋은 감 잡았을 때 즐기고 올게요.\" {member}가 가벼운 마음으로 참가 신청서를 냈다.",
            "next": "hot_end_fun"
          },
          {
            "text": "이번엔 쉬어가고 다음 기회를 노린다",
            "story": "\"지금은 다른 일정이 많아서요.\" 코치는 아쉬워하면서도 다음 시즌에 꼭 다시 연락하겠다고 했다.",
            "next": "hot_end_pass"
          }
        ]
      },
      "hot_final": {
        "type": "check",
        "text": "본선 진출이 걸린 마지막 예선 경기. 상대는 연습 경기 때보다 훨씬 단단하다.",
        "check": {
          "stat": "Ga",
          "difficulty": 80,
          "traitBonus": {
            "competitive": 10,
            "diligent": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "팽팽하던 마지막 순간, {member}가 결정적인 한 수를 꽂았다. 본선 진출이 확정되자 응원하던 팬들의 메시지가 쏟아졌다.",
            "next": "hot_end_final"
          },
          "partial": {
            "text": "본선 문턱에서 아깝게 멈췄다. 그래도 예선 마지막 경기는 대회 하이라이트에 실렸다.",
            "next": "hot_end_semi"
          },
          "fail": {
            "text": "긴장한 탓인지 초반 실수가 계속 이어졌다. 예선 탈락. 대기실에서 {member}가 한참 리플레이를 돌려 봤다.",
            "next": "hot_end_out"
          }
        }
      },
      "hot_end_final": {
        "type": "end",
        "text": "본선 무대에 선 {member}의 이름이 대회 중계 화면에 떴다. 연습 경기의 역전극까지 함께 회자되며 채널이 활기를 띠었다.",
        "effects": {
          "fans": 90,
          "fame": 2,
          "stats": {
            "Ga": 3
          }
        },
        "result": "success"
      },
      "hot_end_semi": {
        "type": "end",
        "text": "본선은 놓쳤지만 실력이 늘었다는 건 모두가 알았다. 다만 집중 훈련에 쓴 시간만큼 다른 일정이 줄줄이 밀렸다.",
        "effects": {
          "fans": 60,
          "fame": 2,
          "stats": {
            "Ga": 2
          }
        },
        "result": "partial"
      },
      "hot_end_out": {
        "type": "end",
        "text": "탈락 후 {member}는 \"다음 시즌엔 연습 경기부터 다시\"라고 짧게 남겼다. 팬들은 리플레이를 같이 돌려 보며 응원했고, 코치도 다음 시즌 연락을 약속했다.",
        "effects": {
          "fans": 30,
          "fame": 1,
          "stats": {
            "Ga": 2
          },
          "memberFlags": {
            "tourneyCoachInvite": true
          }
        },
        "result": "fail"
      },
      "hot_end_fun": {
        "type": "end",
        "text": "가볍게 나간 대회에서 {member}는 연습 경기의 감을 그대로 살렸다. 성적보다 즐기는 모습이 더 많이 회자됐다.",
        "effects": {
          "fans": 45,
          "stats": {
            "Ga": 1
          }
        },
        "result": "success"
      },
      "hot_end_pass": {
        "type": "end",
        "text": "몸은 아꼈지만, 좋은 감을 살릴 기회를 넘긴 게 조금 아쉽다. 팬들도 \"다음엔 꼭 나가 줘\"라는 반응이었다.",
        "effects": {
          "hp": 8,
          "fans": -25,
          "fame": -1,
          "memberFlags": {
            "tourneyCoachInvite": true
          }
        },
        "result": "partial"
      },
      "offer_mid": {
        "type": "choice",
        "text": "코치가 일정표를 내밀며 조심스럽게 말했다. \"본선을 노리려면 남은 기간을 다 써야 할 거예요.\" 준비에 시간과 비용이 꽤 든다. 무리하면 다른 일정도 밀린다.",
        "choices": [
          {
            "text": "본선을 노리고 진지하게 준비한다",
            "effects": {
              "money": -120000,
              "hp": -6
            },
            "story": "{member}가 고개를 끄덕였다. 남은 기간 동안 매일 게임단 선수들과 연습 경기를 잡았다.",
            "next": "mid_final"
          },
          {
            "text": "재미로 가볍게 참가한다",
            "effects": {
              "hp": -3
            },
            "story": "\"본선은 다음에. 이번엔 즐기러 갈게요.\" 코치도 웃으며 신청서를 받아 줬다.",
            "next": "mid_end_fun"
          },
          {
            "text": "이번엔 쉬어가고 다음 기회를 노린다",
            "story": "\"지금은 준비할 시간이 부족한 것 같아요.\" 코치는 연습 경기 영상을 보내 주며 다음을 약속했다.",
            "next": "mid_end_pass"
          }
        ]
      },
      "mid_final": {
        "type": "check",
        "text": "준비 기간이 짧았던 만큼 예선 마지막 경기는 버거운 상대다. 그래도 연습 경기 때보다는 손이 훨씬 빨라졌다.",
        "check": {
          "stat": "Ga",
          "difficulty": 84,
          "traitBonus": {
            "competitive": 10,
            "diligent": 10
          }
        },
        "outcomes": {
          "success": {
            "text": "아무도 기대하지 않던 역전승. {member}의 이름이 예선 이변으로 대회 커뮤니티에 올라왔다.",
            "next": "mid_end_cinderella"
          },
          "partial": {
            "text": "두 세트를 따내며 접전을 만들었지만 마지막 세트를 내줬다. 상대 선수가 경기 후 {member}의 플레이를 칭찬했다.",
            "next": "mid_end_respect"
          },
          "fail": {
            "text": "짧은 준비의 한계가 드러났다. 예선 첫 경기 탈락. {member}가 \"준비 기간이 부족했던 건 내 선택\"이라며 담담하게 받아들였다.",
            "next": "mid_end_lesson"
          }
        }
      },
      "mid_end_cinderella": {
        "type": "end",
        "text": "\"연습 경기에서 진 그 사람이 맞냐\"는 반응과 함께 {member}의 채널에 새로운 시청자가 몰렸다.",
        "effects": {
          "fans": 120,
          "fame": 2,
          "stats": {
            "Ga": 3
          }
        },
        "result": "success"
      },
      "mid_end_respect": {
        "type": "end",
        "text": "본선은 놓쳤지만 상대 선수의 칭찬 덕에 경기 영상이 꽤 돌았다. 다만 강행군의 피로는 며칠 갔다.",
        "effects": {
          "fans": 70,
          "fame": 2,
          "stats": {
            "Ga": 2
          },
          "hp": -3
        },
        "result": "partial"
      },
      "mid_end_lesson": {
        "type": "end",
        "text": "탈락 영상 아래에는 \"다음엔 더 길게 준비해서 나와 달라\"는 댓글이 줄을 이었다. {member}는 그 댓글들을 캡처해 연습 메모 맨 위에 붙였다.",
        "effects": {
          "fans": 30,
          "fame": 1,
          "stats": {
            "Ga": 2
          },
          "memberFlags": {
            "tourneyCoachInvite": true
          }
        },
        "result": "fail"
      },
      "mid_end_fun": {
        "type": "end",
        "text": "부담을 내려놓자 오히려 경기가 잘 풀렸다. 예선 몇 판을 이기며 즐거운 장면을 여럿 남겼다.",
        "effects": {
          "fans": 35,
          "stats": {
            "Ga": 1
          }
        },
        "result": "success"
      },
      "mid_end_pass": {
        "type": "end",
        "text": "대회는 다음으로 미뤘다. 아쉬워하는 팬들도 있었지만, 연습 경기 영상이 그 빈자리를 조금 채웠다.",
        "effects": {
          "hp": 8,
          "fans": -25,
          "fame": -1
        },
        "result": "neutral"
      },
      "offer_low": {
        "type": "choice",
        "text": "코치는 본선보다는 즐기는 참가를 권했다. 그래도 결정은 {member}의 몫이다. 준비에는 시간과 비용이 들고, 무리하면 다른 일정이 밀린다.",
        "choices": [
          {
            "text": "본선을 노리고 진지하게 준비한다",
            "effects": {
              "money": -120000,
              "hp": -6
            },
            "story": "\"그래도 본선을 노려 볼래요.\" 코치가 놀란 얼굴로 연습 일정을 다시 짰다.",
            "next": "low_end_underdog"
          },
          {
            "text": "재미로 가볍게 참가한다",
            "effects": {
              "hp": -3
            },
            "story": "\"그럼 재미로 나가 볼게요!\" 부담을 내려놓자 {member}의 표정이 한결 밝아졌다.",
            "next": "low_end_fun"
          },
          {
            "text": "이번엔 쉬어가고 다음 기회를 노린다",
            "story": "\"이번엔 실력부터 쌓을게요.\" {member}가 연습 경기 영상을 저장해 두었다.",
            "next": "low_end_pass"
          }
        ]
      },
      "low_end_underdog": {
        "type": "end",
        "text": "예선 두 번째 경기에서 멈췄지만, 연습 경기 때와는 다른 사람처럼 싸웠다. 비용과 시간은 많이 들었어도 실력만큼은 확실히 늘었다.",
        "effects": {
          "fans": 70,
          "fame": 2,
          "stats": {
            "Ga": 3
          }
        },
        "result": "partial"
      },
      "low_end_fun": {
        "type": "end",
        "text": "\"재미로\" 나간 대회에서 {member}는 엉뚱한 플레이로 하이라이트를 여러 개 만들었다. 코치도 웃으며 박수를 쳤다.",
        "effects": {
          "fans": 45,
          "stats": {
            "Ga": 1
          }
        },
        "result": "success"
      },
      "low_end_pass": {
        "type": "end",
        "text": "대회는 넘겼다. 저장해 둔 연습 경기 영상은 다음 시즌 준비의 첫 자료가 됐다.",
        "effects": {
          "hp": 8,
          "fans": -25,
          "fame": -1,
          "memberFlags": {
            "tourneyCoachInvite": true
          }
        },
        "result": "neutral"
      }
    }
  },
  {
    "id": "st_broadcast_late_chat_read",
    "title": "새벽 채팅의 온도 읽기",
    "category": "broadcast",
    "group": "late_stream",
    "description": "자정을 넘긴 방송(event_001) 변형 B. 먼저 채팅 분위기를 읽는 판정을 하고, 읽어 낸 분위기에 따라 고를 수 있는 마무리와 그 결과가 달라진다.",
    "meta": {
      "theme": "broadcast_live",
      "setting": "after_midnight_chat_read",
      "conflict": "schedule_clash",
      "resolution": "compromise",
      "activity": "late_stream",
      "tone": "calm"
    },
    "timeSlot": "lateNight",
    "conditions": {
      "activityCategories": [
        "broadcast"
      ]
    },
    "weight": 1,
    "start": "read_room",
    "steps": {
      "read_room": {
        "type": "check",
        "text": [
          {
            "when": {
              "memberFlags": [
                "lateStreamRetry"
              ]
            },
            "text": "자정이 넘었다. 지난번 새벽 방송에서 졸다가 클립이 됐던 {member}가 \"오늘은 안 존다\"고 선언하자 채팅창이 \"조금만 더\"로 가득 찼다. 내일 일정도 잡혀 있다. {member}가 잠깐 말을 멈추고 채팅을 천천히 훑는다. 진짜 더 보고 싶은 건지, 의리로 버티는 건지 읽어야 한다."
          },
          {
            "when": {
              "activity": [
                "fps",
                "rhythm",
                "fighting"
              ]
            },
            "text": "자정을 넘긴 {member}의 방송. 판이 끝날 때마다 \"한 판만 더\"가 올라오지만, 내일 일정도 잡혀 있다. {member}가 잠깐 손을 멈추고 채팅창을 천천히 훑는다. 진짜 더 보고 싶은 건지, 의리로 버티는 건지 읽어야 한다."
          },
          {
            "when": {
              "activity": [
                "horror",
                "indie",
                "openWorld"
              ]
            },
            "text": "자정을 넘긴 {member}의 방송. 구간을 넘길 때마다 \"조금만 더 가 보자\"가 올라오지만, 내일 일정도 잡혀 있다. {member}가 잠깐 손을 멈추고 채팅창을 천천히 훑는다. 진짜 더 보고 싶은 건지, 의리로 버티는 건지 읽어야 한다."
          },
          {
            "when": {
              "activity": [
                "sing"
              ]
            },
            "text": "자정을 넘긴 {member}의 방송. 곡이 끝날 때마다 \"한 곡만 더\"가 올라오지만, 내일 일정도 잡혀 있다. {member}가 물을 한 모금 마시며 채팅창을 천천히 훑는다. 진짜 더 듣고 싶은 건지, 의리로 버티는 건지 읽어야 한다."
          },
          {
            "text": "자정을 넘긴 {member}의 방송. 이야기가 끝날 때마다 \"조금만 더\"가 올라오지만, 내일 일정도 잡혀 있다. {member}가 잠깐 말을 멈추고 채팅창을 천천히 훑는다. 진짜 더 보고 싶은 건지, 의리로 버티는 건지 읽어야 한다."
          }
        ],
        "check": {
          "stat": "Bs",
          "difficulty": 72,
          "traitBonus": {
            "chatter": 10,
            "host": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "{member}가 정확히 짚었다. 지금 남은 시청자들은 진심으로 더 보고 싶어 한다. 이제 얼마나 버틸지만 정하면 된다.",
            "next": "hot_choice"
          },
          "partial": {
            "text": "채팅은 반반이다. \"더 해 줘\"만큼 \"이제 자\"도 많다. 어느 쪽을 골라도 누군가는 아쉬워할 것 같다.",
            "next": "split_choice"
          },
          "fail": {
            "text": "{member}가 분위기를 잘못 읽었다. \"다들 쌩쌩하네!\"라고 했지만, 채팅 속도는 눈에 띄게 느려지고 있었다.",
            "next": "cold_choice"
          }
        }
      },
      "hot_choice": {
        "type": "choice",
        "text": "남은 시청자들은 진심이다. {member}가 화면 너머로 손가락 네 개를 펴 보였다. \"선택지는 네 개!\"",
        "choices": [
          {
            "text": "시청자가 원하는 만큼 끝까지 달린다",
            "effects": {
              "hp": -12
            },
            "story": "\"좋아, 오늘은 끝까지 간다!\" 채팅이 한 번 더 폭발했다. 새벽 세 시, 네 시를 넘기며 시청자 수가 오히려 조금씩 늘었다.",
            "next": "hot_push"
          },
          {
            "text": "30분만 더 하고 깔끔하게 마무리한다",
            "effects": {
              "hp": -3
            },
            "story": "\"딱 30분만 더!\" 뜨거운 분위기를 그대로 둔 채, 정리할 시간을 넉넉히 잡았다.",
            "next": "hot_end_tidy"
          },
          {
            "text": "오늘은 여기서 끊고 컨디션을 챙긴다",
            "story": "\"오늘 너무 재밌었는데, 그래서 더 아껴 둘게.\" {member}가 아쉬움을 꾹 누르고 종료 인사를 시작했다.",
            "next": "hot_end_cut"
          },
          {
            "text": "다음 방송을 \"새벽 특집\"으로 예고하고 30분 뒤 끝낸다",
            "effects": {
              "hp": -4
            },
            "story": "{member}가 화면에 \"다음 방송: 새벽 특집\"이라고 크게 띄웠다. 채팅창이 알림 설정 인증으로 바빠졌다.",
            "next": "hot_end_teaser"
          }
        ]
      },
      "hot_push": {
        "type": "check",
        "text": "창밖이 밝아 오기 시작했다. 여기서부터는 체력이 아니라 버티는 힘의 싸움이다.",
        "check": {
          "stat": "Bs",
          "difficulty": 82,
          "traitBonus": {
            "longStream": 15,
            "nightOwl": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "\"해 뜨는 거 같이 보자!\" {member}의 외침에 채팅창이 아침 인사로 가득 찼다.",
            "next": "hot_end_sunrise"
          },
          "partial": {
            "text": "끝까지 버티긴 했다. 하지만 마지막 한 시간은 말수가 눈에 띄게 줄었다.",
            "next": "hot_end_sleepy"
          },
          "fail": {
            "text": "새벽 다섯 시, {member}의 말이 점점 느려지더니 같은 이야기를 두 번 했다. 채팅창이 \"이제 자\"로 도배됐다.",
            "next": "hot_end_crash"
          }
        }
      },
      "hot_end_sunrise": {
        "type": "end",
        "text": "해가 뜰 때 끝난 방송의 마지막 장면은 \"새벽 동지들\"과 나눈 아침 인사였다. 클립이 퍼지며 처음 온 시청자도 늘었다. 대신 {member}는 오늘 밤 회복이 더딜 것이다.",
        "effects": {
          "fans": 150,
          "fame": 1,
          "stats": {
            "Bs": 2
          },
          "flags": {
            "stayedUpLate": true
          }
        },
        "result": "success"
      },
      "hot_end_sleepy": {
        "type": "end",
        "text": "끝까지 달렸다는 사실에 시청자들은 만족했다. 다만 후반부 다시보기는 조용한 시간이 길어서, 편집자가 쓸 장면을 찾느라 애를 먹었다.",
        "effects": {
          "fans": 110,
          "fame": 1,
          "stats": {
            "Bs": 2
          },
          "flags": {
            "stayedUpLate": true
          }
        },
        "result": "partial"
      },
      "hot_end_crash": {
        "type": "end",
        "text": "방송은 \"{member} 재우기 대작전\"이 돼서 끝났다. 팬들은 웃으면서도 걱정 섞인 댓글을 남겼고, {member}는 다음엔 시간을 정해 두겠다고 약속했다.",
        "effects": {
          "fans": 60,
          "stats": {
            "Bs": 1
          },
          "flags": {
            "stayedUpLate": true
          },
          "memberFlags": {
            "latePacingNote": true
          }
        },
        "result": "fail"
      },
      "hot_end_tidy": {
        "type": "end",
        "text": "30분 동안 오늘의 하이라이트를 한 번 더 짚고 깔끔하게 끝냈다. \"뜨거울 때 끝내서 좋았다\"는 채팅이 마지막을 장식했다.",
        "effects": {
          "fans": 50
        },
        "result": "success"
      },
      "hot_end_cut": {
        "type": "end",
        "text": "종료 인사에 \"벌써?\"라는 아쉬움이 쏟아졌다. 몇몇 시청자는 서운해했지만, {member}는 오랜만에 푹 잤다.",
        "effects": {
          "hp": 10,
          "fans": -35
        },
        "result": "partial"
      },
      "hot_end_teaser": {
        "type": "end",
        "text": "예고 하나로 다음 방송 알림 설정이 눈에 띄게 늘었다. 오늘은 짧게 끝냈지만, 다음 새벽은 길어질 것 같다.",
        "effects": {
          "fans": 70,
          "fame": 1,
          "memberFlags": {
            "lateSpecialTeaser": true
          }
        },
        "result": "success"
      },
      "split_choice": {
        "type": "choice",
        "text": "\"더 해 줘\"와 \"이제 자\"가 반반이다. {member}가 어느 쪽 손을 들어 줄지 채팅이 지켜본다.",
        "choices": [
          {
            "text": "시청자가 원하는 만큼 끝까지 달린다",
            "effects": {
              "hp": -12
            },
            "story": "\"더 원하는 사람들 있으니까 간다!\" 자러 가는 시청자들에게 손을 흔들며 방송을 이어 갔다.",
            "next": "split_end_push"
          },
          {
            "text": "30분만 더 하고 깔끔하게 마무리한다",
            "effects": {
              "hp": -3
            },
            "story": "\"양쪽 다 들어 줄게. 30분만!\" 타이머가 화면 구석에 떴다.",
            "next": "split_end_half"
          },
          {
            "text": "오늘은 여기서 끊고 컨디션을 챙긴다",
            "story": "\"자라는 사람들 말 들을게.\" {member}가 웃으며 마지막 인사를 시작했다.",
            "next": "split_end_rest"
          },
          {
            "text": "채팅 투표로 연장 여부를 정한다",
            "effects": {
              "hp": -2
            },
            "story": "{member}가 투표창을 띄웠다. \"연장 vs 취침\", 시청자 손에 맡긴다.",
            "next": "split_vote"
          }
        ]
      },
      "split_end_push": {
        "type": "end",
        "text": "남은 시청자들과는 끈끈한 새벽을 보냈다. 다만 먼저 자러 간 시청자들은 다음 날 \"결국 또 달렸네\"라며 다시보기를 건너뛰었다.",
        "effects": {
          "fans": 110,
          "fame": 1,
          "stats": {
            "Bs": 2
          },
          "flags": {
            "stayedUpLate": true
          }
        },
        "result": "partial"
      },
      "split_end_half": {
        "type": "end",
        "text": "30분 동안 양쪽 시청자 모두에게 인사를 건네고 끝냈다. \"센스 있게 끝냈다\"는 반응이 많았다.",
        "effects": {
          "fans": 45
        },
        "result": "success"
      },
      "split_end_rest": {
        "type": "end",
        "text": "\"자라\" 쪽의 손을 들어 준 덕에 걱정하던 시청자들이 안심했다. 더 보고 싶던 시청자들도 \"내일 꼭 와\"라는 말로 인사를 대신했다.",
        "effects": {
          "hp": 10,
          "fans": -25
        },
        "result": "success"
      },
      "split_vote": {
        "type": "check",
        "text": "투표창 숫자가 엎치락뒤치락한다. 결과를 어떻게 받아들이느냐가 오늘 방송의 마지막 인상을 정한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 66,
          "traitBonus": {
            "chatter": 5,
            "host": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "결과는 근소한 차이로 \"연장\". {member}가 진 쪽 시청자들에게 \"15분만 빌릴게\"라고 사과하며 웃음을 끌어냈다.",
            "next": "split_end_vote_fun"
          },
          "partial": {
            "text": "정확히 동점이 나왔다. 재투표를 두 번이나 하느라 정작 연장한 시간은 얼마 되지 않았다.",
            "next": "split_end_vote_tie"
          },
          "fail": {
            "text": "투표 결과에 불만인 채팅이 이어지며 분위기가 어수선해졌다. {member}가 서둘러 마무리했다.",
            "next": "split_end_vote_mess"
          }
        }
      },
      "split_end_vote_fun": {
        "type": "end",
        "text": "투표로 얻은 15분은 오늘 방송에서 가장 시끌벅적한 시간이 됐다. 진 쪽 시청자들도 \"인정\"이라며 웃었다.",
        "effects": {
          "fans": 80,
          "hp": -3
        },
        "result": "success"
      },
      "split_end_vote_tie": {
        "type": "end",
        "text": "동점 소동 자체는 웃겼지만, 투표에 시간을 다 쓰는 바람에 연장한 보람은 크지 않았다.",
        "effects": {
          "fans": 45,
          "hp": -1
        },
        "result": "partial"
      },
      "split_end_vote_mess": {
        "type": "end",
        "text": "다음 방송 공지에 \"투표 규칙은 미리 정해 두겠다\"는 한 줄이 추가됐다. 몇몇 팬은 그 문장을 보고 웃음을 터뜨렸다.",
        "effects": {
          "fans": 10
        },
        "result": "fail"
      },
      "cold_choice": {
        "type": "choice",
        "text": "착각을 깨달은 {member}가 잠깐 말을 멈췄다. 남은 시청자들이 어떻게 하나 지켜보고 있다.",
        "choices": [
          {
            "text": "시청자가 원하는 만큼 끝까지 달린다",
            "effects": {
              "hp": -12
            },
            "story": "\"그래도 오늘은 끝까지!\" 하지만 시청자 수 그래프는 조용히 내려가고 있었다.",
            "next": "cold_end_empty"
          },
          {
            "text": "30분만 더 하고 깔끔하게 마무리한다",
            "effects": {
              "hp": -3
            },
            "story": "\"30분만 더 하고 진짜 정리할게.\" 마지막 30분을 오늘 재밌었던 장면 되짚기로 채웠다.",
            "next": "cold_end_rescue"
          },
          {
            "text": "오늘은 여기서 끊고 컨디션을 챙긴다",
            "story": "\"아, 다들 졸리구나. 나도 사실 졸려!\" {member}의 솔직한 한마디에 채팅창에 웃음이 번졌다.",
            "next": "cold_end_reset"
          },
          {
            "text": "분위기를 바꾸려고 시청자 사연을 몇 개 읽는다",
            "effects": {
              "hp": -3
            },
            "story": "{member}가 미리 받아 둔 사연함을 열었다. 첫 사연부터 \"저도 지금 졸려요\"였다.",
            "next": "cold_end_letters"
          }
        ]
      },
      "cold_end_empty": {
        "type": "end",
        "text": "끝까지 버텼지만, 마지막엔 손에 꼽을 만큼의 시청자만 남았다. 다음 날 {member}는 \"그땐 내가 분위기를 잘못 읽었다\"고 털어놨고, 팬들은 그 솔직함에 오히려 응원을 보냈다.",
        "effects": {
          "fans": 60,
          "stats": {
            "Bs": 1
          },
          "flags": {
            "stayedUpLate": true
          }
        },
        "result": "fail"
      },
      "cold_end_rescue": {
        "type": "end",
        "text": "되짚기 코너가 의외로 반응이 좋아 시청자 수가 조금 회복됐다. 다만 초반의 어색한 순간은 클립으로 남았다.",
        "effects": {
          "fans": 40
        },
        "result": "partial"
      },
      "cold_end_reset": {
        "type": "end",
        "text": "\"졸리면 자자\"로 끝난 방송은 오히려 훈훈한 마무리로 기억됐다. {member}도 다음 날 개운한 얼굴로 돌아왔다.",
        "effects": {
          "hp": 10,
          "fans": -20
        },
        "result": "success"
      },
      "cold_end_letters": {
        "type": "end",
        "text": "사연 몇 개에 채팅이 다시 따뜻해졌다. 그래도 졸린 시청자들은 하나둘 빠져나갔다.",
        "effects": {
          "fans": 55
        },
        "result": "partial"
      }
    }
  },
  {
    "id": "st_broadcast_late_encore",
    "title": "자정을 넘긴 앵콜 요청",
    "category": "broadcast",
    "group": "late_stream",
    "description": "자정을 넘긴 방송(event_001) 변형 A. 앵콜 요청 앞에서 먼저 방향을 정하고, 방향마다 다른 고비와 판정, 마무리가 이어진다.",
    "meta": {
      "theme": "broadcast_live",
      "setting": "midnight_encore_chat",
      "conflict": "fatigue",
      "resolution": "audience_help",
      "activity": "late_stream",
      "tone": "warm"
    },
    "timeSlot": "lateNight",
    "conditions": {
      "activityCategories": [
        "broadcast"
      ]
    },
    "weight": 1,
    "start": "encore",
    "steps": {
      "encore": {
        "type": "choice",
        "text": [
          {
            "when": {
              "memberFlags": [
                "lateSpecialTeaser"
              ]
            },
            "text": "지난 방송에서 걸어 둔 \"새벽 특집\" 예고 때문인지, 자정이 넘었는데도 시청자 수가 줄지 않는다. 채팅창에는 \"오늘이 그날이지?\"가 줄줄이 올라온다. {member}는 웃으면서도 슬쩍 시계를 봤다. 내일 일정도 잡혀 있다."
          },
          {
            "when": {
              "activity": [
                "fps",
                "rhythm",
                "fighting"
              ]
            },
            "text": "예정된 종료 시간을 한참 넘겼다. 판이 끝날 때마다 채팅창에 \"한 판만 더\"가 줄줄이 올라온다. {member}는 웃으면서도 슬쩍 시계를 봤다. 내일 일정도 잡혀 있지만, 지금 분위기를 끊기는 아깝다."
          },
          {
            "when": {
              "activity": [
                "horror",
                "indie",
                "openWorld"
              ]
            },
            "text": "예정된 종료 시간을 한참 넘겼다. 구간 하나를 넘길 때마다 채팅창에 \"조금만 더 가 보자\"가 줄줄이 올라온다. {member}는 웃으면서도 슬쩍 시계를 봤다. 내일 일정도 잡혀 있지만, 지금 분위기를 끊기는 아깝다."
          },
          {
            "when": {
              "activity": [
                "sing"
              ]
            },
            "text": "예정된 종료 시간을 한참 넘겼다. 곡이 끝날 때마다 채팅창에 \"한 곡만 더\"가 줄줄이 올라온다. {member}는 웃으면서도 슬쩍 시계를 봤다. 내일 일정도 잡혀 있지만, 지금 분위기를 끊기는 아깝다."
          },
          {
            "text": "예정된 종료 시간을 한참 넘겼다. 이야기가 끊길 때마다 채팅창에 \"조금만 더 얘기해 줘\"가 줄줄이 올라온다. {member}는 웃으면서도 슬쩍 시계를 봤다. 내일 일정도 잡혀 있지만, 지금 분위기를 끊기는 아깝다."
          }
        ],
        "choices": [
          {
            "text": "시청자가 원하는 만큼 끝까지 달린다",
            "effects": {
              "hp": -12
            },
            "story": "{member}가 \"그럼 끝까지 간다!\"를 외치자 채팅창이 폭죽 이모티콘으로 뒤덮였다.",
            "next": "run_wall"
          },
          {
            "text": "30분만 더 하고 깔끔하게 마무리한다",
            "effects": {
              "hp": -3
            },
            "story": "\"딱 30분!\" {member}가 화면 구석에 타이머를 띄웠다. 시청자들이 숫자에 맞춰 카운트다운을 치기 시작했다.",
            "next": "timer_twist"
          },
          {
            "text": "오늘은 여기서 끊고 컨디션을 챙긴다",
            "story": "{member}가 아쉬운 얼굴로 손을 모았다. \"오늘은 여기까지! 내일 더 좋은 컨디션으로 올게.\"",
            "next": "cut_reaction"
          }
        ]
      },
      "run_wall": {
        "type": "story",
        "text": [
          {
            "when": {
              "activityCategories": [
                "game"
              ]
            },
            "text": "새벽 두 시가 넘었다. 조작하는 손이 눈에 띄게 굼떠지고 반응이 한 박자씩 늦어진다. 그때 채팅창에 \"같이 버티자\"는 응원이 하나둘 올라오기 시작했다."
          },
          {
            "when": {
              "activity": [
                "sing"
              ]
            },
            "text": "새벽 두 시가 넘었다. 고음에서 목이 살짝 갈라지자 {member}가 멋쩍게 웃었다. 그때 채팅창에 \"같이 버티자\"는 응원이 하나둘 올라오기 시작했다."
          },
          {
            "text": "새벽 두 시가 넘었다. 이야기 사이사이 하품을 참는 게 보이기 시작했다. 그때 채팅창에 \"같이 버티자\"는 응원이 하나둘 올라오기 시작했다."
          }
        ],
        "next": "run_check"
      },
      "run_check": {
        "type": "check",
        "text": "이제부터는 텐션 싸움이다. 지친 티를 웃음으로 바꿀 수 있을지가 남은 방송을 가른다.",
        "check": {
          "stat": "Bs",
          "difficulty": 78,
          "traitBonus": {
            "longStream": 10,
            "highTension": 5,
            "nightOwl": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "응원을 하나하나 읽어 주던 {member}가 갑자기 살아났다. 새벽 방송이 오늘의 하이라이트가 됐다.",
            "effects": {
              "fans": 40,
              "fame": 1
            },
            "next": "run_end_hit"
          },
          "success": {
            "text": "응원에 힘입어 {member}의 텐션이 다시 올라왔다. 해가 뜰 무렵까지 채팅창이 한 번도 식지 않았다.",
            "next": "run_end_hit"
          },
          "partial": {
            "text": "방송은 끝까지 갔지만 중간중간 말이 끊겼다. 시청자들이 그 빈자리를 채팅으로 채우며 함께 버텼다.",
            "next": "run_end_held"
          },
          "fail": {
            "text": "결국 {member}가 화면 앞에서 꾸벅 졸았다. 채팅창은 \"재워라\"와 \"깨워라\"로 반반 갈렸다.",
            "next": "run_end_doze"
          }
        }
      },
      "run_end_hit": {
        "type": "end",
        "text": "해 뜨는 시간에 끝난 방송은 \"새벽 동지\"라는 별명과 함께 클립으로 퍼졌다. {member}는 내일 일정을 위해 바로 잠들었지만, 회복은 더딜 것 같다.",
        "effects": {
          "fans": 150,
          "fame": 1,
          "stats": {
            "Bs": 2
          },
          "flags": {
            "stayedUpLate": true
          }
        },
        "result": "success"
      },
      "run_end_held": {
        "type": "end",
        "text": "끝까지 달렸다는 사실에 시청자들은 만족했다. 다만 후반부 다시보기는 하품 소리가 절반이라 클립으로 쓰기 어려웠다.",
        "effects": {
          "fans": 110,
          "fame": 1,
          "stats": {
            "Bs": 2
          },
          "flags": {
            "stayedUpLate": true
          }
        },
        "result": "partial"
      },
      "run_end_doze": {
        "type": "end",
        "text": "졸다 깬 {member}가 \"자는 거 아니었다\"고 우기는 장면만 남았다. 팬들은 다음엔 일찍 자라는 메시지를 남겼고, {member}는 다음 새벽 방송에서 제대로 버텨 보겠다고 약속했다.",
        "effects": {
          "fans": 50,
          "stats": {
            "Bs": 1
          },
          "flags": {
            "stayedUpLate": true
          },
          "memberFlags": {
            "lateStreamRetry": true
          }
        },
        "result": "fail"
      },
      "timer_twist": {
        "type": "story",
        "text": "타이머가 5분 남았을 때, 오늘 처음 온 시청자의 후원 메시지가 떴다. \"처음 왔는데 벌써 끝나요?\" 채팅창이 술렁인다.",
        "next": "timer_choice"
      },
      "timer_choice": {
        "type": "choice",
        "text": "약속한 30분이 거의 끝났다. 새로 온 시청자를 어떻게 맞이할까?",
        "choices": [
          {
            "text": "남은 5분 동안 오늘 방송의 하이라이트를 짚어 준다",
            "story": "{member}가 \"5분 요약 들어간다!\"며 오늘 있었던 일을 손가락으로 꼽기 시작했다.",
            "next": "wrap_check"
          },
          {
            "text": "약속대로 정확히 30분에 끝낸다",
            "story": "{member}가 새 시청자에게 \"다음 방송 때 처음부터 와 줘!\"라고 인사했다.",
            "next": "timer_end_clean"
          }
        ]
      },
      "wrap_check": {
        "type": "check",
        "text": "남은 5분 안에 오늘 방송의 재미를 한 번에 보여 줘야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 70,
          "traitBonus": {
            "host": 10,
            "chatter": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "{member}가 오늘의 명장면을 3분 만에 다시 짚어 줬다. 새 시청자가 \"다음 방송 알림 켰어요\"라고 남겼다.",
            "next": "timer_end_new"
          },
          "partial": {
            "text": "요약은 조금 길어졌다. 약속한 시간을 10분 넘겼지만, 새 시청자는 끝까지 남아 있었다.",
            "next": "timer_end_over"
          },
          "fail": {
            "text": "설명이 꼬이면서 \"그래서 무슨 방송이었냐\"는 채팅이 올라왔다.",
            "next": "timer_end_muddle"
          }
        }
      },
      "timer_end_new": {
        "type": "end",
        "text": "깔끔한 요약 덕에 처음 온 시청자가 단골이 될 것 같은 예감이 들었다. 약속한 30분도 거의 지켰다.",
        "effects": {
          "fans": 60
        },
        "result": "success"
      },
      "timer_end_over": {
        "type": "end",
        "text": "새 시청자는 붙잡았지만 약속한 시간은 넘겼다. \"30분이라며\"라는 채팅에 {member}가 머쓱하게 웃었다.",
        "effects": {
          "fans": 45,
          "hp": -2
        },
        "result": "partial"
      },
      "timer_end_muddle": {
        "type": "end",
        "text": "꼬인 요약에 {member}가 웃음을 터뜨리며 방송을 마쳤다. 처음 온 시청자는 \"다음엔 처음부터 볼게요\"라는 말을 남겼고, {member}는 다음 방송 첫머리에 제대로 소개하겠다고 약속했다.",
        "effects": {
          "fans": 25
        },
        "result": "fail"
      },
      "timer_end_clean": {
        "type": "end",
        "text": "\"30분 지났다! 진짜 끝!\" 타이머가 0이 되는 순간 방송이 꺼졌다. 처음 온 시청자는 \"깔끔해서 좋다\"며 구독을 눌렀다.",
        "effects": {
          "fans": 45
        },
        "result": "success"
      },
      "cut_reaction": {
        "type": "story",
        "text": "종료 인사를 하던 중, 채팅창에 \"벌써 가?\"와 \"푹 자!\"가 동시에 쏟아진다. 아쉬워하는 시청자도 적지 않다.",
        "next": "cut_choice"
      },
      "cut_choice": {
        "type": "choice",
        "text": "방송을 끄기 전에 마지막으로 무엇을 남길까?",
        "choices": [
          {
            "text": "다음 방송 일정을 공지하고 끈다",
            "story": "{member}가 내일 방송 시간을 고정 메시지로 걸고 몇 분 더 인사를 나눴다.",
            "next": "cut_end_notice"
          },
          {
            "text": "인사만 하고 바로 끈다",
            "story": "\"잘 자!\" 짧은 인사와 함께 화면이 꺼졌다.",
            "next": "cut_end_quiet"
          }
        ]
      },
      "cut_end_notice": {
        "type": "end",
        "text": "아쉬움은 \"내일 그 시간에 봐\"로 바뀌었다. 몇 분 더 머문 만큼 쉬는 시간은 조금 줄었지만, 팬들의 서운함은 금방 풀렸다.",
        "effects": {
          "hp": 8,
          "fans": -20
        },
        "result": "success"
      },
      "cut_end_quiet": {
        "type": "end",
        "text": "{member}는 오랜만에 푹 잤다. 다만 갑작스러운 종료에 서운해한 시청자들이 다음 날 \"어제 왜 이렇게 빨리 갔어\"라고 물었다.",
        "effects": {
          "hp": 10,
          "fans": -35
        },
        "result": "partial"
      }
    }
  },
  {
    "id": "st_broadcast_marathon_board",
    "title": "장시간 방송의 목표 게시판",
    "category": "broadcast",
    "group": "marathon_stream",
    "description": "멈출 수 없는 장시간 방송(event_201) 변형 B. 남은 체력에 따라 첫 장면이 갈리고, 목표 게시판에서 고른 목표마다 판정 위치와 마무리가 다르다.",
    "meta": {
      "theme": "broadcast_live",
      "setting": "longstream_goal_board",
      "conflict": "audience_reaction",
      "resolution": "steady_success",
      "activity": "long_stream",
      "tone": "calm"
    },
    "timeSlot": "lateNight",
    "conditions": {
      "activity": [
        "longStream"
      ],
      "cooldown": 3
    },
    "weight": 2,
    "start": "hp_gate",
    "steps": {
      "hp_gate": {
        "type": "branch",
        "branches": [
          {
            "when": {
              "maxHp": 39
            },
            "next": "worn_intro"
          },
          {
            "when": {
              "anyTraits": [
                "longStream"
              ]
            },
            "next": "veteran_intro"
          }
        ],
        "next": "normal_intro"
      },
      "worn_intro": {
        "type": "story",
        "text": "{member}의 방송이 벌써 여덟 시간째다. 채팅은 여전히 뜨겁고 시청자 수도 늘고 있지만, 목소리가 눈에 띄게 갈라지기 시작했다. 매니저 메시지 창에 \"괜찮아요?\"가 떴다.",
        "next": "board"
      },
      "veteran_intro": {
        "type": "story",
        "text": "{member}의 방송이 벌써 여덟 시간째다. 장시간 방송에 익숙한 {member}에게는 이제 막 몸이 풀린 시간이다. 그래도 목소리에 피로가 조금씩 묻어나기 시작했다.",
        "next": "board"
      },
      "normal_intro": {
        "type": "story",
        "text": "{member}의 방송이 벌써 여덟 시간째다. 채팅은 여전히 뜨겁고 시청자 수는 오히려 늘고 있다. 다만 목소리에 피로가 조금씩 묻어나기 시작했다.",
        "next": "board"
      },
      "board": {
        "type": "choice",
        "text": [
          {
            "when": {
              "memberFlags": [
                "marathonRetry"
              ]
            },
            "text": "화면 한쪽 목표 게시판에 지난번 미뤄 둔 \"최장 기록\"이 아직 적혀 있다. 그 아래로 \"후원 목표\", \"시청자 신청 코너\"가 이어진다. 채팅창이 다음엔 뭘 하냐고 묻고 있다."
          },
          {
            "text": "화면 한쪽 목표 게시판에는 \"최장 기록\", \"후원 목표\", \"시청자 신청 코너\"가 적혀 있다. 채팅창이 다음엔 뭘 하냐고 묻고 있다."
          }
        ],
        "choices": [
          {
            "text": "분위기를 살려 기록 방송으로 밀어붙인다",
            "effects": {
              "hp": -14
            },
            "story": "{member}가 게시판의 \"최장 기록\"에 동그라미를 쳤다. 채팅창이 응원 이모티콘으로 가득 찼다.",
            "next": "record_check"
          },
          {
            "text": "목표 하나만 달성하고 마무리한다",
            "effects": {
              "hp": -6
            },
            "story": "{member}가 \"후원 목표\"를 가리켰다. \"이것만 채우고 끝낼게.\"",
            "next": "goal_story"
          },
          {
            "text": "무리하지 않고 지금 끝낸다",
            "story": "{member}가 게시판을 내리고 종료 화면을 띄웠다. \"오늘은 여기까지!\"",
            "next": "stop_story"
          },
          {
            "text": "시청자 신청 코너로 분위기를 바꿔 한 시간만 더 간다",
            "effects": {
              "hp": -8
            },
            "story": "{member}가 신청 코너를 열자 \"이거 해 줘\", \"저거 해 줘\"가 쏟아졌다.",
            "next": "request_check"
          }
        ]
      },
      "record_check": {
        "type": "check",
        "text": "기록까지 남은 시간은 세 시간. 처음부터 끝까지 텐션을 유지할 수 있을지가 관건이다.",
        "check": {
          "stat": "Bs",
          "difficulty": 80,
          "traitBonus": {
            "longStream": 15,
            "highTension": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "기록 직전, {member}가 \"다 같이 카운트다운!\"을 외쳤다. 시청자 수가 오늘 최고치를 찍었다.",
            "effects": {
              "fans": 110,
              "fame": 1,
              "money": 20000
            },
            "next": "finale_choice"
          },
          "success": {
            "text": "페이스를 지킨 {member}가 기록 시간을 넘겼다. 채팅창이 축하로 뒤덮였다.",
            "next": "finale_choice"
          },
          "partial": {
            "text": "기록은 넘겼지만 마지막 한 시간은 거의 말이 없었다. 그래도 화면 속 시간이 기록을 넘긴 순간 채팅이 다시 살아났다.",
            "next": "record_close"
          },
          "fail": {
            "text": "두 시간을 남기고 목소리가 완전히 잠겼다. 채팅창이 \"그만 쉬어\"로 가득 차자 {member}도 결국 고개를 끄덕였다.",
            "next": "record_fall"
          }
        }
      },
      "finale_choice": {
        "type": "choice",
        "text": "기록을 넘겼다. 마지막 인사를 어떻게 할까?",
        "choices": [
          {
            "text": "함께해 준 시청자 이름을 한 명씩 불러 준다",
            "story": "{member}가 채팅창을 거슬러 올라가며 이름을 하나하나 불렀다.",
            "next": "finale_names"
          },
          {
            "text": "기록 화면을 캡처하고 바로 마무리한다",
            "story": "{member}가 기록 화면을 캡처해 고정하고 짧게 인사했다.",
            "next": "finale_clean"
          }
        ]
      },
      "finale_names": {
        "type": "end",
        "text": "이름을 불린 시청자들이 차례로 감사 인사를 남겼다. 기록보다 그 마지막 30분이 더 오래 회자됐다. 대신 {member}는 거의 아침이 돼서야 잠들었다.",
        "effects": {
          "fans": 170,
          "fame": 1,
          "money": 40000,
          "hp": -2,
          "memberFlags": {
            "stayedUpLate": true
          }
        },
        "result": "success"
      },
      "finale_clean": {
        "type": "end",
        "text": "고정된 기록 화면 아래로 축하 댓글이 줄줄이 달렸다. 깔끔하게 끝냈지만 피로는 그대로 남았다.",
        "effects": {
          "fans": 150,
          "fame": 1,
          "money": 40000,
          "memberFlags": {
            "stayedUpLate": true
          }
        },
        "result": "success"
      },
      "record_close": {
        "type": "end",
        "text": "기록은 넘겼다. 하지만 다시보기의 마지막 한 시간은 조용했고, {member}는 다음 날 목이 쉬어 있었다.",
        "effects": {
          "fans": 90,
          "money": 20000,
          "memberFlags": {
            "stayedUpLate": true
          }
        },
        "result": "partial"
      },
      "record_fall": {
        "type": "end",
        "text": "기록은 다음으로 미뤘다. 쉰 목으로 인사하는 {member}에게 팬들은 \"다음엔 같이 페이스 조절해서 깨자\"고 답했다. {member}는 다음 장시간 방송부터 쉬는 시간을 정해 두기로 했다.",
        "effects": {
          "fans": 40,
          "memberFlags": {
            "stayedUpLate": true,
            "marathonPacing": true
          }
        },
        "result": "fail"
      },
      "goal_story": {
        "type": "story",
        "text": "후원 목표까지 남은 건 30퍼센트. 마침 오래 방송을 본 시청자가 \"목표 채우면 노래 한 소절 해 줘요\"라는 조건을 걸었다.",
        "next": "goal_check"
      },
      "goal_check": {
        "type": "check",
        "text": "남은 체력을 끌어모아 목표까지 분위기를 끌고 가야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 70,
          "traitBonus": {
            "chatter": 5,
            "host": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "게이지가 차오르자 {member}가 약속대로 한 소절을 불렀다. 채팅창이 박수로 가득 찼다.",
            "next": "goal_done"
          },
          "partial": {
            "text": "게이지는 다 찼지만, 시간이 꽤 걸려 마무리 인사가 짧아졌다.",
            "next": "goal_half"
          },
          "fail": {
            "text": "게이지가 좀처럼 오르지 않았다. {member}가 \"다음 방송에서 이어서 채우자\"고 정리했다.",
            "next": "goal_short"
          }
        }
      },
      "goal_done": {
        "type": "end",
        "text": "목표를 채우고 약속까지 지킨 마무리에 \"깔끔한 장방\"이라는 반응이 이어졌다.",
        "effects": {
          "fans": 70,
          "money": 20000
        },
        "result": "success"
      },
      "goal_half": {
        "type": "end",
        "text": "목표는 채웠지만 마무리가 급했다. 몇몇 시청자는 인사를 못 하고 나갔다며 아쉬워했다.",
        "effects": {
          "fans": 50,
          "money": 15000
        },
        "result": "partial"
      },
      "goal_short": {
        "type": "end",
        "text": "목표는 다음 방송으로 넘어갔다. 그래도 \"다음에 같이 채우자\"는 채팅이 많아, 다음 장시간 방송을 기다리는 사람이 늘었다.",
        "effects": {
          "fans": 30,
          "money": 10000
        },
        "result": "fail"
      },
      "stop_story": {
        "type": "story",
        "text": "방송을 끈 뒤, {member}가 남은 채팅 기록을 훑어봤다. \"오늘 딱 좋았다\"와 \"더 보고 싶었다\"가 섞여 있다.",
        "next": "stop_end"
      },
      "stop_end": {
        "type": "end",
        "text": "무리하지 않고 끝낸 덕에 다음 날 컨디션이 가벼웠다. 아쉬워하던 시청자들도 다음 장시간 방송 일정을 묻는 것으로 인사를 대신했다.",
        "effects": {
          "fans": 10,
          "hp": 4
        },
        "result": "neutral"
      },
      "request_check": {
        "type": "check",
        "text": "쏟아지는 신청 중에서 무엇을 골라 어떻게 살리느냐가 남은 한 시간을 정한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 74,
          "traitBonus": {
            "spontaneous": 10,
            "chatter": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "{member}가 엉뚱한 신청을 골라 즉흥 코너로 만들자 채팅창이 다시 불붙었다.",
            "next": "request_hit"
          },
          "partial": {
            "text": "재밌는 신청도 있었지만, 고르는 데 시간이 오래 걸려 흐름이 몇 번 끊겼다.",
            "next": "request_mid"
          },
          "fail": {
            "text": "피곤한 탓에 신청을 제대로 살리지 못했다. 채팅창이 점점 조용해졌다.",
            "next": "request_drag"
          }
        }
      },
      "request_hit": {
        "type": "end",
        "text": "신청 코너가 오늘 방송의 하이라이트가 됐다. \"장방 마지막 한 시간이 제일 재밌었다\"는 후기가 올라왔다.",
        "effects": {
          "fans": 110,
          "money": 30000
        },
        "result": "success"
      },
      "request_mid": {
        "type": "end",
        "text": "한 시간을 꽉 채웠지만 기억에 남는 코너는 한두 개뿐이었다. 그래도 신청이 받아들여진 시청자들은 만족했다.",
        "effects": {
          "fans": 70,
          "money": 20000
        },
        "result": "partial"
      },
      "request_drag": {
        "type": "end",
        "text": "연장한 한 시간이 길게 느껴졌다. {member}는 다음엔 신청 코너를 방송 초반에 하겠다고 했고, 팬들은 \"그때 신청할 거 미리 생각해 둔다\"고 답했다.",
        "effects": {
          "fans": 30,
          "money": 5000
        },
        "result": "fail"
      }
    }
  },
  {
    "id": "st_broadcast_marathon_record",
    "title": "여덟 시간째의 기록 도전",
    "category": "broadcast",
    "group": "marathon_stream",
    "description": "멈출 수 없는 장시간 방송(event_201) 변형 A. 여덟 시간째 방송에서 먼저 갈 길을 정하고, 기록 도전 중 몰려온 새 시청자 같은 고비를 판정으로 넘는다.",
    "meta": {
      "theme": "broadcast_live",
      "setting": "eight_hour_record_push",
      "conflict": "high_expectations",
      "resolution": "risky_gamble",
      "activity": "long_stream",
      "tone": "hype"
    },
    "timeSlot": "lateNight",
    "conditions": {
      "activity": [
        "longStream"
      ],
      "cooldown": 3
    },
    "weight": 2,
    "start": "eight_hours",
    "steps": {
      "eight_hours": {
        "type": "choice",
        "text": [
          {
            "when": {
              "memberFlags": [
                "marathonPacing"
              ]
            },
            "text": "{member}의 방송이 벌써 여덟 시간째다. 지난번 장시간 방송 뒤로 쉬는 시간을 정해 둔 덕인지 아직 목소리에 힘이 남아 있다. 채팅은 여전히 뜨겁고, 누군가 \"오늘 최고 기록 깨자!\"를 외쳤다."
          },
          {
            "text": "{member}의 방송이 벌써 여덟 시간째다. 채팅은 여전히 뜨겁고 시청자 수는 오히려 늘고 있다. 다만 목소리에 피로가 조금씩 묻어나기 시작했다. 그때 누군가 \"오늘 최고 기록 깨자!\"를 외쳤다."
          }
        ],
        "choices": [
          {
            "text": "분위기를 살려 기록 방송으로 밀어붙인다",
            "effects": {
              "hp": -14
            },
            "story": "\"기록, 깨 보자!\" {member}가 화면에 지금까지의 최장 방송 시간을 띄웠다. 남은 시간은 세 시간.",
            "next": "record_raid"
          },
          {
            "text": "목표 하나만 달성하고 마무리한다",
            "effects": {
              "hp": -6
            },
            "story": "\"목표 하나만 채우고 끝내자.\" {member}가 화면 구석의 목표 목록을 가리켰다.",
            "next": "goal_pick"
          },
          {
            "text": "무리하지 않고 지금 끝낸다",
            "story": "\"오늘은 여기까지 할게.\" 종료 인사를 꺼내자 채팅창이 잠시 멈칫했다.",
            "next": "stop_story"
          }
        ]
      },
      "record_raid": {
        "type": "story",
        "text": "기록까지 한 시간 남았을 때, 다른 방송에서 대규모 시청자 무리가 넘어왔다. 반가운 일이지만, 지친 {member}가 새 시청자까지 붙잡아 둬야 한다.",
        "next": "record_check"
      },
      "record_check": {
        "type": "check",
        "text": "기록까지 남은 시간은 한 시간. 새로 온 시청자와 원래 있던 시청자를 한꺼번에 붙잡아야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 80,
          "traitBonus": {
            "longStream": 15,
            "highTension": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "{member}가 새로 온 시청자들에게 \"지금 기록 깨는 중!\"이라고 외치자, 두 무리의 채팅이 하나로 섞이며 폭발했다.",
            "effects": {
              "fans": 110,
              "fame": 1,
              "money": 20000
            },
            "next": "record_new"
          },
          "success": {
            "text": "지친 기색을 웃음으로 바꾼 {member}가 새 시청자들을 금세 끌어들였다. 기록 시간이 지나자 채팅창이 축하로 가득 찼다.",
            "next": "record_new"
          },
          "partial": {
            "text": "기록은 깼지만 마지막 한 시간은 버티기에 가까웠다. 새로 온 시청자 상당수는 금방 빠져나갔다.",
            "next": "record_near"
          },
          "fail": {
            "text": "피로가 한꺼번에 몰려왔다. 기록을 30분 남기고 {member}의 목소리가 갈라지자 매니저가 방송을 정리하자고 신호를 보냈다.",
            "next": "record_short"
          }
        }
      },
      "record_new": {
        "type": "end",
        "text": "새 최장 기록과 함께 방송이 끝났다. 마지막 화면 캡처가 커뮤니티에 줄줄이 올라왔다. 오늘 밤 {member}의 회복은 더딜 것이다.",
        "effects": {
          "fans": 150,
          "fame": 1,
          "money": 40000,
          "memberFlags": {
            "stayedUpLate": true
          }
        },
        "result": "success"
      },
      "record_near": {
        "type": "end",
        "text": "기록은 남았지만 기억에 남을 장면은 많지 않았다. 다시보기 댓글에는 \"버티는 게 보여서 짠했다\"는 말이 많았다.",
        "effects": {
          "fans": 90,
          "money": 20000,
          "memberFlags": {
            "stayedUpLate": true
          }
        },
        "result": "partial"
      },
      "record_short": {
        "type": "end",
        "text": "기록 도전은 다음으로 미뤄졌다. {member}는 마지막 인사에서 \"다음엔 페이스 조절해서 꼭 깬다\"고 약속했고, 팬들은 그 약속을 기억하겠다고 답했다.",
        "effects": {
          "fans": 40,
          "memberFlags": {
            "stayedUpLate": true,
            "marathonRetry": true
          }
        },
        "result": "fail"
      },
      "goal_pick": {
        "type": "choice",
        "text": "목표 목록에는 두 가지가 남아 있다.",
        "choices": [
          {
            "text": "후원 목표 게이지를 끝까지 채운다",
            "story": "{member}가 게이지를 화면 가운데로 옮겼다. 남은 건 20퍼센트.",
            "next": "goal_check"
          },
          {
            "text": "밀린 시청자 사연을 다 읽고 끝낸다",
            "story": "{member}가 사연함을 열었다. 밀린 사연이 생각보다 많다.",
            "next": "goal_letters"
          }
        ]
      },
      "goal_check": {
        "type": "check",
        "text": "게이지가 천천히 오른다. 남은 체력으로 분위기를 끌고 가야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 72,
          "traitBonus": {
            "host": 5,
            "chatter": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "게이지가 가득 차는 순간 {member}가 준비해 둔 감사 인사를 했다. 깔끔한 마무리였다.",
            "next": "goal_full"
          },
          "partial": {
            "text": "게이지는 90퍼센트에서 멈췄다. {member}가 \"나머지는 다음 방송에서!\"라며 웃었다.",
            "next": "goal_almost"
          },
          "fail": {
            "text": "분위기가 처지면서 게이지가 거의 오르지 않았다. 결국 목표를 다음으로 넘겼다.",
            "next": "goal_miss"
          }
        }
      },
      "goal_full": {
        "type": "end",
        "text": "목표를 채우고 정해진 시간에 끝낸 방송에 \"프로답다\"는 반응이 이어졌다.",
        "effects": {
          "fans": 70,
          "money": 20000
        },
        "result": "success"
      },
      "goal_almost": {
        "type": "end",
        "text": "아깝게 못 채웠지만 \"다음 방송에서 채우자\"는 채팅이 이어졌다. 오히려 다음 방송 예고가 됐다.",
        "effects": {
          "fans": 55,
          "money": 15000
        },
        "result": "partial"
      },
      "goal_miss": {
        "type": "end",
        "text": "목표를 못 채운 아쉬움 속에 방송이 끝났다. {member}는 다음 방송 첫머리에 게이지부터 다시 띄우겠다고 했다.",
        "effects": {
          "fans": 30,
          "money": 5000
        },
        "result": "fail"
      },
      "goal_letters": {
        "type": "end",
        "text": "사연을 다 읽고 나니 새벽이 깊었다. 사연을 보낸 시청자들의 감사 인사와 작은 후원이 마지막 채팅을 채웠다.",
        "effects": {
          "fans": 70,
          "money": 20000,
          "hp": -2
        },
        "result": "success"
      },
      "stop_story": {
        "type": "story",
        "text": "종료 인사 도중, 다른 멤버의 방송이 아직 켜져 있다는 채팅이 올라왔다.",
        "next": "stop_choice"
      },
      "stop_choice": {
        "type": "choice",
        "text": "방송을 어떻게 닫을까?",
        "choices": [
          {
            "text": "남은 시청자를 다른 멤버 방송으로 보내 주고 끝낸다",
            "story": "{member}가 다른 멤버 방송 링크를 걸고 \"저기 가서 놀아!\"라고 인사했다.",
            "next": "stop_raid"
          },
          {
            "text": "조용히 엔딩 인사를 하고 끈다",
            "story": "{member}가 오늘 와 준 시청자들에게 차분히 인사했다.",
            "next": "stop_quiet"
          }
        ]
      },
      "stop_raid": {
        "type": "end",
        "text": "시청자를 넘겨받은 멤버가 고맙다는 인사를 남겼다. 짧은 마무리였지만 분위기는 훈훈했다.",
        "effects": {
          "fans": 20,
          "hp": 2
        },
        "result": "success"
      },
      "stop_quiet": {
        "type": "end",
        "text": "무리하지 않고 끝낸 덕에 {member}는 오랜만에 일찍 잠들었다. 다음 장시간 방송을 위한 체력이 남았다.",
        "effects": {
          "fans": 10,
          "hp": 4
        },
        "result": "neutral"
      }
    }
  },
  {
    "id": "st_broadcast_screen_freeze",
    "title": "화면이 멈췄다",
    "category": "broadcast",
    "description": "방송 도중 화면이 멈추고 음성만 나온다. 대처 방식에 따라 사고가 명장면이 될 수도 있다.",
    "meta": {
      "theme": "broadcast_incident",
      "setting": "live_stream",
      "conflict": "technical_trouble",
      "resolution": "audience_help",
      "activity": "broadcast",
      "tone": "comedic"
    },
    "conditions": {
      "activityCategories": [
        "broadcast"
      ],
      "cooldown": 7
    },
    "weight": 1,
    "start": "intro",
    "steps": {
      "intro": {
        "type": "story",
        "text": "{member}의 방송이 한창 무르익은 순간, 화면이 멈추고 음성만 흘러나오기 시작했다. 채팅창은 '화면 멈춤'으로 도배됐다.",
        "next": "mood"
      },
      "mood": {
        "type": "branch",
        "branches": [
          {
            "when": {
              "maxHp": 59
            },
            "next": "tired"
          }
        ],
        "next": "react"
      },
      "tired": {
        "type": "story",
        "text": "하필 피로가 쌓인 날이다. {member}의 목소리에 당황과 지친 기색이 함께 묻어난다.",
        "next": "react"
      },
      "react": {
        "type": "choice",
        "text": "어떻게 대처할까?",
        "choices": [
          {
            "text": "음성만으로 라디오 방송처럼 이어간다",
            "story": "{member}가 '지금부터는 라디오입니다'라고 선언했다. 채팅창에 웃음이 터졌다.",
            "next": "radio"
          },
          {
            "text": "시청자들에게 해결법을 물어보며 같이 고친다",
            "story": "설정 화면을 하나씩 읽어 주며 시청자들과 함께 원인을 찾기 시작했다.",
            "next": "fix_live"
          },
          {
            "text": "잠시 방송을 끊고 재시작한다",
            "story": "공지를 남기고 방송을 껐다. 채팅창의 열기도 함께 식었다.",
            "effects": {
              "fans": -10
            },
            "next": "end_restart"
          }
        ]
      },
      "radio": {
        "type": "check",
        "text": "화면 없이 목소리만으로 시청자를 붙잡아야 한다. 말이 끊기는 순간 다들 떠난다.",
        "check": {
          "stat": "Bs",
          "difficulty": 72,
          "traitBonus": {
            "chatter": 10,
            "host": 5,
            "highTension": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "사연 읽기와 즉석 퀴즈로 30분을 꽉 채웠다. 화면이 돌아오자 다들 오히려 아쉬워했다.",
            "next": "end_radio_hit"
          },
          "partial": {
            "text": "몇 번 말이 끊겼지만 시청자들이 채팅으로 빈틈을 채워 줬다.",
            "next": "end_radio_ok"
          },
          "fail": {
            "text": "어색한 정적이 몇 번 흘렀다. 시청자 수가 조금씩 줄어든다.",
            "next": "end_awkward"
          }
        }
      },
      "fix_live": {
        "type": "check",
        "text": "'인코더 설정 바꿔 보세요', '케이블 확인!' 채팅창이 순식간에 기술 지원 센터가 됐다.",
        "check": {
          "stat": "Bs",
          "difficulty": 68,
          "traitBonus": {
            "brain": 10,
            "calm": 5,
            "diligent": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "한 시청자의 조언대로 설정 하나를 바꾸자 화면이 돌아왔다. 채팅창에 환호가 쏟아졌다.",
            "next": "end_fixed"
          },
          "partial": {
            "text": "원인은 못 찾았지만 같이 고민하는 과정 자체가 하나의 콘텐츠가 됐다.",
            "next": "end_radio_ok"
          },
          "fail": {
            "text": "이것저것 만지다 방송이 아예 꺼져 버렸다.",
            "next": "end_restart"
          }
        }
      },
      "end_radio_hit": {
        "type": "end",
        "result": "success",
        "text": "'화면 없는 방송이 더 재밌다'는 클립이 퍼졌다. 사고가 명장면이 된 날이다.",
        "effects": {
          "fans": 130,
          "fame": 1,
          "stats": {
            "Bs": 1
          }
        }
      },
      "end_fixed": {
        "type": "end",
        "result": "success",
        "text": "문제를 해결해 준 시청자에게 {member}가 공개적으로 감사 인사를 전했다. 채널 분위기가 한층 끈끈해졌다.",
        "effects": {
          "fans": 110,
          "fame": 1,
          "stats": {
            "Bs": 1
          }
        }
      },
      "end_radio_ok": {
        "type": "end",
        "result": "partial",
        "text": "완벽한 대처는 아니었지만, 사고를 웃으며 넘긴 방송으로 기억됐다.",
        "effects": {
          "fans": 60
        }
      },
      "end_awkward": {
        "type": "end",
        "result": "fail",
        "text": "화면이 돌아왔을 때 시청자는 절반으로 줄어 있었다. 다음에는 비상용 콘텐츠를 준비해 두기로 했다.",
        "effects": {
          "fans": 10,
          "hp": -3
        }
      },
      "end_restart": {
        "type": "end",
        "result": "neutral",
        "text": "10분 뒤 재시작한 방송은 평소처럼 흘러갔다. 큰 사고는 없었지만 특별한 일도 없었다.",
        "effects": {
          "fans": 10
        }
      }
    }
  },
  {
    "id": "st_equip_backup_gear",
    "title": "창고 속 예비 장비",
    "category": "broadcast",
    "group": "equip_trouble",
    "description": "방송 중 장비 트러블(ev_c01) 변형 B. 새 장비 주문 / 임기응변 / 짧게 마무리 / 창고의 예비 장비 도박 중 하나를 고른다.",
    "meta": {
      "theme": "broadcast_live",
      "setting": "backup_gear_hunt",
      "conflict": "budget_limit",
      "resolution": "risky_gamble",
      "activity": "broadcast",
      "tone": "comedic"
    },
    "conditions": {
      "activityCategories": [
        "broadcast"
      ],
      "cooldown": 4
    },
    "start": "pick",
    "steps": {
      "pick": {
        "type": "choice",
        "text": [
          {
            "when": {
              "anyTraits": [
                "unlucky"
              ]
            },
            "text": "방송 도중 {member}의 마이크가 지직거리기 시작했다. '또 나야?' 운 없기로 유명한 {member}답게 채팅창은 벌써 익숙하다는 반응이다. 새 마이크는 비싸고, 창고 어딘가엔 오래된 예비 마이크가 있다."
          },
          {
            "text": "방송 도중 {member}의 마이크가 지직거리기 시작했다. 새 마이크는 비싸고, 창고 어딘가엔 언제 샀는지 모를 예비 마이크가 있다."
          }
        ],
        "choices": [
          {
            "text": "바로 새 장비를 주문하고 양해를 구한다",
            "story": "주문 화면을 그대로 보여 주며 사정을 설명했다. 배송은 내일이다. 남은 방송 시간을 어떻게 채울까.",
            "effects": {
              "money": -80000
            },
            "next": "order_talk"
          },
          {
            "text": "임기응변으로 방송을 이어간다",
            "story": "{member}는 지직거리는 소리에 맞춰 효과음을 내기 시작했다.",
            "effects": {
              "hp": -3
            },
            "next": "improv"
          },
          {
            "text": "창고의 예비 마이크를 꺼내 본다",
            "story": "{member}가 화면 밖으로 사라졌다. 창고를 뒤지는 소리만 들린다. 채팅창은 '저거 되긴 함?'으로 가득하다.",
            "next": "backup_gamble"
          },
          {
            "text": "오늘은 짧게 마무리한다",
            "story": "짧게 사과하고 방송을 끝냈다. 덕분에 저녁 시간이 통째로 생겼다.",
            "next": "early_evening"
          }
        ]
      },
      "order_talk": {
        "type": "check",
        "text": "새 장비가 올 때까지 남은 시간은 장비 이야기로 채우기로 했다. 지직거리는 마이크로 하는 장비 토크다.",
        "check": {
          "stat": "Bs",
          "difficulty": 70,
          "traitBonus": {
            "chatter": 10,
            "brain": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "장비 고르는 과정을 시청자와 함께하자 의외로 반응이 좋았다.",
            "next": "end_order_hype"
          },
          "partial": {
            "text": "이야기는 이어졌지만 지직거림 때문에 집중이 잘 안 됐다.",
            "next": "end_order_ok"
          },
          "fail": {
            "text": "소리가 너무 거슬려 시청자들이 하나둘 나갔다.",
            "next": "end_order_quiet"
          }
        }
      },
      "improv": {
        "type": "check",
        "text": "지직, 효과음, 지직, 효과음. 이 리듬을 방송 끝까지 끌고 갈 수 있을까.",
        "check": {
          "stat": "Bs",
          "difficulty": 72,
          "traitBonus": {
            "host": 10,
            "calm": 10
          }
        },
        "outcomes": {
          "great": {
            "text": "효과음 리듬이 하나의 노래처럼 됐다. 채팅창이 비트를 맞추기 시작했다.",
            "next": "end_improv_great"
          },
          "success": {
            "text": "웃음으로 끝까지 버텼다.",
            "next": "end_improv_ok"
          },
          "partial": {
            "text": "처음엔 웃겼지만 갈수록 지쳤다.",
            "next": "end_improv_tired"
          },
          "fail": {
            "text": "효과음 개그가 세 번째부터 먹히지 않았다.",
            "next": "end_improv_fail"
          }
        }
      },
      "backup_gamble": {
        "type": "check",
        "text": "먼지를 털어 낸 예비 마이크를 꽂았다. 첫 소리가 나오는 순간이다.",
        "check": {
          "stat": "Bs",
          "difficulty": 76,
          "traitBonus": {
            "brain": 10,
            "spontaneous": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "놀랍게도 새것처럼 깨끗한 소리가 났다. 채팅창이 '창고의 기적'을 외쳤다.",
            "next": "end_backup_win"
          },
          "partial": {
            "text": "소리는 나지만 묘하게 라디오처럼 들린다. 그래도 지직거림보단 낫다.",
            "next": "end_backup_radio"
          },
          "fail": {
            "text": "예비 마이크는 아예 소리가 나지 않았다. 원래 마이크로 돌아가자 지직거림이 더 심해졌다.",
            "next": "end_backup_bust"
          }
        }
      },
      "early_evening": {
        "type": "choice",
        "text": "갑자기 생긴 저녁 시간. 걱정하는 팬들의 메시지가 계속 온다.",
        "choices": [
          {
            "text": "휴식 인증 글을 올리고 푹 쉰다",
            "story": "'오늘은 마이크도 나도 쉬는 날'이라는 글을 올렸다. 귀여운 걱정이 섞인 댓글이 달렸다.",
            "next": "end_rest_post"
          },
          {
            "text": "아무 말 없이 그냥 푹 쉰다",
            "story": "휴대폰을 내려놓고 일찍 잠들었다.",
            "next": "end_rest_quiet"
          }
        ]
      },
      "end_order_hype": {
        "type": "end",
        "result": "success",
        "text": "장비 토크가 다음 방송 예고가 됐다. 새 마이크가 도착한 날, 시청자들은 첫 소리를 함께 들으러 모였다.",
        "effects": {
          "fans": 60
        }
      },
      "end_order_ok": {
        "type": "end",
        "result": "partial",
        "text": "장비는 바꿨지만 오늘 방송은 반쯤 아쉬웠다.",
        "effects": {
          "fans": 30
        }
      },
      "end_order_quiet": {
        "type": "end",
        "result": "fail",
        "text": "돈은 썼는데 오늘 방송은 놓쳤다. 새 마이크로 다음 방송을 제대로 하기로 했다.",
        "effects": {
          "fans": 0
        }
      },
      "end_improv_great": {
        "type": "end",
        "result": "success",
        "text": "'지직 비트' 클립이 퍼지며 고장 난 마이크가 오늘의 주인공이 됐다.",
        "effects": {
          "fans": 150,
          "fame": 1
        }
      },
      "end_improv_ok": {
        "type": "end",
        "result": "success",
        "text": "웃음으로 버틴 방송이었다. 다음 날 새 마이크를 사러 가면서도 {member}는 효과음을 흥얼거렸다.",
        "effects": {
          "fans": 60
        }
      },
      "end_improv_tired": {
        "type": "end",
        "result": "partial",
        "text": "끝까지 버텼지만 다들 지쳤다. 장비 점검을 미루지 말자는 교훈이 남았다.",
        "effects": {
          "fans": 20,
          "hp": -2
        }
      },
      "end_improv_fail": {
        "type": "end",
        "result": "fail",
        "text": "반복되는 효과음에 시청자들이 지쳤다. 방송 후 {member}는 바로 새 마이크를 장바구니에 담았다.",
        "effects": {
          "fans": -50
        }
      },
      "end_backup_win": {
        "type": "end",
        "result": "success",
        "text": "돈 한 푼 안 들이고 위기를 넘겼다. 창고의 예비 마이크는 그날부터 '행운의 마이크'로 불렸다.",
        "effects": {
          "fans": 90
        }
      },
      "end_backup_radio": {
        "type": "end",
        "result": "partial",
        "text": "라디오 같은 음질이 오히려 분위기를 냈다. 그래도 새 마이크는 사야겠다.",
        "effects": {
          "fans": 40
        }
      },
      "end_backup_bust": {
        "type": "end",
        "result": "fail",
        "text": "도박은 실패했다. 결국 방송을 일찍 끝내고, 새 마이크 주문 버튼을 눌렀다.",
        "effects": {
          "fans": -40,
          "money": -80000
        }
      },
      "end_rest_post": {
        "type": "end",
        "result": "neutral",
        "text": "푹 쉬고 나니 몸이 가벼웠다. 팬들도 '가끔은 쉬어도 된다'며 다음 방송을 기다렸다.",
        "effects": {
          "fans": -10,
          "hp": 5
        }
      },
      "end_rest_quiet": {
        "type": "end",
        "result": "neutral",
        "text": "말없이 사라진 저녁에 걱정하는 댓글이 조금 쌓였다. 몸은 충분히 쉬었다.",
        "effects": {
          "fans": -20,
          "hp": 5
        }
      }
    }
  },
  {
    "id": "st_equip_mic_cutout",
    "title": "끊기는 마이크",
    "category": "broadcast",
    "group": "equip_trouble",
    "description": "방송 중 장비 트러블(ev_c01) 변형 A. 첫 대응 판정 결과에 따라 열리는 수습 방법이 달라진다.",
    "meta": {
      "theme": "broadcast_incident",
      "setting": "mic_cutout_stream",
      "conflict": "technical_trouble",
      "resolution": "compromise",
      "activity": "broadcast",
      "tone": "tense"
    },
    "conditions": {
      "activityCategories": [
        "broadcast"
      ],
      "cooldown": 4
    },
    "start": "first_reaction",
    "steps": {
      "first_reaction": {
        "type": "check",
        "text": "{member}의 목소리가 뚝뚝 끊기기 시작했다. 채팅창에 물음표가 쏟아진다. 마이크 선을 만지작거리는 동안에도 말은 이어 가야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 72,
          "traitBonus": {
            "host": 10,
            "calm": 10
          }
        },
        "outcomes": {
          "success": {
            "text": "{member}가 끊기는 타이밍에 맞춰 '들리면 1'을 외치게 하자 채팅창이 놀이터가 됐다.",
            "next": "steady_options"
          },
          "partial": {
            "text": "당황은 숨겼지만 말이 끊길 때마다 흐름도 같이 끊긴다.",
            "next": "shaky_options"
          },
          "fail": {
            "text": "소리가 거의 들리지 않는다. 시청자들이 하나둘 나가기 시작했다.",
            "effects": {
              "fans": -20
            },
            "next": "bad_options"
          }
        }
      },
      "steady_options": {
        "type": "choice",
        "text": "분위기는 살렸다. 이제 어떻게 마무리할까?",
        "choices": [
          {
            "text": "이 분위기 그대로 임기응변으로 방송을 이어간다",
            "story": "끊기는 마이크를 아예 오늘의 콘텐츠로 삼았다.",
            "effects": {
              "hp": -3
            },
            "next": "improv_finish"
          },
          {
            "text": "바로 새 장비를 주문하고 언박싱 방송을 예고한다",
            "story": "주문 화면을 띄우고 '다음 방송은 새 마이크 개봉'이라고 공지했다.",
            "effects": {
              "money": -80000
            },
            "next": "end_unboxing"
          },
          {
            "text": "분위기 좋을 때 짧게 마무리한다",
            "story": "{member}가 \"오늘은 웃을 때 끝내자\"며 방송을 일찍 정리했다.",
            "next": "end_steady_early"
          }
        ]
      },
      "shaky_options": {
        "type": "choice",
        "text": "흐름이 위태롭다. 결정이 필요하다.",
        "choices": [
          {
            "text": "바로 새 장비를 주문하고 양해를 구한다",
            "story": "방송을 잠시 멈추고 상황을 설명했다. 주문 화면을 그대로 보여 주자 채팅창이 진정됐다.",
            "effects": {
              "money": -80000
            },
            "next": "end_ordered"
          },
          {
            "text": "임기응변으로 방송을 이어간다",
            "story": "목소리 대신 자막과 채팅으로 소통하기 시작했다.",
            "effects": {
              "hp": -3
            },
            "next": "improv_shaky"
          },
          {
            "text": "오늘은 짧게 마무리한다",
            "story": "흔들리는 흐름을 붙잡기보다 짧게 사과하고 끝내기로 했다.",
            "next": "end_shaky_early"
          }
        ]
      },
      "bad_options": {
        "type": "choice",
        "text": "더 끌면 방송 사고다.",
        "choices": [
          {
            "text": "오늘은 짧게 마무리한다",
            "story": "{member}가 화면에 '오늘은 여기까지, 미안해요'라고 적었다.",
            "next": "end_early"
          },
          {
            "text": "바로 새 장비를 주문하고 양해를 구한다",
            "story": "방송을 끄기 전, 새 마이크 주문 화면을 보여 주며 사과했다.",
            "effects": {
              "money": -80000
            },
            "next": "end_ordered_late"
          },
          {
            "text": "임기응변으로 끝까지 버틴다",
            "story": "{member}가 소리가 거의 안 나는 마이크 대신 손글씨 팻말을 들고 방송을 이어 갔다.",
            "effects": {
              "hp": -3
            },
            "next": "improv_bad"
          }
        ]
      },
      "improv_finish": {
        "type": "check",
        "text": "남은 30분. 끊기는 소리와 함께 방송을 끝까지 끌고 가야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 72,
          "traitBonus": {
            "host": 10,
            "calm": 10,
            "spontaneous": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "끊길 때마다 터진 드립이 전부 클립이 됐다. '장비 트러블이 오늘의 콘텐츠'라는 제목까지 붙었다.",
            "next": "end_improv_great"
          },
          "success": {
            "text": "몇 번 끊겼지만 시청자들이 채팅으로 빈칸을 채워 주며 무사히 끝났다.",
            "next": "end_improv_ok"
          },
          "partial": {
            "text": "끝까지 갔지만 후반부엔 다들 지쳐 보였다.",
            "next": "end_improv_tired"
          },
          "fail": {
            "text": "소리가 점점 더 자주 끊겼다. 결국 채팅창에는 '다음에 다시 봐요'만 남았다.",
            "next": "end_improv_fail"
          }
        }
      },
      "end_unboxing": {
        "type": "end",
        "result": "success",
        "text": "위기를 넘긴 데다 다음 방송 예고까지 챙겼다. 언박싱 방송 날, 대기실이 평소보다 붐볐다.",
        "effects": {
          "fans": 60
        }
      },
      "end_ordered": {
        "type": "end",
        "result": "partial",
        "text": "빠른 처리 덕분에 큰 사고는 피했다. 다만 오늘 방송은 반쯤 날아갔다.",
        "effects": {
          "fans": 30
        }
      },
      "end_ordered_late": {
        "type": "end",
        "result": "fail",
        "text": "늦었지만 장비는 바꿨다. '다음엔 소리 잘 들리게 올게'라는 마지막 인사에 응원 채팅이 남았다.",
        "effects": {
          "fans": 10
        }
      },
      "end_early": {
        "type": "end",
        "result": "fail",
        "text": "방송은 짧게 끝났다. 아쉬워하는 시청자도 있었지만, 덕분에 {member}는 오랜만에 일찍 쉬었다.",
        "effects": {
          "fans": -20,
          "hp": 5
        }
      },
      "end_improv_great": {
        "type": "end",
        "result": "success",
        "text": "장비 트러블이 오늘 최고의 콘텐츠가 됐다. 다음 방송에서 새 마이크를 쓰자 '옛날 마이크 그립다'는 채팅까지 나왔다.",
        "effects": {
          "fans": 150,
          "fame": 1
        }
      },
      "end_improv_ok": {
        "type": "end",
        "result": "success",
        "text": "무사히 끝났다. 시청자들과 함께 넘긴 위기라 그런지 채널 분위기가 한층 끈끈해졌다.",
        "effects": {
          "fans": 60
        }
      },
      "end_improv_tired": {
        "type": "end",
        "result": "partial",
        "text": "끝까지 버틴 건 박수받을 일이지만, 방송의 재미는 반쯤 줄었다는 평이다.",
        "effects": {
          "fans": 30,
          "hp": -2
        }
      },
      "end_improv_fail": {
        "type": "end",
        "result": "fail",
        "text": "버티려다 오히려 시청자를 잃었다. {member}는 장비 점검 목록을 만들어 방송 전에 꼭 확인하기로 했다.",
        "effects": {
          "fans": -50
        }
      },
      "improv_shaky": {
        "type": "check",
        "text": "흐름이 이미 한 번 흔들린 상태다. 자막과 채팅만으로 남은 시간을 붙잡아야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 74,
          "traitBonus": {
            "host": 10,
            "calm": 10,
            "chatter": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "자막으로 주고받는 대화가 의외로 재밌었다. 흔들리던 방송이 제자리를 찾았다.",
            "next": "end_shaky_saved"
          },
          "partial": {
            "text": "버티긴 했지만 자막 쓰느라 방송 속도가 확 느려졌다.",
            "next": "end_shaky_slow"
          },
          "fail": {
            "text": "자막이 채팅 속도를 따라가지 못했다. 시청자들이 하나둘 떠났다.",
            "next": "end_shaky_lost"
          }
        }
      },
      "end_shaky_saved": {
        "type": "end",
        "result": "success",
        "text": "한 번 흔들렸던 방송을 끝까지 살려 냈다. \"자막 방송도 괜찮다\"는 반응에 {member}가 다음엔 일부러 해 보겠다고 웃었다.",
        "effects": {
          "fans": 50
        }
      },
      "end_shaky_slow": {
        "type": "end",
        "result": "partial",
        "text": "끝까지 갔지만 느린 방송이었다. 그래도 끝까지 남은 시청자들은 고생했다며 박수를 보냈다.",
        "effects": {
          "fans": 20,
          "hp": -2
        }
      },
      "end_shaky_lost": {
        "type": "end",
        "result": "fail",
        "text": "흔들린 흐름을 끝내 되찾지 못했다. {member}는 방송 후 바로 새 마이크를 장바구니에 담았다.",
        "effects": {
          "fans": -40
        }
      },
      "end_steady_early": {
        "type": "end",
        "result": "neutral",
        "text": "좋은 분위기로 일찍 끝난 방송이었다. 아쉬워하는 시청자도 있었지만 {member}는 오랜만에 푹 쉬었다.",
        "effects": {
          "fans": -10,
          "hp": 5
        }
      },
      "end_shaky_early": {
        "type": "end",
        "result": "neutral",
        "text": "짧게 끝난 방송에 아쉬움은 남았지만, 무리하지 않은 선택에 \"잘 쉬어\"라는 채팅이 이어졌다.",
        "effects": {
          "fans": -20,
          "hp": 5
        }
      },
      "improv_bad": {
        "type": "check",
        "text": "소리 없는 방송. 팻말과 표정만으로 시청자를 붙잡아야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 76,
          "traitBonus": {
            "roleplay": 10,
            "highTension": 5,
            "calm": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "팻말 방송이 의외로 웃겼다. 떠났던 시청자들이 소문을 듣고 돌아왔다.",
            "next": "end_sign_hit"
          },
          "partial": {
            "text": "몇몇 장면은 웃겼지만 오래 버티기는 힘들었다.",
            "next": "end_sign_half"
          },
          "fail": {
            "text": "팻말로는 한계가 있었다. 결국 방송을 끝냈다.",
            "next": "end_sign_fail"
          }
        }
      },
      "end_sign_hit": {
        "type": "end",
        "result": "success",
        "text": "\"무음 팻말 방송\"이 클립으로 돌았다. 최악의 장비 트러블이 오늘의 명장면이 됐다.",
        "effects": {
          "fans": 120,
          "fame": 1
        }
      },
      "end_sign_half": {
        "type": "end",
        "result": "partial",
        "text": "끝까지 버틴 노력은 박수를 받았지만, 방송으로는 아쉬움이 컸다.",
        "effects": {
          "fans": 10,
          "hp": -2
        }
      },
      "end_sign_fail": {
        "type": "end",
        "result": "fail",
        "text": "버티려다 방송 시간만 길어졌다. {member}는 다음 날 바로 장비 점검 목록부터 만들었다.",
        "effects": {
          "fans": -50
        }
      }
    }
  },
  {
    "id": "st_music_cover_battle",
    "title": "커버 배틀 합방",
    "category": "music",
    "description": "파트너와 같은 곡을 각자 편곡해 부르고 시청자 투표로 승부한다. 곡 선택과 막판 앵콜이 승부를 가른다.",
    "meta": {
      "theme": "collab_content",
      "setting": "cover_battle_stream",
      "conflict": "rivalry",
      "resolution": "clutch_moment",
      "activity": "sing",
      "tone": "hype"
    },
    "collab": {
      "min": 2,
      "max": 3
    },
    "conditions": {
      "activity": [
        "sing"
      ],
      "cooldown": 7
    },
    "traitWeights": {
      "competitive": 1.4,
      "cover": 1.3
    },
    "start": "intro",
    "steps": {
      "intro": {
        "type": "story",
        "text": "{member}와 {partners}가 같은 곡을 각자 편곡해 부르고, 시청자 투표로 승자를 정하는 '커버 배틀'을 열었다. 진 쪽은 다음 방송에서 이긴 쪽의 신청곡을 불러야 한다.",
        "next": "mood"
      },
      "mood": {
        "type": "branch",
        "branches": [
          {
            "when": {
              "partyMinRelationship": 40
            },
            "next": "banter"
          }
        ],
        "next": "stiff"
      },
      "banter": {
        "type": "story",
        "text": "평소 친한 사이답게 시작부터 서로 놀리기 바쁘다. 채팅창은 벌써 응원 팀이 갈렸다.",
        "effects": {
          "fans": 20
        },
        "next": "song_pick"
      },
      "stiff": {
        "type": "story",
        "text": "아직 서먹한 사이라 첫인사부터 조심스럽다. 승부욕을 드러내도 될지 서로 눈치를 본다.",
        "next": "song_pick"
      },
      "song_pick": {
        "type": "choice",
        "text": "어떤 곡으로 붙을까?",
        "choices": [
          {
            "text": "고음이 몰아치는 곡으로 정면 승부",
            "story": "한 소절만 삐끗해도 바로 티가 나는 곡이다. 서로 웃고 있지만 눈은 웃고 있지 않다.",
            "next": "round_power"
          },
          {
            "text": "분위기로 승부하는 잔잔한 곡",
            "story": "기술보다 감정 전달이 중요한 곡이다. 누가 더 듣는 사람의 마음을 건드리느냐의 싸움이다.",
            "next": "round_mood"
          },
          {
            "text": "서로의 파트를 바꿔 부른다",
            "story": "평소 상대가 부르던 스타일로 불러야 한다. 웃음과 실수가 예약된 선택이다.",
            "effects": {
              "relationship": 2
            },
            "next": "round_swap"
          }
        ]
      },
      "round_power": {
        "type": "check",
        "text": "1라운드. {member}가 먼저 무대에 올랐다. 마지막 고음이 승부를 가른다.",
        "check": {
          "stat": "Vc",
          "difficulty": 82,
          "traitBonus": {
            "competitive": 10,
            "perfectionist": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "고음이 정확히 꽂혔다. 투표 그래프가 {member} 쪽으로 기울었다.",
            "next": "final_lead"
          },
          "partial": {
            "text": "고음은 냈지만 음색이 조금 갈라졌다. 표가 팽팽하다.",
            "next": "final_close"
          },
          "fail": {
            "text": "마지막 고음에서 음이 뒤집혔다. 그 순간 투표가 확 갈렸다.",
            "next": "end_lost"
          }
        }
      },
      "round_mood": {
        "type": "check",
        "text": "조명을 낮추고 첫 소절을 불렀다. 채팅 속도가 눈에 띄게 느려진다.",
        "check": {
          "stat": "Vc",
          "difficulty": 74,
          "traitBonus": {
            "calm": 10,
            "cover": 5,
            "instrument": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "마지막 소절이 끝나자 채팅창이 한동안 조용했다. 그리고 투표가 쏟아졌다.",
            "next": "final_lead"
          },
          "partial": {
            "text": "잔잔하게 잘 불렀지만 상대도 만만치 않았다. 표가 팽팽하다.",
            "next": "final_close"
          },
          "fail": {
            "text": "감정을 너무 눌렀는지 밋밋하다는 반응이 나왔다.",
            "next": "end_lost"
          }
        }
      },
      "round_swap": {
        "type": "check",
        "text": "상대의 말투와 창법을 흉내 내며 부르기 시작하자 채팅창이 폭소로 뒤덮였다.",
        "check": {
          "stat": "Bs",
          "difficulty": 70,
          "traitBonus": {
            "roleplay": 10,
            "highTension": 5,
            "chatter": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "성대모사 수준의 재현에 상대도 웃음을 참지 못했다.",
            "next": "end_swap_hit"
          },
          "partial": {
            "text": "웃기긴 했지만 노래가 자꾸 끊겼다. 표가 팽팽하다.",
            "next": "final_close"
          },
          "fail": {
            "text": "흉내가 선을 살짝 넘었다. 웃음 뒤로 어색한 공기가 남았다.",
            "next": "end_awkward"
          }
        }
      },
      "final_lead": {
        "type": "choice",
        "text": "투표 마감 1분 전. 우세하지만 아직 뒤집힐 수 있다.",
        "choices": [
          {
            "text": "앵콜 한 소절로 쐐기를 박는다",
            "next": "encore"
          },
          {
            "text": "상대에게 먼저 박수를 보낸다",
            "story": "{member}가 먼저 상대의 무대를 칭찬했다. 채팅창에 '훈훈하다'가 줄줄이 올라온다.",
            "effects": {
              "relationship": 2
            },
            "next": "end_won_graceful"
          }
        ]
      },
      "final_close": {
        "type": "choice",
        "text": "투표 마감 1분 전. 표 차이는 단 몇 표다.",
        "choices": [
          {
            "text": "마지막 앵콜로 승부를 건다",
            "next": "encore"
          },
          {
            "text": "다 같이 합창으로 마무리하자고 제안한다",
            "story": "배틀을 합창으로 바꾸자는 제안에 상대가 잠시 망설이다 웃었다.",
            "effects": {
              "relationship": 3
            },
            "next": "end_chorus"
          }
        ]
      },
      "encore": {
        "type": "check",
        "text": "앵콜 한 소절. 준비 없이 부르는 마지막 한 방이다.",
        "check": {
          "stat": "Vc",
          "difficulty": 80,
          "traitBonus": {
            "highTension": 10,
            "spontaneous": 5,
            "competitive": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "마지막 한 소절이 투표를 끝냈다.",
            "next": "end_won"
          },
          "partial": {
            "text": "앵콜은 좋았지만 상대 팬들의 막판 투표도 거셌다. 결과는 동점.",
            "next": "end_draw"
          },
          "fail": {
            "text": "욕심을 낸 앵콜에서 가사를 놓쳤다.",
            "next": "end_lost"
          }
        }
      },
      "end_won": {
        "type": "end",
        "result": "success",
        "text": "커버 배틀 승리. 약속대로 다음 방송의 신청곡은 {member}가 정하게 됐다. 벌써 2차전 날짜를 잡자는 말이 나온다.",
        "effects": {
          "fans": 180,
          "fame": 1,
          "relationship": 2
        }
      },
      "end_won_graceful": {
        "type": "end",
        "result": "success",
        "text": "승리는 {member}의 것이었지만, 박수를 보낸 장면이 더 많이 회자됐다. 이 조합의 다음 합방을 기다린다는 댓글이 줄을 이었다.",
        "effects": {
          "fans": 160,
          "fame": 1,
          "relationship": 3
        }
      },
      "end_swap_hit": {
        "type": "end",
        "result": "success",
        "text": "서로 바꿔 부른 무대가 '오늘의 하이라이트'로 클립이 됐다. 승패는 아무도 기억하지 않았다.",
        "effects": {
          "fans": 190,
          "relationship": 4
        }
      },
      "end_chorus": {
        "type": "end",
        "result": "partial",
        "text": "승부는 무승부로 끝났지만 즉석 합창이 의외의 명장면이 됐다. 다만 '결판은 내야지'라는 아쉬운 목소리도 남았다.",
        "effects": {
          "fans": 120,
          "relationship": 3
        }
      },
      "end_draw": {
        "type": "end",
        "result": "partial",
        "text": "동점이다. 재대결을 원하는 채팅이 쏟아졌고, 다 같이 한 달 안에 2라운드를 하기로 약속했다.",
        "effects": {
          "fans": 110,
          "relationship": 2,
          "memberFlags": {
            "coverBattleRematch": true
          }
        }
      },
      "end_lost": {
        "type": "end",
        "result": "fail",
        "text": "패배. 약속대로 {member}는 다음 방송에서 상대의 신청곡을 부르게 됐다. '복수는 다음 배틀에서'라는 한마디에 시청자들이 더 신났다.",
        "effects": {
          "fans": 50,
          "relationship": 1,
          "memberFlags": {
            "coverBattleRematch": true
          }
        }
      },
      "end_awkward": {
        "type": "end",
        "result": "fail",
        "text": "어색한 공기는 방송이 끝날 때까지 완전히 풀리지 않았다. 방송 후 {member}가 먼저 사과 메시지를 보냈다.",
        "effects": {
          "fans": 30,
          "relationship": -2
        }
      }
    }
  },
  {
    "id": "st_music_cover_project",
    "title": "커버곡 프로젝트",
    "category": "music",
    "description": "오래 부르고 싶던 곡의 커버 작업. 편곡 방향 → 녹음 → 수정 → 공개로 이어진다.",
    "meta": {
      "theme": "music_production",
      "setting": "home_studio",
      "conflict": "creative_block",
      "resolution": "quiet_growth",
      "activity": "music",
      "tone": "emotional"
    },
    "conditions": {
      "activityCategories": [
        "music"
      ],
      "cooldown": 6
    },
    "activityWeights": {
      "music": 2
    },
    "traitWeights": {
      "cover": 1.5,
      "perfectionist": 1.5
    },
    "start": "intro",
    "steps": {
      "intro": {
        "type": "story",
        "text": [
          {
            "when": {
              "anyTraits": [
                "perfectionist"
              ]
            },
            "text": "{member}가 오래전부터 부르고 싶던 곡의 커버 작업을 시작했다. 그런데 완벽주의 성격 탓에 데모만 벌써 열 번째 다시 만들고 있다."
          },
          {
            "text": "{member}가 오래전부터 부르고 싶던 곡의 커버 작업을 시작했다. 편곡 방향을 두고 한 시간째 고민 중이다."
          }
        ],
        "next": "direction"
      },
      "direction": {
        "type": "choice",
        "text": "어떤 방향으로 갈까?",
        "choices": [
          {
            "text": "원곡의 느낌을 살린 정석 커버",
            "story": "안정적인 선택이다. 대신 {member}만의 색을 어떻게 보여줄지가 과제로 남았다.",
            "next": "rec_classic"
          },
          {
            "text": "장르를 과감하게 바꾼 리메이크",
            "story": "위험하지만 터지면 크다. 편곡 작업만 반나절이 걸렸다.",
            "effects": {
              "hp": -3
            },
            "next": "rec_remake"
          },
          {
            "text": "악기 연주까지 직접 넣는다",
            "conditions": {
              "anyTraits": [
                "instrument"
              ]
            },
            "story": "{member}가 직접 반주를 녹음하기로 했다. 연주와 노래를 모두 챙겨야 한다.",
            "effects": {
              "hp": -3
            },
            "next": "rec_instrument"
          }
        ]
      },
      "rec_classic": {
        "type": "check",
        "text": "녹음 부스. 익숙한 멜로디지만 그래서 더 비교되기 쉽다.",
        "check": {
          "stat": "Vc",
          "difficulty": 74,
          "traitBonus": {
            "cover": 10,
            "perfectionist": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "원곡을 존중하면서도 {member}의 음색이 또렷하게 살아 있는 녹음본이 나왔다.",
            "next": "release"
          },
          "partial": {
            "text": "나쁘지 않다. 하지만 후렴 한 소절이 계속 귀에 걸린다.",
            "next": "fix"
          },
          "fail": {
            "text": "목이 잘 풀리지 않았다. 음정이 흔들리는 구간이 여러 군데다.",
            "next": "fix"
          }
        }
      },
      "rec_remake": {
        "type": "check",
        "text": "녹음 부스. 새 편곡에 맞춰 부르는 건 생각보다 어렵다. 원곡 버릇이 자꾸 튀어나온다.",
        "check": {
          "stat": "Vc",
          "difficulty": 84,
          "traitBonus": {
            "perfectionist": 10,
            "cover": 5,
            "spontaneous": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "원곡을 아는 사람일수록 놀랄 만한 완성도가 나왔다.",
            "effects": {
              "stats": {
                "Vc": 1
              }
            },
            "next": "release_big"
          },
          "success": {
            "text": "완전히 새로운 곡처럼 들린다. 스태프가 몇 번이고 다시 돌려 들었다.",
            "next": "release_big"
          },
          "partial": {
            "text": "방향은 좋은데 아직 덜 익었다.",
            "next": "fix"
          },
          "fail": {
            "text": "새 편곡과 목소리가 끝내 어울리지 않았다.",
            "next": "end_shelved"
          }
        }
      },
      "rec_instrument": {
        "type": "check",
        "text": "반주 녹음부터 시작했다. 손가락과 목소리를 한꺼번에 챙겨야 하는 긴 밤이다.",
        "check": {
          "stat": "Vc",
          "difficulty": 78,
          "traitBonus": {
            "instrument": 15,
            "diligent": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "연주와 노래가 한 사람의 호흡으로 이어졌다. 이 버전은 {member}만 만들 수 있다.",
            "next": "release_big"
          },
          "partial": {
            "text": "연주는 좋았지만 노래가 조금 밀렸다.",
            "next": "fix"
          },
          "fail": {
            "text": "둘 다 챙기려다 둘 다 흔들렸다.",
            "next": "fix"
          }
        }
      },
      "fix": {
        "type": "choice",
        "text": "녹음본이 어딘가 아쉽다. 어떻게 할까?",
        "choices": [
          {
            "text": "하루 더 붙잡고 다시 녹음한다",
            "effects": {
              "hp": -6
            },
            "next": "refix"
          },
          {
            "text": "지금 버전으로 공개한다",
            "story": "완벽하지 않아도 지금의 목소리를 남기기로 했다.",
            "next": "release"
          }
        ]
      },
      "refix": {
        "type": "check",
        "text": "다음 날, 같은 부스. 이번에는 걸렸던 부분만 집중해서 다시 부른다.",
        "check": {
          "stat": "Vc",
          "difficulty": 74,
          "traitBonus": {
            "perfectionist": 10,
            "diligent": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "걸렸던 소절이 깔끔하게 풀렸다.",
            "effects": {
              "stats": {
                "Vc": 1
              }
            },
            "next": "release"
          },
          "partial": {
            "text": "완벽하진 않지만 어제보다는 훨씬 낫다.",
            "next": "release"
          },
          "fail": {
            "text": "붙잡을수록 목만 더 지쳤다.",
            "next": "end_shelved"
          }
        }
      },
      "release_big": {
        "type": "story",
        "text": "완성본을 들은 스태프가 조용히 말했다. '이건 제대로 공개하자.'",
        "next": "premiere_big"
      },
      "release": {
        "type": "choice",
        "text": "녹음이 끝났다. 공개 방식을 정하자.",
        "choices": [
          {
            "text": "프리미어로 팬들과 함께 감상한다",
            "next": "premiere"
          },
          {
            "text": "조용히 업로드만 한다",
            "next": "end_ok"
          }
        ]
      },
      "premiere": {
        "type": "check",
        "text": "프리미어 공개. {member}도 채팅창에 들어와 팬들과 함께 곡을 듣는다.",
        "check": {
          "stat": "Bs",
          "difficulty": 72,
          "traitBonus": {
            "host": 5,
            "chatter": 5,
            "calm": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "후렴에서 채팅창이 하트로 뒤덮였다.",
            "next": "end_hit"
          },
          "partial": {
            "text": "반응은 따뜻했지만 폭발적이진 않았다.",
            "next": "end_ok"
          },
          "fail": {
            "text": "공개 시간이 다른 큰 방송과 겹쳐 반응이 조용했다.",
            "next": "end_soft"
          }
        }
      },
      "premiere_big": {
        "type": "check",
        "text": "프리미어 공개. 기다리던 팬들로 대기실이 꽉 찼다.",
        "check": {
          "stat": "Bs",
          "difficulty": 66,
          "traitBonus": {
            "host": 5,
            "chatter": 5,
            "highTension": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "공개 직후 커버곡이 음원 사이트 커버 차트에 이름을 올렸다.",
            "next": "end_hit"
          },
          "partial": {
            "text": "들은 사람들의 평가는 최고였다. 입소문이 천천히 퍼지고 있다.",
            "next": "end_ok"
          },
          "fail": {
            "text": "기대가 컸던 만큼 첫날 반응은 아쉬웠다.",
            "next": "end_ok"
          }
        }
      },
      "end_hit": {
        "type": "end",
        "result": "success",
        "text": "커버곡이 크게 화제가 됐다. {member}는 '다음 곡도 벌써 정해 뒀다'며 수줍게 웃었다.",
        "effects": {
          "fans": 180,
          "fame": 1,
          "stats": {
            "Vc": 1
          },
          "stockEffect": {
            "ticker": "TUNE",
            "percentage": 3
          }
        }
      },
      "end_ok": {
        "type": "end",
        "result": "partial",
        "text": "조용하지만 꾸준히 재생 수가 오른다. 오래 사랑받을 곡이 될 것 같다.",
        "effects": {
          "fans": 90,
          "fame": 1,
          "stats": {
            "Vc": 1
          }
        }
      },
      "end_soft": {
        "type": "end",
        "result": "partial",
        "text": "첫날 반응은 아쉬웠지만, 곡 자체에 대한 평은 좋았다.",
        "effects": {
          "fans": 50,
          "stats": {
            "Vc": 1
          }
        }
      },
      "end_shelved": {
        "type": "end",
        "result": "fail",
        "text": "이번 곡은 잠시 보류하기로 했다. 대신 {member}는 자기 목소리가 어디까지 가는지 조금 더 알게 됐다.",
        "effects": {
          "stats": {
            "Vc": 1
          },
          "hp": 3
        }
      }
    }
  },
  {
    "id": "st_music_deadline_guide_vocal",
    "title": "마감 전날의 가이드 녹음",
    "category": "music",
    "description": "지친 상태로 맞은 가이드 녹음 마감 전날. 원키 강행 / 키 낮추기 / 마감 연장 중 무엇에 걸지 정한다.",
    "meta": {
      "theme": "member_growth",
      "setting": "deadline_recording",
      "conflict": "fatigue",
      "resolution": "risky_gamble",
      "activity": "recording",
      "tone": "calm"
    },
    "conditions": {
      "activity": [
        "recording"
      ],
      "maxHp": 59,
      "cooldown": 6
    },
    "traitWeights": {
      "lowStamina": 1.5,
      "nightOwl": 1.3,
      "longStream": 1.3
    },
    "start": "intro",
    "steps": {
      "intro": {
        "type": "story",
        "text": [
          {
            "when": {
              "anyTraits": [
                "lowStamina"
              ]
            },
            "text": "가이드 녹음 마감이 내일 아침이다. 체력이 쉽게 바닥나는 {member}에게 이번 주 일정은 처음부터 버거웠다. 목소리에 쇳소리가 섞인다."
          },
          {
            "when": {
              "anyTraits": [
                "nightOwl"
              ]
            },
            "text": "가이드 녹음 마감이 내일 아침이다. 밤이 익숙한 {member}지만, 며칠째 이어진 일정에 오늘은 목소리가 영 올라오지 않는다."
          },
          {
            "text": "가이드 녹음 마감이 내일 아침이다. 며칠째 쉬지 못한 {member}의 목소리가 평소보다 반 톤 낮게 깔린다."
          }
        ],
        "next": "plan"
      },
      "plan": {
        "type": "choice",
        "text": "녹음 부스 앞에서 {member}가 매니저를 쳐다본다. 어떻게 할까?",
        "choices": [
          {
            "text": "원래 키 그대로 오늘 밤 끝낸다",
            "story": "무리인 걸 알지만, 이번 곡은 원키가 아니면 의미가 없다고 {member}가 말했다.",
            "effects": {
              "hp": -6
            },
            "next": "push_first"
          },
          {
            "text": "키를 한 단계 낮춰 안전하게 녹음한다",
            "story": "곡의 인상은 조금 달라지겠지만 목은 지킬 수 있다.",
            "next": "lowered"
          },
          {
            "text": "마감 연장을 요청하고 오늘은 쉰다",
            "story": "매니저가 제작진에게 전화를 걸었다. 연장이 될지는 상대의 답에 달렸다.",
            "next": "extend"
          }
        ]
      },
      "push_first": {
        "type": "check",
        "text": "첫 번째 후렴. 곡에서 가장 높은 음이 다가온다.",
        "check": {
          "stat": "Vc",
          "difficulty": 80,
          "traitBonus": {
            "perfectionist": 10,
            "diligent": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "고음이 걸렸다. 아직 한 번 더 남았다.",
            "next": "push_second"
          },
          "partial": {
            "text": "음은 냈지만 끝이 갈라졌다. 다음 후렴에서 만회해야 한다.",
            "effects": {
              "hp": -2
            },
            "next": "push_second"
          },
          "fail": {
            "text": "고음에서 목이 막혔다. 더 밀어붙이면 안 된다는 신호다.",
            "next": "end_strained"
          }
        }
      },
      "push_second": {
        "type": "check",
        "text": "마지막 후렴. 여기까지 왔으면 끝을 봐야 한다.",
        "check": {
          "stat": "Vc",
          "difficulty": 84,
          "traitBonus": {
            "perfectionist": 10,
            "longStream": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "마지막 고음까지 원키로 해냈다. 녹음실 밖에서 스태프가 조용히 박수를 쳤다.",
            "next": "end_paid_off"
          },
          "partial": {
            "text": "원키는 지켰지만 몇 군데는 보정이 필요할 것 같다.",
            "next": "end_mixed"
          },
          "fail": {
            "text": "끝내 마지막 고음이 나오지 않았다.",
            "next": "end_strained"
          }
        }
      },
      "lowered": {
        "type": "check",
        "text": "한 키 낮춘 반주가 흐른다. 익숙하지 않은 높이에서 곡의 감정을 다시 찾아야 한다.",
        "check": {
          "stat": "Vc",
          "difficulty": 70,
          "traitBonus": {
            "calm": 10,
            "cover": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "낮춘 키가 오히려 곡에 새로운 색을 입혔다.",
            "next": "end_new_color"
          },
          "partial": {
            "text": "무난하게 끝났지만 원래 곡의 시원함은 줄었다.",
            "next": "end_mixed"
          },
          "fail": {
            "text": "낮은 키에서 감정이 잘 실리지 않았다.",
            "next": "end_flat"
          }
        }
      },
      "extend": {
        "type": "check",
        "text": "제작진과의 통화. 사정을 설명하고 하루를 얻어 내야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 68,
          "traitBonus": {
            "brain": 10,
            "calm": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "제작진이 흔쾌히 이틀을 내줬다. {member}는 그날 밤 일찍 잠들었다.",
            "next": "end_rested"
          },
          "partial": {
            "text": "반나절만 연장됐다. 결국 키를 낮춰 오늘 녹음하기로 했다.",
            "next": "lowered"
          },
          "fail": {
            "text": "연장은 어렵다는 답이 돌아왔다. 결국 원키로 오늘 밤 끝내야 한다.",
            "effects": {
              "hp": -3
            },
            "next": "push_first"
          }
        }
      },
      "end_paid_off": {
        "type": "end",
        "result": "success",
        "text": "무리한 도박이었지만 결과물은 확실했다. 다만 다음 날 {member}는 하루 종일 말을 아꼈다.",
        "effects": {
          "fans": 120,
          "fame": 1,
          "stats": {
            "Vc": 1
          },
          "hp": -3
        }
      },
      "end_new_color": {
        "type": "end",
        "result": "success",
        "text": "가이드 녹음을 들은 작곡가가 아예 이 키로 가자고 했다. 쉬어 가는 선택이 새 길을 열었다.",
        "effects": {
          "fans": 100,
          "stats": {
            "Vc": 1
          },
          "hp": 3
        }
      },
      "end_rested": {
        "type": "end",
        "result": "neutral",
        "text": "녹음은 미뤄졌지만 목도, 곡도 지켰다. 이틀 뒤 녹음은 놀라울 만큼 순조로웠다.",
        "effects": {
          "fans": 30,
          "hp": 12
        }
      },
      "end_mixed": {
        "type": "end",
        "result": "partial",
        "text": "결과물은 나쁘지 않다. 보정 작업에 시간이 더 들겠지만 마감은 지켰다.",
        "effects": {
          "fans": 60,
          "hp": -2
        }
      },
      "end_flat": {
        "type": "end",
        "result": "fail",
        "text": "마감은 지켰지만 결과물이 마음에 들지 않았다. {member}는 컨디션이 돌아오면 다시 녹음하겠다고 메모를 남겼다.",
        "effects": {
          "fans": 20,
          "memberFlags": {
            "guideRetake": true
          }
        }
      },
      "end_strained": {
        "type": "end",
        "result": "fail",
        "text": "녹음은 중단됐다. 며칠은 목을 쉬게 해야 한다. 무리하지 말라는 팬들의 메시지가 쏟아졌다.",
        "effects": {
          "fans": 10,
          "hp": -4,
          "memberFlags": {
            "guideRetake": true
          }
        }
      }
    }
  },
  {
    "id": "st_music_first_original",
    "title": "첫 자작곡",
    "category": "music",
    "description": "첫 자작곡을 완성하는 이야기. 혼자 쓰기 / 작곡가와 협업 / 팬 가사 공모 중 방식을 고른다. 결과에 따라 공개 이벤트로 이어진다.",
    "meta": {
      "theme": "music_production",
      "setting": "songwriting_session",
      "conflict": "high_expectations",
      "resolution": "teamwork",
      "activity": "recording",
      "tone": "emotional"
    },
    "conditions": {
      "activityCategories": [
        "music"
      ],
      "minDay": 4,
      "maxDay": 20,
      "minFans": 1500
    },
    "traitWeights": {
      "perfectionist": 1.4,
      "diligent": 1.4,
      "instrument": 1.3
    },
    "once": true,
    "start": "intro",
    "steps": {
      "intro": {
        "type": "story",
        "text": [
          {
            "when": {
              "anyTraits": [
                "instrument"
              ]
            },
            "text": "{member}가 몇 달째 악기로 흥얼거리던 멜로디가 드디어 한 곡 분량이 됐다. 팬들이 '자작곡은 언제 나오냐'고 물을 때마다 미뤄 왔던 바로 그 곡이다."
          },
          {
            "when": {
              "anyTraits": [
                "introvert"
              ]
            },
            "text": "{member}가 조심스럽게 파일 하나를 보내왔다. '이거… 제가 만든 곡인데요.' 남에게 들려주는 건 처음이라고 했다."
          },
          {
            "text": "{member}가 첫 자작곡을 만들어 보고 싶다고 했다. 팬들의 기대는 이미 높다. '자작곡'이라는 단어만 나와도 채팅창이 들썩인다."
          }
        ],
        "next": "approach"
      },
      "approach": {
        "type": "choice",
        "text": "곡을 어떻게 완성할까?",
        "choices": [
          {
            "text": "가사와 멜로디 모두 직접 끝까지 쓴다",
            "story": "모든 걸 혼자 책임지는 길이다. 완성되면 온전히 {member}의 곡이 된다.",
            "effects": {
              "hp": -5
            },
            "next": "crunch"
          },
          {
            "text": "전문 작곡가와 함께 다듬는다",
            "story": "작곡가와의 첫 미팅. 머릿속 아이디어를 말로 설명하는 것부터 쉽지 않다.",
            "effects": {
              "money": -80000
            },
            "next": "cowrite"
          },
          {
            "text": "후렴 가사를 팬들에게서 공모한다",
            "story": "공모 공지를 올리자 하루 만에 수백 개의 문장이 모였다. 고르는 것도 일이다.",
            "next": "fan_lyrics"
          }
        ]
      },
      "crunch": {
        "type": "branch",
        "branches": [
          {
            "when": {
              "maxHp": 59
            },
            "next": "crunch_tired"
          }
        ],
        "next": "crunch_check"
      },
      "crunch_tired": {
        "type": "story",
        "text": "밤샘 작업이 며칠째다. 멜로디는 머릿속에 있는데 손이 따라오지 않는다.",
        "effects": {
          "hp": -4
        },
        "next": "crunch_check"
      },
      "crunch_check": {
        "type": "check",
        "text": "마감 전날 밤. 2절 가사가 아직 비어 있다.",
        "check": {
          "stat": "Vc",
          "difficulty": 82,
          "traitBonus": {
            "perfectionist": 10,
            "instrument": 5,
            "diligent": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "새벽 네 시, 마지막 줄이 써졌다. 다시 들어 보니 처음부터 이 가사였던 것 같다.",
            "next": "end_demo_strong"
          },
          "partial": {
            "text": "가사는 채웠지만 2절이 1절보다 약하다는 게 스스로도 느껴진다.",
            "next": "end_demo_rough"
          },
          "fail": {
            "text": "결국 2절을 채우지 못했다. 데모는 1절에서 멈췄다.",
            "next": "end_shelved"
          }
        }
      },
      "cowrite": {
        "type": "check",
        "text": "작곡가가 멜로디 일부를 바꾸자고 제안했다. 지키고 싶은 부분은 지키면서 협업을 살려야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 72,
          "traitBonus": {
            "brain": 10,
            "calm": 5,
            "chatter": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "{member}가 원하는 감정을 정확히 설명하자 작곡가가 무릎을 쳤다. 서로의 장점이 맞물렸다.",
            "next": "end_demo_strong"
          },
          "partial": {
            "text": "타협 끝에 곡은 완성됐지만, 처음 멜로디의 일부는 사라졌다.",
            "next": "end_demo_rough"
          },
          "fail": {
            "text": "의견 차이가 좁혀지지 않았다. 작업은 잠시 멈추기로 했다.",
            "next": "end_shelved"
          }
        }
      },
      "fan_lyrics": {
        "type": "choice",
        "text": "팬 공모 가사 중 두 개가 최종 후보에 올랐다.",
        "choices": [
          {
            "text": "재치 있는 말장난이 들어간 가사",
            "next": "pick_fun"
          },
          {
            "text": "짧지만 마음을 울리는 한 문장",
            "next": "pick_heart"
          }
        ]
      },
      "pick_fun": {
        "type": "check",
        "text": "말장난 가사를 멜로디에 붙여 부르자 스태프가 웃음을 터뜨렸다. 문제는 곡의 분위기와 맞느냐다.",
        "check": {
          "stat": "Bs",
          "difficulty": 70,
          "traitBonus": {
            "chatter": 10,
            "spontaneous": 5,
            "highTension": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "어색할 줄 알았던 가사가 의외로 곡을 살렸다.",
            "next": "end_demo_fan"
          },
          "partial": {
            "text": "재밌지만 곡의 감정선이 조금 흐려졌다.",
            "next": "end_demo_rough"
          },
          "fail": {
            "text": "밝은 가사가 멜로디와 끝까지 어울리지 않았다.",
            "next": "end_lyrics_clash"
          }
        }
      },
      "pick_heart": {
        "type": "check",
        "text": "한 문장을 후렴 전체로 늘려야 한다. 반복될수록 진심이 흐려지지 않게 불러야 한다.",
        "check": {
          "stat": "Vc",
          "difficulty": 74,
          "traitBonus": {
            "calm": 5,
            "cover": 5,
            "perfectionist": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "같은 문장이 반복될수록 오히려 깊어졌다.",
            "next": "end_demo_fan"
          },
          "partial": {
            "text": "좋은 후렴이지만 곡 전체와 이어지는 부분이 조금 어색하다.",
            "next": "end_demo_rough"
          },
          "fail": {
            "text": "반복될수록 문장이 가벼워졌다.",
            "next": "end_lyrics_clash"
          }
        }
      },
      "end_demo_strong": {
        "type": "end",
        "result": "success",
        "text": "데모가 완성됐다. 스태프 모두가 '이건 정식으로 내자'고 입을 모았다. 공개 준비가 시작된다.",
        "effects": {
          "fans": 110,
          "fame": 1,
          "stats": {
            "Vc": 1
          },
          "memberFlags": {
            "originalSongDemo": true
          }
        }
      },
      "end_demo_fan": {
        "type": "end",
        "result": "success",
        "text": "공모에 뽑힌 팬의 닉네임이 크레딧에 들어간다는 소식에 채팅창이 축제가 됐다. 공개 준비가 시작된다.",
        "effects": {
          "fans": 140,
          "fame": 1,
          "memberFlags": {
            "originalSongDemo": true
          }
        }
      },
      "end_demo_rough": {
        "type": "end",
        "result": "partial",
        "text": "곡은 완성됐지만 {member}는 아직 만족하지 못했다. 그래도 공개를 향해 한 걸음을 내디뎠다.",
        "effects": {
          "fans": 70,
          "memberFlags": {
            "originalSongDemo": true
          }
        }
      },
      "end_shelved": {
        "type": "end",
        "result": "fail",
        "text": "자작곡은 잠시 서랍에 넣기로 했다. 대신 작업 과정을 방송으로 공유하며 '언젠가 꼭 낸다'고 약속하자 응원이 쏟아졌다.",
        "effects": {
          "fans": 40,
          "stats": {
            "Vc": 1
          },
          "memberFlags": {
            "originalSongShelved": true
          }
        }
      },
      "end_lyrics_clash": {
        "type": "end",
        "result": "fail",
        "text": "고른 가사를 끝내 쓰지 못했다. {member}는 공모에 참여한 팬들에게 직접 사과하고, 다음 곡에서 꼭 쓰겠다고 약속했다.",
        "effects": {
          "fans": 20,
          "fame": -1,
          "memberFlags": {
            "originalSongShelved": true
          }
        }
      }
    }
  },
  {
    "id": "st_music_live_track_glitch",
    "title": "반주가 멈춘 라이브",
    "category": "music",
    "description": "노래 방송 도중 반주 파일이 깨졌다. 첫 대응 뒤 아카펠라 / 직접 연주 / 곡 교체 중 하나로 수습한다.",
    "meta": {
      "theme": "music_live",
      "setting": "singing_stream",
      "conflict": "technical_trouble",
      "resolution": "compromise",
      "activity": "sing",
      "tone": "tense"
    },
    "conditions": {
      "activity": [
        "sing"
      ],
      "cooldown": 8
    },
    "traitWeights": {
      "calm": 1.5,
      "host": 1.3,
      "unlucky": 1.3
    },
    "start": "intro",
    "steps": {
      "intro": {
        "type": "story",
        "text": [
          {
            "when": {
              "anyTraits": [
                "unlucky"
              ]
            },
            "text": "{member}의 노래 방송 세 번째 곡. 후렴 직전, 반주가 '지지직' 소리를 내며 멈췄다. 채팅창에는 벌써 '역시 오늘도'라는 반응이 올라온다. 이런 일이 꼭 {member}에게만 생기는 것 같다."
          },
          {
            "text": "{member}의 노래 방송 세 번째 곡. 후렴 직전, 반주가 '지지직' 소리를 내며 멈췄다. 화면에는 노래를 이어 가려던 {member}의 입 모양만 남았다."
          }
        ],
        "next": "first_beat"
      },
      "first_beat": {
        "type": "check",
        "text": "정적이 3초를 넘기면 방송 사고가 된다. 우선 지금 이 순간부터 어떻게든 넘겨야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 70,
          "traitBonus": {
            "calm": 10,
            "host": 5,
            "chatter": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "{member}가 웃으며 '방금 그거 연출이에요'라고 받아쳤다. 채팅창이 웃음으로 바뀌며 시간을 벌었다.",
            "next": "decide"
          },
          "partial": {
            "text": "말은 이어 갔지만 목소리가 살짝 떨렸다. 채팅창이 걱정 반 응원 반으로 술렁인다.",
            "next": "decide"
          },
          "fail": {
            "text": "당황한 침묵이 길어졌다. 시청자 몇 명이 '방송 터졌나?'라며 나가기 시작했다.",
            "effects": {
              "fans": -20
            },
            "next": "shaken"
          }
        }
      },
      "shaken": {
        "type": "story",
        "text": "{member}가 물을 한 모금 마시고 깊게 숨을 골랐다. 여기서 방송을 끝낼 수는 없다.",
        "effects": {
          "hp": -3
        },
        "next": "decide"
      },
      "decide": {
        "type": "choice",
        "text": "반주 파일은 다시 열리지 않는다. 남은 곡을 어떻게 이어 갈까?",
        "choices": [
          {
            "text": "반주 없이 아카펠라로 끝까지 부른다",
            "story": "기댈 것 없이 목소리 하나로 버텨야 한다. {member}가 마이크를 고쳐 잡았다.",
            "effects": {
              "hp": -4
            },
            "next": "acapella"
          },
          {
            "text": "직접 악기를 꺼내 반주를 친다",
            "conditions": {
              "anyTraits": [
                "instrument"
              ]
            },
            "story": "{member}가 방 한쪽의 악기를 끌어왔다. 조율할 시간은 없다.",
            "next": "self_play"
          },
          {
            "text": "반주가 살아 있는 다른 곡으로 바꾼다",
            "story": "원래 계획은 접고, 무난하게 부를 수 있는 곡으로 순서를 바꿨다. 아쉬워하는 채팅도 보인다.",
            "next": "end_swap"
          }
        ]
      },
      "acapella": {
        "type": "check",
        "text": "첫 소절. 음을 잡아 줄 반주가 없다. 키가 조금만 흔들려도 그대로 드러난다.",
        "check": {
          "stat": "Vc",
          "difficulty": 82,
          "traitBonus": {
            "perfectionist": 5,
            "cover": 5,
            "calm": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "흔들림 없는 음정이 끝까지 이어졌다. 채팅창이 한동안 아무 말 없이 듣기만 했다.",
            "effects": {
              "fans": 40
            },
            "next": "end_acapella"
          },
          "success": {
            "text": "마지막 음까지 키를 지켜 냈다.",
            "next": "end_acapella"
          },
          "partial": {
            "text": "후렴에서 음이 반 키 내려갔지만 {member}는 끝까지 멈추지 않았다.",
            "next": "end_patched"
          },
          "fail": {
            "text": "중간에 음을 놓쳐 곡을 멈췄다. {member}가 멋쩍게 웃으며 사과했다.",
            "next": "end_cut"
          }
        }
      },
      "self_play": {
        "type": "check",
        "text": "손가락은 반주를, 목은 멜로디를 맡는다. 한 번도 연습해 본 적 없는 조합이다.",
        "check": {
          "stat": "Vc",
          "difficulty": 74,
          "traitBonus": {
            "instrument": 15,
            "spontaneous": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "삐걱대던 첫 마디가 지나자 연주와 노래가 한 호흡이 됐다.",
            "next": "end_selfplay"
          },
          "partial": {
            "text": "몇 번 코드를 놓쳤지만 오히려 라이브다운 맛이 났다.",
            "next": "end_patched"
          },
          "fail": {
            "text": "연주에 신경 쓰다가 가사를 통째로 잊었다.",
            "next": "end_cut"
          }
        }
      },
      "end_acapella": {
        "type": "end",
        "result": "success",
        "text": "방송이 끝난 뒤 '반주가 없어서 더 좋았다'는 클립이 돌기 시작했다. {member}는 다음 노래 방송부터 백업 반주를 꼭 챙기겠다고 했다.",
        "effects": {
          "fans": 150,
          "fame": 1,
          "stats": {
            "Vc": 1
          },
          "memberFlags": {
            "backupTrackRoutine": true
          }
        }
      },
      "end_selfplay": {
        "type": "end",
        "result": "success",
        "text": "즉석 연주 버전이 원곡보다 낫다는 반응까지 나왔다. 악기 방송을 따로 해 달라는 요청이 쏟아졌다.",
        "effects": {
          "fans": 160,
          "fame": 1,
          "stats": {
            "Vc": 1
          },
          "memberFlags": {
            "backupTrackRoutine": true
          }
        }
      },
      "end_patched": {
        "type": "end",
        "result": "partial",
        "text": "완벽하진 않았지만 사고를 끝까지 수습했다. '오늘 방송 레전드'라는 칭찬과 '음정은 아쉬웠다'는 평이 반반이었다.",
        "effects": {
          "fans": 90,
          "hp": -2
        }
      },
      "end_swap": {
        "type": "end",
        "result": "partial",
        "text": "방송은 무사히 끝났다. 다만 기다리던 곡을 못 들은 시청자들의 아쉬움이 남았고, {member}는 그 곡을 다음 방송 첫 곡으로 부르겠다고 약속했다.",
        "effects": {
          "fans": 60
        }
      },
      "end_cut": {
        "type": "end",
        "result": "fail",
        "text": "곡은 중간에 끝났다. 방송을 마친 {member}는 한참 동안 반주 백업 폴더를 정리했다. 다음엔 같은 일로 멈추지 않겠다며.",
        "effects": {
          "fans": 20,
          "stats": {
            "Bs": 1
          },
          "memberFlags": {
            "backupTrackRoutine": true
          }
        }
      }
    }
  },
  {
    "id": "st_music_original_release",
    "title": "첫 자작곡 공개",
    "category": "music",
    "description": "첫 자작곡 데모를 만든 멤버의 공개 준비. 공개일이 대형 이벤트와 겹친다. (st_music_first_original 후속)",
    "meta": {
      "theme": "special_event",
      "setting": "original_song_release",
      "conflict": "schedule_clash",
      "resolution": "steady_success",
      "activity": "release",
      "tone": "warm"
    },
    "conditions": {
      "memberFlags": [
        "originalSongDemo"
      ],
      "afterEventId": {
        "id": "st_music_first_original",
        "minDays": 4
      },
      "blockedActivityCategories": [
        "rest"
      ]
    },
    "weight": 2,
    "urgent": true,
    "once": true,
    "start": "intro",
    "steps": {
      "intro": {
        "type": "branch",
        "branches": [
          {
            "when": {
              "storyResult": {
                "id": "st_music_first_original",
                "result": "success"
              }
            },
            "next": "intro_polished"
          }
        ],
        "next": "intro_rough"
      },
      "intro_polished": {
        "type": "story",
        "text": "{member}의 첫 자작곡 마스터 음원이 도착했다. 데모 때부터 반응이 좋았던 만큼, 이제 공개 날짜만 정하면 된다.",
        "next": "clash"
      },
      "intro_rough": {
        "type": "story",
        "text": "{member}의 첫 자작곡 마스터 음원이 도착했다. 데모 때 아쉬웠던 부분을 꽤 다듬었지만, 본인은 여전히 조금 불안해 보인다.",
        "effects": {
          "hp": -2
        },
        "next": "clash"
      },
      "clash": {
        "type": "choice",
        "text": "그런데 공개 예정일이 다른 대형 방송 이벤트와 겹친다는 소식이 들어왔다.",
        "choices": [
          {
            "text": "예정대로 공개한다",
            "story": "피할 수 없다면 정면으로 간다. 공개 알림을 그대로 걸었다.",
            "next": "release_head_on"
          },
          {
            "text": "일주일 미루고 티저를 하루씩 푼다",
            "story": "티저 영상과 가사 미리보기를 하루에 하나씩 공개하기로 했다.",
            "effects": {
              "hp": -3
            },
            "next": "release_teased"
          },
          {
            "text": "동료 멤버의 방송에서 함께 첫 공개를 한다",
            "story": "동료의 방송에 게스트로 나가 첫 재생 버튼을 같이 누르기로 했다.",
            "next": "release_guest"
          }
        ]
      },
      "release_head_on": {
        "type": "check",
        "text": "공개 당일, 시청자들이 두 방송 사이를 오간다. 공개 방송을 끝까지 붙잡아 둬야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 78,
          "traitBonus": {
            "host": 5,
            "highTension": 5,
            "chatter": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "겹친 일정이 무색하게 공개 방송 동시 시청자가 평소의 두 배를 찍었다.",
            "next": "end_release_hit"
          },
          "partial": {
            "text": "큰 화제가 되진 않았지만 들은 사람들의 반응은 확실했다.",
            "next": "end_release_steady"
          },
          "fail": {
            "text": "대형 이벤트에 묻혀 공개가 조용히 지나갔다.",
            "next": "end_release_buried"
          }
        }
      },
      "release_teased": {
        "type": "check",
        "text": "일주일 동안 매일 티저를 올렸다. 관심이 식지 않게 끝까지 이어 가는 게 관건이다.",
        "check": {
          "stat": "Bs",
          "difficulty": 70,
          "traitBonus": {
            "diligent": 10,
            "brain": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "티저마다 해석 댓글이 붙었다. 공개 당일에는 기다리던 팬들로 대기실이 가득 찼다.",
            "next": "end_release_hit"
          },
          "partial": {
            "text": "관심은 이어졌지만 처음만큼 뜨겁지는 않았다.",
            "next": "end_release_steady"
          },
          "fail": {
            "text": "매일 이어진 홍보에 지쳐, 정작 공개 당일 목 상태가 좋지 않았다.",
            "next": "end_release_tired"
          }
        }
      },
      "release_guest": {
        "type": "check",
        "text": "동료의 방송에서 처음으로 곡이 흘러나왔다. 옆에서 반응을 듣는 {member}의 표정이 그대로 화면에 잡힌다.",
        "check": {
          "stat": "Bs",
          "difficulty": 72,
          "traitBonus": {
            "calm": 5,
            "chatter": 5,
            "host": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "동료가 먼저 울컥하는 바람에 {member}도 웃다가 울었다. 그 장면이 곡보다 먼저 퍼졌다.",
            "next": "end_release_shared"
          },
          "partial": {
            "text": "곡 소개는 잘 됐지만, 동료 방송의 원래 콘텐츠에 시간을 많이 빼앗겼다.",
            "next": "end_release_steady"
          },
          "fail": {
            "text": "동료 방송의 흐름에 밀려 곡 소개가 짧게 끝났다.",
            "next": "end_release_buried"
          }
        }
      },
      "end_release_hit": {
        "type": "end",
        "result": "success",
        "text": "첫 자작곡이 무사히 세상에 나왔다. 음원 사이트 댓글에는 '다음 자작곡도 기다린다'는 말이 가장 많았다.",
        "effects": {
          "fans": 190,
          "fame": 1,
          "memberFlags": {
            "originalSongDemo": false,
            "originalSongReleased": true
          },
          "stockEffect": {
            "ticker": "TUNE",
            "percentage": 2
          }
        }
      },
      "end_release_shared": {
        "type": "end",
        "result": "success",
        "text": "{member}의 첫 자작곡은 '함께 들은 곡'으로 기억됐다. 공개 방송 클립이 두 채널에서 동시에 퍼졌다.",
        "effects": {
          "fans": 170,
          "fame": 1,
          "team": {
            "hp": 2
          },
          "memberFlags": {
            "originalSongDemo": false,
            "originalSongReleased": true
          }
        }
      },
      "end_release_steady": {
        "type": "end",
        "result": "partial",
        "text": "폭발적이진 않아도 재생 수가 꾸준히 오른다. 오래 들을 곡이라는 평이 많다. 다만 {member}는 다음엔 더 크게 알리고 싶다고 했다.",
        "effects": {
          "fans": 100,
          "memberFlags": {
            "originalSongDemo": false,
            "originalSongReleased": true
          }
        }
      },
      "end_release_buried": {
        "type": "end",
        "result": "fail",
        "text": "공개는 조용히 지나갔다. 그래도 곡을 찾아 들은 팬들이 하나둘 커버 영상을 올리기 시작했다. 늦게라도 닿는 곡이 있다.",
        "effects": {
          "fans": 40,
          "memberFlags": {
            "originalSongDemo": false,
            "originalSongReleased": true
          }
        }
      },
      "end_release_tired": {
        "type": "end",
        "result": "fail",
        "text": "공개 방송은 짧게 끝내야 했다. 무리한 홍보 일정이 남긴 교훈이 크다.",
        "effects": {
          "fans": 50,
          "hp": -5,
          "memberFlags": {
            "originalSongDemo": false,
            "originalSongReleased": true
          }
        }
      }
    }
  },
  {
    "id": "st_music_snippet_encore",
    "title": "채팅을 뒤집은 한 소절",
    "category": "music",
    "group": "impromptu_sing",
    "description": "즉석 노래 방송 제안(event_101) 변형 A. 방송 중 터진 한 소절을 두고 먼저 갈 길을 정하고, 길마다 다른 고비와 판정을 거쳐 결말에 닿는다.",
    "meta": {
      "theme": "music_live",
      "setting": "stream_snippet_singing",
      "conflict": "big_opportunity",
      "resolution": "viral_moment",
      "activity": "impromptu_singing",
      "tone": "hype"
    },
    "conditions": {
      "activityCategories": [
        "broadcast"
      ]
    },
    "activityWeights": {
      "music": 2
    },
    "weight": 1,
    "start": "snippet",
    "steps": {
      "snippet": {
        "type": "choice",
        "text": [
          {
            "when": {
              "memberFlags": [
                "coverDemoRetake"
              ]
            },
            "text": "지난번 커버 데모를 다시 따기로 했던 {member}가 방송 중에 그 곡을 한 소절 흥얼거렸다. 채팅창이 순식간에 \"그 곡 언제 나와요?\"로 뒤집혔다. 팬들이 이번엔 꼭 커버로 내 달라고 성화다. 지금 달려도 되고, 목을 아끼며 준비하는 방법도 있다."
          },
          {
            "when": {
              "activity": [
                "sing"
              ]
            },
            "text": "노래 방송 도중, 신청곡 사이에 {member}가 즉흥으로 목청을 뽑아 부른 한 소절이 채팅을 뒤집어 놓았다. 팬들이 커버 프로젝트를 하자고 성화다. 지금 달려도 되고, 목을 아끼며 준비하는 방법도 있다."
          },
          {
            "when": {
              "activityCategories": [
                "game"
              ]
            },
            "text": "게임 방송 도중, 배경 음악을 따라 {member}가 목청을 뽑아 부른 한 소절이 채팅을 뒤집어 놓았다. 플레이는 잠시 뒷전이 됐다. 팬들이 커버 프로젝트를 하자고 성화다. 지금 달려도 되고, 목을 아끼며 준비하는 방법도 있다."
          },
          {
            "text": "방송에서 이야기를 나누던 중, {member}가 장난처럼 목청을 뽑아 부른 한 소절이 채팅을 뒤집어 놓았다. 팬들이 커버 프로젝트를 하자고 성화다. 지금 달려도 되고, 목을 아끼며 준비하는 방법도 있다."
          }
        ],
        "choices": [
          {
            "text": "정식 커버 프로젝트를 바로 시작한다",
            "effects": {
              "money": -300000,
              "hp": -3
            },
            "story": "\"그럼 진짜 해 볼까?\" {member}의 한마디에 채팅창이 박수 이모티콘으로 덮였다. 방송이 끝나자마자 편곡자에게 연락이 갔다.",
            "next": "project_meeting"
          },
          {
            "text": "팬 요청곡으로 가볍게 즉석 방송을 한다",
            "effects": {
              "hp": -9
            },
            "story": "{member}가 \"지금부터 신청곡 받는다!\"를 외치며 신청곡 창을 열었다.",
            "next": "request_flood"
          },
          {
            "text": "오늘은 목을 아끼고 다음 방송을 준비한다",
            "story": "\"오늘은 여기까지! 목 아껴서 제대로 들려줄게.\" 채팅창에 아쉬움 섞인 응원이 올라왔다.",
            "next": "save_voice"
          },
          {
            "text": "방금 그 한 소절만 다시 불러 클립으로 남긴다",
            "effects": {
              "hp": -3
            },
            "story": "\"딱 한 번만 더 부른다. 클립 딸 사람 준비!\" 채팅창이 숨을 죽였다.",
            "next": "clip_check"
          }
        ]
      },
      "project_meeting": {
        "type": "story",
        "text": "편곡자에게서 바로 답이 왔다. 이번 주에 비어 있는 작업 일정은 딱 하루. 그날 안에 가이드 보컬까지 끝내야 일정이 맞는다.",
        "next": "demo_check"
      },
      "demo_check": {
        "type": "check",
        "text": "작업 당일. 한정된 시간 안에 방송에서 터졌던 그 느낌을 다시 끌어내야 한다.",
        "check": {
          "stat": "Vc",
          "difficulty": 80,
          "traitBonus": {
            "cover": 10,
            "perfectionist": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "첫 테이크부터 방송 때보다 더 좋은 소리가 나왔다. 편곡자가 헤드폰을 벗고 박수를 쳤다.",
            "effects": {
              "fans": 30
            },
            "next": "project_hit"
          },
          "success": {
            "text": "몇 번의 테이크 끝에 방송 때 그 느낌이 살아났다. 편곡자가 \"이거면 된다\"고 했다.",
            "next": "project_hit"
          },
          "partial": {
            "text": "소리는 좋았지만 시간이 모자랐다. 마지막 소절은 다음 주 작업 일정으로 넘어갔다.",
            "next": "project_slow"
          },
          "fail": {
            "text": "방송 때의 흥이 작업실에서는 잘 나오지 않았다. 테이크를 거듭할수록 목만 지쳐 갔다.",
            "next": "project_shelved"
          }
        }
      },
      "project_hit": {
        "type": "end",
        "text": "공개된 커버는 \"그 한 소절의 완성판\"이라는 반응과 함께 빠르게 퍼졌다. 방송을 놓친 사람들까지 그날 다시보기를 찾아왔다.",
        "effects": {
          "fans": 160,
          "fame": 2,
          "stats": {
            "Vc": 3
          },
          "hp": -4
        },
        "result": "success"
      },
      "project_slow": {
        "type": "end",
        "text": "공개가 일주일 늦어졌다. 완성도는 높았지만 방송 직후의 열기가 조금 식은 뒤라 반응은 예상보다 잔잔했다.",
        "effects": {
          "fans": 100,
          "fame": 1,
          "stats": {
            "Vc": 2
          },
          "hp": -4
        },
        "result": "partial"
      },
      "project_shelved": {
        "type": "end",
        "text": "커버 공개는 일단 미뤘다. {member}는 팬들에게 \"더 좋은 버전으로 꼭 돌아오겠다\"고 약속했고, 팬들은 그 약속을 고정 댓글로 걸어 두었다.",
        "effects": {
          "fans": 40,
          "stats": {
            "Vc": 2
          },
          "hp": -4,
          "memberFlags": {
            "coverPromise": true
          }
        },
        "result": "fail"
      },
      "request_flood": {
        "type": "story",
        "text": "신청곡 창이 순식간에 가득 찼다. 맨 위에는 고음이 끝도 없이 올라가는 곡이 압도적인 표를 받고 있다.",
        "next": "request_choice"
      },
      "request_choice": {
        "type": "choice",
        "text": "{member}가 신청곡 목록을 훑으며 잠시 고민한다.",
        "choices": [
          {
            "text": "가장 표를 많이 받은 고난도 곡에 도전한다",
            "story": "\"좋아, 피할 수 없지.\" {member}가 물을 한 모금 마시고 반주를 틀었다.",
            "next": "hard_check"
          },
          {
            "text": "편하게 부를 수 있는 곡 위주로 이어 간다",
            "story": "{member}가 \"그건 다음에!\"라며 익숙한 곡들로 목록을 채웠다.",
            "next": "request_cozy"
          }
        ]
      },
      "hard_check": {
        "type": "check",
        "text": "곡의 마지막 고음이 다가온다. 채팅창이 숨을 죽였다.",
        "check": {
          "stat": "Vc",
          "difficulty": 82,
          "traitBonus": {
            "cover": 10,
            "highTension": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "마지막 고음이 깨끗하게 뻗었다. 채팅창이 \"미쳤다\"로 도배됐다.",
            "next": "request_viral"
          },
          "partial": {
            "text": "고음은 닿았지만 끝이 살짝 흔들렸다. {member}가 \"반은 성공!\"이라며 웃었다.",
            "next": "request_cracked"
          },
          "fail": {
            "text": "마지막 고음에서 목소리가 뒤집혔다. 정적 끝에 {member}가 먼저 웃음을 터뜨렸다.",
            "next": "request_laugh"
          }
        }
      },
      "request_viral": {
        "type": "end",
        "text": "고음 장면이 클립으로 퍼지며 \"즉석 방송에서 이게 된다고?\"라는 반응이 이어졌다.",
        "effects": {
          "fans": 140,
          "fame": 1,
          "stats": {
            "Vc": 1
          }
        },
        "result": "success"
      },
      "request_cracked": {
        "type": "end",
        "text": "흔들린 끝음까지 \"라이브의 맛\"이라며 좋아하는 팬이 많았다. 다만 클립으로 퍼지기엔 조금 아쉬운 장면이었다.",
        "effects": {
          "fans": 90,
          "stats": {
            "Vc": 1
          }
        },
        "result": "partial"
      },
      "request_laugh": {
        "type": "end",
        "text": "뒤집힌 고음은 그날 밤 작은 밈이 됐다. {member}는 \"다음엔 꼭 성공한다\"고 했고, 팬들은 재도전 날짜를 묻는 댓글을 남겼다.",
        "effects": {
          "fans": 50,
          "stats": {
            "Vc": 1
          }
        },
        "result": "fail"
      },
      "request_cozy": {
        "type": "end",
        "text": "익숙한 곡들이 편안하게 이어졌다. 크게 터지진 않았지만 \"듣기 좋은 밤\"이라는 채팅이 끝까지 이어졌다.",
        "effects": {
          "fans": 110,
          "stats": {
            "Vc": 1
          }
        },
        "result": "success"
      },
      "save_voice": {
        "type": "story",
        "text": "방송이 끝난 뒤, 한 팬이 그 한 소절을 짧은 영상으로 올렸다. 조회수가 조용히 오르고 있다.",
        "next": "save_choice"
      },
      "save_choice": {
        "type": "choice",
        "text": "목은 아끼기로 했다. 남은 건 다음 방송을 어떻게 준비할지다.",
        "choices": [
          {
            "text": "다음 노래 방송 날짜를 바로 공지한다",
            "story": "{member}가 커뮤니티에 날짜와 함께 \"그 곡 풀버전\"이라고 적었다.",
            "next": "save_notice"
          },
          {
            "text": "아무 약속 없이 푹 쉰다",
            "story": "{member}가 목에 수건을 두르고 일찍 잠자리에 들었다.",
            "next": "save_rest"
          }
        ]
      },
      "save_notice": {
        "type": "end",
        "text": "공지 하나로 아쉬움이 기대감으로 바뀌었다. 팬 영상의 조회수도 공지와 함께 더 올랐다.",
        "effects": {
          "hp": 6
        },
        "result": "success"
      },
      "save_rest": {
        "type": "end",
        "text": "푹 쉬어 목 상태는 확실히 좋아졌다. 다만 아무 약속도 없자 몇몇 팬은 \"그 곡 언제 불러 줘요?\"라며 서운해했다.",
        "effects": {
          "hp": 8,
          "fans": -20
        },
        "result": "neutral"
      },
      "clip_check": {
        "type": "check",
        "text": "같은 소절을 다시 부르는 건 생각보다 어렵다. 방금의 흥을 그대로 살릴 수 있을까?",
        "check": {
          "stat": "Vc",
          "difficulty": 70,
          "traitBonus": {
            "spontaneous": 10,
            "highTension": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "두 번째가 첫 번째보다 좋았다. 팬들이 각자 딴 클립이 커뮤니티에 줄줄이 올라왔다.",
            "next": "clip_spread"
          },
          "partial": {
            "text": "소리는 괜찮았지만 처음만큼의 놀라움은 없었다. 클립은 몇 개만 올라왔다.",
            "next": "clip_small"
          },
          "fail": {
            "text": "의식하자 오히려 음이 흔들렸다. {member}가 \"처음 게 진짜였다\"며 쑥스럽게 웃었다.",
            "next": "clip_miss"
          }
        }
      },
      "clip_spread": {
        "type": "end",
        "text": "한 소절 클립이 퍼지며 \"커버 언제 나오냐\"는 문의가 계속 이어졌다.",
        "effects": {
          "fans": 100,
          "fame": 1,
          "stats": {
            "Vc": 1
          }
        },
        "result": "success"
      },
      "clip_small": {
        "type": "end",
        "text": "몇몇 클립이 팬들 사이에서 돌았다. 화제가 크게 번지진 않았지만, 다음 노래 방송을 기다리는 사람은 늘었다.",
        "effects": {
          "fans": 60,
          "stats": {
            "Vc": 1
          }
        },
        "result": "partial"
      },
      "clip_miss": {
        "type": "end",
        "text": "클립보다 \"처음 게 진짜였다\"는 말이 더 화제가 됐다. 팬들은 다음 방송에서 다시 들려 달라고 졸랐다.",
        "effects": {
          "fans": 20,
          "stats": {
            "Vc": 1
          }
        },
        "result": "fail"
      }
    }
  },
  {
    "id": "st_music_snippet_voice_test",
    "title": "한 소절, 다시 한 번",
    "category": "music",
    "group": "impromptu_sing",
    "description": "즉석 노래 방송 제안(event_101) 변형 B. 방송이 끝난 뒤 같은 소절을 다시 불러 보는 판정이 먼저 오고, 목 상태에 따라 같은 선택도 다른 결과로 이어진다.",
    "meta": {
      "theme": "music_production",
      "setting": "after_stream_voice_test",
      "conflict": "nervousness",
      "resolution": "quiet_growth",
      "activity": "cover_planning",
      "tone": "calm"
    },
    "conditions": {
      "activityCategories": [
        "broadcast"
      ]
    },
    "activityWeights": {
      "music": 2
    },
    "weight": 1,
    "start": "voice_test",
    "steps": {
      "voice_test": {
        "type": "check",
        "text": [
          {
            "when": {
              "memberFlags": [
                "coverPromise"
              ]
            },
            "text": "지난번 미뤄 둔 커버 약속이 아직 고정 댓글에 걸려 있다. 오늘 방송 중 {member}가 부른 한 소절에 그 댓글이 다시 끌어올려졌다. 방송이 끝나자 매니저가 조용히 말했다. \"지금, 한 번만 다시 불러 볼래요?\""
          },
          {
            "when": {
              "activity": [
                "sing"
              ]
            },
            "text": "노래 방송 도중, 신청곡 사이에 {member}가 즉흥으로 목청을 뽑아 부른 한 소절이 채팅을 뒤집어 놓았다. 팬들은 커버 프로젝트를 하자고 성화다. 방송이 끝나자 매니저가 그 소절을 한 번만 다시 불러 보라고 했다. 흥분이 가라앉은 뒤에도 그 소리가 나오는지 확인하려는 것이다."
          },
          {
            "when": {
              "activityCategories": [
                "game"
              ]
            },
            "text": "게임 방송 도중, 배경 음악을 따라 {member}가 목청을 뽑아 부른 한 소절이 채팅을 뒤집어 놓았다. 플레이는 잠시 뒷전이 됐다. 팬들은 커버 프로젝트를 하자고 성화다. 방송이 끝나자 매니저가 그 소절을 한 번만 다시 불러 보라고 했다. 흥분이 가라앉은 뒤에도 그 소리가 나오는지 확인하려는 것이다."
          },
          {
            "text": "방송에서 이야기를 나누던 중, {member}가 장난처럼 목청을 뽑아 부른 한 소절이 채팅을 뒤집어 놓았다. 팬들은 커버 프로젝트를 하자고 성화다. 방송이 끝나자 매니저가 그 소절을 한 번만 다시 불러 보라고 했다. 흥분이 가라앉은 뒤에도 그 소리가 나오는지 확인하려는 것이다."
          }
        ],
        "check": {
          "stat": "Vc",
          "difficulty": 72,
          "traitBonus": {
            "cover": 5,
            "instrument": 5,
            "calm": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "긴장한 기색도 없이 같은 소리가 나왔다. 매니저가 고개를 끄덕였다. \"이거면 바로 시작해도 되겠는데요.\"",
            "next": "ready_choice"
          },
          "partial": {
            "text": "음은 맞았지만 끝음이 살짝 떨렸다. 방송의 흥이 빠지자 긴장이 올라온 모양이다.",
            "next": "shaky_choice"
          },
          "fail": {
            "text": "두 번째 소절에서 목이 갈라졌다. {member}가 목을 쓰다듬으며 \"방송 땐 됐는데...\"라고 중얼거렸다.",
            "next": "strained_choice"
          }
        }
      },
      "ready_choice": {
        "type": "choice",
        "text": "목 상태는 확인됐다. 이제 무엇을 할지 정할 차례다.",
        "choices": [
          {
            "text": "정식 커버 프로젝트를 바로 시작한다",
            "effects": {
              "money": -300000,
              "hp": -3
            },
            "story": "편곡자와 바로 일정이 잡혔다. {member}가 작업실로 향하며 같은 소절을 몇 번이고 속으로 되뇌었다.",
            "next": "ready_record"
          },
          {
            "text": "팬 요청곡으로 가볍게 즉석 방송을 한다",
            "effects": {
              "hp": -9
            },
            "story": "다음 방송을 바로 노래 방송으로 바꿨다. 공지가 올라가자 신청곡이 쏟아졌다.",
            "next": "ready_request_end"
          },
          {
            "text": "오늘은 목을 아끼고 다음 방송을 준비한다",
            "story": "\"좋은 소리 났을 때 아껴 둘게요.\" {member}가 목 관리 루틴을 메모했다.",
            "next": "ready_save_end"
          }
        ]
      },
      "ready_record": {
        "type": "check",
        "text": "작업실의 정적 속에서 {member}가 헤드폰을 썼다. 방송 때의 그 소리를 다시 담아야 한다.",
        "check": {
          "stat": "Vc",
          "difficulty": 78,
          "traitBonus": {
            "perfectionist": 10,
            "cover": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "세 번째 테이크에서 편곡자가 손을 들었다. 방송 때보다 더 단단한 소리가 담겼다.",
            "next": "ready_release"
          },
          "partial": {
            "text": "좋은 테이크가 나왔지만 몇 군데는 다음 작업일에 다시 손보기로 했다.",
            "next": "ready_delay"
          },
          "fail": {
            "text": "작업실에서는 같은 소리가 나오지 않았다. {member}가 헤드폰을 벗고 한숨을 쉬었다.",
            "next": "ready_retake"
          }
        }
      },
      "ready_release": {
        "type": "end",
        "text": "공개한 커버가 천천히, 그러나 꾸준히 퍼졌다. \"방송에서 들은 그 소리\"를 찾아온 사람들이 댓글을 남겼다.",
        "effects": {
          "fans": 160,
          "fame": 2,
          "stats": {
            "Vc": 3
          },
          "hp": -4
        },
        "result": "success"
      },
      "ready_delay": {
        "type": "end",
        "text": "공개는 조금 늦어졌지만 완성도는 높았다. 다만 기다리다 지친 몇몇 팬은 다른 커버로 관심을 옮긴 뒤였다.",
        "effects": {
          "fans": 110,
          "fame": 1,
          "stats": {
            "Vc": 2
          },
          "hp": -4
        },
        "result": "partial"
      },
      "ready_retake": {
        "type": "end",
        "text": "데모는 다시 따기로 했다. 들인 비용이 아까웠지만, {member}는 \"어설픈 걸 내긴 싫다\"며 날짜를 다시 잡았다. 팬들은 기다리겠다는 댓글로 답했다.",
        "effects": {
          "fans": 60,
          "fame": 1,
          "stats": {
            "Vc": 2
          },
          "hp": -4,
          "memberFlags": {
            "coverDemoRetake": true
          }
        },
        "result": "fail"
      },
      "ready_request_end": {
        "type": "end",
        "text": "목 상태가 좋은 날 연 즉석 노래 방송은 신청곡을 하나하나 소화하며 길게 이어졌다.",
        "effects": {
          "fans": 110,
          "stats": {
            "Vc": 1
          }
        },
        "result": "success"
      },
      "ready_save_end": {
        "type": "end",
        "text": "좋은 컨디션을 아껴 두기로 했다. 당장 화제는 식었지만, 다음 노래 방송을 기다리는 팬들의 기대는 남았다.",
        "effects": {
          "hp": 8,
          "fans": -20
        },
        "result": "neutral"
      },
      "shaky_choice": {
        "type": "choice",
        "text": "소리가 흔들린 걸 {member}도 느꼈다. \"그래도 해 보고 싶어요.\" 무엇을 할지 정해야 한다.",
        "choices": [
          {
            "text": "정식 커버 프로젝트를 바로 시작한다",
            "effects": {
              "money": -300000,
              "hp": -3
            },
            "story": "흔들린 끝음을 잡는 연습부터 시작하기로 했다. 작업 일정은 넉넉하게 잡았다.",
            "next": "shaky_project_end"
          },
          {
            "text": "팬 요청곡으로 가볍게 즉석 방송을 한다",
            "effects": {
              "hp": -9
            },
            "story": "즉석 노래 방송을 열었다. 첫 곡은 오늘 그 한 소절이 들어간 곡이다.",
            "next": "shaky_live"
          },
          {
            "text": "오늘은 목을 아끼고 다음 방송을 준비한다",
            "story": "{member}가 고개를 끄덕였다. \"떨린 채로 하는 것보다 제대로 준비할게요.\"",
            "next": "shaky_save_end"
          }
        ]
      },
      "shaky_project_end": {
        "type": "end",
        "text": "연습에 시간을 들인 만큼 소리는 단단해졌다. 다만 공개 시점이 늦어져 화제성은 많이 식었다.",
        "effects": {
          "fans": 130,
          "fame": 2,
          "stats": {
            "Vc": 3
          },
          "hp": -4
        },
        "result": "partial"
      },
      "shaky_live": {
        "type": "check",
        "text": "첫 곡의 그 소절이 다가온다. 매니저 앞에서 떨렸던 끝음이 다시 걸린다.",
        "check": {
          "stat": "Vc",
          "difficulty": 70,
          "traitBonus": {
            "highTension": 5,
            "spontaneous": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "이번엔 흔들리지 않았다. 채팅창이 \"아까보다 더 좋다\"로 가득 찼다.",
            "next": "shaky_live_ok"
          },
          "partial": {
            "text": "끝음은 또 살짝 흔들렸지만, 노래 전체의 분위기는 좋았다.",
            "next": "shaky_live_mid"
          },
          "fail": {
            "text": "같은 곳에서 또 흔들렸다. {member}가 웃으며 넘겼지만 표정에 아쉬움이 묻어났다.",
            "next": "shaky_live_bad"
          }
        }
      },
      "shaky_live_ok": {
        "type": "end",
        "text": "흔들림을 넘어선 노래에 팬들이 더 크게 반응했다. 방송이 끝나고 {member}가 \"이제 좀 자신감이 생겼다\"고 했다.",
        "effects": {
          "fans": 110,
          "stats": {
            "Vc": 1
          }
        },
        "result": "success"
      },
      "shaky_live_mid": {
        "type": "end",
        "text": "노래 방송은 즐거웠다. 다만 그 소절만큼은 아직 숙제로 남았다.",
        "effects": {
          "fans": 70,
          "stats": {
            "Vc": 1
          }
        },
        "result": "partial"
      },
      "shaky_live_bad": {
        "type": "end",
        "text": "방송은 무난하게 끝났지만 같은 실수가 마음에 걸렸다. 팬들은 \"다음엔 될 거야\"라며 다음 노래 방송을 기다리겠다고 했다.",
        "effects": {
          "fans": 30,
          "stats": {
            "Vc": 1
          }
        },
        "result": "fail"
      },
      "shaky_save_end": {
        "type": "end",
        "text": "하루 쉬며 목을 풀자 흔들리던 끝음이 잡혔다. 다음 방송에서 그 소절을 다시 부르자 팬들이 \"기다린 보람이 있다\"고 했다.",
        "effects": {
          "hp": 8,
          "fans": -20
        },
        "result": "success"
      },
      "strained_choice": {
        "type": "choice",
        "text": "목이 갈라진 걸 확인한 매니저가 걱정스러운 얼굴이다. 그래도 팬들의 기대는 여전히 뜨겁다.",
        "choices": [
          {
            "text": "정식 커버 프로젝트를 바로 시작한다",
            "effects": {
              "money": -300000,
              "hp": -3
            },
            "story": "\"일정 잡아 두면 그때까진 괜찮아질 거예요.\" {member}가 작업 일정을 밀어붙였다.",
            "next": "strained_project_end"
          },
          {
            "text": "팬 요청곡으로 가볍게 즉석 방송을 한다",
            "effects": {
              "hp": -9
            },
            "story": "{member}가 고집스럽게 즉석 노래 방송을 켰다. 첫 곡부터 목을 가다듬는 소리가 잦았다.",
            "next": "strained_request_end"
          },
          {
            "text": "오늘은 목을 아끼고 다음 방송을 준비한다",
            "story": "{member}가 순순히 고개를 끄덕였다. \"오늘은 쉴게요. 대신 꼭 다시 들려줄게요.\"",
            "next": "strained_rest_end"
          }
        ]
      },
      "strained_project_end": {
        "type": "end",
        "text": "목이 다 낫지 않은 채 들어간 작업은 생각처럼 풀리지 않았다. 결과물은 나왔지만 {member} 스스로도 아쉬움이 컸다. 팬들은 \"다음 커버가 더 기대된다\"며 다독였다.",
        "effects": {
          "fans": 90,
          "fame": 1,
          "stats": {
            "Vc": 2
          },
          "hp": -4
        },
        "result": "fail"
      },
      "strained_request_end": {
        "type": "end",
        "text": "노래 방송은 몇 곡 만에 끝났다. 팬들은 \"목 상태가 안 좋아 보이니 쉬어 달라\"는 말을 더 많이 남겼다. {member}는 회복하면 제대로 다시 열겠다고 약속했다.",
        "effects": {
          "fans": 60,
          "stats": {
            "Vc": 1
          }
        },
        "result": "fail"
      },
      "strained_rest_end": {
        "type": "end",
        "text": "쉬기로 한 결정에 팬들이 오히려 안심했다. 며칠 뒤 회복된 목으로 부른 그 소절이 다시 작은 화제가 됐다.",
        "effects": {
          "hp": 8,
          "fans": -10
        },
        "result": "success"
      }
    }
  },
  {
    "id": "st_music_wrong_backing_track",
    "title": "틀린 반주, 트로트",
    "category": "music",
    "description": "저챗 중 즉석 신청곡을 틀었는데 제목만 같은 트로트 반주가 나왔다. 수습 방식을 두 번 고른 뒤 마지막 무대에서 판가름 난다.",
    "meta": {
      "theme": "broadcast_live",
      "setting": "chat_karaoke",
      "conflict": "miscommunication",
      "resolution": "viral_moment",
      "activity": "talk",
      "tone": "comedic"
    },
    "conditions": {
      "activityCategories": [
        "talk"
      ],
      "cooldown": 6
    },
    "traitWeights": {
      "chatter": 1.4,
      "highTension": 1.3,
      "roleplay": 1.3
    },
    "start": "intro",
    "steps": {
      "intro": {
        "type": "story",
        "text": [
          {
            "when": {
              "anyTraits": [
                "highTension"
              ]
            },
            "text": "저챗 방송이 한창 달아오른 순간, 후원 메시지가 떴다. '여름 끝 약속 불러 주세요!' 신이 난 {member}가 바로 검색해서 반주를 틀었는데… 흘러나온 건 제목만 같은, 꺾기가 가득한 트로트였다."
          },
          {
            "text": "조용히 이어지던 저챗 방송에 후원 메시지가 떴다. '여름 끝 약속 불러 주세요!' {member}가 검색해서 반주를 틀었는데… 흘러나온 건 제목만 같은, 꺾기가 가득한 트로트였다."
          }
        ],
        "next": "reaction"
      },
      "reaction": {
        "type": "choice",
        "text": "채팅창이 '그 노래 아니에요ㅋㅋㅋ'로 도배된다.",
        "choices": [
          {
            "text": "모르는 척 트로트를 끝까지 부른다",
            "story": "{member}가 진지한 표정으로 첫 소절을 꺾었다. 채팅창이 터졌다.",
            "next": "commit"
          },
          {
            "text": "솔직하게 사과하고 원래 곡을 찾는다",
            "story": "'잠깐만요, 제가 잘못 틀었네요!' 원곡을 찾는 사이 채팅창에서는 추천곡 대결이 벌어졌다.",
            "next": "viewer_vote"
          },
          {
            "text": "트로트를 상황극으로 소화한다",
            "conditions": {
              "anyTraits": [
                "roleplay"
              ]
            },
            "story": "{member}가 갑자기 '오늘 무대의 주인공, 꺾기의 여왕입니다'라며 캐릭터를 잡았다.",
            "next": "roleplay_stage"
          }
        ]
      },
      "commit": {
        "type": "choice",
        "text": "후렴이 다가온다. 처음 듣는 곡이라 가사를 모른다.",
        "choices": [
          {
            "text": "화면 가사를 보며 정면 돌파한다",
            "next": "trot_stage"
          },
          {
            "text": "모르는 부분은 즉석 개사로 채운다",
            "next": "improv_stage"
          }
        ]
      },
      "viewer_vote": {
        "type": "choice",
        "text": "원곡과 트로트 중 무엇을 부를지 투표를 붙였다.",
        "choices": [
          {
            "text": "투표 결과대로 두 곡을 이어 부른다",
            "story": "'둘 다'가 압도적이었다. 원곡에서 트로트로 넘어가는 메들리가 즉석에서 결정됐다.",
            "effects": {
              "hp": -3
            },
            "next": "medley_stage"
          },
          {
            "text": "원곡만 깔끔하게 부르고 마무리한다",
            "next": "end_clean"
          }
        ]
      },
      "trot_stage": {
        "type": "check",
        "text": "트로트 특유의 꺾기가 연달아 나온다. 박자를 놓치면 끝이다.",
        "check": {
          "stat": "Vc",
          "difficulty": 76,
          "traitBonus": {
            "rhythm": 10,
            "highTension": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "처음 듣는 곡을 완창했다. 마지막 꺾기에서 채팅창이 박수 이모티콘으로 뒤덮였다.",
            "next": "end_viral"
          },
          "partial": {
            "text": "꺾기는 반쯤 성공했다. 실패한 반이 더 웃겼다.",
            "next": "end_fun"
          },
          "fail": {
            "text": "가사를 따라가다 박자를 완전히 놓쳤다. 웃음보다 정적이 길었다.",
            "next": "end_cringe"
          }
        }
      },
      "improv_stage": {
        "type": "check",
        "text": "모르는 가사 자리에 방송 이야기와 시청자 닉네임을 즉석으로 끼워 넣는다.",
        "check": {
          "stat": "Bs",
          "difficulty": 72,
          "traitBonus": {
            "spontaneous": 10,
            "chatter": 5,
            "highTension": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "즉석 개사 버전이 원곡보다 낫다는 반응이 나왔다.",
            "next": "end_viral"
          },
          "partial": {
            "text": "웃음은 터졌지만 개사가 몇 번 엉켰다.",
            "next": "end_fun"
          },
          "fail": {
            "text": "개사가 엉키며 같은 줄만 세 번 불렀다.",
            "next": "end_cringe"
          }
        }
      },
      "roleplay_stage": {
        "type": "check",
        "text": "캐릭터를 유지한 채 끝까지 무대를 끌고 가야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 70,
          "traitBonus": {
            "roleplay": 15,
            "highTension": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "캐릭터가 너무 완벽해서 시청자들이 원래 노래를 잊었다.",
            "next": "end_viral"
          },
          "partial": {
            "text": "캐릭터는 살았지만 노래가 자꾸 웃음에 묻혔다.",
            "next": "end_fun"
          },
          "fail": {
            "text": "캐릭터와 노래 둘 다 놓쳤다.",
            "next": "end_cringe"
          }
        }
      },
      "medley_stage": {
        "type": "check",
        "text": "원곡에서 트로트로 넘어가는 순간, 분위기를 단번에 바꿔야 한다.",
        "check": {
          "stat": "Vc",
          "difficulty": 74,
          "traitBonus": {
            "cover": 10,
            "rhythm": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "두 곡을 잇는 순간이 '전환 장인'이라는 제목의 클립이 됐다.",
            "next": "end_viral"
          },
          "partial": {
            "text": "전환은 어설펐지만 그래서 더 웃겼다.",
            "next": "end_fun"
          },
          "fail": {
            "text": "전환이 어색하게 끊기며 노래가 멈췄다.",
            "next": "end_cringe"
          }
        }
      },
      "end_viral": {
        "type": "end",
        "result": "success",
        "text": "실수에서 시작된 무대가 이번 주 가장 많이 퍼진 클립이 됐다. 신청한 시청자는 다음에도 '틀린 곡'을 신청하겠다고 했다.",
        "effects": {
          "fans": 190,
          "fame": 1
        }
      },
      "end_fun": {
        "type": "end",
        "result": "partial",
        "text": "완벽한 무대는 아니었지만 채팅창은 내내 웃음바다였다. 다만 원래 곡을 기다린 시청자에게는 아쉬움이 남았다.",
        "effects": {
          "fans": 100
        }
      },
      "end_clean": {
        "type": "end",
        "result": "neutral",
        "text": "원곡을 깔끔하게 불러 마무리했다. 큰 화제는 없었지만 신청한 시청자는 만족했다.",
        "effects": {
          "fans": 50
        }
      },
      "end_cringe": {
        "type": "end",
        "result": "fail",
        "text": "방송이 끝난 뒤에도 그 장면이 자꾸 떠올랐다. {member}는 다음 방송에서 그 트로트를 제대로 연습해 '복수 무대'를 하겠다고 선언했다.",
        "effects": {
          "fans": 20,
          "stats": {
            "Vc": 1
          },
          "memberFlags": {
            "trotRevenge": true
          }
        }
      }
    }
  },
  {
    "id": "st_collab_duet_parts",
    "title": "화음 파트 나누기",
    "category": "collaboration",
    "description": "듀엣 제안(collab_003) 변형 A. 파트 분배 방식을 먼저 고르고, 녹음 판정이 아쉬우면 한 번 더 맞춰 볼 수 있다.",
    "meta": {
      "theme": "music_production",
      "setting": "duet_part_split",
      "conflict": "creative_block",
      "resolution": "lesson_learned",
      "activity": "sing",
      "tone": "calm"
    },
    "collab": {
      "min": 2,
      "max": 3
    },
    "conditions": {
      "activityCategories": [
        "music"
      ],
      "cooldown": 2
    },
    "weight": 1,
    "start": "split",
    "steps": {
      "split": {
        "type": "choice",
        "text": "{member}가 {partners}와 부르고 싶은 곡을 골랐다. 그런데 주선율을 누가 맡을지에서 막혔다. 둘 다 그 부분이 제일 좋다고 한다.",
        "choices": [
          {
            "text": "정식 듀엣 커버로 녹음실을 잡는다",
            "story": "녹음실을 하루 빌렸다. 비용이 든 만큼 파트 분배를 확실히 해야 한다.",
            "effects": {
              "money": -100000
            },
            "next": "studio"
          },
          {
            "text": "주선율을 양보하고 화음을 맡는다",
            "story": "{member}가 먼저 화음을 맡겠다고 했다. 쉬워 보이지만 화음은 남의 음을 끝까지 들어야 한다.",
            "next": "harmony"
          },
          {
            "text": "한 소절씩 번갈아 부르기로 한다",
            "story": "서로 한 소절씩 주고받기로 했다. 공평하지만 이음새가 어색해질 수 있다.",
            "next": "trade"
          }
        ]
      },
      "studio": {
        "type": "check",
        "text": "녹음실. 헤드폰 너머로 서로의 숨소리까지 들린다.",
        "check": {
          "stat": "Vc",
          "difficulty": 82,
          "traitBonus": {
            "cover": 10,
            "perfectionist": 5,
            "instrument": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "첫 테이크에서 소름 돋는 화음이 나왔다. 엔지니어가 그대로 쓰자고 했다.",
            "effects": {
              "fans": 60
            },
            "next": "end_studio_hit"
          },
          "success": {
            "text": "몇 번의 테이크 끝에 두 목소리가 제자리를 찾았다.",
            "next": "end_studio_hit"
          },
          "partial": {
            "text": "개별 파트는 좋은데, 합치니 어딘가 어긋난다.",
            "next": "retry"
          },
          "fail": {
            "text": "서로 주선율을 고집하다 시간이 다 갔다.",
            "next": "end_shelved"
          }
        }
      },
      "harmony": {
        "type": "check",
        "text": "{member}가 화음을 얹는다. 상대 음이 흔들리면 같이 흔들리지 않게 버텨야 한다.",
        "check": {
          "stat": "Vc",
          "difficulty": 72,
          "traitBonus": {
            "cover": 5,
            "instrument": 10,
            "calm": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "화음이 받쳐 주자 주선율이 더 빛났다. 상대가 '네 덕분'이라며 웃었다.",
            "next": "end_support"
          },
          "partial": {
            "text": "화음은 잘 얹었지만 몇 군데가 너무 튀었다.",
            "next": "retry"
          },
          "fail": {
            "text": "상대 음을 따라가다 화음이 주선율로 섞여 버렸다.",
            "next": "end_shelved"
          }
        }
      },
      "trade": {
        "type": "check",
        "text": "한 소절씩 넘겨받는 순간마다 숨이 맞아야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 75,
          "traitBonus": {
            "chatter": 5,
            "host": 10,
            "highTension": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "주고받는 호흡이 대화처럼 들렸다. 연습 과정을 그대로 방송에 올리자는 말이 나왔다.",
            "next": "end_support"
          },
          "partial": {
            "text": "이음새마다 반 박자씩 밀렸다.",
            "next": "retry"
          },
          "fail": {
            "text": "서로 넘겨받을 타이밍을 계속 놓쳤다.",
            "next": "end_shelved"
          }
        }
      },
      "retry": {
        "type": "choice",
        "text": "아쉬운 녹음본을 같이 들어 봤다. 어떻게 할까?",
        "choices": [
          {
            "text": "어긋난 부분만 다시 맞춘다",
            "effects": {
              "hp": -4
            },
            "next": "retry_check"
          },
          {
            "text": "지금 버전도 우리답다며 마무리한다",
            "story": "완벽하진 않아도 지금의 두 목소리를 남기기로 했다.",
            "next": "end_as_is"
          }
        ]
      },
      "retry_check": {
        "type": "check",
        "text": "어긋난 소절만 열 번째. 이번엔 서로의 음을 먼저 듣기로 했다.",
        "check": {
          "stat": "Vc",
          "difficulty": 74,
          "traitBonus": {
            "perfectionist": 10,
            "diligent": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "열한 번째 테이크에서 드디어 맞았다. 둘 다 동시에 '이거다'라고 외쳤다.",
            "effects": {
              "stats": {
                "Vc": 1
              }
            },
            "next": "end_retry_fixed"
          },
          "partial": {
            "text": "조금 나아졌다. 이 정도면 됐다고 서로를 다독였다.",
            "next": "end_as_is"
          },
          "fail": {
            "text": "붙잡을수록 둘 다 목이 지쳤다.",
            "next": "end_retry_worn"
          }
        }
      },
      "end_studio_hit": {
        "type": "end",
        "result": "success",
        "text": "정식 듀엣 커버가 완성됐다. 공개 첫날부터 '이 조합 정규 유닛 하자'는 댓글이 달렸다.",
        "effects": {
          "fans": 180,
          "fame": 2,
          "stats": {
            "Vc": 1
          },
          "relationship": 4,
          "hp": -7
        }
      },
      "end_support": {
        "type": "end",
        "result": "success",
        "text": "주선율을 고집하지 않은 덕분에 곡이 살았다. {member}는 '양보한 게 아니라 같이 만든 것'이라고 했다.",
        "effects": {
          "fans": 130,
          "fame": 1,
          "stats": {
            "Vc": 1
          },
          "relationship": 4,
          "hp": -4
        }
      },
      "end_as_is": {
        "type": "end",
        "result": "partial",
        "text": "거친 부분이 남은 듀엣이 공개됐다. 매끈하진 않아도 둘의 웃음소리가 담긴 버전이라는 평을 들었다.",
        "effects": {
          "fans": 90,
          "relationship": 3,
          "hp": -4
        }
      },
      "end_shelved": {
        "type": "end",
        "result": "fail",
        "text": "이번 듀엣은 보류됐다. 대신 둘 다 다음엔 파트 분배부터 정하고 시작하자는 교훈을 얻었다.",
        "effects": {
          "fans": 30,
          "stats": {
            "Vc": 1
          },
          "relationship": 1,
          "hp": -5,
          "memberFlags": {
            "duetRetry": true
          }
        }
      },
      "end_retry_fixed": {
        "type": "end",
        "result": "success",
        "text": [
          {
            "when": {
              "activity": [
                "recording"
              ]
            },
            "text": "어긋났던 소절을 끝까지 붙잡은 끝에 듀엣이 완성됐다. 엔지니어가 '처음 버전이랑 같은 곡 맞냐'며 웃었다. 다만 부스에 너무 오래 있었던 탓에 둘 다 목이 잠겨 한동안 고음은 쉬기로 했다."
          },
          {
            "text": "어긋났던 소절을 끝까지 붙잡은 끝에 듀엣이 완성됐다. 그날 밤 노래 방송에서 먼저 들려주자 '이게 처음엔 어긋났었다고?'라는 채팅이 쏟아졌다. 다만 둘 다 목을 너무 써서 한동안 고음은 쉬기로 했다."
          }
        ],
        "effects": {
          "fans": 110,
          "fame": 1,
          "relationship": 4,
          "hp": -3
        }
      },
      "end_retry_worn": {
        "type": "end",
        "result": "partial",
        "text": [
          {
            "when": {
              "activity": [
                "recording"
              ]
            },
            "text": "다시 맞출수록 목만 지쳐 듀엣 완성본은 다음으로 미뤘다. 대신 각자 따로 녹음한 파트는 좋다는 평을 들었고, 엔지니어가 '합치면 분명 좋을 것'이라며 파일을 남겨 뒀다."
          },
          {
            "text": "다시 맞출수록 목만 지쳐 듀엣 완성본은 다음으로 미뤘다. 대신 노래 방송에서 각자 맡았던 파트를 따로 들려주자 '둘이 합치면 어떨지 궁금하다'는 채팅이 이어졌다."
          }
        ],
        "effects": {
          "fans": 60,
          "relationship": 2,
          "hp": -5,
          "memberFlags": {
            "duetRetry": true
          }
        }
      }
    },
    "group": "collab_duet"
  },
  {
    "id": "st_collab_duet_request",
    "title": "10분 만에 맞춘 즉석 듀엣",
    "category": "collaboration",
    "description": "듀엣 제안(collab_003) 변형 B. 신청곡으로 즉석 듀엣을 하게 되어 음 맞추기 판정부터 시작한다.",
    "meta": {
      "theme": "music_live",
      "setting": "live_duet_request",
      "conflict": "time_pressure",
      "resolution": "risky_gamble",
      "activity": "sing",
      "tone": "hype"
    },
    "collab": {
      "min": 2,
      "max": 3
    },
    "conditions": {
      "activityCategories": [
        "music"
      ],
      "cooldown": 2
    },
    "weight": 1,
    "start": "warmup",
    "steps": {
      "warmup": {
        "type": "check",
        "text": [
          {
            "when": {
              "activity": [
                "recording"
              ]
            },
            "text": "{member}의 녹음 날, 잠깐 들른 {partners}에게 스태프가 즉석 듀엣 가이드를 남겨 보자고 했다. 스튜디오 예약 시간이 빠듯해 맞춰 볼 시간은 단 10분. 부스에서 헤드폰을 나눠 끼고 키부터 맞춰야 한다."
          },
          {
            "text": "{member}의 노래 방송에 {partners}가 놀러 왔다. 채팅창이 즉석 듀엣을 외친다. 연습 시간은 단 10분. 일단 키부터 맞춰야 한다."
          }
        ],
        "check": {
          "stat": "Vc",
          "difficulty": 72,
          "traitBonus": {
            "cover": 5,
            "instrument": 10,
            "spontaneous": 5
          }
        },
        "outcomes": {
          "success": {
            "text": [
              {
                "when": {
                  "activity": [
                    "recording"
                  ]
                },
                "text": "첫 소절에 바로 키가 맞았다. 유리창 너머 스태프가 엄지를 들어 보인다."
              },
              {
                "text": "첫 소절에 바로 키가 맞았다. 채팅창이 벌써 박수를 친다."
              }
            ],
            "next": "bond"
          },
          "partial": {
            "text": "키는 맞췄지만 서로 숨 쉬는 타이밍이 다르다.",
            "next": "bond_partial"
          },
          "fail": {
            "text": "키가 반음씩 계속 어긋났다. 아무리 친해도 오늘 목소리는 서로 낯설다. 남은 시간은 5분.",
            "effects": {
              "hp": -2
            },
            "next": "gamble_new"
          }
        }
      },
      "bond": {
        "type": "branch",
        "branches": [
          {
            "when": {
              "partyMinRelationship": 40
            },
            "next": "gamble_close"
          }
        ],
        "next": "gamble_new_s"
      },
      "gamble_close": {
        "type": "choice",
        "text": [
          {
            "when": {
              "activity": [
                "recording"
              ]
            },
            "text": "평소 많이 불러 본 사이다. 보면대에 놓인 건 팬 신청곡 1위, 고음 파트가 몰린 어려운 곡이다."
          },
          {
            "text": "평소 많이 불러 본 사이다. 채팅창에서 고음 파트가 몰린 어려운 곡이 신청됐다."
          }
        ],
        "choices": [
          {
            "text": "신청곡 그대로 도전한다",
            "story": "서로 눈빛만 보고 고개를 끄덕였다. 실패해도 웃을 수 있는 사이라 가능한 도박이다.",
            "next": "end_jackpot"
          },
          {
            "text": "둘 다 아는 쉬운 곡으로 바꾼다",
            "story": "무리하지 않기로 했다. 대신 화음을 하나 더 얹어 보기로 했다.",
            "next": "end_safe_sweet"
          }
        ]
      },
      "gamble_new": {
        "type": "choice",
        "text": [
          {
            "when": {
              "activity": [
                "recording"
              ]
            },
            "text": "아직 함께 불러 본 적이 없다. 보면대에 놓인 건 팬 신청곡 1위, 고음 파트가 몰린 어려운 곡이다."
          },
          {
            "text": "아직 함께 불러 본 적이 없다. 채팅창에서 고음 파트가 몰린 어려운 곡이 신청됐다."
          }
        ],
        "choices": [
          {
            "text": "모험이지만 신청곡에 도전한다",
            "story": "처음 맞춰 보는 호흡으로 어려운 곡에 도전했다. 결과는 반반이다.",
            "effects": {
              "relationship": 1
            },
            "next": "end_gamble_split"
          },
          {
            "text": "한 사람씩 솔로로 나눠 부른다",
            "story": [
              {
                "when": {
                  "activity": [
                    "recording"
                  ]
                },
                "text": "듀엣 대신 한 사람씩 파트를 나눠 녹음하기로 했다. 안전하지만 스태프는 조금 아쉬운 눈치다."
              },
              {
                "text": "듀엣 대신 솔로 릴레이로 바꿨다. 안전하지만 채팅창은 조금 아쉬워한다."
              }
            ],
            "next": "end_solo_relay"
          }
        ]
      },
      "end_jackpot": {
        "type": "end",
        "result": "success",
        "text": [
          {
            "when": {
              "activity": [
                "recording"
              ]
            },
            "text": "도박이 통했다. 10분 맞춰 본 듀엣이라고는 믿기 어려운 테이크에 컨트롤룸이 한동안 조용했다."
          },
          {
            "text": "도박이 통했다. 10분 연습한 듀엣이라고는 믿기 어려운 무대에 채팅창이 한동안 멈췄다."
          }
        ],
        "effects": {
          "fans": 180,
          "fame": 1,
          "stats": {
            "Vc": 1
          },
          "relationship": 4,
          "hp": -6
        }
      },
      "end_safe_sweet": {
        "type": "end",
        "result": "success",
        "text": [
          {
            "when": {
              "activity": [
                "recording"
              ]
            },
            "text": "쉬운 곡이었지만 즉석에서 얹은 화음이 녹음본에서 가장 좋은 부분이 됐다."
          },
          {
            "text": "쉬운 곡이었지만 즉석에서 얹은 화음이 의외의 명장면이 됐다."
          }
        ],
        "effects": {
          "fans": 120,
          "relationship": 3,
          "hp": -3
        }
      },
      "end_gamble_split": {
        "type": "end",
        "result": "partial",
        "text": [
          {
            "when": {
              "activity": [
                "recording"
              ]
            },
            "text": "후렴은 완벽했지만 2절은 엉망이었다. 그래도 스태프가 '처음인데 이 정도면'이라며 정식 듀엣 녹음 일정을 잡자고 했다."
          },
          {
            "text": "후렴은 완벽했지만 2절은 엉망이었다. 그래도 '처음인데 이 정도면'이라는 반응과 함께 정식 듀엣 요청이 들어왔다."
          }
        ],
        "effects": {
          "fans": 100,
          "relationship": 3,
          "hp": -6,
          "memberFlags": {
            "duetRetry": true
          }
        }
      },
      "end_solo_relay": {
        "type": "end",
        "result": "fail",
        "text": [
          {
            "when": {
              "activity": [
                "recording"
              ]
            },
            "text": "듀엣은 다음으로 미뤘다. 파트를 나눠 녹음한 버전도 나쁘지 않았지만, 다음엔 꼭 같이 부르자는 숙제가 남았다."
          },
          {
            "text": "듀엣은 다음으로 미뤘다. 솔로 릴레이도 나쁘지 않았지만, 다음엔 꼭 같이 부르자는 숙제가 남았다."
          }
        ],
        "effects": {
          "fans": 60,
          "relationship": 2,
          "hp": -3,
          "memberFlags": {
            "duetRetry": true
          }
        }
      },
      "bond_partial": {
        "type": "branch",
        "branches": [
          {
            "when": {
              "partyMinRelationship": 40
            },
            "next": "gamble_close_p"
          }
        ],
        "next": "gamble_new_p"
      },
      "gamble_new_s": {
        "type": "choice",
        "text": [
          {
            "when": {
              "activity": [
                "recording"
              ]
            },
            "text": "키는 금방 맞았지만 아직 함께 불러 본 적은 없다. 보면대에 놓인 건 팬 신청곡 1위, 고음 파트가 몰린 어려운 곡이다."
          },
          {
            "text": "키는 금방 맞았지만 아직 함께 불러 본 적은 없다. 채팅창에서 고음 파트가 몰린 어려운 곡이 신청됐다."
          }
        ],
        "choices": [
          {
            "text": "모험이지만 신청곡에 도전한다",
            "effects": {
              "relationship": 1
            },
            "next": "end_fresh_gamble",
            "story": [
              {
                "when": {
                  "activity": [
                    "recording"
                  ]
                },
                "text": "맞춰 둔 키를 믿고 어려운 곡에 도전했다. 처음 맞춰 보는 호흡인데도 첫 가이드부터 깔끔하다."
              },
              {
                "text": "맞춰 둔 키를 믿고 어려운 곡에 도전했다. 처음 맞춰 보는 호흡인데도 첫 소절부터 채팅창 반응이 좋다."
              }
            ]
          },
          {
            "text": "한 사람씩 솔로로 나눠 부른다",
            "next": "end_fresh_relay",
            "story": [
              {
                "when": {
                  "activity": [
                    "recording"
                  ]
                },
                "text": "키는 맞았지만 무리하지 않기로 했다. 한 사람씩 파트를 나눠 녹음하고, 듀엣은 다음 녹음으로 아껴 두기로 했다."
              },
              {
                "text": "키는 맞았지만 무리하지 않기로 했다. 서로의 솔로를 이어 부르고 듀엣은 다음으로 아껴 두자, 채팅창이 다음을 약속하라고 외친다."
              }
            ]
          }
        ]
      },
      "end_fresh_gamble": {
        "type": "end",
        "result": "success",
        "text": [
          {
            "when": {
              "activity": [
                "recording"
              ]
            },
            "text": "처음 함께 부른 듀엣이라고는 믿기 어려울 만큼 고음이 깔끔하게 맞았다. 엔지니어가 '이 조합 처음 맞냐'며 녹음본을 두 번이나 돌려 들었다."
          },
          {
            "text": "처음 함께 부른 듀엣이라고는 믿기 어려울 만큼 고음이 깔끔하게 맞았다. '이 조합 처음 맞냐'는 채팅이 쏟아졌다."
          }
        ],
        "effects": {
          "fans": 150,
          "relationship": 3,
          "hp": -6
        }
      },
      "end_fresh_relay": {
        "type": "end",
        "result": "success",
        "text": [
          {
            "when": {
              "activity": [
                "recording"
              ]
            },
            "text": "키가 잘 맞은 덕에 나눠 녹음한 파트가 매끄럽게 이어 붙었다. 엔지니어는 다음엔 꼭 같이 부스에 들어가 보라고 했다."
          },
          {
            "text": "키가 잘 맞은 덕에 솔로 릴레이가 매끄럽게 이어졌다. '다음엔 꼭 같이 불러 달라'는 채팅이 끝까지 이어졌다."
          }
        ],
        "effects": {
          "fans": 110,
          "relationship": 2,
          "hp": -3,
          "memberFlags": {
            "duetRetry": true
          }
        }
      },
      "gamble_close_p": {
        "type": "choice",
        "text": [
          {
            "when": {
              "activity": [
                "recording"
              ]
            },
            "text": "숨 쉬는 타이밍은 아직 어긋나지만 평소 많이 불러 본 사이다. 보면대에 놓인 건 팬 신청곡 1위, 고음 파트가 몰린 어려운 곡이다."
          },
          {
            "text": "숨 쉬는 타이밍은 아직 어긋나지만 평소 많이 불러 본 사이다. 채팅창에서 고음 파트가 몰린 어려운 곡이 신청됐다."
          }
        ],
        "choices": [
          {
            "text": "신청곡 그대로 도전한다",
            "next": "end_close_rough",
            "story": [
              {
                "when": {
                  "activity": [
                    "recording"
                  ]
                },
                "text": "어긋난 호흡은 서로 믿고 맞춰 가기로 했다. 유리창 너머 엔지니어가 숨을 죽인다."
              },
              {
                "text": "어긋난 호흡은 서로 믿고 맞춰 가기로 했다. 첫 소절부터 채팅창이 숨을 죽인다."
              }
            ]
          },
          {
            "text": "둘 다 아는 쉬운 곡으로 바꾼다",
            "next": "end_close_easy",
            "story": [
              {
                "when": {
                  "activity": [
                    "recording"
                  ]
                },
                "text": "호흡부터 맞추기로 했다. 쉬운 곡이라면 숨 쉬는 타이밍도 금방 맞출 수 있다. 엔지니어는 살짝 아쉬운 눈치다."
              },
              {
                "text": "호흡부터 맞추기로 했다. 쉬운 곡이라면 숨 쉬는 타이밍도 금방 맞출 수 있다. 채팅창은 살짝 아쉬워한다."
              }
            ]
          }
        ]
      },
      "end_close_rough": {
        "type": "end",
        "result": "partial",
        "text": [
          {
            "when": {
              "activity": [
                "recording"
              ]
            },
            "text": "고음 클라이맥스는 소름 돋게 맞았다. 다만 1절 내내 숨이 엇갈려, 녹음본에서 쓸 수 있는 건 후렴 30초뿐이었다. 그 30초가 너무 좋아서 다시 녹음할 이유가 생겼다."
          },
          {
            "text": "고음 클라이맥스는 소름 돋게 맞았다. 다만 1절 내내 숨이 엇갈려, 클립으로 남은 건 후렴 30초뿐이었다. 그래도 '후렴만으로 충분하다'는 채팅이 많았다."
          }
        ],
        "effects": {
          "fans": 140,
          "relationship": 4,
          "hp": -6
        }
      },
      "end_close_easy": {
        "type": "end",
        "result": "partial",
        "text": [
          {
            "when": {
              "activity": [
                "recording"
              ]
            },
            "text": "쉬운 곡이라 끝까지 안정적으로 녹음했고, 둘의 호흡도 조금씩 맞아 갔다. 대신 기대했던 도전이 없어 엔지니어에게 '무난하다'는 말만 들었다."
          },
          {
            "text": "쉬운 곡이라 끝까지 안정적으로 불렀고, 둘의 호흡도 조금씩 맞아 갔다. 대신 기대했던 도전이 없어 '오늘은 무난했다'는 채팅에 그쳤다."
          }
        ],
        "effects": {
          "fans": 90,
          "relationship": 3,
          "hp": -3
        }
      },
      "gamble_new_p": {
        "type": "choice",
        "text": [
          {
            "when": {
              "activity": [
                "recording"
              ]
            },
            "text": "숨 쉬는 타이밍이 다른 데다 아직 함께 불러 본 적도 없다. 보면대에 놓인 건 팬 신청곡 1위, 고음 파트가 몰린 어려운 곡이다."
          },
          {
            "text": "숨 쉬는 타이밍이 다른 데다 아직 함께 불러 본 적도 없다. 채팅창에서 고음 파트가 몰린 어려운 곡이 신청됐다."
          }
        ],
        "choices": [
          {
            "text": "모험이지만 신청곡에 도전한다",
            "effects": {
              "relationship": 1
            },
            "next": "end_new_rough",
            "story": [
              {
                "when": {
                  "activity": [
                    "recording"
                  ]
                },
                "text": "맞춰 둔 키 하나만 믿고 어려운 곡에 도전했다. 헤드폰 너머 상대의 숨소리에 온 신경을 모았다."
              },
              {
                "text": "맞춰 둔 키 하나만 믿고 어려운 곡에 도전했다. 채팅창이 반쯤은 걱정, 반쯤은 기대다."
              }
            ]
          },
          {
            "text": "한 사람씩 솔로로 나눠 부른다",
            "next": "end_new_relay",
            "story": [
              {
                "when": {
                  "activity": [
                    "recording"
                  ]
                },
                "text": "듀엣 대신 한 사람씩 파트를 나눠 녹음하기로 했다. 키를 맞춰 둔 덕에 이어 붙이는 부분은 자연스럽다."
              },
              {
                "text": "듀엣 대신 솔로 릴레이로 바꿨다. 키를 맞춰 둔 덕에 이어 부르는 부분은 자연스럽다. 채팅창은 조금 아쉬워한다."
              }
            ]
          }
        ]
      },
      "end_new_rough": {
        "type": "end",
        "result": "partial",
        "text": [
          {
            "when": {
              "activity": [
                "recording"
              ]
            },
            "text": "고음 한 구간이 기적처럼 맞아 그 부분만은 녹음본에 그대로 쓰기로 했다. 나머지는 숨이 엇갈려 다시 녹음해야 해서, 다음 녹음 일정을 함께 잡았다."
          },
          {
            "text": "고음 한 구간이 기적처럼 맞아 그 장면만 클립으로 퍼졌다. 나머지는 숨이 엇갈려 아쉬웠고, '정식으로 맞춰서 다시 불러 달라'는 채팅이 이어졌다."
          }
        ],
        "effects": {
          "fans": 110,
          "relationship": 3,
          "hp": -6,
          "memberFlags": {
            "duetRetry": true
          }
        }
      },
      "end_new_relay": {
        "type": "end",
        "result": "partial",
        "text": [
          {
            "when": {
              "activity": [
                "recording"
              ]
            },
            "text": "각자 맡은 파트는 깔끔하게 녹음됐고, 키를 맞춰 둔 덕에 이음새도 자연스러웠다. 다만 둘이 함께 부른 소절은 한 줄도 남지 않았다."
          },
          {
            "text": "각자 솔로로 실력은 확실히 보여 줬고, 키를 맞춰 둔 덕에 이음새도 자연스러웠다. 다만 듀엣을 기대한 채팅은 끝까지 아쉬워했다."
          }
        ],
        "effects": {
          "fans": 80,
          "relationship": 2,
          "hp": -3,
          "memberFlags": {
            "duetRetry": true
          }
        }
      }
    },
    "group": "collab_duet"
  },
  {
    "id": "st_collab_escape_room",
    "title": "방탈출 합방",
    "category": "collaboration",
    "description": "파트너와 함께 온라인 방탈출에 도전한다. 관계도에 따라 호흡이 달라진다.",
    "meta": {
      "theme": "collab_content",
      "setting": "escape_room_game",
      "conflict": "miscommunication",
      "resolution": "teamwork",
      "activity": "puzzle_game",
      "tone": "comedic"
    },
    "collab": {
      "min": 2,
      "max": 3
    },
    "conditions": {
      "activityCategories": [
        "broadcast"
      ],
      "blockedActivityCategories": [
        "music"
      ],
      "cooldown": 5
    },
    "activityWeights": {
      "talk": 1.5,
      "game": 1.5
    },
    "start": "intro",
    "steps": {
      "intro": {
        "type": "story",
        "text": "{member}가 {partners}와 함께 온라인 방탈출 게임 합방을 켰다. 제한 시간은 60분, 단서는 방 곳곳에 흩어져 있다.",
        "next": "chemistry"
      },
      "chemistry": {
        "type": "branch",
        "branches": [
          {
            "when": {
              "partyMinRelationship": 35
            },
            "next": "synergy"
          }
        ],
        "next": "awkward"
      },
      "synergy": {
        "type": "story",
        "text": "평소 합이 좋은 사이답게 역할 분담이 자연스럽다. 시작 10분 만에 첫 번째 방을 열었다.",
        "effects": {
          "fans": 20
        },
        "next": "last_room"
      },
      "awkward": {
        "type": "story",
        "text": "아직 서로 호흡이 덜 맞는다. 같은 단서를 두 사람이 동시에 들고 있는 상황이 몇 번이나 반복됐다. 채팅창은 그 장면마다 폭소다.",
        "next": "last_room"
      },
      "last_room": {
        "type": "choice",
        "text": "마지막 방. 남은 시간은 8분. 풀어야 할 자물쇠는 세 개다.",
        "choices": [
          {
            "text": "{member}가 지휘를 맡아 하나씩 정리한다",
            "story": "{member}가 '지금부터 내 말 들어!'라고 외쳤다. 모두가 잠시 조용해졌다.",
            "next": "lead"
          },
          {
            "text": "각자 떠오르는 대로 마구 시도한다",
            "story": "셋이 동시에 다른 번호를 외치기 시작했다. 혼돈 그 자체다.",
            "next": "chaos"
          }
        ]
      },
      "lead": {
        "type": "check",
        "text": "지휘에 맞춰 단서를 하나씩 맞춰 나간다. 마지막 자물쇠의 힌트는 처음 방에 있던 그림이다.",
        "check": {
          "stat": "Bs",
          "difficulty": 74,
          "traitBonus": {
            "host": 10,
            "brain": 10,
            "calm": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "마지막 자물쇠가 열렸다. 남은 시간 2분 17초.",
            "next": "end_clear"
          },
          "partial": {
            "text": "시간 종료 3초 전, 문이 열렸다. 모두의 비명이 합쳐졌다.",
            "next": "end_last_second"
          },
          "fail": {
            "text": "마지막 번호 한 자리가 틀렸다. 문 너머로 탈출 실패 음악이 울린다.",
            "next": "end_timeout"
          }
        }
      },
      "chaos": {
        "type": "check",
        "text": "누가 무엇을 풀고 있는지 아무도 모른다. 그런데 이상하게 자물쇠가 하나씩 열린다.",
        "check": {
          "stat": "Ga",
          "difficulty": 70,
          "traitBonus": {
            "spontaneous": 10,
            "highTension": 5,
            "brain": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "마구잡이로 누른 번호가 정답이었다. 누가 맞혔는지는 끝내 아무도 모른다.",
            "next": "end_clear"
          },
          "partial": {
            "text": "탈출은 못 했지만 역대급 혼돈 방송으로 남았다.",
            "next": "end_chaos_fun"
          },
          "fail": {
            "text": "혼돈 속에서 시간만 흘렀다.",
            "next": "end_timeout"
          }
        }
      },
      "end_clear": {
        "type": "end",
        "result": "success",
        "text": "탈출 성공. {member}와 {partners}는 방송이 끝난 뒤에도 한참 동안 서로의 활약을 칭찬했다.",
        "effects": {
          "fans": 140,
          "fame": 1,
          "relationship": 4
        }
      },
      "end_last_second": {
        "type": "end",
        "result": "success",
        "text": "3초 남기고 극적인 탈출. 그 3초가 이번 주 가장 많이 돌려 본 클립이 됐다.",
        "effects": {
          "fans": 130,
          "fame": 1,
          "relationship": 3
        }
      },
      "end_chaos_fun": {
        "type": "end",
        "result": "partial",
        "text": "탈출은 실패했지만 웃음은 대성공. 시청자들은 이 조합으로 한 번 더 해 달라고 졸랐다.",
        "effects": {
          "fans": 100,
          "relationship": 2
        }
      },
      "end_timeout": {
        "type": "end",
        "result": "fail",
        "text": "시간 초과. '다음엔 꼭 나간다'며 다 같이 재도전을 약속했다.",
        "effects": {
          "fans": 40,
          "relationship": 1
        }
      }
    }
  },
  {
    "id": "st_collab_horror_bet",
    "title": "안 무서운 척 내기",
    "category": "collaboration",
    "description": "공포게임 동반 입장(collab_002) 변형 B. '먼저 비명 지르면 벌칙' 내기로 시작해 리액션 판정 하나로 승부가 갈린다.",
    "meta": {
      "theme": "collab_content",
      "setting": "horror_bet_stream",
      "conflict": "rivalry",
      "resolution": "graceful_loss",
      "activity": "horror",
      "tone": "comedic"
    },
    "collab": {
      "min": 2,
      "max": 3
    },
    "timeSlot": "lateNight",
    "conditions": {
      "activityCategories": [
        "horror"
      ],
      "cooldown": 3
    },
    "weight": 1,
    "start": "bet",
    "steps": {
      "bet": {
        "type": "choice",
        "text": "공포게임을 켜기 직전, {partners}가 내기를 걸었다. '먼저 비명 지르는 사람이 다음 방송에서 벌칙.' {member}의 대답은?",
        "choices": [
          {
            "text": "내기를 받고 진지하게 버틴다",
            "story": "{member}가 표정을 굳히고 볼륨을 키웠다. 진지한 만큼 더 무서워진다.",
            "next": "endure"
          },
          {
            "text": "몰래 상대를 놀래킬 장치를 준비한다",
            "story": "{member}가 화면 밖에서 효과음 버튼을 하나 준비했다. 채팅창만 그 사실을 안다.",
            "next": "prank"
          }
        ]
      },
      "endure": {
        "type": "check",
        "text": "게임 속 문이 저절로 열린다. 다들 입을 꾹 다물었지만 숨소리가 거칠어진다.",
        "check": {
          "stat": "Ga",
          "difficulty": 78,
          "traitBonus": {
            "horror": 15,
            "calm": 10
          }
        },
        "outcomes": {
          "success": {
            "text": "먼저 비명을 지른 건 {partners} 쪽이었다. {member}는 덤덤한 척 웃었다.",
            "next": "end_win_bet"
          },
          "partial": {
            "text": "거의 동시에 비명이 터졌다. 누가 먼저였는지 채팅창에서 판정 논쟁이 붙었다.",
            "next": "tiebreak"
          },
          "fail": {
            "text": "첫 점프 스케어에서 {member}가 가장 먼저, 가장 크게 소리를 질렀다.",
            "next": "end_lose_bet"
          }
        }
      },
      "prank": {
        "type": "check",
        "text": "가장 조용한 장면에서 {member}가 버튼을 눌렀다. 타이밍이 전부다.",
        "check": {
          "stat": "Bs",
          "difficulty": 70,
          "traitBonus": {
            "roleplay": 10,
            "highTension": 10,
            "spontaneous": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "완벽한 타이밍이었다. {partners}의 비명이 게임 소리를 덮었다.",
            "next": "end_prank_hit"
          },
          "partial": {
            "text": "효과음은 먹혔지만 웃음을 참지 못한 {member}가 들통났다.",
            "next": "tiebreak"
          },
          "fail": {
            "text": "버튼을 누르기 직전 게임 속 귀신이 먼저 나왔다. 비명을 지른 건 {member}였다.",
            "next": "end_lose_bet"
          }
        }
      },
      "tiebreak": {
        "type": "choice",
        "text": "판정이 애매하다. 채팅창은 재경기를 외친다.",
        "choices": [
          {
            "text": "깔끔하게 졌다고 인정한다",
            "story": "{member}가 먼저 '내가 졌다'고 손을 들었다. 채팅창에 박수가 쏟아졌다.",
            "effects": {
              "relationship": 2
            },
            "next": "end_graceful"
          },
          {
            "text": "한 판 더 하자고 우긴다",
            "story": "재경기가 시작됐지만 이미 모두 지쳐서 비명보다 웃음이 먼저 나왔다.",
            "effects": {
              "hp": -3
            },
            "next": "end_lose_bet"
          }
        ]
      },
      "end_win_bet": {
        "type": "end",
        "result": "success",
        "text": "내기는 {member}의 승리. 다음 방송에서 진 쪽이 받을 벌칙을 고르는 투표가 벌써 올라왔다.",
        "effects": {
          "fans": 170,
          "fame": 1,
          "relationship": 3,
          "hp": -6
        }
      },
      "end_prank_hit": {
        "type": "end",
        "result": "success",
        "text": "몰래카메라 성공. 당한 쪽도 결국 웃음을 터뜨렸고, '복수하겠다'는 예고가 다음 합방 약속이 됐다.",
        "effects": {
          "fans": 180,
          "relationship": 2,
          "hp": -4,
          "memberFlags": {
            "horrorRematch": true
          }
        }
      },
      "end_graceful": {
        "type": "end",
        "result": "partial",
        "text": "벌칙은 {member}의 몫이 됐다. 하지만 깔끔하게 인정하는 모습에 '멋지게 졌다'는 반응이 더 많았다.",
        "effects": {
          "fans": 110,
          "relationship": 3,
          "hp": -4
        }
      },
      "end_lose_bet": {
        "type": "end",
        "result": "fail",
        "text": "내기는 {member}의 패배. 다음 방송 벌칙은 시청자 투표로 정해졌다. {member}는 '다음 공포게임에서 갚아 주겠다'고 별렀다.",
        "effects": {
          "fans": 60,
          "relationship": 1,
          "hp": -6,
          "memberFlags": {
            "horrorRematch": true
          }
        }
      }
    },
    "group": "collab_horror"
  },
  {
    "id": "st_collab_horror_school",
    "title": "불 꺼진 폐교",
    "category": "collaboration",
    "description": "공포게임 동반 입장(collab_002) 변형 A. 관계도에 따라 출발 분위기가 갈리고, 탐색 판정 뒤 추격전이 이어진다.",
    "meta": {
      "theme": "game_content",
      "setting": "abandoned_school_horror",
      "conflict": "nervousness",
      "resolution": "comeback_win",
      "activity": "horror",
      "tone": "tense"
    },
    "collab": {
      "min": 2,
      "max": 3
    },
    "timeSlot": "lateNight",
    "conditions": {
      "activityCategories": [
        "horror"
      ],
      "cooldown": 3
    },
    "weight": 1,
    "start": "trust",
    "steps": {
      "trust": {
        "type": "branch",
        "branches": [
          {
            "when": {
              "partyMinRelationship": 40
            },
            "next": "together"
          }
        ],
        "next": "apart"
      },
      "together": {
        "type": "story",
        "text": "{member}와 {partners}가 불 꺼진 폐교 게임을 켰다. 평소 믿는 사이라 그런지 '손 잡고 가자'는 말이 먼저 나왔다. 그래도 복도 끝의 발소리는 무섭다.",
        "next": "route"
      },
      "apart": {
        "type": "story",
        "text": "{member}와 {partners}가 불 꺼진 폐교 게임을 켰다. 아직 서로 어색해서 무섭다는 말도 못 하고, 다들 괜찮은 척 목소리만 커진다.",
        "effects": {
          "hp": -2
        },
        "next": "route"
      },
      "route": {
        "type": "choice",
        "text": "교무실 열쇠를 찾아야 한다. 복도는 길고, 손전등 배터리는 반밖에 없다.",
        "choices": [
          {
            "text": "{member}가 앞장서서 길을 연다",
            "story": "{member}가 '내가 갈게'라며 손전등을 들었다. 목소리가 미세하게 떨린다.",
            "next": "explore_lead"
          },
          {
            "text": "다 같이 붙어서 한 칸씩 움직인다",
            "story": "모두가 한 덩어리로 붙어 움직였다. 느리지만 혼자 남는 사람은 없다.",
            "effects": {
              "relationship": 2
            },
            "next": "explore_group"
          },
          {
            "text": "숨어서 괴물이 지나가길 기다린다",
            "story": "사물함 안에 숨었다. 숨소리만 들리는 시간이 길어진다.",
            "next": "explore_hide"
          }
        ]
      },
      "explore_lead": {
        "type": "check",
        "text": "앞장선 {member}의 손전등이 깜빡인다. 복도 끝에서 무언가가 움직였다.",
        "check": {
          "stat": "Ga",
          "difficulty": 80,
          "traitBonus": {
            "horror": 15,
            "calm": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "{member}가 비명 대신 침착하게 길을 꺾었다. 열쇠는 바로 옆 교실에 있었다.",
            "next": "chase"
          },
          "partial": {
            "text": "열쇠는 찾았지만 {member}의 비명에 괴물이 깨어났다.",
            "next": "chase"
          },
          "fail": {
            "text": "앞장서던 {member}가 제일 먼저 잡혔다. 남은 사람들의 비명이 이어졌다.",
            "next": "end_caught"
          }
        }
      },
      "explore_group": {
        "type": "check",
        "text": "한 덩어리로 움직이니 누가 어디를 비추는지 엉망이다. 그래도 서로의 목소리가 위안이 된다.",
        "check": {
          "stat": "Ga",
          "difficulty": 76,
          "traitBonus": {
            "horror": 10,
            "highTension": 5,
            "calm": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "서로 다른 쪽을 비추며 단서를 빠르게 모았다. 열쇠를 찾았다.",
            "next": "chase"
          },
          "partial": {
            "text": "열쇠는 찾았지만 너무 시끄러웠다. 복도 끝에서 무언가가 달려온다.",
            "next": "chase"
          },
          "fail": {
            "text": "뭉쳐 다니다 막다른 교실에 갇혔다.",
            "next": "end_caught"
          }
        }
      },
      "explore_hide": {
        "type": "check",
        "text": "괴물의 발소리가 사물함 바로 앞에서 멈췄다. 숨을 참아야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 70,
          "traitBonus": {
            "roleplay": 10,
            "highTension": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "발소리가 멀어졌다. 숨 참는 장면이 라디오극처럼 생생하게 방송됐다.",
            "next": "end_hidden"
          },
          "partial": {
            "text": "들키진 않았지만 시간을 너무 많이 썼다. 손전등이 꺼졌다.",
            "next": "end_hidden_dark"
          },
          "fail": {
            "text": "누군가의 딸꾹질 한 번에 사물함 문이 열렸다.",
            "next": "end_caught"
          }
        }
      },
      "chase": {
        "type": "check",
        "text": "추격전이다. 교문까지 달려야 한다. 마지막 계단에서 손이 미끄러진다.",
        "check": {
          "stat": "Ga",
          "difficulty": 78,
          "traitBonus": {
            "horror": 10,
            "competitive": 5,
            "spontaneous": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "교문을 넘는 순간 모두의 비명이 환호로 바뀌었다. 단 한 명도 잡히지 않았다.",
            "effects": {
              "fans": 60
            },
            "next": "end_escape"
          },
          "success": {
            "text": "마지막 순간 교문을 넘었다.",
            "next": "end_escape"
          },
          "partial": {
            "text": "{member}는 빠져나왔지만 한 명이 잡혔다. 구하러 돌아갈 시간은 없다.",
            "next": "end_half_escape"
          },
          "fail": {
            "text": "교문 바로 앞에서 모두 잡혔다.",
            "next": "end_caught"
          }
        }
      },
      "end_escape": {
        "type": "end",
        "result": "success",
        "text": "폐교 탈출 성공. 떨던 목소리로 끝까지 버틴 장면이 클립이 됐다. {member}는 '다음 공포게임도 이 조합으로'라고 했다.",
        "effects": {
          "fans": 170,
          "fame": 1,
          "relationship": 4,
          "hp": -8,
          "memberFlags": {
            "horrorBuddy": true
          }
        }
      },
      "end_half_escape": {
        "type": "end",
        "result": "partial",
        "text": "반쯤 성공한 탈출. 잡힌 쪽은 방송이 끝날 때까지 '두고 갔다'며 서운함을 토로했고, 시청자들은 그 장면을 더 좋아했다.",
        "effects": {
          "fans": 110,
          "relationship": 2,
          "hp": -8
        }
      },
      "end_hidden": {
        "type": "end",
        "result": "partial",
        "text": "끝까지 숨어서 버텼다. 탈출은 못 했지만 '숨 참기 방송'이라는 별명이 붙었다.",
        "effects": {
          "fans": 100,
          "relationship": 3,
          "hp": -5
        }
      },
      "end_hidden_dark": {
        "type": "end",
        "result": "fail",
        "text": "손전등이 꺼진 채 방송 시간이 끝났다. 다음엔 배터리부터 챙기자며 다 같이 웃었다.",
        "effects": {
          "fans": 60,
          "relationship": 2,
          "hp": -5
        }
      },
      "end_caught": {
        "type": "end",
        "result": "fail",
        "text": "모두 잡혔다. 그래도 비명 모음 클립은 오늘 가장 많이 돌았다. 재도전 날짜를 잡자는 말이 먼저 나왔다.",
        "effects": {
          "fans": 50,
          "relationship": -1,
          "hp": -8,
          "memberFlags": {
            "horrorRematch": true
          }
        }
      }
    },
    "group": "collab_horror"
  },
  {
    "id": "st_collab_host_condition",
    "title": "진행자의 컨디션 점검",
    "category": "collaboration",
    "description": "3기 합방 진행 맡기(pe_shibuki_2) 변형 B. 진행자 HP에 따라 출발이 갈리고, 진행 판정 결과(성공 / 부분성공 / 실패)마다 다른 분위기에서 출연자 컨디션을 챙기는 선택이 이어진다.",
    "meta": {
      "theme": "member_growth",
      "setting": "host_condition_check",
      "conflict": "fatigue",
      "resolution": "audience_help",
      "activity": "joint_stream",
      "tone": "emotional"
    },
    "memberId": "shibuki",
    "collab": {
      "min": 2,
      "max": 3
    },
    "conditions": {
      "activityCategories": [
        "broadcast"
      ],
      "cooldown": 5
    },
    "weight": 2,
    "start": "condition",
    "steps": {
      "condition": {
        "type": "branch",
        "branches": [
          {
            "when": {
              "maxHp": 59
            },
            "next": "tired_host"
          }
        ],
        "next": "fresh_host"
      },
      "tired_host": {
        "type": "story",
        "text": [
          {
            "when": {
              "anyTraits": [
                "unlucky"
              ]
            },
            "text": "하필 컨디션이 바닥인 날 합방 진행이 잡혔다. '역시 운이 없다'며 웃었지만, {member}의 목소리는 평소보다 낮다. {partners}가 걱정스러운 눈치다."
          },
          {
            "text": "컨디션이 바닥인 날 합방 진행이 잡혔다. {member}의 목소리는 평소보다 낮고, {partners}가 걱정스러운 눈치다."
          }
        ],
        "effects": {
          "hp": -2
        },
        "next": "run"
      },
      "fresh_host": {
        "type": "story",
        "text": "{member}가 오늘 합방의 진행을 맡았다. 컨디션은 좋다. 대신 이번엔 출연자 중 한 명이 피곤해 보인다.",
        "next": "run"
      },
      "run": {
        "type": "check",
        "text": "방송이 시작됐다. 진행자는 자기 컨디션과 출연자의 표정을 동시에 살펴야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 74,
          "traitBonus": {
            "host": 15,
            "calm": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "{member}가 대화를 고르게 나누며 누구도 무리하지 않게 흐름을 잡았다.",
            "next": "care"
          },
          "partial": {
            "text": "흐름은 이어졌지만 중간중간 진행이 멈칫했다.",
            "next": "care_partial"
          },
          "fail": {
            "text": "진행이 자꾸 끊겼다. 채팅창에 '괜찮냐'는 걱정이 늘어나고, 출연자들도 말수가 줄었다.",
            "next": "care_hard"
          }
        }
      },
      "care": {
        "type": "choice",
        "text": "방송 중반, 지친 기색이 화면에 드러나기 시작했다.",
        "choices": [
          {
            "text": "솔직하게 컨디션을 밝히고 짧게 끝낸다",
            "story": "{member}가 '오늘은 다들 컨디션이 안 좋아서 짧게 갈게요'라고 말했다. 채팅창이 응원으로 가득 찼다.",
            "next": "end_honest"
          },
          {
            "text": "시청자 참여 코너로 바꿔 부담을 나눈다",
            "story": "채팅으로 주제를 받아 시청자가 이끄는 코너로 바꿨다. 출연자들은 리액션만 하면 된다.",
            "next": "end_viewers"
          },
          {
            "text": "끝까지 원래 계획대로 밀고 간다",
            "story": "{member}가 마지막 힘을 짜냈다. 방송은 끝까지 갔지만 다들 지쳐 보였다.",
            "effects": {
              "hp": -5
            },
            "next": "end_pushed"
          }
        ]
      },
      "end_honest": {
        "type": "end",
        "result": "success",
        "text": "짧은 합방이었지만 '무리하지 않아서 좋았다'는 반응이 많았다. 다음 합방은 다들 컨디션을 챙겨서 오기로 했다.",
        "effects": {
          "fans": 110,
          "relationship": 4,
          "hp": 4
        }
      },
      "end_viewers": {
        "type": "end",
        "result": "success",
        "text": "시청자들이 이끈 코너가 의외로 대박이 났다. 채팅창이 출연자를 챙겨 준 방송으로 기억됐다.",
        "effects": {
          "fans": 150,
          "fame": 1,
          "relationship": 3,
          "hp": -2
        }
      },
      "end_pushed": {
        "type": "end",
        "result": "partial",
        "text": "계획은 다 해냈다. 그러나 다음 날 출연자 모두 목이 쉬었다. {member}는 다음 진행 때는 컨디션부터 확인하겠다고 했다.",
        "effects": {
          "fans": 120,
          "relationship": 2,
          "memberFlags": {
            "hostRetry": true
          }
        }
      },
      "care_hard": {
        "type": "choice",
        "text": "방송 분위기가 눈에 띄게 가라앉았다. 진행자로서 결정해야 한다.",
        "choices": [
          {
            "text": "사과하고 방송을 일찍 마무리한다",
            "story": "{member}가 짧게 사과하며 방송을 정리했다. 채팅창에는 걱정과 응원이 반반이다.",
            "next": "end_cut_short"
          },
          {
            "text": "어떻게든 끝까지 버틴다",
            "story": "{member}가 목소리를 끌어올렸지만, 남은 시간 내내 흐름이 살아나지 않았다.",
            "effects": {
              "hp": -5
            },
            "next": "end_collapse"
          }
        ]
      },
      "end_cut_short": {
        "type": "end",
        "result": "partial",
        "text": "짧게 끝난 합방에 아쉬움은 남았지만, 무리하지 않은 판단에 고맙다는 말도 많았다. {member}는 다음 진행을 다시 맡겠다고 했다.",
        "effects": {
          "fans": 70,
          "relationship": 3,
          "hp": 3,
          "memberFlags": {
            "hostRetry": true
          }
        }
      },
      "end_collapse": {
        "type": "end",
        "result": "fail",
        "text": "버틴 만큼 지친 방송이 됐다. 방송 후 {partners}가 먼저 '다음엔 진행 같이 나눠 하자'고 메시지를 보냈다.",
        "effects": {
          "fans": 30,
          "relationship": 1,
          "memberFlags": {
            "hostRetry": true
          }
        }
      },
      "care_partial": {
        "type": "choice",
        "text": "방송 중반. 앞에서 몇 번 멈칫한 탓에 흐름이 아슬아슬한데, 지친 기색까지 화면에 드러나기 시작했다.",
        "choices": [
          {
            "text": "솔직하게 컨디션을 밝히고 짧게 끝낸다",
            "story": "{member}가 '오늘은 다들 컨디션이 안 좋아서 짧게 갈게요'라고 말했다. 응원이 올라왔지만, 앞부분이 어수선했던 탓에 '벌써 끝?'이라는 채팅도 섞였다.",
            "next": "end_honest_late"
          },
          {
            "text": "시청자 참여 코너로 바꿔 부담을 나눈다",
            "story": "채팅으로 주제를 받아 시청자가 이끄는 코너로 바꿨다. 출연자들은 숨을 돌렸지만, 한 번 끊겼던 흐름을 다시 잇느라 {member}가 바빴다.",
            "next": "end_viewers_patch"
          },
          {
            "text": "끝까지 원래 계획대로 밀고 간다",
            "story": "{member}가 마지막 힘을 짜냈다. 멈칫했던 만큼 만회하려다 보니 다들 숨이 찼다.",
            "effects": {
              "hp": -5
            },
            "next": "end_pushed_through"
          }
        ]
      },
      "end_honest_late": {
        "type": "end",
        "result": "partial",
        "text": "일찍 끝낸 덕에 다들 무리하지 않았고, '쉬어 가는 것도 괜찮다'는 응원도 받았다. 다만 어수선한 앞부분만 보여 주고 끝나 '다음엔 제대로 보고 싶다'는 아쉬움이 남았다.",
        "effects": {
          "fans": 80,
          "relationship": 3,
          "hp": 3
        }
      },
      "end_viewers_patch": {
        "type": "end",
        "result": "partial",
        "text": "시청자 코너 덕에 후반은 되살아났고 클립도 몇 개 남았다. 대신 출연자들의 분량이 줄어 '게스트 얘기를 더 듣고 싶었다'는 후기가 따라붙었다.",
        "effects": {
          "fans": 120,
          "relationship": 1,
          "hp": -2
        }
      },
      "end_pushed_through": {
        "type": "end",
        "result": "partial",
        "text": "멈칫했던 부분까지 만회하며 계획한 코너는 모두 해냈다. 하지만 그 대가로 출연자 모두 지쳐 버렸고, {member}는 진행 템포부터 다시 점검하기로 했다.",
        "effects": {
          "fans": 100,
          "relationship": 1,
          "memberFlags": {
            "hostRetry": true
          }
        }
      }
    },
    "group": "collab_host"
  },
  {
    "id": "st_collab_host_cuesheet",
    "title": "합방 진행자의 큐시트",
    "category": "collaboration",
    "description": "3기 합방 진행 맡기(pe_shibuki_2) 변형 A. 진행 방식을 고르고, 판정 결과에 따라 여유 있는 / 빠듯한 시간 초과 상황을 처리한다.",
    "meta": {
      "theme": "broadcast_live",
      "setting": "host_cue_sheet",
      "conflict": "time_pressure",
      "resolution": "steady_success",
      "activity": "joint_stream",
      "tone": "calm"
    },
    "memberId": "shibuki",
    "collab": {
      "min": 2,
      "max": 3
    },
    "conditions": {
      "activityCategories": [
        "broadcast"
      ],
      "cooldown": 5
    },
    "weight": 2,
    "start": "style",
    "steps": {
      "style": {
        "type": "choice",
        "text": "오늘 합방의 진행은 {member}의 몫이다. 큐시트를 들고 {partners}를 기다리는데, 방송 시간은 정해져 있고 하고 싶은 건 많다.",
        "choices": [
          {
            "text": "코너를 짜서 체계적으로 진행한다",
            "story": "{member}가 코너별 시간을 분 단위로 나눴다. 계획대로만 가면 완벽하다.",
            "next": "structured"
          },
          {
            "text": "자유롭게 수다를 떨게 두고 흐름만 잡는다",
            "story": "큐시트는 접어 두고 대화가 흘러가는 대로 두기로 했다. 대신 시간 확인은 {member}가 맡는다.",
            "next": "freeflow"
          }
        ]
      },
      "structured": {
        "type": "check",
        "text": "코너가 하나씩 넘어간다. 시청자 질문과 출연자의 반응을 동시에 챙겨야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 76,
          "traitBonus": {
            "host": 15,
            "calm": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "코너 전환이 물 흐르듯 이어졌다. '진행 장인'이라는 채팅이 줄줄이 올라왔다.",
            "effects": {
              "fans": 60
            },
            "next": "overtime"
          },
          "success": {
            "text": "계획대로 흘러갔다. 다만 마지막 코너 시간이 빠듯하다.",
            "next": "overtime"
          },
          "partial": {
            "text": "한 코너가 예상보다 길어졌다. 남은 시간이 부족하다.",
            "next": "overtime_tight"
          },
          "fail": {
            "text": "첫 코너부터 시간이 밀리며 큐시트가 무너졌다.",
            "next": "end_overrun"
          }
        }
      },
      "freeflow": {
        "type": "check",
        "text": "대화가 사방으로 튄다. 웃음은 많은데, 방송 시간도 빠르게 흘러간다.",
        "check": {
          "stat": "Bs",
          "difficulty": 70,
          "traitBonus": {
            "chatter": 10,
            "highTension": 5,
            "host": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "흐름을 놓치지 않으면서도 모두가 편하게 떠들었다.",
            "next": "overtime"
          },
          "partial": {
            "text": "재밌었지만 준비한 이야기의 절반도 못 했다.",
            "next": "overtime_tight"
          },
          "fail": {
            "text": "수다가 끝없이 이어지며 진행이 사라졌다.",
            "next": "end_overrun"
          }
        }
      },
      "overtime": {
        "type": "choice",
        "text": "방송 종료 5분 전. 남은 코너가 하나 있다.",
        "choices": [
          {
            "text": "아쉽지만 정시에 깔끔하게 끝낸다",
            "story": "{member}가 '이건 다음 합방 숙제로'라며 정리했다.",
            "next": "end_clean"
          },
          {
            "text": "시청자 투표로 연장 여부를 정한다",
            "story": "투표 결과는 압도적인 '연장'. 20분이 더 이어졌다.",
            "effects": {
              "hp": -3
            },
            "next": "end_extended"
          }
        ]
      },
      "end_clean": {
        "type": "end",
        "result": "success",
        "text": "정시에 깔끔하게 끝난 합방. '진행이 편안했다'는 후기가 가장 많았다. 출연자들도 다음 진행을 {member}에게 맡기겠다고 했다.",
        "effects": {
          "fans": 150,
          "fame": 1,
          "relationship": 4,
          "hp": -5,
          "stats": {
            "Bs": 1
          }
        }
      },
      "end_extended": {
        "type": "end",
        "result": "partial",
        "text": "연장전까지 다 보여 줬다. 시청자들은 만족했지만 출연자들은 다음 날 목이 쉬었다.",
        "effects": {
          "fans": 130,
          "relationship": 3,
          "hp": -5
        }
      },
      "end_overrun": {
        "type": "end",
        "result": "fail",
        "text": "진행이 엉키며 준비한 코너 대부분을 못 했다. {member}는 다음 진행 때 큐시트를 반으로 줄이겠다고 다짐했다.",
        "effects": {
          "fans": 50,
          "relationship": 2,
          "hp": -5,
          "memberFlags": {
            "hostRetry": true
          }
        }
      },
      "overtime_tight": {
        "type": "choice",
        "text": "방송 종료 5분 전. 앞에서 시간이 밀려 남은 코너가 아직 두 개다.",
        "choices": [
          {
            "text": "아쉽지만 정시에 깔끔하게 끝낸다",
            "story": "{member}가 '남은 건 다음 합방 숙제로'라며 정리했다. 준비한 코너 절반이 그대로 남았다.",
            "next": "end_cut_corners"
          },
          {
            "text": "시청자 투표로 연장 여부를 정한다",
            "story": "투표 결과는 '연장'. 밀린 코너 두 개를 다 하느라 40분이 더 이어졌다.",
            "effects": {
              "hp": -3
            },
            "next": "end_long_overtime"
          }
        ]
      },
      "end_cut_corners": {
        "type": "end",
        "result": "partial",
        "text": "정시에 끝낸 덕에 마무리는 깔끔했고 '편하게 봤다'는 후기도 있었다. 다만 예고했던 코너가 빠져 '그 코너 기다렸는데'라는 아쉬움도 적지 않았다.",
        "effects": {
          "fans": 100,
          "relationship": 3,
          "hp": -5
        }
      },
      "end_long_overtime": {
        "type": "end",
        "result": "partial",
        "text": "밀린 코너까지 다 보여 주자 끝까지 남은 시청자들은 만족했다. 하지만 방송이 늘어지며 중간에 나간 사람도 많았고, 출연자들은 녹초가 됐다. {member}는 다음엔 큐시트를 조금 줄이겠다고 했다.",
        "effects": {
          "fans": 110,
          "relationship": 2,
          "hp": -5,
          "memberFlags": {
            "hostRetry": true
          }
        }
      }
    },
    "group": "collab_host"
  },
  {
    "id": "st_collab_invite_lineup",
    "title": "합방 콘텐츠 정하기",
    "category": "collaboration",
    "description": "합방 제안(collab_001) 변형 A. 오늘 일정에 맞는 합방 콘텐츠를 고르고 한 번의 판정으로 승부한다.",
    "meta": {
      "theme": "collab_content",
      "setting": "joint_stream_planning",
      "conflict": "schedule_clash",
      "resolution": "compromise",
      "activity": "joint_stream",
      "tone": "warm"
    },
    "collab": {
      "min": 2,
      "max": 3
    },
    "conditions": {
      "activityCategories": [
        "broadcast"
      ]
    },
    "weight": 1,
    "start": "pick",
    "steps": {
      "pick": {
        "type": "choice",
        "text": "{member}와 {partners}의 합방이 잡혔다. 그런데 각자 하고 싶은 콘텐츠가 다르다. 방송 시작까지 30분, 오늘 무엇으로 갈지 정해야 한다.",
        "choices": [
          {
            "text": "FPS 스쿼드를 짜서 같이 달린다",
            "conditions": {
              "activityCategories": [
                "fps"
              ]
            },
            "story": "결국 {member}의 오늘 일정에 맞춰 FPS로 정했다. 포지션을 나누는 동안 벌써 서로 누가 오더를 낼지 신경전이다.",
            "next": "squad"
          },
          {
            "text": "격투게임 대전으로 맞붙는다",
            "conditions": {
              "activityCategories": [
                "fighting"
              ]
            },
            "story": "'말보다 주먹'이라는 한마디로 격투게임 대전이 결정됐다. 캐릭터 선택 화면에서부터 심리전이 시작됐다.",
            "next": "versus"
          },
          {
            "text": "노래를 한 곡씩 이어 부른다",
            "conditions": {
              "activityCategories": [
                "music"
              ]
            },
            "story": "노래 릴레이로 하자는 데 모두 동의했다. 다만 곡 순서를 정하는 데만 10분이 걸렸다.",
            "next": "relay"
          },
          {
            "text": "하고 싶던 이야기를 다 하는 토크 합방으로 간다",
            "story": "콘텐츠는 내려놓고 수다로 가기로 했다. 대신 각자 준비해 온 이야깃거리를 하나씩 꺼내 놓는다.",
            "next": "talk"
          }
        ]
      },
      "squad": {
        "type": "check",
        "text": "첫 판부터 상대 스쿼드가 거세다. 오더가 엇갈리면 그대로 무너진다.",
        "check": {
          "stat": "Ga",
          "difficulty": 78,
          "traitBonus": {
            "fps": 15,
            "competitive": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "오더가 한 번도 엇갈리지 않았다. 마지막 판은 거의 완벽한 팀플레이였다.",
            "effects": {
              "fans": 50
            },
            "next": "end_good"
          },
          "success": {
            "text": "몇 번 엇갈렸지만 결국 합이 맞기 시작했다.",
            "next": "end_good"
          },
          "partial": {
            "text": "이긴 판보다 진 판이 많았지만, 진 판마다 서로 탓하는 장면이 꽤 웃겼다.",
            "next": "end_half"
          },
          "fail": {
            "text": "오더가 계속 엇갈리며 연패가 이어졌다. 분위기가 조금 가라앉았다.",
            "next": "end_flat"
          }
        }
      },
      "versus": {
        "type": "check",
        "text": "1대1 대전. 서로의 손버릇을 아는 사이라 한 수 앞을 읽어야 한다.",
        "check": {
          "stat": "Ga",
          "difficulty": 78,
          "traitBonus": {
            "fighting": 15,
            "competitive": 5,
            "brain": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "마지막 라운드에서 체력 한 칸 차이로 역전이 나왔다. 채팅창이 비명으로 가득 찼다.",
            "effects": {
              "fans": 50
            },
            "next": "end_good"
          },
          "success": {
            "text": "치고받는 접전 끝에 승부가 났다. 진 쪽도 웃으며 재대결을 외쳤다.",
            "next": "end_good"
          },
          "partial": {
            "text": "한쪽이 일방적으로 이겼다. 경기는 싱거웠지만 진 쪽의 리액션이 살렸다.",
            "next": "end_half"
          },
          "fail": {
            "text": "서로 조심하다 시간 초과만 반복됐다. 보는 사람도 하는 사람도 지쳤다.",
            "next": "end_flat"
          }
        }
      },
      "relay": {
        "type": "check",
        "text": "릴레이 첫 곡. 앞 사람의 분위기를 이어받아 다음 곡으로 넘겨야 한다.",
        "check": {
          "stat": "Vc",
          "difficulty": 80,
          "traitBonus": {
            "cover": 10,
            "instrument": 10
          }
        },
        "outcomes": {
          "great": {
            "text": "곡과 곡이 이어질 때마다 화음이 하나씩 늘어났다. 마지막 곡은 다 함께 불렀다.",
            "effects": {
              "fans": 50
            },
            "next": "end_good"
          },
          "success": {
            "text": "릴레이가 매끄럽게 이어졌다. 신청곡 요청이 끝없이 올라왔다.",
            "next": "end_good"
          },
          "partial": {
            "text": "몇 곡은 키가 안 맞았지만 웃으며 넘어갔다.",
            "next": "end_half"
          },
          "fail": {
            "text": "곡 분위기가 계속 엇갈려 릴레이가 자꾸 끊겼다.",
            "next": "end_flat"
          }
        }
      },
      "talk": {
        "type": "check",
        "text": "수다 합방은 흐름이 전부다. 누가 이야기를 끌고 누가 받아칠지 자연스럽게 정해져야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 75,
          "traitBonus": {
            "chatter": 10,
            "host": 10,
            "roleplay": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "준비한 이야깃거리가 바닥났는데도 대화가 끊기지 않았다. 세 시간이 순식간에 지나갔다.",
            "effects": {
              "fans": 50
            },
            "next": "end_good"
          },
          "success": {
            "text": "서로의 근황에 맞장구를 치다 보니 방송 시간이 훌쩍 지났다.",
            "next": "end_good"
          },
          "partial": {
            "text": "재밌는 구간과 어색한 침묵이 번갈아 찾아왔다.",
            "next": "end_half"
          },
          "fail": {
            "text": "이야기가 자꾸 겹치고 끊겼다. 서로 눈치만 보는 시간이 길었다.",
            "next": "end_flat"
          }
        }
      },
      "end_good": {
        "type": "end",
        "result": "success",
        "text": "처음엔 콘텐츠를 정하지 못해 우왕좌왕했지만, 결과는 대만족이었다. 방송이 끝나고도 {member}와 {partners}의 대화방은 한참 시끄러웠다.",
        "effects": {
          "fans": 150,
          "fame": 1,
          "relationship": 4,
          "hp": -5
        }
      },
      "end_half": {
        "type": "end",
        "result": "partial",
        "text": "완벽한 합방은 아니었지만 서로의 스타일은 확실히 알게 됐다. 다음엔 콘텐츠를 미리 정해 오자는 약속이 남았다.",
        "effects": {
          "fans": 90,
          "relationship": 3,
          "hp": -5,
          "memberFlags": {
            "collabPlanAhead": true
          }
        }
      },
      "end_flat": {
        "type": "end",
        "result": "fail",
        "text": "아쉬운 합방이었다. {member}는 방송 후 '다음엔 내가 기획부터 제대로 짜 오겠다'고 메시지를 남겼다.",
        "effects": {
          "fans": 30,
          "relationship": 1,
          "hp": -5,
          "memberFlags": {
            "collabPlanAhead": true
          }
        }
      }
    },
    "group": "collab_invite"
  },
  {
    "id": "st_collab_invite_opening",
    "title": "합방 오프닝 대참사",
    "category": "collaboration",
    "description": "합방 제안(collab_001) 변형 B. 오프닝부터 판정이 시작되고, 오늘 일정 종류에 따라 중간 장면이 갈린다.",
    "meta": {
      "theme": "broadcast_live",
      "setting": "joint_stream_opening",
      "conflict": "audience_reaction",
      "resolution": "audience_help",
      "activity": "joint_stream",
      "tone": "comedic"
    },
    "collab": {
      "min": 2,
      "max": 3
    },
    "conditions": {
      "activityCategories": [
        "broadcast"
      ]
    },
    "weight": 1,
    "start": "opening",
    "steps": {
      "opening": {
        "type": "check",
        "text": "{member}가 합방 오프닝 인사를 하려는 순간, {partners}의 마이크가 동시에 켜지며 인사가 세 겹으로 겹쳤다. 채팅창은 '???'로 도배됐다. 첫 1분을 어떻게든 살려야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 72,
          "traitBonus": {
            "host": 10,
            "chatter": 5,
            "spontaneous": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "{member}가 '방금 그거 오프닝 합창이었습니다'라고 받아치자 채팅창이 웃음으로 뒤집혔다.",
            "effects": {
              "fans": 30
            },
            "next": "route"
          },
          "partial": {
            "text": "웃으며 넘어가긴 했지만, 몇몇 시청자는 '방송 사고냐'고 묻는다.",
            "next": "route"
          },
          "fail": {
            "text": "서로 먼저 말하라고 양보하다 정적이 흘렀다. 시작부터 분위기가 어색하다.",
            "effects": {
              "fans": -20
            },
            "next": "route"
          }
        }
      },
      "route": {
        "type": "branch",
        "branches": [
          {
            "when": {
              "activityCategories": [
                "game"
              ]
            },
            "next": "game_scene"
          }
        ],
        "next": "chat_scene"
      },
      "game_scene": {
        "type": "choice",
        "text": "게임을 켜자 채팅창이 둘로 갈렸다. '같이 협동해라' 파와 '서로 싸워라' 파.",
        "choices": [
          {
            "text": "시청자 투표로 협동 / 대결을 정한다",
            "story": "투표 결과는 근소한 차이로 '대결'. 채팅창의 응원 팀도 그대로 갈렸다.",
            "next": "game_check"
          },
          {
            "text": "협동하다가 몰래 배신하는 컨셉으로 간다",
            "story": "{member}가 웃음을 참으며 협동하는 척을 시작했다. 채팅창만 그 계획을 알고 있다.",
            "effects": {
              "relationship": -1
            },
            "next": "game_check"
          }
        ]
      },
      "chat_scene": {
        "type": "choice",
        "text": "토크가 시작되자 채팅 질문이 쏟아진다. 다 받기에는 너무 많다.",
        "choices": [
          {
            "text": "채팅 질문을 하나씩 뽑아 다 같이 답한다",
            "story": "질문 룰렛을 돌리자 예상 못 한 질문이 줄줄이 나왔다.",
            "next": "chat_check"
          },
          {
            "text": "시청자들이 정한 주제로 즉석 토론을 한다",
            "story": "'짜장 대 짬뽕' 같은 주제로 즉석 토론이 시작됐다. 서로 진지해서 더 웃기다.",
            "next": "chat_check"
          }
        ]
      },
      "game_check": {
        "type": "check",
        "text": "게임이 한창이다. 시청자 반응을 챙기면서 플레이도 놓치지 않아야 한다.",
        "check": {
          "stat": "Ga",
          "difficulty": 75,
          "traitBonus": {
            "competitive": 5,
            "fps": 5,
            "fighting": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "결정적인 순간마다 채팅창이 미리 알려 준 덕분에 명장면이 연달아 나왔다.",
            "next": "end_crowd"
          },
          "partial": {
            "text": "게임은 졌지만 채팅창과 함께 만든 드립이 하이라이트가 됐다.",
            "next": "end_mixed"
          },
          "fail": {
            "text": "게임에 집중하느라 채팅을 놓쳤다. 시청자들이 조금씩 빠져나갔다.",
            "next": "end_lost"
          }
        }
      },
      "chat_check": {
        "type": "check",
        "text": "질문과 주제가 쉬지 않고 이어진다. 세 사람이 고르게 말할 수 있게 흐름을 나눠야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 75,
          "traitBonus": {
            "chatter": 10,
            "host": 5,
            "roleplay": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "채팅창이 던진 질문 하나가 오늘 최고의 에피소드를 끌어냈다.",
            "next": "end_crowd"
          },
          "partial": {
            "text": "재밌었지만 한 사람이 말을 거의 못 했다.",
            "next": "end_mixed"
          },
          "fail": {
            "text": "질문을 고르는 사이 흐름이 계속 끊겼다.",
            "next": "end_lost"
          }
        }
      },
      "end_crowd": {
        "type": "end",
        "result": "success",
        "text": "오프닝 사고로 시작한 합방이 '채팅창이 같이 만든 방송'으로 기억됐다. {partners}는 다음 합방 오프닝도 일부러 겹치자고 했다.",
        "effects": {
          "fans": 160,
          "fame": 1,
          "relationship": 3,
          "hp": -6
        }
      },
      "end_mixed": {
        "type": "end",
        "result": "partial",
        "text": "웃긴 장면은 많았지만 정리가 안 된 방송이었다는 평도 있었다. 다음엔 오프닝 순서부터 정하기로 했다.",
        "effects": {
          "fans": 90,
          "relationship": 2,
          "hp": -6
        }
      },
      "end_lost": {
        "type": "end",
        "result": "fail",
        "text": "시청자 수는 오프닝 때가 가장 많았다. 방송이 끝난 뒤 다 같이 다시보기를 보며 어디서 놓쳤는지 짚어 봤다.",
        "effects": {
          "fans": 30,
          "relationship": 1,
          "hp": -6,
          "stats": {
            "Bs": 1
          }
        }
      }
    },
    "group": "collab_invite"
  },
  {
    "id": "st_collab_radio_callin",
    "title": "라디오 합방, 예고 없는 전화 연결",
    "category": "collaboration",
    "description": "듀오 라디오 방송(collab_004) 변형 B. 시청자 전화 연결 돌발 상황 판정으로 시작해, 결과에 따라 다른 선택과 두 번째 판정이 이어진다.",
    "meta": {
      "theme": "broadcast_live",
      "setting": "radio_call_in",
      "conflict": "unexpected_guest",
      "resolution": "clutch_moment",
      "activity": "talk",
      "tone": "tense"
    },
    "collab": {
      "min": 2,
      "max": 2
    },
    "conditions": {
      "activityCategories": [
        "talk"
      ],
      "cooldown": 3
    },
    "weight": 1,
    "start": "call",
    "steps": {
      "call": {
        "type": "check",
        "text": "{member}와 {partners}의 라디오 합방 중, 시청자 음성 연결 코너에 예정에 없던 청취자가 먼저 연결됐다. 긴장한 목소리로 말을 시작했다가 갑자기 말이 막혔다.",
        "check": {
          "stat": "Bs",
          "difficulty": 74,
          "traitBonus": {
            "host": 10,
            "calm": 5,
            "chatter": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "{member}가 천천히 질문을 던지며 청취자의 긴장을 풀었다.",
            "next": "after_good"
          },
          "partial": {
            "text": "대화는 이어졌지만 서로 말이 계속 겹친다.",
            "next": "after_rough"
          },
          "fail": {
            "text": "정적이 길어지며 연결이 끊겼다. 채팅창이 술렁인다.",
            "effects": {
              "fans": -20
            },
            "next": "after_rough"
          }
        }
      },
      "after_good": {
        "type": "choice",
        "text": "청취자가 사실 오늘 생일이라고 수줍게 말했다.",
        "choices": [
          {
            "text": "즉석에서 둘이 생일 축하 노래를 부른다",
            "story": "{member}가 박자를 세자 {partners}가 화음을 얹었다.",
            "next": "finale_song"
          },
          {
            "text": "생일 기념 사연을 즉석 라디오극으로 만든다",
            "story": "청취자의 하루를 주인공으로 한 짧은 라디오극이 시작됐다.",
            "next": "finale_drama"
          }
        ]
      },
      "after_rough": {
        "type": "choice",
        "text": "분위기가 가라앉았다. 남은 방송 시간은 20분.",
        "choices": [
          {
            "text": "다시 연결을 시도해 끝까지 들어 준다",
            "story": "다시 연결된 청취자가 아까 못한 말을 천천히 꺼냈다.",
            "next": "finale_drama"
          },
          {
            "text": "다음 코너로 넘어가 분위기를 바꾼다",
            "story": "준비한 퀴즈 코너로 넘어갔다. 아까 일이 마음에 걸리긴 한다.",
            "next": "end_moved_on"
          }
        ]
      },
      "finale_song": {
        "type": "check",
        "text": "준비 없이 부르는 생일 축하 노래. 둘의 호흡이 맞아야 한다.",
        "check": {
          "stat": "Vc",
          "difficulty": 70,
          "traitBonus": {
            "cover": 5,
            "instrument": 5,
            "highTension": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "마지막 '생일 축하합니다'에서 청취자가 울먹였다.",
            "next": "end_birthday"
          },
          "partial": {
            "text": "박자는 엉망이었지만 그래서 더 따뜻했다.",
            "next": "end_birthday_messy"
          },
          "fail": {
            "text": "가사를 서로 다르게 불러 웃음만 남았다.",
            "next": "end_birthday_messy"
          }
        }
      },
      "finale_drama": {
        "type": "check",
        "text": "즉석 라디오극. 대본 없이 둘이 번갈아 장면을 이어 가야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 76,
          "traitBonus": {
            "roleplay": 10,
            "spontaneous": 5,
            "host": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "마지막 장면에서 청취자가 '오늘 최고의 하루'라고 말했다.",
            "next": "end_birthday"
          },
          "partial": {
            "text": "줄거리는 엉뚱하게 흘렀지만 청취자는 즐거워했다.",
            "next": "end_birthday_messy"
          },
          "fail": {
            "text": "이야기가 산으로 가며 수습하지 못했다.",
            "next": "end_moved_on"
          }
        }
      },
      "end_birthday": {
        "type": "end",
        "result": "success",
        "text": "예고 없는 전화 한 통이 오늘 방송의 주인공이 됐다. 클립 제목은 '라디오가 선물한 생일'.",
        "effects": {
          "fans": 160,
          "fame": 1,
          "relationship": 5,
          "hp": -4
        }
      },
      "end_birthday_messy": {
        "type": "end",
        "result": "partial",
        "text": "어설펐지만 진심은 전해졌다. 청취자는 나중에 '평생 기억할 것 같다'는 메시지를 보냈다.",
        "effects": {
          "fans": 100,
          "relationship": 4,
          "hp": -4
        }
      },
      "end_moved_on": {
        "type": "end",
        "result": "fail",
        "text": "방송은 무사히 끝났지만 아까 끊긴 연결이 계속 마음에 걸린다. {member}는 다음 회차에 그 청취자를 다시 초대하기로 했다.",
        "effects": {
          "fans": 40,
          "relationship": 2,
          "hp": -3,
          "memberFlags": {
            "radioRegular": true
          }
        }
      }
    },
    "group": "collab_radio"
  },
  {
    "id": "st_collab_radio_letters",
    "title": "심야 라디오 사연 코너",
    "category": "collaboration",
    "description": "듀오 라디오 방송(collab_004) 변형 A. 어떤 사연을 읽을지 먼저 고르고 진행 판정 하나로 마무리된다.",
    "meta": {
      "theme": "broadcast_live",
      "setting": "late_radio_letters",
      "conflict": "high_expectations",
      "resolution": "quiet_growth",
      "activity": "talk",
      "tone": "emotional"
    },
    "collab": {
      "min": 2,
      "max": 2
    },
    "conditions": {
      "activityCategories": [
        "talk"
      ],
      "cooldown": 3
    },
    "weight": 1,
    "start": "letters",
    "steps": {
      "letters": {
        "type": "choice",
        "text": "{member}와 {partners}의 라디오 형식 합방. 사연함에는 생각보다 많은 편지가 모였다. 오늘의 첫 사연을 골라야 한다.",
        "choices": [
          {
            "text": "진지한 고민 상담 사연",
            "story": "진로 때문에 밤잠을 설친다는 사연이다. 가볍게 답할 수 없는 이야기라 둘 다 말을 고른다.",
            "next": "worry"
          },
          {
            "text": "웃긴 실수담 사연",
            "story": "엘리베이터에서 모르는 사람에게 손을 흔들었다는 사연이다. 읽기도 전에 둘 다 웃음이 터졌다.",
            "next": "funny"
          },
          {
            "text": "오래된 팬의 편지",
            "story": "처음 방송부터 봤다는 팬의 편지다. 첫 문장부터 목이 메어 온다.",
            "next": "fan_letter"
          }
        ]
      },
      "worry": {
        "type": "check",
        "text": "섣부른 조언은 독이 된다. 둘이 번갈아 진심을 담아 답해야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 74,
          "traitBonus": {
            "calm": 10,
            "chatter": 5,
            "brain": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "둘의 대답이 서로를 보완했다. 채팅창에 '나도 위로받았다'는 말이 이어졌다.",
            "next": "end_warm"
          },
          "partial": {
            "text": "좋은 말을 했지만 조금 길어졌다. 사연자는 고맙다는 채팅을 남겼다.",
            "next": "end_quiet"
          },
          "fail": {
            "text": "둘의 조언이 정반대로 갈려 어색하게 끝났다.",
            "next": "end_awkward"
          }
        }
      },
      "funny": {
        "type": "check",
        "text": "사연을 재연해 보자는 채팅이 올라왔다. 둘이 즉석 상황극을 해야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 72,
          "traitBonus": {
            "roleplay": 10,
            "chatter": 5,
            "highTension": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "즉석 재연이 사연보다 웃겼다. 사연자 본인도 채팅창에서 웃다 울었다.",
            "next": "end_warm"
          },
          "partial": {
            "text": "웃기긴 했지만 재연이 길어져 다음 사연을 못 읽었다.",
            "next": "end_quiet"
          },
          "fail": {
            "text": "재연 도중 대사가 꼬여 둘 다 수습하지 못했다.",
            "next": "end_awkward"
          }
        }
      },
      "fan_letter": {
        "type": "check",
        "text": "편지를 끝까지 읽어야 한다. 목소리가 떨리면 상대가 이어 읽어 주기로 했다.",
        "check": {
          "stat": "Bs",
          "difficulty": 76,
          "traitBonus": {
            "calm": 5,
            "host": 10,
            "introvert": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "중간에 목소리가 떨리자 {partners}가 자연스럽게 이어 읽었다. 마지막 문장은 둘이 함께 읽었다.",
            "next": "end_warm"
          },
          "partial": {
            "text": "끝까지 읽었지만 둘 다 울컥해서 한동안 말을 잇지 못했다.",
            "next": "end_quiet"
          },
          "fail": {
            "text": "감정이 북받쳐 편지를 다 읽지 못했다.",
            "next": "end_awkward"
          }
        }
      },
      "end_warm": {
        "type": "end",
        "result": "success",
        "text": "라디오 합방이 끝났다. '다음 회차도 해 달라'는 사연이 벌써 들어왔다. 둘은 조용히 정규 코너 이름을 고민하기 시작했다.",
        "effects": {
          "fans": 150,
          "fame": 1,
          "relationship": 5,
          "hp": -4,
          "memberFlags": {
            "radioRegular": true
          }
        }
      },
      "end_quiet": {
        "type": "end",
        "result": "partial",
        "text": "크게 웃기거나 울리진 않았지만 잔잔하게 오래 남는 방송이었다. 서로에 대해 몰랐던 이야기도 조금 알게 됐다.",
        "effects": {
          "fans": 90,
          "relationship": 4,
          "hp": -4
        }
      },
      "end_awkward": {
        "type": "end",
        "result": "fail",
        "text": "라디오 합방은 어색하게 끝났다. 방송 후 둘은 다음엔 사연을 미리 읽어 보고 오자고 정했다.",
        "effects": {
          "fans": 40,
          "relationship": 2,
          "hp": -4
        }
      }
    },
    "group": "collab_radio"
  },
  {
    "id": "st_collab_rhythm_hardest",
    "title": "최고 난이도 정면 승부",
    "category": "collaboration",
    "description": "리듬게임 대결(collab_005) 변형 A. 첫 곡 판정에서 밀리면 두 번째 곡 선택으로 만회해야 한다.",
    "meta": {
      "theme": "game_content",
      "setting": "rhythm_versus_hardest",
      "conflict": "early_disadvantage",
      "resolution": "clutch_moment",
      "activity": "rhythm",
      "tone": "hype"
    },
    "collab": {
      "min": 2,
      "max": 3
    },
    "conditions": {
      "activityCategories": [
        "rhythm"
      ],
      "cooldown": 3
    },
    "weight": 2,
    "start": "first_song",
    "steps": {
      "first_song": {
        "type": "check",
        "text": "{member}가 {partners}에게 리듬게임 정면 승부를 걸었다. 첫 곡부터 최고 난이도. 노트가 쏟아진다.",
        "check": {
          "stat": "Ga",
          "difficulty": 78,
          "traitBonus": {
            "rhythm": 15,
            "competitive": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "풀콤보. 채팅창이 '사람 손 맞냐'로 도배됐다.",
            "effects": {
              "fans": 40
            },
            "next": "lead_pick"
          },
          "success": {
            "text": "첫 곡은 {member}의 근소한 승리.",
            "next": "lead_pick"
          },
          "partial": {
            "text": "점수 차이는 아주 작다. 상대가 살짝 앞섰다.",
            "next": "behind_pick"
          },
          "fail": {
            "text": "첫 곡에서 크게 졌다. 상대가 여유롭게 손을 흔든다.",
            "next": "behind_pick"
          }
        }
      },
      "lead_pick": {
        "type": "choice",
        "text": "앞서고 있다. 두 번째 곡 선택권은 {member}에게 있다.",
        "choices": [
          {
            "text": "자신 있는 곡으로 굳히기에 들어간다",
            "next": "second_safe"
          },
          {
            "text": "상대의 주종목 곡으로 정정당당하게 붙는다",
            "story": "채팅창에 '멋있다'가 쏟아졌다. 동시에 '자만이다'도.",
            "next": "second_bold"
          }
        ]
      },
      "behind_pick": {
        "type": "choice",
        "text": "밀리고 있다. 두 번째 곡에서 역전하지 못하면 끝이다.",
        "choices": [
          {
            "text": "아무도 안 해 본 신곡으로 운에 맡긴다",
            "story": "둘 다 처음 보는 채보다. 실력보다 순발력 싸움이 된다.",
            "next": "second_bold"
          },
          {
            "text": "가장 많이 연습한 곡으로 만회를 노린다",
            "next": "second_safe"
          }
        ]
      },
      "second_safe": {
        "type": "check",
        "text": "익숙한 곡이다. 실수만 안 하면 된다. 하지만 긴장하면 익숙한 곡이 제일 무섭다.",
        "check": {
          "stat": "Ga",
          "difficulty": 74,
          "traitBonus": {
            "rhythm": 10,
            "diligent": 5,
            "calm": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "흔들림 없이 끝까지 쳤다. 최종 점수가 뒤집혔다.",
            "next": "end_victory"
          },
          "partial": {
            "text": "마지막 구간에서 한 번 미스. 최종 결과는 동점이다.",
            "next": "end_tie"
          },
          "fail": {
            "text": "익숙한 곡에서 손이 꼬였다.",
            "next": "end_defeat"
          }
        }
      },
      "second_bold": {
        "type": "check",
        "text": "처음 보는 노트 배치가 쏟아진다. 마지막 10초가 승부처다.",
        "check": {
          "stat": "Ga",
          "difficulty": 82,
          "traitBonus": {
            "rhythm": 15,
            "spontaneous": 5,
            "competitive": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "마지막 10초, 연타를 전부 받아냈다. 채팅창이 폭발했다.",
            "next": "end_victory"
          },
          "partial": {
            "text": "막판에 따라붙었지만 아주 조금 모자랐다. 결과는 동점.",
            "next": "end_tie"
          },
          "fail": {
            "text": "처음 보는 채보에 손이 따라가지 못했다.",
            "next": "end_defeat"
          }
        }
      },
      "end_victory": {
        "type": "end",
        "result": "success",
        "text": "리듬게임 대결 승리. 진 쪽은 '다음엔 내 곡으로 붙자'며 재대결을 신청했다.",
        "effects": {
          "fans": 170,
          "fame": 1,
          "relationship": 3,
          "hp": -6
        }
      },
      "end_tie": {
        "type": "end",
        "result": "partial",
        "text": "동점이다. 승부를 가리지 못한 채 방송이 끝났고, 채팅창은 연장전을 외쳤다.",
        "effects": {
          "fans": 110,
          "relationship": 3,
          "hp": -6,
          "memberFlags": {
            "rhythmRematch": true
          }
        }
      },
      "end_defeat": {
        "type": "end",
        "result": "fail",
        "text": "패배. {member}는 방송을 끄기 직전까지 같은 곡을 연습했다. 그 장면이 오히려 응원을 받았다.",
        "effects": {
          "fans": 60,
          "relationship": -1,
          "hp": -6,
          "memberFlags": {
            "rhythmRematch": true
          }
        }
      }
    },
    "group": "collab_rhythm"
  },
  {
    "id": "st_collab_rhythm_swap",
    "title": "추천곡 교환전",
    "category": "collaboration",
    "description": "리듬게임 대결(collab_005) 변형 B. 관계도에 따라 대결 분위기가 갈리고, 곡 교환 방식 선택 뒤 판정 하나로 끝난다.",
    "meta": {
      "theme": "game_content",
      "setting": "rhythm_song_swap",
      "conflict": "audience_reaction",
      "resolution": "viral_moment",
      "activity": "rhythm",
      "tone": "comedic"
    },
    "collab": {
      "min": 2,
      "max": 3
    },
    "conditions": {
      "activityCategories": [
        "rhythm"
      ],
      "cooldown": 3
    },
    "weight": 2,
    "start": "mood",
    "steps": {
      "mood": {
        "type": "branch",
        "branches": [
          {
            "when": {
              "partyMinRelationship": 40
            },
            "next": "friendly"
          }
        ],
        "next": "polite"
      },
      "friendly": {
        "type": "story",
        "text": "{member}와 {partners}가 리듬게임 추천곡 교환전을 열었다. 서로의 취향을 잘 아는 사이라, 고른 곡마다 함정이 숨어 있다.",
        "next": "swap"
      },
      "polite": {
        "type": "story",
        "text": "{member}와 {partners}가 리듬게임 추천곡 교환전을 열었다. 아직 서로의 취향을 몰라서, 곡을 고를 때마다 상대 반응을 살핀다.",
        "next": "swap"
      },
      "swap": {
        "type": "choice",
        "text": "채팅창은 벌써 서로 다른 곡을 밀고 있다. 어떤 방식으로 곡을 주고받을까?",
        "choices": [
          {
            "text": "서로의 최애곡을 상대에게 시킨다",
            "story": "{member}가 고른 곡이 나오자 상대가 '이게 최애야?'라며 웃었다.",
            "next": "play"
          },
          {
            "text": "채팅 투표로 가장 이상한 곡을 고른다",
            "story": "투표 1위는 박자를 세기도 어려운 괴곡이었다. 채팅창은 이미 신났다.",
            "effects": {
              "fans": 20
            },
            "next": "play"
          },
          {
            "text": "서로 한 손 핸디캡을 걸고 한다",
            "story": "왼손만 쓰기로 했다. 시작 전부터 둘 다 웃음을 참지 못한다.",
            "next": "play_handicap"
          }
        ]
      },
      "play": {
        "type": "check",
        "text": "낯선 곡을 처음 보는 순간의 리액션이 이 방송의 핵심이다. 플레이와 말을 동시에 챙겨야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 74,
          "traitBonus": {
            "rhythm": 10,
            "chatter": 5,
            "highTension": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "{member}의 첫 리액션이 클립으로 잘려 바로 퍼졌다.",
            "next": "end_viral"
          },
          "partial": {
            "text": "플레이는 엉망이었지만 리액션은 살았다.",
            "next": "end_laugh"
          },
          "fail": {
            "text": "곡에 집중하느라 리액션이 사라졌다. 조용한 플레이가 이어졌다.",
            "next": "end_quiet"
          }
        }
      },
      "play_handicap": {
        "type": "check",
        "text": "한 손으로 치는 리듬게임. 점수보다 버티는 모습이 웃음 포인트다.",
        "check": {
          "stat": "Ga",
          "difficulty": 76,
          "traitBonus": {
            "rhythm": 10,
            "spontaneous": 10
          }
        },
        "outcomes": {
          "success": {
            "text": "한 손으로 클리어하는 기적이 나왔다. 채팅창이 박수로 가득 찼다.",
            "next": "end_viral"
          },
          "partial": {
            "text": "클리어는 못 했지만 끝까지 버티는 모습에 응원이 쏟아졌다.",
            "next": "end_laugh"
          },
          "fail": {
            "text": "시작 10초 만에 게임 오버. 너무 빨라서 웃기지도 않았다.",
            "next": "end_quiet"
          }
        }
      },
      "end_viral": {
        "type": "end",
        "result": "success",
        "text": "추천곡 교환전 클립이 리듬게임 커뮤니티까지 퍼졌다. 다음 교환전 곡을 추천하는 댓글이 수백 개 달렸다.",
        "effects": {
          "fans": 170,
          "fame": 1,
          "relationship": 4,
          "hp": -3
        }
      },
      "end_laugh": {
        "type": "end",
        "result": "partial",
        "text": "승부는 흐지부지됐지만 웃음은 남았다. 다만 점수를 기대한 시청자들은 조금 아쉬워했다.",
        "effects": {
          "fans": 100,
          "relationship": 4,
          "hp": -3
        }
      },
      "end_quiet": {
        "type": "end",
        "result": "fail",
        "text": "생각보다 조용한 방송이었다. 둘은 다음엔 리액션 담당을 정해 오자고 웃으며 마무리했다.",
        "effects": {
          "fans": 40,
          "relationship": 2,
          "hp": -3
        }
      }
    },
    "group": "collab_rhythm"
  },
  {
    "id": "st_collab_unit_corner",
    "title": "유닛 합방 코너 기획",
    "category": "collaboration",
    "description": "유닛 합방(collab_006) 변형 A. 오랜만의 유닛 합방에서 코너를 고르고, 판정 뒤 마무리 방식을 한 번 더 고른다.",
    "meta": {
      "theme": "collab_content",
      "setting": "unit_corner_show",
      "conflict": "high_expectations",
      "resolution": "teamwork",
      "activity": "joint_stream",
      "tone": "warm"
    },
    "collab": {
      "min": 2,
      "max": 3
    },
    "conditions": {
      "activityCategories": [
        "broadcast"
      ],
      "minRelationship": 35,
      "cooldown": 4
    },
    "weight": 1,
    "start": "corner",
    "steps": {
      "corner": {
        "type": "choice",
        "text": "오랜만에 {member}와 {partners}가 모였다. 예고만 올렸는데 대기실 시청자가 평소의 두 배다. 기대가 큰 만큼 코너를 잘 골라야 한다.",
        "choices": [
          {
            "text": "서로의 매력을 소개하는 코너",
            "story": "서로에 대해 시청자가 모를 법한 매력을 하나씩 소개하기로 했다.",
            "next": "show"
          },
          {
            "text": "옛날 방송 다시보기 코너",
            "story": "처음 같이 했던 방송을 같이 보기로 했다. 시작 1분 만에 다들 얼굴이 빨개졌다.",
            "next": "show"
          },
          {
            "text": "유닛 퀴즈 대결",
            "story": "'서로에 대해 얼마나 아는가' 퀴즈가 시작됐다. 오답 하나에 서운함이 쌓인다.",
            "next": "show"
          }
        ]
      },
      "show": {
        "type": "check",
        "text": "코너가 한창이다. 오래 기다린 팬들이 만족할 만큼 합을 보여 줘야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 80,
          "traitBonus": {
            "host": 10,
            "roleplay": 5,
            "chatter": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "서로 말을 끝내기도 전에 받아치는 호흡이 이어졌다. 채팅창은 '역시 이 조합'이었다.",
            "effects": {
              "fans": 60
            },
            "next": "closing"
          },
          "success": {
            "text": "오랜만인데도 호흡이 금방 돌아왔다.",
            "next": "closing"
          },
          "partial": {
            "text": "재밌었지만 예전만큼 매끄럽진 않았다. 다들 그걸 느꼈다.",
            "next": "end_half"
          },
          "fail": {
            "text": "오랜만이라 그런지 서로 말이 계속 겹쳤다.",
            "next": "end_rusty"
          }
        }
      },
      "closing": {
        "type": "choice",
        "text": "방송 막바지. 어떻게 마무리할까?",
        "choices": [
          {
            "text": "다 같이 유닛 곡 한 소절을 부른다",
            "story": "반주가 흐르자 채팅창이 숨을 죽였다.",
            "effects": {
              "hp": -2
            },
            "next": "end_song"
          },
          {
            "text": "다음 유닛 합방 날짜를 그 자리에서 정한다",
            "story": "달력을 띄워 놓고 다음 날짜를 정했다. 채팅창에 '약속했다'가 쏟아졌다.",
            "next": "end_promise"
          }
        ]
      },
      "end_song": {
        "type": "end",
        "result": "success",
        "text": "마지막 한 소절이 오늘 방송의 전부를 말해 줬다. 오래 기다린 팬들의 '고맙다'는 채팅이 끝없이 올라왔다.",
        "effects": {
          "fans": 200,
          "fame": 2,
          "relationship": 5,
          "hp": -6
        }
      },
      "end_promise": {
        "type": "end",
        "result": "success",
        "text": "다음 유닛 합방 날짜가 공개됐다. 오늘보다 다음이 더 기대된다는 댓글이 가장 많았다.",
        "effects": {
          "fans": 170,
          "fame": 1,
          "relationship": 5,
          "hp": -4,
          "memberFlags": {
            "unitReunionPromise": true
          }
        }
      },
      "end_rusty": {
        "type": "end",
        "result": "fail",
        "text": "오랜만의 유닛 합방은 조금 삐걱거렸다. 방송 후 다 같이 '다음엔 더 자주 모이자'고 약속했다.",
        "effects": {
          "fans": 70,
          "relationship": 3,
          "hp": -6,
          "memberFlags": {
            "unitReunionPromise": true
          }
        }
      },
      "end_half": {
        "type": "end",
        "result": "partial",
        "text": "오랜만의 유닛 합방은 반가움이 컸지만 호흡은 예전 같지 않았다. 그래도 '이 조합이 다시 모인 것만으로 좋다'는 채팅이 많았다.",
        "effects": {
          "fans": 120,
          "relationship": 4,
          "hp": -6,
          "memberFlags": {
            "unitReunionPromise": true
          }
        }
      }
    },
    "group": "collab_unit"
  },
  {
    "id": "st_collab_unit_reunion",
    "title": "유닛 합방, 즉석 기획 회의",
    "category": "collaboration",
    "description": "유닛 합방(collab_006) 변형 B. 근황 토크 판정으로 시작하고, 아주 친한 사이면 즉석 기획 도박의 기회가 열린다.",
    "meta": {
      "theme": "collab_content",
      "setting": "unit_reunion_talk",
      "conflict": "big_opportunity",
      "resolution": "risky_gamble",
      "activity": "joint_stream",
      "tone": "hype"
    },
    "collab": {
      "min": 2,
      "max": 3
    },
    "conditions": {
      "activityCategories": [
        "broadcast"
      ],
      "minRelationship": 35,
      "cooldown": 4
    },
    "weight": 1,
    "start": "catch_up",
    "steps": {
      "catch_up": {
        "type": "check",
        "text": "{member}와 {partners}의 유닛 합방이 근황 토크로 시작했다. 동시 시청자 수가 계속 오른다. 첫 30분의 분위기가 오늘을 좌우한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 76,
          "traitBonus": {
            "chatter": 10,
            "host": 5,
            "highTension": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "근황 이야기만으로 채팅창이 쉴 새 없이 올라간다. 동시 시청자가 역대 최고를 찍었다.",
            "effects": {
              "fans": 40
            },
            "next": "closeness"
          },
          "partial": {
            "text": "분위기는 좋지만 폭발적이진 않다.",
            "next": "closeness"
          },
          "fail": {
            "text": "근황 토크가 생각보다 빨리 바닥났다.",
            "next": "end_short"
          }
        }
      },
      "closeness": {
        "type": "branch",
        "branches": [
          {
            "when": {
              "partyMinRelationship": 50
            },
            "next": "bold_offer"
          }
        ],
        "next": "safe_offer"
      },
      "bold_offer": {
        "type": "choice",
        "text": "채팅창에서 '지금 바로 유닛 신규 콘텐츠 기획 회의 해 달라'는 요청이 쏟아진다. 서로 눈빛만 봐도 통하는 지금이 기회다.",
        "choices": [
          {
            "text": "생방송으로 즉석 기획 회의를 연다",
            "story": "화이트보드를 띄우고 아이디어를 쏟아 내기 시작했다. 시청자들도 채팅으로 회의에 참여한다.",
            "next": "meeting"
          },
          {
            "text": "기대감만 남기고 오늘은 토크로 끝낸다",
            "next": "end_tease"
          }
        ]
      },
      "safe_offer": {
        "type": "choice",
        "text": "채팅창에서 신규 콘텐츠 기획 요청이 들어온다. 하지만 아직 즉석으로 해낼 만큼 손발이 맞는지는 모르겠다.",
        "choices": [
          {
            "text": "그래도 도전해 본다",
            "story": "어색하게 화이트보드를 띄웠다. 의견이 엇갈릴 때마다 채팅창이 중재에 나선다.",
            "effects": {
              "hp": -3
            },
            "next": "meeting"
          },
          {
            "text": "다음 방송 예고만 하고 마무리한다",
            "next": "end_tease"
          }
        ]
      },
      "meeting": {
        "type": "check",
        "text": "즉석 기획 회의. 아이디어가 쏟아지지만 하나로 모아야 결론이 난다.",
        "check": {
          "stat": "Bs",
          "difficulty": 80,
          "traitBonus": {
            "brain": 10,
            "host": 5,
            "spontaneous": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "회의 끝에 유닛 신규 콘텐츠 이름까지 정해졌다. 채팅창에서 이름 짓기에 참여한 팬들이 환호했다.",
            "next": "end_plan"
          },
          "partial": {
            "text": "아이디어는 넘쳤지만 결론은 '다음에 정하자'였다.",
            "next": "end_tease"
          },
          "fail": {
            "text": "의견이 계속 엇갈리며 회의가 산으로 갔다.",
            "next": "end_short"
          }
        }
      },
      "end_plan": {
        "type": "end",
        "result": "success",
        "text": "생방송 기획 회의가 대성공이었다. 팬들과 함께 정한 콘텐츠라 벌써부터 기대가 크다.",
        "effects": {
          "fans": 190,
          "fame": 2,
          "relationship": 5,
          "hp": -6,
          "memberFlags": {
            "unitReunionPromise": true
          }
        }
      },
      "end_tease": {
        "type": "end",
        "result": "partial",
        "text": "구체적인 결론은 없었지만 '뭔가 준비 중'이라는 기대감은 확실히 남겼다.",
        "effects": {
          "fans": 110,
          "relationship": 4,
          "hp": -3
        }
      },
      "end_short": {
        "type": "end",
        "result": "fail",
        "text": "기대만큼 불타오르진 못했다. 그래도 방송이 끝나고 나눈 단톡방 대화는 방송보다 길었다.",
        "effects": {
          "fans": 60,
          "relationship": 3,
          "hp": -4
        }
      }
    },
    "group": "collab_unit"
  },
  {
    "id": "st_business_drink_sponsor",
    "title": "음료 브랜드 협찬 제안",
    "category": "business",
    "description": "음료 브랜드의 한 달 협찬 제안. 협상 → 전용 콘텐츠 제작으로 이어진다.",
    "meta": {
      "theme": "sponsorship",
      "setting": "brand_meeting",
      "conflict": "budget_limit",
      "resolution": "compromise",
      "activity": "business",
      "tone": "calm"
    },
    "conditions": {
      "minDay": 5,
      "minFame": 8,
      "blockedActivityCategories": [
        "rest"
      ]
    },
    "traitWeights": {
      "host": 1.5,
      "chatter": 1.3
    },
    "once": true,
    "start": "intro",
    "steps": {
      "intro": {
        "type": "story",
        "text": "음료 브랜드에서 {member}에게 한 달짜리 협찬 제안을 보내왔다. 조건은 방송 중 제품 언급과 전용 콘텐츠 1회.",
        "next": "terms"
      },
      "terms": {
        "type": "choice",
        "text": "제안서를 읽은 {member}가 매니저의 의견을 묻는다.",
        "choices": [
          {
            "text": "조건을 그대로 수락한다",
            "story": "계약은 순조롭게 끝났다. 이제 전용 콘텐츠를 준비해야 한다.",
            "effects": {
              "money": 90000
            },
            "next": "content"
          },
          {
            "text": "콘텐츠 자율권을 요구하며 협상한다",
            "story": "매니저가 '방송 흐름은 {member}에게 맡겨 달라'는 조건을 제시했다.",
            "next": "negotiate"
          },
          {
            "text": "채널 색과 맞지 않는다며 정중히 거절한다",
            "story": "정중한 거절 메일을 보냈다. 브랜드 쪽도 다음 기회를 약속했다.",
            "next": "end_decline"
          }
        ]
      },
      "negotiate": {
        "type": "check",
        "text": "화상 미팅. 담당자는 친절하지만 예산표를 쥔 손에는 힘이 들어가 있다.",
        "check": {
          "stat": "Bs",
          "difficulty": 76,
          "traitBonus": {
            "brain": 10,
            "host": 5,
            "calm": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "담당자가 기획안에 반해 금액까지 올려 줬다.",
            "effects": {
              "money": 150000
            },
            "next": "content"
          },
          "success": {
            "text": "자율권과 제시 금액을 모두 지켜 냈다.",
            "effects": {
              "money": 110000
            },
            "next": "content"
          },
          "partial": {
            "text": "자율권은 얻었지만 금액은 조금 깎였다.",
            "effects": {
              "money": 60000
            },
            "next": "content"
          },
          "fail": {
            "text": "협상이 길어지자 브랜드가 제안을 철회했다.",
            "next": "end_withdrawn"
          }
        }
      },
      "content": {
        "type": "choice",
        "text": "전용 콘텐츠는 어떻게 만들까?",
        "choices": [
          {
            "text": "제품을 소재로 한 예능 콘텐츠를 만든다",
            "story": "음료 이름으로 삼행시, 블라인드 시음, 벌칙까지. 기획서만 세 장이다.",
            "effects": {
              "hp": -4
            },
            "next": "ad_show"
          },
          {
            "text": "짧고 깔끔한 리뷰 영상으로 간다",
            "next": "end_review"
          }
        ]
      },
      "ad_show": {
        "type": "check",
        "text": "촬영 당일. 광고 티가 나는 순간 시청자들은 귀신같이 알아챈다.",
        "check": {
          "stat": "Bs",
          "difficulty": 74,
          "traitBonus": {
            "roleplay": 10,
            "highTension": 5,
            "chatter": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "'광고인데 끝까지 봤다'는 댓글이 가장 많은 추천을 받았다.",
            "next": "end_ad_hit"
          },
          "partial": {
            "text": "재미는 있었지만 제품 이야기가 조금 길었다.",
            "next": "end_review"
          },
          "fail": {
            "text": "억지 웃음이 화면에 그대로 드러났다.",
            "next": "end_ad_flop"
          }
        }
      },
      "end_ad_hit": {
        "type": "end",
        "result": "success",
        "text": "브랜드 쪽에서 감사 메일과 함께 다음 시즌 협업을 먼저 제안해 왔다.",
        "effects": {
          "fans": 130,
          "fame": 1,
          "flags": {
            "drinkSponsorFriendly": true
          },
          "stockEffect": {
            "ticker": "STRM",
            "percentage": 2
          }
        }
      },
      "end_review": {
        "type": "end",
        "result": "partial",
        "text": "무난한 협찬 콘텐츠로 마무리됐다. 크게 화제가 되진 않았지만 계약은 깔끔하게 끝났다.",
        "effects": {
          "fans": 40
        }
      },
      "end_ad_flop": {
        "type": "end",
        "result": "fail",
        "text": "'이번 건 좀 광고 같다'는 반응이 많았다. 다음엔 더 {member}다운 방식으로 하자고 다짐했다.",
        "effects": {
          "fans": -20,
          "fame": -1
        }
      },
      "end_decline": {
        "type": "end",
        "result": "neutral",
        "text": "협찬은 없었지만 채널의 색은 지켰다. 소식을 들은 팬들은 오히려 그 선택을 반겼다.",
        "effects": {
          "fans": 20,
          "fame": 1
        }
      },
      "end_withdrawn": {
        "type": "end",
        "result": "fail",
        "text": "제안은 없던 일이 됐다. 아쉽지만 협상에서 배운 것도 있다.",
        "effects": {
          "stats": {
            "Bs": 1
          }
        }
      }
    }
  },
  {
    "id": "st_growth_aim_routine",
    "title": "에임 연습 루틴 짜기",
    "category": "member",
    "group": "growth_aim",
    "description": "에임 연습 루틴(ev_s02) 변형 A. 매일 연습 / 공개 연습 / 프로 영상 분석 중 하나를 고르고, 매일 연습은 컨디션에 따라 장면이 갈린다.",
    "meta": {
      "theme": "member_growth",
      "setting": "aim_trainer_routine",
      "conflict": "fatigue",
      "resolution": "lesson_learned",
      "activity": "fps",
      "tone": "calm"
    },
    "conditions": {
      "activityCategories": [
        "fps"
      ],
      "cooldown": 5
    },
    "start": "pick",
    "steps": {
      "pick": {
        "type": "choice",
        "text": "{member}가 요즘 에임이 흔들린다며 연습 루틴을 새로 짜 보고 싶다고 했다. 어떤 방식으로 할까?",
        "choices": [
          {
            "text": "매일 연습 시간을 따로 잡는다",
            "story": "방송 전 30분, 에임 연습 프로그램을 켜는 것으로 하루를 시작하기로 했다.",
            "next": "routine_week"
          },
          {
            "text": "방송에서 연습 과정을 공개한다",
            "story": "'에임 교정 프로젝트 1일차'라는 제목으로 방송을 켰다. 시청자들이 점수 기록을 함께 세기 시작했다.",
            "next": "public_check"
          },
          {
            "text": "프로 선수 영상을 분석한다",
            "story": "프로 경기 영상을 느리게 돌려 보며 마우스 움직임을 따라 했다.",
            "next": "analysis_check"
          }
        ]
      },
      "routine_week": {
        "type": "branch",
        "branches": [
          {
            "when": {
              "maxHp": 59
            },
            "next": "week_tired"
          }
        ],
        "next": "week_fresh"
      },
      "week_tired": {
        "type": "story",
        "text": "루틴 사흘째. 쌓인 피로 때문에 손목이 무겁다. 그래도 {member}는 연습 프로그램을 끄지 않았다.",
        "effects": {
          "hp": -3
        },
        "next": "routine_check"
      },
      "week_fresh": {
        "type": "story",
        "text": "루틴 사흘째. 몸이 가벼워서 연습 시간이 오히려 기다려진다.",
        "next": "routine_check"
      },
      "routine_check": {
        "type": "check",
        "text": "일주일째 되는 날, 첫날 점수와 비교해 본다.",
        "check": {
          "stat": "Ga",
          "difficulty": 76,
          "traitBonus": {
            "fps": 10,
            "diligent": 10
          }
        },
        "outcomes": {
          "success": {
            "text": "점수가 눈에 띄게 올랐다. 무엇보다 손이 덜 떨린다.",
            "next": "end_routine"
          },
          "partial": {
            "text": "점수는 올랐지만 손목이 뻐근하다. 쉬는 날도 넣어야겠다.",
            "next": "end_routine_tired"
          },
          "fail": {
            "text": "점수가 오히려 떨어졌다. 피로가 실력을 갉아먹고 있었다.",
            "next": "end_routine_burn"
          }
        }
      },
      "public_check": {
        "type": "check",
        "text": "연습 방송은 지루해지기 쉽다. 점수를 올리면서 말도 끊기지 않게 해야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 70,
          "traitBonus": {
            "chatter": 10,
            "competitive": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "시청자들이 점수 내기를 걸기 시작했다. 연습이 하나의 콘텐츠가 됐다.",
            "next": "end_public"
          },
          "partial": {
            "text": "방송은 무난했지만 연습에 집중하다 보니 말이 줄었다.",
            "next": "end_public_quiet"
          },
          "fail": {
            "text": "같은 연습이 반복되자 시청자 수가 서서히 줄었다.",
            "next": "end_public_bored"
          }
        }
      },
      "analysis_check": {
        "type": "check",
        "text": "분석한 움직임을 실제 게임에서 써 본다.",
        "check": {
          "stat": "Ga",
          "difficulty": 72,
          "traitBonus": {
            "brain": 10,
            "fps": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "프로처럼 각을 미리 잡는 습관이 몸에 붙었다.",
            "next": "end_analysis"
          },
          "partial": {
            "text": "머리로는 알겠는데 손이 아직 못 따라간다.",
            "next": "end_analysis_half"
          },
          "fail": {
            "text": "따라 하다가 원래 감각까지 흐트러졌다.",
            "next": "end_analysis_lost"
          }
        }
      },
      "end_routine": {
        "type": "end",
        "result": "success",
        "text": "일주일 루틴이 성공했다. 다음 FPS 방송에서 달라진 에임에 '연습했냐'는 채팅이 쏟아졌다.",
        "effects": {
          "stats": {
            "Ga": 2
          },
          "hp": -6
        }
      },
      "end_routine_tired": {
        "type": "end",
        "result": "partial",
        "text": "실력은 늘었지만 몸이 지쳤다. {member}는 루틴에 쉬는 날을 넣는 법을 배웠다.",
        "effects": {
          "stats": {
            "Ga": 1
          },
          "hp": -8
        }
      },
      "end_routine_burn": {
        "type": "end",
        "result": "fail",
        "text": "무리한 루틴이 역효과를 냈다. 당분간은 컨디션부터 챙기고 다시 시작하기로 했다.",
        "effects": {
          "hp": -6,
          "memberFlags": {
            "aimRetry": true
          }
        }
      },
      "end_public": {
        "type": "end",
        "result": "success",
        "text": "'에임 교정 프로젝트'가 정기 코너가 됐다. 실력도 오르고 팬도 늘었다.",
        "effects": {
          "stats": {
            "Ga": 1
          },
          "fans": 90,
          "hp": -4
        }
      },
      "end_public_quiet": {
        "type": "end",
        "result": "partial",
        "text": "연습은 제대로 됐지만 방송으로는 조금 심심했다는 평이다.",
        "effects": {
          "stats": {
            "Ga": 1
          },
          "fans": 40,
          "hp": -4
        }
      },
      "end_public_bored": {
        "type": "end",
        "result": "fail",
        "text": "연습 방송은 생각보다 반응이 없었다. 다음엔 시청자 참여 미션을 섞어 보자는 아이디어가 남았다.",
        "effects": {
          "fans": 10,
          "hp": -4,
          "memberFlags": {
            "aimRetry": true
          }
        }
      },
      "end_analysis": {
        "type": "end",
        "result": "success",
        "text": "몸보다 머리로 먼저 고친 에임이었다. 무리 없이 실력이 늘었다.",
        "effects": {
          "stats": {
            "Ga": 2
          },
          "hp": -2
        }
      },
      "end_analysis_half": {
        "type": "end",
        "result": "partial",
        "text": "이론은 쌓였지만 손에 익히려면 반복 연습이 더 필요하다.",
        "effects": {
          "stats": {
            "Ga": 1
          },
          "hp": -2
        }
      },
      "end_analysis_lost": {
        "type": "end",
        "result": "fail",
        "text": "남의 방식을 따라 하다 자기 감각을 잃을 뻔했다. {member}는 '내 스타일부터 지키자'며 웃었다.",
        "effects": {
          "hp": -2,
          "memberFlags": {
            "aimRetry": true
          }
        }
      }
    }
  },
  {
    "id": "st_growth_aim_scrim",
    "title": "스크림에서 드러난 약점",
    "category": "member",
    "group": "growth_aim",
    "description": "에임 연습 루틴(ev_s02) 변형 B. 다른 방송인과의 스크림 판정으로 시작해, 결과에 따라 다른 연습 방법을 고른다.",
    "meta": {
      "theme": "game_content",
      "setting": "scrim_review",
      "conflict": "rivalry",
      "resolution": "quiet_growth",
      "activity": "fps",
      "tone": "tense"
    },
    "conditions": {
      "activityCategories": [
        "fps"
      ],
      "cooldown": 5
    },
    "start": "scrim",
    "steps": {
      "scrim": {
        "type": "check",
        "text": "다른 방송인 팀과의 스크림. {member}의 에임이 결정적인 순간마다 빗나간다. 상대 팀에서 '오늘 컨디션 안 좋네?'라는 말까지 나왔다. 마지막 판은 이겨야 한다.",
        "check": {
          "stat": "Ga",
          "difficulty": 78,
          "traitBonus": {
            "fps": 15,
            "competitive": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "마지막 판에서 연속 처치로 자존심을 지켰다. 그래도 앞선 판의 약점은 분명했다.",
            "next": "review_good"
          },
          "partial": {
            "text": "마지막 판은 비겼다. 약점이 그대로 드러난 하루였다.",
            "next": "review_mid"
          },
          "fail": {
            "text": "마지막 판까지 졌다. 상대 팀의 웃음소리가 오래 남았다.",
            "next": "review_bad"
          }
        }
      },
      "review_good": {
        "type": "choice",
        "text": "다시보기를 보니 근거리 교전에서만 유독 흔들린다. 약점이 하나로 좁혀졌다.",
        "choices": [
          {
            "text": "약점만 집중해서 매일 연습한다",
            "story": "근거리 교전 연습 맵만 골라 매일 30분씩 돌렸다.",
            "next": "end_focused"
          },
          {
            "text": "다음 스크림을 방송으로 공개해 리벤지를 예고한다",
            "story": "'다음 주 리벤지 스크림'을 공지했다. 채팅창이 벌써 응원 중이다.",
            "next": "end_revenge_notice"
          }
        ]
      },
      "review_mid": {
        "type": "choice",
        "text": "어디가 문제인지 아직 확실하지 않다.",
        "choices": [
          {
            "text": "매일 연습 시간을 따로 잡는다",
            "story": "방송 전 연습 시간을 잡았다. 무엇을 고칠지는 연습하면서 찾기로 했다.",
            "next": "drill"
          },
          {
            "text": "방송에서 연습 과정을 공개한다",
            "story": "시청자들과 함께 다시보기를 돌려 보며 연습을 공개했다. 채팅창의 분석이 생각보다 날카롭다.",
            "next": "end_public_review"
          }
        ]
      },
      "review_bad": {
        "type": "choice",
        "text": "완패였다. 마음이 꺾이기 쉬운 날이다.",
        "choices": [
          {
            "text": "기본기부터 다시 매일 연습한다",
            "story": "자존심은 내려놓고 감도 설정부터 다시 맞췄다.",
            "next": "basics"
          },
          {
            "text": "방송에서 연습 과정을 공개한다",
            "story": "완패 직후 연습 방송을 켰다. \"오늘 진 거 다 봤죠? 지금부터 복수 준비합니다.\" 채팅창이 응원으로 가득 찼다.",
            "next": "end_bad_public"
          },
          {
            "text": "오늘은 내려놓고 쉰다",
            "story": "게임을 끄고 일찍 잠자리에 들었다. 분한 마음은 내일로 미뤘다.",
            "next": "end_letgo"
          }
        ]
      },
      "drill": {
        "type": "check",
        "text": "일주일 연습의 마지막 날. 같은 맵에서 첫날 기록과 비교한다.",
        "check": {
          "stat": "Ga",
          "difficulty": 74,
          "traitBonus": {
            "fps": 10,
            "diligent": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "기록이 확실히 좋아졌다. 약점도 스스로 찾았다.",
            "next": "end_drill"
          },
          "partial": {
            "text": "조금 나아졌지만 손목이 뻐근하다.",
            "next": "end_drill_half"
          },
          "fail": {
            "text": "연습량에 비해 기록이 그대로다.",
            "next": "end_drill_flat"
          }
        }
      },
      "basics": {
        "type": "check",
        "text": "기본기 연습 열흘째. 감도부터 다시 맞춘 손이 조금씩 적응한다.",
        "check": {
          "stat": "Ga",
          "difficulty": 72,
          "traitBonus": {
            "diligent": 10,
            "calm": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "기초가 잡히자 에임이 거짓말처럼 안정됐다.",
            "next": "end_basics"
          },
          "partial": {
            "text": "안정은 됐지만 예전 감각과는 아직 다르다.",
            "next": "end_basics_half"
          },
          "fail": {
            "text": "새 감도에 끝내 적응하지 못했다.",
            "next": "end_basics_fail"
          }
        }
      },
      "end_focused": {
        "type": "end",
        "result": "success",
        "text": "약점을 정확히 짚은 연습이 효과를 봤다. 다음 스크림에서 근거리 교전은 {member}의 무대였다.",
        "effects": {
          "stats": {
            "Ga": 2
          },
          "hp": -4
        }
      },
      "end_revenge_notice": {
        "type": "end",
        "result": "success",
        "text": "리벤지 예고만으로도 화제가 됐다. 연습에도 자연스럽게 힘이 들어간다.",
        "effects": {
          "stats": {
            "Ga": 1
          },
          "fans": 100,
          "hp": -4
        }
      },
      "end_public_review": {
        "type": "end",
        "result": "partial",
        "text": "시청자들과의 분석 방송은 반응이 좋았다. 다만 실제 실력 향상은 아직 조금이다.",
        "effects": {
          "stats": {
            "Ga": 1
          },
          "fans": 90,
          "hp": -4
        }
      },
      "end_drill": {
        "type": "end",
        "result": "success",
        "text": "일주일 연습이 결과로 돌아왔다. 다음 스크림이 기다려진다.",
        "effects": {
          "stats": {
            "Ga": 2
          },
          "hp": -6
        }
      },
      "end_drill_half": {
        "type": "end",
        "result": "partial",
        "text": "실력은 조금 늘었지만 몸이 지쳤다. 연습량을 조절할 필요가 있다.",
        "effects": {
          "stats": {
            "Ga": 1
          },
          "hp": -6
        }
      },
      "end_drill_flat": {
        "type": "end",
        "result": "fail",
        "text": "연습량만 늘고 결과는 없었다. {member}는 방법부터 다시 고민해 보기로 했다.",
        "effects": {
          "hp": -6,
          "memberFlags": {
            "aimRetry": true
          }
        }
      },
      "end_basics": {
        "type": "end",
        "result": "success",
        "text": "완패에서 시작한 기본기 연습이 오히려 큰 발전이 됐다. 다음 스크림에서 상대 팀이 놀란 표정을 지었다.",
        "effects": {
          "stats": {
            "Ga": 2
          },
          "hp": -6
        }
      },
      "end_basics_half": {
        "type": "end",
        "result": "partial",
        "text": "기초는 다졌지만 실전 감각을 되찾는 데 시간이 더 필요하다.",
        "effects": {
          "stats": {
            "Ga": 1
          },
          "hp": -6
        }
      },
      "end_basics_fail": {
        "type": "end",
        "result": "fail",
        "text": "새 감도에 적응하지 못해 원래 설정으로 돌아갔다. 리벤지는 다음 기회로 미뤘다.",
        "effects": {
          "hp": -6,
          "memberFlags": {
            "aimRetry": true
          }
        }
      },
      "end_letgo": {
        "type": "end",
        "result": "neutral",
        "text": "푹 자고 나니 분한 마음이 조금 가라앉았다. 연습은 컨디션이 좋은 날 다시 하기로 했다.",
        "effects": {
          "hp": 4,
          "memberFlags": {
            "aimRetry": true
          }
        }
      },
      "end_bad_public": {
        "type": "end",
        "result": "partial",
        "text": "완패 후 바로 켠 연습 방송에 응원이 쏟아졌다. 실력은 아직 조금 올랐을 뿐이지만, 리벤지를 기다리는 팬들이 생겼다.",
        "effects": {
          "stats": {
            "Ga": 1
          },
          "fans": 90,
          "hp": -4
        }
      }
    }
  },
  {
    "id": "st_growth_talk_mentor",
    "title": "다시보기 진행 점검",
    "category": "member",
    "group": "growth_talk",
    "description": "토크 워크숍(ev_s03) 변형 B. 컨디션에 따라 점검 분위기가 갈리고, 워크숍 / 다시보기 연구 / 즉석 적용 중 하나를 고른다.",
    "meta": {
      "theme": "broadcast_live",
      "setting": "stream_rewatch_feedback",
      "conflict": "miscommunication",
      "resolution": "lesson_learned",
      "activity": "talk",
      "tone": "comedic"
    },
    "conditions": {
      "activityCategories": [
        "talk"
      ],
      "cooldown": 6
    },
    "start": "mood",
    "steps": {
      "mood": {
        "type": "branch",
        "branches": [
          {
            "when": {
              "maxHp": 59
            },
            "next": "tired_review"
          }
        ],
        "next": "fresh_review"
      },
      "tired_review": {
        "type": "story",
        "text": "지친 얼굴로 지난 방송 다시보기를 틀었다. 피곤한 날의 {member}는 같은 농담을 세 번이나 하고 있었다. '이게 나라고…?'",
        "effects": {
          "hp": -2
        },
        "next": "plan"
      },
      "fresh_review": {
        "type": "story",
        "text": "지난 방송 다시보기를 틀었다. 채팅 질문을 엉뚱하게 알아듣고 한참 다른 이야기를 하는 {member}의 모습이 보인다. 본인도 웃음이 터졌다.",
        "next": "plan"
      },
      "plan": {
        "type": "choice",
        "text": "진행 실력을 어떻게 끌어올릴까?",
        "choices": [
          {
            "text": "진행 워크숍에 참가한다",
            "conditions": {
              "minMoney": 50000
            },
            "story": "워크숍에 등록했다. 강사는 다시보기 영상을 같이 보며 고칠 점을 짚어 주기로 했다.",
            "effects": {
              "money": -50000,
              "hp": -2
            },
            "next": "workshop_drill"
          },
          {
            "text": "다시보기를 끝까지 보며 스스로 연구한다",
            "story": "노트를 펴고 실수한 장면마다 시간을 적었다. 채팅을 놓친 순간이 생각보다 많다.",
            "next": "rewatch_check"
          },
          {
            "text": "오늘 방송에서 바로 고쳐 본다",
            "story": "{member}가 '오늘은 채팅을 끝까지 읽고 대답하겠다'고 선언하며 방송을 켰다.",
            "next": "apply_check"
          }
        ]
      },
      "workshop_drill": {
        "type": "check",
        "text": "강사가 다시보기의 장면마다 멈추고 '여기서 뭐라고 하면 좋았을까요?'라고 묻는다.",
        "check": {
          "stat": "Bs",
          "difficulty": 74,
          "traitBonus": {
            "host": 10,
            "brain": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "질문마다 더 나은 대답을 찾아냈다. 강사가 '감이 좋다'고 했다.",
            "next": "end_ws_good"
          },
          "partial": {
            "text": "몇 장면은 답을 찾았고, 몇 장면은 끝내 막혔다.",
            "next": "end_ws_half"
          },
          "fail": {
            "text": "자기 실수를 계속 보다 보니 오히려 위축됐다.",
            "next": "end_ws_shrink"
          }
        }
      },
      "rewatch_check": {
        "type": "check",
        "text": "적어 둔 실수 목록을 유형별로 정리한다. 패턴을 찾아야 고칠 수 있다.",
        "check": {
          "stat": "Bs",
          "difficulty": 70,
          "traitBonus": {
            "brain": 10,
            "calm": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "실수의 대부분이 '채팅을 끝까지 안 읽어서'였다. 원인이 하나로 좁혀졌다.",
            "next": "end_rewatch_good"
          },
          "partial": {
            "text": "패턴은 찾았지만 고칠 방법은 아직 모르겠다.",
            "next": "end_rewatch_half"
          },
          "fail": {
            "text": "보면 볼수록 다 문제처럼 보여 정리가 안 됐다.",
            "next": "end_rewatch_lost"
          }
        }
      },
      "apply_check": {
        "type": "check",
        "text": "채팅을 끝까지 읽고 대답하기. 쉬워 보였는데 채팅 속도가 빨라지자 손이 바빠진다.",
        "check": {
          "stat": "Bs",
          "difficulty": 78,
          "traitBonus": {
            "host": 10,
            "highTension": 5,
            "chatter": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "질문을 정확히 짚어 대답하자 채팅창이 '오늘 왜 이렇게 잘 들어?'로 가득 찼다.",
            "next": "end_apply_hit"
          },
          "partial": {
            "text": "절반은 잘 받았지만, 바빠지자 다시 엉뚱한 대답이 나왔다.",
            "next": "end_apply_half"
          },
          "fail": {
            "text": "채팅을 읽느라 이야기가 계속 끊겼다. 오히려 더 어색해졌다.",
            "next": "end_apply_flop"
          }
        }
      },
      "end_ws_good": {
        "type": "end",
        "result": "success",
        "text": "다시보기로 배우는 워크숍은 효과가 컸다. 다음 방송부터 채팅을 놓치는 일이 확 줄었다.",
        "effects": {
          "stats": {
            "Bs": 3
          }
        }
      },
      "end_ws_half": {
        "type": "end",
        "result": "partial",
        "text": "배운 건 분명히 있었다. 다만 막혔던 장면은 숙제로 남았다.",
        "effects": {
          "stats": {
            "Bs": 2
          }
        }
      },
      "end_ws_shrink": {
        "type": "end",
        "result": "fail",
        "text": "실수만 보다 자신감이 조금 떨어졌다. 강사는 '다음엔 잘한 장면부터 보자'며 다음 수업을 잡아 줬다.",
        "effects": {
          "stats": {
            "Bs": 1
          },
          "memberFlags": {
            "talkRetry": true
          }
        }
      },
      "end_rewatch_good": {
        "type": "end",
        "result": "success",
        "text": "원인을 알자 고치는 건 금방이었다. '다시보기 반성회'는 {member}의 새 습관이 됐다.",
        "effects": {
          "stats": {
            "Bs": 2
          }
        }
      },
      "end_rewatch_half": {
        "type": "end",
        "result": "partial",
        "text": "문제는 알았다. 고치는 건 이제부터다.",
        "effects": {
          "stats": {
            "Bs": 1
          }
        }
      },
      "end_rewatch_lost": {
        "type": "end",
        "result": "fail",
        "text": "혼자 보니 끝이 없었다. 다음엔 누군가와 같이 봐야겠다는 결론만 남았다.",
        "effects": {
          "memberFlags": {
            "talkRetry": true
          }
        }
      },
      "end_apply_hit": {
        "type": "end",
        "result": "success",
        "text": "말로 한 다짐을 방송에서 바로 지켰다. 시청자들은 달라진 {member}를 단번에 알아챘다.",
        "effects": {
          "stats": {
            "Bs": 2
          },
          "fans": 60,
          "hp": -3
        }
      },
      "end_apply_half": {
        "type": "end",
        "result": "partial",
        "text": "반쯤은 성공했다. 엉뚱한 대답이 나온 순간마저 웃음 포인트가 됐지만, 고칠 점은 여전하다.",
        "effects": {
          "stats": {
            "Bs": 1
          },
          "fans": 30,
          "hp": -3
        }
      },
      "end_apply_flop": {
        "type": "end",
        "result": "fail",
        "text": "어색한 방송이었다. {member}는 '역시 바로 고치는 건 무리였다'며 다음엔 연습부터 하겠다고 했다.",
        "effects": {
          "hp": -3,
          "memberFlags": {
            "talkRetry": true
          }
        }
      }
    }
  },
  {
    "id": "st_growth_talk_workshop",
    "title": "진행 워크숍 실습",
    "category": "member",
    "group": "growth_talk",
    "description": "토크 워크숍(ev_s03) 변형 A. 워크숍 참가 또는 선배 방송 연구를 고르고, 워크숍에서는 즉석 진행 실습이 이어진다.",
    "meta": {
      "theme": "member_growth",
      "setting": "talk_workshop_class",
      "conflict": "nervousness",
      "resolution": "teamwork",
      "activity": "talk",
      "tone": "warm"
    },
    "conditions": {
      "activityCategories": [
        "talk"
      ],
      "cooldown": 6
    },
    "start": "pick",
    "steps": {
      "pick": {
        "type": "choice",
        "text": [
          {
            "when": {
              "anyTraits": [
                "introvert"
              ]
            },
            "text": "방송 진행 워크숍에 {member}를 보내 보자는 의견이 나왔다. 낯을 가리는 {member}는 '모르는 사람들 앞에서 연습하는 거냐'며 벌써 긴장한 눈치다."
          },
          {
            "text": "방송 진행 워크숍에 {member}를 보내 보자는 의견이 나왔다. 방송 진행을 체계적으로 배울 기회다."
          }
        ],
        "choices": [
          {
            "text": "워크숍에 참가한다",
            "conditions": {
              "minMoney": 50000
            },
            "story": "워크숍 첫날. 다른 참가자들과 둘러앉자 강사가 바로 실습 과제를 냈다. '지금부터 3분, 즉석에서 진행해 보세요.'",
            "effects": {
              "money": -50000,
              "hp": -2
            },
            "next": "class_task"
          },
          {
            "text": "선배 방송을 보며 스스로 연구한다",
            "story": "진행을 잘하는 선배들의 방송 다시보기를 모아, 질문 하나 던지는 타이밍까지 메모했다.",
            "next": "study_check"
          }
        ]
      },
      "class_task": {
        "type": "choice",
        "text": "누가 먼저 실습할지 강사가 묻는다.",
        "choices": [
          {
            "text": "자원해서 먼저 실습한다",
            "story": "{member}가 손을 들었다. 심장이 쿵쾅거린다.",
            "next": "class_check"
          },
          {
            "text": "다른 참가자들의 실습을 보며 메모한다",
            "story": "다른 사람들의 실수와 장점을 꼼꼼히 받아 적었다. 마지막 시간에 강사가 그 메모를 보고 칭찬했다.",
            "next": "end_class_notes"
          }
        ]
      },
      "class_check": {
        "type": "check",
        "text": "3분 즉석 진행. 다른 참가자들이 시청자 역할을 하며 일부러 엉뚱한 질문을 던진다.",
        "check": {
          "stat": "Bs",
          "difficulty": 76,
          "traitBonus": {
            "host": 10,
            "chatter": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "엉뚱한 질문까지 웃음으로 받아넘겼다. 참가자들이 박수를 쳤다.",
            "next": "end_class_star"
          },
          "partial": {
            "text": "흐름은 잘 잡았지만 한 질문에서 말이 막혔다.",
            "next": "end_class_ok"
          },
          "fail": {
            "text": "첫 질문부터 머리가 하얘졌다. 3분이 30분 같았다.",
            "next": "end_class_freeze"
          }
        }
      },
      "study_check": {
        "type": "check",
        "text": "연구한 내용을 오늘 방송에서 바로 써 본다. 질문을 던지고, 채팅을 받고, 다시 이야기를 이어 간다.",
        "check": {
          "stat": "Bs",
          "difficulty": 70,
          "traitBonus": {
            "brain": 10,
            "diligent": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "선배에게 배운 질문 타이밍이 정확히 맞아떨어졌다. 채팅 참여가 확 늘었다.",
            "next": "end_study_good"
          },
          "partial": {
            "text": "몇 번은 통했고 몇 번은 어색했다.",
            "next": "end_study_half"
          },
          "fail": {
            "text": "흉내 내려다 원래 말투까지 어색해졌다.",
            "next": "end_study_awkward"
          }
        }
      },
      "end_class_star": {
        "type": "end",
        "result": "success",
        "text": "워크숍 마지막 날, 강사가 {member}를 모범 사례로 소개했다. 다음 방송부터 진행이 눈에 띄게 매끄러워졌다.",
        "effects": {
          "stats": {
            "Bs": 3
          },
          "fans": 40
        }
      },
      "end_class_notes": {
        "type": "end",
        "result": "success",
        "text": "직접 나서진 않았지만 배운 건 많았다. 꼼꼼히 쓴 메모가 {member}만의 진행 노트가 됐다.",
        "effects": {
          "stats": {
            "Bs": 3
          }
        }
      },
      "end_class_ok": {
        "type": "end",
        "result": "partial",
        "text": "좋은 경험이었다. 막혔던 질문 유형은 따로 연습하기로 했다.",
        "effects": {
          "stats": {
            "Bs": 2
          }
        }
      },
      "end_class_freeze": {
        "type": "end",
        "result": "fail",
        "text": "실습은 엉망이었지만, 끝나고 다른 참가자들이 '처음엔 다 그렇다'며 다독여 줬다. {member}는 다음 기수 워크숍도 신청해 두었다.",
        "effects": {
          "stats": {
            "Bs": 1
          },
          "memberFlags": {
            "talkRetry": true
          }
        }
      },
      "end_study_good": {
        "type": "end",
        "result": "success",
        "text": "혼자 연구한 보람이 있었다. 방송 후 '오늘 진행 왜 이렇게 좋냐'는 댓글이 달렸다.",
        "effects": {
          "stats": {
            "Bs": 2
          },
          "fans": 30
        }
      },
      "end_study_half": {
        "type": "end",
        "result": "partial",
        "text": "배운 것 중 절반은 내 것이 됐다. 나머지 절반은 내 말투에 맞게 다듬어야 한다.",
        "effects": {
          "stats": {
            "Bs": 1
          }
        }
      },
      "end_study_awkward": {
        "type": "end",
        "result": "fail",
        "text": "어색한 방송이었다. {member}는 '남의 방식보다 내 방식을 다듬자'며 다음엔 제대로 배워 보겠다고 했다.",
        "effects": {
          "memberFlags": {
            "talkRetry": true
          }
        }
      }
    }
  },
  {
    "id": "st_growth_vocal_lesson",
    "title": "보컬 레슨 첫날",
    "category": "member",
    "group": "growth_vocal",
    "description": "보컬 트레이닝 제안(ev_s01) 변형 A. 정식 레슨 / 독학 / 시청자 피드백 연습 중 하나를 고르고, 방식마다 다른 장면과 판정이 이어진다.",
    "meta": {
      "theme": "member_growth",
      "setting": "vocal_lesson_studio",
      "conflict": "high_expectations",
      "resolution": "steady_success",
      "activity": "music",
      "tone": "calm"
    },
    "conditions": {
      "activityCategories": [
        "music"
      ],
      "cooldown": 6
    },
    "start": "pick",
    "steps": {
      "pick": {
        "type": "choice",
        "text": [
          {
            "when": {
              "anyTraits": [
                "perfectionist"
              ]
            },
            "text": "보컬 트레이너가 {member}에게 단기 레슨을 제안했다. 평소 자기 노래에 엄격한 {member}는 제안서를 몇 번이고 다시 읽는다. 팬들도 '레슨 받으면 어떻게 될지 궁금하다'며 기대 중이다."
          },
          {
            "text": "보컬 트레이너가 {member}에게 단기 레슨을 제안했다. 팬들도 '레슨 받으면 어떻게 될지 궁금하다'며 기대 중이다. 어떤 방식으로 실력을 키울까?"
          }
        ],
        "choices": [
          {
            "text": "정식 레슨을 받는다",
            "conditions": {
              "minMoney": 70000
            },
            "story": "레슨비를 내고 트레이너의 연습실을 찾았다. 첫 시간부터 발성 기초를 처음부터 다시 짚는다.",
            "effects": {
              "money": -70000
            },
            "next": "lesson_feedback"
          },
          {
            "text": "영상 자료로 독학한다",
            "story": "강의 영상을 모아 재생 목록을 만들었다. 혼자 하는 만큼 꾸준함이 관건이다.",
            "effects": {
              "hp": -2
            },
            "next": "self_check"
          },
          {
            "text": "노래 방송에서 시청자 피드백을 받으며 연습한다",
            "story": "'오늘은 연습 방송입니다'라는 제목으로 방송을 켰다. 채팅창이 금세 보컬 코치들로 가득 찼다.",
            "next": "stream_check"
          }
        ]
      },
      "lesson_feedback": {
        "type": "choice",
        "text": "레슨 중반, 트레이너가 {member}의 고음 습관을 짚었다. '이대로면 목이 쉽게 지쳐요.'",
        "choices": [
          {
            "text": "트레이너의 방식을 그대로 따른다",
            "story": "익숙한 창법을 잠시 내려놓고 트레이너의 지시대로 기초부터 다시 쌓았다. 답답하지만 확실한 방법이다.",
            "next": "end_lesson_steady"
          },
          {
            "text": "내 창법에 맞게 조정해 달라고 한다",
            "story": "{member}가 자기 창법의 장점을 설명하자 트레이너가 흥미롭다는 듯 고개를 끄덕였다. 둘이 함께 새 연습법을 짜 본다.",
            "next": "lesson_custom"
          }
        ]
      },
      "lesson_custom": {
        "type": "check",
        "text": "맞춤 연습법을 바로 시험해 본다. 내 색깔을 지키면서 습관만 고쳐야 한다.",
        "check": {
          "stat": "Vc",
          "difficulty": 76,
          "traitBonus": {
            "perfectionist": 10,
            "cover": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "고음이 한결 편안하게 나왔다. 트레이너가 '이건 {member}만의 방식'이라며 웃었다.",
            "next": "end_lesson_custom"
          },
          "partial": {
            "text": "습관은 고쳤지만 원래 음색이 조금 흐려졌다.",
            "next": "end_lesson_mixed"
          },
          "fail": {
            "text": "두 방식 사이에서 헤매다 목만 지쳤다.",
            "next": "end_lesson_clash"
          }
        }
      },
      "self_check": {
        "type": "check",
        "text": "일주일째 독학 중. 오늘은 녹음해 둔 첫날 노래와 비교해 본다.",
        "check": {
          "stat": "Vc",
          "difficulty": 75,
          "traitBonus": {
            "diligent": 10,
            "perfectionist": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "첫날 녹음과 비교하니 다른 사람 같았다. 혼자서 여기까지 왔다.",
            "next": "end_self_great"
          },
          "success": {
            "text": "확실히 나아졌다. 특히 호흡이 길어졌다.",
            "next": "end_self_ok"
          },
          "partial": {
            "text": "몇 군데는 좋아졌지만 이상한 버릇도 하나 생겼다.",
            "next": "end_self_half"
          },
          "fail": {
            "text": "영상은 많이 봤는데 노래는 그대로다.",
            "next": "end_self_stuck"
          }
        }
      },
      "stream_check": {
        "type": "check",
        "text": "채팅창의 조언이 쏟아진다. 쓸 만한 피드백을 골라내며 노래도 이어 가야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 70,
          "traitBonus": {
            "chatter": 10,
            "host": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "한 시청자의 '턱에 힘을 빼 보라'는 조언이 정확히 들어맞았다. 채팅창이 함께 환호했다.",
            "next": "end_stream_tips"
          },
          "partial": {
            "text": "재밌는 방송이었지만 조언이 엇갈려 연습은 반쯤만 됐다.",
            "next": "end_stream_noisy"
          },
          "fail": {
            "text": "조언이 너무 많아 무엇부터 해야 할지 몰라 연습이 산으로 갔다.",
            "next": "end_stream_mess"
          }
        }
      },
      "end_lesson_steady": {
        "type": "end",
        "result": "success",
        "text": "레슨이 끝났다. 극적인 변화는 없었지만 고음이 한결 안정됐다. {member}는 배운 연습법을 매일 아침 루틴에 넣었다.",
        "effects": {
          "stats": {
            "Vc": 3
          },
          "hp": -3
        }
      },
      "end_lesson_custom": {
        "type": "end",
        "result": "success",
        "text": "{member}에게 꼭 맞는 연습법이 생겼다. 다음 노래 방송에서 달라진 고음을 들은 팬들의 반응이 뜨거웠다.",
        "effects": {
          "stats": {
            "Vc": 3
          },
          "fans": 50,
          "hp": -3
        }
      },
      "end_lesson_mixed": {
        "type": "end",
        "result": "partial",
        "text": "목은 편해졌지만 원래 음색을 되찾는 데 시간이 더 필요하다. 트레이너와 다음 레슨 날짜를 잡았다.",
        "effects": {
          "stats": {
            "Vc": 2
          },
          "hp": -3
        }
      },
      "end_lesson_clash": {
        "type": "end",
        "result": "fail",
        "text": "이번 레슨은 엇갈리기만 했다. 그래도 {member}는 '내 목소리를 더 잘 알게 됐다'며 다음엔 기초부터 따라 보겠다고 했다.",
        "effects": {
          "stats": {
            "Vc": 1
          },
          "hp": -5,
          "memberFlags": {
            "vocalRetry": true
          }
        }
      },
      "end_self_great": {
        "type": "end",
        "result": "success",
        "text": "독학 비포·애프터 영상을 올리자 '레슨 받은 줄 알았다'는 댓글이 달렸다.",
        "effects": {
          "stats": {
            "Vc": 2
          },
          "fans": 40
        }
      },
      "end_self_ok": {
        "type": "end",
        "result": "success",
        "text": "꾸준히 한 만큼 돌아왔다. {member}는 독학 루틴을 한 달 더 이어 가기로 했다.",
        "effects": {
          "stats": {
            "Vc": 1
          }
        }
      },
      "end_self_half": {
        "type": "end",
        "result": "partial",
        "text": "호흡은 늘었지만 새로 생긴 버릇을 고치는 게 다음 숙제가 됐다.",
        "effects": {
          "stats": {
            "Vc": 1
          },
          "hp": -2
        }
      },
      "end_self_stuck": {
        "type": "end",
        "result": "fail",
        "text": "혼자서는 한계가 있었다. {member}는 다음엔 누군가에게 직접 배워 보겠다고 메모를 남겼다.",
        "effects": {
          "memberFlags": {
            "vocalRetry": true
          }
        }
      },
      "end_stream_tips": {
        "type": "end",
        "result": "success",
        "text": "연습 방송이 의외로 인기였다. '같이 성장하는 느낌'이라는 채팅이 이어졌고, 노래도 실제로 좋아졌다.",
        "effects": {
          "stats": {
            "Vc": 1
          },
          "fans": 90,
          "hp": -3
        }
      },
      "end_stream_noisy": {
        "type": "end",
        "result": "partial",
        "text": "방송은 즐거웠지만 연습으로는 반쯤 성공이었다. 다음엔 조언 받을 주제를 하나로 정해 오기로 했다.",
        "effects": {
          "fans": 50,
          "hp": -3
        }
      },
      "end_stream_mess": {
        "type": "end",
        "result": "fail",
        "text": "연습 방송은 수다 방송이 되어 버렸다. 그래도 시청자들은 '다음 연습 방송도 기다린다'고 했다.",
        "effects": {
          "fans": 20,
          "hp": -3,
          "memberFlags": {
            "vocalRetry": true
          }
        }
      }
    }
  },
  {
    "id": "st_growth_vocal_warmup",
    "title": "목 상태 점검",
    "category": "member",
    "group": "growth_vocal",
    "description": "보컬 트레이닝 제안(ev_s01) 변형 B. 아침 발성 테스트 판정 결과에 따라 고를 수 있는 연습 방법이 달라진다.",
    "meta": {
      "theme": "member_growth",
      "setting": "morning_vocal_check",
      "conflict": "early_disadvantage",
      "resolution": "comeback_win",
      "activity": "music",
      "tone": "tense"
    },
    "conditions": {
      "activityCategories": [
        "music"
      ],
      "cooldown": 6
    },
    "start": "warmup",
    "steps": {
      "warmup": {
        "type": "check",
        "text": "보컬 트레이너에게 레슨 제안을 받은 날 아침. {member}가 먼저 지금 목 상태부터 확인해 보기로 했다. 첫 발성 테스트가 시작됐다.",
        "check": {
          "stat": "Vc",
          "difficulty": 72,
          "traitBonus": {
            "diligent": 5,
            "calm": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "목이 가볍다. 오늘은 고음까지 시원하게 올라간다.",
            "next": "plan_push"
          },
          "partial": {
            "text": "소리는 나지만 고음에서 살짝 걸린다. 기초부터 다지는 게 좋겠다.",
            "next": "plan_basic"
          },
          "fail": {
            "text": "첫 소절부터 목이 잠겼다. 최근 일정이 목에 그대로 쌓여 있었다.",
            "next": "plan_hoarse"
          }
        }
      },
      "plan_push": {
        "type": "choice",
        "text": "컨디션이 좋은 날이다. 이 기세를 어디에 쓸까?",
        "choices": [
          {
            "text": "정식 레슨에서 고음 확장을 배운다",
            "conditions": {
              "minMoney": 70000
            },
            "story": "레슨비를 내고 고음 확장 과정을 신청했다. 컨디션이 좋은 날이라 트레이너도 욕심을 낸다.",
            "effects": {
              "money": -70000
            },
            "next": "end_push_lesson"
          },
          {
            "text": "영상 자료로 혼자 고음 연습을 밀어붙인다",
            "story": "강의 영상을 틀어 두고 한 음씩 높여 간다. 혼자라서 멈출 사람이 없다.",
            "effects": {
              "hp": -2
            },
            "next": "solo_high"
          }
        ]
      },
      "plan_basic": {
        "type": "choice",
        "text": "애매한 컨디션. 무리하지 않으면서도 뭔가는 얻고 싶다.",
        "choices": [
          {
            "text": "정식 레슨에서 기초 발성부터 다진다",
            "conditions": {
              "minMoney": 70000
            },
            "story": "트레이너가 오늘은 기초만 하자고 했다. 지루하지만 지금 목에 딱 맞는 처방이다.",
            "effects": {
              "money": -70000
            },
            "next": "end_basic_lesson"
          },
          {
            "text": "영상 자료로 호흡 연습만 한다",
            "story": "고음은 내려놓고 호흡 강의만 골라 따라 했다.",
            "effects": {
              "hp": -2
            },
            "next": "breath_check"
          }
        ]
      },
      "plan_hoarse": {
        "type": "choice",
        "text": "목이 잠긴 날이다. 오늘 무엇을 할 수 있을까?",
        "choices": [
          {
            "text": "레슨에서 목 관리법부터 배운다",
            "conditions": {
              "minMoney": 70000
            },
            "story": "트레이너는 노래 대신 목 풀기와 관리법만 한 시간 내내 가르쳤다.",
            "effects": {
              "money": -70000
            },
            "next": "end_care_lesson"
          },
          {
            "text": "노래는 쉬고 강의 영상만 본다",
            "story": "소리는 내지 않고 강의 영상만 보며 메모했다. 머리로라도 연습한다.",
            "next": "end_rest_watch"
          }
        ]
      },
      "solo_high": {
        "type": "check",
        "text": "오늘의 목표 음까지 반음 남았다. 여기서 더 올리면 목에 무리가 갈 수도 있다.",
        "check": {
          "stat": "Vc",
          "difficulty": 80,
          "traitBonus": {
            "perfectionist": 10,
            "highTension": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "목표 음이 깨끗하게 나왔다. 혼자 박수를 쳤다.",
            "next": "end_solo_high"
          },
          "partial": {
            "text": "음은 닿았지만 끝이 갈라졌다.",
            "next": "end_solo_strain"
          },
          "fail": {
            "text": "무리하게 올리다 목이 쉬어 버렸다.",
            "next": "end_solo_hoarse"
          }
        }
      },
      "breath_check": {
        "type": "check",
        "text": "한 호흡으로 몇 소절까지 갈 수 있는지 재 본다.",
        "check": {
          "stat": "Vc",
          "difficulty": 75,
          "traitBonus": {
            "diligent": 10,
            "perfectionist": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "처음보다 두 소절이나 늘었다.",
            "next": "end_breath_good"
          },
          "partial": {
            "text": "조금 늘었지만 아직 부족하다.",
            "next": "end_breath_half"
          },
          "fail": {
            "text": "숫자는 그대로였다. 오늘은 여기까지.",
            "next": "end_breath_flat"
          }
        }
      },
      "end_push_lesson": {
        "type": "end",
        "result": "success",
        "text": "컨디션 좋은 날에 받은 레슨은 효과가 컸다. 그날 밤 노래 방송에서 {member}의 고음이 한 단계 올라갔다.",
        "effects": {
          "stats": {
            "Vc": 3
          },
          "fans": 40,
          "hp": -3
        }
      },
      "end_basic_lesson": {
        "type": "end",
        "result": "success",
        "text": "기초부터 다진 레슨이었다. 화려하진 않아도 다음 노래 방송부터 목이 덜 지친다.",
        "effects": {
          "stats": {
            "Vc": 3
          },
          "hp": -3
        }
      },
      "end_care_lesson": {
        "type": "end",
        "result": "partial",
        "text": "노래는 거의 못 했지만 목 관리법을 제대로 배웠다. 며칠 뒤 목이 돌아오자 확실히 덜 지쳤다.",
        "effects": {
          "stats": {
            "Vc": 2
          },
          "hp": 4
        }
      },
      "end_rest_watch": {
        "type": "end",
        "result": "neutral",
        "text": "목을 쉬게 한 덕분에 다음 날 컨디션이 돌아왔다. 메모해 둔 내용도 꽤 쌓였다.",
        "effects": {
          "stats": {
            "Vc": 1
          },
          "hp": 5
        }
      },
      "end_solo_high": {
        "type": "end",
        "result": "success",
        "text": "혼자서 목표 음을 넘었다. 다음 노래 방송에서 그 음을 처음 공개하자 채팅창이 놀라움으로 가득 찼다.",
        "effects": {
          "stats": {
            "Vc": 2
          },
          "fans": 40
        }
      },
      "end_solo_strain": {
        "type": "end",
        "result": "partial",
        "text": "고음은 늘었지만 목도 그만큼 지쳤다. 며칠은 아껴 써야 한다.",
        "effects": {
          "stats": {
            "Vc": 1
          },
          "hp": -4
        }
      },
      "end_solo_hoarse": {
        "type": "end",
        "result": "fail",
        "text": "목이 쉬어 그날 노래 방송을 토크로 바꿨다. '무리하지 마'라는 채팅에 {member}는 다음엔 레슨부터 받겠다고 했다.",
        "effects": {
          "hp": -5,
          "memberFlags": {
            "vocalRetry": true
          }
        }
      },
      "end_breath_good": {
        "type": "end",
        "result": "success",
        "text": "호흡이 길어지니 고음도 덩달아 편해졌다. 애매했던 아침이 꽤 괜찮은 하루로 바뀌었다.",
        "effects": {
          "stats": {
            "Vc": 2
          }
        }
      },
      "end_breath_half": {
        "type": "end",
        "result": "partial",
        "text": "호흡은 조금 늘었다. 고음까지 닿으려면 시간이 더 필요하다.",
        "effects": {
          "stats": {
            "Vc": 1
          },
          "hp": -2
        }
      },
      "end_breath_flat": {
        "type": "end",
        "result": "fail",
        "text": "변화가 없어 아쉬웠다. {member}는 컨디션이 좋은 날 다시 도전하기로 했다.",
        "effects": {
          "memberFlags": {
            "vocalRetry": true
          }
        }
      }
    }
  },
  {
    "id": "st_member_slump_voice",
    "title": "가라앉은 목소리",
    "category": "member",
    "group": "condition_slump",
    "description": "컨디션 난조(event_204) 변형 A. 지친 정도와 성격에 따라 첫 장면이 갈리고, 오늘을 어떻게 보낼지 고른 뒤 길마다 다른 판정과 결말이 이어진다.",
    "meta": {
      "theme": "member_growth",
      "setting": "slump_day_checkin",
      "conflict": "fatigue",
      "resolution": "lesson_learned",
      "activity": "rest_day",
      "tone": "emotional"
    },
    "conditions": {
      "maxHp": 29
    },
    "weight": 4,
    "urgent": true,
    "start": "severity",
    "steps": {
      "severity": {
        "type": "branch",
        "branches": [
          {
            "when": {
              "maxHp": 15
            },
            "next": "severe_intro"
          },
          {
            "when": {
              "anyTraits": [
                "diligent",
                "perfectionist"
              ]
            },
            "next": "stubborn_intro"
          }
        ],
        "next": "tired_intro"
      },
      "severe_intro": {
        "type": "story",
        "text": [
          {
            "when": {
              "activity": [
                "rest"
              ]
            },
            "text": "오늘 {member}의 일정표에는 휴방이 잡혀 있다. 그런데도 {member}가 사무실에 나와 있었다. 목소리는 평소보다 한참 가라앉았고, 대답하기 전에 숨을 한 번 고른다. 본인은 괜찮다고 하지만, 누가 봐도 많이 지쳐 보인다."
          },
          {
            "text": "{member}의 목소리가 평소보다 한참 가라앉아 있다. 대답하기 전에 숨을 한 번 고르는 게 보인다. 본인은 괜찮다고 하지만, 누가 봐도 많이 지쳐 보인다."
          }
        ],
        "next": "decide"
      },
      "stubborn_intro": {
        "type": "story",
        "text": [
          {
            "when": {
              "activity": [
                "rest"
              ]
            },
            "text": "오늘은 휴방이 잡힌 날이다. 그런데 {member}가 \"그래도 잠깐은 켜야죠\"라며 방송 준비 목록을 들고 왔다. 목소리는 평소보다 가라앉아 있다. 본인은 괜찮다고 하지만, 지쳐 보이는 건 숨길 수 없다."
          },
          {
            "text": "{member}가 \"오늘 일정 다 할 수 있어요\"라며 준비 목록을 들고 왔다. 목소리는 평소보다 가라앉아 있다. 본인은 괜찮다고 하지만, 지쳐 보이는 건 숨길 수 없다."
          }
        ],
        "next": "decide"
      },
      "tired_intro": {
        "type": "story",
        "text": [
          {
            "when": {
              "activity": [
                "rest"
              ]
            },
            "text": "휴방이 잡힌 날, {member}에게서 메시지가 왔다. \"짧게라도 켤까요?\" 통화 너머 목소리가 평소보다 가라앉아 있다. 본인은 괜찮다고 하지만, 누가 들어도 지쳐 있다."
          },
          {
            "text": "{member}의 목소리가 평소보다 가라앉아 있다. 본인은 괜찮다고 하지만, 누가 봐도 지쳐 보인다."
          }
        ],
        "next": "decide"
      },
      "decide": {
        "type": "choice",
        "text": [
          {
            "when": {
              "memberFlags": [
                "slumpWarmupNote"
              ]
            },
            "text": "\"목만 말고 몸 상태도 말할게요.\" 지난번 일 이후 {member}가 먼저 상태를 털어놓았다. 매니저로서 오늘을 어떻게 보낼지 정해야 한다."
          },
          {
            "text": "매니저로서 오늘을 어떻게 보낼지 정해야 한다."
          }
        ],
        "choices": [
          {
            "text": "하루 푹 쉬게 한다",
            "story": "\"오늘은 아무것도 하지 마요.\" 매니저의 말에 {member}가 잠깐 망설이다 고개를 끄덕였다.",
            "next": "rest_story"
          },
          {
            "text": "짧게 인사 방송만 한다",
            "story": "{member}가 방송 제목에 \"인사만 하고 갈게요\"라고 적었다.",
            "next": "greet_check"
          },
          {
            "text": "괜찮다는 말을 믿고 평소대로 방송한다",
            "effects": {
              "hp": -8
            },
            "story": "\"정말 괜찮아요.\" {member}가 평소 방송 준비를 시작했다.",
            "next": "push_story"
          },
          {
            "text": "방송 대신 팬 커뮤니티에 짧은 근황 글만 남긴다",
            "story": "{member}가 침대에 기댄 채 커뮤니티 글쓰기 창을 열었다.",
            "next": "post_check"
          }
        ]
      },
      "rest_story": {
        "type": "story",
        "text": "{member}가 휴대폰을 내려놓기까지 한참이 걸렸다. 팬 커뮤니티에는 벌써 \"푹 쉬어\"라는 글이 올라오고 있다.",
        "next": "rest_choice"
      },
      "rest_choice": {
        "type": "choice",
        "text": "쉬는 동안 팬들에게 무엇을 남길까?",
        "choices": [
          {
            "text": "휴방 공지에 짧은 감사 인사를 덧붙인다",
            "story": "{member}가 공지 끝에 \"걱정해 줘서 고마워요\" 한 줄을 붙였다.",
            "next": "rest_post"
          },
          {
            "text": "공지만 올리고 연락도 끊고 쉬게 한다",
            "story": "매니저가 대신 공지를 올렸다. {member}의 휴대폰은 저녁까지 조용했다.",
            "next": "rest_full"
          }
        ]
      },
      "rest_post": {
        "type": "end",
        "text": "짧은 인사 한 줄에 팬들의 걱정이 응원으로 바뀌었다. 하루를 쉬고 난 {member}의 목소리에 다시 힘이 돌아왔다.",
        "effects": {
          "hp": 18,
          "fans": -15
        },
        "result": "success"
      },
      "rest_full": {
        "type": "end",
        "text": "하루를 완전히 쉬자 {member}의 얼굴빛이 돌아왔다. 다만 아무 소식 없는 하루에 서운해한 팬들도 있었다.",
        "effects": {
          "hp": 20,
          "fans": -30
        },
        "result": "neutral"
      },
      "greet_check": {
        "type": "check",
        "text": "짧은 인사 방송. 지친 티를 내지 않으면서도 너무 길어지지 않게 끝내야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 68,
          "traitBonus": {
            "calm": 10,
            "chatter": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "{member}가 차분한 목소리로 근황을 전하고 10분 만에 깔끔하게 인사했다.",
            "next": "greet_warm"
          },
          "partial": {
            "text": "반가운 채팅에 답하다 보니 인사가 30분을 넘겼다.",
            "next": "greet_long"
          },
          "fail": {
            "text": "첫 인사부터 목소리가 갈라지자 채팅창이 \"그냥 쉬어\"로 가득 찼다.",
            "next": "greet_worry"
          }
        }
      },
      "greet_warm": {
        "type": "end",
        "text": "짧지만 따뜻한 인사에 팬들이 안심했다. {member}도 남은 시간을 푹 쉬었다.",
        "effects": {
          "hp": 8,
          "fans": 20
        },
        "result": "success"
      },
      "greet_long": {
        "type": "end",
        "text": "팬들은 즐거웠지만, 길어진 인사만큼 쉬는 시간이 줄었다.",
        "effects": {
          "hp": 4,
          "fans": 15
        },
        "result": "partial"
      },
      "greet_worry": {
        "type": "end",
        "text": "방송은 금방 끝났지만 걱정 섞인 글이 커뮤니티에 이어졌다. {member}는 다음 날 \"이제 괜찮다\"는 글로 팬들을 먼저 안심시켰다.",
        "effects": {
          "hp": 6,
          "fans": -10
        },
        "result": "fail"
      },
      "push_story": {
        "type": "story",
        "text": "방송 한 시간째. 말과 말 사이 간격이 점점 길어진다. 채팅창 몇몇이 \"오늘 좀 피곤해 보인다\"고 적었다.",
        "next": "push_check"
      },
      "push_check": {
        "type": "check",
        "text": "여기서부터는 버티는 힘의 문제다. 평소 같은 방송을 끝까지 해낼 수 있을까?",
        "check": {
          "stat": "Bs",
          "difficulty": 75
        },
        "outcomes": {
          "great": {
            "text": "{member}가 피곤을 농담으로 바꾸며 오히려 분위기를 끌어올렸다. 평소보다 좋은 방송이 됐다.",
            "effects": {
              "fans": 60,
              "fame": 1
            },
            "next": "push_ok"
          },
          "success": {
            "text": "조금 힘겨워 보였지만 {member}는 평소 방송을 끝까지 해냈다.",
            "next": "push_ok"
          },
          "partial": {
            "text": "방송은 끝까지 갔지만 후반부는 눈에 띄게 처졌다.",
            "next": "push_shaky"
          },
          "fail": {
            "text": "방송 도중 목소리가 잠겨 결국 일찍 끝내야 했다.",
            "next": "push_down"
          }
        }
      },
      "push_ok": {
        "type": "end",
        "text": "평소대로 해낸 방송에 팬들은 즐거워했다. 방송이 끝나자 {member}는 그대로 잠들었다.",
        "effects": {
          "fans": 60
        },
        "result": "success"
      },
      "push_shaky": {
        "type": "end",
        "text": "방송은 지켰지만, 다시보기에는 \"괜찮은 거 맞아?\"라는 댓글이 여럿 달렸다. 시청자 수는 평소만큼 나왔다.",
        "effects": {
          "fans": 20
        },
        "result": "partial"
      },
      "push_down": {
        "type": "end",
        "text": "급히 끝난 방송에 걱정 섞인 반응이 쏟아졌다. 회복 후 {member}는 \"앞으로는 목 상태부터 솔직하게 말하겠다\"고 했고, 매니저도 방송 전 점검을 일정에 넣었다.",
        "effects": {
          "fans": -40,
          "fame": -1,
          "memberFlags": {
            "slumpVoiceCheck": true
          }
        },
        "result": "fail"
      },
      "post_check": {
        "type": "check",
        "text": "짧은 글 하나로 팬들을 안심시키면서, 걱정은 키우지 않아야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 64,
          "traitBonus": {
            "calm": 10,
            "chatter": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "{member}가 이불 이모티콘과 함께 \"오늘은 충전 중\"이라고 적었다. 귀여운 글에 댓글이 줄줄이 달렸다.",
            "next": "post_cute"
          },
          "partial": {
            "text": "글은 무난했지만, 너무 짧아서 오히려 \"많이 아파?\"라는 댓글이 달렸다.",
            "next": "post_short"
          },
          "fail": {
            "text": "피곤한 채 쓴 글이 의도와 달리 무겁게 읽혔다. 걱정하는 댓글이 빠르게 늘었다.",
            "next": "post_heavy"
          }
        }
      },
      "post_cute": {
        "type": "end",
        "text": "근황 글 하나로 팬들도 {member}도 편안한 하루를 보냈다.",
        "effects": {
          "hp": 14,
          "fans": 10
        },
        "result": "success"
      },
      "post_short": {
        "type": "end",
        "text": "쉬기는 했지만 팬들의 걱정을 다 덜진 못했다. 다음 날 {member}가 조금 더 긴 글로 근황을 다시 전했다.",
        "effects": {
          "hp": 14,
          "fans": -10
        },
        "result": "partial"
      },
      "post_heavy": {
        "type": "end",
        "text": "{member}는 쉬는 내내 댓글을 신경 썼다. 다음 날 매니저와 함께 \"괜찮다\"는 공지를 다시 올리고 나서야 분위기가 가라앉았다.",
        "effects": {
          "hp": 12,
          "fans": -25
        },
        "result": "fail"
      }
    }
  },
  {
    "id": "st_member_slump_warmup",
    "title": "괜찮다는 발성 연습",
    "category": "member",
    "group": "condition_slump",
    "description": "컨디션 난조(event_204) 변형 B. \"괜찮다\"는 말을 확인하는 발성 판정이 먼저 오고, 목 상태에 따라 같은 선택도 다른 장면과 결말로 이어진다.",
    "meta": {
      "theme": "member_growth",
      "setting": "warmup_voice_test",
      "conflict": "miscommunication",
      "resolution": "compromise",
      "activity": "rest_day",
      "tone": "warm"
    },
    "conditions": {
      "maxHp": 29
    },
    "weight": 4,
    "urgent": true,
    "start": "warmup",
    "steps": {
      "warmup": {
        "type": "check",
        "text": [
          {
            "when": {
              "memberFlags": [
                "slumpVoiceCheck"
              ]
            },
            "text": "지난번 약속대로 {member}가 먼저 목 상태를 말하러 왔다. \"조금 가라앉긴 했는데, 들어 보세요.\" {member}가 매니저 앞에서 발성을 해 보인다. 정말 괜찮은지, 괜찮다고 믿고 싶은 건지 확인해야 한다."
          },
          {
            "when": {
              "activity": [
                "rest"
              ]
            },
            "text": "휴방이 잡힌 날인데도 {member}가 사무실에 왔다. 목소리가 평소보다 가라앉아 있는데도 \"괜찮아요, 들어 보세요\"라며 발성을 해 보인다. 본인은 괜찮다고 하지만, 누가 봐도 지쳐 보인다."
          },
          {
            "text": "{member}의 목소리가 평소보다 가라앉아 있다. \"괜찮아요, 들어 보세요.\" {member}가 매니저 앞에서 발성을 해 보인다. 본인은 괜찮다고 하지만, 누가 봐도 지쳐 보인다."
          }
        ],
        "check": {
          "stat": "Vc",
          "difficulty": 70,
          "traitBonus": {
            "calm": 5,
            "diligent": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "소리는 생각보다 또렷했다. 다만 발성이 끝나자마자 의자에 털썩 주저앉았다. 목보다 몸이 먼저 지친 것이다.",
            "next": "ok_choice"
          },
          "partial": {
            "text": "첫 소리는 괜찮았는데 길게 끄는 음에서 숨이 모자랐다. {member}는 \"이 정도면 되죠?\"라며 웃었다.",
            "next": "thin_choice"
          },
          "fail": {
            "text": "두 번째 음에서 목소리가 갈라졌다. {member}가 민망한 듯 헛기침을 했다. \"어제까진 괜찮았는데...\"",
            "next": "cracked_choice"
          }
        }
      },
      "ok_choice": {
        "type": "choice",
        "text": "목은 버티지만 몸은 지쳐 있다. 오늘을 어떻게 할까?",
        "choices": [
          {
            "text": "하루 푹 쉬게 한다",
            "story": "\"목이 괜찮을 때 쉬어야 오래 가요.\" 매니저의 말에 {member}가 순순히 웃었다.",
            "next": "ok_rest"
          },
          {
            "text": "짧게 인사 방송만 한다",
            "story": "{member}가 \"목 괜찮으니까 인사만 할게요\"라며 짧은 방송을 켰다.",
            "next": "ok_greet"
          },
          {
            "text": "괜찮다는 말을 믿고 평소대로 방송한다",
            "effects": {
              "hp": -8
            },
            "story": "\"목 멀쩡한 거 들으셨죠?\" {member}가 평소 방송 준비를 시작했다.",
            "next": "ok_stream"
          }
        ]
      },
      "ok_rest": {
        "type": "end",
        "text": "하루를 쉬고 나자 몸도 목소리만큼 회복됐다. 팬들도 \"쉴 때 쉬는 게 최고\"라며 반겼다.",
        "effects": {
          "hp": 20,
          "fans": -30
        },
        "result": "success"
      },
      "ok_greet": {
        "type": "end",
        "text": "또렷한 목소리로 짧게 인사하자 팬들이 반가워했다. 방송을 끄고 {member}는 바로 쉬었다.",
        "effects": {
          "hp": 8,
          "fans": 15
        },
        "result": "success"
      },
      "ok_stream": {
        "type": "check",
        "text": "목은 괜찮다. 문제는 지친 몸으로 평소 같은 텐션을 끝까지 끌고 갈 수 있느냐다.",
        "check": {
          "stat": "Bs",
          "difficulty": 75
        },
        "outcomes": {
          "great": {
            "text": "목 상태가 좋아서인지 {member}의 입담이 평소보다 더 살아났다. 피곤함을 잊게 하는 방송이었다.",
            "effects": {
              "fans": 60,
              "fame": 1
            },
            "next": "ok_stream_good"
          },
          "success": {
            "text": "{member}가 지친 몸을 다독이며 평소 방송을 끝까지 해냈다.",
            "next": "ok_stream_good"
          },
          "partial": {
            "text": "목소리는 끝까지 괜찮았지만 후반부 반응이 눈에 띄게 느려졌다.",
            "next": "ok_stream_tired"
          },
          "fail": {
            "text": "목은 버텼지만 몸이 먼저 무너졌다. 방송 도중 어지럽다며 일찍 끝냈다.",
            "next": "ok_stream_drop"
          }
        }
      },
      "ok_stream_good": {
        "type": "end",
        "text": "\"오늘도 재밌었다\"는 반응 속에 방송이 끝났다. {member}는 다음 날 늦잠으로 피로를 풀었다.",
        "effects": {
          "fans": 60
        },
        "result": "success"
      },
      "ok_stream_tired": {
        "type": "end",
        "text": "방송은 지켰지만, 팬들 사이에서 \"오늘 좀 피곤해 보였다\"는 이야기가 나왔다.",
        "effects": {
          "fans": 20
        },
        "result": "partial"
      },
      "ok_stream_drop": {
        "type": "end",
        "text": "급히 끝난 방송에 걱정하는 글이 이어졌다. 회복 후 {member}는 \"목만 보고 괜찮다고 했던 게 실수였다\"고 털어놨고, 이후 방송 전 점검을 몸 상태까지 넓혔다.",
        "effects": {
          "fans": -40,
          "fame": -1,
          "memberFlags": {
            "slumpWarmupNote": true
          }
        },
        "result": "fail"
      },
      "thin_choice": {
        "type": "choice",
        "text": "숨이 모자란 걸 {member}도 알고 있다. 그래도 \"할 수 있다\"는 눈빛이다.",
        "choices": [
          {
            "text": "하루 푹 쉬게 한다",
            "story": "\"숨이 차는 건 쉬라는 신호예요.\" {member}가 잠깐 머뭇거리다 고개를 끄덕였다.",
            "next": "thin_rest"
          },
          {
            "text": "짧게 인사 방송만 한다",
            "story": "{member}가 \"진짜 인사만\"이라고 몇 번이나 강조하며 방송을 켰다.",
            "next": "thin_greet"
          },
          {
            "text": "괜찮다는 말을 믿고 평소대로 방송한다",
            "effects": {
              "hp": -8
            },
            "story": "{member}가 물병을 두 개 챙겨 평소 방송을 시작했다.",
            "next": "thin_stream"
          }
        ]
      },
      "thin_rest": {
        "type": "end",
        "text": "쉬는 동안 숨이 차는 증상이 가라앉았다. 다음 방송에서 {member}가 \"그때 쉬길 잘했다\"고 말했다.",
        "effects": {
          "hp": 20,
          "fans": -30
        },
        "result": "success"
      },
      "thin_greet": {
        "type": "check",
        "text": "숨이 짧은 채로 인사를 마쳐야 한다. 짧고 밝게 끝낼 수 있을까?",
        "check": {
          "stat": "Bs",
          "difficulty": 66,
          "traitBonus": {
            "calm": 10
          }
        },
        "outcomes": {
          "success": {
            "text": "숨 고를 틈을 잘 섞어 가며 {member}가 짧은 인사를 무사히 마쳤다.",
            "next": "thin_greet_ok"
          },
          "partial": {
            "text": "인사는 마쳤지만 중간중간 숨을 고르는 소리가 마이크에 담겼다.",
            "next": "thin_greet_cough"
          },
          "fail": {
            "text": "말을 잇다 숨이 차서 몇 번이나 멈췄다. 채팅창에 걱정이 쏟아졌다.",
            "next": "thin_greet_worry"
          }
        }
      },
      "thin_greet_ok": {
        "type": "end",
        "text": "짧은 인사로 근황을 전했다. 팬들도 \"얼른 쉬어\"라며 웃으며 보내 주었다.",
        "effects": {
          "hp": 8,
          "fans": 10
        },
        "result": "success"
      },
      "thin_greet_cough": {
        "type": "end",
        "text": "팬들은 반가워하면서도 숨소리를 걱정했다. 인사는 했지만 쉬는 시간은 그만큼 줄었다.",
        "effects": {
          "hp": 6
        },
        "result": "partial"
      },
      "thin_greet_worry": {
        "type": "end",
        "text": "걱정 섞인 반응에 {member}가 미안해했다. 다음 날 매니저가 휴방 공지를 대신 올리며 \"충분히 쉬고 돌아온다\"고 전했다.",
        "effects": {
          "hp": 6,
          "fans": -15
        },
        "result": "fail"
      },
      "thin_stream": {
        "type": "check",
        "text": "숨이 짧은 채로 평소 분량을 소화해야 한다. 말이 끊기지 않게 버틸 수 있을까?",
        "check": {
          "stat": "Bs",
          "difficulty": 75
        },
        "outcomes": {
          "great": {
            "text": "{member}가 숨이 찰 때마다 채팅을 읽는 시간으로 바꾸며 흐름을 지켰다. 오히려 채팅 참여가 늘었다.",
            "effects": {
              "fans": 60,
              "fame": 1
            },
            "next": "thin_stream_good"
          },
          "success": {
            "text": "숨을 고르는 틈을 잘 숨기며 평소 방송을 끝까지 해냈다.",
            "next": "thin_stream_good"
          },
          "partial": {
            "text": "방송은 끝까지 갔지만 말이 자주 끊겼다.",
            "next": "thin_stream_tired"
          },
          "fail": {
            "text": "숨이 차서 말을 잇지 못하는 순간이 늘었다. 결국 일찍 방송을 접었다.",
            "next": "thin_stream_drop"
          }
        }
      },
      "thin_stream_good": {
        "type": "end",
        "text": "끝까지 해낸 방송에 팬들이 박수를 보냈다. {member}는 방송을 끄자마자 물을 한 병 다 비웠다.",
        "effects": {
          "fans": 60
        },
        "result": "success"
      },
      "thin_stream_tired": {
        "type": "end",
        "text": "방송은 지켰지만 \"숨소리가 신경 쓰였다\"는 댓글이 달렸다.",
        "effects": {
          "fans": 20
        },
        "result": "partial"
      },
      "thin_stream_drop": {
        "type": "end",
        "text": "일찍 끝난 방송에 팬들이 걱정을 쏟아냈다. {member}는 회복 후 \"숨찬 걸 알면서도 버틴 게 욕심이었다\"고 말했다.",
        "effects": {
          "fans": -40,
          "fame": -1,
          "memberFlags": {
            "slumpWarmupNote": true
          }
        },
        "result": "fail"
      },
      "cracked_choice": {
        "type": "choice",
        "text": "갈라진 목소리에 매니저도 {member}도 잠시 말이 없었다.",
        "choices": [
          {
            "text": "하루 푹 쉬게 한다",
            "story": "\"오늘은 쉬어요. 목소리가 먼저예요.\" {member}가 말없이 고개를 끄덕였다.",
            "next": "cracked_rest"
          },
          {
            "text": "짧게 인사 방송만 한다",
            "story": "{member}가 \"목소리 안 좋은 것만 알려 드리고 올게요\"라며 짧은 방송을 켰다.",
            "next": "cracked_greet"
          },
          {
            "text": "괜찮다는 말을 믿고 평소대로 방송한다",
            "effects": {
              "hp": -8
            },
            "story": "{member}가 목캔디를 한 줌 집어 들고 평소 방송 준비를 시작했다.",
            "next": "cracked_stream"
          }
        ]
      },
      "cracked_rest": {
        "type": "end",
        "text": "하루를 푹 쉬자 갈라졌던 목소리가 돌아왔다. 팬들은 \"무리 안 해서 다행\"이라며 복귀를 반겼다.",
        "effects": {
          "hp": 20,
          "fans": -30
        },
        "result": "success"
      },
      "cracked_greet": {
        "type": "end",
        "text": "갈라진 목소리로 짧게 사정을 전했다. 팬들은 이해해 주었지만, 목소리를 직접 들은 만큼 걱정도 더 커졌다.",
        "effects": {
          "hp": 8,
          "fans": 5
        },
        "result": "partial"
      },
      "cracked_stream": {
        "type": "check",
        "text": "갈라진 목소리로 평소 방송을 해내야 한다. 목을 아끼면서도 분위기를 지킬 수 있을까?",
        "check": {
          "stat": "Bs",
          "difficulty": 75
        },
        "outcomes": {
          "great": {
            "text": "{member}가 목소리 대신 리액션과 채팅 읽기로 방송을 채웠다. \"오늘 새로운 매력 발견\"이라는 반응이 나왔다.",
            "effects": {
              "fans": 60,
              "fame": 1
            },
            "next": "cracked_stream_good"
          },
          "success": {
            "text": "{member}가 목을 아끼며 조용한 진행으로 방송을 끝까지 이끌었다.",
            "next": "cracked_stream_good"
          },
          "partial": {
            "text": "목을 아끼느라 말수가 줄었고, 방송은 평소보다 한참 조용했다.",
            "next": "cracked_stream_tired"
          },
          "fail": {
            "text": "방송 30분 만에 목소리가 거의 나오지 않게 됐다. 급히 방송을 끝냈다.",
            "next": "cracked_stream_drop"
          }
        }
      },
      "cracked_stream_good": {
        "type": "end",
        "text": "갈라진 목으로 해낸 방송이 오히려 화제가 됐다. 다만 매니저는 다음엔 꼭 쉬게 하겠다고 다짐했다.",
        "effects": {
          "fans": 60
        },
        "result": "success"
      },
      "cracked_stream_tired": {
        "type": "end",
        "text": "조용한 방송도 나쁘지 않았다는 팬들이 있었지만, 목 상태를 걱정하는 목소리가 더 컸다.",
        "effects": {
          "fans": 20
        },
        "result": "partial"
      },
      "cracked_stream_drop": {
        "type": "end",
        "text": "목소리가 나오지 않아 끝난 방송에 팬들의 걱정이 이어졌다. 회복 후 {member}는 매니저와 함께 \"목이 갈라지면 그날은 쉰다\"는 약속을 정했다.",
        "effects": {
          "fans": -40,
          "fame": -1,
          "memberFlags": {
            "slumpWarmupNote": true
          }
        },
        "result": "fail"
      }
    }
  },
  {
    "id": "st_overwork_meeting",
    "title": "과로 경보 면담",
    "category": "member",
    "group": "overwork_alert",
    "description": "과로 경보(ev_h01) 변형 A. 휴식 / 방송 시간 단축 / 의지 존중 중 하나를 고르고, 선택마다 다른 판정과 결말이 이어진다.",
    "meta": {
      "theme": "member_growth",
      "setting": "manager_meeting",
      "conflict": "fatigue",
      "resolution": "compromise",
      "activity": "rest",
      "tone": "warm"
    },
    "conditions": {
      "maxHp": 45,
      "cooldown": 3
    },
    "urgent": true,
    "start": "pick",
    "steps": {
      "pick": {
        "type": "choice",
        "text": [
          {
            "when": {
              "anyTraits": [
                "longStream"
              ]
            },
            "text": "{member}의 방송 시간이 계속 늘고 있다. 원래 길게 방송하는 걸 좋아하지만, 요즘은 끝날 무렵 목소리가 눈에 띄게 갈라진다. 매니저가 면담을 잡았다."
          },
          {
            "text": "{member}의 방송 시간이 계속 늘고 있다. 본인은 즐겁다지만 피로가 눈에 띈다. 매니저가 면담을 잡았다."
          }
        ],
        "choices": [
          {
            "text": "반강제로 이틀 치 휴식을 준다",
            "story": "'이틀은 무조건 쉬어야 해요.' {member}는 아쉬워했지만 결국 고개를 끄덕였다. 이제 휴방 공지를 써야 한다.",
            "next": "rest_notice"
          },
          {
            "text": "방송 시간을 절반으로 줄인다",
            "story": "방송은 하되 시간을 절반으로 줄이기로 했다. 짧아진 만큼 알차게 채워야 한다.",
            "next": "half_check"
          },
          {
            "text": "본인 의지를 존중한다",
            "story": "'지금이 제일 재밌어서요.' {member}의 눈빛이 단단하다. 매니저는 대신 중간 휴식만은 약속받았다.",
            "next": "push_check"
          }
        ]
      },
      "rest_notice": {
        "type": "check",
        "text": "휴방 공지는 아쉬움을 달래면서도 걱정을 키우지 않게 써야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 68,
          "traitBonus": {
            "calm": 10,
            "chatter": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "솔직하고 따뜻한 공지에 '푹 쉬고 와'라는 댓글이 줄을 이었다.",
            "next": "end_rest_good"
          },
          "partial": {
            "text": "응원이 대부분이었지만, 갑작스러운 휴방에 아쉬워하는 목소리도 있었다.",
            "next": "end_rest_mixed"
          },
          "fail": {
            "text": "공지가 너무 짧았다. '무슨 일 있냐'는 걱정이 커졌다.",
            "next": "end_rest_worry"
          }
        }
      },
      "half_check": {
        "type": "check",
        "text": "평소의 절반 시간 안에 하고 싶은 이야기를 다 담아야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 72,
          "traitBonus": {
            "host": 10,
            "chatter": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "짧고 굵은 방송이었다. '오히려 밀도가 높다'는 반응이 나왔다.",
            "next": "end_half_good"
          },
          "partial": {
            "text": "알찼지만 준비한 코너 하나를 못 했다.",
            "next": "end_half_ok"
          },
          "fail": {
            "text": "시간에 쫓기다 정신없이 끝났다.",
            "next": "end_half_rushed"
          }
        }
      },
      "push_check": {
        "type": "check",
        "text": "긴 방송이 이어진다. 약속한 중간 휴식을 챙기면서도 분위기를 지켜야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 75,
          "traitBonus": {
            "longStream": 10,
            "highTension": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "중간 휴식까지 콘텐츠로 만들며 끝까지 즐겁게 달렸다.",
            "next": "end_push_ok"
          },
          "partial": {
            "text": "방송은 즐거웠지만 끝날 무렵엔 확실히 지쳐 보였다.",
            "next": "end_push_tired"
          },
          "fail": {
            "text": "후반부에 목소리가 거의 나오지 않았다. 채팅창이 걱정으로 가득 찼다.",
            "next": "end_push_crash"
          }
        }
      },
      "end_rest_good": {
        "type": "end",
        "result": "success",
        "text": "이틀을 푹 쉰 {member}가 돌아왔다. 복귀 방송의 첫마디는 '다들 기다려 줘서 고마워'였다.",
        "effects": {
          "hp": 18,
          "fans": -20
        }
      },
      "end_rest_mixed": {
        "type": "end",
        "result": "partial",
        "text": "몸은 회복했지만 이틀간의 빈자리는 조금 컸다. 복귀 방송에서 차근차근 메워 가기로 했다.",
        "effects": {
          "hp": 18,
          "fans": -40
        }
      },
      "end_rest_worry": {
        "type": "end",
        "result": "fail",
        "text": "쉬는 동안 걱정 섞인 추측이 퍼졌다. 복귀 방송에서 {member}가 직접 '그냥 피곤했던 것'이라고 웃으며 정리했다.",
        "effects": {
          "hp": 14,
          "fans": -60
        }
      },
      "end_half_good": {
        "type": "end",
        "result": "success",
        "text": "짧아진 방송이 오히려 새로운 매력이 됐다. 몸도 조금씩 회복되고 있다.",
        "effects": {
          "hp": 8,
          "fans": 40
        }
      },
      "end_half_ok": {
        "type": "end",
        "result": "partial",
        "text": "방송도 회복도 반반이었다. 다음 주까지는 이 리듬을 지켜 보기로 했다.",
        "effects": {
          "hp": 8,
          "fans": 20
        }
      },
      "end_half_rushed": {
        "type": "end",
        "result": "fail",
        "text": "시간에 쫓긴 방송은 아쉬움만 남겼다. 그래도 쉬는 시간이 늘어 몸은 조금 나아졌다.",
        "effects": {
          "hp": 6,
          "fans": -10
        }
      },
      "end_push_ok": {
        "type": "end",
        "result": "success",
        "text": "{member}의 의지는 진짜였다. 긴 방송이 또 하나의 명장면을 만들었다. 다만 피로는 그대로 쌓였다.",
        "effects": {
          "hp": -5,
          "fans": 80
        }
      },
      "end_push_tired": {
        "type": "end",
        "result": "partial",
        "text": "즐거운 방송이었지만 다음 날 일어나기가 힘들었다. 매니저와 다음 주 일정을 다시 보기로 했다.",
        "effects": {
          "hp": -8,
          "fans": 60,
          "memberFlags": {
            "overworkWarned": true
          }
        }
      },
      "end_push_crash": {
        "type": "end",
        "result": "fail",
        "text": "결국 방송을 일찍 끝내야 했다. 걱정하는 팬들에게 {member}는 다음 방송부터 시간을 줄이겠다고 약속했다.",
        "effects": {
          "hp": -10,
          "fans": 20,
          "memberFlags": {
            "overworkWarned": true
          }
        }
      }
    }
  },
  {
    "id": "st_overwork_signs",
    "title": "과로의 신호",
    "category": "member",
    "group": "overwork_alert",
    "description": "과로 경보(ev_h01) 변형 B. 지친 정도에 따라 시작 장면이 갈리고, 대화 판정 결과에 따라 열리는 해결책이 달라진다.",
    "meta": {
      "theme": "member_growth",
      "setting": "stream_schedule_review",
      "conflict": "schedule_clash",
      "resolution": "quiet_growth",
      "activity": "rest",
      "tone": "emotional"
    },
    "conditions": {
      "maxHp": 45,
      "cooldown": 3
    },
    "urgent": true,
    "start": "level",
    "steps": {
      "level": {
        "type": "branch",
        "branches": [
          {
            "when": {
              "maxHp": 29
            },
            "next": "critical"
          }
        ],
        "next": "tired"
      },
      "critical": {
        "type": "story",
        "text": "일정표를 보던 매니저가 멈칫했다. 이번 주 {member}의 방송 시간이 지난주의 두 배다. 방금 끝난 방송에서는 웃다가 잠깐 멍해지는 순간까지 있었다. 그런데 다음 주에는 기다리던 기획 방송까지 잡혀 있다.",
        "next": "talk"
      },
      "tired": {
        "type": "story",
        "text": "일정표를 보던 매니저가 고개를 갸웃했다. {member}의 방송 시간이 슬금슬금 늘고 있다. 본인은 괜찮다고 하지만, 다음 주에 잡힌 기획 방송 준비까지 겹쳐 있다.",
        "next": "talk"
      },
      "talk": {
        "type": "check",
        "text": "매니저가 {member}와 마주 앉았다. 걱정을 잔소리로 듣지 않게, 본인이 먼저 지금 상태를 말하게 해야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 70,
          "traitBonus": {
            "calm": 10,
            "chatter": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "{member}가 먼저 '사실 요즘 좀 힘들었다'고 털어놨다. 같이 해결책을 찾을 수 있게 됐다.",
            "next": "options_open"
          },
          "partial": {
            "text": "{member}는 피곤하다는 건 인정했지만, 방송을 쉬는 건 싫다고 했다.",
            "next": "options_guarded"
          },
          "fail": {
            "text": "'괜찮다니까요.' 대화가 엇나갔다. {member}는 걱정을 부담으로 느낀 것 같다.",
            "next": "options_stubborn"
          }
        }
      },
      "options_open": {
        "type": "choice",
        "text": "솔직한 대화 끝에 선택지가 넓어졌다.",
        "choices": [
          {
            "text": "기획 방송을 미루고 이틀 쉬게 한다",
            "story": "기획 방송을 일주일 미루고, 이틀 동안 아무것도 하지 않기로 했다.",
            "next": "end_open_rest"
          },
          {
            "text": "방송 시간을 절반으로 줄이고 기획 준비를 나눈다",
            "story": "방송 시간을 절반으로 줄이고, 기획 준비는 스태프와 나눠 맡기로 했다.",
            "next": "end_open_half"
          },
          {
            "text": "본인 뜻대로 하되 매일 컨디션을 같이 점검한다",
            "story": "{member}의 뜻을 존중하기로 했다. 대신 매일 방송 전 컨디션 체크를 약속했다.",
            "next": "end_open_trust"
          }
        ]
      },
      "options_guarded": {
        "type": "choice",
        "text": "방송을 쉬는 건 싫다고 한다. 할 수 있는 건 많지 않다.",
        "choices": [
          {
            "text": "방송 시간을 절반으로 줄이자고 설득한다",
            "story": "'쉬는 게 아니라 짧게 하는 거예요.' 한참을 고민한 끝에 {member}가 받아들였다.",
            "next": "end_guarded_half"
          },
          {
            "text": "본인 의지를 존중한다",
            "story": "결국 {member}의 뜻대로 하기로 했다. 매니저의 걱정은 그대로 남았다.",
            "next": "end_guarded_push"
          },
          {
            "text": "반강제로 이틀 치 휴식을 준다",
            "story": "쉬기 싫다는 말에도 매니저는 일정표에서 이틀을 지웠다. {member}가 한숨을 쉬며 휴방 공지를 썼다.",
            "next": "end_guarded_rest"
          }
        ]
      },
      "options_stubborn": {
        "type": "choice",
        "text": "대화가 엇나간 채 끝났다. 매니저로서 결정해야 한다.",
        "choices": [
          {
            "text": "반강제로 이틀 치 휴식을 준다",
            "story": "매니저가 일정표에서 이틀을 지웠다. {member}는 서운한 얼굴로 휴방 공지를 썼다.",
            "next": "end_forced_rest"
          },
          {
            "text": "방송 시간을 절반으로 줄인다",
            "story": "대화는 엇나갔지만 매니저는 방송 시간만은 절반으로 줄여 일정표에 넣었다. {member}는 말없이 받아들였다.",
            "next": "end_stubborn_half"
          },
          {
            "text": "본인 의지를 존중한다",
            "story": "더 말하지 않기로 했다. {member}는 평소처럼, 아니 평소보다 더 길게 방송을 켰다.",
            "next": "end_stubborn_push"
          }
        ]
      },
      "end_open_rest": {
        "type": "end",
        "result": "success",
        "text": "푹 쉬고 돌아온 {member}의 기획 방송은 예정보다 일주일 늦었지만, 그만큼 완성도가 높았다.",
        "effects": {
          "hp": 18,
          "fans": -20
        }
      },
      "end_open_half": {
        "type": "end",
        "result": "success",
        "text": "짧아진 방송과 나눠 맡은 기획 준비 덕분에 몸도 방송도 지킬 수 있었다.",
        "effects": {
          "hp": 8,
          "fans": 30
        }
      },
      "end_open_trust": {
        "type": "end",
        "result": "partial",
        "text": "매일 컨디션 체크는 잘 지켜졌다. 피로는 쌓였지만, 위험한 신호는 바로 알아챌 수 있게 됐다.",
        "effects": {
          "hp": -3,
          "fans": 80
        }
      },
      "end_guarded_half": {
        "type": "end",
        "result": "partial",
        "text": "방송 시간을 줄이자 몸은 조금 나아졌다. 다만 쉬지 못한 피로는 다 풀리지 않았다.",
        "effects": {
          "hp": 8,
          "fans": 20
        }
      },
      "end_guarded_push": {
        "type": "end",
        "result": "fail",
        "text": "{member}는 끝까지 달렸고 방송은 즐거웠다. 하지만 기획 방송 날, 목소리가 반쯤 잠겨 있었다.",
        "effects": {
          "hp": -5,
          "fans": 60,
          "memberFlags": {
            "overworkWarned": true
          }
        }
      },
      "end_forced_rest": {
        "type": "end",
        "result": "partial",
        "text": "이틀을 쉬자 몸은 돌아왔다. 복귀 후 {member}가 먼저 '그때는 서운했는데 고마웠다'고 말했다.",
        "effects": {
          "hp": 18,
          "fans": -40
        }
      },
      "end_stubborn_push": {
        "type": "end",
        "result": "fail",
        "text": "무리한 일정 끝에 결국 기획 방송을 미뤄야 했다. 팬들의 걱정 메시지를 읽던 {member}가 조용히 일정표를 다시 짰다.",
        "effects": {
          "hp": -5,
          "fans": 80,
          "memberFlags": {
            "overworkWarned": true
          }
        }
      },
      "end_guarded_rest": {
        "type": "end",
        "result": "partial",
        "text": "이틀 휴식으로 몸은 돌아왔다. 다만 쉬고 싶지 않았던 마음은 조금 남아, 복귀 방송에서 평소보다 말수가 적었다.",
        "effects": {
          "hp": 18,
          "fans": -40
        }
      },
      "end_stubborn_half": {
        "type": "end",
        "result": "partial",
        "text": "짧아진 방송에 몸은 조금 나아졌다. 며칠 뒤 {member}가 먼저 \"그때 줄여 줘서 다행이었다\"고 말했다.",
        "effects": {
          "hp": 8,
          "fans": 10
        }
      }
    }
  },
  {
    "id": "st_fan_online_meeting",
    "title": "온라인 팬미팅",
    "category": "fan",
    "description": "첫 온라인 팬미팅. 중심 코너를 고르고, 마지막에는 팬들이 준비한 깜짝 선물이 기다린다.",
    "meta": {
      "theme": "fan_event",
      "setting": "online_fanmeeting",
      "conflict": "nervousness",
      "resolution": "audience_help",
      "activity": "talk",
      "tone": "warm"
    },
    "conditions": {
      "minDay": 8,
      "minFans": 2000,
      "blockedActivityCategories": [
        "rest"
      ],
      "cooldown": 10
    },
    "traitWeights": {
      "introvert": 1.5
    },
    "start": "intro",
    "steps": {
      "intro": {
        "type": "story",
        "text": [
          {
            "when": {
              "anyTraits": [
                "introvert"
              ]
            },
            "text": "{member}는 온라인 팬미팅 공지를 올려 놓고도 벌써부터 손에 땀이 난다. 낯을 가리는 편이라 수백 명 앞에서 이야기하는 건 여전히 떨린다."
          },
          {
            "text": "{member}의 첫 온라인 팬미팅 날이 잡혔다. 사연 읽기, 라이브 노래, 미니 게임까지 준비할 게 많다."
          }
        ],
        "next": "plan"
      },
      "plan": {
        "type": "choice",
        "text": "팬미팅의 중심 코너를 무엇으로 할까?",
        "choices": [
          {
            "text": "사연을 읽으며 이야기를 나눈다",
            "next": "talk"
          },
          {
            "text": "라이브 노래로 분위기를 띄운다",
            "next": "sing"
          },
          {
            "text": "팬들과 미니 게임을 한다",
            "next": "game"
          }
        ]
      },
      "talk": {
        "type": "check",
        "text": "첫 사연부터 눈물 버튼이다. 목소리가 떨리지 않게 천천히 읽어 내려간다.",
        "check": {
          "stat": "Bs",
          "difficulty": 70,
          "traitBonus": {
            "chatter": 10,
            "calm": 5,
            "host": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "사연 하나하나에 진심으로 답했다. 채팅창이 조용히 따뜻해졌다.",
            "effects": {
              "fans": 50
            },
            "next": "surprise"
          },
          "partial": {
            "text": "중간에 말이 꼬여 몇 번 멈칫했지만, 팬들은 끝까지 기다려 줬다.",
            "next": "surprise_small"
          },
          "fail": {
            "text": "긴장한 탓에 준비한 이야기의 절반도 하지 못했다.",
            "next": "end_rough"
          }
        }
      },
      "sing": {
        "type": "check",
        "text": "반주가 흐르고 조명이 켜졌다. 팬들 앞에서 부르는 첫 라이브다.",
        "check": {
          "stat": "Vc",
          "difficulty": 76,
          "traitBonus": {
            "instrument": 10,
            "cover": 5,
            "highTension": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "마지막 음이 끝나자 채팅창이 박수 이모티콘으로 뒤덮였다.",
            "effects": {
              "fans": 50
            },
            "next": "surprise"
          },
          "partial": {
            "text": "고음에서 한 번 흔들렸지만, 오히려 그 뒤로 더 편하게 불렀다.",
            "next": "surprise_small"
          },
          "fail": {
            "text": "긴장으로 목이 잠겼다. 노래를 중간에 멈춰야 했다.",
            "next": "end_rough"
          }
        }
      },
      "game": {
        "type": "check",
        "text": "팬 대표들과 미니 게임 한 판. 봐주면 티가 나고, 이기면 원성이 쏟아진다.",
        "check": {
          "stat": "Ga",
          "difficulty": 70,
          "traitBonus": {
            "spontaneous": 5,
            "competitive": 5,
            "highTension": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "아슬아슬한 승부 끝에 딱 한 판 차이로 이겼다. 모두가 웃는 결과다.",
            "effects": {
              "fans": 50
            },
            "next": "surprise"
          },
          "partial": {
            "text": "게임 규칙 설명에서 한참 헤맸지만 그것마저 웃음 포인트가 됐다.",
            "next": "surprise_small"
          },
          "fail": {
            "text": "진행이 매끄럽지 않아 시간이 다 가 버렸다.",
            "next": "end_rough"
          }
        }
      },
      "surprise_small": {
        "type": "story",
        "text": "진행은 조금 서툴렀지만 팬들은 끝까지 채팅으로 응원을 보냈다.",
        "next": "surprise"
      },
      "surprise": {
        "type": "choice",
        "text": "끝나갈 무렵, 팬들이 몰래 준비한 축하 영상이 화면에 올라왔다. {member}가 잠시 말을 잃었다.",
        "choices": [
          {
            "text": "솔직한 마음을 그대로 전한다",
            "next": "end_touching"
          },
          {
            "text": "웃으며 다음 팬미팅을 약속한다",
            "next": "end_promise"
          }
        ]
      },
      "end_touching": {
        "type": "end",
        "result": "success",
        "text": "떨리는 목소리로 전한 고맙다는 말이 오래 남았다. 팬미팅 다시보기에는 '울면서 봤다'는 댓글이 가득하다.",
        "effects": {
          "fans": 140,
          "fame": 1,
          "hp": 5
        }
      },
      "end_promise": {
        "type": "end",
        "result": "success",
        "text": "'다음엔 더 크게 하자!' 그 약속에 채팅창이 한참 동안 멈추지 않았다.",
        "effects": {
          "fans": 120,
          "fame": 1,
          "flags": {
            "fanMeetingPromise": true
          }
        }
      },
      "end_rough": {
        "type": "end",
        "result": "fail",
        "text": "아쉬움이 남는 팬미팅이었다. 그래도 방송을 끄기 전, 팬들은 '처음이니까 괜찮아'라는 말을 끝없이 남겼다.",
        "effects": {
          "fans": 40
        }
      }
    }
  },
  {
    "id": "st_fan_viewer_ace_guest",
    "title": "참여 판에 나타난 숨은 고수",
    "category": "fan",
    "group": "viewer_participation",
    "description": "시청자 참여 콘텐츠(event_205) 변형 A. 참여 콘텐츠의 규모를 먼저 정하고, 판을 연 뒤 나타난 숨은 고수나 뜻밖의 투표 결과를 진행으로 풀어낸다.",
    "meta": {
      "theme": "fan_event",
      "setting": "viewer_join_showdown",
      "conflict": "unexpected_guest",
      "resolution": "viral_moment",
      "activity": "viewer_participation",
      "tone": "comedic"
    },
    "conditions": {
      "activityCategories": [
        "broadcast"
      ],
      "cooldown": 2
    },
    "activityWeights": {
      "talk": 2
    },
    "weight": 1,
    "traitWeights": {
      "host": 2,
      "chatter": 2
    },
    "start": "pitch",
    "steps": {
      "pitch": {
        "type": "choice",
        "text": [
          {
            "when": {
              "memberFlags": [
                "viewerShowRegular"
              ]
            },
            "text": "지난번 참여 콘텐츠가 정기 코너처럼 자리 잡은 뒤로, 오늘도 채팅창에 \"참여 판 언제 열어요?\"가 올라온다. {member}의 방송에서 시청자 참여 콘텐츠를 다시 해 보자는 의견이 모였다. 준비는 번거롭지만 채팅 참여가 확 늘어날 기회다."
          },
          {
            "when": {
              "activityCategories": [
                "game"
              ]
            },
            "text": "\"시참 하자!\" {member}의 게임 방송에서 시청자와 함께 붙어 보자는 의견이 모였다. 참가자를 받고 규칙을 정하는 준비는 번거롭지만, 채팅 참여가 확 늘어날 기회다."
          },
          {
            "when": {
              "activity": [
                "sing"
              ]
            },
            "text": "{member}의 노래 방송에서 시청자 참여 콘텐츠를 해 보자는 의견이 모였다. 전주만 듣고 곡 제목 맞히기, 시청자가 고른 곡 이어 부르기 같은 아이디어가 쏟아진다. 준비는 번거롭지만 채팅 참여가 확 늘어날 기회다."
          },
          {
            "text": "{member}의 방송에서 시청자 참여 콘텐츠를 해 보자는 의견이 모였다. 퀴즈, 사연 투표, 채팅 미션 같은 아이디어가 쏟아진다. 준비는 번거롭지만 채팅 참여가 확 늘어날 기회다."
          }
        ],
        "choices": [
          {
            "text": "제대로 준비해서 크게 연다",
            "effects": {
              "money": -50000,
              "hp": -6
            },
            "story": [
              {
                "when": {
                  "activityCategories": [
                    "game"
                  ]
                },
                "text": "참가 신청 양식과 대진표를 만들고, 우승한 시청자에게 줄 작은 상품도 준비했다."
              },
              {
                "when": {
                  "activity": [
                    "sing"
                  ]
                },
                "text": "곡 목록 100곡과 점수판을 만들고, 우승한 시청자에게 줄 작은 상품도 준비했다."
              },
              {
                "text": "문제 50개와 점수판을 만들고, 우승한 시청자에게 줄 작은 상품도 준비했다."
              }
            ],
            "next": "big_guest"
          },
          {
            "text": "가벼운 투표 정도로만 진행한다",
            "effects": {
              "hp": -2
            },
            "story": "{member}가 채팅 투표창을 띄웠다. \"오늘 마지막 코너, 여러분이 정한다.\"",
            "next": "vote_twist"
          },
          {
            "text": "채팅 참여 미니 코너를 30분만 맛보기로 열어 본다",
            "effects": {
              "hp": -3
            },
            "story": "{member}가 \"오늘은 맛보기만!\"이라며 간단한 채팅 미션을 냈다.",
            "next": "mini_check"
          }
        ]
      },
      "big_guest": {
        "type": "story",
        "text": [
          {
            "when": {
              "activityCategories": [
                "game"
              ]
            },
            "text": "참가자 중 한 명이 심상치 않다. 닉네임은 평범한데, 첫 경기부터 {member}를 포함한 모두를 압도했다. 채팅창이 \"고수 등장\"으로 술렁인다."
          },
          {
            "when": {
              "activity": [
                "sing"
              ]
            },
            "text": "참가자 중 한 명이 전주 1초 만에 정답을 연달아 맞혔다. 채팅창이 \"고수 등장\"으로 술렁인다."
          },
          {
            "text": "참가자 중 한 명이 문제를 끝까지 듣기도 전에 정답을 연달아 맞혔다. 채팅창이 \"고수 등장\"으로 술렁인다."
          }
        ],
        "next": "big_check"
      },
      "big_check": {
        "type": "check",
        "text": "이대로면 한 사람만 즐기는 판이 된다. {member}가 진행으로 판을 살려야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 78,
          "traitBonus": {
            "host": 10,
            "chatter": 5,
            "roleplay": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "{member}가 즉석에서 \"고수 대 전원\" 특별 매치를 열었다. 모든 참가자가 한편이 되자 채팅창이 축제가 됐다.",
            "effects": {
              "fans": 90,
              "fame": 1
            },
            "next": "big_star"
          },
          "success": {
            "text": "{member}가 고수에게 핸디캡 규칙을 걸며 판을 다시 팽팽하게 만들었다. 고수도 웃으며 받아들였다.",
            "next": "big_star"
          },
          "partial": {
            "text": "핸디캡을 걸어 봤지만 고수의 독주는 계속됐다. 그래도 고수의 활약 자체가 볼거리가 됐다.",
            "next": "big_uneven"
          },
          "fail": {
            "text": "고수의 독주를 막지 못했다. 다른 참가자들의 채팅이 점점 줄어들었다.",
            "next": "big_oneman"
          }
        }
      },
      "big_star": {
        "type": "end",
        "text": "고수와 {member}가 주고받은 장면이 클립으로 퍼졌다. 다음 참여 판에 신청하겠다는 채팅이 줄을 이었다.",
        "effects": {
          "fans": 130,
          "fame": 1
        },
        "result": "success"
      },
      "big_uneven": {
        "type": "end",
        "text": "고수의 활약은 화제가 됐지만, 참여한 시청자 대부분은 구경꾼이 됐다. 재미와 아쉬움이 반반인 판이었다.",
        "effects": {
          "fans": 80
        },
        "result": "partial"
      },
      "big_oneman": {
        "type": "end",
        "text": "판은 한 사람의 독무대로 끝났다. {member}는 \"다음엔 실력별로 조를 나누겠다\"고 공지했고, 고수 본인이 \"다음엔 봐주겠다\"는 채팅을 남겨 웃음을 줬다.",
        "effects": {
          "fans": 30,
          "memberFlags": {
            "viewerShowRetry": true
          }
        },
        "result": "fail"
      },
      "vote_twist": {
        "type": "story",
        "text": "투표 결과가 나왔다. 장난으로 넣어 둔 \"{member} 벌칙 수행\"이 압도적인 1위다.",
        "next": "vote_choice"
      },
      "vote_choice": {
        "type": "choice",
        "text": "채팅창이 기대에 차 있다. 어떻게 할까?",
        "choices": [
          {
            "text": "결과대로 벌칙을 수행한다",
            "story": "{member}가 한숨을 쉬며 벌칙 목록을 열었다. 시청자들이 고른 벌칙은 \"성대모사 세 가지\".",
            "next": "penalty_check"
          },
          {
            "text": "\"이건 무효!\"를 외치고 재투표를 한다",
            "story": "{member}가 투표창을 다시 띄우자 채팅창에 \"도망갔다\"가 쏟아졌다.",
            "next": "vote_redo"
          }
        ]
      },
      "penalty_check": {
        "type": "check",
        "text": "부끄러움을 웃음으로 바꿀 수 있느냐가 관건이다.",
        "check": {
          "stat": "Bs",
          "difficulty": 66,
          "traitBonus": {
            "roleplay": 10,
            "highTension": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "{member}가 작정하고 벌칙을 해내자 채팅창이 비명과 웃음으로 뒤집혔다.",
            "next": "vote_meme"
          },
          "partial": {
            "text": "두 개까지는 해냈지만 마지막 하나에서 웃음이 터져 버렸다.",
            "next": "vote_half"
          },
          "fail": {
            "text": "너무 부끄러워 화면 밖으로 도망가 버렸다. 채팅창엔 \"어디 갔어\"만 가득했다.",
            "next": "vote_runaway"
          }
        }
      },
      "vote_meme": {
        "type": "end",
        "text": "벌칙 장면이 그날 밤 팬들 사이에서 계속 돌았다. \"투표 코너 또 해 달라\"는 요청이 이어졌다.",
        "effects": {
          "fans": 70
        },
        "result": "success"
      },
      "vote_half": {
        "type": "end",
        "text": "마지막 벌칙은 못 했지만 웃음 터진 장면이 나름 귀여웠다는 반응이었다. 다만 \"빚 하나 남았다\"는 채팅이 계속 따라붙었다.",
        "effects": {
          "fans": 50
        },
        "result": "partial"
      },
      "vote_runaway": {
        "type": "end",
        "text": "도망친 장면은 웃겼지만 벌칙을 기대한 시청자들은 아쉬워했다. {member}가 \"다음 투표 때 갚겠다\"고 약속하며 방송을 마쳤다.",
        "effects": {
          "fans": 25
        },
        "result": "fail"
      },
      "vote_redo": {
        "type": "end",
        "text": "재투표 결과는 무난한 코너였다. 방송은 편안하게 끝났지만, \"도망친 {member}\"라는 놀림은 한동안 따라다녔다.",
        "effects": {
          "fans": 40
        },
        "result": "partial"
      },
      "mini_check": {
        "type": "check",
        "text": "30분 안에 시청자들이 직접 참여하는 재미를 맛보게 해야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 70,
          "traitBonus": {
            "spontaneous": 10,
            "chatter": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "채팅 미션이 생각보다 뜨거웠다. 30분이 순식간에 지나갔다.",
            "next": "mini_more"
          },
          "partial": {
            "text": "참여는 꽤 있었지만 규칙 설명에 시간이 많이 들었다.",
            "next": "mini_ok"
          },
          "fail": {
            "text": "미션이 너무 어려웠는지 참여하는 채팅이 거의 없었다.",
            "next": "mini_flat"
          }
        }
      },
      "mini_more": {
        "type": "end",
        "text": "\"다음엔 제대로 열어 달라\"는 요청이 쏟아졌다. 맛보기가 다음 참여 판의 예고편이 됐다.",
        "effects": {
          "fans": 90,
          "fame": 1,
          "memberFlags": {
            "viewerShowPlanned": true
          }
        },
        "result": "success"
      },
      "mini_ok": {
        "type": "end",
        "text": "재미는 있었지만 규칙 설명이 길었다는 평이었다. {member}는 다음엔 규칙을 미리 공지하기로 했다.",
        "effects": {
          "fans": 50
        },
        "result": "partial"
      },
      "mini_flat": {
        "type": "end",
        "text": "조용히 끝난 맛보기 코너에 {member}가 \"문제를 너무 어렵게 냈다\"며 웃었다. 팬들은 다음엔 쉬운 걸로 해 달라고 했다.",
        "effects": {
          "fans": 15
        },
        "result": "fail"
      }
    }
  },
  {
    "id": "st_fan_viewer_rule_prep",
    "title": "참여 콘텐츠 준비실",
    "category": "fan",
    "group": "viewer_participation",
    "description": "시청자 참여 콘텐츠(event_205) 변형 B. 컨디션과 친한 멤버의 도움에 따라 첫 장면이 갈리고, 크게 열기로 하면 규칙 준비 판정 결과에 따라 본 방송의 판정 장면과 결말이 달라진다.",
    "meta": {
      "theme": "fan_event",
      "setting": "participation_rule_prep",
      "conflict": "budget_limit",
      "resolution": "teamwork",
      "activity": "viewer_participation",
      "tone": "warm"
    },
    "conditions": {
      "activityCategories": [
        "broadcast"
      ],
      "cooldown": 2
    },
    "activityWeights": {
      "talk": 2
    },
    "weight": 1,
    "traitWeights": {
      "host": 2,
      "chatter": 2
    },
    "start": "energy",
    "steps": {
      "energy": {
        "type": "branch",
        "branches": [
          {
            "when": {
              "maxHp": 39
            },
            "next": "tired_intro"
          },
          {
            "when": {
              "minRelationship": 40
            },
            "next": "helper_intro"
          }
        ],
        "next": "plain_intro"
      },
      "tired_intro": {
        "type": "story",
        "text": "{member}의 방송에서 시청자 참여 콘텐츠를 해 보자는 의견이 모였다. 하고 싶은 마음은 크지만, 요즘 쌓인 피로 때문에 준비할 힘이 남아 있을지 걱정이다.",
        "next": "prep_choice"
      },
      "helper_intro": {
        "type": "story",
        "text": "{member}의 방송에서 시청자 참여 콘텐츠를 해 보자는 의견이 모였다. 이야기를 들은 친한 멤버가 \"규칙 정리 도와줄까?\"라며 먼저 연락해 왔다.",
        "next": "prep_choice"
      },
      "plain_intro": {
        "type": "story",
        "text": "{member}의 방송에서 시청자 참여 콘텐츠를 해 보자는 의견이 모였다. 준비는 번거롭지만 채팅 참여가 확 늘어날 기회다.",
        "next": "prep_choice"
      },
      "prep_choice": {
        "type": "choice",
        "text": [
          {
            "when": {
              "memberFlags": [
                "viewerShowRetry"
              ]
            },
            "text": "지난번 참여 판이 한 사람의 독무대로 끝난 뒤로 {member}는 규칙을 다시 짜고 싶어 했다. 다만 예산은 넉넉하지 않다. 어떻게 할까?"
          },
          {
            "when": {
              "activityCategories": [
                "game"
              ]
            },
            "text": "시청자와 함께 붙는 참여 게임 판이 후보다. 참가 신청, 대진, 상품까지 준비하려면 예산이 꽤 든다. 어떻게 할까?"
          },
          {
            "when": {
              "activity": [
                "sing"
              ]
            },
            "text": "시청자가 고른 곡을 이어 부르는 참여 코너가 후보다. 곡 목록과 점수판, 상품까지 준비하려면 예산이 꽤 든다. 어떻게 할까?"
          },
          {
            "text": "시청자 퀴즈 대회가 후보다. 문제 출제와 점수판, 상품까지 준비하려면 예산이 꽤 든다. 어떻게 할까?"
          }
        ],
        "choices": [
          {
            "text": "제대로 준비해서 크게 연다",
            "effects": {
              "money": -50000,
              "hp": -6
            },
            "story": "{member}가 예산표를 펼쳤다. 상품은 줄이고, 규칙과 진행에 힘을 쓰기로 했다.",
            "next": "rule_check"
          },
          {
            "text": "가벼운 투표 정도로만 진행한다",
            "effects": {
              "hp": -2
            },
            "story": "\"크게는 다음에. 오늘은 투표로!\" {member}가 투표 주제를 채팅에서 받기 시작했다.",
            "next": "poll_story"
          }
        ]
      },
      "rule_check": {
        "type": "check",
        "text": "방송 전, 규칙을 정리하고 리허설을 해 볼 시간이다. 규칙이 허술하면 본 방송에서 판이 흔들린다.",
        "check": {
          "stat": "Bs",
          "difficulty": 72,
          "traitBonus": {
            "diligent": 10,
            "brain": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "규칙이 한 장에 깔끔하게 정리됐다. 리허설에서 나온 허점도 미리 막았다.",
            "next": "show_tight"
          },
          "partial": {
            "text": "규칙은 정리했지만 리허설할 시간이 부족했다. 몇 군데는 현장에서 정해야 한다.",
            "next": "show_loose"
          },
          "fail": {
            "text": "규칙 정리가 끝나기도 전에 방송 시간이 됐다. 거의 즉흥으로 판을 열어야 한다.",
            "next": "show_bare"
          }
        }
      },
      "show_tight": {
        "type": "check",
        "text": "탄탄한 규칙 위에서 판이 열렸다. 이제 진행으로 분위기를 끌어올릴 차례다.",
        "check": {
          "stat": "Bs",
          "difficulty": 78,
          "traitBonus": {
            "host": 10,
            "chatter": 5,
            "roleplay": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "규칙이 매끄러우니 진행에 여유가 생겼다. {member}의 즉석 멘트마다 채팅창이 터졌다.",
            "effects": {
              "fans": 90,
              "fame": 1
            },
            "next": "show_tight_hit"
          },
          "success": {
            "text": "참가자들이 규칙을 금방 이해하고 판에 빠져들었다. 채팅 참여가 평소의 몇 배로 늘었다.",
            "next": "show_tight_hit"
          },
          "partial": {
            "text": "규칙은 매끄러웠지만 진행 템포가 느려 중반에 살짝 늘어졌다.",
            "next": "show_tight_mid"
          },
          "fail": {
            "text": "규칙은 완벽했는데 정작 참가 신청이 몰리지 않았다. 빈자리가 눈에 띄었다.",
            "next": "show_tight_low"
          }
        }
      },
      "show_tight_hit": {
        "type": "end",
        "text": "\"이거 정기 코너로 해 주세요\"라는 요청이 쏟아졌다. 꼼꼼한 준비가 그대로 재미로 돌아왔다.",
        "effects": {
          "fans": 130,
          "fame": 1,
          "memberFlags": {
            "viewerShowRegular": true
          }
        },
        "result": "success"
      },
      "show_tight_mid": {
        "type": "end",
        "text": "참가자들은 만족했지만, 구경하던 시청자 일부는 중간에 빠져나갔다. 다음엔 템포를 올리기로 했다.",
        "effects": {
          "fans": 80
        },
        "result": "partial"
      },
      "show_tight_low": {
        "type": "end",
        "text": "준비한 규칙집이 아까울 만큼 참여가 적었다. {member}는 \"다음엔 공지를 일찍 하겠다\"고 했고, 팬들은 그때는 꼭 신청하겠다고 답했다.",
        "effects": {
          "fans": 30
        },
        "result": "fail"
      },
      "show_loose": {
        "type": "check",
        "text": "규칙 몇 군데가 비어 있는 채로 판이 열렸다. 현장에서 빈틈을 메우며 진행해야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 78,
          "traitBonus": {
            "host": 10,
            "chatter": 5,
            "roleplay": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "{member}가 빈 규칙을 시청자 투표로 채우자 그 과정이 오히려 하이라이트가 됐다.",
            "effects": {
              "fans": 90,
              "fame": 1
            },
            "next": "show_loose_hit"
          },
          "success": {
            "text": "빈틈이 생길 때마다 {member}가 재치 있게 규칙을 만들어 냈다. 시청자들도 함께 규칙을 정하는 재미에 빠졌다.",
            "next": "show_loose_hit"
          },
          "partial": {
            "text": "규칙을 정하느라 진행이 몇 번 멈췄다. 그래도 참가자들은 끝까지 함께했다.",
            "next": "show_loose_mid"
          },
          "fail": {
            "text": "규칙을 두고 채팅창에서 논쟁이 붙었다. 판이 산만해졌다.",
            "next": "show_loose_low"
          }
        }
      },
      "show_loose_hit": {
        "type": "end",
        "text": "\"즉석 규칙 만들기\"까지 콘텐츠가 됐다. 시청자들이 직접 만든 규칙에 애착을 보였다.",
        "effects": {
          "fans": 120,
          "fame": 1
        },
        "result": "success"
      },
      "show_loose_mid": {
        "type": "end",
        "text": "재미는 있었지만 멈추는 순간이 잦았다. 다시보기 댓글에는 \"규칙집 좀 만들자\"는 농담이 많았다.",
        "effects": {
          "fans": 70
        },
        "result": "partial"
      },
      "show_loose_low": {
        "type": "end",
        "text": "논쟁 끝에 판을 일찍 정리했다. {member}는 다음 방송 공지에 규칙을 미리 올리겠다고 약속했다.",
        "effects": {
          "fans": 25
        },
        "result": "fail"
      },
      "show_bare": {
        "type": "check",
        "text": "규칙도 리허설도 없이 판이 열렸다. 오롯이 {member}의 진행 실력에 달렸다.",
        "check": {
          "stat": "Bs",
          "difficulty": 78,
          "traitBonus": {
            "host": 10,
            "chatter": 5,
            "roleplay": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "{member}가 무계획을 숨기지 않고 \"오늘은 다 같이 만든다\"를 선언하자, 시청자들이 신나서 규칙부터 상품까지 함께 정했다.",
            "effects": {
              "fans": 90,
              "fame": 1
            },
            "next": "show_bare_hit"
          },
          "success": {
            "text": "즉흥 진행이 오히려 자연스러웠다. 채팅과 주고받는 맛이 살아 있었다.",
            "next": "show_bare_hit"
          },
          "partial": {
            "text": "즉흥 진행이 몇 번 꼬였다. 웃음은 있었지만 정돈되지 않은 판이었다.",
            "next": "show_bare_mid"
          },
          "fail": {
            "text": "규칙이 없으니 참가자마다 하는 말이 달랐다. 판이 금방 흐지부지됐다.",
            "next": "show_bare_low"
          }
        }
      },
      "show_bare_hit": {
        "type": "end",
        "text": "\"계획 없이 이게 된다고?\"라는 반응과 함께 방송이 끝났다. 다만 매니저는 다음엔 꼭 규칙부터 정하자고 했다.",
        "effects": {
          "fans": 110,
          "fame": 1
        },
        "result": "success"
      },
      "show_bare_mid": {
        "type": "end",
        "text": "시끌벅적한 판이었다. 즐거웠다는 시청자와 정신없었다는 시청자가 반반이었다.",
        "effects": {
          "fans": 60
        },
        "result": "partial"
      },
      "show_bare_low": {
        "type": "end",
        "text": "흐지부지 끝난 판에 {member}가 먼저 \"준비가 부족했다\"고 사과했다. 팬들은 다음 참여 판의 규칙을 같이 짜 주겠다며 아이디어를 보내왔다.",
        "effects": {
          "fans": 20,
          "memberFlags": {
            "viewerRulebook": true
          }
        },
        "result": "fail"
      },
      "poll_story": {
        "type": "story",
        "text": [
          {
            "when": {
              "activityCategories": [
                "game"
              ]
            },
            "text": "투표 주제가 모였다. 1위는 \"다음에 할 게임 정하기\". 그런데 선택지 하나에 장난 표가 몰리고 있다."
          },
          {
            "when": {
              "activity": [
                "sing"
              ]
            },
            "text": "투표 주제가 모였다. 1위는 \"마지막 곡 정하기\". 그런데 선택지 하나에 장난 표가 몰리고 있다."
          },
          {
            "text": "투표 주제가 모였다. 1위는 \"다음 방송 주제 정하기\". 그런데 선택지 하나에 장난 표가 몰리고 있다."
          }
        ],
        "next": "poll_check"
      },
      "poll_check": {
        "type": "check",
        "text": "장난 표까지 웃음으로 받아 줄 수 있느냐가 관건이다.",
        "check": {
          "stat": "Bs",
          "difficulty": 64,
          "traitBonus": {
            "chatter": 10
          }
        },
        "outcomes": {
          "success": {
            "text": "{member}가 장난 표를 받아들여 \"그럼 진짜 해 볼까?\"라고 하자 채팅창이 신났다.",
            "next": "poll_lively"
          },
          "partial": {
            "text": "투표는 무난하게 끝났다. 장난 표를 어떻게 처리할지 고민하다 흐지부지 넘어갔다.",
            "next": "poll_plain"
          },
          "fail": {
            "text": "장난 표 때문에 결과를 두고 실랑이가 붙었다. {member}가 서둘러 투표를 닫았다.",
            "next": "poll_flop"
          }
        }
      },
      "poll_lively": {
        "type": "end",
        "text": "가벼운 투표가 예상 밖의 웃음으로 이어졌다. \"투표 또 해요\"라는 채팅이 마지막을 장식했다.",
        "effects": {
          "fans": 60
        },
        "result": "success"
      },
      "poll_plain": {
        "type": "end",
        "text": "투표는 무난했다. 크게 기억에 남진 않았지만 채팅 참여는 평소보다 늘었다.",
        "effects": {
          "fans": 45
        },
        "result": "partial"
      },
      "poll_flop": {
        "type": "end",
        "text": "어수선하게 끝난 투표에 {member}가 \"다음엔 장난 표 금지!\"라며 웃었다. 팬들은 그 말에 또 장난을 쳤다.",
        "effects": {
          "fans": 20
        },
        "result": "fail"
      }
    }
  },
  {
    "id": "st_fanart_redraw",
    "title": "팬아트 즉석 따라 그리기",
    "category": "fan",
    "group": "fanart_stream",
    "description": "팬아트 모음 방송 제안(ev_c02) 변형 B. 즉석 요청에 응하는 판정으로 시작하고, 결과에 따라 감상회 / 공모전 / 따라 그리기 대회 중 열리는 선택지가 달라진다.",
    "meta": {
      "theme": "fan_event",
      "setting": "fanart_redraw_stream",
      "conflict": "big_opportunity",
      "resolution": "comeback_win",
      "activity": "talk",
      "tone": "hype"
    },
    "conditions": {
      "activityCategories": [
        "talk"
      ],
      "cooldown": 5
    },
    "start": "request",
    "steps": {
      "request": {
        "type": "check",
        "text": "저챗 도중 팬아트 이야기가 나오자 채팅창이 '그럼 직접 그려 줘!'로 뒤덮였다. 그림판을 켠 {member}가 팬아트 한 장을 따라 그리기 시작했다. 시청자들이 숨죽여 지켜본다.",
        "check": {
          "stat": "Bs",
          "difficulty": 70,
          "traitBonus": {
            "chatter": 10,
            "highTension": 5,
            "spontaneous": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "그림 실력보다 해설이 웃겼다. '이 부분은 영혼으로 그렸습니다'라는 말에 채팅창이 터졌다.",
            "next": "hype_options"
          },
          "partial": {
            "text": "그림은 애매했지만 시청자 반응은 나쁘지 않다.",
            "next": "mid_options"
          },
          "fail": {
            "text": "그리다 보니 원본과 전혀 다른 생물이 됐다. 채팅창이 잠시 조용해졌다.",
            "next": "low_options"
          }
        }
      },
      "hype_options": {
        "type": "choice",
        "text": "분위기가 최고조다. 이 기세를 어디로 이어 갈까?",
        "choices": [
          {
            "text": "팬아트 감상 방송을 크게 연다",
            "story": "그대로 팬아트 감상회로 넘어갔다. 방금 따라 그린 그림의 원작자도 채팅창에 와 있었다.",
            "effects": {
              "hp": -3
            },
            "next": "big_showcase"
          },
          {
            "text": "팬아트 공모전을 열고 상품을 준비한다",
            "story": "'다음 주는 공모전!' 상품을 걸자 채팅창이 출품 예고로 가득 찼다.",
            "effects": {
              "money": -120000
            },
            "next": "end_contest_launch"
          },
          {
            "text": "시청자와 따라 그리기 대회를 연다",
            "story": "시청자들도 같은 그림을 따라 그려 보내기로 했다. 즉석 대회가 시작됐다.",
            "next": "redraw_contest"
          }
        ]
      },
      "mid_options": {
        "type": "choice",
        "text": "반응은 괜찮다. 조금만 더 끌어올리면 된다.",
        "choices": [
          {
            "text": "팬아트 감상 방송을 크게 연다",
            "story": "따라 그리기는 접고 진짜 팬아트를 감상하기로 했다.",
            "effects": {
              "hp": -3
            },
            "next": "mid_showcase"
          },
          {
            "text": "팬아트 공모전을 열고 상품을 준비한다",
            "story": "상품을 걸고 공모전을 공지했다. 따라 그린 그림은 '참가상' 예시로 걸었다.",
            "effects": {
              "money": -120000
            },
            "next": "end_contest_mid"
          }
        ]
      },
      "low_options": {
        "type": "choice",
        "text": "분위기가 살짝 식었다. 만회할 방법이 필요하다.",
        "choices": [
          {
            "text": "팬아트 공모전을 열고 상품을 준비한다",
            "story": "'제대로 된 그림은 여러분이 보내 주세요!' 상품까지 걸자 식었던 채팅창이 다시 달아올랐다.",
            "effects": {
              "money": -120000
            },
            "next": "end_contest_comeback"
          },
          {
            "text": "팬아트 감상 방송으로 조용히 마무리한다",
            "story": "따라 그린 그림은 내리고 팬아트를 한 장씩 띄웠다.",
            "effects": {
              "hp": -3
            },
            "next": "quiet_showcase"
          }
        ]
      },
      "big_showcase": {
        "type": "check",
        "text": "팬아트를 한 장씩 띄운다. 그림마다 진심을 담은 감상을 남겨야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 70,
          "traitBonus": {
            "chatter": 10,
            "highTension": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "따라 그리기의 웃음과 감상회의 감동이 한 방송에 다 담겼다.",
            "next": "end_show_great"
          },
          "success": {
            "text": "그림마다 정성스러운 감상이 이어졌다.",
            "next": "end_show_good"
          },
          "partial": {
            "text": "감상은 좋았지만 시간이 부족해 절반만 봤다.",
            "next": "end_show_half"
          },
          "fail": {
            "text": "들뜬 분위기에 감상이 대충 지나갔다는 아쉬움이 남았다.",
            "next": "end_show_flat"
          }
        }
      },
      "redraw_contest": {
        "type": "check",
        "text": "시청자들이 보낸 따라 그리기 그림이 쏟아진다. 하나하나 소개하며 순위를 매겨야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 74,
          "traitBonus": {
            "host": 10,
            "spontaneous": 5,
            "roleplay": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "소개할 때마다 웃음이 터졌다. 1등 그림은 원본보다 원본 같았다.",
            "next": "end_redraw_hit"
          },
          "partial": {
            "text": "재밌었지만 그림이 너무 많아 다 소개하지 못했다.",
            "next": "end_redraw_half"
          },
          "fail": {
            "text": "진행이 엉키며 누가 몇 등인지 아무도 모르게 됐다.",
            "next": "end_redraw_mess"
          }
        }
      },
      "quiet_showcase": {
        "type": "check",
        "text": "식은 분위기를 다시 데워야 한다. 그림 한 장 한 장에 차분히 이야기를 붙인다.",
        "check": {
          "stat": "Bs",
          "difficulty": 70,
          "traitBonus": {
            "calm": 10,
            "chatter": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "차분한 감상이 오히려 분위기를 되살렸다.",
            "next": "end_quiet_comeback"
          },
          "partial": {
            "text": "분위기는 돌아왔지만 처음의 열기만큼은 아니었다.",
            "next": "end_quiet_half"
          },
          "fail": {
            "text": "끝까지 분위기를 되살리지 못했다.",
            "next": "end_quiet_flat"
          }
        }
      },
      "end_contest_launch": {
        "type": "end",
        "result": "success",
        "text": "즉석 따라 그리기에서 시작된 공모전에 출품작이 쏟아졌다. 공모전 방송은 그 주 가장 많이 본 클립이 됐다.",
        "effects": {
          "fans": 280,
          "fame": 2,
          "stockEffect": {
            "ticker": "CLIP",
            "percentage": 2
          }
        }
      },
      "end_contest_comeback": {
        "type": "end",
        "result": "success",
        "text": "망한 그림이 오히려 공모전 홍보가 됐다. '그림은 우리가 그릴게'라는 팬들의 출품작이 넘쳐났다.",
        "effects": {
          "fans": 280,
          "fame": 2,
          "stockEffect": {
            "ticker": "CLIP",
            "percentage": 2
          }
        }
      },
      "end_show_great": {
        "type": "end",
        "result": "success",
        "text": "웃음과 감동이 다 있는 방송이었다. 팬아트를 그리는 팬들이 눈에 띄게 늘었다.",
        "effects": {
          "fans": 260,
          "fame": 2
        }
      },
      "end_show_good": {
        "type": "end",
        "result": "success",
        "text": "그림을 그린 팬들도, 보러 온 팬들도 만족한 방송이었다.",
        "effects": {
          "fans": 150,
          "fame": 1
        }
      },
      "end_show_half": {
        "type": "end",
        "result": "partial",
        "text": "절반만 본 감상회. 나머지는 2부로 이어 가기로 했다. 기다리는 팬도, 아쉬워하는 팬도 있었다.",
        "effects": {
          "fans": 100
        }
      },
      "end_show_flat": {
        "type": "end",
        "result": "fail",
        "text": "아쉬운 감상회였다. 그래도 그림을 봐 준 것만으로 고맙다는 댓글이 남았다. {member}는 다음엔 제대로 준비해 오겠다고 했다.",
        "effects": {
          "fans": 60
        }
      },
      "end_redraw_hit": {
        "type": "end",
        "result": "success",
        "text": "'따라 그리기 대회'가 정기 코너가 됐다. 그림을 못 그려도 참여할 수 있다는 점이 팬들에게 통했다.",
        "effects": {
          "fans": 200,
          "fame": 1
        }
      },
      "end_redraw_half": {
        "type": "end",
        "result": "partial",
        "text": "웃음은 넘쳤지만 소개하지 못한 그림이 많았다. 다음 방송에서 이어서 보기로 했다.",
        "effects": {
          "fans": 110
        }
      },
      "end_redraw_mess": {
        "type": "end",
        "result": "fail",
        "text": "순위는 흐지부지됐지만 '그래서 1등 누구냐'는 채팅이 밈이 됐다. 다음 대회는 순위표부터 준비하기로 했다.",
        "effects": {
          "fans": 50
        }
      },
      "end_quiet_comeback": {
        "type": "end",
        "result": "success",
        "text": "식었던 방송이 따뜻하게 끝났다. 따라 그린 그림도 마지막에 '오늘의 반성작'으로 다시 등장해 웃음을 줬다.",
        "effects": {
          "fans": 150,
          "fame": 1
        }
      },
      "end_quiet_half": {
        "type": "end",
        "result": "partial",
        "text": "분위기는 되살렸지만 큰 화제는 없었다. 팬들은 다음 감상회를 기다리겠다고 했다.",
        "effects": {
          "fans": 90
        }
      },
      "mid_showcase": {
        "type": "check",
        "text": "애매했던 따라 그리기를 뒤로하고 진짜 팬아트를 띄운다. 분위기를 한 단계 끌어올려야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 72,
          "traitBonus": {
            "chatter": 10,
            "highTension": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "진짜 팬아트가 나오자 채팅창이 \"역시 원본이 최고\"로 뒤덮였다.",
            "next": "end_mid_show_good"
          },
          "partial": {
            "text": "분위기는 올라왔지만 따라 그리기의 여운이 조금 어색하게 남았다.",
            "next": "end_mid_show_half"
          },
          "fail": {
            "text": "두 가지를 섞으려다 둘 다 애매해졌다.",
            "next": "end_mid_show_flat"
          }
        }
      },
      "end_contest_mid": {
        "type": "end",
        "result": "success",
        "text": "참가상 예시로 걸린 {member}의 그림 덕분에 \"나도 낼 수 있겠다\"는 팬들이 몰렸다. 공모전 참여자 수가 예상을 훌쩍 넘었다.",
        "effects": {
          "fans": 260,
          "fame": 2,
          "stockEffect": {
            "ticker": "CLIP",
            "percentage": 2
          }
        }
      },
      "end_mid_show_good": {
        "type": "end",
        "result": "success",
        "text": "어설픈 따라 그리기가 원작 팬아트를 더 빛나게 했다. 원작자들이 채팅창에서 서로 인사를 나눴다.",
        "effects": {
          "fans": 140,
          "fame": 1
        }
      },
      "end_mid_show_half": {
        "type": "end",
        "result": "partial",
        "text": "팬아트 감상은 좋았지만 방송의 색이 하나로 모이지 않았다. 다음엔 감상회만 따로 열기로 했다.",
        "effects": {
          "fans": 90
        }
      },
      "end_mid_show_flat": {
        "type": "end",
        "result": "fail",
        "text": "어정쩡하게 끝난 방송이었다. 그래도 그림을 소개받은 팬들은 고맙다는 댓글을 남겼다.",
        "effects": {
          "fans": 50
        }
      },
      "end_quiet_flat": {
        "type": "end",
        "result": "fail",
        "text": "식은 분위기는 끝까지 돌아오지 않았다. {member}는 \"다음엔 그림판은 숨겨 두겠다\"며 웃으며 방송을 마쳤다.",
        "effects": {
          "fans": 40
        }
      }
    }
  },
  {
    "id": "st_fanart_showcase",
    "title": "팬아트 감상회",
    "category": "fan",
    "group": "fanart_stream",
    "description": "팬아트 모음 방송 제안(ev_c02) 변형 A. 감상 방송을 크게 열지, 공모전을 열지 고르고 각자 다른 장면과 판정이 이어진다.",
    "meta": {
      "theme": "fan_event",
      "setting": "fanart_viewing_stream",
      "conflict": "audience_reaction",
      "resolution": "viral_moment",
      "activity": "talk",
      "tone": "warm"
    },
    "conditions": {
      "activityCategories": [
        "talk"
      ],
      "cooldown": 5
    },
    "start": "pick",
    "steps": {
      "pick": {
        "type": "choice",
        "text": "{member}에게 그동안 쌓인 팬아트를 모아 감상하자는 요청이 쏟아졌다. 폴더를 열어 보니 생각보다 훨씬 많다.",
        "choices": [
          {
            "text": "팬아트 감상 방송을 크게 연다",
            "story": "팬아트를 한 장씩 띄우는 감상 방송을 열었다. 첫 그림부터 {member}가 '이거 언제 그린 거야'라며 화면에 바짝 다가갔다.",
            "effects": {
              "hp": -3
            },
            "next": "showcase"
          },
          {
            "text": "팬아트 공모전을 열고 상품을 준비한다",
            "story": "상품을 걸고 팬아트 공모전을 공지했다. 일주일 만에 출품작이 수백 장 모였다. 이제 심사 방식을 정해야 한다.",
            "effects": {
              "money": -120000
            },
            "next": "judging"
          }
        ]
      },
      "showcase": {
        "type": "check",
        "text": "그림마다 한마디씩 감상을 남겨야 한다. 너무 길면 지루하고, 너무 짧으면 성의 없어 보인다.",
        "check": {
          "stat": "Bs",
          "difficulty": 70,
          "traitBonus": {
            "chatter": 10,
            "highTension": 5
          }
        },
        "outcomes": {
          "great": {
            "text": "한 그림 앞에서 {member}가 울컥했다. 그 순간이 클립으로 퍼졌다.",
            "next": "end_show_great"
          },
          "success": {
            "text": "그림마다 정성스러운 감상이 이어졌다. 그린 팬들이 채팅창에서 기뻐했다.",
            "next": "end_show_good"
          },
          "partial": {
            "text": "앞쪽 그림엔 정성을 쏟았지만 뒤쪽은 빠르게 넘어갔다.",
            "next": "end_show_rushed"
          },
          "fail": {
            "text": "감상이 계속 같은 말로 반복됐다. '귀엽다'만 스무 번째다.",
            "next": "end_show_flat"
          }
        }
      },
      "judging": {
        "type": "choice",
        "text": "수백 장의 출품작. 누가 심사할까?",
        "choices": [
          {
            "text": "{member}가 직접 심사한다",
            "story": "{member}가 출품작을 한 장씩 보며 직접 고르기로 했다.",
            "next": "judge_check"
          },
          {
            "text": "시청자 투표로 정한다",
            "story": "후보작을 추리고 시청자 투표에 맡겼다. 투표 방송이 축제처럼 열렸다.",
            "next": "end_contest_vote"
          }
        ]
      },
      "judge_check": {
        "type": "check",
        "text": "모두가 납득할 수 있게 고른 이유를 설명해야 한다.",
        "check": {
          "stat": "Bs",
          "difficulty": 72,
          "traitBonus": {
            "brain": 10,
            "calm": 5
          }
        },
        "outcomes": {
          "success": {
            "text": "고른 이유마다 그림에 대한 애정이 담겨 있었다. 떨어진 출품자들도 박수를 보냈다.",
            "next": "end_contest_fair"
          },
          "partial": {
            "text": "대체로 납득했지만 몇몇 결과엔 아쉬운 목소리가 나왔다.",
            "next": "end_contest_debate"
          },
          "fail": {
            "text": "기준이 오락가락해 '왜 저게 1등이냐'는 반응이 나왔다.",
            "next": "end_contest_dispute"
          }
        }
      },
      "end_show_great": {
        "type": "end",
        "result": "success",
        "text": "팬아트 감상회가 오늘 가장 따뜻한 방송이 됐다. 다음 감상회에 낼 그림을 그리겠다는 팬들이 줄을 이었다.",
        "effects": {
          "fans": 260,
          "fame": 2
        }
      },
      "end_show_good": {
        "type": "end",
        "result": "success",
        "text": "그림을 그린 팬들도, 보러 온 팬들도 만족한 방송이었다.",
        "effects": {
          "fans": 150,
          "fame": 1
        }
      },
      "end_show_rushed": {
        "type": "end",
        "result": "partial",
        "text": "따뜻한 방송이었지만 뒤쪽 그림을 그린 팬들은 조금 아쉬워했다. {member}는 다음 감상회는 뒤에서부터 보겠다고 약속했다.",
        "effects": {
          "fans": 100
        }
      },
      "end_show_flat": {
        "type": "end",
        "result": "fail",
        "text": "감상이 단조로웠다는 평이 남았다. 그래도 그림을 봐 준 것만으로 고맙다는 팬들의 댓글이 이어졌다.",
        "effects": {
          "fans": 60
        }
      },
      "end_contest_vote": {
        "type": "end",
        "result": "success",
        "text": "팬들이 직접 고른 1등 그림이 {member}의 다음 방송 썸네일이 됐다. 공모전 클립도 꾸준히 재생되고 있다.",
        "effects": {
          "fans": 280,
          "fame": 2,
          "stockEffect": {
            "ticker": "CLIP",
            "percentage": 2
          }
        }
      },
      "end_contest_fair": {
        "type": "end",
        "result": "success",
        "text": "{member}의 심사평이 화제가 됐다. 다음 공모전 일정을 묻는 댓글이 벌써 달렸다.",
        "effects": {
          "fans": 280,
          "fame": 2,
          "stockEffect": {
            "ticker": "CLIP",
            "percentage": 2
          }
        }
      },
      "end_contest_debate": {
        "type": "end",
        "result": "partial",
        "text": "공모전은 성황이었지만 심사 결과엔 이견이 남았다. 다음엔 심사 기준을 미리 공개하기로 했다.",
        "effects": {
          "fans": 200,
          "fame": 1,
          "stockEffect": {
            "ticker": "CLIP",
            "percentage": 2
          }
        }
      },
      "end_contest_dispute": {
        "type": "end",
        "result": "fail",
        "text": "결과 논란이 생각보다 컸다. {member}가 직접 사과하고 '아깝게 떨어진 그림 특집'을 따로 열었다.",
        "effects": {
          "fans": 120,
          "stockEffect": {
            "ticker": "CLIP",
            "percentage": 2
          }
        }
      }
    }
  }
];
