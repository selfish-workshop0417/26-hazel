const RAPIDAPI_KEY = '61f3764f2bmsh92146e4bfbd17a2p1f8257jsna9e25751c829';
const RAPIDAPI_HOST = 'instagram-scraper2.p.rapidapi.com';

function goTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  window.scrollTo(0, 0);
}

// 인스타그램 URL에서 shortcode 추출
function extractShortcode(url) {
  const match = url.match(/instagram\.com\/(?:p|reel|reels)\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
}

// 인스타그램 URL에서 username 추출
function extractUsername(url) {
  const match = url.match(/instagram\.com\/([A-Za-z0-9_.]+)\/?(?:\?|$)/);
  return match ? match[1] : null;
}

async function startAnalyze() {
  const link = document.getElementById('ig-link').value.trim();
  if (!link) {
    alert('인스타그램 링크를 입력해주세요!');
    return;
  }

  const shortcode = extractShortcode(link);
  if (!shortcode) {
    alert('올바른 인스타그램 게시물 링크를 입력해주세요!\n예: https://www.instagram.com/p/XXXXX/');
    return;
  }

  // 로딩 상태 표시
  document.getElementById('analyze-result').classList.remove('hidden');
  document.getElementById('loading-state').classList.remove('hidden');
  document.getElementById('result-content').classList.add('hidden');
  window.scrollTo(0, 300);

  try {
    const data = await fetchInstagramPost(shortcode);
    renderResult(data, shortcode);
  } catch (err) {
    console.error(err);
    showError('데이터를 불러오지 못했어요. 잠시 후 다시 시도해주세요.');
  }
}

async function fetchInstagramPost(shortcode) {
  // medias_v2 엔드포인트로 데이터 가져오기
  const response = await fetch(
    `https://${RAPIDAPI_HOST}/media_info_v2?shortcode=${shortcode}`,
    {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY,
      }
    }
  );
  const data = await response.json();

  // 데이터가 비어있으면 medias 엔드포인트 시도
  if (!data || Object.keys(data).length === 0) {
    throw new Error('No data returned');
  }
  return data;
}

function renderResult(data, shortcode) {
  document.getElementById('loading-state').classList.add('hidden');
  document.getElementById('result-content').classList.remove('hidden');

  // 캡션 추출 (API 응답 구조에 따라 조정)
  const caption = data?.items?.[0]?.caption?.text
    || data?.data?.caption?.text
    || data?.caption?.text
    || '캡션 정보를 가져오지 못했어요.';

  const imageUrl = data?.items?.[0]?.image_versions2?.candidates?.[0]?.url
    || data?.data?.thumbnail_url
    || null;

  // 이미지 표시
  const imgEl = document.getElementById('post-image');
  if (imageUrl) {
    imgEl.src = imageUrl;
    imgEl.style.display = 'block';
  } else {
    imgEl.style.display = 'none';
  }

  // 캡션 분석
  document.getElementById('result-caption').textContent = caption;
  analyzeCaption(caption);
}

function analyzeCaption(caption) {
  // 후킹포인트 분석 (첫 문장 기반)
  const firstSentence = caption.split(/[.!?\n]/)[0] || caption.slice(0, 50);
  document.getElementById('result-hook').textContent =
    `첫 문장: "${firstSentence}"\n→ 📌 AI 분석 기능 연동 예정`;

  // 카피 분석 (이모지, 강조 표현 추출)
  const emojis = caption.match(/[\u{1F300}-\u{1FFFF}]/gu) || [];
  document.getElementById('result-copy').textContent =
    `캡션 길이: ${caption.length}자\n사용된 이모지: ${emojis.length > 0 ? emojis.join(' ') : '없음'}\n→ 📌 AI 분석 기능 연동 예정`;

  // 영상 구성
  document.getElementById('result-video').textContent =
    '영상 장면별 구성 분석은 AI 연동 후 제공됩니다.\n→ 📌 AI 분석 기능 연동 예정';

  // USP
  const hashtags = (caption.match(/#\S+/g) || []).slice(0, 5);
  document.getElementById('result-usp').textContent =
    `해시태그: ${hashtags.length > 0 ? hashtags.join(', ') : '없음'}\n→ 📌 AI 분석 기능 연동 예정`;
}

function showError(msg) {
  document.getElementById('loading-state').classList.add('hidden');
  document.getElementById('result-content').classList.add('hidden');
  document.getElementById('error-state').classList.remove('hidden');
  document.getElementById('error-state').textContent = '⚠️ ' + msg;
}

function saveResult() {
  const tag = document.getElementById('tag-input').value;
  if (!tag) {
    showToast('태그를 입력해주세요!');
    return;
  }
  showToast('🚧 저장 기능은 현재 구현 중이에요!');
}

function showWip() {
  showToast('🚧 아직 구현 중인 기능이에요!');
}

function showToast(msg) {
  const toast = document.getElementById('wip-toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2500);
}
