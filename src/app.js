function goTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  window.scrollTo(0, 0);
}

function startAnalyze() {
  const link = document.getElementById('ig-link').value;
  if (!link) {
    alert('인스타그램 링크를 입력해주세요!');
    return;
  }
  document.getElementById('analyze-result').classList.remove('hidden');
  window.scrollTo(0, 300);
}

function saveResult() {
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
