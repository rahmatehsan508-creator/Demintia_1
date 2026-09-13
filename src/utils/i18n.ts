import { Language } from '../types';

export interface TranslationDictionary {
  appName: string;
  appNameAssamese: string;
  appSubtitle: string;
  appTagline: string;
  badgeSih: string;
  safeAtHome: string;
  morning: string;
  afternoon: string;
  evening: string;
  night: string;
  emergencySos: string;
  emergencySubtitle: string;
  emergencyModalTitle: string;
  emergencyModalSubtitle: string;
  emergencyClose: string;
  emergencyCall: string;
  caregiverAssistance: string;
  primaryCaregiver: string;
  doctorClinic: string;
  ambulanceService: string;
  textSizeLarge: string;
  textSizeExtraLarge: string;
  daylightMode: string;
  highContrast: string;
  soundOn: string;
  soundMuted: string;
  languageSelect: string;
  handsFreeVoiceAssistant: string;

  // Navigation
  navDashboard: string;
  navDashboardSub: string;
  backToDashboard: string;
  navRoutine: string;
  navRoutineSub: string;
  navGames: string;
  navGamesSub: string;
  navMemory: string;
  navMemorySub: string;
  navCompanion: string;
  navCompanionSub: string;

  // Memoryom 5 Flagship Cards
  cardBrainExercisesTitle: string;
  cardBrainExercisesSub: string;
  cardBrainExercisesBadge: string;
  cardRoutineTitle: string;
  cardRoutineSub: string;
  cardRoutineBadge: string;
  cardFamilyTitle: string;
  cardFamilySub: string;
  cardFamilyBadge: string;
  cardEmergencyTitle: string;
  cardEmergencySub: string;
  cardEmergencyBadge: string;
  cardInspirationTitle: string;
  cardInspirationQuote: string;
  cardInspirationAuthor: string;
  cardInspirationAction: string;
  listenInspiration: string;

  // Voice Command Bar
  voicePromptPlaceholder: string;
  voiceListening: string;
  voiceListeningSub: string;
  voiceProcessing: string;
  voiceStopListening: string;
  voiceStartListening: string;
  quickCommandsTitle: string;
  cmdShowGames: string;
  cmdReadRoutine: string;
  cmdOpenPhotos: string;
  cmdTalkSaathi: string;
  cmdEmergency: string;

  // Games General
  gamesTitle: string;
  gamesIntroSubtitle: string;
  gamesNoScoreNotice: string;
  gentleMindStimulation: string;
  gamesHeaderTitle: string;
  gamesHeaderSub: string;
  readAboutGames: string;
  difficultyGentle: string;
  gameDifficultyGentle: string;
  gameDifficultyVeryGentle: string;
  playGameButton: string;
  backToGames: string;
  restartGame: string;
  needHint: string;
  revealCardsPeek: string;
  wellDone: string;
  completedGameMessage: string;
  playAgain: string;
  hintsRemaining: string;
  level: string;
  level1: string;
  level2: string;
  level3: string;
  easy: string;
  intermediate: string;
  hard: string;
  infiniteLevels: string;
  difficulty: string;
  levelGentle: string;
  levelStandard: string;
  levelAdvanced: string;
  nextLevel: string;
  allLevelsCompleted: string;
  selectLevel: string;

  // Games Specific
  memoryGameTitle: string;
  memoryGameSubtitle: string;
  memoryGameDesc: string;
  memoryGameBenefit: string;
  memoryGameTagline: string;
  memoryPairsFound: string;
  memoryInstruction: string;

  ballSortTitle: string;
  ballSortSubtitle: string;
  ballSortDesc: string;
  ballSortBenefit: string;
  ballSortTagline: string;
  ballSortInstruction: string;
  undoMove: string;

  snakeGameTitle: string;
  snakeGameSubtitle: string;
  snakeGameDesc: string;
  snakeGameBenefit: string;
  snakeGameTagline: string;
  snakeInstruction: string;
  flowersCollected: string;

  colorGameTitle: string;
  colorGameDesc: string;
  colorGameBenefit: string;
  colorGameTagline: string;
  colorShapeTitle: string;
  colorShapeSubtitle: string;
  colorShapeTagline: string;
  colorShapeInstruction: string;
  colorInstruction: string;
  findTargetPrompt: string;

  // Routine Screen
  routineTitle: string;
  routineSubtitle: string;
  routineHeaderTitle: string;
  routineHeaderSub: string;
  readRoutineButton: string;
  readRoutineAloud: string;
  addReminderButton: string;
  completedTasksCount: string;
  markCompleted: string;
  markedDone: string;
  pillAlert: string;
  medication: string;
  meal: string;
  hydration: string;
  exercise: string;
  rest: string;

  // Memory Book Screen
  memoryBookTitle: string;
  memoryBookSubtitle: string;
  memoryBookSub: string;
  addMemoryButton: string;
  listenStoryButton: string;
  callFamily: string;
  readStoryAloud: string;
  callLovedOne: string;
  keyMemoryLabel: string;
  residenceLabel: string;

  // Companion Saathi Screen
  companionTitle: string;
  companionSubtitle: string;
  companionSub: string;
  companionWelcome: string;
  companionTagline: string;
  companionStatusOnline: string;
  companionOnlineBadge: string;
  companionInputPlaceholder: string;
  companionSendButton: string;
  sendMessageButton: string;
  speakMessageButton: string;
  companionListening: string;
  companionSuggestedPromptsTitle: string;
  promptWhereAmI: string;
  promptWhatDay: string;
  promptTellStory: string;
  promptFeelingUneasy: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'Memoryom',
    appNameAssamese: 'মেমৰিয়াম',
    appSubtitle: 'MEMORY COMPANION',
    appTagline: 'Gentle Memory & Cognitive Care Companion',
    badgeSih: 'MedTech SIH26003',
    safeAtHome: 'You are Safe at Home',
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    night: 'Night',
    emergencySos: 'Emergency / Call Family',
    emergencySubtitle: 'Tap any green phone button to connect instantly with your family or doctor.',
    emergencyModalTitle: 'Emergency & Caregiver Assistance',
    emergencyModalSubtitle: 'You are safe. Assistance is one touch away.',
    emergencyClose: 'Close & Return to Home',
    emergencyCall: 'Call Now',
    caregiverAssistance: 'Caregiver Support',
    primaryCaregiver: 'Primary Caregiver',
    doctorClinic: 'Doctor & Clinic',
    ambulanceService: 'Immediate Ambulance (108)',
    textSizeLarge: 'Text: Large (A)',
    textSizeExtraLarge: 'Text: Extra Large (A+)',
    daylightMode: 'Daylight Mode',
    highContrast: 'High Contrast',
    soundOn: 'Sound ON',
    soundMuted: 'Muted',
    languageSelect: 'Language',
    handsFreeVoiceAssistant: 'Hands-Free Voice Control',

    navDashboard: 'Home Dashboard',
    navDashboardSub: 'Overview & Cards',
    backToDashboard: 'Back to Dashboard',
    navRoutine: 'Daily Routine',
    navRoutineSub: 'Medicines & Meals',
    navGames: 'Brain Exercises',
    navGamesSub: 'Gentle Stimulation',
    navMemory: 'Family & Doctor',
    navMemorySub: 'Photos & Contacts',
    navCompanion: 'Saathi Friend',
    navCompanionSub: 'Voice Companion',

