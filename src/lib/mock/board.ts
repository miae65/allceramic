export type BoardPost = {
  id: string
  title: string
  content: string
  author: string
  avatar_url: string
  created_at: string
  comment_count: number
  view_count: number
  comments: BoardComment[]
}

export type BoardComment = {
  id: string
  author: string
  avatar_url: string
  content: string
  created_at: string
}

export const MOCK_BOARD_POSTS: BoardPost[] = [
  {
    id: 'b1',
    title: '백자 유약 레시피 공유합니다',
    content: `안녕하세요. 백자 작업을 7년째 하고 있는 baekja_studio입니다.\n\n오늘은 제가 직접 테스트해서 완성한 백자 재유약 레시피를 공유하려고 합니다.\n\n재료 비율 (중량 기준):\n- 장석 40%\n- 규석 25%\n- 석회석 15%\n- 고령토 10%\n- 백운석 10%\n\n1250도 환원염 소성 기준으로 순백의 색감을 냅니다. 산화 소성 시에는 약간 크림색으로 나올 수 있으니 참고하세요.\n\n유약 농도는 보메계 기준 45~50 보메 정도가 적당하고, 시유 두께는 약 1mm 정도로 맞추시면 됩니다.\n\n궁금한 점 댓글로 남겨주세요!`,
    author: 'baekja_studio',
    avatar_url: 'https://i.pravatar.cc/150?img=1',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    view_count: 342,
    comment_count: 3,
    comments: [
      { id: 'bc1-1', author: 'porcelain_lab', avatar_url: 'https://i.pravatar.cc/150?img=22', content: '좋은 레시피 감사합니다! 석회석 비율을 좀 더 높이면 광택이 더 나오지 않나요?', created_at: new Date(Date.now() - 18 * 3600000).toISOString() },
      { id: 'bc1-2', author: 'baekja_studio', avatar_url: 'https://i.pravatar.cc/150?img=1', content: '네 맞아요, 석회석 비율 높이면 광택감이 올라가는데 대신 흘러내릴 수 있으니 주의하세요!', created_at: new Date(Date.now() - 16 * 3600000).toISOString() },
      { id: 'bc1-3', author: 'white_ware', avatar_url: 'https://i.pravatar.cc/150?img=15', content: '저도 비슷한 레시피 쓰는데 고령토 대신 소지 고령토 써보셨나요? 더 하얗게 나오더라고요.', created_at: new Date(Date.now() - 10 * 3600000).toISOString() },
    ],
  },
  {
    id: 'b2',
    title: '도예 처음 시작할 때 흙 추천해주세요',
    content: `안녕하세요. 도예를 막 시작한 입문자입니다.\n\n공방에서 수업은 듣고 있는데 이제 집에서 혼자 연습해보려고 하는데요, 처음 구매할 흙 추천 부탁드립니다.\n\n현재 고민 중인 옵션은:\n1. 백자토\n2. 옹기토\n3. 석기토(스톤웨어)\n\n주로 물레 성형으로 작은 그릇 만드는 게 목표인데 어떤 흙이 초보자한테 다루기 쉬울까요? 유약 없이 소성해도 예쁜 흙이면 더 좋을 것 같아서요.`,
    author: 'clay_beginner',
    avatar_url: 'https://i.pravatar.cc/150?img=40',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    view_count: 218,
    comment_count: 2,
    comments: [
      { id: 'bc2-1', author: 'onggi_works', avatar_url: 'https://i.pravatar.cc/150?img=10', content: '입문자한테는 석기토 추천드려요. 성형성이 좋고 수축률이 낮아서 다루기 편합니다. 백자토는 좀 더 다루기 까다로운 편이에요.', created_at: new Date(Date.now() - 40 * 3600000).toISOString() },
      { id: 'bc2-2', author: 'modern_clay', avatar_url: 'https://i.pravatar.cc/150?img=52', content: '저도 처음엔 석기토로 시작했어요. 유약 없이 소성해도 자연스러운 질감이 나와서 좋더라고요!', created_at: new Date(Date.now() - 30 * 3600000).toISOString() },
    ],
  },
  {
    id: 'b3',
    title: '전기 가마 vs 장작 가마 차이점이 궁금해요',
    content: `도예 작업을 시작한 지 2년 됐는데요, 공방에서는 전기 가마만 써왔어요.\n\n최근 장작 가마 소성 체험을 해봤는데 전혀 다른 느낌의 작품이 나와서 정말 놀랐습니다.\n\n장작 가마의 매력이 무엇인지, 그리고 두 가마의 장단점을 비교해서 알려주실 분 계실까요?\n\n특히 유약 발색 차이와 소성 후 표면 질감 차이가 궁금합니다.`,
    author: 'jade_kiln',
    avatar_url: 'https://i.pravatar.cc/150?img=45',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    view_count: 415,
    comment_count: 3,
    comments: [
      { id: 'bc3-1', author: 'earthen_jar', avatar_url: 'https://i.pravatar.cc/150?img=60', content: '장작 가마는 불꽃이 작품 표면을 직접 스치면서 예측 불가능한 자연스러운 문양이 생겨요. 전기 가마는 균일한 결과물을 얻을 수 있고요.', created_at: new Date(Date.now() - 60 * 3600000).toISOString() },
      { id: 'bc3-2', author: 'buncheong', avatar_url: 'https://i.pravatar.cc/150?img=38', content: '장작 가마는 재가 날려 작품에 자연유가 형성되는 게 가장 큰 매력이죠. 다만 소성 비용이 높고 날씨에 영향을 많이 받아요.', created_at: new Date(Date.now() - 48 * 3600000).toISOString() },
      { id: 'bc3-3', author: 'clay_fire', avatar_url: 'https://i.pravatar.cc/150?img=27', content: '환원 소성을 원하신다면 장작이나 가스 가마가 좋고, 일정한 결과물이 필요하면 전기 가마가 낫습니다.', created_at: new Date(Date.now() - 36 * 3600000).toISOString() },
    ],
  },
  {
    id: 'b4',
    title: '청자 소성 시 비색이 잘 안 나오는 이유가 뭘까요?',
    content: `청자 작업을 1년째 하고 있는데 비색이 제대로 나온 적이 없어요.\n\n현재 조건:\n- 청자토 사용\n- 전통 청자 유약 (시판 제품)\n- 1250도 환원 소성\n- 전기 가마 사용\n\n인터넷에서 보면 맑은 비취색인데 제 작품은 회록색이나 황록색으로 나옵니다.\n\n환원 소성이 제대로 안 되는 걸까요? 아니면 유약 농도 문제일까요? 고수분들의 조언 부탁드립니다.`,
    author: 'bisaek',
    avatar_url: 'https://i.pravatar.cc/150?img=5',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    view_count: 287,
    comment_count: 2,
    comments: [
      { id: 'bc4-1', author: 'celadon_kr', avatar_url: 'https://i.pravatar.cc/150?img=33', content: '전기 가마는 완전한 환원 소성이 어려워요. 비색을 제대로 내려면 가스 가마나 장작 가마가 필요합니다. 전기 가마용 환원제를 써보셨나요?', created_at: new Date(Date.now() - 80 * 3600000).toISOString() },
      { id: 'bc4-2', author: 'bisaek', avatar_url: 'https://i.pravatar.cc/150?img=5', content: '환원제는 써봤는데 효과가 미미했어요. 가스 가마를 알아봐야겠네요. 감사합니다!', created_at: new Date(Date.now() - 72 * 3600000).toISOString() },
    ],
  },
  {
    id: 'b5',
    title: '유약 두께 조절하는 팁 있으신가요?',
    content: `안녕하세요. 유약 시유할 때마다 두께가 일정하게 안 나와서 고민입니다.\n\n주로 담금 시유(딥핑)를 하는데 부위마다 두께가 달라서 소성 후 결과가 들쭉날쭉해요.\n\n특히 굽 부분과 몸통 위쪽의 두께 차이가 심한데, 이걸 균일하게 맞추는 방법이 있을까요?\n\n보메계도 써보고 있는데 수치가 맞아도 결과가 다르게 나오더라고요. 경험 많으신 분들 조언 부탁드립니다.`,
    author: 'kiln_form',
    avatar_url: 'https://i.pravatar.cc/150?img=18',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    view_count: 196,
    comment_count: 2,
    comments: [
      { id: 'bc5-1', author: 'modern_clay', avatar_url: 'https://i.pravatar.cc/150?img=52', content: '담금 시간을 일정하게 유지하는 게 핵심이에요. 초 단위로 타이머 재면서 연습하면 훨씬 균일해집니다.', created_at: new Date(Date.now() - 100 * 3600000).toISOString() },
      { id: 'bc5-2', author: 'buncheong', avatar_url: 'https://i.pravatar.cc/150?img=38', content: '소지가 너무 건조하면 유약 흡수가 빨라서 두껍게 됩니다. 시유 전 소지 습도를 체크해보세요.', created_at: new Date(Date.now() - 90 * 3600000).toISOString() },
    ],
  },
  {
    id: 'b6',
    title: '물레 성형 연습 방법 공유해요',
    content: `물레를 배운 지 6개월 됐는데 센터링이 아직도 어렵습니다.\n\n연습 방법을 공유하고 다른 분들은 어떻게 연습하시는지도 궁금해서요.\n\n제가 하는 방법:\n1. 매일 30분씩 센터링만 집중 연습\n2. 500g → 1kg → 2kg 순서로 양 늘리기\n3. 실패한 흙은 버리지 않고 재활용\n\n가장 효과적이었던 건 손의 위치를 고정하고 속도를 일정하게 유지하는 거였어요. 물을 너무 많이 쓰면 오히려 안 좋더라고요.\n\n다들 어떻게 연습하셨나요?`,
    author: 'porcelain_lab',
    avatar_url: 'https://i.pravatar.cc/150?img=22',
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    view_count: 523,
    comment_count: 3,
    comments: [
      { id: 'bc6-1', author: 'clay_fire', avatar_url: 'https://i.pravatar.cc/150?img=27', content: '저는 처음에 무조건 센터링 반복을 엄청 했어요. 하루에 흙 5kg 씩 쓰면서 3개월 하니까 어느 순간 손에 익더라고요.', created_at: new Date(Date.now() - 120 * 3600000).toISOString() },
      { id: 'bc6-2', author: 'earthen_jar', avatar_url: 'https://i.pravatar.cc/150?img=60', content: '팔꿈치를 무릎에 고정하는 게 중요해요. 팔이 흔들리면 센터링이 절대 안 됩니다.', created_at: new Date(Date.now() - 110 * 3600000).toISOString() },
      { id: 'bc6-3', author: 'modern_clay', avatar_url: 'https://i.pravatar.cc/150?img=52', content: '유튜브에 Simon Leach 채널 추천해요. 설명이 정말 자세해서 도움 많이 받았습니다.', created_at: new Date(Date.now() - 100 * 3600000).toISOString() },
    ],
  },
  {
    id: 'b7',
    title: '가마 소성 온도별 색상 변화 정리',
    content: `소성 온도에 따른 유약 색상 변화를 정리해봤습니다. 참고가 되셨으면 해서 공유합니다.\n\n■ 저화도 (1000~1100도)\n- 테라코타 계열 따뜻한 색\n- 납 유약 특유의 광택\n- 주로 빨강, 주황 계열 발색\n\n■ 중화도 (1150~1220도)\n- 석기질 소지 완성\n- 산화: 따뜻한 갈색/베이지 계열\n- 환원: 청회색 계열\n\n■ 고화도 (1250~1300도)\n- 자기질 완성\n- 청자 비색 발현 가능\n- 백자 순백 발현\n- 철화 유약 특유의 깊은 발색\n\n모든 내용은 개인 경험 기반이라 가마와 유약에 따라 다를 수 있습니다.`,
    author: 'celadon_kr',
    avatar_url: 'https://i.pravatar.cc/150?img=33',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    view_count: 631,
    comment_count: 1,
    comments: [
      { id: 'bc7-1', author: 'baekja_studio', avatar_url: 'https://i.pravatar.cc/150?img=1', content: '정리 정말 잘 해주셨네요! 스크랩해둬야겠어요. 구리 유약 계열도 추가해주시면 더 좋을 것 같습니다.', created_at: new Date(Date.now() - 150 * 3600000).toISOString() },
    ],
  },
  {
    id: 'b8',
    title: '작업실 임대 구합니다 (서울 강북권)',
    content: `안녕하세요. 프리랜서 도예 작가인데요, 현재 쓰고 있는 공방 계약이 다음 달 종료됩니다.\n\n조건:\n- 위치: 서울 강북 또는 경기 북부\n- 면적: 10평 이상\n- 전기 가마 설치 가능한 공간 (200V 30A 이상)\n- 환기 시설 필요\n- 월 50만원 이하 희망\n\n함께 작업실을 쓸 도예 작가분도 환영합니다. 비용 분담 가능해요.\n\n연락은 댓글 또는 DM 주세요. 감사합니다.`,
    author: 'clay_fire',
    avatar_url: 'https://i.pravatar.cc/150?img=27',
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    view_count: 189,
    comment_count: 1,
    comments: [
      { id: 'bc8-1', author: 'kiln_form', avatar_url: 'https://i.pravatar.cc/150?img=18', content: '저도 작업실 찾고 있어요! 혹시 같이 공유하실 의향 있으시면 댓글 남겨주세요.', created_at: new Date(Date.now() - 170 * 3600000).toISOString() },
    ],
  },
  {
    id: 'b9',
    title: '분청사기 귀얄 기법 처음 시도해봤어요',
    content: `오늘 처음으로 분청사기 귀얄 기법을 시도해봤는데 생각보다 어렵더라고요.\n\n귀얄붓으로 백토물을 바르는 건 간단해 보였는데, 결이 일정하게 나오지 않아서 여러 번 실패했어요.\n\n몇 가지 시도 끝에 알게 된 점:\n- 백토물 농도가 너무 묽으면 결이 안 살아남\n- 붓 속도가 너무 빠르거나 느리면 얼룩 생김\n- 소지가 반건조 상태일 때 바르는 게 가장 잘 됨\n\n소성 후 결과가 기대됩니다. 결과물 나오면 인스타에 올릴게요!\n\n귀얄 기법 하시는 분들 팁 있으면 공유해주세요.`,
    author: 'buncheong',
    avatar_url: 'https://i.pravatar.cc/150?img=38',
    created_at: new Date(Date.now() - 9 * 86400000).toISOString(),
    view_count: 274,
    comment_count: 2,
    comments: [
      { id: 'bc9-1', author: 'porcelain_lab', avatar_url: 'https://i.pravatar.cc/150?img=22', content: '귀얄 기법은 소지 건조도가 정말 중요해요. 반건조보다 조금 더 건조된 상태에서 바르면 더 선명하게 나오기도 해요.', created_at: new Date(Date.now() - 200 * 3600000).toISOString() },
      { id: 'bc9-2', author: 'white_ware', avatar_url: 'https://i.pravatar.cc/150?img=15', content: '저도 귀얄 작업 하는데, 귀얄붓 방향을 한 방향으로만 하는 것보다 교차해서 바르면 더 재미있는 패턴이 나옵니다!', created_at: new Date(Date.now() - 180 * 3600000).toISOString() },
    ],
  },
  {
    id: 'b10',
    title: '도예 공방 서울 지역 추천 부탁드려요',
    content: `서울에서 주 2회 정도 다닐 수 있는 도예 공방을 찾고 있습니다.\n\n조건:\n- 주말 수업 가능\n- 물레 수업 포함\n- 가마 소성 포함\n- 월 15만원 이하\n\n강남, 마포, 종로 어디든 괜찮아요. 직접 다니시는 공방이 있으시면 솔직한 후기도 함께 남겨주시면 감사하겠습니다!`,
    author: 'white_ware',
    avatar_url: 'https://i.pravatar.cc/150?img=15',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    view_count: 308,
    comment_count: 2,
    comments: [
      { id: 'bc10-1', author: 'clay_beginner', avatar_url: 'https://i.pravatar.cc/150?img=40', content: '저는 마포구 공방 다니고 있는데 괜찮아요. DM 드릴게요!', created_at: new Date(Date.now() - 220 * 3600000).toISOString() },
      { id: 'bc10-2', author: 'jade_kiln', avatar_url: 'https://i.pravatar.cc/150?img=45', content: '종로에 오래된 공방이 여러 개 있어요. 인사동 쪽에 전통 도예 공방들 알아보시면 좋을 것 같아요.', created_at: new Date(Date.now() - 210 * 3600000).toISOString() },
    ],
  },
]
