// 100 short authentic azkar/duas — Arabic (with diacritics), English translation, and source.
// Sourced from the Qur'an and authentic hadith collections (Bukhari, Muslim, Abu Dawud,
// Tirmidhi, an-Nasa'i, Ibn Majah) — the same corpus compiled in "Hisn al-Muslim".
// Rotated one per day in the kiosk UI (see app.js: renderDuaOfDay).
const AZKAR = [
  {
    arabic: "سُبْحَانَ اللَّهِ",
    english: "Glory be to Allah.",
    reference: "Sahih Muslim 2691"
  },
  {
    arabic: "الْحَمْدُ لِلَّهِ",
    english: "All praise is due to Allah.",
    reference: "Sahih Muslim 2691"
  },
  {
    arabic: "اللَّهُ أَكْبَرُ",
    english: "Allah is the Greatest.",
    reference: "Sahih Muslim 2691"
  },
  {
    arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ",
    english: "There is no god but Allah.",
    reference: "Sahih al-Bukhari 6407"
  },
  {
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    english: "Glory be to Allah and praise be to Him.",
    reference: "Sahih al-Bukhari 6405"
  },
  {
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    english: "There is no power and no strength except with Allah.",
    reference: "Sahih al-Bukhari 6384"
  },
  {
    arabic: "أَسْتَغْفِرُ اللَّهَ",
    english: "I seek Allah's forgiveness.",
    reference: "Sahih Muslim 2702"
  },
  {
    arabic: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ",
    english: "Glory be to Allah, praise be to Allah, there is no god but Allah, and Allah is the Greatest.",
    reference: "Sahih Muslim 2695"
  },
  {
    arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    english: "There is no god but Allah alone, with no partner. His is the dominion and His is the praise, and He is able to do all things.",
    reference: "Sahih al-Bukhari 3293"
  },
  {
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    english: "O Allah, You are my Lord, there is no god but You. You created me and I am Your servant, and I am faithful to Your covenant and promise as much as I am able. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me, and I acknowledge my sin, so forgive me, for none forgives sins but You.",
    reference: "Sayyid al-Istighfar — Sahih al-Bukhari 6306"
  },
  {
    arabic: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
    english: "My Lord, forgive me and accept my repentance, for You are the Ever-Relenting, the Merciful.",
    reference: "Sunan Abu Dawud 1516"
  },
  {
    arabic: "اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ",
    english: "O Allah, forgive me all my sins, the small and the great, the first and the last, the open and the secret.",
    reference: "Sahih Muslim 483"
  },
  {
    arabic: "أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ",
    english: "I seek the forgiveness of Allah, besides whom there is no god, the Living, the Sustainer, and I turn to Him in repentance.",
    reference: "Sunan Abu Dawud 1517"
  },
  {
    arabic: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ",
    english: "O Allah, send blessings upon Muhammad and upon the family of Muhammad.",
    reference: "Sahih al-Bukhari 3370"
  },
  {
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
    english: "We have entered the morning and with it all dominion belongs to Allah, and praise is to Allah. There is no god but Allah alone, with no partner.",
    reference: "Morning dhikr — Sahih Muslim 2723"
  },
  {
    arabic: "أَمْسَيْنَا وَأَمْسَىٰ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
    english: "We have entered the evening and with it all dominion belongs to Allah, and praise is to Allah. There is no god but Allah alone, with no partner.",
    reference: "Evening dhikr — Sahih Muslim 2723"
  },
  {
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    english: "O Allah, by You we enter the morning, by You we enter the evening, by You we live, by You we die, and to You is the resurrection.",
    reference: "Jami' at-Tirmidhi 3391"
  },
  {
    arabic: "حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    english: "Allah is sufficient for me. There is no god but Him. Upon Him I rely, and He is the Lord of the Magnificent Throne.",
    reference: "Sunan Abu Dawud 5081; Qur'an 9:129"
  },
  {
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    english: "In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
    reference: "Sunan Abu Dawud 5088"
  },
  {
    arabic: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا",
    english: "I am pleased with Allah as my Lord, Islam as my religion, and Muhammad, peace and blessings be upon him, as my prophet.",
    reference: "Sunan Abu Dawud 5072"
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
    english: "O Allah, I ask You for well-being in this world and the Hereafter.",
    reference: "Sunan Ibn Majah 3871"
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي",
    english: "O Allah, I ask You for pardon and well-being in my religion, my worldly affairs, my family, and my wealth.",
    reference: "Sunan Abu Dawud 5074"
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ",
    english: "O Allah, I seek refuge in You from anxiety and grief, from helplessness and laziness, from cowardice and stinginess.",
    reference: "Sahih al-Bukhari 6369"
  },
  {
    arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي",
    english: "O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight.",
    reference: "Sunan Abu Dawud 5090"
  },
  {
    arabic: "لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    english: "There is no god but You, glory be to You; indeed I have been among the wrongdoers.",
    reference: "Du'a of Yunus — Qur'an 21:87"
  },
  {
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    english: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
    reference: "Qur'an 2:201"
  },
  {
    arabic: "رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا",
    english: "Our Lord, do not hold us accountable if we forget or make a mistake.",
    reference: "Qur'an 2:286"
  },
  {
    arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ",
    english: "Our Lord, let not our hearts deviate after You have guided us, and grant us mercy from Yourself; indeed, You are the Bestower.",
    reference: "Qur'an 3:8"
  },
  {
    arabic: "رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    english: "Our Lord, forgive us our sins and our transgressions, make firm our feet, and grant us victory over the disbelieving people.",
    reference: "Qur'an 3:147"
  },
  {
    arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
    english: "My Lord, expand for me my chest and ease for me my task.",
    reference: "Du'a of Musa — Qur'an 20:25-26"
  },
  {
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    english: "My Lord, increase me in knowledge.",
    reference: "Qur'an 20:114"
  },
  {
    arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ",
    english: "My Lord, make me an establisher of prayer, and my descendants as well; our Lord, and accept my supplication.",
    reference: "Qur'an 14:40"
  },
  {
    arabic: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
    english: "My Lord, forgive me and my parents and the believers on the Day the reckoning is established.",
    reference: "Qur'an 14:41"
  },
  {
    arabic: "رَبِّ هَبْ لِي مِنَ الصَّالِحِينَ",
    english: "My Lord, grant me from among the righteous.",
    reference: "Qur'an 37:100"
  },
  {
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    english: "Allah is sufficient for us, and He is the best disposer of affairs.",
    reference: "Qur'an 3:173"
  },
  {
    arabic: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
    english: "Indeed we belong to Allah, and indeed to Him we will return.",
    reference: "Qur'an 2:156"
  },
  {
    arabic: "بِسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    english: "In Your name, O Allah, I die and I live.",
    reference: "Du'a before sleeping — Sahih al-Bukhari 6324"
  },
  {
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    english: "All praise is due to Allah who gave us life after having taken it from us, and unto Him is the resurrection.",
    reference: "Du'a upon waking — Sahih al-Bukhari 6312"
  },
  {
    arabic: "اللَّهُمَّ بِاسْمِكَ أَحْيَا وَأَمُوتُ",
    english: "O Allah, in Your name I live and die.",
    reference: "Du'a upon waking — Sahih al-Bukhari 6314"
  },
  {
    arabic: "بِاسْمِ اللَّهِ وَضَعْتُ جَنْبِي، اللَّهُمَّ اغْفِرْ لِي ذَنْبِي",
    english: "In the name of Allah I lay down my side. O Allah, forgive me my sin.",
    reference: "Jami' at-Tirmidhi 3398"
  },
  {
    arabic: "بِسْمِ اللَّهِ",
    english: "In the name of Allah.",
    reference: "Said before eating — Sunan Abu Dawud 3767"
  },
  {
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَٰذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    english: "All praise is due to Allah who fed me this and provided it for me without any might or power on my part.",
    reference: "Jami' at-Tirmidhi 3458"
  },
  {
    arabic: "الْحَمْدُ لِلَّهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ غَيْرَ مَكْفِيٍّ وَلَا مُوَدَّعٍ وَلَا مُسْتَغْنًى عَنْهُ رَبَّنَا",
    english: "Praise be to Allah, abundant, good, and blessed praise, which is not sufficiently thanked for, nor abandoned, nor can we do without, our Lord.",
    reference: "After eating — Sahih al-Bukhari 5458"
  },
  {
    arabic: "بِسْمِ اللَّهِ، اللَّهُمَّ جَنِّبْنَا الشَّيْطَانَ وَجَنِّبِ الشَّيْطَانَ مَا رَزَقْتَنَا",
    english: "In the name of Allah. O Allah, keep us away from Satan, and keep Satan away from what You have provided us.",
    reference: "Before marital relations — Sahih al-Bukhari 141"
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
    english: "O Allah, I seek refuge in You from male and female devils.",
    reference: "Entering the bathroom — Sahih al-Bukhari 142"
  },
  {
    arabic: "غُفْرَانَكَ",
    english: "I seek Your forgiveness.",
    reference: "Leaving the bathroom — Sunan Abu Dawud 30"
  },
  {
    arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    english: "In the name of Allah, I place my trust in Allah, and there is no power and no strength except with Allah.",
    reference: "Leaving the house — Sunan Abu Dawud 5095"
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أَضِلَّ أَوْ أُضَلَّ، أَوْ أَزِلَّ أَوْ أُزَلَّ، أَوْ أَظْلِمَ أَوْ أُظْلَمَ، أَوْ أَجْهَلَ أَوْ يُجْهَلَ عَلَيَّ",
    english: "O Allah, I seek refuge in You lest I stray or be led astray, slip or be caused to slip, oppress or be oppressed, or behave foolishly or be treated foolishly.",
    reference: "Leaving the house — Sunan Abu Dawud 5094"
  },
  {
    arabic: "بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
    english: "In the name of Allah we enter, and in the name of Allah we leave, and upon Allah our Lord we rely.",
    reference: "Entering the house — Sunan Abu Dawud 5096"
  },
  {
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    english: "O Allah, open for me the doors of Your mercy.",
    reference: "Entering the masjid — Sahih Muslim 713"
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    english: "O Allah, I ask You from Your bounty.",
    reference: "Leaving the masjid — Sahih Muslim 713"
  },
  {
    arabic: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، رَضِيتُ بِاللَّهِ رَبًّا وَبِمُحَمَّدٍ رَسُولًا وَبِالْإِسْلَامِ دِينًا",
    english: "I bear witness that there is no god but Allah alone, with no partner, and that Muhammad is His servant and messenger. I am pleased with Allah as Lord, Muhammad as messenger, and Islam as religion.",
    reference: "After the adhan — Sahih Muslim 386"
  },
  {
    arabic: "اللَّهُمَّ رَبَّ هَٰذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ",
    english: "O Allah, Lord of this perfect call and established prayer, grant Muhammad the intercession and favor, and raise him to the praiseworthy station You have promised him.",
    reference: "After the adhan — Sahih al-Bukhari 614"
  },
  {
    arabic: "اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ، اشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا",
    english: "O Allah, Lord of mankind, remove the affliction and heal, for You are the Healer. There is no healing but Your healing, a healing that leaves no illness.",
    reference: "For the sick — Sahih al-Bukhari 5675"
  },
  {
    arabic: "لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهُ",
    english: "No harm, may it be a purification, if Allah wills.",
    reference: "Consoling the sick — Sahih al-Bukhari 3616"
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْجُبْنِ، وَأَعُوذُ بِكَ أَنْ أُرَدَّ إِلَىٰ أَرْذَلِ الْعُمُرِ، وَأَعُوذُ بِكَ مِنْ فِتْنَةِ الدُّنْيَا، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ",
    english: "O Allah, I seek refuge in You from cowardice, from being reduced to a feeble old age, from the trials of this world, and from the punishment of the grave.",
    reference: "Sahih al-Bukhari 2822"
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ",
    english: "O Allah, I seek refuge in You from the punishment of Hell, from the punishment of the grave, from the trials of life and death, and from the evil of the trial of the False Messiah.",
    reference: "Sahih al-Bukhari 1377"
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْمَأْثَمِ وَالْمَغْرَمِ",
    english: "O Allah, I seek refuge in You from sin and from debt.",
    reference: "Sahih al-Bukhari 832"
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِرِضَاكَ مِنْ سَخَطِكَ، وَبِمُعَافَاتِكَ مِنْ عُقُوبَتِكَ، وَأَعُوذُ بِكَ مِنْكَ",
    english: "O Allah, I seek refuge in Your pleasure from Your anger, and in Your pardon from Your punishment, and I seek refuge in You from You.",
    reference: "Sahih Muslim 486"
  },
  {
    arabic: "اللَّهُمَّ مُصَرِّفَ الْقُلُوبِ صَرِّفْ قُلُوبَنَا عَلَىٰ طَاعَتِكَ",
    english: "O Allah, Turner of hearts, turn our hearts toward Your obedience.",
    reference: "Sahih Muslim 2654"
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَىٰ وَالتُّقَىٰ وَالْعَفَافَ وَالْغِنَىٰ",
    english: "O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.",
    reference: "Sahih Muslim 2721"
  },
  {
    arabic: "اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي",
    english: "O Allah, guide me and make me steadfast.",
    reference: "Sahih Muslim 2725"
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ حُبَّكَ وَحُبَّ مَنْ يُحِبُّكَ وَالْعَمَلَ الَّذِي يُبَلِّغُنِي حُبَّكَ",
    english: "O Allah, I ask You for Your love, the love of those who love You, and deeds that will bring me closer to Your love.",
    reference: "Jami' at-Tirmidhi 3235"
  },
  {
    arabic: "اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ نُورُ السَّمَاوَاتِ وَالْأَرْضِ وَمَنْ فِيهِنَّ، وَلَكَ الْحَمْدُ أَنْتَ قَيِّمُ السَّمَاوَاتِ وَالْأَرْضِ وَمَنْ فِيهِنَّ",
    english: "O Allah, to You belongs all praise; You are the Light of the heavens and the earth and all within them, and to You belongs all praise; You are the Sustainer of the heavens and the earth and all within them.",
    reference: "Night prayer du'a — Sahih al-Bukhari 1120"
  },
  {
    arabic: "اللَّهُمَّ لَكَ أَسْلَمْتُ، وَبِكَ آمَنْتُ، وَعَلَيْكَ تَوَكَّلْتُ، وَإِلَيْكَ أَنَبْتُ، وَبِكَ خَاصَمْتُ",
    english: "O Allah, unto You I have submitted, in You I have believed, upon You I have relied, unto You I have turned in repentance, and by You I contend.",
    reference: "Sahih al-Bukhari 1120"
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنَ الْخَيْرِ كُلِّهِ عَاجِلِهِ وَآجِلِهِ، وَأَعُوذُ بِكَ مِنَ الشَّرِّ كُلِّهِ عَاجِلِهِ وَآجِلِهِ",
    english: "O Allah, I ask You for all good, near and far, and I seek refuge in You from all evil, near and far.",
    reference: "Sunan Ibn Majah 3846"
  },
  {
    arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَٰهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَٰهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ",
    english: "There is no god but Allah, the Magnificent, the Forbearing. There is no god but Allah, Lord of the Magnificent Throne. There is no god but Allah, Lord of the heavens, Lord of the earth, and Lord of the Noble Throne.",
    reference: "Du'a for distress — Sahih al-Bukhari 6346"
  },
  {
    arabic: "اللَّهُمَّ رَحْمَتَكَ أَرْجُو، فَلَا تَكِلْنِي إِلَىٰ نَفْسِي طَرْفَةَ عَيْنٍ، وَأَصْلِحْ لِي شَأْنِي كُلَّهُ، لَا إِلَٰهَ إِلَّا أَنْتَ",
    english: "O Allah, it is Your mercy I hope for; so do not leave me to myself even for the blink of an eye, and correct all my affairs. There is no god but You.",
    reference: "Sunan Abu Dawud 5090"
  },
  {
    arabic: "اللَّهُمَّ إِنِّي عَبْدُكَ ابْنُ عَبْدِكَ ابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ",
    english: "O Allah, I am Your servant, son of Your male servant, son of Your female servant. My forelock is in Your hand, Your judgment upon me prevails, and Your decree over me is just.",
    reference: "Musnad Ahmad 3712"
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ، سَمَّيْتَ بِهِ نَفْسَكَ، أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ، أَوْ عَلَّمْتَهُ أَحَدًا مِنْ خَلْقِكَ، أَوِ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِنْدَكَ",
    english: "O Allah, I ask You by every name belonging to You, by which You have named Yourself, or revealed in Your Book, or taught to any of Your creation, or kept unto Yourself in the knowledge of the unseen.",
    reference: "Musnad Ahmad 3712"
  },
  {
    arabic: "اللَّهُمَّ اغْفِرْ لِي، وَارْحَمْنِي، وَاهْدِنِي، وَعَافِنِي، وَارْزُقْنِي",
    english: "O Allah, forgive me, have mercy on me, guide me, grant me well-being, and provide for me.",
    reference: "Sahih Muslim 2697"
  },
  {
    arabic: "اللَّهُمَّ أَعِنِّي عَلَىٰ ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
    english: "O Allah, help me to remember You, to thank You, and to worship You in the best manner.",
    reference: "Sunan Abu Dawud 1522"
  },
  {
    arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    english: "O Allah, You are Pardoning and love pardon, so pardon me.",
    reference: "Du'a for Laylat al-Qadr — Jami' at-Tirmidhi 3513"
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الثَّبَاتَ فِي الْأَمْرِ، وَالْعَزِيمَةَ عَلَى الرُّشْدِ",
    english: "O Allah, I ask You for steadfastness in my affairs and for resolve upon right guidance.",
    reference: "Jami' at-Tirmidhi 3407"
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ قَلْبًا سَلِيمًا، وَلِسَانًا صَادِقًا",
    english: "O Allah, I ask You for a sound heart and a truthful tongue.",
    reference: "Jami' at-Tirmidhi 3407"
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عِلْمٍ لَا يَنْفَعُ، وَمِنْ قَلْبٍ لَا يَخْشَعُ، وَمِنْ نَفْسٍ لَا تَشْبَعُ، وَمِنْ دَعْوَةٍ لَا يُسْتَجَابُ لَهَا",
    english: "O Allah, I seek refuge in You from knowledge that does not benefit, a heart that does not fear You, a soul that is not satisfied, and a supplication that is not answered.",
    reference: "Sahih Muslim 2722"
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ",
    english: "O Allah, I ask You for Paradise, and I seek refuge in You from the Fire.",
    reference: "Sunan Abu Dawud 792"
  },
  {
    arabic: "اللَّهُمَّ أَصْلِحْ لِي دِينِيَ الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي",
    english: "O Allah, set right for me my religion, which is the safeguard of my affairs, and set right for me my worldly life in which is my livelihood.",
    reference: "Sahih Muslim 2720"
  },
  {
    arabic: "اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ",
    english: "O Allah, Knower of the unseen and the witnessed, Creator of the heavens and the earth, Lord and Sovereign of all things.",
    reference: "Sunan Abu Dawud 1509"
  },
  {
    arabic: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ",
    english: "I bear witness that there is no god but You; I seek refuge in You from the evil of my soul and from the evil and associative sin of Satan.",
    reference: "Sunan Abu Dawud 1509"
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ تَمَامَ الْعَافِيَةِ",
    english: "O Allah, I ask You for complete well-being.",
    reference: "Sunan Ibn Majah 3849"
  },
  {
    arabic: "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا",
    english: "O Allah, nothing is easy except what You make easy, and You make the difficult, if You wish, easy.",
    reference: "Ibn Hibban; also attributed to Ibn al-Sunni"
  },
  {
    arabic: "اللَّهُمَّ لَكَ الْحَمْدُ حَمْدًا يُوَافِي نِعَمَهُ، وَيُكَافِئُ مَزِيدَهُ",
    english: "O Allah, to You is praise, praise that matches Your favors and warrants their increase.",
    reference: "Sahih Muslim 476"
  },
  {
    arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
    english: "Glory be to my Lord, the Magnificent.",
    reference: "Said in ruku' during prayer — Sunan Abu Dawud 871"
  },
  {
    arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَىٰ",
    english: "Glory be to my Lord, the Most High.",
    reference: "Said in sujud during prayer — Sunan Abu Dawud 871"
  },
  {
    arabic: "رَبَّنَا وَلَكَ الْحَمْدُ",
    english: "Our Lord, to You is all praise.",
    reference: "Said rising from ruku' — Sahih al-Bukhari 796"
  },
  {
    arabic: "اللَّهُمَّ اغْفِرْ لِي مَا قَدَّمْتُ وَمَا أَخَّرْتُ، وَمَا أَسْرَرْتُ وَمَا أَعْلَنْتُ، وَمَا أَسْرَفْتُ، وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّي",
    english: "O Allah, forgive me what I have put forward and what I have kept back, what I have concealed and what I have declared, what I have exceeded, and what You know better of than I do.",
    reference: "Sahih Muslim 771"
  },
  {
    arabic: "اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا، وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ وَارْحَمْنِي، إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ",
    english: "O Allah, I have greatly wronged myself, and none forgives sins but You; so grant me forgiveness from You and have mercy on me, for You are the Forgiving, the Merciful.",
    reference: "Opening du'a of prayer — Sahih al-Bukhari 834"
  },
  {
    arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَىٰ جَدُّكَ، وَلَا إِلَٰهَ غَيْرُكَ",
    english: "Glory be to You, O Allah, and praise be to You; blessed is Your name, exalted is Your majesty, and there is no god besides You.",
    reference: "Opening du'a of prayer — Sunan Abu Dawud 775"
  },
  {
    arabic: "اللَّهُمَّ رَبَّ جِبْرِيلَ وَمِيكَائِيلَ وَإِسْرَافِيلَ، فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، عَالِمَ الْغَيْبِ وَالشَّهَادَةِ",
    english: "O Allah, Lord of Jibril, Mika'il, and Israfil, Creator of the heavens and the earth, Knower of the unseen and the witnessed.",
    reference: "Night prayer opening du'a — Sahih Muslim 770"
  },
  {
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    english: "In the name of Allah, the Most Gracious, the Most Merciful.",
    reference: "Qur'an — opening of every surah but one"
  },
  {
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
    english: "Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent.",
    reference: "Surah al-Ikhlas — Qur'an 112"
  },
  {
    arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، مِنْ شَرِّ مَا خَلَقَ",
    english: "Say: I seek refuge in the Lord of daybreak, from the evil of that which He created.",
    reference: "Surah al-Falaq — Qur'an 113 (opening verse)"
  },
  {
    arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ، مَلِكِ النَّاسِ، إِلَٰهِ النَّاسِ",
    english: "Say: I seek refuge in the Lord of mankind, the Sovereign of mankind, the God of mankind.",
    reference: "Surah an-Nas — Qur'an 114 (opening verses)"
  },
  {
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
    english: "Allah — there is no god but Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep.",
    reference: "Ayat al-Kursi — Qur'an 2:255 (opening)"
  },
  {
    arabic: "آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ، كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ",
    english: "The Messenger has believed in what was revealed to him from his Lord, and so have the believers. All of them have believed in Allah, His angels, His books, and His messengers.",
    reference: "Last two verses of Surah al-Baqarah — Qur'an 2:285"
  },
  {
    arabic: "رَبَّنَا آمَنَّا فَاغْفِرْ لَنَا وَارْحَمْنَا وَأَنْتَ خَيْرُ الرَّاحِمِينَ",
    english: "Our Lord, we have believed, so forgive us and have mercy upon us, and You are the best of the merciful.",
    reference: "Qur'an 23:109"
  },
  {
    arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    english: "Our Lord, grant us from among our spouses and offspring comfort to our eyes, and make us leaders for the righteous.",
    reference: "Qur'an 25:74"
  },
  {
    arabic: "رَبَّنَا آتِنَا مِنْ لَدُنْكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا",
    english: "Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.",
    reference: "Du'a of the People of the Cave — Qur'an 18:10"
  },
  {
    arabic: "وَقُلْ رَبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ وَأَعُوذُ بِكَ رَبِّ أَنْ يَحْضُرُونِ",
    english: "And say: My Lord, I seek refuge in You from the incitements of the devils, and I seek refuge in You, my Lord, lest they come near me.",
    reference: "Qur'an 23:97-98"
  }
];