    cardBrainExercisesTitle: 'Brain Exercises',
    cardBrainExercisesSub: 'Relaxing memory cards, soothing chimes & daily sequence games designed to keep your mind bright.',
    cardBrainExercisesBadge: '4 Gentle Exercises',
    cardRoutineTitle: 'Daily Routine',
    cardRoutineSub: 'Timely reminders for morning tea, blood pressure pills, and gentle walking checkpoints.',
    cardRoutineBadge: 'Today\'s Schedule',
    cardFamilyTitle: 'Family & Doctor',
    cardFamilySub: 'Cherished memories, family photo albums, and one-touch direct phone calls to loved ones.',
    cardFamilyBadge: 'Loved Ones',
    cardEmergencyTitle: 'Emergency SOS',
    cardEmergencySub: 'Immediate 1-touch connection to your primary caregiver, emergency doctor, and clinic.',
    cardEmergencyBadge: 'Safe at Home',
    cardInspirationTitle: 'Daily Inspiration & Peace',
    cardInspirationQuote: '“Every moment is a fresh beginning. Take a soft breath, feel the warmth of home, and know you are cherished.”',
    cardInspirationAuthor: 'Gentle Daily Reflection',
    cardInspirationAction: 'Talk with Saathi Companion',
    listenInspiration: 'Listen Aloud',

    voicePromptPlaceholder: 'Tap mic or say "Open games", "Show routine", "Read memories"',
    voiceListening: 'Listening to your voice...',
    voiceListeningSub: 'Speak in English, Hindi, Bengali, or Assamese',
    voiceProcessing: 'Understanding your command...',
    voiceStopListening: 'Stop Listening',
    voiceStartListening: 'Speak Command',
    quickCommandsTitle: 'Try saying or tapping:',
    cmdShowGames: 'Play Games',
    cmdReadRoutine: 'My Routine',
    cmdOpenPhotos: 'Family Photos',
    cmdTalkSaathi: 'Talk with Saathi',
    cmdEmergency: 'Call Help',

    gamesTitle: 'Gentle Brain & Mind Games',
    gamesIntroSubtitle: 'Relaxing exercises designed to stimulate recall, pattern recognition, and focus without pressure or countdowns.',
    gamesNoScoreNotice: 'No scores, no timers, pure joy',
    gentleMindStimulation: 'Gentle Mind Stimulation',
    gamesHeaderTitle: 'Gentle Cognitive Games',
    gamesHeaderSub: 'Designed for relaxation, memory stimulation, and peaceful engagement.',
    readAboutGames: 'Read about games',
    difficultyGentle: 'Gentle',
    gameDifficultyGentle: 'Gentle & Relaxing',
    gameDifficultyVeryGentle: 'Very Gentle',
    playGameButton: 'Play Game',
    backToGames: 'Back to Games',
    restartGame: 'Restart',
    needHint: 'Need a Hint?',
    revealCardsPeek: 'Peek Cards (3s)',
    wellDone: 'Wonderful Job!',
    completedGameMessage: 'You did marvelously well! Your mind is active and bright.',
    playAgain: 'Play Again',
    hintsRemaining: 'hints remaining',
    level: 'Level',
    level1: 'Easy',
    level2: 'Hard',
    level3: 'Intermediate',
    easy: 'Easy',
    hard: 'Hard',
    intermediate: 'Intermediate',
    infiniteLevels: 'Infinite Levels',
    difficulty: 'Difficulty',
    levelGentle: 'Gentle',
    levelStandard: 'Standard',
    levelAdvanced: 'Challenge',
    nextLevel: 'Next Level',
    allLevelsCompleted: 'Level Completed!',
    selectLevel: 'Choose Difficulty',

    memoryGameTitle: 'Memory Card Match',
    memoryGameSubtitle: 'Match familiar flowers and cultural symbols',
    memoryGameDesc: 'Flip two cards at a time to find beautiful pairs of flowers, tea leaves, and gentle symbols.',
    memoryGameBenefit: 'Boosts short-term visual recall and spatial focus',
    memoryGameTagline: 'Visual Recall & Focus',
    memoryPairsFound: 'pairs discovered',
    memoryInstruction: 'Tap any card to turn it over, then find its matching pair.',

    ballSortTitle: 'Peaceful Ball Sort',
    ballSortSubtitle: 'Sort colorful glowing spheres into matching vials',
    ballSortDesc: 'Tap a vial to pick up the top ball, then tap another vial to drop it. Group all matching colors together at your own calm pace.',
    ballSortBenefit: 'Strengthens logical planning, visual categorisation, and methodical problem-solving',
    ballSortTagline: 'Colour Sorting & Spatial Logic',
    ballSortInstruction: 'Tap a vial to pick up its top ball, then tap another vial to place it.',
    undoMove: 'Undo Move',

    snakeGameTitle: 'Gentle Garden Caterpillar',
    snakeGameSubtitle: 'Guide a friendly garden friend to collect fresh blossoms',
    snakeGameDesc: 'Gently guide your garden friend across peaceful tea garden grass to collect blossoms. Move at a relaxed, comfortable pace without stress.',
    snakeGameBenefit: 'Enhances gentle eye-hand coordination, smooth reaction flow, and spatial focus',
    snakeGameTagline: 'Gentle Navigation & Motor Flow',
    snakeInstruction: 'Use the large arrow buttons to guide your gentle friend to each flower.',
    flowersCollected: 'blossoms gathered',

    colorGameTitle: 'Color & Nature Match',
    colorGameDesc: 'Match soothing tea-garden greens, marigold ambers, and serene sky blues with soft geometric shapes.',
    colorGameBenefit: 'Reinforces visual association and calming discrimination',
    colorGameTagline: 'Visual Recognition & Shape Focus',
    colorShapeTitle: 'Color & Nature Match',
    colorShapeSubtitle: 'Match soothing colors and nature shapes',
    colorShapeTagline: 'Visual Recognition & Shape Focus',
    colorShapeInstruction: 'Find and tap the item that matches the prompt.',
    colorInstruction: 'Find and tap the item that matches the prompt.',
    findTargetPrompt: 'Please find the:',

    routineTitle: 'Good Day, Shanti. Here Is Your Routine.',
    routineSubtitle: 'Take your time. Each checkmark keeps your day comfortable and healthy.',
    routineHeaderTitle: 'Today\'s Gentle Schedule',
    routineHeaderSub: 'Simple checkpoints for medicines, healthy meals, and comforting rests.',
    readRoutineButton: 'Read Schedule Aloud',
    readRoutineAloud: 'Read Schedule Aloud',
    addReminderButton: 'Add Reminder',
    completedTasksCount: 'completed so far',
    markCompleted: 'Mark Done',
    markedDone: 'Done',
    pillAlert: 'Medicine Reminder',
    medication: 'Medication',
    meal: 'Meal',
    hydration: 'Water / Tea',
    exercise: 'Gentle Walk',
    rest: 'Rest & Relaxation',

    memoryBookTitle: 'Your Beloved Family & Cherished Memories',
    memoryBookSubtitle: 'These are the people and places who love you and keep you safe. Tap "Listen to Story" anytime.',
    memoryBookSub: 'These are the people and places who love you and keep you safe.',
    addMemoryButton: 'Add Memory to Book',
    listenStoryButton: 'Listen to Story',
    callFamily: 'Call Loved One',
    readStoryAloud: 'Listen to Story',
    callLovedOne: 'Call Loved One',
    keyMemoryLabel: 'Precious Memory',
    residenceLabel: 'Current Location',

