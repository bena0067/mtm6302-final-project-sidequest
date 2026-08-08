const quests = [
  {
    text: 'Say hi to someone you do not usually talk to.',
    category: 'Social'
  },
  {
    text: 'Find something orange and take a photo of it.',
    category: 'Creative'
  },
  {
    text: 'Spend 10 minutes outside without your phone.',
    category: 'Mindful'
  },
  {
    text: 'Take a different route on your walk today.',
    category: 'Adventurous'
  },
  {
    text: 'Write down three things you are grateful for.',
    category: 'Mindful'
  },
  {
    text: 'Compliment someone today.',
    category: 'Social'
  },
  {
    text: 'Draw something using only one color.',
    category: 'Creative'
  },
  {
    text: 'Try something small that you normally avoid.',
    category: 'Adventurous'
  }
];

const $questText = document.getElementById('questText');
const $questCategory = document.getElementById('questCategory');
const $questNote = document.getElementById('questNote');
const $completeBtn = document.getElementById('completeBtn');
const $streakCount = document.getElementById('streakCount');
const $completedCount = document.getElementById('completedCount');
const $historyList = document.getElementById('historyList');
const $themeBtn = document.getElementById('themeBtn');
const $photoInput = document.getElementById('photoInput');
const $photoPreview = document.getElementById('photoPreview');

const today = new Date().toISOString().split('T')[0];

let dailyQuest =
  JSON.parse(localStorage.getItem('dailyQuest')) || null;

  if (!dailyQuest || dailyQuest.date !== today) {
  const randomIndex = Math.floor(Math.random() * quests.length);

  dailyQuest = {
    ...quests[randomIndex],
    date: today,
    completed: false
  };

  localStorage.setItem(
    'dailyQuest',
    JSON.stringify(dailyQuest)
  );
}

let questHistory =
  JSON.parse(localStorage.getItem('questHistory')) || [];



let streak =
  JSON.parse(localStorage.getItem('streak')) || 0;

let lastCompletedDate =
  localStorage.getItem('lastCompletedDate') || null;

function displayQuestHistory() {
  const html = [];

  for (const quest of questHistory) {
    html.push(`
      <article class="history-card">
        <h3>${quest.text}</h3>
        <p>${quest.date}</p>
        <p>${quest.note || 'No note added.'}</p>
      </article>
    `);
  }

  $historyList.innerHTML = html.join('');
  $completedCount.textContent = questHistory.length;
}

$completeBtn.addEventListener('click', function () {
  if (dailyQuest.completed) {
    return;
  }

  dailyQuest.completed = true;
  updateStreak();

  const completedQuest = {
    text: dailyQuest.text,
    category: dailyQuest.category,
    date: dailyQuest.date,
    note: $questNote.value
  };

  questHistory.unshift(completedQuest);

  localStorage.setItem(
    'dailyQuest',
    JSON.stringify(dailyQuest)
  );

  saveQuestHistory();
  displayQuestHistory();

  $completeBtn.textContent = '✓ Quest Completed';
  $completeBtn.disabled = true;
});


displayQuestHistory();

if (dailyQuest.completed) {
  $completeBtn.textContent = '✓ Quest Completed';
  $completeBtn.disabled = true;
}


function saveQuestHistory() {
  localStorage.setItem(
    'questHistory',
    JSON.stringify(questHistory)
  );
}

function updateStreak() {
  const yesterday = new Date();

  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayDate =
    yesterday.toISOString().split('T')[0];

  if (lastCompletedDate === yesterdayDate) {
    streak++;
  } else if (lastCompletedDate !== today) {
    streak = 1;
  }

  lastCompletedDate = today;

  localStorage.setItem('streak', JSON.stringify(streak));
  localStorage.setItem('lastCompletedDate', lastCompletedDate);

  $streakCount.textContent = streak;
}


$photoInput.addEventListener('change', function () {
  const file = $photoInput.files[0];

  if (!file) {
    return;
  }

  const imageUrl = URL.createObjectURL(file);

  $photoPreview.src = imageUrl;
  $photoPreview.hidden = false;
});

$themeBtn.addEventListener('click', function () {
  document.body.classList.toggle('light-mode');

  if (document.body.classList.contains('light-mode')) {
    $themeBtn.textContent = '🌙 Dark Mode';
  } else {
    $themeBtn.textContent = '☀️ Light Mode';
  }
});

const $resetStreakBtn = document.getElementById('resetStreakBtn');
const $resetHistoryBtn = document.getElementById('resetHistoryBtn');
const $resetAllBtn = document.getElementById('resetAllBtn');

$resetStreakBtn.addEventListener('click', function () {
  streak = 0;
  lastCompletedDate = null;

  localStorage.removeItem('streak');
  localStorage.removeItem('lastCompletedDate');

  $streakCount.textContent = 0;
});

$resetHistoryBtn.addEventListener('click', function () {
  questHistory = [];

  localStorage.removeItem('questHistory');

  displayQuestHistory();
});

$resetAllBtn.addEventListener('click', function () {
  localStorage.removeItem('dailyQuest');
  localStorage.removeItem('questHistory');
  localStorage.removeItem('streak');
  localStorage.removeItem('lastCompletedDate');

  location.reload();
});

const $shareQuestBtn = document.getElementById('shareQuestBtn');
const $questCanvas = document.getElementById('questCanvas');
const $downloadQuest = document.getElementById('downloadQuest');

$shareQuestBtn.addEventListener('click', function () {
  const context = $questCanvas.getContext('2d');

  context.fillStyle = '#191d33';
  context.fillRect(0, 0, 700, 400);

  context.fillStyle = '#8d7cff';
  context.font = 'bold 24px Arial';
  context.fillText('SIDEQUEST', 40, 55);

  context.fillStyle = '#ffffff';
  context.font = 'bold 32px Arial';

  context.fillText(
    dailyQuest.text,
    40,
    140,
    620
  );

  context.fillStyle = '#b8bfd9';
  context.font = '20px Arial';

  context.fillText(
    `Category: ${dailyQuest.category}`,
    40,
    220
  );

  context.fillText(
    `Date: ${dailyQuest.date}`,
    40,
    260
  );

  context.fillStyle = '#27c77c';
  context.font = 'bold 22px Arial';
  context.fillText(
    'Complete your daily side quest.',
    40,
    330
  );

  const imageUrl = $questCanvas.toDataURL('image/png');

  $downloadQuest.href = imageUrl;
  $downloadQuest.download = 'sidequest-card.png';
  $downloadQuest.textContent = 'Save Quest Card';

  $questCanvas.hidden = false;
  $downloadQuest.hidden = false;
});

const $shareCardBtn = document.getElementById('shareCardBtn');
$shareCardBtn.hidden = false;

$shareCardBtn.addEventListener('click', async function () {
  $questCanvas.toBlob(async function (blob) {
    const file = new File(
      [blob],
      'sidequest-card.png',
      { type: 'image/png' }
    );

    if (navigator.share) {
      await navigator.share({
        title: 'My Sidequest',
        text: 'Check out my daily Sidequest!',
        files: [file]
      });
    }
  });
});


$streakCount.textContent = streak;

$questText.textContent = dailyQuest.text;
$questCategory.textContent = dailyQuest.category;