    companionTitle: 'Saathi Memory Companion',
    companionSubtitle: 'A gentle, patient friend who speaks with you warmly in your own language.',
    companionSub: 'A patient, caring friend who is always here to talk, listen, and comfort you.',
    companionWelcome: 'Hello, dear Shanti. I am Saathi, your gentle companion. You are safe in your comfortable home today. How are you feeling right now?',
    companionTagline: 'Gentle Voice & Validation Companion',
    companionStatusOnline: 'Always Listening & Here for You',
    companionOnlineBadge: 'Always Here for You',
    companionInputPlaceholder: 'Type a message or press the microphone to talk...',
    companionSendButton: 'Send',
    sendMessageButton: 'Send Message',
    speakMessageButton: 'Speak Aloud',
    companionListening: 'Listening attentively...',
    companionSuggestedPromptsTitle: 'Tap any thought to ask or talk:',
    promptWhereAmI: 'Where am I right now?',
    promptWhatDay: 'What day is it today?',
    promptTellStory: 'Tell me a peaceful story of Assam',
    promptFeelingUneasy: 'I feel a little uneasy right now',
  },

  as: {
    appName: 'মেমৰিয়াম',
    appNameAssamese: 'মেমৰিয়াম',
    appSubtitle: 'MEMORY COMPANION',
    appTagline: 'জ্ঞানীয় যত্ন আৰু ডিমেনচিয়া সমৰ্থন',
    badgeSih: 'মেডটেক SIH26003',
    safeAtHome: 'আপুনি আপোনাৰ ঘৰতে সুৰক্ষিত আছে',
    morning: 'ৰাতিপুৱা',
    afternoon: 'দুপৰীয়া',
    evening: 'গধূলি',
    night: 'ৰাতি',
    emergencySos: 'জৰুৰী / পৰিয়ালক ফোন',
    emergencySubtitle: 'পৰিয়াল বা ডাক্তৰৰ লগত কথা পাতিবলৈ সেউজীয়া বুটামত টিপক।',
    emergencyModalTitle: 'জৰুৰীকালীন সহায় আৰু যোগাযোগ',
    emergencyModalSubtitle: 'আপুনি সম্পূৰ্ণ সুৰক্ষিত। সহায় মাত্ৰ এক স্পৰ্শৰ দূৰত্বত।',
    emergencyClose: 'বন্ধ কৰক আৰু ঘৰলৈ উভতি যাওক',
    emergencyCall: 'এতিয়াই ফোন কৰক',
    caregiverAssistance: 'যত্নকাৰীৰ সহায়',
    primaryCaregiver: 'মুখ্য যত্নকাৰী',
    doctorClinic: 'চিকিৎসক আৰু ক্লিনিক',
    ambulanceService: 'জৰুৰী এম্বুলেন্স (১০৮)',
    textSizeLarge: 'আখৰ: ডাঙৰ (A)',
    textSizeExtraLarge: 'আখৰ: অতি ডাঙৰ (A+)',
    daylightMode: 'দিনৰ পোহৰ',
    highContrast: 'উচ্চ কণ্ট্ৰাষ্ট (স্পষ্ট)',
    soundOn: 'শব্দ অন',
    soundMuted: 'শব্দ বন্ধ',
    languageSelect: 'ভাষা',
    handsFreeVoiceAssistant: 'হাত নলগোৱাকৈ মাতৰ সহায়',

    navDashboard: 'মূল ডেশ্বব’ৰ্ড',
    navDashboardSub: 'এক নজৰত সকলো',
    backToDashboard: 'ডেশ্বব’ৰ্ডলৈ উভতি যাওক',
    navRoutine: 'দৈনন্দিন নিয়ম',
    navRoutineSub: 'দৰব আৰু আহাৰ',
    navGames: 'মনৰ খেল',
    navGamesSub: 'সহজ মগজুৰ চৰ্চা',
    navMemory: 'পৰিয়াল আৰু চিকিৎসক',
    navMemorySub: 'স্মৃতি আৰু ফোন',
    navCompanion: 'সংগী বন্ধু',
    navCompanionSub: 'মাতৰ সহচৰ',

    cardBrainExercisesTitle: 'মগজুৰ সহজ খেল',
    cardBrainExercisesSub: 'ফুল মিলোৱা, শান্ত ঘণ্টাধ্বনি আৰু কামৰ ক্ৰম - কোনো চাপ বা নম্বৰ নোহোৱাকৈ।',
    cardBrainExercisesBadge: '৪টা শান্ত খেল',
    cardRoutineTitle: 'দৈনন্দিন নিয়ম',
    cardRoutineSub: 'ৰাতিপুৱাৰ চাহ, ৰক্তচাপৰ ঔষধ আৰু খোজ কঢ়াৰ শান্ত সোঁৱৰণী।',
    cardRoutineBadge: 'আজিৰ কাৰ্যসূচী',
    cardFamilyTitle: 'পৰিয়াল আৰু চিকিৎসক',
    cardFamilySub: 'মৰমৰ আপোন মানুহৰ ছবি, স্মৃতি আৰু মাত্ৰ এটি টিপাতে ফোন কৰাৰ সুবিধা।',
    cardFamilyBadge: 'আপোনজন',
    cardEmergencyTitle: 'জৰুৰীকালীন সহায় (SOS)',
    cardEmergencySub: 'মুখ্য যত্নকাৰী, পৰিয়াল বা চিকিৎসকক এতিয়াই যোগাযোগ কৰক।',
    cardEmergencyBadge: 'ঘৰতে সুৰক্ষিত',
    cardInspirationTitle: 'শান্ত মন আৰু অনুপ্ৰেৰণা',
    cardInspirationQuote: '“প্ৰতিটো নতুন পুৱা এটি নতুন আশা। শান্তভাৱে উশাহ লওক, আপুনি আপোনাৰ মৰমৰ ঘৰতে শান্তিত আছে।”',
    cardInspirationAuthor: 'আজিৰ শান্তিময় বাণী',
    cardInspirationAction: 'সংগীৰ সৈতে কথা পাতক',
    listenInspiration: 'বাণী শুনক',

    voicePromptPlaceholder: 'মাইকত টিপি কওক: "খেল দেখুওৱা", "নিয়ম কোৱা", "ফটো দেখুওৱা"',
    voiceListening: 'আপোনাৰ কথা শুনি থকা হৈছে...',
    voiceListeningSub: 'অসমীয়া, বাংলা, হিন্দী বা ইংৰাজীত কওক',
    voiceProcessing: 'বুজি পোৱাৰ চেষ্টা চলিছে...',
    voiceStopListening: 'শুনা বন্ধ কৰক',
    voiceStartListening: 'কথা কওক',
    quickCommandsTitle: 'কওক বা স্পৰ্শ কৰক:',
    cmdShowGames: 'মনৰ খেল খেলোঁ',
    cmdReadRoutine: 'আজিৰ নিয়ম',
    cmdOpenPhotos: 'পৰিয়ালৰ ফটো',
    cmdTalkSaathi: 'সংগীৰ লগত কথা',
    cmdEmergency: 'সহায় বিচাৰোঁ',

    gamesTitle: 'সহজ আৰু শান্ত মনৰ খেল',
    gamesIntroSubtitle: 'কোনো নম্বৰ বা সময়ৰ চাপ নোহোৱাকৈ মন সতেজ আৰু স্মৃতি সজীৱ ৰখাৰ শান্তিময় অনুশীলন।',
    gamesNoScoreNotice: 'কোনো সময়সীমা নাই, কেৱল আনন্দ',
    gentleMindStimulation: 'শান্ত মনৰ চৰ্চা',
    gamesHeaderTitle: 'সহজ আৰু শান্ত মনৰ খেল',
    gamesHeaderSub: 'মনৰ শান্তি আৰু স্মৃতি সতেজ কৰি ৰাখিবলৈ বিশেষভাৱে নিৰ্মিত।',
    readAboutGames: 'খেলসমূহৰ কথা শুনক',
    difficultyGentle: 'সহজ',
    gameDifficultyGentle: 'অতি শান্ত আৰু সহজ',
    gameDifficultyVeryGentle: 'অতি সহজ',
    playGameButton: 'খেল আৰম্ভ কৰক',
    backToGames: 'খেলৰ তালিকালৈ উভতি যাওক',
    restartGame: 'নতুনকৈ খেলক',
    needHint: 'সহায় লাগে নেকি?',
    revealCardsPeek: 'কাৰ্ডবোৰ চাওক (৩ ছেকেণ্ড)',
    wellDone: 'বৰ সুন্দৰ কাম!',
    completedGameMessage: 'আপুনি বৰ আনন্দৰে সম্পন্ন কৰিলে! আপোনাৰ মন সতেজ হৈ উঠিছে।',
    playAgain: 'আকৌ খেলক',
    hintsRemaining: 'টা সহায় বাকী আছে',
    level: 'স্তৰ',
    level1: 'সহজ',
    level2: 'কঠিন',
    level3: 'মধ্যমীয়া',
    easy: 'সহজ',
    hard: 'কঠিন',
    intermediate: 'মধ্যমীয়া',
    infiniteLevels: 'অন্তহীন স্তৰ',
    difficulty: 'কঠিনতা',
    levelGentle: 'সহজ',
    levelStandard: 'নিয়মীয়া',
    levelAdvanced: 'প্ৰত্যাহ্বান',
    nextLevel: 'পৰৱৰ্তী স্তৰ',
    allLevelsCompleted: 'স্তৰ সমাপ্ত হ\'ল!',
    selectLevel: 'কঠিনতা বাছক',

    memoryGameTitle: 'স্মৃতিৰ ফুল মিলোৱা',
    memoryGameSubtitle: 'মৰমৰ ফুল আৰু চিহ্নবোৰৰ জোৰ মিলোৱা',
    memoryGameDesc: 'দুখনকৈ কাৰ্ড লুটিয়াই এপাহ কপৌ ফুল, চাহপাত বা চাকিৰ সুন্দৰ জোৰ বিচাৰি উলিয়াওক।',
    memoryGameBenefit: 'দৃষ্টি আৰু স্মৃতিশক্তি সজীৱ কৰি তোলে',
    memoryGameTagline: 'দৃষ্টি আৰু স্মৃতি সজীৱকৰণ',
    memoryPairsFound: 'যোৰ ফুল পোৱা গ\'ল',
    memoryInstruction: 'যিকোনো কাৰ্ডত টিপক, তাৰ পাছত একেখন ছবি আন এখন কাৰ্ডত বিচাৰক।',

    ballSortTitle: 'শান্তিময় বল সজোৱা খেল',
    ballSortSubtitle: 'একে ৰঙৰ বলবোৰ একেটা পাত্ৰত সজাওক',
    ballSortDesc: 'এটা পাত্ৰত টিপি ওপৰৰ বলটো তোলক, আৰু আন এটা পাত্ৰত পেলাওক। কোনো খৰখেদা নকৰাকৈ একে ৰঙৰ বলবোৰ একেলগে সজাওক।',
    ballSortBenefit: 'যুক্তিপূৰ্ণ চিন্তা আৰু ৰং চিনাক্তকৰণ সতেজ কৰে',
    ballSortTagline: 'ৰং সজোৱা আৰু যুক্তিপূৰ্ণ চিন্তা',
    ballSortInstruction: 'এটা পাত্ৰত স্পৰ্শ কৰি বল তুলি আন এটা পাত্ৰত ৰাখক।',
    undoMove: 'আগৰ চাললৈ উভতি যাওক',

    snakeGameTitle: 'বাগানৰ শান্ত পখিলা-পলু',
    snakeGameSubtitle: 'চাহ বাগিচাত ফুল বুটলি ফুৰা শান্ত খেল',
    snakeGameDesc: 'ধীৰে ধীৰে শান্তভাৱে বাগিচাত ফুল বুটলি ফুৰক। কোনো খৰখেদা বা পৰাজয়ৰ ভয় নাই, সম্পূৰ্ণ শান্তিত আনন্দ লওক।',
    snakeGameBenefit: 'হাত আৰু চকুৰ সন্তুলন আৰু মনোযোগ বৃদ্ধি কৰে',
    snakeGameTagline: 'শান্ত গতি আৰু হাত-চকুৰ সন্তুলন',
    snakeInstruction: 'কাঁড় চিন থকা ডাঙৰ বুটামকেইটাৰে বাগানৰ বন্ধুক ফুলৰ ওচৰলৈ লৈ যাওক।',
    flowersCollected: 'পাহ ফুল বুটলা হ\'ল',

    colorGameTitle: 'ৰং আৰু প্ৰকৃতি মিলোৱা',
    colorGameDesc: 'চাহ বাগিচাৰ সেউজীয়া, বেলিৰ হালধীয়া আৰু আকাশৰ নীলা ৰং আকৃতিৰ সৈতে চিনাক্ত কৰক।',
    colorGameBenefit: 'ৰং আৰু প্ৰকৃতিৰ চিনাক্তকৰণ সহায় কৰে',
    colorGameTagline: 'ৰং আৰু আকৃতি চিনাক্তকৰণ',
    colorShapeTitle: 'ৰং আৰু প্ৰকৃতি মিলোৱা',
    colorShapeSubtitle: 'চাহ বাগিচাৰ সেউজীয়া আৰু বেলিৰ হালধীয়া ৰং মিলোৱা',
    colorShapeTagline: 'ৰং আৰু প্ৰকৃতি চিনাক্তকৰণ',
    colorShapeInstruction: 'যিটো ৰং বা আকৃতি বিচাৰিবলৈ কোৱা হৈছে, তাত স্পৰ্শ কৰক।',
    colorInstruction: 'যিটো ৰং বা আকৃতি বিচাৰিবলৈ কোৱা হৈছে, তাত স্পৰ্শ কৰক।',
    findTargetPrompt: 'অনুগ্ৰহ কৰি বিচাৰক:',

    routineTitle: 'শুভ দিন, শান্তি বাইদেউ। এয়া আপোনাৰ আজিৰ সূচী।',
    routineSubtitle: 'ধীৰে-সুস্থে সময় লওক। প্ৰতিটো কামে আপোনাক সুস্থ আৰু শান্তিত ৰাখিব।',
    routineHeaderTitle: 'আজিৰ সহজ সূচী',
    routineHeaderSub: 'দৰব, খোৱা-বোৱা আৰু বিশ্ৰামৰ সহজ সোঁৱৰণী।',
    readRoutineButton: 'সূচীখন পঢ়ি শুনাওক',
    readRoutineAloud: 'সূচীখন পঢ়ি শুনাওক',
    addReminderButton: 'নতুন সোঁৱৰণী যোগ কৰক',
    completedTasksCount: 'টা কাম সম্পূৰ্ণ হ\'ল',
    markCompleted: 'সম্পূৰ্ণ কৰক',
    markedDone: 'হ\'ল',
    pillAlert: 'দৰবৰ সময়',
    medication: 'দৰব / ঔষধ',
    meal: 'আহাৰ',
    hydration: 'পানী / চাহ',
    exercise: 'খোজ কঢ়া',
    rest: 'বিশ্ৰাম',

    memoryBookTitle: 'আপোনাৰ মৰমৰ পৰিয়াল আৰু স্মৃতি পুথি',
    memoryBookSubtitle: 'এখেতসকল আপোনাৰ আপোনজন, যিয়ে আপোনাক বহুত ভাল পায়। কাহিনী শুনিবলৈ যিকোনো সময়ত টিপক।',
    memoryBookSub: 'এখেতসকল আপোনাৰ আপোনজন, যিয়ে আপোনাক সদায় মৰম আৰু যত্ন কৰে।',
    addMemoryButton: 'স্মৃতি পুথিত যোগ কৰক',
    listenStoryButton: 'মৰমৰ কাহিনী শুনক',
    callFamily: 'ফোন কৰক',
    readStoryAloud: 'কাহিনী শুনক',
    callLovedOne: 'ফোন কৰক',
    keyMemoryLabel: 'স্মৃতিৰ কথা',
    residenceLabel: 'বর্তমান ঠিকনা',

    companionTitle: 'সংগী (সাথী) বন্ধু',
    companionSubtitle: 'আপোনাৰ নিজৰ ভাষাত কথা পতা এগৰাকী মৰমীয়াল আৰু শান্ত সংগী।',
    companionSub: 'আপোনাৰ লগত সদায় কথা পাতিবলৈ আৰু সান্ত্বনা দিবলৈ সাজু থকা মৰমৰ বন্ধু।',
    companionWelcome: 'নমস্কাৰ শান্তি বাইদেউ। মই আপোনাৰ সংগী। আপুনি আপোনাৰ ঘৰতে শান্তিত আছে। আজি আপোনাৰ মনটো কেনে লাগিছে?',
    companionTagline: 'মৰমীয়াল মাত আৰু সান্ত্বনাৰ সংগী',
    companionStatusOnline: 'সদায় আপোনাৰ কাষতেই আছোঁ',
    companionOnlineBadge: 'সদায় আপোনাৰ লগত',
    companionInputPlaceholder: 'কিবা কওক বা মাইকত টিপি কথা পাতক...',
    companionSendButton: 'পঠিয়াওক',
    sendMessageButton: 'বাৰ্তা পঠিয়াওক',
    speakMessageButton: 'মুখেৰে কওক',
    companionListening: 'আপোনাৰ কথা শুনি থকা হৈছে...',
    companionSuggestedPromptsTitle: 'সহজ প্ৰশ্নৰ বাবে স্পৰ্শ কৰক:',
    promptWhereAmI: 'মই এতিয়া ক\'ত আছোঁ?',
    promptWhatDay: 'আজি বাৰ কি বা তাৰিখ কি?',
    promptTellStory: 'মোক অসম আৰু ব্ৰহ্মপুত্ৰৰ এটা সাধু কোৱা',
    promptFeelingUneasy: 'মোৰ মনটো অলপ অস্থিৰ লাগিছে',
  },

  bn: {
    appName: 'মেমরিয়ম',
    appNameAssamese: 'মেমৰিয়াম',
    appSubtitle: 'MEMORY COMPANION',
    appTagline: 'কগনিটিভ যত্ন ও স্মৃতি সহায়তা',
    badgeSih: 'মেডটেক SIH26003',
    safeAtHome: 'আপনি নিজের ঘরে সম্পূর্ণ নিরাপদ',
    morning: 'সকাল',
    afternoon: 'দুপুর',
    evening: 'সন্ধ্যা',
    night: 'রাত',
    emergencySos: 'জরুরি / পরিবারে ফোন',
    emergencySubtitle: 'পরিবার বা ডাক্তারের সাথে সরাসরি কথা বলতে সবুজ বোতামটি চাপুন।',
    emergencyModalTitle: 'জরুরি সহায়তা ও যোগাযোগ',
    emergencyModalSubtitle: 'আপনি নিরাপদ। সহায়তা এক স্পর্শের দূরত্বেই রয়েছে।',
    emergencyClose: 'বন্ধ করে বাড়ি ফিরে যান',
    emergencyCall: 'এখনই কল করুন',
    caregiverAssistance: 'যত্ন সহায়িকা',
    primaryCaregiver: 'প্রধান অভিভাবক',
    doctorClinic: 'ডাক্তার ও ক্লিনিক',
    ambulanceService: 'জরুরি অ্যাম্বুলেন্স (১০৮)',
    textSizeLarge: 'অক্ষর: বড় (A)',
    textSizeExtraLarge: 'অক্ষর: অতি বড় (A+)',
    daylightMode: 'দিনের আলো মোড',
    highContrast: 'হাই কন্ট্রাস্ট (উচ্চ বৈসাদৃশ্য)',
    soundOn: 'শব্দ চালু',
    soundMuted: 'শব্দ বন্ধ',
    languageSelect: 'ভাষা',
    handsFreeVoiceAssistant: 'হাত না ছুঁয়ে মুখে নির্দেশ',

    navDashboard: 'মূল ড্যাশবোর্ড',
    navDashboardSub: 'এক নজরে সব',
    backToDashboard: 'ড্যাশবোর্ডে ফিরুন',
    navRoutine: 'দৈনিক রুটিন',
    navRoutineSub: 'ওষুধ ও আহার',
    navGames: 'ব্রেন এক্সারসাইজ',
    navGamesSub: 'সহজ মস্তিষ্কের খেলা',
    navMemory: 'পরিবার ও ডাক্তার',
    navMemorySub: 'স্মৃতি ও যোগাযোগ',
    navCompanion: 'সাথী বন্ধু',
    navCompanionSub: 'ভয়েস কথোপকথন',

    cardBrainExercisesTitle: 'ব্রেন এক্সারসাইজ',
    cardBrainExercisesSub: 'তাস মেলানো, শান্ত সুর ও সকালের কাজের ক্রম - কোনো তাড়াহুড়ো বা নম্বরের চাপ ছাড়া।',
    cardBrainExercisesBadge: '৪টি সহজ খেলা',
    cardRoutineTitle: 'দৈনিক রুটিন',
    cardRoutineSub: 'সকালের চা, রক্তচাপের ওষুধ ও শান্ত হাঁটার সহজ সময়সূচি।',
    cardRoutineBadge: 'আজকের তালিকা',
    cardFamilyTitle: 'পরিবার ও ডাক্তার',
    cardFamilySub: 'প্রিয়জনের ছবি, সুন্দর স্মৃতির গল্প ও এক স্পর্শে সরাসরি ফোন কল।',
    cardFamilyBadge: 'আপনজন',
    cardEmergencyTitle: 'জরুরি সহায়তা (SOS)',
    cardEmergencySub: 'প্রধান অভিভাবক, পরিবার বা ডাক্তারের সাথে তাৎক্ষণিক যোগাযোগ করুন।',
    cardEmergencyBadge: 'ঘরে নিরাপদ',
    cardInspirationTitle: 'দৈনিক অনুপ্রেরণা ও মনের শান্তি',
    cardInspirationQuote: '“প্রতিটি মুহূর্ত এক নতুন সূচনা। শান্ত হয়ে শ্বাস নিন, নিজের ভালোবাসার ঘরে আপনি সম্পূর্ণ নিরাপদে আছেন।”',
    cardInspirationAuthor: 'মনের শান্তির বাণী',
    cardInspirationAction: 'সাথী বন্ধুর সাথে কথা বলুন',
    listenInspiration: 'বাণী শুনুন',

    voicePromptPlaceholder: 'মাইক টিপে বলুন: "খেলা দেখাও", "রুটিন পড়ো", "ছবি দেখাও"',
    voiceListening: 'আপনার কথা শোনা হচ্ছে...',
    voiceListeningSub: 'বাংলা, অসমীয়া, হিন্দি বা ইংরেজিতে বলুন',
    voiceProcessing: 'নির্দেশ বোঝা হচ্ছে...',
    voiceStopListening: 'শোনা বন্ধ করুন',
    voiceStartListening: 'মুখে বলুন',
    quickCommandsTitle: 'বলুন অথবা স্পর্শ করুন:',
    cmdShowGames: 'খেলা খেলি',
    cmdReadRoutine: 'আজকের রুটিন',
    cmdOpenPhotos: 'পরিবারের ছবি',
    cmdTalkSaathi: 'সাথীর সাথে কথা',
    cmdEmergency: 'সাহায্য চাই',

    gamesTitle: 'শান্ত ও মনোরম ব্রেন গেম',
    gamesIntroSubtitle: 'কোনো সময়সীমা বা স্কোরের চাপ ছাড়াই স্মৃতি ও মনোযোগ সতেজ রাখার শান্তিময় খেলা।',
    gamesNoScoreNotice: 'কোনো তাড়াহুড়ো নেই, কেবল মানসিক আনন্দ',
    gentleMindStimulation: 'সহজ মনের চর্চা',
    gamesHeaderTitle: 'শান্ত ও সহজ ব্রেন গেম',
    gamesHeaderSub: 'মন শান্ত রাখতে ও স্মৃতি সতেজ করতে বিশেষ যত্নসহকারে তৈরি।',
    readAboutGames: 'খেলার বিবরণ শুনুন',
    difficultyGentle: 'সহজ',
    gameDifficultyGentle: 'খুবই সহজ ও শান্তিময়',
    gameDifficultyVeryGentle: 'অতি সহজ',
    playGameButton: 'খেলা শুরু করুন',
    backToGames: 'খেলার তালিকায় ফিরুন',
    restartGame: 'নতুন করে শুরু',
    needHint: 'সাহায্য চান?',
    revealCardsPeek: 'এক ঝলক দেখুন (৩ সেকেন্ড)',
    wellDone: 'দারুণ কাজ!',
    completedGameMessage: 'আপনি চমৎকারভাবে খেলাটি সম্পন্ন করেছেন! আপনার মন সতেজ ও আনন্দিত।',
    playAgain: 'আবার খেলুন',
    hintsRemaining: 'টি সাহায্য বাকি',
    level: 'স্তর',
    level1: 'সহজ',
    level2: 'কঠিন',
    level3: 'মাঝারি',
    easy: 'সহজ',
    hard: 'কঠিন',
    intermediate: 'মাঝারি',
    infiniteLevels: 'অনন্ত স্তর',
    difficulty: 'কঠিনতা',
    levelGentle: 'সহজ',
    levelStandard: 'স্বাভাবিক',
    levelAdvanced: 'চ্যালেঞ্জ',
    nextLevel: 'পরবর্তী স্তর',
    allLevelsCompleted: 'স্তর সম্পন্ন হয়েছে!',
    selectLevel: 'কঠিনতা নির্বাচন',

    memoryGameTitle: 'স্মৃতির তাস মেলানো',
    memoryGameSubtitle: 'পরিচিত ফুল ও প্রাকৃতিক চিহ্নের জোড়া মেলান',
    memoryGameDesc: 'দুটি করে কার্ড উল্টে পদ্ম ফুল, জবা বা প্রদীপের সুন্দর জোড়া খুঁজে বের করুন।',
    memoryGameBenefit: 'দৃষ্টি ও তাৎক্ষণিক স্মৃতিশক্তি সতেজ করে',
    memoryGameTagline: 'দৃষ্টি ও স্মৃতি সতেজীকরণ',
    memoryPairsFound: 'জোড়া খুঁজে পাওয়া গেছে',
    memoryInstruction: 'যেকোনো কার্ডে চাপ দিন, তারপর তার সাথে মিলে এমন কার্ড খুঁজুন।',

    ballSortTitle: 'শান্ত বল সাজানোর খেলা',
    ballSortSubtitle: 'একই রঙের বলগুলো একটি পাত্রে সাজিয়ে রাখুন',
    ballSortDesc: 'একটি পাত্রে হাত দিয়ে ওপরের বলটি তুলুন এবং অন্য পাত্রে রাখুন। কোনো তাড়াহুড়ো ছাড়া একই রঙের বলগুলো একসাথে সাজান।',
    ballSortBenefit: 'যৌক্তিক চিন্তা ও রঙের শ্রেণীবিন্যাস ক্ষমতা বাড়ায়',
    ballSortTagline: 'রং বিন্যাস ও যৌক্তিক ভাবনা',
    ballSortInstruction: 'একটি পাত্র স্পর্শ করে বল তুলুন এবং অন্য পাত্রে রাখুন।',
    undoMove: 'আগের চালে ফিরুন',

    snakeGameTitle: 'বাগানের শান্ত শুঁয়োপোকা',
    snakeGameSubtitle: 'চা বাগানে ফুল কুড়ানোর স্নিগ্ধ খেলা',
    snakeGameDesc: 'শান্ত ছন্দে বাগানে ফুল সংগ্রহ করতে করতে এগিয়ে যান। কোনো তাড়াহুড়ো নেই, সুন্দর শান্ত গতিতে আনন্দ নিন।',
    snakeGameBenefit: 'হাত ও চোখের সমন্বয় এবং মনঃসংযোগ দৃঢ় করে',
    snakeGameTagline: 'স্নিগ্ধ চলাচল ও চোখের সমন্বয়',
    snakeInstruction: 'তীর চিহ্নের বড় বোতামগুলো দিয়ে বাগানের বন্ধুটিকে ফুলের দিকে নিয়ে যান।',
    flowersCollected: 'টি ফুল সংগৃহীত হয়েছে',

    colorGameTitle: 'রং ও প্রকৃতির আকার মেলানো',
    colorGameDesc: 'চা বাগানের সবুজ, গাঁদা ফুলের সোনালী ও আকাশের নীল রং দিয়ে আকার চিনুন।',
    colorGameBenefit: 'রং ও আকৃতি চেনার ক্ষমতা সতেজ করে',
    colorGameTagline: 'রং ও আকৃতি চেনা',
    colorShapeTitle: 'রং ও প্রকৃতির আকার মেলানো',
    colorShapeSubtitle: 'চা বাগানের সবুজ ও গাঁদা ফুলের সোনালী রং মেলান',
    colorShapeTagline: 'রং ও আকৃতি চেনা',
    colorShapeInstruction: 'যে রং বা আকারটি বলা হয়েছে, সেটিতে স্পর্শ করুন।',
    colorInstruction: 'যে রং বা আকারটি বলা হয়েছে, সেটিতে স্পর্শ করুন।',
    findTargetPrompt: 'অনুগ্রহ করে খুঁজুন:',

    routineTitle: 'শুভ দিন, শান্তি দেবী। এই আপনার আজকের রুটিন।',
    routineSubtitle: 'ধীরে-সুস্থে সময় নিন। প্রতিটি কাজ আপনার দিনটিকে সুন্দর ও সুস্থ রাখবে।',
    routineHeaderTitle: 'আজকের শান্ত সূচি',
    routineHeaderSub: 'ওষুধ, খাবার ও বিশ্রামের সহজ তালিকা।',
    readRoutineButton: 'রুটিন পড়ে শোনাও',
    readRoutineAloud: 'রুটিন পড়ে শোনাও',
    addReminderButton: 'নতুন রিমাইন্ডার যোগ করুন',
    completedTasksCount: 'টি কাজ সম্পন্ন হয়েছে',
    markCompleted: 'সম্পন্ন করুন',
    markedDone: 'হয়েছে',
    pillAlert: 'ওষুধের সময়',
    medication: 'ওষুধ',
    meal: 'খাবার',
    hydration: 'জল / চা',
    exercise: 'হাঁটাহাঁটি',
    rest: 'বিশ্রাম',

    memoryBookTitle: 'আপনার প্রিয় পরিবার ও সুখস্মৃতির বই',
    memoryBookSubtitle: 'এঁরা আপনার আপনজন, যাঁরা আপনাকে ভীষণ ভালোবাসেন। গল্প শুনতে যেকোনো সময় স্পর্শ করুন।',
    memoryBookSub: 'এঁরা আপনার আপনজন, যাঁরা আপনাকে সবসময় ভালোবাসেন ও যত্ন নেন।',
    addMemoryButton: 'স্মৃতির বইয়ে যুক্ত করুন',
    listenStoryButton: 'স্মৃতির গল্প শুনুন',
    callFamily: 'ফোন করুন',
    readStoryAloud: 'গল্প শুনুন',
    callLovedOne: 'ফোন করুন',
    keyMemoryLabel: 'স্মৃতির কথা',
    residenceLabel: 'বর্তমান ঠিকানা',

    companionTitle: 'সাথী বন্ধু',
    companionSubtitle: 'আপনার নিজের ভাষায় কথা বলার এক শান্ত ও মমতাময়ী সহচরী।',
    companionSub: 'সবসময় আপনার কথা শুনতে ও পাশে থাকতে প্রস্তুত এক ধৈর্যশীল বন্ধু।',
    companionWelcome: 'নমস্কার শান্তি দেবী। আমি আপনার সাথী। আপনি নিজের ঘরে সম্পূর্ণ নিরাপদে আছেন। আজ আপনার মন কেমন লাগছে?',
    companionTagline: 'মমতাময়ী কণ্ঠ ও মানসিক সান্ত্বনা',
    companionStatusOnline: 'সবসময় আপনার পাশে আছি',
    companionOnlineBadge: 'সবসময় আপনার পাশে',
    companionInputPlaceholder: 'কিছু লিখুন অথবা মাইকে চাপ দিয়ে কথা বলুন...',
    companionSendButton: 'পাঠান',
    sendMessageButton: 'বার্তা পাঠান',
    speakMessageButton: 'মুখে বলুন',
    companionListening: 'মন দিয়ে শুনছি...',
    companionSuggestedPromptsTitle: 'কথা বলার জন্য স্পর্শ করুন:',
    promptWhereAmI: 'আমি এখন কোথায় আছি?',
    promptWhatDay: 'আজ কী বার বা তারিখ?',
    promptTellStory: 'আমাকে একটি শান্ত সুন্দর গল্প শোনাও',
    promptFeelingUneasy: 'আমার মনটা একটু অস্থির লাগছে',
  },

  hi: {
    appName: 'मेमरियम',
    appNameAssamese: 'মেমৰিয়াম',
    appSubtitle: 'MEMORY COMPANION',
    appTagline: 'स्मृति देखभाल एवं मानसिक स्वास्थ्य',
    badgeSih: 'मेडटेक SIH26003',
    safeAtHome: 'आप अपने घर में पूर्णतः सुरक्षित हैं',
    morning: 'सुबह',
    afternoon: 'दोपहर',
    evening: 'शाम',
    night: 'रात',
    emergencySos: 'आपातकालीन / परिवार को कॉल',
    emergencySubtitle: 'परिवार या डॉक्टर से तुरंत बात करने के लिए हरे बटन को दबाएं।',
    emergencyModalTitle: 'आपातकालीन सहायता एवं संपर्क',
    emergencyModalSubtitle: 'आप सुरक्षित हैं। सहायता केवल एक स्पर्श की दूरी पर है।',
    emergencyClose: 'बंद कर सुरक्षित वापस जाएँ',
    emergencyCall: 'अभी कॉल करें',
    caregiverAssistance: 'देखभालकर्ता सहायता',
    primaryCaregiver: 'मुख्य देखभालकर्ता',
    doctorClinic: 'डॉक्टर एवं क्लिनिक',
    ambulanceService: 'आपातकालीन एम्बुलेंस (108)',
    textSizeLarge: 'अक्षर: बड़े (A)',
    textSizeExtraLarge: 'अक्षर: बहुत बड़े (A+)',
    daylightMode: 'दिन का प्रकाश',
    highContrast: 'उच्च कंट्रास्ट (स्पष्ट)',
    soundOn: 'ध्वनि चालू',
    soundMuted: 'ध्वनि बंद',
    languageSelect: 'भाषा',
    handsFreeVoiceAssistant: 'बिना छुए बोलकर निर्देश',

    navDashboard: 'मुख्य डैशबोर्ड',
    navDashboardSub: 'एक नज़र में सब',
    backToDashboard: 'डैशबोर्ड पर लौटें',
    navRoutine: 'दैनिक दिनचर्या',
    navRoutineSub: 'दवा व भोजन',
    navGames: 'दिमागी व्यायाम',
    navGamesSub: 'सहज मानसिक अभ्यास',
    navMemory: 'परिवार व डॉक्टर',
    navMemorySub: 'तस्वीरें व संपर्क',
    navCompanion: 'साथी मित्र',
    navCompanionSub: 'आवाज़ साथी',

    cardBrainExercisesTitle: 'दिमागी व्यायाम',
    cardBrainExercisesSub: 'पत्ते मिलाना, मधुर घंटियाँ और दैनिक क्रम - बिना किसी हड़बड़ी या स्कोर के दबाव के।',
    cardBrainExercisesBadge: '4 सहज खेल',
    cardRoutineTitle: 'दैनिक दिनचर्या',
    cardRoutineSub: 'सुबह की चाय, बीपी की दवा और टहलने की सहज समय-सारिणी।',
    cardRoutineBadge: 'आज की दिनचर्या',
    cardFamilyTitle: 'परिवार व डॉक्टर',
    cardFamilySub: 'परिवार की प्यारी तस्वीरें, सुखद यादें और एक स्पर्श में सीधा फोन कॉल।',
    cardFamilyBadge: 'अपने लोग',
    cardEmergencyTitle: 'आपातकालीन सहायता (SOS)',
    cardEmergencySub: 'मुख्य देखभालकर्ता, परिवार या डॉक्टर से तुरंत बात करने के लिए स्पर्श करें।',
    cardEmergencyBadge: 'घर में सुरक्षित',
    cardInspirationTitle: 'दैनिक प्रेरणा एवं मानसिक शांति',
    cardInspirationQuote: '“प्रत्येक क्षण एक नई शुरुआत है। गहरी व शांत सांस लें, आप अपने प्रियजनों के स्नेह के बीच सुरक्षित हैं।”',
    cardInspirationAuthor: 'मन की शांति का विचार',
    cardInspirationAction: 'साथी से बात करें',
    listenInspiration: 'विचार सुनें',

    voicePromptPlaceholder: 'माइक दबाकर कहें: "खेल दिखाओ", "दिनचर्या पढ़ो", "तस्वीरें दिखाओ"',
    voiceListening: 'आपकी आवाज़ सुनी जा रही है...',
    voiceListeningSub: 'हिंदी, असमिया, बांग्ला या अंग्रेज़ी में बोलें',
    voiceProcessing: 'निर्देश समझा जा रहा है...',
    voiceStopListening: 'सुनना बंद करें',
    voiceStartListening: 'बोलकर बताएं',
    quickCommandsTitle: 'बोलें अथवा टैप करें:',
    cmdShowGames: 'दिमागी खेल खेलें',
    cmdReadRoutine: 'मेरी दिनचर्या',
    cmdOpenPhotos: 'परिवार की तस्वीरें',
    cmdTalkSaathi: 'साथी से बात करें',
    cmdEmergency: 'सहायता मांगें',

    gamesTitle: 'सहज एवं शांत दिमागी खेल',
    gamesIntroSubtitle: 'बिना किसी अंक या समय की हड़बड़ी के स्मृति और एकाग्रता को तरोताज़ा रखने वाले सुखद खेल।',
    gamesNoScoreNotice: 'कोई समय सीमा नहीं, सिर्फ सुखद आनंद',
    gentleMindStimulation: 'सहज मानसिक स्फूर्ति',
    gamesHeaderTitle: 'सहज एवं शांत दिमागी खेल',
    gamesHeaderSub: 'मन की शांति और स्मृति को सक्रिय रखने हेतु विशेष रूप से निर्मित।',
    readAboutGames: 'खेलों के बारे में सुनें',
    difficultyGentle: 'सहज',
    gameDifficultyGentle: 'अत्यंत सहज व शांत',
    gameDifficultyVeryGentle: 'बहुत सहज',
    playGameButton: 'खेल शुरू करें',
    backToGames: 'खेलों की सूची पर लौटें',
    restartGame: 'पुनः आरंभ करें',
    needHint: 'मदद चाहिए?',
    revealCardsPeek: 'पत्ते देखें (3 सेकंड)',
    wellDone: 'बहुत ही सुंदर!',
    completedGameMessage: 'आपने बहुत ही आनंदपूर्वक खेल पूरा किया! आपका मस्तिष्क सक्रिय और प्रफुल्लित है।',
    playAgain: 'फिर से खेलें',
    hintsRemaining: 'मदद शेष',
    level: 'स्तर',
    level1: 'सरल',
    level2: 'कठिन',
    level3: 'मध्यम',
    easy: 'सरल',
    hard: 'कठिन',
    intermediate: 'मध्यम',
    infiniteLevels: 'अनंत स्तर',
    difficulty: 'कठिनाई',
    levelGentle: 'सहज',
    levelStandard: 'सामान्य',
    levelAdvanced: 'चुनौती',
    nextLevel: 'अगला स्तर',
    allLevelsCompleted: 'स्तर पूरा हुआ!',
    selectLevel: 'कठिनाई चुनें',

    memoryGameTitle: 'स्मृति पत्ते मिलाएँ',
    memoryGameSubtitle: 'सुंदर फूलों और प्रतीकों की जोड़ियाँ खोजें',
    memoryGameDesc: 'दो-दो पत्ते पलटकर कमल, गेंदा या दीये की सुंदर जोड़ियाँ पहचानें।',
    memoryGameBenefit: 'दृष्टि और तात्कालिक स्मृति को पुष्ट करता है',
    memoryGameTagline: 'दृष्टि और स्मृति स्फूर्ति',
    memoryPairsFound: 'जोड़ियाँ मिल गईं',
    memoryInstruction: 'किसी भी पत्ते को छुएं, फिर उसके जैसे दिखने वाले पत्ते को खोजें।',

    ballSortTitle: 'शांत बॉल सॉर्ट पहेली',
    ballSortSubtitle: 'एक ही रंग की गेंदों को एक ही शीशी में व्यवस्थित करें',
    ballSortDesc: 'किसी शीशी को छूकर ऊपर वाली गेंद उठाएं और दूसरी शीशी में डालें। बिना किसी जल्दबाजी के सभी रंगों को सही क्रम में सजाएं।',
    ballSortBenefit: 'तार्किक योजना, वर्गीकरण और शांत एकाग्रता को मजबूत करता है',
    ballSortTagline: 'रंग छँटाई एवं तार्किक संतुलन',
    ballSortInstruction: 'शीशी को छूकर गेंद उठाएं और दूसरी शीशी में रखकर रंग मिलाएं।',
    undoMove: 'पिछली चाल वापस लें',

    snakeGameTitle: 'बगीचे का नन्हा तितली-मित्र',
    snakeGameSubtitle: 'सुहावने बगीचे में ताज़े फूल चुनने का शांत खेल',
    snakeGameDesc: 'धीमी और शांत गति से अपने बगीचे के मित्र को सुंदर फूल चुनने में मदद करें। बिना किसी हड़बड़ी के शांति से खेलें।',
    snakeGameBenefit: 'हाथ-आँख का सामंजस्य और सहज ध्यान प्रवाह बढ़ाता है',
    snakeGameTagline: 'सहज गति एवं दृष्टि संतुलन',
    snakeInstruction: 'तीर के बड़े बटनों से अपने मित्र को फूलों तक पहुँचाएं।',
    flowersCollected: 'फूल एकत्र हुए',

    colorGameTitle: 'रंग व प्राकृतिक आकार मिलान',
    colorGameDesc: 'चाय बागान के हरे, गेंदे के सुनहरे और आकाश के नीले रंगों से आकारों को पहचानें।',
    colorGameBenefit: 'रंग व आकार पहचानने की क्षमता सक्रिय रखता है',
    colorGameTagline: 'रंग व आकार पहचान',
    colorShapeTitle: 'रंग व प्राकृतिक आकार मिलान',
    colorShapeSubtitle: 'चाय बागान के हरे व गेंदे के सुनहरे रंग मिलाएँ',
    colorShapeTagline: 'रंग व आकार पहचान',
    colorShapeInstruction: 'पूछे गए रंग अथवा आकार पर स्पर्श करें।',
    colorInstruction: 'पूछे गए रंग अथवा आकार पर स्पर्श करें।',
    findTargetPrompt: 'कृपया इसे खोजें:',

    routineTitle: 'शुभ दिन, शांति जी। यह आपकी आज की दिनचर्या है।',
    routineSubtitle: 'आराम से समय लें। प्रत्येक कार्य आपके दिन को स्वस्थ और सहज बनाए रखेगा।',
    routineHeaderTitle: 'आज की सहज दिनचर्या',
    routineHeaderSub: 'दवा, भोजन और विश्राम की सरल तालिका।',
    readRoutineButton: 'दिनचर्या पढ़कर सुनाएं',
    readRoutineAloud: 'दिनचर्या पढ़कर सुनाएं',
    addReminderButton: 'नया रिमाइंडर जोड़ें',
    completedTasksCount: 'कार्य पूरे हो चुके हैं',
    markCompleted: 'पूर्ण करें',
    markedDone: 'पूर्ण हुआ',
    pillAlert: 'दवा का समय',
    medication: 'दवा',
    meal: 'भोजन',
    hydration: 'पानी / चाय',
    exercise: 'सैर / टहलना',
    rest: 'विश्राम',

    memoryBookTitle: 'आपका प्रिय परिवार और मधुर स्मृतियाँ',
    memoryBookSubtitle: 'ये आपके अपने हैं जो आपसे बहुत प्रेम करते हैं। इनकी प्यारी कहानी सुनने के लिए कभी भी टैप करें।',
    memoryBookSub: 'ये आपके अपने हैं जो आपसे सदैव अगाध प्रेम व देखभाल करते हैं।',
    addMemoryButton: 'स्मृति पुस्तक में जोड़ें',
    listenStoryButton: 'स्मृति की कहानी सुनें',
    callFamily: 'फ़ोन करें',
    readStoryAloud: 'कहानी सुनें',
    callLovedOne: 'फ़ोन करें',
    keyMemoryLabel: 'अनमोल स्मृति',
    residenceLabel: 'वर्तमान पता',

    companionTitle: 'साथी मित्र',
    companionSubtitle: 'आपकी अपनी भाषा में बात करने वाला एक शांत व स्नेही मित्र।',
    companionSub: 'हमेशा आपकी बात सुनने और मन को सांत्वना देने वाला धैर्यवान साथी।',
    companionWelcome: 'नमस्ते शांति जी। मैं आपका साथी हूँ। आप अपने घर में पूर्णतः सुरक्षित हैं। आज आपका मन कैसा है?',
    companionTagline: 'स्नेहमयी आवाज़ व मानसिक सांत्वना',
    companionStatusOnline: 'सदा आपकी सेवा में उपस्थित',
    companionOnlineBadge: 'सदा आपके साथ',
    companionInputPlaceholder: 'कुछ लिखें अथवा माइक दबाकर बोलें...',
    companionSendButton: 'भेजें',
    sendMessageButton: 'संदेश भेजें',
    speakMessageButton: 'बोलकर बताएं',
    companionListening: 'ध्यानपूर्वक सुन रहा हूँ...',
    companionSuggestedPromptsTitle: 'बातचीत के लिए स्पर्श करें:',
    promptWhereAmI: 'मैं अभी कहाँ हूँ?',
    promptWhatDay: 'आज कौन सा दिन या तारीख है?',
    promptTellStory: 'मुझे एक मधुर और शांत कहानी सुनाओ',
    promptFeelingUneasy: 'मुझे आज थोड़ा अकेलापन लग रहा है',
  },
};

export const LANGUAGE_OPTIONS: { code: Language; label: string; nativeLabel: string; flag: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🌐' },
  { code: 'as', label: 'Assamese', nativeLabel: 'অসমীয়া', flag: '🌺' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', flag: '🪷' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
];

export const getTranslation = (language: Language): TranslationDictionary => {
  return TRANSLATIONS[language] || TRANSLATIONS.en;
};
